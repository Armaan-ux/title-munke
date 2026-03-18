import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "300px",
};

export default function GoogleMapView({ lat, lng }) {
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

  if (!isLoaded) return <p>Loading map...</p>;
  if (!isValidCoords) return <p className="mt-60">Location unavailable</p>;

  const center = { lat: parsedLat, lng: parsedLng };

  return (
    <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={14}>
      <Marker position={center} />
    </GoogleMap>
  );
}
