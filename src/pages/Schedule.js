import React, { useEffect, useState } from 'react';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';


export default function BasicPopover() {

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

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <div>
      <Button aria-describedby={id} color="primary" variant="contained" onClick={handleClick}>
        View Market Schedule
      </Button>
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
        <Typography sx={{ p: 2 }}>Monday: {schedule.Monday}</Typography>
        <Typography sx={{ p: 2 }}>Tuesday: {schedule.Tuesday}</Typography>
        <Typography sx={{ p: 2 }}>Wednesday: {schedule.Wednesday}</Typography>
        <Typography sx={{ p: 2 }}>Thursday: {schedule.Thursday}</Typography>
        <Typography sx={{ p: 2 }}>Friday: {schedule.Friday}</Typography>
        <Typography sx={{ p: 2 }}>Saturday: {schedule.Saturday}</Typography>
        <Typography sx={{ p: 2 }}>Sunday: {schedule.Sunday}</Typography>
      </Popover>
    </div>
  );
}