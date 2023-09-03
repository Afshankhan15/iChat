import "./Message.css";

const Message = ({ user, message, classs }) => {
  // if USER exists then
  if (user) {
    return (
      <div className={`messageBox ${classs}`}>{`${user}: ${message}`}</div>
    );
  } else {
    return <div className={`messageBox ${classs}`}>{`You: ${message}`}</div>;
  }
};

export default Message;
