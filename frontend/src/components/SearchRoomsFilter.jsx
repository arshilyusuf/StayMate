import { useState, useEffect, useContext } from "react";
import styles from "./SearchRoomsFilter.module.css";
import { AuthContext } from "../context/AuthContext";

export default function SearchRoomsFilter({ rooms, setFilteredRooms }) {
  const { user } = useContext(AuthContext);

  const [filters, setFilters] = useState({
    priceRange: 1000,
    distanceRange: 10,
  });

  useEffect(() => {
    applyFilters();
  }, [filters, rooms, user]); 

  const haversineDistance = (lat1, lon1, lat2, lon2) => {
    const toRad = (angle) => (Math.PI / 180) * angle;
    const R = 6371; // Earth's radius in km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const applyFilters = () => {
    if (!user || !rooms) return;

    const filtered = rooms.filter((room) => {
      const isNotOwnProperty = String(room.owner) !== String(user._id);
      console.log(
        `Room ID: ${room._id} | Owner: ${room.owner} | User ID: ${user._id} | Included: ${isNotOwnProperty}`
      );

      const isWithinPrice = room.price <= filters.priceRange;
      const distance = haversineDistance(
        user.latitude,
        user.longitude,
        room.latitude,
        room.longitude
      );
      const isWithinDistance = distance <= filters.distanceRange;

      return isNotOwnProperty && isWithinPrice && isWithinDistance;
    });
    const filteredList = filtered.filter((room)=>{
      return room.owner._id!==user._id
    })
    console.log(filteredList)
    setFilteredRooms(filteredList);
  };

  return (
    <div className={styles.filterContainer}>
      <h1 style={{ marginBottom: "1rem" }}>Filter Rooms</h1>

      <div className={styles.filterGroup}>
        <label>Max Price: ₹{filters.priceRange}</label>
        <input
          type="range"
          min="100"
          max="100000"
          step="50"
          value={filters.priceRange}
          onChange={(e) =>
            setFilters({ ...filters, priceRange: Number(e.target.value) })
          }
        />
      </div>

      <div className={styles.filterGroup}>
        <label>Max Distance: {filters.distanceRange} km</label>
        <input
          type="range"
          min="1"
          max="100"
          step="1"
          value={filters.distanceRange}
          onChange={(e) =>
            setFilters({ ...filters, distanceRange: Number(e.target.value) })
          }
        />
      </div>
    </div>
  );
}
