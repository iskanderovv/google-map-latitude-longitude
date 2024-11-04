"use client";
import { useMemo, useState, useEffect } from "react";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import { FaLocationArrow } from "react-icons/fa";
import "./style.css";

const GoogleMaps = ({
  setLatitude,
  setLongitude,
  style,
  address,
  setAddress,
  latitude,
  longitude,
}) => {
  const [map, setMap] = useState(null);
  const [markerPosition, setMarkerPosition] = useState({
    lat: latitude,
    lng: longitude,
  });
  const [geocoder, setGeocoder] = useState(null);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
    onLoad: () => {
      setGeocoder(new window.google.maps.Geocoder());
    },
  });

  const center = useMemo(
    () => ({ lat: latitude, lng: longitude }),
    [latitude, longitude]
  );

  useEffect(() => {
    if (map) {
      map.panTo(center);
    }
  }, [center, map]);

  useEffect(() => {
    if (latitude && longitude) {
      setMarkerPosition({ lat: latitude, lng: longitude });
    }
  }, [latitude, longitude]);

  const handlePlaceChanged = (place) => {
    if (place) {
      console.log(`Selected Place: ${place.formatted_address}`);
      setAddress(place.formatted_address);
      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();
      const newUserPosition = { lat, lng };
      setMarkerPosition(newUserPosition);
      if (map) {
        map.panTo(newUserPosition);
        map.setZoom(17);
      }
      setLatitude(lat);
      setLongitude(lng);
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const newUserPosition = { lat: latitude, lng: longitude };
          setMarkerPosition(newUserPosition);
          if (map) {
            map.panTo(newUserPosition);
            map.setZoom(17);
          }
          setLatitude(latitude);
          setLongitude(longitude);
        },
        (error) => {
          console.error("Error getting user location: ", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  const handleMapClick = (e) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    console.log(`Clicked Location: Lat: ${lat}, Lng: ${lng}`);
    setLatitude(lat);
    setLongitude(lng);
    setMarkerPosition({ lat, lng });

    if (geocoder) {
      geocoder.geocode({ location: { lat, lng } }, (results, status) => {
        if (status === window.google.maps.GeocoderStatus.OK && results[0]) {
          const address = results[0].formatted_address;
          console.log(`Address from Geocoder: ${address}`);
          setAddress(address);
        } else {
          console.error("Geocoder failed due to: " + status);
          setAddress("");
        }
      });
    } else {
      console.error("Geocoder is not initialized.");
    }
  };

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <div className="w-full h-96">
      <GoogleMap
        mapContainerClassName="map-container"
        center={center}
        zoom={14}
        onLoad={(map) => setMap(map)}
        onClick={handleMapClick}
        options={{
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
          gestureHandling: "cooperative",
        }}
      >
        <button
          onClick={getCurrentLocation}
          className="z-50 flex items-center justify-center size-12 transition duration-300 rounded-full hover:bg-slate-100 bg-white border-2 absolute right-[10px] top-[17px]"
        >
          <FaLocationArrow className="text-xl text-black" />
        </button>
        <Marker
          draggable
          animation={window.google.maps.Animation.DROP}
          position={markerPosition}
        />
      </GoogleMap>
    </div>
  );
};

export default GoogleMaps;
