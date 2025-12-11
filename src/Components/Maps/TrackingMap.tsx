import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect } from "react";

// Fix Leaflet Icon issue in React
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

// Component to center map when coords change
const RecenterMap = ({ lat, lng }: { lat: number; lng: number }) => {
    const map = useMap();
    useEffect(() => {
        map.flyTo([lat, lng], 15);
    }, [lat, lng, map]);
    return null;
};

const TrackingMap = ({ lat, lng, popupText }: { lat: number; lng: number; popupText: string }) => {
    if (!lat || !lng) return <p className="text-center text-gray-500">Waiting for GPS signal...</p>;

    return (
        <MapContainer center={[lat, lng]} zoom={13} scrollWheelZoom={false} style={{ height: "350px", width: "100%", borderRadius: "12px", zIndex: 1 }}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <Marker position={[lat, lng]}>
                <Popup>{popupText}</Popup>
            </Marker>
            <RecenterMap lat={lat} lng={lng} />
        </MapContainer>
    );
};

export default TrackingMap;