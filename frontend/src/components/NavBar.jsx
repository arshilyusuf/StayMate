import { useState, useContext } from "react";
import SignInModal from "./SignInModal";
import styles from "./NavBar.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faBed, faSearch } from "@fortawesome/free-solid-svg-icons";
import { Navigate, NavLink } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Loading from "./Loading";
export default function NavBar({
  setShowNotif,
  
  setLoggedIn,
  
}) {
  const [showSignIn, setShowSignIn] = useState(false);
  const { user, loggedIn } = useContext(AuthContext);

  return (
    <>
      <nav className={styles.nav}>
        <h1 className={styles.heading}>StayMate</h1>
        <div className={styles.options}>
          {loggedIn ? (
            <>
              <span
                onClick={() => setShowNotif(false)}
                style={{ color: "white" }}
              >
                <NavLink to="/" style={{ color: "white" }}>
                  <FontAwesomeIcon icon={faSearch} />
                </NavLink>
              </span>
              <span onClick={() => setShowNotif((b) => !b)}>
                <FontAwesomeIcon icon={faBell} />
              </span>
              {/* <span
                onClick={() => setShowNotif(false)}
                style={{ color: "white" }}
              >
                <NavLink to="/chat" style={{ color: "white" }}>
                  <FontAwesomeIcon
                    icon={faComments}
                    onClick={() => setShowChat(true)}
                  />
                </NavLink>
              </span> */}
              <span onClick={() => setShowNotif(false)}>
                <NavLink to="/room">
                  <FontAwesomeIcon icon={faBed} style={{ color: "white" }} />
                </NavLink>
              </span>
              <NavLink to="/user" style={{ color: "white" }}>
                <span
                  style={{
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  onClick={()=>setShowNotif(false)}
                >
                  <img className={styles.userImage} src={user.photo} alt="" />
                </span>
              </NavLink>
            </>
          ) : (
            // Show Sign In option only when user is not logged in
            <span
              className={styles.login}
              style={{ fontSize: "1rem", cursor: "pointer" }}
              onClick={() => {
                setShowSignIn(true);
                setShowNotif(false);
              }}
            >
              <p>Log In</p>
            </span>
          )}
        </div>
      </nav>

      {showSignIn && (
        <SignInModal
          setLoggedIn={setLoggedIn}
          closeModal={() => setShowSignIn(false)}
        />
      )}
    </>
  );
}
