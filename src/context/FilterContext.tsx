import React, { createContext, useContext, useState } from "react";
import { filterOptions } from "@/data/products";

// Make sure FilterState is properly exported
export type FilterState = {
  colors: string[];
  sizes: string[];
  materials: string[];
  genders: string[];
  brands: string[];
  subCategories: string[];
  price: [number, number];
  searchQuery: string;
};

interface FilterContextType {
  filters: FilterState;
  updateFilters: (newFilters: Partial<FilterState>) => void;
  clearFilters: () => void;
  toggleFilter: (type: keyof Omit<FilterState, "price" | "searchQuery">, value: string) => void;
  setPriceRange: (range: [number, number]) => void;
  setSearchQuery: (query: string) => void;
}

const defaultFilters: FilterState = {
  colors: [],
  sizes: [],
  materials: [],
  genders: [],
  brands: [],
  subCategories: [],
  price: [0, 200],
  searchQuery: "",
};

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export const FilterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [filters, setFilters] = useState<FilterState>(defaultFilters);

  // Update the updateFilters function to add to existing filters rather than replace them
  const updateFilters = (newFilters: Partial<FilterState>) => {
    setFilters((prevFilters) => {
      const updatedFilters = { ...prevFilters };
      
      // For each filter type, add new values without removing existing ones
      Object.keys(newFilters).forEach((key) => {
        const filterKey = key as keyof FilterState;
        
        // Handle price range separately
        if (filterKey === 'price' && newFilters.price) {
          updatedFilters.price = newFilters.price;
        } 
        // Handle searchQuery separately
        else if (filterKey === 'searchQuery' && newFilters.searchQuery !== undefined) {
          updatedFilters.searchQuery = newFilters.searchQuery;
        }
        // Handle array filters by adding new values
        else if (Array.isArray(newFilters[filterKey]) && Array.isArray(updatedFilters[filterKey])) {
          // Convert all values to lowercase for case-insensitive comparison
          const existingValues = (updatedFilters[filterKey] as string[]).map(v => v.toLowerCase());
          const newValues = (newFilters[filterKey] as string[])
            .filter(v => v) // Filter out empty values
            .map(v => v.toLowerCase());
            
          // Add only values that don't already exist
          newValues.forEach(value => {
            if (!existingValues.includes(value)) {
              (updatedFilters[filterKey] as string[]).push(value);
            }
          });
        }
      });
      
      return updatedFilters;
    });
  };

  const toggleFilter = (type: keyof Omit<FilterState, "price" | "searchQuery">, value: string) => {
    setFilters(prev => {
      const current = prev[type];
      return {
        ...prev,
        [type]: current.includes(value)
          ? current.filter(v => v !== value)
          : [...current, value],
      };
    });
  };

  const setPriceRange = (range: [number, number]) => {
    setFilters(prev => ({ ...prev, price: range }));
  };

  const setSearchQuery = (query: string) => {
    setFilters(prev => ({ ...prev, searchQuery: query }));
  };

  const clearFilters = () => {
    // Reset to default values - don't use a hardcoded object
    setFilters({
      colors: [],
      sizes: [],
      materials: [],
      genders: [],
      brands: [],
      subCategories: [],
      price: [0, 200],
      searchQuery: "",
    });
  };

  return (
    <FilterContext.Provider value={{ 
      filters, 
      updateFilters, 
      clearFilters, 
      toggleFilter, 
      setPriceRange, 
      setSearchQuery 
    }}>
      {children}
    </FilterContext.Provider>
  );
};

export const useFilters = () => {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error("useFilters must be used within a FilterProvider");
  }
  return context;
};