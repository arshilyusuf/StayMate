import { useState, useContext, useEffect } from "react";
import styles from "./SearchByFilter.module.css";
import { UsersContext } from "../context/UsersContext";
import { AuthContext } from "../context/AuthContext";
import FilterList from "./FilterList";

export default function SearchByFilter({filteredUsers, setFilteredUsers}) {
  const { users } = useContext(UsersContext);
  const { user } = useContext(AuthContext);
  
  const initialFilter = {
    searchQuery: "",
    gender: "",
    ageRange: 18,
    distanceRange: 2,
    dietaryPreference: "",
    locationQuery: "",
  };

   const [filters, setFilters] = useState(
     JSON.parse(localStorage.getItem("filters")) || initialFilter
   );
   
   const [showFilteredUsers, setShowFilteredUsers] = useState(
     JSON.parse(localStorage.getItem("showFilteredUsers")) || false
   );

   useEffect(() => {
     localStorage.setItem("filters", JSON.stringify(filters));
     localStorage.setItem(
       "showFilteredUsers",
       JSON.stringify(showFilteredUsers)
     );
   }, [filters, showFilteredUsers]);

   useEffect(() => {
     if (filteredUsers.length > 0) {
       localStorage.setItem("filteredUsers", JSON.stringify(filteredUsers));
     }
   }, [filteredUsers]);


 const handleChange = (e) => {
   const { name, value } = e.target;

   setFilters((prev) => ({
     ...prev,
     [name]: name === "distanceRange" ? Number(value) : value,
     ...(name === "locationQuery" && value !== "" ? { distanceRange: 2 } : {}),
     ...(name === "distanceRange" && value !== "" ? { locationQuery: "" } : {}),
   }));
 };

  const haversineDistance = (lat1, lon1, lat2, lon2) => {
    const toRad = (angle) => (Math.PI / 180) * angle;
    const R = 6371; // Radius of Earth in km

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
    let result = users.filter((u) => {
      let isWithinDistance = true;
      let matchesLocationQuery = true;

      if (filters.locationQuery) {
        matchesLocationQuery = u.location
          .toLowerCase()
          .includes(filters.locationQuery.toLowerCase());
      } else if (filters.distanceRange) {
        const distance = haversineDistance(
          user.latitude,
          user.longitude,
          u.latitude,
          u.longitude
        );
        isWithinDistance = distance <= filters.distanceRange;
      }

      return (
        u._id !== user._id &&
        (filters.searchQuery === "" ||
          u.name.toLowerCase().includes(filters.searchQuery.toLowerCase())) &&
        matchesLocationQuery &&
        isWithinDistance &&
        (filters.gender === "" || u.gender === filters.gender) &&
        (filters.ageRange === "" || u.age >= filters.ageRange) &&
        (filters.dietaryPreference === "" ||
          u.dietaryPreference.toLowerCase() ===
            filters.dietaryPreference.toLowerCase())
      );
    });
 
    setFilteredUsers(result);
    setShowFilteredUsers(true);
  };

  const clearFilters = () => {
    setFilters(initialFilter);
    setFilteredUsers([]);
    setShowFilteredUsers(false);
    localStorage.removeItem("filters");
    localStorage.removeItem("filteredUsers");
    localStorage.removeItem("showFilteredUsers");
  };

  return (
    <div className={styles.searchByFilter}>
      <h4>Search by Filter</h4>
      <div className={styles.options}>
        <div className={styles.filterGroup}>
          <label>Search by Name:</label>
          <input
            type="text"
            placeholder="Enter name..."
            name="searchQuery"
            value={filters.searchQuery}
            onChange={handleChange}
          />
        </div>

        <div className={styles.filterGroup}>
          <label>Search by Location:</label>
          <input
            type="text"
            placeholder="Enter location..."
            name="locationQuery"
            value={filters.locationQuery}
            onChange={handleChange}
          />
        </div>

        <div className={styles.filterGroup}>
          <label>
            Distance Radius: {filters.distanceRange}{" "}
            km
          </label>
          <input
            type="range"
            name="distanceRange"
            min="2"
            max="100"
            value={filters.distanceRange || 1} // Prevent empty string issue
            onChange={handleChange}
            disabled={filters.locationQuery !== ""}
          />
        </div>

        <div className={styles.filterGroup}>
          <label>Gender:</label>
          <select name="gender" value={filters.gender} onChange={handleChange}>
            <option value="">Any</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>

        <div className={styles.filterGroup}>
          <label>Age Range: {filters.ageRange}+</label>
          <input
            type="range"
            name="ageRange"
            min="18"
            max="60"
            value={filters.ageRange}
            onChange={handleChange}
          />
        </div>

        <div className={styles.filterGroup}>
          <label>Dietary Preference:</label>
          <select
            name="dietaryPreference"
            value={filters.dietaryPreference}
            onChange={handleChange}
          >
            <option value="">Any</option>
            <option value="veg">Vegetarian</option>
            <option value="nonveg">Non-Vegetarian</option>
          </select>
        </div>
      </div>

      <div className={styles.buttons}>
        <button onClick={applyFilters}>Apply Filters</button>
        <button
          onClick={clearFilters}
          className={styles.clearButton}
          style={{ backgroundColor: "rgb(255, 77, 77, 0.9)" }}
        >
          Clear Filters
        </button>
      </div>

      {showFilteredUsers && <FilterList users={filteredUsers} />}
      
    </div>
  );
}
