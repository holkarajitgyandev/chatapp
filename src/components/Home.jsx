import React, { useEffect, useState } from 'react'
import "./Home.css"
import { CiSearch } from "react-icons/ci";
import { HiPaperAirplane } from "react-icons/hi2";
import axios from 'axios';
import { base_api } from '../api/axios';
import io from 'socket.io-client';

const Home = () => {

  const[users,setUsers]=useState([]);
  const [activeUser, setActiveUser] = useState({name:'Friend'})
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [socket, setSocket] = useState(null);


  useEffect(() => {
    const socketInstance = io(base_api); 
    setSocket(socketInstance);

    // Listen for messages from the server
    socketInstance.on('receiveMessage', (newMessage) => {
      console.log('New message received:', newMessage);
      if (activeUser && activeUser._id === newMessage.userId) {
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      }
      // You can update the state or the UI here to show the new message
    });

    return () => {
      // Clean up the socket connection when the component unmounts
      socketInstance.disconnect();
    };
  }, [activeUser]);


  useEffect(()=>{
    const fetchusers=async()=>{
      try {
        const response= await axios.get('http://localhost:4000/api/chatuser/getallchatusers')
        setUsers(response.data)
        console.log(response.data[0].messages)
        
      } catch (error) {
        console.error(error)
      }
    }

    fetchusers()
  },[])

   const handleMessageChange = (event) => {
    setMessage(event.target.value);
  };

  // Send a message when the user presses the send button
  const handleSendMessage = () => {
    if (message.trim() === '') return;

    // Emit the message to the server
    //socket.emit('sendMessage', { text: message, createdAt: new Date().toISOString(),userId: activeUser._id });
    const newMessage = {
      text: message,
      createdAt: new Date().toISOString(),
      userId: activeUser._id, // Pass the active user's ID
    };

    // Emit the message to the server
    socket.emit('sendMessage', newMessage);
    // Optionally update the UI with the sent message
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setMessage('');}

    const handleUserClick = (user) => {
      setActiveUser(user);
      setMessages(user.messages || []);
    };


  return (
    <div className='main-div'>
      <div className="left">
        <div className="imagediv"><img src="./signupTitle.png" alt="icon" width={112} height={42} /></div>
        <div className="search">
            <CiSearch/>
            < input type="text" placeholder='Search' />
        </div>
        <ul>
          {users.map((user)=>(
            <li key={user._id} onClick={() => handleUserClick(user)} >
                <div className="listitem">
                <div className='subpart'>
                <div className='avatar'>{user.name.split(' ').map(name => name[0]).join('')}</div>
                <section>
                    <p className='username'>{user.name}</p>
                    <p>{user.messages && user.messages.length > 0 ? user.messages[user.messages.length - 1] : "No messages"}</p>
                </section>
                </div>
                <div className='subpart1'>
                    <p>{user.createdAt
              ? new Date(user.createdAt).toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                })
              : "N/A"}</p>
                    <p><div className='countdiv'>{user.messages && user.messages.length > 0 ?user.messages.length :0}</div></p>
                </div>
                </div>
            </li>
            ))}
        </ul>
      </div>
      <div className="middle">
          <div className="middleupper">
           <p> <img className='userimage' src="./signupTitle.png" alt="user profile "/></p>
          <p>{activeUser.name || 'Guest'}</p>
          </div>
         <div className="middlelower">
            {/* <div className="leftmsg">
                <p>OMG do you know what happened there</p>
                <p>8:12am</p>
            </div>
          
            <div className="rightmsg">
                <p>ya i know it, it was an accident with my friends</p>
                <p>8:20am</p>
           </div> */}
           {messages.map((msg, index) => (
            <div className={msg.userId === activeUser._id ? 'rightmsg' : 'leftmsg'} key={index}>
              <p>{msg.text}</p>
              <p>{new Date(msg.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}</p>
            </div>
          ))}
           <div className="msginput">
            <input type="text" value={message}
              onChange={handleMessageChange} placeholder='Message' />
            <HiPaperAirplane style={{color:'purple'}} onClick={handleSendMessage}/>
           </div>
         </div>
      </div>
      
    </div>
  )
}

export default Home
