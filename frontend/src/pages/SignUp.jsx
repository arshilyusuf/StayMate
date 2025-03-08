import { useState, useContext } from "react";
import styles from "./SignUp.module.css";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
function SignUp() {
  const navigate = useNavigate();
  const {setLoggedIn} = useContext(AuthContext)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    passwordConfirm: "",
    phone: "",
    age: "",
    gender: "male",
    occupation: "",
    dietaryPreference: "other",
    location: "",
    latitude: "",
    longitude: "",
    lookingForRoommate: false,
    photo: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, photo: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };
  const handleSetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData((prev) => ({
            ...prev,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          }));
        },
        (error) => {
          console.error("Error getting location:", error);
          alert("Unable to retrieve location. Please enable location access.");
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Ensure passwords match before sending request
    if (formData.password !== formData.passwordConfirm) {
      alert("Passwords do not match");
      return;
    }

    // Ensure default photo is set if none is provided
    const formDataToSend = {
      ...formData,
      photo: formData.photo || "https://avatar.iran.liara.run/public/41",
    };

    try {
      const response = await fetch("http://localhost:8000/users/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formDataToSend),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Signup failed");
      }

      // Store JWT token & update auth state
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.data.user)); // Store user data
      alert("Signup successful!");
      setLoggedIn(true);
      navigate("/"); // Redirect to home page
    } catch (error) {
      console.error("Error signing up:", error);
      alert(error.message);
    }
  };


  return (
    <div className={styles.userContainer}>
      <form className={styles.rightSection} onSubmit={handleSubmit}>
        <div className={styles.image}>
          <img
            src={formData.photo || "https://avatar.iran.liara.run/public/41"}
            alt="Profile"
          />
        </div>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className={styles.fileInput} // Hide the input field
          id="upload-photo"
        />
        <label htmlFor="upload-photo" className={styles.uploadButton}>
          Upload Photo
        </label>

        <div className={styles.inputGroup}>
          <label>Name</label>
          <input
            type="text"
            className={styles.nameInput}
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
        </div>
        <div className={styles.inputGroup}>
          <label>Email</label>
          <input
            type="email"
            name="email"
            className={styles.inputField}
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.inputGroup}>
          <label>Password</label>
          <input
            type="password"
            name="password"
            className={styles.inputField}
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.inputGroup}>
          <label>Confirm Password</label>
          <input
            type="password"
            name="passwordConfirm"
            className={styles.inputField}
            value={formData.passwordConfirm}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.inputGroup}>
          <label>Phone</label>
          <input
            type="tel"
            name="phone"
            className={styles.inputField}
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.inputGroup}>
          <label>Age</label>
          <input
            type="number"
            name="age"
            className={styles.inputField}
            value={formData.age}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.inputGroup}>
          <label>Gender</label>
          <select
            name="gender"
            className={styles.inputField}
            value={formData.gender}
            onChange={handleChange}
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div className={styles.inputGroup}>
          <label>Occupation</label>
          <input
            type="text"
            name="occupation"
            className={styles.inputField}
            value={formData.occupation}
            onChange={handleChange}
          />
        </div>
        <div className={styles.inputGroup}>
          <label>Dietary Preference</label>
          <select
            name="dietaryPreference"
            className={styles.inputField}
            value={formData.dietaryPreference}
            onChange={handleChange}
          >
            <option value="vegetarian">Vegetarian</option>
            <option value="non-vegetarian">Non-Vegetarian</option>
          </select>
        </div>
        <div className={styles.inputGroup}>
          <label>Location</label>
          <input
            type="text"
            name="location"
            className={styles.inputField}
            value={formData.location}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.inputGroup}>
          <label>Latitude</label>
          <input
            type="text"
            name="latitude"
            className={styles.inputField}
            value={formData.latitude}
            onChange={handleChange}
          />
        </div>
        <div className={styles.inputGroup}>
          <label>Longitude</label>
          <input
            type="text"
            name="longitude"
            className={styles.inputField}
            value={formData.longitude}
            onChange={handleChange}
          />
        </div>

        <button
          type="button"
          className={styles.button}
          onClick={handleSetLocation}
        >
          Set Location
        </button>

        <div className={styles.roommate}>
          <h3>Looking for Roommate?</h3>
          <input
            type="checkbox"
            name="lookingForRoommate"
            checked={formData.lookingForRoommate}
            onChange={handleChange}
          />
        </div>
        <button type="submit" className={styles.submit}>
          Sign Up
        </button>
      </form>
      <button
        type="submit"
        className={styles.cancel}
        onClick={() => {
          setLoggedIn(false);
          navigate("/");
        }}
      >
        Cancel
      </button>
    </div>
  );
}

export default SignUp;
