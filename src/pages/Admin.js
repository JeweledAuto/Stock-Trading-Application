import {useEffect, useState} from 'react';

function StockForm() {

	const [name, setName] = useState('');
	const [ticker, setTicker] = useState('');
	const [volume, setVolume] = useState('');
	const [price, setPrice] = useState('');
  
    const handleSubmit = () => {
		
        fetch('http://localhost:3000/createStock', {
          method: "POST",
          body: JSON.stringify({
            ArrayID: "1",
            StockTicker: ticker,
			name: name,
			price: price,
			volume: volume
          })
        })
      };
  
	return (
        <div className='d-flex justify-content-center align-items-center'>
            <div className='bg-light p-3 rounded w-25'>
                <h2 className="text-center">Create New Stock</h2>
                <form action="" onSubmit={handleSubmit}>
                    <div className='mb-3'>
                        <label htmlFor="name"><strong>Company Name</strong></label>
                        <input value={name} onChange={event => setName(event.target.value)} placeholder='Enter Company Name' className='form-control rounded-0'/>
                    </div>
					<div className='mb-3'>
                        <label htmlFor="ticker"><strong>Company Ticker</strong></label>
                        <input value={ticker} onChange={event => setTicker(event.target.value)} placeholder='Enter Stock Ticker' className='form-control rounded-0'/>
                    </div>
					<div className='mb-3'>
                        <label htmlFor="volume"><strong>Total Stock Volume</strong></label>
                        <input value={Number(volume)} onChange={event => setVolume(event.target.value)} placeholder="Enter Volume" className='form-control rounded-0'/>
                    </div>
					<div className='mb-3'>
                        <label htmlFor="price"><strong>Initial Stock Price</strong></label>
                        <input value={Number(price)} onChange={event => setPrice(event.target.value)} placeholder="Enter Initial Price" className='form-control rounded-0'/>
                    </div>
                    <button type="submit" className='btn btn-success w-100'><strong>Submit</strong></button>
                </form>
            </div>
        </div>
	);
}

function ScheduleForm() {

	const [Mon, setMonday] = useState('');
	const [Tues, setTuesday] = useState('');
    const [Wed, setWednesday] = useState('');
	const [Thur, setThursday] = useState('');
    const [Fri, setFriday] = useState('');
	const [Sat, setSaturday] = useState('');
    const [Sun, setSunday] = useState('');
  
	const handleSubmit = () => {
		
        fetch('http://localhost:3000/changeSchedule', {
          method: "POST",
          body: JSON.stringify({
			MarketID: "1",
            Monday: Mon,
			Tuesday: Tues,
            Wednesday: Wed,
			Thursday: Thur,
            Friday: Fri,
			Saturday: Sat,
            Sunday: Sun
          })
        })
      };
  
	return (
        <div className='d-flex justify-content-center align-items-center'>
            <div className='bg-light p-3 rounded w-25'>
                <h2 className="text-center">Change Market Schedule</h2>
                <form onSubmit={handleSubmit}>
                    <div className='mb-3'>
                        <label htmlFor="open"><strong>Monday</strong></label>
                        <input type="open" value={Mon} onChange={event => setMonday(event.target.value)} placeholder='Enter Market Hours' className='form-control rounded-0'/>
                    </div>
					<div className='mb-3'>
                        <label htmlFor="close"><strong>Tuesday</strong></label>
                        <input type="schedule" value={Tues} onChange={event => setTuesday(event.target.value)} placeholder='Enter Market Hours' className='form-control rounded-0'/>
                    </div>
                    <div className='mb-3'>
                        <label htmlFor="close"><strong>Wednesday</strong></label>
                        <input type="schedule" value={Wed} onChange={event => setWednesday(event.target.value)} placeholder='Enter Market Hours' className='form-control rounded-0'/>
                    </div>
                    <div className='mb-3'>
                        <label htmlFor="close"><strong>Thursday</strong></label>
                        <input type="schedule" value={Thur} onChange={event => setThursday(event.target.value)} placeholder='Enter Market Hours' className='form-control rounded-0'/>
                    </div>
                    <div className='mb-3'>
                        <label htmlFor="close"><strong>Friday</strong></label>
                        <input type="schedule" value={Fri} onChange={event => setFriday(event.target.value)} placeholder='Enter Market Hours' className='form-control rounded-0'/>
                    </div>
                    <div className='mb-3'>
                        <label htmlFor="close"><strong>Saturday</strong></label>
                        <input type="schedule" value={Sat} onChange={event => setSaturday(event.target.value)} placeholder='Enter Market Hours' className='form-control rounded-0'/>
                    </div>
                    <div className='mb-3'>
                        <label htmlFor="close"><strong>Sunday</strong></label>
                        <input type="schedule" value={Sun} onChange={event => setSunday(event.target.value)} placeholder='Enter Market Hours' className='form-control rounded-0'/>
                    </div>
                    <button type="submit" className='btn btn-success w-100'><strong>Submit</strong></button>
                </form>
            </div>
        </div>
	);
}

function Form() {

	const [schedule, setSchedule] = useState('');
  
	const handleSubmit = () => {
		
        fetch('http://localhost:3000/changeSchedule', {
          method: "POST",
          body: JSON.stringify({
			MarketID: "1",
            newMarketSchedule: schedule,
          })
        })
      };
  
	return (
        <div className='d-flex justify-content-center align-items-center'>
            <div className='bg-light p-3 rounded w-25'>
                <h2 className="text-center">Change Market Schedule</h2>
                <form onSubmit={handleSubmit}>
                    <div className='mb-3'>
                        <label htmlFor="schedule"><strong>Market's Schedule</strong></label>
                        <input type="schedule" value={schedule} onChange={event => setSchedule(event.target.value)} placeholder='Enter New Schedule' className='form-control rounded-0'/>
                    </div>
                    <button type="submit" className='btn btn-success w-100'><strong>Submit</strong></button>
                </form>
            </div>
        </div>
	);
}

export default function Admin() {

return(
	<div>
	<div className='mb-5 mt-5'>
		{ StockForm() }
	</div>
	<div className='mb-5 mt-5'>
		{ ScheduleForm() }
	</div>
	</div>
)
};