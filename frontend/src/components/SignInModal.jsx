import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import styles from "./SignInModal.module.css"
import Loading from "./Loading";

export default function SignInModal({ closeModal }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const { loginUser , loading} = useContext(AuthContext); // Assuming this updates user context

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await loginUser(formData.email, formData.password); // Calls the login function
      closeModal(); // Close modal
      navigate("/"); // Redirect to homepage
    } catch (error) {
      console.error("Login error:", error.message);
      setError(error.message);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: "101",
      }}
    >
      {loading ? (
        <Loading />
      ) : (
        <div
          style={{
            background: "white",
            padding: "2rem",
            borderRadius: "10px",
            width: "350px",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
          }}
        >
          <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>Log In</h2>

          {error && (
            <p
              style={{
                color: "red",
                textAlign: "center",
                marginBottom: "1rem",
              }}
            >
              {error}
            </p>
          )}

          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            <label>
              Email:
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  marginTop: "0.3rem",
                  borderRadius: "5px",
                  border: "1px solid #ccc",
                }}
              />
            </label>

            <label>
              Password:
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  marginTop: "0.3rem",
                  borderRadius: "5px",
                  border: "1px solid #ccc",
                }}
              />
            </label>

            <button type="submit" className={styles.login}>
              Log In
            </button>
          </form>

          <p style={{ textAlign: "center", marginTop: "1rem" }}>
            Don't have an account?{" "}
            <a
              href="/signup"
              style={{
                color: "#007bff",
                textDecoration: "none",
                fontWeight: "600",
                cursor: "pointer",
              }}
              className={styles.signup}
            >
              Sign Up
            </a>
          </p>

          <button onClick={closeModal} className={styles.close}>
            Close
          </button>
        </div>
      )}
    </div>
  );
}
