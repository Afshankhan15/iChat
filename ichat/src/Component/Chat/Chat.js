import React, { useEffect, useState } from "react";
import { user } from "../Join/Join";
import socketIO from "socket.io-client"; // npm i socket.io-client
import "./Chat.css";
import Message from "../Message/Message";
import ReactScrolltoBottom from "react-scroll-to-bottom";

let socket;

const ENDPOINT = "http://localhost:4500/"; // Endpoint from where socket is created or received [server-side]

const Chat = () => {
  const [id, setId] = useState("");
  const [messages, setMessages] = useState([]);

  const send = () => {
    // step1: store message in message varibale, step2: now afshan[USER] is sending msg to SERVER using socket.emit
    const message = document.getElementById("inputChat").value; // message [by Afshan] = "Hi guys"
    socket.emit("message", { message, id }); // emit means -> to send, here EVENT is = "message"
    document.getElementById("inputChat").value = "";
  };

  // CLIENT-SIDE is being EXECUTED [server has already been created first]
  useEffect(() => {
    socket = socketIO(ENDPOINT, { transports: ["websocket"] });
    socket.on("connect", () => {
      // when it CONNECTS then alert message will show // note: write "connect" otherwise, it will not work sometimes
      alert("Connected");
      setId(socket.id); // when user connects then their ID will be stored
    });
    // console.log(socket); // to see USER/SOCKET full info that also includes ID
    // emit means -> that we are sending DATA from here to BACKEND --> like we will send {user} from here
    socket.emit("joined", { user }); // user = {Afshan} when we want to display on SERVER-SIDE console that --> "John has joined"

    // welcome data will be RECEIVED now
    socket.on("welcome", (data) => {
      setMessages([...messages, data]);
      console.log(data.user, data.message);
    });

    // DATA [RECEIVED] BY BROADCAST
    socket.on("userJoined", (data) => {
      setMessages([...messages, data]);
      console.log(data.user, data.message);
    });

    // event = leave
    socket.on("leave", (data) => {
      setMessages([...messages, data]);
      console.log(data.user, data.message);
    });

    return () => {
      socket.emit("disconnected"); // this is dis-connect EVENT
      socket.off(); // when socket/user disconnects then simply off it.
    };
  }, []);

  // 2nd useEffect
  useEffect(() => {
    socket.on("sendMessage", (data) => {
      setMessages([...messages, data]);
      console.log(data.user, data.message, data.id); // message is being seen on CLIENT SIDE console --> [Afshan hello how are you OUFOxUJLVSqiP-klAAAD]
    });

    return () => {
      socket.off(); // after sending message once, then switch off the socket to prevent from re-rendering
    };
  }, [messages]);

  return (
    <div className="chatPage">
      <div className="chatContainer">
        <div className="header">
          <h2>iChat</h2>
        </div>
        <ReactScrolltoBottom className="chatBox">
          {messages.map((element, index) => {
            return (
              <Message
                user={element.id === id ? "" : element.user} // for same user : diff user
                message={element.message} // element.message = "hi Guys"
                classs={element.id === id ? "right" : "left"}
              />
            );
          })}
        </ReactScrolltoBottom>
        <div className="inputBox">
          <input
            onKeyPress={(event) => (event.key === "Enter" ? send() : null)} // if key == "Enter" then it will send message
            type="text"
            id="inputChat"
          />
          <button onClick={send} className="inputBtn">
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
