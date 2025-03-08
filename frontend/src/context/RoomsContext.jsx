import { createContext, useState, useEffect } from "react";

export const RoomsContext = createContext();

export const RoomsProvider = ({ children }) => {
  const [rooms, setRooms] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);

  // Get user location
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
      },
      (error) => console.error("Error getting location:", error)
    );
  }, []);

  // Fetch rooms from backend
  useEffect(() => {
    if (latitude && longitude) {
      setLoading(true);
      fetch(
        `http://localhost:8000/rooms?latitude=${latitude}&longitude=${longitude}&page=${page}&limit=10`
      )
        .then((res) => res.json())
        .then((data) => {
          if (data.rooms.length === 0) {
            setHasMore(false);
          } else {
            setRooms((prevRooms) => [...prevRooms, ...data.rooms]);
          }
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching rooms:", error);
          setLoading(false);
        });
    }
  }, [page, latitude, longitude]);

  return (
    <RoomsContext.Provider value={{ rooms, setPage, loading, hasMore }}>
      {children}
    </RoomsContext.Provider>
  );
};
