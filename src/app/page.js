"use client";
import { useState } from "react";
import GoogleMaps from "./components/GoogleMaps";
import StandaloneSearchBox from "./components/StandaloneSearchBox";

export default function Home() {
  const [form, setForm] = useState({
    name: "",
    address: "",
    latitude: 41.311081,
    longitude: 69.240562,
  });

  const handlePlaceChanged = (place) => {
    if (place) {
      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();
      setForm((prev) => ({
        ...prev,
        address: place.formatted_address,
        latitude: lat,
        longitude: lng,
      }));
    }
  };

  return (
    <div className="container w-full h-screen flex items-center justify-center">
      <div className="flex flex-col max-w-[800px] w-full items-center gap-x-4">
        <StandaloneSearchBox onPlaceChanged={handlePlaceChanged} />
        <div className="h-96 w-full mt-4">
          <GoogleMaps
            style="px-4 py-2 border-b border-[#E5E5E5]"
            address={form.address}
            latitude={form.latitude}
            longitude={form.longitude}
            setLatitude={(latitude) => setForm((prev) => ({ ...prev, latitude }))}
            setLongitude={(longitude) => setForm((prev) => ({ ...prev, longitude }))}
            setAddress={(address) => setForm((prev) => ({ ...prev, address }))}
          />
        </div>
        <div className="flex flex-col mt-4">
          <span className="text-xl">Address: {form.address}</span>
          <span className="text-xl">Latitude: {form.latitude}</span>
          <span className="text-xl">Longitude: {form.longitude}</span>
        </div>
      </div>
    </div>
  );
}
