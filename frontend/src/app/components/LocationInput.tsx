"use client";
import { useState, useEffect, useCallback } from 'react';
import debounce from 'lodash/debounce';
import { getApiUrl } from "@/utils/api";

interface LocationInputProps {
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  className?: string;
  placeholder?: string;
}

export default function LocationInput({ 
  value, 
  onChange, 
  required = false,
  className = "",
  placeholder = "Ort eingeben..."
}: LocationInputProps) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const fetchSuggestions = useCallback(
    debounce(async (query: string) => {
      if (query.length < 2) {
        setSuggestions([]);
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch(`${getApiUrl()}/api/locations/search?q=${encodeURIComponent(query)}`);
        if (!response.ok) throw new Error('Netzwerkfehler');
        const data = await response.json();
        setSuggestions(data.locations);
      } catch (error) {
        console.error('Fehler beim Laden der Ortschaften:', error);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    }, 300),
    []
  );

  useEffect(() => {
    fetchSuggestions(value);
  }, [value, fetchSuggestions]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    setShowSuggestions(true);
  };

  const handleSuggestionClick = (suggestion: string) => {
    onChange(suggestion);
    setShowSuggestions(false);
  };

  return (
    <div className="position-relative">
      <input
        type="text"
        className={`form-control ${className}`}
        value={value}
        onChange={handleInputChange}
        onFocus={() => setShowSuggestions(true)}
        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
        required={required}
        placeholder={placeholder}
      />
      {showSuggestions && suggestions.length > 0 && (
        <ul 
          className="list-group position-absolute w-100 mt-1 shadow-sm border-primary" 
          style={{ zIndex: 1000 }}
        >
          {suggestions.map((suggestion) => (
            <li
              key={suggestion}
              className="list-group-item list-group-item-action py-2 hover-bg-light"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
      {isLoading && (
        <div className="position-absolute end-0 top-50 translate-middle-y me-2">
          <div className="spinner-border spinner-border-sm text-primary" role="status">
            <span className="visually-hidden">Lädt...</span>
          </div>
        </div>
      )}
    </div>
  );
} 