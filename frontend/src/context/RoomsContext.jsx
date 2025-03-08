import { createContext, useState, useEffect } from "react";

export const RoomsContext = createContext();

export const RoomsProvider = ({ children }) => {
  const [rooms, setRooms] = useState([]); 
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRooms = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `http://localhost:8000/rooms?page=${page}&limit=5`
        );

        const data = await response.json();
        console.log("API Response:", data);

        if (response.ok) {
          setRooms((prevRooms) => [...prevRooms, ...data.rooms]); 
          setHasMore(data.rooms.length > 0); 
        }
      } catch (error) {
        console.error("Error fetching rooms:", error);
      }
      setLoading(false);
    };

    fetchRooms();
  }, [page]); 

  return (
    <RoomsContext.Provider value={{ rooms,setRooms, setPage, loading,setLoading, hasMore }}>
      {children}
    </RoomsContext.Provider>
  );
};
