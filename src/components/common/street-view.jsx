import { GoogleMap, StreetViewPanorama, useLoadScript } from "@react-google-maps/api";
import React, { useMemo } from "react";

const containerStyle = {
  width: "100%",
  height: "300px",
};

export default function StreetView({ lat, lng }) {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
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

  const position = useMemo(
    () => ({ lat: parsedLat, lng: parsedLng }),
    [parsedLat, parsedLng]
  );

  if (!isLoaded) return <p>Loading map...</p>;
  if (!isValidCoords) return <p className="mt-10">Street location unavailable</p>;

  return (
    <GoogleMap mapContainerStyle={containerStyle} center={position} zoom={14}>
      <StreetViewPanorama
        position={position}
        visible={true}
        options={{
          pov: { heading: 100, pitch: 0 },
          zoom: 1,
          disableDefaultUI: true,
          panControl: true,
          zoomControl: true,
          fullscreenControl: true,
        }}
      />
    </GoogleMap>
  );
}
