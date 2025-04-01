import React, { createContext, useContext, useState } from "react";
import { filterOptions } from "@/data/products";

export interface FilterState {
  colors: string[];
  sizes: string[];
  materials: string[];
  genders: string[];
  brands: string[];
  subCategories: string[];
  price: [number, number];
  searchQuery: string;
}

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

  const updateFilters = (newFilters: Partial<FilterState>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
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
    setFilters(defaultFilters);
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