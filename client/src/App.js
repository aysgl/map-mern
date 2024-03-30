import React, { useEffect, useState, useRef } from "react";
import Map, { Marker, Popup } from "react-map-gl";
import { Heart, Location } from "iconsax-react";
import axios from "axios";
import { format } from "timeago.js";
import "./style.scss";
import "mapbox-gl/dist/mapbox-gl.css";
import Register from "./components/Register";
import Login from "./components/Login";

const App = () => {
  const myStorage = window.localStorage;
  const [currentUser, setCurrentUser] = useState(myStorage.getItem("username"));
  const mapRef = useRef(null);

  const [viewport, setViewport] = useState({
    latitude: 47.040182,
    longitude: 17.071727,
    zoom: 2,
    transitionDuration: 500,
  });
  const [pins, setPins] = useState([]);
  const [selectPin, setSelectPin] = useState();
  const [newPlace, setNewPlace] = useState(null);
  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    rating: 1,
    latitude: newPlace?.lat,
    longitude: newPlace?.lng,
    username: currentUser,
    date: "",
  });

  const getPins = () => {
    axios
      .get("http://127.0.0.1:8080/api/pins")
      .then((res) => {
        setPins(res.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getPins();
  }, []);

  const handleMarker = (id, lat, lng) => {
    setSelectPin(id);
    setViewport({
      ...viewport,
      latitude: lat,
      longitude: lng,
      zoom: 8,
    });

    mapRef.current.getMap().flyTo({ center: [lng, lat] });
  };

  const handleAddClick = (e) => {
    e.preventDefault();
    const { lng, lat } = e.lngLat;
    setNewPlace({ lat, lng });
    setForm({
      title: "",
      description: "",
      rating: 1,
      username: currentUser,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { lng, lat } = newPlace;
    const newForm = {
      ...form,
      latitude: lat,
      longitude: lng,
    };

    axios
      .post("http://127.0.0.1:8080/api/pins", newForm)
      .then(() => {
        setPins([...pins, newForm]);
        setForm({
          title: "",
          description: "",
          rating: 1,
          username: currentUser,
        });
        setNewPlace(null);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleLogout = () => {
    setCurrentUser(null);
    myStorage.removeItem("user");
  };

  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <Map
        ref={mapRef}
        mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}
        initialViewState={viewport}
        style={{ width: "100%", height: "100%" }}
        mapStyle="mapbox://styles/mapbox/streets-v9"
        onDblClick={handleAddClick}
        onViewportChange={(nextViewport) => setViewport(nextViewport)}
      >
        {pins &&
          pins?.map((pin, index) => (
            <React.Fragment key={index}>
              <Marker
                longitude={pin.longitude}
                latitude={pin.latitude}
                anchor="bottom"
                onClick={() =>
                  handleMarker(pin._id, pin.latitude, pin.longitude)
                }
              >
                <Location
                  size="26"
                  color={pin.username === currentUser ? "#FF8A65" : "#697689"}
                  variant="Bulk"
                />
              </Marker>

              {pin._id === selectPin && (
                <Popup
                  longitude={pin.longitude}
                  latitude={pin.latitude}
                  closeOnClick={false}
                  anchor="left"
                >
                  <div className="card">
                    <h2>{pin.title}</h2>
                    <p>{pin.description}</p>
                    {[1, 2, 3, 4, 5].map((index) => (
                      <Heart
                        key={index}
                        size="12"
                        color="#FF8A65"
                        variant={pin.rating >= index ? "Bold" : "Linear"}
                      />
                    ))}
                    <p>
                      by <b>{pin.username}</b> {format(pin.createdAt)}
                    </p>
                  </div>
                </Popup>
              )}
            </React.Fragment>
          ))}
        {newPlace && (
          <Popup
            longitude={newPlace.lng}
            latitude={newPlace.lat}
            closeOnClick
            anchor="left"
          >
            <div className="card">
              <form onSubmit={handleSubmit}>
                <input
                  type="text"
                  placeholder="title"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
                <textarea
                  rows={4}
                  placeholder="description"
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                />
                <select
                  value={form.rating}
                  onChange={(e) => setForm({ ...form, rating: e.target.value })}
                >
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </select>
                <button type="submit">Submit</button>
              </form>
            </div>
          </Popup>
        )}
      </Map>

      <div className="buttons">
        {currentUser ? (
          <button onClick={handleLogout}>Log Out</button>
        ) : (
          <div>
            <button onClick={() => setShowLogin(true)}>Log In</button>
            <button onClick={() => setShowRegister(true)}>Register</button>
          </div>
        )}
        {showRegister && <Register setShowRegister={setShowRegister} />}
        {showLogin && (
          <Login
            setShowLogin={setShowLogin}
            setCurrentUser={setCurrentUser}
            myStorage={myStorage}
          />
        )}
      </div>
    </div>
  );
};

export default App;
