import { AdvancedMarker, APIProvider, Map } from '@vis.gl/react-google-maps';

type GoogleMapProps = {
  coordinates: [number, number];
};

const GoogleMapForLocation: React.FC<GoogleMapProps> = ({ coordinates = [0, 0] }) => {  
  const position = { lat: coordinates[1], lng: coordinates[0] };

  const mapContainerStyle = {
    width: "100%",
    height: "192px",
  };

  return (
    <div style={{ width: "100%", height: "100%", border: "2px solid blue" }}>
      <APIProvider
        apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY!}
      >
        <Map
          style={mapContainerStyle}
          mapId={import.meta.env.VITE_MAP_ID}
          defaultCenter={position}
          defaultZoom={14}
        >
          <AdvancedMarker position={position} />
        </Map>
      </APIProvider>
    </div>
  );
};

export default GoogleMapForLocation;
