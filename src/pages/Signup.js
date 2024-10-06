import React, { useState } from 'react'
import { Link } from 'react-router-dom'

function Signup() {

    const [UserID, setUserID] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = () => {
		
        fetch('http://localhost:3000/registerUser', {
          method: "POST",
          body: JSON.stringify({
            UserID: UserID,
			name: name,
			email: email,
			password: password
          })
        })
      };

    return (
        <div className='d-flex justify-content-center align-items-center bg-secondary vh-100'>
            <div className='bg-white p-3 rounded w-25'>
                <h2>Sign-Up</h2>
                <form onSubmit={handleSubmit}>
                    <div className='mb-3'>
                        <label htmlFor="UserID"><strong>User Name</strong></label>
                        <input type="UserID" value={UserID} onChange={event => setUserID(event.target.value)} placeholder='Enter User Name' className='form-control rounded-0'/>
                    </div>
                    <div className='mb-3'>
                        <label htmlFor="name"><strong>Full Name</strong></label>
                        <input type="name" value={name} onChange={event => setName(event.target.value)} placeholder='Enter Full Name' className='form-control rounded-0'/>
                    </div>
                    <div className='mb-3'>
                        <label htmlFor="email"><strong>Email</strong></label>
                        <input type="email" value={email} onChange={event => setEmail(event.target.value)} placeholder='Enter Email' className='form-control rounded-0'/>
                    </div>
                    <div className='mb-3'>
                        <label htmlFor="password"><strong>Password</strong></label>
                        <input type="password" value={password} onChange={event => setPassword(event.target.value)} placeholder='Enter Password' className='form-control rounded-0'/>
                    </div>
                    <button type="submit" className='btn btn-success w-100 mb-2'><strong>Sign Up</strong></button>
                    <Link to="/Login" className='btn btn-default border w-100 bg-light text-decoration-none'>Login</Link>
                </form>
            </div>
        </div>
    )
}

export default Signup