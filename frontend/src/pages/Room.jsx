import { useContext } from "react";
import styles from "./Room.module.css";
import NavBar from "../components/NavBar";
import Notifications from "../components/Notifications";
import { RoomsContext } from "../context/RoomsContext";
import { useNavigate } from "react-router-dom";

function RoomItem({ image, name, price, capacity, description, phone, email }) {
  return (
    <div className={styles.roomItem}>
      <div>
        <img src={image} alt={name} />
      </div>
      <div className={styles.details}>
        <div className={styles.leftSection}>
          <h3>{name}</h3>
          <h4>${price}</h4>
          <h6>Capacity: {capacity}</h6>
          <p>{description}</p>
        </div>
        <div className={styles.rightSection}>
          <button className={styles.contactButton}>
            <p>Phone: {phone}</p>
            <p>Email: {email}</p>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Room({
  showNotif,
  setShowNotif,
  loggedIn,
  setLoggedIn,
  showChat,
  setShowChat,
}) {
  const { rooms, setPage, loading, hasMore } = useContext(RoomsContext);
  const navigate = useNavigate();
  return (
    <>
      <NavBar
        setShowNotif={setShowNotif}
        loggedIn={loggedIn}
        setLoggedIn={setLoggedIn}
        showChat={showChat}
        setShowChat={setShowChat}
      />
      <div className={styles.container}>
        <div className={styles.headerSection}>
          <h1>Places near you available for rent</h1>
          <div className={styles.buttons}>
            <button className={styles.Button} onClick={navigate("/rooms/post")}>
              <p>Post Property</p>
            </button>
            <button className={styles.Button}>
              <p>View My Properties</p>
            </button>
          </div>
        </div>
        <ul className={styles.roomList}>
          {rooms.map((room) => (
            <li key={room._id}>
              <RoomItem
                image={room.photos[0] || "default.jpg"}
                name={room.title}
                price={room.price}
                capacity={room.capacity || "N/A"}
                description={room.description}
                phone={room.phone || "N/A"}
                email={room.email || "N/A"}
              />
            </li>
          ))}
        </ul>

        {/* Load More Button */}
        {hasMore && !loading && (
          <button
            className={styles.loadMore}
            onClick={() => setPage((prevPage) => prevPage + 1)}
          >
            Load More
          </button>
        )}

        {/* Loading Indicator */}
        {loading && <p>Loading...</p>}
      </div>

      {showNotif && <Notifications />}
    </>
  );
}
