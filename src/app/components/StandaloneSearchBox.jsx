"use client";
import { useEffect, useRef } from "react";
import { useLoadScript } from "@react-google-maps/api";

const StandaloneSearchBox = ({ onPlaceChanged }) => {
  const inputRef = useRef(null);
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });

  useEffect(() => {
    if (isLoaded && inputRef.current) {
      const searchBox = new window.google.maps.places.SearchBox(inputRef.current);
      searchBox.addListener("places_changed", () => {
        const places = searchBox.getPlaces();
        if (places && places.length > 0) {
          const place = places[0];
          onPlaceChanged(place);
        }
      });
    }
  }, [isLoaded, onPlaceChanged]);

  return (
    <div className="relative w-full">
      <input
        type="text"
        ref={inputRef}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300"
        placeholder="Search Location..."
      />
    </div>
  );
};

export default StandaloneSearchBox;
