import React, { useEffect, useState } from "react";
import  {user}  from "../Join/Join";
import socketIO from "socket.io-client"; // npm i socket.io-client
import "./Chat.css"
import Message from "../Message/Message";
import ReactScrolltoBottom from "react-scroll-to-bottom";

let socket;

const ENDPOINT = 'http://localhost:4500/'; // Endpoint mtlb socket jo hai wo kha se create hora hai / receive hora hai --> ye humne server wala link dediya hai

const Chat = () => {

 const [id, setId] = useState("");
 const [messages, setMessages] = useState([]);

  const send = () => { // step1: message varibale m store kro msg ko , step2: afshan ab send krra hai msg SERVER ko using socket.emit
    const message = document.getElementById("inputChat").value; // message [by Afshan] = "Hi guys"
    socket.emit("message", {message,id}); // emit means -> send krna , yha par EVENT = "message" hai
    document.getElementById("inputChat").value = "";
  }


    // CLIENT-SIDE EXECUTE HORA HAI YE [phla server ban chuka hai]
    useEffect(() => {
        socket = socketIO(ENDPOINT, {transports: ['websocket']} ); 
        socket.on("connect", () => { // jb ye CONNECT hoga then alert message show hoga // not: "connect" hi likho vrna nhi chlega wo
           alert("Connected");
           setId(socket.id); // jb user connect hoga then uski ID store hojygi 
        })
        // console.log(socket); // to see USER/SOCKET full info that also incluse ID
// emit -> iska mtlb hai yha se DATA send krre hai hum BACKEND M --> jse yha se {user} bejdege hum
        socket.emit("joined", {user} );// user = {Afshan} jb hume SERVER CMD m display krana ho "ALI has joined"

       // welcome wala data RECEIVE HOGA AB
       socket.on("welcome", (data) => {
        setMessages([...messages,data]);
        console.log(data.user,data.message);

       })

       // DATA [RECEIVE] BY BROADCAST
       socket.on("userJoined" , (data) =>{
        setMessages([...messages,data]);
        console.log(data.user,data.message);
       })


      // event = leave
      socket.on("leave", (data) => {
        setMessages([...messages,data]);
        console.log(data.user,data.message);
       })


        return () => {
         socket.emit("disconnected"); // dis-connect wala EVENT hai ye
         socket.off(); // jb socket/user disconnect hogya to simply usko off krdo
        }
    }, [])


    // 2nd useEffect
    useEffect(() => {
      socket.on("sendMessage", (data) => {
        setMessages([...messages,data]);
        console.log(data.user,data.message,data.id); // msg seen on --> CLIENT SIDE [console mein show hora hai --> afshan hello how are you OUFOxUJLVSqiP-klAAAD]
      })
    
      return () => {
       socket.off(); // ek bar message jane ke bad off krdo jisse vo bar-2 render na kre
      }
    }, [messages])
    
    

  return (
    <div className="chatPage">
        <div className="chatContainer">
            <div className="header">
              <h2>iChat</h2>
            </div>
            <ReactScrolltoBottom className="chatBox">
              {
                messages.map((element,index) => {
                  return (
                    <Message 
                       user={element.id===id?"":element.user}// for same user : diff user
                       message = {element.message} // element.message = "hi Guys"
                       classs={element.id===id?"right":"left"}
                     
                    />
                  )
                })
              }
            </ReactScrolltoBottom>
            <div className="inputBox">
            <input 
            onKeyPress={(event) => event.key==="Enter"?send():null} // agar key == "Enter" hai to jb bhi msg send hojayga
            type="text"
            id="inputChat"
            />
            <button onClick={send} className="inputBtn">Send</button>
            </div>
        </div>
    </div>
  )
}

export default Chat