'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { ChevronDown, Search, User, Sparkles, Star } from 'lucide-react';
import { Input } from './input';
import { Label } from './label';
import { useAutocompleteSuggestions } from '@/hooks/use-api';
import { generateUserId } from '@/lib/userEngagementService';
// import { ButtonLoader } from './loader'; // Removed - will be recreated later

interface AIRoleSuggestion {
  title: string;
  description: string;
  level: 'entry' | 'mid' | 'senior';
}

interface AIRoleAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  industry: string;
  placeholder?: string;
  label?: string;
  className?: string;
  id?: string;
}

export function AIRoleAutocomplete({
  value,
  onChange,
  industry,
  placeholder = "Start typing your role...",
  label,
  className = "",
  id
}: AIRoleAutocompleteProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [shouldFetchAI, setShouldFetchAI] = useState(false);
  

  const userId = generateUserId();
  
  // Only update debounced query when user wants AI suggestions
  useEffect(() => {
    if (shouldFetchAI) {
      setDebouncedQuery(searchQuery);
    }
  }, [shouldFetchAI, searchQuery]);
  
  const { data: aiSuggestions, isLoading, error: queryError } = useAutocompleteSuggestions(
    debouncedQuery, // Use debounced query instead of immediate searchQuery
    userId, 
    shouldFetchAI && isOpen && debouncedQuery.length >= 2, // Only fetch when user wants AI suggestions (changed from > 2 to >= 2)
    'role',
    industry
  );

  // Use only AI suggestions - no hardcoded fallbacks
  const suggestions = searchQuery.length >= 2 && aiSuggestions && Array.isArray(aiSuggestions) && debouncedQuery === searchQuery
    ? aiSuggestions.map(suggestion => ({
        title: suggestion.title,
        description: suggestion.description,
        level: suggestion.level as 'entry' | 'mid' | 'senior'
      }))
    : [];
  
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Debug TanStack Query
  useEffect(() => {
    console.log('🔍 AI Role Autocomplete TanStack Query Status:', {
      searchQuery,
      debouncedQuery,
      isOpen,
      shouldFetchAI,
      isLoading,
      queryError,
      aiSuggestions: aiSuggestions ? (Array.isArray(aiSuggestions) ? aiSuggestions.length : 'string') : 'null',
      willFetch: shouldFetchAI && isOpen && debouncedQuery.length >= 2
    });
  }, [queryError, searchQuery, debouncedQuery, isOpen, isLoading, aiSuggestions]);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchQuery(newValue);
    onChange(newValue);
    setIsOpen(true);
    setSelectedIndex(-1);
    
    // Trigger AI suggestions after user has typed 2+ characters
    if (newValue.length >= 2) {
      setShouldFetchAI(true);
    } else {
      setShouldFetchAI(false);
    }
  };

  // Handle suggestion selection
  const handleSuggestionSelect = (suggestion: AIRoleSuggestion) => {
    onChange(suggestion.title);
    setSearchQuery(suggestion.title);
    setIsOpen(false);
    setShouldFetchAI(false); // Reset AI fetch flag
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
        setShouldFetchAI(false); // Reset AI fetch flag when closing
      }
    }, 150);
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

  const shouldShowDropdown = isOpen && (suggestions.length > 0 || isLoading || queryError);


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
          />
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
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
            {industry && (
              <span className="ml-2 text-lime-500">
                for {industry}
              </span>
            )}
          </div>
        )}

        {/* Dropdown */}
        {shouldShowDropdown && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-hidden">
            <div className="max-h-60 overflow-y-auto" ref={listRef}>
              {isLoading ? (
                 <div className="px-4 py-3 text-sm text-gray-500 text-center">
                   <div className="flex items-center space-x-2">
                     <div className="animate-spin rounded-full border-2 border-current border-t-transparent w-5 h-5" />
                     <span className="text-sm text-gray-600">AI is finding the best suggestions...</span>
                   </div>
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
              ) : queryError ? (
                <div className="px-4 py-3 text-sm text-red-500 text-center">
                  Unable to load suggestions
                </div>
              ) : suggestions.length > 0 ? (
                <>
                  {/* Show header for common suggestions when no search query */}
                  {!searchQuery.trim() && (
                    <div className="px-4 py-2 text-xs text-gray-500 bg-gray-50 border-b">
                      <Sparkles className="w-3 h-3 inline mr-1" />
                      {industry ? `${industry} roles` : 'Popular roles'}
                    </div>
                  )}
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
                            <User className="w-4 h-4 text-lime-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="mb-1">
                              <div className="text-sm font-medium text-gray-900">
                                {suggestion.title}
                              </div>
                            </div>
                            <div className="text-xs text-gray-500 line-clamp-2">
                              {suggestion.description}
                            </div>
                          </div>
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
                </>
              ) : searchQuery.length >= 2 ? (
                <div className="px-4 py-3 text-sm text-gray-500 text-center">
                  No roles found matching "{searchQuery}"
                </div>
              ) : null}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
