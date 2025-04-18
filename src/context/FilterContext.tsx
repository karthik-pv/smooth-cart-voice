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
  toggleFilter: (
    type: keyof Omit<FilterState, "price" | "searchQuery">,
    value: string
  ) => void;
  setPriceRange: (range: [number, number]) => void;
  setSearchQuery: (query: string) => void;
  removeFilter: (type: keyof FilterState, values: string[] | null) => void;
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

export const FilterProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [filters, setFilters] = useState<FilterState>(defaultFilters);

  // Update the updateFilters function to add to existing filters rather than replace them
  const updateFilters = (newFilters: Partial<FilterState>) => {
    setFilters((prevFilters) => {
      const updatedFilters = { ...prevFilters };

      // For each filter type, add new values without removing existing ones
      Object.keys(newFilters).forEach((key) => {
        const filterKey = key as keyof FilterState;

        // Handle price range separately
        if (filterKey === "price" && newFilters.price) {
          updatedFilters.price = newFilters.price;
        }
        // Handle searchQuery separately
        else if (
          filterKey === "searchQuery" &&
          newFilters.searchQuery !== undefined
        ) {
          updatedFilters.searchQuery = newFilters.searchQuery;
        }
        // Handle array filters by adding new values
        else if (
          Array.isArray(newFilters[filterKey]) &&
          Array.isArray(updatedFilters[filterKey])
        ) {
          // Improved case-insensitive comparison
          const existingValues = (updatedFilters[filterKey] as string[]).map(
            (v) => v.toLowerCase()
          );

          // Process each new value
          (newFilters[filterKey] as string[])
            .filter((v) => v) // Filter out empty values
            .forEach((value) => {
              const lowerValue = value.toLowerCase();

              // Only add if it doesn't already exist (case-insensitive)
              if (!existingValues.includes(lowerValue)) {
                // For brands specifically, try to match with correct casing from filterOptions
                if (filterKey === "brands") {
                  const correctCaseBrand = filterOptions.brands.find(
                    (b) => b.toLowerCase() === lowerValue
                  );
                  if (correctCaseBrand) {
                    (updatedFilters[filterKey] as string[]).push(
                      correctCaseBrand
                    );
                  } else {
                    (updatedFilters[filterKey] as string[]).push(value);
                  }
                } else {
                  (updatedFilters[filterKey] as string[]).push(value);
                }
              }
            });
        }
      });

      return updatedFilters;
    });
  };

  const toggleFilter = (
    type: keyof Omit<FilterState, "price" | "searchQuery">,
    value: string
  ) => {
    setFilters((prev) => {
      const current = prev[type];
      return {
        ...prev,
        [type]: current.includes(value)
          ? current.filter((v) => v !== value)
          : [...current, value],
      };
    });
  };

  const setPriceRange = (range: [number, number]) => {
    setFilters((prev) => ({ ...prev, price: range }));
  };

  const setSearchQuery = (query: string) => {
    setFilters((prev) => ({ ...prev, searchQuery: query }));
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

  // Add a new function to remove specific filter values
  const removeFilter = (type: keyof FilterState, values: string[] | null) => {
    setFilters((prevFilters) => {
      const updatedFilters = { ...prevFilters };

      // If values is null, it means remove all values for that type
      if (values === null) {
        // For price, reset to default
        if (type === "price") {
          updatedFilters.price = [0, 200];
        }
        // For searchQuery, reset to empty string
        else if (type === "searchQuery") {
          updatedFilters.searchQuery = "";
        }
        // For array filters, reset to empty array
        else {
          // Handle each array type specifically
          if (type === "colors") updatedFilters.colors = [];
          else if (type === "sizes") updatedFilters.sizes = [];
          else if (type === "materials") updatedFilters.materials = [];
          else if (type === "genders") updatedFilters.genders = [];
          else if (type === "brands") updatedFilters.brands = [];
          else if (type === "subCategories") updatedFilters.subCategories = [];
        }
      }
      // Otherwise, remove specific values
      else {
        // Handle each array type specifically
        if (
          type === "colors" ||
          type === "sizes" ||
          type === "materials" ||
          type === "genders" ||
          type === "brands" ||
          type === "subCategories"
        ) {
          // Convert to lowercase for comparison
          const valuesToRemoveSet = new Set(values.map((v) => v.toLowerCase()));

          // Filter out the values to remove (case-insensitive)
          updatedFilters[type] = updatedFilters[type].filter(
            (value) => !valuesToRemoveSet.has(value.toLowerCase())
          );
        }
      }

      return updatedFilters;
    });
  };

  return (
    <FilterContext.Provider
      value={{
        filters,
        updateFilters,
        clearFilters,
        toggleFilter,
        setPriceRange,
        setSearchQuery,
        removeFilter,
      }}
    >
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
