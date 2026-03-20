import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import { useState } from "react";

const containerStyle = {
  width: "100%",
  height: "300px",
};

export default function GoogleMapView({ lat, lng }) {
  const [map, setMap] = useState(null);
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: apiKey || "",
  });

  // Ensure coordinates are valid numbers
  const parsedLat = typeof lat === "number" ? lat : null;
  const parsedLng = typeof lng === "number" ? lng : null;

  const isValidCoords =
    parsedLat !== null &&
    parsedLng !== null &&
    isFinite(parsedLat) &&
    isFinite(parsedLng) &&
    parsedLat >= -90 &&
    parsedLat <= 90 &&
    parsedLng >= -180 &&
    parsedLng <= 180;

  if (!apiKey)
    return (
      <div className="h-[300px] flex items-center justify-center bg-[#F9F6F4] rounded-xl text-red-500 text-sm p-4 text-center">
        Google Maps API key is missing. Please check your environment variables.
      </div>
    );

  if (loadError)
    return (
      <div className="h-[300px] flex items-center justify-center bg-[#F9F6F4] rounded-xl text-red-500 text-sm p-4 text-center">
        Error loading Google Maps. Please check your API key and restriction
        settings.
      </div>
    );

  if (!isLoaded || !window.google || !window.google.maps || !window.google.maps.Map)
    return <p className="p-4 text-center">Loading map resources...</p>;
  if (!isValidCoords)
    return (
      <div className="h-[300px] flex items-center justify-center bg-[#F9F6F4] rounded-xl text-[#7A7676] text-sm p-4 text-center">
        Location unavailable
      </div>
    );

  const center = { lat: parsedLat, lng: parsedLng };

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={14}
      onLoad={(map) => setMap(map)}
      onUnmount={() => setMap(null)}
    >
      {map && <Marker position={center} />}
    </GoogleMap>
  );
}
