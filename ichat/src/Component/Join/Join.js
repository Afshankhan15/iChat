import { useState } from "react";
import "./Join.css"; // join.css --> comp/Join/Join.css
import {Link} from "react-router-dom";

let user;

const Join = () => {

  const sendUser = () => {
    user = document.getElementById("joinInput").value;
    document.getElementById("joinInput").value = "";
   }

 const [name, setName] = useState("");


  return (
    <div className='joinpage'>
       <div className='joinContainer'>
        <h1><span style={{color:"red"}}>i</span>Chat</h1>
        <input 
        type="text"
        id="joinInput"
        placeholder="Enter Your Name" 
        onChange={(event) => setName(event.target.value)}
        />
        {/* button pe click krte hi aap navigate kroge Link to "/chat" url pe  */}
        {/* agar name=="" empty hai to wo login hi nhi hoga  */}
       <Link onClick={(event) => !name ? event.preventDefault() : null}
       to = "/chat"> 
       <button onClick={sendUser} className="joinBtn">Login</button>
       </Link>
       </div>
    </div>
  )
}

export default Join
export {user} // export krdoge
// LINK to isliye use krte hai kyuki wo load nhi hota 
// <a href> anchor tag load leta hai isliye humne button mein anchor tag use nhi kiya simple