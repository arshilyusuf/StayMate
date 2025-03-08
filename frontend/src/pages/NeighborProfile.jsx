import { useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { UsersContext } from "../context/UsersContext";
import { AuthContext } from "../context/AuthContext"; // Import AuthContext
import styles from "./NeighborProfile.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

export default function NeighborProfile() {
  const { id } = useParams();
  const { users } = useContext(UsersContext);
  const { user: loggedInUser } = useContext(AuthContext); // Get logged-in user
  const navigate = useNavigate();
  const [requestSent, setRequestSent] = useState(false);
  const [error, setError] = useState("");

  const user = users.find((u) => u._id === id);
  if (!user) return <p>User not found.</p>;

  async function handleSendRequest() {
    if (!loggedInUser) {
      setError("You must be logged in to send a request.");
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/requests/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Send token for authentication
        },
        body: JSON.stringify({
          senderId: loggedInUser._id,
          receiverId: user._id,
        }),
        credentials:"include"
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to send request");
      }
      
      console.log("Sending request to:", user._id);
      setRequestSent(true);
      setTimeout(() => setRequestSent(false), 3000);
    } catch (err) {
      console.log(` front end error ${err}`)
      setError(err.message);
    }
  }

  return (
    <div className={styles.pageContainer}>
      <div className={styles.profileContainer}>
        <button className={styles.closeButton} onClick={() => navigate(-1)}>
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>

        {/* Left Section - Profile Picture */}
        <div className={styles.leftSection}>
          <img
            src={user.photo || "https://avatar.iran.liara.run/public/41"}
            alt="Profile"
            className={styles.profilePic}
          />
          <h2>
            {user.name}, {user.age}
          </h2>
          <p className={styles.gender}>
            {user.gender.charAt(0).toUpperCase() + user.gender.slice(1)}
          </p>
          <p className={styles.occupation}>{user.occupation}</p>
        </div>

        {/* Right Section - Details */}
        <div className={styles.rightSection}>
          <div className={styles.inputGroup}>
            <label className={styles.boldLabel}>Email</label>
            <p className={styles.inputField}>{user.email}</p>
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.boldLabel}>Phone</label>
            <p className={styles.inputField}>{user.phone}</p>
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.boldLabel}>Location</label>
            <p className={styles.inputField}>
              {user.location.charAt(0).toUpperCase() + user.location.slice(1)}
            </p>
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.boldLabel}>Dietary Preference</label>
            <p className={styles.inputField}>
              {user.dietaryPreference
                ? user.dietaryPreference.charAt(0).toUpperCase() +
                  user.dietaryPreference.slice(1)
                : "Any"}
            </p>
          </div>

          {/* Action Buttons */}
          <div className={styles.buttons}>
            <button
              className={styles.requestButton}
              onClick={handleSendRequest}
              disabled={requestSent}
            >
              {(error && <p className={styles.errorMessage}>{error}</p>)||
              (requestSent ? "Request Sent ✅" : "Send Request")}
            </button>
          </div>

          {/* Show error message if any */}
        </div>
      </div>
    </div>
  );
}
