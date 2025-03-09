import styles from "./NearList.module.css";
import { useContext } from "react";
import { UsersContext } from "../context/UsersContext";
import Loading from "./Loading";
import Neighbor from "./Neighbor";
import { AuthContext } from "../context/AuthContext";
import NoResultsFound from "./NoResultsFound";

export default function NearList() {
  const { users, loading } = useContext(UsersContext);
  const { user } = useContext(AuthContext);

  function getDistance(lat1, lon1, lat2, lon2) {
    const earthRadius = 6371; 

    function toRadians(degrees) {
      return (degrees * Math.PI) / 180;
    }

    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
    const lat1Rad = toRadians(lat1);
    const lat2Rad = toRadians(lat2);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1Rad) *
        Math.cos(lat2Rad) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return earthRadius * c; 
  }

  const neighborList = users.filter(
    (u) =>
      u.lookingForRoommate === true &&
      u._id !== user._id &&
      getDistance(user.latitude, user.longitude, u.latitude, u.longitude) <= 20
  );

  return (
    <div className={styles.container}>
      {loading ? (
        <Loading />
      ) : (
        <>
          <h3 style={{color:'black'}}>People around you looking for Roommates (within 20km)</h3>
          {neighborList.length ? (
            <ul className={styles.nearList}>
              {neighborList.map((neighbor) => (
                <Neighbor key={neighbor._id} user={neighbor} />
              ))}
            </ul>
          ) : (
            <p style={{ fontSize: "1.5rem", color: "gray" }}><NoResultsFound/></p>
          )}
        </>
      )}
    </div>
  );
}
