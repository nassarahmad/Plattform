import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export default function Map({ requests }) {
  return (
    <MapContainer center={[31.95, 35.91]} zoom={13} style={{ height: "400px" }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {requests.map((req) => (
        <Marker key={req.id} position={[req.lat, req.lng]}>
          <Popup>
            <b>{req.user}</b><br />
            {req.message}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}