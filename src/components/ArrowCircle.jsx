import React, { useEffect, useRef, useState } from 'react';
import { Box, Button, Typography } from '@mui/material';

const ArrowCircle = () => {
  const [angle, setAngle] = useState(0);
  const [targetAngle, setTargetAngle] = useState(Math.floor(Math.random() * 360));
  const [running, setRunning] = useState(false);
  const [showTarget, setShowTarget] = useState(true);
  const directionRef = useRef(1);

  const radius = 100;
  const arrowLength = 80;
  const speed = 1;
  const tolerance = 12;

  const animate = () => {
    setAngle((prev) => (prev + speed * directionRef.current + 360) % 360);
  };

  useEffect(() => {
    let arrowTimer;
    if (running) {
      arrowTimer = setInterval(animate, 20);
    }
    return () => clearInterval(arrowTimer);
  }, [running]);

  const handleTap = () => {
    if (!running) return;
    setRunning(false);
    
    const ab=Math.abs(targetAngle+180)
    console.log(angle,targetAngle,ab)
    const diff = Math.abs(angle - ab);
    console.log(diff)
    const abss=Math.abs(360 - diff)
    const distance = Math.min(diff,abss);
    console.log(distance)
    if (distance <= tolerance) {
      alert('🎯 Success!');
      setTargetAngle(Math.floor(Math.random() * 360));
    } else {
      alert('❌ Missed! Try Again.');
    }
  };

  const startLevel = () => {
    setAngle(0);
    setTargetAngle(0);
    directionRef.current = 1;
    setShowTarget(true);
    setRunning(true);
  };

  console.log(targetAngle);
  const targetX = radius * Math.cos((targetAngle+90) * (Math.PI / 180));
  const targetY = radius * Math.sin((targetAngle+90) * (Math.PI / 180));
  return (
    <Box sx={{ textAlign: 'center', mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Level 1
      </Typography>

      <Box
        onClick={handleTap}
        sx={{
          width: 2 * radius,
          height: 2 * radius,
          borderRadius: '50%',
          border: '4px solid #673ab7',
          position: 'relative',
          margin: '20px auto',
          cursor: 'pointer',
          userSelect: 'none',
        }}
      >
        <Box
          sx={{
            width: 2,
            height: arrowLength,
            backgroundColor: '#f50057',
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: `rotate(${angle}deg) translateY(-${arrowLength}px)`,
            transformOrigin: 'center top',
          }}
        />

        {showTarget && (
          <Box
            sx={{
              width: 12,
              height: 12,
              borderRadius: '50%',
              backgroundColor: 'red',
              position: 'absolute',
              top: `calc(50% - ${targetY}px)`,
              left: `calc(50% + ${targetX}px)`,
              transform: 'translate(-50%, -50%)',
            }}
          />
        )}
      </Box>

      {!running && (
        <Button variant="contained" onClick={startLevel}>
          Start Level 1
        </Button>
      )}
    </Box>
  );
};

export default ArrowCircle;