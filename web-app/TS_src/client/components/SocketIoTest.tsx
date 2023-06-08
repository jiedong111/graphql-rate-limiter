import React, { useEffect } from "react"
import * as io from 'socket.io-client';
import useStore from "../store";

//declare socket address for the server
const socket = io.connect("http://localhost:3501")

const SocketIoTest: React.FC<{}> = () => {

  const { message, setMessage, messageReceived, setMessageReceived } = useStore();

  const sendMessage = () => {
    // can turn {message: "any text here"}
    // But here we're giving it state
    socket.emit("send_message", { message })
  }

  useEffect(() => {
    // socket.on("connect", () => {
    //   console.log(`Connected to Socket.IO server`);
    // });

    // socket.on("disconnect", () => {
    //   console.log(`Disconnected from Socket.IO server`);
    // });

    // listen for data to receive from other sockets
    socket.on("receive_message", (data) => {
      // Create pop up for message
      // alert(data.message);
      setMessageReceived(data.message);
    })

  }, [socket]);

  return (
    <>
      <div className="socket-component">
        <input 
          placeholder="Insert message here..."
          onChange={(e) => setMessage(e.target.value)}
        />
          <button onClick={sendMessage}>Send Message</button>
      </div>
      <h1>Messages:</h1>
      {messageReceived}
    </>
    
  );
};

export default SocketIoTest;