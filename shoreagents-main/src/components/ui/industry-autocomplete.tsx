'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search, Building2 } from 'lucide-react';
import { industries, searchIndustries, type Industry } from '@/lib/industries';
import { Input } from './input';
import { Label } from './label';

interface IndustryAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  className?: string;
  id?: string;
}

export function IndustryAutocomplete({
  value,
  onChange,
  placeholder = "e.g., Real Estate, E-commerce, Healthcare...",
  label,
  className = "",
  id
}: IndustryAutocompleteProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredIndustries, setFilteredIndustries] = useState<Industry[]>(industries);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Filter industries based on search query
  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = searchIndustries(searchQuery);
      setFilteredIndustries(filtered);
      setShowSuggestions(true);
    } else {
      setFilteredIndustries(industries);
      setShowSuggestions(false);
    }
    setSelectedIndex(-1);
  }, [searchQuery]);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchQuery(newValue);
    onChange(newValue);
    setIsOpen(true);
  };

  // Handle industry selection
  const handleIndustrySelect = (industry: Industry) => {
    onChange(industry.name);
    setSearchQuery(industry.name);
    setIsOpen(false);
    setShowSuggestions(false);
    inputRef.current?.blur();
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen && !showSuggestions) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < filteredIndustries.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < filteredIndustries.length) {
          handleIndustrySelect(filteredIndustries[selectedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setShowSuggestions(false);
        inputRef.current?.blur();
        break;
    }
  };

  // Handle input focus
  const handleFocus = () => {
    setIsOpen(true);
    if (searchQuery.trim()) {
      setShowSuggestions(true);
    }
  };

  // Handle input blur
  const handleBlur = (e: React.FocusEvent) => {
    // Delay to allow click events on suggestions
    setTimeout(() => {
      if (!dropdownRef.current?.contains(document.activeElement)) {
        setIsOpen(false);
        setShowSuggestions(false);
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
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const shouldShowDropdown = isOpen && (showSuggestions || filteredIndustries.length > 0);

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
            <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Dropdown */}
        {shouldShowDropdown && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-hidden">
            <div className="max-h-60 overflow-y-auto" ref={listRef}>
              {filteredIndustries.length > 0 ? (
                <ul className="py-1">
                  {filteredIndustries.map((industry, index) => (
                    <li key={industry.id}>
                      <button
                        type="button"
                        onClick={() => handleIndustrySelect(industry)}
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
                              {industry.name}
                            </div>
                            <div className="text-xs text-gray-500 mt-0.5">
                              {industry.category}
                            </div>
                            {industry.description && (
                              <div className="text-xs text-gray-400 mt-1 line-clamp-2">
                                {industry.description}
                              </div>
                            )}
                          </div>
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="px-4 py-3 text-sm text-gray-500 text-center">
                  No industries found matching "{searchQuery}"
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
