const http = require("http");
const express = require("express")
const cors = require("cors"); // cors : used for inter communication b/w URL
const socketIO = require("socket.io");

const app = express();
const port = 4500 || process.emv.PORT; // mtlb localhost 4500 pe ni chle to vo dsura lele

const usersArray = [{}]; // array of objects

app.use(cors());

app.get("/",(req,res) => {
    res.send("hello server is working,Afshan");
})

const server = http.createServer(app);
// io -> ek pura CIRCUIT hai && socket --> alg-2 USERs hai
//circiut bnaya io ka [SERVER SIDE EXECUTE HORA HAI YE]
const io = socketIO(server);
io.on("connection",(socket) => { // jse hi io circuit ON hoga it will connect and "new connection" display hojyga cmd m
    console.log("New Connection");  // NC jb display hoga cmd m jb SOCKET SERVER se connect hoga
    
    // neeche wale on -> ka mtlb DATA RECEIVE KRNA jo EMIT ne SEND kiya hai wo client side se
    socket.on("joined" , ({user}) => {  // jb USER join krega ichat
           usersArray[socket.id] = user; // array ke id point pe user save hojyga --> har socket/user ki 1 unique id hoti hai automatically
           console.log(`${user} has joined`); // ye SERVER -> cmd pe show hora hai
           
           // broadcast --> jis user ne msg kiya hai usko chodke baki sb pe msg jayega [SEND]
         socket.broadcast.emit("userJoined", {user:"Admin",message:`${usersArray[socket.id]} has joined`}); // [but ye server pe show hora hai like Afshan has joined]
          
         // data send [ye CLIENT SIDE CONSOLE MEIN SHOW HORA HAI --> Admin welcome to iChat AFSHAN KHAN]
    socket.emit("welcome", {user:"Admin",message:`welcome to iChat ${usersArray[socket.id]}`} );// event=welcome to welcome hi hona chye client side bhi
    })


    // event = mesaage [jo hum exchange krege msgs b/w diff users/sockets]
    socket.on("message", ({message , id}) => { // sbse phle receive krega server msg ko and then SERVER ENTIRE CIRCUIT KO MSG BEJDEA JO AFSHAN NE SEND KIYA THA 
       // sbko bejdege pure CIRCUIT ko
       console.log("Received message:", message);// msg shown on cmd --> SERVER SIDE , message = "Hi guys"
       io.emit("sendMessage", {user: usersArray[id], message, id});
    })




    // agar DIS-CONNECT HAI [phle disconnect server m aayga then go toclient side]
    socket.on("disconnected", () => {
        // ab hum dusro ko btadege ki is particular user ne left krdi chat
        socket.broadcast.emit("leave", {user:"Admin", message: `${usersArray[socket.id]}user has left`});
        console.log("user left"); // server cmd mein show hora h ye
    }) 
})

  


server.listen(port,() =>{
    console.log(`server is working on http://localhost:${port}`);
})