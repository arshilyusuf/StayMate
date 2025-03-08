import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NeighborProfile from "./pages/NeighborProfile";
import HomePage from "./pages/HomePage";
import Chat from "./pages/Chat";
import User from "./pages/User";
import Room from "./pages/Room";
import SignUp from "./pages/SignUp";
import { AuthContext } from "./context/AuthContext";
import { useState, useContext } from "react";
import PostProperty from "./pages/PostProperty";

function App() {
  const [showNotif, setShowNotif] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const { loggedIn, setLoggedIn } = useContext(AuthContext);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <HomePage
              showNotif={showNotif}
              setShowNotif={setShowNotif}
              loggedIn={loggedIn}
              setLoggedIn={setLoggedIn}
              showChat={showChat}
              setShowChat={setShowChat}
            />
          }
        />
        <Route
          path="/chat"
          element={
            <Chat
              showNotif={showNotif}
              setShowNotif={setShowNotif}
              loggedIn={loggedIn}
              setLoggedIn={setLoggedIn}
              showChat={showChat}
              setShowChat={setShowChat}
            />
          }
        />
        <Route
          path="/user"
          element={
            <User
              showNotif={showNotif}
              setShowNotif={setShowNotif}
              loggedIn={loggedIn}
              setLoggedIn={setLoggedIn}
              showChat={showChat}
              setShowChat={setShowChat}
            />
          }
        />
        <Route
          path="/room"
          element={
            <Room
              showNotif={showNotif}
              setShowNotif={setShowNotif}
              loggedIn={loggedIn}
              setLoggedIn={setLoggedIn}
              showChat={showChat}
              setShowChat={setShowChat}
            />
          }
        />
        <Route path="/signup" element={<SignUp setLoggedIn={setLoggedIn} />} />


        {/* Add this new route */}
        <Route path="/profile/:id" element={<NeighborProfile />} />
        <Route path="/rooms/post" element={<PostProperty/>} />
      </Routes>
    </Router>
  );
}

export default App;
