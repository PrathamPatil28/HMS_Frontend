import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect } from "react";

// --- 1. FIX ICONS & CREATE COLORED MARKERS ---
// We use CSS filters to change marker colors visually without needing new image files
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

const DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
});

// Green Icon for Pickup
const PickupIcon = L.icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
});

// Red Icon for Drop
const DropIcon = L.icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
});

L.Marker.prototype.options.icon = DefaultIcon;

// --- 2. AUTO-ZOOM COMPONENT ---
// This calculates the box containing both points and zooms the map to fit them
const FitBounds = ({ pickup, drop }: { pickup: [number, number]; drop: [number, number] | null }) => {
    const map = useMap();

    useEffect(() => {
        if (pickup && drop) {
            // If we have both points, fit the map to show the route
            const bounds = L.latLngBounds([pickup, drop]);
            map.fitBounds(bounds, { padding: [50, 50] }); // Add padding so markers aren't on the edge
        } else if (pickup) {
            // If only pickup exists, fly to it
            map.flyTo(pickup, 15);
        }
    }, [pickup, drop, map]);

    return null;
};

// --- 3. MAIN COMPONENT ---
interface RouteMapProps {
    pickupLat: number;
    pickupLng: number;
    dropLat?: number | null;
    dropLng?: number | null;
}

const RouteMap = ({ pickupLat, pickupLng, dropLat, dropLng }: RouteMapProps) => {
    // Safety check
    if (!pickupLat || !pickupLng) {
        return (
            <div className="h-64 w-full bg-gray-100 flex items-center justify-center text-gray-500 rounded-xl">
                Location data unavailable
            </div>
        );
    }

    const pickup: [number, number] = [pickupLat, pickupLng];
    const drop: [number, number] | null = (dropLat && dropLng) ? [dropLat, dropLng] : null;

    // Define line path
    const routeLine = drop ? [pickup, drop] : [];

    return (
        <MapContainer 
            center={pickup} 
            zoom={13} 
            scrollWheelZoom={true} 
            style={{ height: "100%", width: "100%", borderRadius: "12px", zIndex: 0 }}
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; OpenStreetMap contributors'
            />

            {/* PICKUP MARKER (Green) */}
            <Marker position={pickup} icon={PickupIcon}>
                <Popup>
                    <strong>Pickup Location</strong><br/> Start here.
                </Popup>
            </Marker>

            {/* DROP MARKER (Red) - Only if coordinates exist */}
            {drop && (
                <Marker position={drop} icon={DropIcon}>
                    <Popup>
                        <strong>Destination</strong><br/> Drop patient here.
                    </Popup>
                </Marker>
            )}

            {/* ROUTE LINE (Blue) */}
            {drop && (
                <Polyline 
                    positions={routeLine as any} 
                    pathOptions={{ color: 'blue', weight: 4, opacity: 0.7, dashArray: '10, 10' }} 
                />
            )}

            {/* Auto Zoom Logic */}
            <FitBounds pickup={pickup} drop={drop} />
        </MapContainer>
    );
};

export default RouteMap;