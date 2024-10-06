import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { setCookie } from './../helpers/helper';



function Login(setUser) {
    const [UserID, setUserID] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = () => {
        fetch('http://localhost:3000/login', {
          method: "POST",
          body: JSON.stringify({
            UserID: UserID,
			password: password
          })
        })
        .then(response => response.json())
        .then(data => setCookie('UserID', data))
        .then(() => window.location.href = '/Home');
      };




    return (
        <div className='d-flex justify-content-center align-items-center bg-secondary vh-100'>
            <div className='bg-white p-3 rounded w-25'>
                <h2>Login</h2>
                <div className='mb-3'>
                    <label htmlFor="UserID"><strong>User Name</strong></label>
                    <input type="UserID" pattern="[A-Za-z]" value={UserID} onChange={event => setUserID(event.target.value)} placeholder='Enter User Name' name='UserID'className='form-control rounded-0'/>
                </div>
                <div className='mb-3'>
                    <label htmlFor="password"><strong>Password</strong></label>
                    <input type="password" pattern="[A-Za-z]" value={password} onChange={event => setPassword(event.target.value)} placeholder='Enter Password' name='password' className='form-control rounded-0'/>
                </div>
                <button type="submit" onClick={() => handleSubmit()} className='btn btn-success w-100 mb-2'><strong>Login</strong></button>
                <Link to="/Signup" className='btn btn-default border w-100 bg-light text-decoration-none'>Create Account</Link>
            </div>
        </div>
    )
}

export default Login