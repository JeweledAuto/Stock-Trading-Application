import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Box, Divider } from '@mui/material';
import { getCookie } from '../helpers/helper';

const mockTransactions = [
  { Stock: "Amazon", Date: "2024-02-08 10:00:00", Volume: "+28" },
  { Stock: "Google", Date: "2024-02-08 11:30:00", Volume: "-57" },
  { Stock: "Tesla", Date: "2024-02-08 14:15:00", Volume: "+182" }
];

const TransactionStack = () => {

  const [transactions, setTransactions] = useState(mockTransactions);

  useEffect(() => {
    fetch('http://localhost:3000/listHistory', {
      method: 'POST',
      body: JSON.stringify({
        UserID: getCookie('UserID')
      })
    })
    .then(response => response.json())
    .then(data => setTransactions(data));
  });


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
        <Typography variant="h3" gutterBottom style={{ fontWeight: 'bold', textAlign: 'center' }}>
          Transaction History
        </Typography>
        {transactions.map((transaction, index) => (
          <Card key={index} variant="outlined" style={{ marginBottom: '10px' }}>
            <CardContent>
              <Box display="flex" alignItems="center" marginBottom="8px">
                <Typography variant="h6" component="div">
                  {transaction.Stock}
                </Typography>
              </Box>
              <Divider />
              <Box display="flex" alignItems="center" marginBottom="8px">
                <Typography color="textSecondary" gutterBottom style={{ marginRight: '8px' }}>
                  Time stamp:
                </Typography>
                <Typography variant="subtitle1">
                    {transaction.Date}
                </Typography>
              </Box>
              <Box display="flex" alignItems="center">
                <Typography color="textSecondary" style={{ marginRight: '8px' }}>
                  Difference:
                </Typography>
                <Typography variant="subtitle1">
                    {transaction.Volume}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  )
}

export default function TransactionHistory() {
  return (
      <div className='mb-5 mt-5'>
        {TransactionStack()}
      </div>
  )
}
