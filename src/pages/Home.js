import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Button, Input, CircularProgress, Box, TextField, Divider } from '@mui/material';
import Popover from '@mui/material/Popover';
import Schedule from "./Schedule"
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
    { StockTicker: "AMZN", Price: "28", StockName: "Amazon", Volume: "6000", StartingPrice: "22", MarketCap: "168,000", MarketHigh: "34", MarketLow: "16"},
    { StockTicker: "GOOG", Price: "76", StockName: "Google", Volume: "6000", StartingPrice: "64", MarketCap: "456,000", MarketHigh: "92", MarketLow: "56" },
    { StockTicker: "TSLA", Price: "59", StockName: "Tesla", Volume: "6000", StartingPrice: "38", MarketCap: "354,000", MarketHigh: "84", MarketLow: "28" },
  ];

  
  const [transactions, setTransactions] = useState(mockTransactions);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    fetch('http://localhost:3000/listStocks', {
      method: 'POST',
      body: JSON.stringify({
        ArrayID: "1"
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
  const two = openTwo ? 'simple-popover' : undefined;



  
  


  const handleConfirmBuy = () => {
    // Logic for confirming sell
    // For now, just hide the confirmation page
    fetch('http://localhost:3000/buyStock', {
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
          Market
        </Typography>
        {transactions.map((transaction, index) => (
          <Box key={index} mb={2}>
            <Card variant="outlined" raised>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                  <Typography variant="h6" component="div">
                    {transaction.StockTicker}
                  </Typography>
                  <Divider flexItem />
                  {schedule.Sunday != "CLOSED" && <Button 
                    variant="contained" 
                    color="success" 
                    onClick={event => handleClick(event, transaction.StockTicker)}
                    size="24"
                  >
                  Buy
                  </Button>}
                </Box>
                <Divider />
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="subtitle1">
                    Company Name:
                  </Typography>
                  <Typography variant="subtitle1">
                    {transaction.StockName}
                  </Typography>
                </Box>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="subtitle1">
                    Volume:
                  </Typography>
                  <Typography variant="subtitle1">
                    {transaction.Volume}
                  </Typography>
                </Box>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="subtitle1">
                    Market Cap:
                  </Typography>
                  <Typography variant="subtitle1">
                    ${transaction.MarketCap}
                  </Typography>
                </Box>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="subtitle1">
                    Price:
                  </Typography>
                  <Typography variant="subtitle1">
                    ${transaction.Price}
                  </Typography>
                </Box>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="subtitle1">
                    Starting Price for the Day:
                  </Typography>
                  <Typography variant="subtitle1">
                    ${transaction.StartingPrice}
                  </Typography>
                </Box>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="subtitle1">
                    High for the Day:
                  </Typography>
                  <Typography variant="subtitle1">
                    ${transaction.MarketHigh}
                  </Typography>
                </Box>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="subtitle1">
                    Low for the Day:
                  </Typography>
                  <Typography variant="subtitle1">
                    ${transaction.MarketLow}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Box>
        ))}







      <div style={{ textAlign: 'center' }}>
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
                Enter Amount to Buy
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
          
          
        
        
        
        
        
        
    <div style={{ textAlign: 'center' }}>
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
              Buy {amount} Share(s)?
            </Typography>
            <Box display="flex" justifyContent="center" mt={2}>
              <Button variant="contained" color="success" onClick={handleConfirmBuy} style={{ marginRight: '10px' }}>
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








export default function Home() {
  return (
    <div>
      <div className='mb-5 mt-5 d-flex align-items-center justify-content-center'>
        <Schedule />
      </div>
      <div className='mb-5 mt-5'>
        {TransactionStack()}
      </div>
    </div>
  )
}
