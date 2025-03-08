import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);
      const [loading, setLoading] = useState(false);
      
  const checkAuthStatus = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:8000/users/me", {
        method: "GET",
        credentials: "include", // ✅ Sends cookies with the request
      });

      if (response.ok) {
        const data = await response.json();
        console.log("✅ User authenticated:", data.user);
        setUser(data.user);
        setLoggedIn(true);
      } else {
        console.log("❌ User not authenticated.");
        setUser(null);
        setLoggedIn(false);
      }
    } catch (error) {
      console.error("⚠️ Error checking auth status:", error);
      setUser(null);
      setLoggedIn(false);
    }finally{
      setLoading(false);
    }
  };


  useEffect(() => {
    checkAuthStatus();
  }, []);

  const loginUser = async (email, password) => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:8000/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include", // ✅ Ensures cookies are sent/received
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      console.log("🔹 Login successful:", data.user);
      setUser(data.user);
      setLoggedIn(true);

      return data; // Return user data after login
    } catch (error) {
      console.error("❌ Login failed:", error.message);
      throw error;
    }finally{
      setLoading(false);
    }
  };


  const logoutUser = async () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");

    if (!confirmLogout) return; 
    try {
      setLoading(true);
      await fetch("http://localhost:8000/users/logout", {
        method: "POST",
        credentials: "include", // Sends cookies with request
      });

      console.log("🔹 Logged out successfully");
      setUser(null);
      setLoggedIn(false);
    } catch (error) {
      console.error("⚠️ Logout error:", error);
    }
    finally{
      setLoading(false);
      }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loggedIn,setLoggedIn, loginUser, logoutUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
