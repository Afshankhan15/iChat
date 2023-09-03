import "./Message.css"

const Message = ({user,message, classs}) => {
    // agar USER exist krta hai to
    if(user){
        return (
            <div className={`messageBox ${classs}`}>
              {`${user}: ${message}`} 
               
            </div>
        )
    }
    else {
  return (
    <div className={`messageBox ${classs}`}>
        {`You: ${message}`} 
       
    </div>
  )
}
}

export default Message