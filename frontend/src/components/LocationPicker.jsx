import { useContext, useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import styles from "./LocationPicker.module.css";
import "leaflet/dist/leaflet.css";
import { AuthContext } from "../context/AuthContext";
const LocationPicker = ({ onSelectLocation, onClose }) => {
  const [selectedPosition, setSelectedPosition] = useState(null);
      const {user} = useContext(AuthContext)
  const handleConfirm = () => {
    if (selectedPosition) {
      onSelectLocation(selectedPosition); // Send selected location back
    }
    onClose();
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.mapContainer}>
        <MapContainer
          center={ [user.latitude,user.longitude]} // Default location (India)
          zoom={12}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <MapClickHandler setSelectedPosition={setSelectedPosition} />
          {selectedPosition && <Marker position={selectedPosition} />}
        </MapContainer>

        <div className={styles.controls}>
          <button className={styles.confirmButton} onClick={handleConfirm}>
            Confirm
          </button>
          <button className={styles.cancelButton} onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

const MapClickHandler = ({ setSelectedPosition }) => {
  useMapEvents({
    click(e) {
      setSelectedPosition(e.latlng);
    },
  });

  return null;
};

export default LocationPicker;
