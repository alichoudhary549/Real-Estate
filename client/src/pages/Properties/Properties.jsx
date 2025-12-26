import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "react-query";
import SearchBar from "../../components/SearchBar/SearchBar";
import "./Properties.css";
import useProperties from "../../hooks/useProperties";
import { PuffLoader } from "react-spinners";
import PropertyCard from "../../components/PropertyCard/PropertyCard";
import { searchProperties } from "../../utils/api";

const Properties = () => {
  const [searchParams] = useSearchParams();
  const searchTitle = searchParams.get("title") || "";
  const searchCity = searchParams.get("city") || "";
  const hasSearchParams = !!(searchTitle.trim() || searchCity.trim());

  // Debug: Log search params
  useEffect(() => {
    console.log("Search params changed:", { searchTitle, searchCity, hasSearchParams });
  }, [searchTitle, searchCity, hasSearchParams]);

  // Use search API if search params exist, otherwise use all properties
  const { data: allProperties, isError: allError, isLoading: allLoading } = useProperties();
  
  // Search query - only enabled when we have search params
  // Query key includes trimmed values to ensure proper cache invalidation
  const { 
    data: searchResults, 
    isError: searchError, 
    isLoading: searchLoading
  } = useQuery(
    ["searchProperties", searchTitle.trim(), searchCity.trim()],
    () => {
      console.log("Calling searchProperties API with:", { title: searchTitle, city: searchCity });
      return searchProperties(searchTitle.trim(), searchCity.trim());
    },
    {
      enabled: hasSearchParams, // Only run query if search params exist
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 0, // Always refetch when query key changes
    }
  );

  const [filter, setFilter] = useState("");

  // Determine which data to use - ensure we always have an array
  let data = [];
  let isLoading = false;
  let isError = false;

  if (hasSearchParams) {
    // When searching, use search results
    data = Array.isArray(searchResults) ? searchResults : [];
    isLoading = searchLoading;
    isError = !!searchError;
  } else {
    // When not searching, use all properties
    data = Array.isArray(allProperties) ? allProperties : [];
    isLoading = allLoading;
    isError = !!allError;
  }

  // Debug: Log data state
  useEffect(() => {
    console.log("Properties page state:", { 
      hasSearchParams, 
      searchTitle,
      searchCity,
      dataLength: data?.length, 
      searchResults: searchResults ? `Array(${searchResults.length})` : 'undefined',
      allProperties: allProperties ? `Array(${allProperties.length})` : 'undefined',
      isLoading,
      isError
    });
  }, [data, searchResults, allProperties, hasSearchParams, isLoading, isError, searchTitle, searchCity]);

  // Filter results further with client-side filter (for the SearchBar component)
  const filteredData = data.filter(
    (property) =>
      !filter ||
      property.title?.toLowerCase().includes(filter.toLowerCase()) ||
      property.city?.toLowerCase().includes(filter.toLowerCase()) ||
      property.country?.toLowerCase().includes(filter.toLowerCase())
  );

  if (isError) {
    return (
      <div className="wrapper">
        <span>Error while fetching data</span>
      </div>
    );
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="wrapper flexCenter" style={{ height: "60vh" }}>
        <div style={{ textAlign: "center" }}>
          <PuffLoader
            height="80"
            width="80"
            radius={1}
            color="#4066ff"
            aria-label="puff-loading"
          />
          {hasSearchParams && (
            <p style={{ marginTop: "1rem", color: "#666" }}>
              Searching for properties...
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="wrapper">
      <div className="flexColCenter paddings innerWidth properties-container">
        <SearchBar filter={filter} setFilter={setFilter} />
        
        {/* Show search info if search params exist */}
        {hasSearchParams && (
          <div style={{ marginTop: "1rem", marginBottom: "1rem", color: "#666", fontSize: "14px" }}>
            {searchTitle && <span>Title: <strong>{searchTitle}</strong></span>}
            {searchTitle && searchCity && <span> | </span>}
            {searchCity && <span>City: <strong>{searchCity}</strong></span>}
          </div>
        )}

        <div className="paddings flexCenter properties">
          {filteredData.length === 0 ? (
            <div style={{ 
              textAlign: "center", 
              padding: "3rem", 
              color: "#888",
              width: "100%"
            }}>
              <p style={{ fontSize: "18px", marginBottom: "0.5rem" }}>
                {hasSearchParams ? "No properties found matching your search criteria." : "No properties found."}
              </p>
              <p style={{ fontSize: "14px" }}>
                Try adjusting your search terms or filters.
              </p>
            </div>
          ) : (
            filteredData.map((card, i) => (
              <PropertyCard card={card} key={card._id || i} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Properties;
