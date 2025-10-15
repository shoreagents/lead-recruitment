'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { ChevronDown, Search, Building2, Sparkles } from 'lucide-react';
import { Input } from './input';
import { Label } from './label';
import { useAutocompleteSuggestions, AISuggestion } from '@/hooks/use-api';
import { generateUserId } from '@/lib/userEngagementService';
// import { ButtonLoader } from './loader'; // Removed - will be recreated later

interface AIIndustryAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  className?: string;
  id?: string;
}

export function AIIndustryAutocomplete({
  value,
  onChange,
  placeholder = "Start typing your industry...",
  label,
  className = "",
  id
}: AIIndustryAutocompleteProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [error, setError] = useState<string | null>(null);
  

  const userId = generateUserId();
  
  // Debounce the search query - only update after 1 second of no typing
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 1000); // 1 second delay
    
    return () => clearTimeout(timer);
  }, [searchQuery]);
  
  const { data: aiSuggestions, isLoading, error: queryError } = useAutocompleteSuggestions(
    debouncedQuery, // Use debounced query instead of immediate searchQuery
    userId, 
    isOpen && debouncedQuery.length >= 2, // Only fetch when debounced query is ready (changed from > 2 to >= 2)
    'industry'
  );

  // Use only AI suggestions - no hardcoded fallbacks
  const suggestions = searchQuery.length >= 2 && aiSuggestions && Array.isArray(aiSuggestions) && debouncedQuery === searchQuery
    ? aiSuggestions 
    : [];
  
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Handle query errors and debug TanStack Query
  useEffect(() => {
    console.log('🔍 AI Industry Autocomplete TanStack Query Status:', {
      searchQuery,
      debouncedQuery,
      isOpen,
      isLoading,
      queryError,
      aiSuggestions: aiSuggestions ? (Array.isArray(aiSuggestions) ? aiSuggestions.length : 'string') : 'null',
      willFetch: isOpen && debouncedQuery.length > 2
    });
    
    if (queryError) {
      console.error('❌ TanStack Query Error:', queryError);
      setError('Unable to load suggestions');
    } else {
      setError(null); // Clear error when query succeeds
    }
  }, [queryError, searchQuery, debouncedQuery, isOpen, isLoading, aiSuggestions]);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchQuery(newValue);
    onChange(newValue);
    setIsOpen(true);
    setSelectedIndex(-1);
  };

  // Handle suggestion selection
  const handleSuggestionSelect = (suggestion: AISuggestion) => {
    onChange(suggestion.title);
    setSearchQuery(suggestion.title);
    setIsOpen(false);
    inputRef.current?.blur();
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          handleSuggestionSelect(suggestions[selectedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        inputRef.current?.blur();
        break;
    }
  };

  // Handle input focus
  const handleFocus = () => {
    setIsOpen(true);
  };

  // Handle input blur
  const handleBlur = (e: React.FocusEvent) => {
    setTimeout(() => {
      if (!dropdownRef.current?.contains(document.activeElement)) {
        setIsOpen(false);
      }
    }, 100); // Faster blur response
  };

  // Scroll selected item into view
  useEffect(() => {
    if (selectedIndex >= 0 && listRef.current) {
      const selectedItem = listRef.current.children[selectedIndex] as HTMLElement;
      if (selectedItem) {
        selectedItem.scrollIntoView({
          block: 'nearest',
          behavior: 'smooth'
        });
      }
    }
  }, [selectedIndex]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Cleanup abort controller on unmount
  // Cleanup effect (no longer needed with TanStack Query)
  useEffect(() => {
    return () => {
      // TanStack Query handles cleanup automatically
    };
  }, []);

  const shouldShowDropdown = isOpen && (suggestions.length > 0 || isLoading || error);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {label && (
        <Label htmlFor={id} className="text-base font-medium">
          {label}
        </Label>
      )}
      
      <div className="relative mt-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            ref={inputRef}
            id={id}
            type="text"
            value={searchQuery}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder={placeholder}
            className="pl-10 pr-10"
            autoComplete="off"
            autoFocus={false}
          />
          <button
            type="button"
            onClick={() => {
              setIsOpen(!isOpen);
            }}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            {isLoading ? (
              <div className="animate-spin rounded-full border-2 border-current border-t-transparent w-4 h-4" />
            ) : (
              <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            )}
          </button>
        </div>

        {/* AI Indicator */}
        {searchQuery.length >= 2 && (
          <div className="mt-2 text-xs text-lime-600 bg-lime-50 px-3 py-1 rounded-full inline-block">
            <Sparkles className="w-3 h-3 inline mr-1" />
            AI-powered suggestions
          </div>
        )}

        {/* Dropdown */}
        {shouldShowDropdown && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-hidden">
            <div className="max-h-60 overflow-y-auto" ref={listRef}>
              {isLoading ? (
                <div className="px-4 py-3 text-sm text-gray-500 text-center">
                  <div className="animate-spin rounded-full border-2 border-current border-t-transparent w-5 h-5" />
                  <span className="ml-2">AI is finding the best suggestions...</span>
                </div>
              ) : debouncedQuery !== searchQuery && searchQuery.length > 2 ? (
                <div className="px-4 py-3 text-sm text-gray-500 text-center">
                  <div className="flex items-center justify-center">
                    <div className="animate-pulse w-2 h-2 bg-gray-400 rounded-full mr-2" />
                    <div className="animate-pulse w-2 h-2 bg-gray-400 rounded-full mr-2" />
                    <div className="animate-pulse w-2 h-2 bg-gray-400 rounded-full" />
                  </div>
                  <span className="mt-2 block">Waiting for you to finish typing...</span>
                </div>
              ) : error ? (
                <div className="px-4 py-3 text-sm text-red-500 text-center">
                  {error}
                </div>
              ) : suggestions.length > 0 ? (
                <ul className="py-1">
                  {suggestions.map((suggestion, index) => (
                    <li key={`${suggestion.title}-${index}`}>
                      <button
                        type="button"
                        onClick={() => handleSuggestionSelect(suggestion)}
                        className={`w-full px-4 py-3 text-left hover:bg-lime-50 transition-colors ${
                          index === selectedIndex ? 'bg-lime-100' : ''
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0 mt-0.5">
                            <Building2 className="w-4 h-4 text-lime-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-gray-900">
                              {suggestion.title}
                            </div>
                            <div className="text-xs text-gray-500 mt-0.5">
                              {suggestion.level}
                            </div>
                            <div className="text-xs text-gray-400 mt-1 line-clamp-2">
                              {suggestion.description}
                            </div>
                          </div>
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              ) : searchQuery.length >= 2 ? (
                <div className="px-4 py-3 text-sm text-gray-500 text-center">
                  No industries found matching "{searchQuery}"
                </div>
              ) : null}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
