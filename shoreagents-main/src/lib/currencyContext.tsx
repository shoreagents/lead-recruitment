"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback, useRef } from 'react'
import { currencyApi } from './api'
import { LocationData } from './ipDetection'

export interface Currency {
  symbol: string
  code: string
  exchangeRate: number // Rate relative to USD
}

interface CurrencyContextType {
  selectedCurrency: Currency
  setSelectedCurrency: (currency: Currency) => void
  convertPrice: (usdPrice: number) => number
  formatPrice: (price: number) => string
  isLoadingRates: boolean
  lastUpdated: string | null
  refreshRates: () => Promise<void>
  currencies: Currency[]
  userLocation: LocationData | null
  isDetectingLocation: boolean
  detectUserLocation: () => Promise<void>
  isAutoDetected: boolean
  setIsAutoDetected: (detected: boolean) => void
  hasUserSelectedCurrency: boolean
  setHasUserSelectedCurrency: (selected: boolean) => void
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined)

// Static fallback rates (PHP to other currencies)
const fallbackRates = {
  USD: 0.018,   // 1 PHP = $0.018
  AUD: 0.027,   // 1 PHP = A$0.027
  CAD: 0.024,   // 1 PHP = C$0.024
  GBP: 0.014,   // 1 PHP = £0.014
  NZD: 0.029,   // 1 PHP = NZ$0.029
  EUR: 0.016,   // 1 PHP = €0.016
  PHP: 1.0      // 1 PHP = 1 PHP
}

const currencies: Currency[] = [
  { symbol: '$', code: 'USD', exchangeRate: 0.018 }, // 1 PHP = $0.018
  { symbol: 'A$', code: 'AUD', exchangeRate: 0.027 }, // 1 PHP = A$0.027
  { symbol: 'C$', code: 'CAD', exchangeRate: 0.024 }, // 1 PHP = C$0.024
  { symbol: '£', code: 'GBP', exchangeRate: 0.014 }, // 1 PHP = £0.014
  { symbol: 'NZ$', code: 'NZD', exchangeRate: 0.029 }, // 1 PHP = NZ$0.029
  { symbol: '€', code: 'EUR', exchangeRate: 0.016 }, // 1 PHP = €0.016
  { symbol: '₱', code: 'PHP', exchangeRate: 1.0 } // 1 PHP = ₱1.0
]

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currenciesState, setCurrenciesState] = useState<Currency[]>(currencies)
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>(currencies[0])
  const [isLoadingRates, setIsLoadingRates] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<string | null>(null)
  const [, setExchangeRates] = useState<Record<string, number>>({})
  const [userLocation, setUserLocation] = useState<LocationData | null>(null)
  const [isDetectingLocation, setIsDetectingLocation] = useState(false)
  const [isAutoDetected, setIsAutoDetected] = useState(false)
  const [hasUserSelectedCurrency, setHasUserSelectedCurrency] = useState(false)
  
  // Use ref to track current selected currency without causing re-renders
  const selectedCurrencyRef = useRef(selectedCurrency)
  selectedCurrencyRef.current = selectedCurrency

  // Cache for converted prices to avoid repeated calculations
  const priceCacheRef = useRef<Map<string, number>>(new Map())
  
  // Track if we've completed initial currency setup after IP detection
  const hasInitializedCurrency = useRef(false)

  // Clear price cache when currency changes
  const clearPriceCache = useCallback(() => {
    priceCacheRef.current.clear()
  }, [])

  // Fetch real-time exchange rates - memoized with useCallback
  const fetchExchangeRates = useCallback(async () => {
    setIsLoadingRates(true)
    try {
      console.log('🔄 Fetching exchange rates...')
      const rates = await currencyApi.getExchangeRates()
      
      if (rates) {
        setExchangeRates(rates)
        setLastUpdated(new Date().toLocaleTimeString())
        
        // Update currencies with real-time rates
        // Convert from USD-based rates to PHP-based rates
        const phpToUsdRate = rates.PHP || 55.5; // 1 USD = 55.5 PHP (default)
        const usdToPhpRate = 1 / phpToUsdRate; // 1 PHP = 0.018 USD
        
        const updatedCurrencies = currencies.map(currency => {
          if (currency.code === 'PHP') {
            return { ...currency, exchangeRate: 1.0 }
          } else if (currency.code === 'USD') {
            return { ...currency, exchangeRate: usdToPhpRate }
          } else {
            // For other currencies: convert USD rate to PHP rate
            const usdToTargetRate = rates[currency.code] || 1;
            const phpToTargetRate = usdToTargetRate * usdToPhpRate;
            return { ...currency, exchangeRate: phpToTargetRate }
          }
        })
        
        // Update the currencies state
        setCurrenciesState(updatedCurrencies)
        
        // Update selected currency with new rate
        const currentSelected = updatedCurrencies.find(c => c.code === selectedCurrencyRef.current.code)
        if (currentSelected) {
          setSelectedCurrency(currentSelected)
          // Clear price cache when exchange rates are updated
          clearPriceCache()
        }
        
        console.log('✅ Exchange rates updated successfully:', rates)
        console.log('🔄 Rate conversion:', {
          phpToUsdRate,
          usdToPhpRate,
          sampleConversion: `1 PHP = ${usdToPhpRate.toFixed(4)} USD`
        })
        console.log('Updated currencies:', updatedCurrencies)
      } else {
        console.warn('⚠️ No exchange rates received from API, using fallback rates')
        // Use fallback rates when API fails
        const fallbackCurrencies = currencies.map(currency => {
          if (currency.code === 'PHP') {
            return { ...currency, exchangeRate: 1.0 }
          } else {
            // Use the fallback rate directly (PHP to target currency)
            const fallbackRate = fallbackRates[currency.code as keyof typeof fallbackRates]
            return { ...currency, exchangeRate: fallbackRate }
          }
        })
        
        setCurrenciesState(fallbackCurrencies)
        
        // Update selected currency with fallback rate
        const currentSelected = fallbackCurrencies.find(c => c.code === selectedCurrencyRef.current.code)
        if (currentSelected) {
          setSelectedCurrency(currentSelected)
          // Clear price cache when fallback rates are used
          clearPriceCache()
        }
        
        console.log('✅ Using fallback exchange rates:', fallbackRates)
        console.log('Updated currencies with fallback rates:', fallbackCurrencies)
      }
    } catch (error) {
      console.error('❌ Failed to fetch exchange rates:', error)
      // Use fallback rates when API fails
      const fallbackCurrencies = currencies.map(currency => {
        if (currency.code === 'PHP') {
          return { ...currency, exchangeRate: 1.0 }
        } else {
          // Use the fallback rate directly (PHP to target currency)
          const fallbackRate = fallbackRates[currency.code as keyof typeof fallbackRates]
          return { ...currency, exchangeRate: fallbackRate }
        }
      })
      
      setCurrenciesState(fallbackCurrencies)
      
              // Update selected currency with fallback rate
        const currentSelected = fallbackCurrencies.find(c => c.code === selectedCurrencyRef.current.code)
        if (currentSelected) {
          setSelectedCurrency(currentSelected)
          // Clear price cache when fallback rates are used
          clearPriceCache()
        }
      
      console.log('✅ Using fallback exchange rates due to API error:', fallbackRates)
      console.log('Updated currencies with fallback rates:', fallbackCurrencies)
    } finally {
      setIsLoadingRates(false)
    }
  }, [])

  // Refresh rates function
  const refreshRates = useCallback(async () => {
    await fetchExchangeRates()
  }, [fetchExchangeRates])

  // Detect user location and set appropriate currency
  const detectUserLocation = useCallback(async () => {
    if (hasUserSelectedCurrency) {
      console.log('🔄 User has manually selected currency, skipping auto-detection')
      return
    }
    
    setIsDetectingLocation(true)
    try {
      console.log('🌍 Detecting user location for currency...')
      const { detectUserLocation: detectLocation, detectUserCurrency } = await import('./ipDetection')
      
      const location = await detectLocation()
      const detectedCurrency = await detectUserCurrency()
      
      if (location && detectedCurrency) {
        setUserLocation(location)
        
        // Find the detected currency in our currencies list
        const currency = currenciesState.find(c => c.code === detectedCurrency)
        if (currency) {
          setSelectedCurrency(currency)
          setIsAutoDetected(true)
          console.log(`💰 Auto-detected currency: ${detectedCurrency} for ${location.country}`)
        } else {
          console.log(`💰 Detected currency ${detectedCurrency} not available, keeping default`)
        }
      } else {
        console.log('💰 Could not detect location/currency, keeping default')
      }
    } catch (error) {
      console.error('❌ Failed to detect location/currency:', error)
      console.log('💰 Using default currency (USD)')
    } finally {
      setIsDetectingLocation(false)
      hasInitializedCurrency.current = true
    }
  }, [hasUserSelectedCurrency, currenciesState])

  // Fetch rates on mount and every 5 minutes
  useEffect(() => {
    let isMounted = true;
    
    const fetchRates = async () => {
      if (!isMounted) return;
      await fetchExchangeRates();
    };
    
    fetchRates();
    
    const interval = setInterval(() => {
      if (isMounted) {
        fetchRates();
      }
    }, 5 * 60 * 1000); // 5 minutes
    
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [fetchExchangeRates]);

  // Detect user location on mount (only if user hasn't manually selected a currency)
  useEffect(() => {
    let isMounted = true;
    
    const detectLocation = async () => {
      if (!isMounted) return;
      await detectUserLocation();
    };
    
    // Only run detection on client side, not during build
    if (typeof window !== 'undefined') {
      detectLocation();
    }
    
    return () => {
      isMounted = false;
    };
  }, [detectUserLocation]);

  // Clear price cache when currency changes
  useEffect(() => {
    clearPriceCache()
  }, [selectedCurrency.code, clearPriceCache])

  const convertPrice = useCallback((phpAmount: number): number => {
    // If PHP is selected, return the amount as is
    if (selectedCurrency.code === 'PHP') {
      return phpAmount;
    }
    
    // Create cache key for this conversion
    const cacheKey = `${phpAmount}-${selectedCurrency.code}-${selectedCurrency.exchangeRate}`;
    
    // Check if we have this conversion cached
    if (priceCacheRef.current.has(cacheKey)) {
      return priceCacheRef.current.get(cacheKey)!;
    }
    
    // Use the selected currency's exchange rate (which gets updated with real-time rates)
    // The exchange rate is now relative to PHP, not USD
    const rate = selectedCurrency.exchangeRate;
    const convertedAmount = phpAmount * rate;
    
    // Cache the result
    priceCacheRef.current.set(cacheKey, convertedAmount);
    
    // Only log conversions after initial setup is complete and only once per unique conversion
    if (hasInitializedCurrency.current && !priceCacheRef.current.has(`${phpAmount}-${selectedCurrency.code}-logged`)) {
      console.log(`Converting ${phpAmount} PHP to ${selectedCurrency.code} using rate: ${rate}`);
      priceCacheRef.current.set(`${phpAmount}-${selectedCurrency.code}-logged`, 1);
    }
    
    return convertedAmount;
  }, [selectedCurrency.code, selectedCurrency.exchangeRate])

  const formatPrice = (price: number): string => {
    if (selectedCurrency.code === 'PHP') {
      return `₱${Math.round(price).toLocaleString()}`
    } else if (selectedCurrency.code === 'USD') {
      return `$${price.toFixed(0)}`
    } else if (selectedCurrency.code === 'AUD') {
      return `A$${price.toFixed(0)}`
    } else if (selectedCurrency.code === 'CAD') {
      return `C$${price.toFixed(0)}`
    } else if (selectedCurrency.code === 'GBP') {
      return `£${price.toFixed(0)}`
    } else if (selectedCurrency.code === 'NZD') {
      return `NZ$${price.toFixed(0)}`
    } else if (selectedCurrency.code === 'EUR') {
      return `€${price.toFixed(0)}`
    }
    return `${selectedCurrency.symbol}${price.toFixed(0)}`
  }

  return (
    <CurrencyContext.Provider value={{
      selectedCurrency,
      setSelectedCurrency,
      convertPrice,
      formatPrice,
      isLoadingRates,
      lastUpdated,
      refreshRates,
      currencies: currenciesState,
      userLocation,
      isDetectingLocation,
      detectUserLocation,
      isAutoDetected,
      setIsAutoDetected,
      hasUserSelectedCurrency,
      setHasUserSelectedCurrency
    }}>
      {children}
    </CurrencyContext.Provider>
  )
}

export function useCurrency() {
  const context = useContext(CurrencyContext)
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider')
  }
  return context
}

export { currencies }
