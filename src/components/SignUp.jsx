import React from 'react'
import "./SignUp.css"
import axios from "axios"
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { base_api } from '../api/axios'

const SignUp = () => {
  const [formdata,setformdata]=useState({
    name:'',
    email:'',
    phone:''
  })

  const navigate=useNavigate()

  
  const addchatuser=async()=>{
try {
  
  const response =axios.post(`${base_api}/api/chatuser/register`,formdata)
  setformdata({
    name:'',
    email:'',
    phone:''
  })
  alert("user registerd successfully")
  navigate("/home")

} catch (error) {
  alert("error while registering  user")
  console.error('error while registering  user',error)
  
}
  }
   
 
  //setting form data
  const handlechange=(event)=>{
    const {name,value}=event.target
    setformdata({...formdata,[name]:value})

  }
// handling form submission
 const handlesubmit=(e)=>{
  e.preventDefault()
  addchatuser();

 }
  return (
    <div>
    <div className='maindiv'>
      
      <img src="./signupTitle.png" alt="chat title" />
      <form  onSubmit={handlesubmit} className="signup">
        <input type="text" value={formdata.name} onChange={handlechange} name='name' className='name' placeholder='name' />
        <input type="email" value={formdata.email} onChange={handlechange} name="email" className='email' placeholder='email' />
        <input type="tel" value={formdata.phone} onChange={handlechange} name='phone' className='phone' placeholder='phone number'/>
        <button>Sign Up</button>
      </form>
    </div>
    </div>
  )
}

export default SignUp
