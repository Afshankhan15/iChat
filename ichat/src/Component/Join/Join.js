import { useState } from "react";
import "./Join.css";
import { Link } from "react-router-dom";

let user;

const Join = () => {
  const sendUser = () => {
    user = document.getElementById("joinInput").value;
    document.getElementById("joinInput").value = "";
  };

  const [name, setName] = useState("");

  return (
    <div className="joinpage">
      <div className="joinContainer">
        <h1>
          <span style={{ color: "red" }}>i</span>Chat
        </h1>
        <input
          type="text"
          id="joinInput"
          placeholder="Enter Your Name"
          onChange={(event) => setName(event.target.value)}
        />
        {/* if name=="" empty then, it will not Login */}
        <Link
          onClick={(event) => (!name ? event.preventDefault() : null)}
          to="/chat"
        >
          <button onClick={sendUser} className="joinBtn">
            Login
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Join;
export { user }; // export user

// Link is used instead of anchor <a href> tag because link does not load the page
