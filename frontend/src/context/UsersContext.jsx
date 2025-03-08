import { createContext, useState, useEffect } from "react";

export const UsersContext = createContext();

export function UsersProvider({ children }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("http://localhost:8000/users", {
        method: "GET",
        credentials: "include", // Ensure cookies are sent with the request
      });
      if (!response.ok) throw new Error("Failed to fetch users");
      const data = await response.json();
      console.log(data.data.users)
      console.log('Users Fetched')
      setUsers(data.data.users);
    } catch (error) {
      console.error("Error fetching users:", error);
      setError(error.message);
      
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <UsersContext.Provider value={{ users, loading, error, fetchUsers }}>
      {children}
    </UsersContext.Provider>
  );
}
