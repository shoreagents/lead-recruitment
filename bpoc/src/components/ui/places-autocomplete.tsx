'use client'

import { useEffect, useRef, useState } from 'react'
import { Input } from '@/components/ui/input'

type SelectedPlace = {
  description: string
  place_id: string
  lat: number | null
  lng: number | null
  city?: string
  province?: string
  country?: string
  barangay?: string
  region?: string
}

interface PlacesAutocompleteProps {
  value: string
  placeholder?: string
  disabled?: boolean
  onChange: (value: string) => void
  onSelect: (place: SelectedPlace) => void
}

type Suggestion = { place_id: string; description: string }

function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

export function PlacesAutocomplete({ value, placeholder, disabled, onChange, onSelect }: PlacesAutocompleteProps) {
  const [open, setOpen] = useState(false)
  const [predictions, setPredictions] = useState<Suggestion[]>([])
  const [loading, setLoading] = useState(false)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const sessionTokenRef = useRef<string>(uuidv4())

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

  // Fetch predictions via Places (New) HTTP API
  useEffect(() => {
    let cancelled = false
    if (!apiKey) return
    if (!value) {
      setPredictions([])
      setOpen(false)
      return
    }
    setLoading(true)
    const id = setTimeout(async () => {
      try {
        const res = await fetch('https://places.googleapis.com/v1/places:autocomplete', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Goog-Api-Key': apiKey,
            'X-Goog-FieldMask': 'suggestions.placePrediction.placeId,suggestions.placePrediction.text',
          },
          body: JSON.stringify({
            input: value,
            sessionToken: sessionTokenRef.current,
            languageCode: 'en',
            regionCode: 'PH',
            // bias to regions/cities/provinces
            // Include PH cities/provinces/municipalities only
            includedPrimaryTypes: [
              'locality',
              'administrative_area_level_1',
              'administrative_area_level_2',
              'administrative_area_level_3',
              'sublocality'
            ],
            // Hard restrict to PH bounding box (approx)
            locationRestriction: {
              rectangle: {
                low: { latitude: 4.215806, longitude: 116.928337 },
                high: { latitude: 21.321780, longitude: 126.599732 }
              }
            }
          }),
        })
        const data = await res.json()
        if (cancelled) return
        const suggestions: Suggestion[] = (data.suggestions || [])
          .map((s: any) => ({
            place_id: s.placePrediction?.placeId,
            description: s.placePrediction?.text?.text,
          }))
          .filter((s: Suggestion) => s.place_id && s.description)
        setPredictions(suggestions)
        setOpen(suggestions.length > 0)
      } catch {
        setPredictions([])
        setOpen(false)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }, 200)
    return () => {
      cancelled = true
      clearTimeout(id)
    }
  }, [value, apiKey])

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!containerRef.current) return
      if (!containerRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleSelect = async (prediction: Suggestion) => {
    const placeId = prediction.place_id
    const desc = prediction.description
    if (!apiKey) return
    try {
      const res = await fetch(`https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}` +
        `?languageCode=en&regionCode=PH`, {
        headers: {
          'X-Goog-Api-Key': apiKey,
          'X-Goog-FieldMask': 'id,displayName,formattedAddress,location,addressComponents',
        },
      })
      const data = await res.json()
      const comps = data.addressComponents || []
      const get = (type: string) => comps.find((c: any) => (c.types || []).includes(type))?.longText || ''
      const province = get('administrative_area_level_2') || get('administrative_area_level_1')
      const city = get('locality') || get('administrative_area_level_3')
      const country = get('country')
      const barangay = get('sublocality')
      const region = get('administrative_area_level_1')
      onSelect({
        description: desc,
        place_id: placeId,
        lat: data.location?.latitude ?? null,
        lng: data.location?.longitude ?? null,
        city,
        province,
        country,
        barangay,
        region,
      })
      setOpen(false)
    } catch {
      onSelect({ description: desc, place_id: placeId, lat: null, lng: null })
      setOpen(false)
    }
  }

  return (
    <div ref={containerRef} className="relative">
      <Input
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="pl-10 h-10 bg-white/5 border-white/20 text-white placeholder:text-gray-400 focus:ring-0 focus:outline-none focus-visible:ring-0 focus-visible:outline-none"
        aria-autocomplete="list"
        aria-expanded={open}
        role="combobox"
      />
      {open && (
        <div className="absolute z-[99999] mt-1 w-full rounded-md border border-white/20 bg-black/90 text-white shadow-lg backdrop-blur-sm">
          {loading && (
            <div className="px-3 py-2 text-sm text-gray-400">Loading…</div>
          )}
          {!loading && predictions.length === 0 && (
            <div className="px-3 py-2 text-sm text-gray-400">No results</div>
          )}
          <ul className="max-h-60 overflow-auto py-1">
            {predictions.map((p) => (
              <li key={p.place_id}>
                <button
                  type="button"
                  onClick={() => handleSelect(p)}
                  className="w-full px-3 py-2 text-left hover:bg-white/10 text-white"
                >
                  {p.description}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default PlacesAutocomplete


