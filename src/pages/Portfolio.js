import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Button, Input, CircularProgress, Box, TextField, Divider } from '@mui/material';
import Popover from '@mui/material/Popover';
import { getCookie } from '../helpers/helper';




const TransactionStack = () => {

  const [amount, setAmount] = useState('');
  const [activeStock, setActiveStock] = useState('');


  const mockSchedule = [{ Monday: "Missing", Tuesday: "Missing", Wednesday: "Missing", Thursday: "Missing", Friday: "Missing", Saturday: "Missing", Sunday: "Missing" }];

  const [schedule, setSchedule] = useState(mockSchedule);
  
  useEffect(() => {
      fetch('http://localhost:3000/getMarketSchedule', {
        method: 'POST',
        body: JSON.stringify({
          MarketID: "1"
        })
      })
      .then(response => response.json())
      .then(data => setSchedule(data));
    });




  const mockTransactions = [
    { Stock: "Amazon", Volume: "12" },
    { Stock: "Google", Volume: "67" },
    { Stock: "Tesla", Volume: "33" }
  ];


  const [transactions, setTransactions] = useState(mockTransactions);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    fetch('http://localhost:3000/listPortfolio', {
      method: 'POST',
      body: JSON.stringify({
        UserID: getCookie('UserID')
      })
    })
    .then(response => response.json())
    .then(data => setTransactions(data));
  };





  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event, stock) => {
    setActiveStock(stock);
    setAnchorEl(event.currentTarget);
  };
  
  const handleClose = () => {
    setActiveStock('');
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;






  const [anchor, setAnchor] = React.useState(null);

  const handleSecondClick = (event) => {
    setAnchor(event.currentTarget);
  };

  const handleSecondClose = () => {
    setAnchor(null);
  };

  const openTwo = Boolean(anchor);
  const two = open ? 'simple-popover' : undefined;






  const handleConfirmSell = () => {
    // Logic for confirming sell
    // For now, just hide the confirmation page
    fetch('http://localhost:3000/sellStock', {
      method: "POST",
      body: JSON.stringify({
        ArrayID: "1",
        UserID: getCookie('UserID'),
        StockTicker: activeStock, 
        amount: amount
      })
    })
    .then(() => {
      handleClose();
      handleSecondClose();
    })
    .then(() => fetchData());
  };


  



  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      <Box
        bgcolor="white"
        p={4}
        borderRadius={8}
        width="50%"
        boxShadow={3} // Add a shadow effect
      >
        <Typography variant="h3" gutterBottom style={{ color: 'black', fontWeight: 'bold', textAlign: 'center' }}>
          Portfolio
        </Typography>
        {transactions && transactions.map((transaction, index) => (
          <Box key={index} mb={2}>
            <Card variant="outlined" raised>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                  <Typography variant="h6" component="div">
                    {transaction.Stock}
                  </Typography>
                  <Divider flexItem />
                  {schedule.Sunday != "CLOSED" && <Button  
                    color="error" 
                    aria-describedby={id} variant="contained" onClick={event => handleClick(event, transaction.Stock)}
                    size="24"
                  >
                  Sell
                  </Button>}
                </Box>
                <Divider />
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="subtitle1">
                    Volume:
                  </Typography>
                  <Typography variant="subtitle1">
                    {transaction.Volume}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Box>
        ))}





       <div>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
          <Typography sx={{ p: 2 }}>           
            <Typography variant="h6" gutterBottom >
              Enter Amount to Sell
            </Typography>
            <Typography variant="body1" gutterBottom>
            <Input onChange={event => setAmount(event.target.value)} />
            </Typography>
            <Box display="flex" justifyContent="center" mt={2}>
              <Button variant="contained" color="success" onClick={handleSecondClick} style={{ marginRight: '10px' }}>
                Confirm
              </Button>
              <Button variant="contained" color="error" onClick={handleClose}>
                Cancel
              </Button>
            </Box>
          </Typography>
      </Popover>
    </div>





    <div>
      <Popover
        id={two}
        open={openTwo}
        anchorEl={anchor}
        onClose={handleSecondClose}
        anchorOrigin={{
          vertical: 'center',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'center',
          horizontal: 'center',
        }}
      >
          <Typography sx={{ p: 2 }}>           
            <Typography variant="h6" gutterBottom >
              Confirm Sell
            </Typography>
            <Typography variant="body1" gutterBottom>
              Sell {amount} Share(s)?
            </Typography>
            <Box display="flex" justifyContent="center" mt={2}>
              <Button variant="contained" color="success" onClick={handleConfirmSell} style={{ marginRight: '10px' }}>
                Confirm
              </Button>
              <Button variant="contained" color="error" onClick={handleSecondClose}>
                Cancel
              </Button>
            </Box>
          </Typography>
      </Popover>
    </div>
      </Box>
    </Box>
  )
}







export default function Portfolio() {
  return (
    <div className='mb-5 mt-5'>
      {TransactionStack()}
    </div>
  )
}
