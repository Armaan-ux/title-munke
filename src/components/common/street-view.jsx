import {
  GoogleMap,
  StreetViewPanorama,
  useLoadScript,
} from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "300px",
};

export default function StreetView({ lat, lng }) {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });
  const isValidCoords =
    typeof lat === "number" &&
    typeof lng === "number" &&
    !isNaN(lat) &&
    !isNaN(lng);
  if (!isLoaded) return <p>Loading map...</p>;
  if (!isValidCoords) return <p className="mt-10">Street Location unavailable</p>;
  const center = { lat, lng };
  return (
    <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={14}>
      <StreetViewPanorama
        position={center}
        visible={true}
        options={{
          pov: { heading: 100, pitch: 0 },
          zoom: 1,
        }}
      />
    </GoogleMap>
  );
}
