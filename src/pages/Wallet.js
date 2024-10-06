import React, { useEffect, useState } from 'react';
import { getCookie } from '../helpers/helper';

function Cash() {

  const defaultCash = 0

  const [cash, setCash] = useState(defaultCash);

  useEffect(() => {
    fetch('http://localhost:3000/getCash', {
      method: 'POST',
      body: JSON.stringify({
        UserID: getCookie('UserID')
      })
    })
    .then(response => response.json())
    .then(data => setCash(data));
  });
  
	return (
        <div className='d-flex justify-content-center align-items-center'>
            <div className='bg-light p-3 rounded w-25'>
                <h2 class="text-center">Cash</h2>
				<h1 class="text-center">{cash}</h1>
            </div>
        </div>
	);
}

function DepositForm() {

	const [amount, setAmount] = useState('');
  
  const handleSubmit = () => {
		
    fetch('http://localhost:3000/addCash', {
      method: "POST",
      body: JSON.stringify({
        UserID: getCookie('UserID'),
        amount: amount
      })
    })
  };
  
	return (
        <div className='d-flex justify-content-center align-items-center'>
            <div className='bg-light p-3 rounded w-25'>
                <h2 class="text-center">Deposit</h2>
                <form onSubmit={handleSubmit}>
                    <div className='mb-3'>
                        <input type="UserID" value={amount} onChange={event => setAmount(event.target.value)} placeholder='Enter Deposit Amount' className='form-control rounded-0'/>
                    </div>
                    <button type="submit" className='btn btn-success w-100'><strong>Submit</strong></button>
                </form>
            </div>
        </div>
	);
}

function WithdrawForm() {

	const [amount, setAmount] = useState('');
  
  const handleSubmit = () => {
		
    fetch('http://localhost:3000/withdrawCash', {
      method: "POST",
      body: JSON.stringify({
        UserID: getCookie('UserID'),
        amount: amount
      })
    })
  };
  
	return (
        <div className='d-flex justify-content-center align-items-center vh-50'>
            <div className='bg-light p-3 rounded w-25'>
                <h2 class="text-center">Withdraw</h2>
                <form onSubmit={handleSubmit}>
                    <div className='mb-3'>
                        <input type="UserID" value={amount} onChange={event => setAmount(event.target.value)} placeholder='Enter Withdraw Amount' className='form-control rounded-0'/>
                    </div>
                    <button type="submit" className='btn btn-success w-100'><strong>Submit</strong></button>
                </form>
            </div>
        </div>
	);
}

export default function Wallet() {
  return(
    <div>
	<div className='mb-5 mt-5'>
      { Cash() }
    </div>
    <div className='mb-5 mt-5'>
      { DepositForm() }
    </div>
    <div className='mb-5'>
      { WithdrawForm() }
    </div>
    </div>
  )
  };
  