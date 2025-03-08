import NavBar from "../components/NavBar";
import NearList from "../components/NearList";
import FilterList from "../components/FilterList";
import styles from "./HomePage.module.css";
import Features from "../components/Features";
import Reviews from "../components/Reviews";
import Contact from "../components/Contact";
import Notifications from "../components/Notifications";
import Profile from "./Profile"; // Import Profile component

export default function HomePage({
  showNotif,
  setShowNotif,
  loggedIn,
  setLoggedIn,
  showChat,
  setShowChat
}) {
  return (
    <>
      <NavBar
        setShowNotif={setShowNotif}
        loggedIn={loggedIn}
        setLoggedIn={setLoggedIn}
        showChat={showChat}
        setShowChat={setShowChat}
      />

      {!loggedIn ? (
        <>
          <h1 className={styles.heading}>
            Don't know where and with whom to stay? We've Got You.
          </h1>
          <h5 className={styles.desc}>
            StayMate connects you with the perfect roommate based on your
            location and preferences. Find like-minded people nearby and
            discover your ideal living match effortlessly.
          </h5>
          <Features />
          <Reviews />
          <Contact />
          {showNotif && <Notifications />}
        </>
      ) : (
        <>
          <Profile />
          {showNotif && <Notifications />}
        </>
      )}
    </>
  );
}
