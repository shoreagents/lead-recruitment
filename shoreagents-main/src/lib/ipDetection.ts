export interface LocationData {
  status: string
  country: string
  countryCode: string
  region: string
  regionName: string
  city: string
  zip: string
  lat: number
  lon: number
  timezone: string
  isp: string
  org: string
  as: string
  query: string
}

export interface CurrencyMapping {
  [countryCode: string]: string
}

// Map country codes to currency codes
const countryToCurrency: CurrencyMapping = {
  'US': 'USD',
  'AU': 'AUD',
  'CA': 'CAD',
  'GB': 'GBP',
  'NZ': 'NZD',
  'PH': 'PHP',
  'DE': 'EUR',
  'FR': 'EUR',
  'IT': 'EUR',
  'ES': 'EUR',
  'NL': 'EUR',
  'BE': 'EUR',
  'AT': 'EUR',
  'IE': 'EUR',
  'FI': 'EUR',
  'PT': 'EUR',
  'GR': 'EUR',
  'CY': 'EUR',
  'MT': 'EUR',
  'SK': 'EUR',
  'SI': 'EUR',
  'EE': 'EUR',
  'LV': 'EUR',
  'LT': 'EUR',
  'LU': 'EUR'
}

export class IPDetectionService {
  private static instance: IPDetectionService
  private cachedLocation: LocationData | null = null
  private lastFetchTime: number = 0
  private readonly CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

  private constructor() {}

  public static getInstance(): IPDetectionService {
    if (!IPDetectionService.instance) {
      IPDetectionService.instance = new IPDetectionService()
    }
    return IPDetectionService.instance
  }

  /**
   * Detect user's location using multiple IP services with fallbacks
   */
  public async detectLocation(): Promise<LocationData | null> {
    try {
      // Check if we have cached data that's still valid
      const now = Date.now()
      if (this.cachedLocation && (now - this.lastFetchTime) < this.CACHE_DURATION) {
        console.log('📍 Using cached location data:', this.cachedLocation)
        return this.cachedLocation
      }

      console.log('🌍 Detecting user location...')
      
      // Try multiple IP detection services in order of preference
      const services = [
        {
          name: 'ipapi.co',
          url: 'https://ipapi.co/json/',
          transform: (data: Record<string, unknown>) => ({
            status: 'success',
            country: data.country_name || 'Unknown',
            countryCode: data.country_code || 'US',
            region: data.region || '',
            regionName: data.region || '',
            city: data.city || '',
            zip: data.postal || '',
            lat: data.latitude || 0,
            lon: data.longitude || 0,
            timezone: data.timezone || 'UTC',
            isp: data.org || '',
            org: data.org || '',
            as: '',
            query: data.ip || ''
          })
        },
        {
          name: 'ipinfo.io',
          url: 'https://ipinfo.io/json',
          transform: (data: Record<string, unknown>) => ({
            status: 'success',
            country: data.country || 'Unknown',
            countryCode: data.country || 'US',
            region: data.region || '',
            regionName: data.region || '',
            city: data.city || '',
            zip: data.postal || '',
            lat: parseFloat((data.loc as string)?.split(',')[0] || '0'),
            lon: parseFloat((data.loc as string)?.split(',')[1] || '0'),
            timezone: data.timezone || 'UTC',
            isp: data.org || '',
            org: data.org || '',
            as: '',
            query: data.ip || ''
          })
        },
        {
          name: 'ip-api.com',
          url: 'https://ip-api.com/json/',
          transform: (data: Record<string, unknown>) => data
        }
      ]

      for (const service of services) {
        try {
          console.log(`🌍 Trying ${service.name}...`)
          
          const response = await fetch(service.url, {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
            },
            // Add timeout to prevent hanging requests
            signal: AbortSignal.timeout(8000) // 8 second timeout
          })

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
          }

          const rawData = await response.json()
          const locationData: LocationData = service.transform(rawData) as LocationData
          
          if (locationData.status === 'success') {
            this.cachedLocation = locationData
            this.lastFetchTime = now
            
            console.log(`📍 Location detected successfully via ${service.name}:`, {
              country: locationData.country,
              city: locationData.city,
              countryCode: locationData.countryCode,
              timezone: locationData.timezone
            })
            
            return locationData
          } else {
            throw new Error(`${service.name} returned error status`)
          }
        } catch (serviceError) {
          console.warn(`❌ ${service.name} failed:`, serviceError)
          // Continue to next service
        }
      }

      // If all services fail, try timezone fallback
      console.warn('❌ All IP detection services failed, trying timezone fallback...')
      
      try {
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
        console.log('🕐 Using browser timezone as fallback:', timezone)
        
        // Simple timezone to country mapping for common cases
        const timezoneToCountry: { [key: string]: string } = {
          'America/New_York': 'US',
          'America/Los_Angeles': 'US',
          'America/Chicago': 'US',
          'America/Denver': 'US',
          'Europe/London': 'GB',
          'Europe/Paris': 'FR',
          'Europe/Berlin': 'DE',
          'Europe/Rome': 'IT',
          'Europe/Madrid': 'ES',
          'Europe/Amsterdam': 'NL',
          'Europe/Brussels': 'BE',
          'Europe/Vienna': 'AT',
          'Europe/Dublin': 'IE',
          'Europe/Helsinki': 'FI',
          'Europe/Lisbon': 'PT',
          'Europe/Athens': 'GR',
          'Europe/Nicosia': 'CY',
          'Europe/Valletta': 'MT',
          'Europe/Bratislava': 'SK',
          'Europe/Ljubljana': 'SI',
          'Europe/Tallinn': 'EE',
          'Europe/Riga': 'LV',
          'Europe/Vilnius': 'LT',
          'Europe/Luxembourg': 'LU',
          'Australia/Sydney': 'AU',
          'Australia/Melbourne': 'AU',
          'Australia/Brisbane': 'AU',
          'Australia/Perth': 'AU',
          'Australia/Adelaide': 'AU',
          'Australia/Darwin': 'AU',
          'Australia/Hobart': 'AU',
          'Pacific/Auckland': 'NZ',
          'Asia/Manila': 'PH'
        }
        
        const detectedCountry = timezoneToCountry[timezone] || 'US'
        const locationData: LocationData = {
          status: 'success',
          country: detectedCountry === 'US' ? 'United States' : 'Unknown',
          countryCode: detectedCountry,
          region: '',
          regionName: '',
          city: '',
          zip: '',
          lat: 0,
          lon: 0,
          timezone: timezone,
          isp: '',
          org: '',
          as: '',
          query: ''
        }
        
        this.cachedLocation = locationData
        this.lastFetchTime = now
        
        console.log('📍 Location detected via timezone fallback:', {
          country: locationData.country,
          countryCode: locationData.countryCode,
          timezone: locationData.timezone
        })
        
        return locationData
      } catch (timezoneError) {
        console.error('❌ All detection methods failed:', timezoneError)
        // Return a default location as last resort
        return this.getDefaultLocation()
      }
    } catch (error) {
      console.error('❌ Failed to detect location:', error)
      // Return a default location as last resort
      return this.getDefaultLocation()
    }
  }

  /**
   * Get a default location when all detection methods fail
   */
  private getDefaultLocation(): LocationData {
    const defaultLocation: LocationData = {
      status: 'success',
      country: 'United States',
      countryCode: 'US',
      region: '',
      regionName: '',
      city: '',
      zip: '',
      lat: 0,
      lon: 0,
      timezone: 'America/New_York',
      isp: '',
      org: '',
      as: '',
      query: ''
    }
    
    console.log('📍 Using default location (US) as fallback')
    return defaultLocation
  }

  /**
   * Get currency code based on country code
   */
  public getCurrencyFromCountry(countryCode: string): string {
    const currency = countryToCurrency[countryCode.toUpperCase()]
    return currency || 'USD' // Default to USD if country not found
  }

  /**
   * Detect user's currency based on their location
   */
  public async detectUserCurrency(): Promise<string> {
    try {
      const location = await this.detectLocation()
      
      if (location) {
        const currency = this.getCurrencyFromCountry(location.countryCode)
        console.log(`💰 Detected currency: ${currency} for country: ${location.country} (${location.countryCode})`)
        return currency
      }
      
      console.log('💰 Could not detect location, defaulting to USD')
      return 'USD'
    } catch (error) {
      console.error('❌ Failed to detect user currency:', error)
      return 'USD'
    }
  }

  /**
   * Get detailed location information
   */
  public async getLocationInfo(): Promise<{
    location: LocationData | null
    currency: string
    timezone: string
  }> {
    const location = await this.detectLocation()
    const currency = location ? this.getCurrencyFromCountry(location.countryCode) : 'USD'
    const timezone = location?.timezone || 'UTC'

    return {
      location,
      currency,
      timezone
    }
  }

  /**
   * Clear cached location data
   */
  public clearCache(): void {
    this.cachedLocation = null
    this.lastFetchTime = 0
    console.log('🗑️ Location cache cleared')
  }

  /**
   * Check if location data is cached and valid
   */
  public isLocationCached(): boolean {
    const now = Date.now()
    return !!(this.cachedLocation && (now - this.lastFetchTime) < this.CACHE_DURATION)
  }

  /**
   * Test IP detection services and return status
   */
  public async testServices(): Promise<{
    working: string[]
    failed: string[]
    recommended: string | null
  }> {
    const services = [
      { name: 'ipapi.co', url: 'https://ipapi.co/json/' },
      { name: 'ipinfo.io', url: 'https://ipinfo.io/json' },
      { name: 'ip-api.com', url: 'https://ip-api.com/json/' }
    ]

    const working: string[] = []
    const failed: string[] = []

    for (const service of services) {
      try {
        const response = await fetch(service.url, {
          method: 'GET',
          headers: { 'Accept': 'application/json' },
          signal: AbortSignal.timeout(5000)
        })
        
        if (response.ok) {
          working.push(service.name)
        } else {
          failed.push(`${service.name} (${response.status})`)
        }
      } catch (error) {
        failed.push(`${service.name} (${error instanceof Error ? error.message : 'Unknown error'})`)
      }
    }

    return {
      working,
      failed,
      recommended: working.length > 0 ? working[0] : null
    }
  }
}

// Export singleton instance
export const ipDetectionService = IPDetectionService.getInstance()

// Utility functions
export const detectUserLocation = () => ipDetectionService.detectLocation()
export const detectUserCurrency = () => ipDetectionService.detectUserCurrency()
export const getLocationInfo = () => ipDetectionService.getLocationInfo()
export const clearLocationCache = () => ipDetectionService.clearCache()
export const testIPDetectionServices = () => ipDetectionService.testServices()
