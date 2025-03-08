import { useEffect, useState } from "react";
import styles from "./Notifications.module.css";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Loading from "./Loading";

function Notification({ senderId, senderName, requestId, onDelete }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/profile/${senderId}`); 
  };

  const handleDeleteRequest = async () => {
    try {
      const response = await fetch("http://localhost:8000/requests/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          requestId: requestId,
          status: "declined",
        }),
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to decline request");
      }

      onDelete(requestId);
    } catch (error) {
      console.error("Error declining request:", error);
    }
  };

  return (
    <div className={styles.notification}>
      <p>
        <span className={styles.senderName} onClick={handleClick}>
          {senderName}
        </span>{" "}
        sent you a roommate request!
      </p>
      <button className={styles.deleteRequest} onClick={handleDeleteRequest}>
        <FontAwesomeIcon icon={faXmark} />
      </button>
    </div>
  );
}

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchNotifications() {
      try {
        setLoading(true);
        console.log("Fetching notifications...");

        const response = await fetch(
          "http://localhost:8000/requests/notifications",
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch notifications");
        }

        const data = await response.json();
        setNotifications(data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchNotifications();
  }, []);

  const handleDeleteNotification = (requestId) => {
    setNotifications((prev) => prev.filter((notif) => notif._id !== requestId));
  };

  return (
    <div className={styles.notifications}>
      {!loading ? (
        <>
          <h2>Notifications</h2>
          {notifications.length > 0 ? (
            <ul>
              {notifications.map((notif) => (
                <li key={notif._id}>
                  <Notification
                    senderId={notif.sender._id}
                    senderName={notif.sender.name}
                    requestId={notif._id}
                    onDelete={handleDeleteNotification}
                  />
                </li>
              ))}
            </ul>
          ) : (
            <p>No New Notifications</p>
          )}
        </>
      ) : (
        <Loading />
      )}
    </div>
  );
}
