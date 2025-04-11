import React, { useEffect, useRef, useState } from 'react';
import { Box } from '@mui/material';


const levels = [
    { speed: 1, movingTarget: false, fadingTarget: false, reverse: false, teleport: false, tolerance: 12 },
    { speed: 2, movingTarget: false, fadingTarget: false, reverse: false, teleport: false, tolerance: 10 },
    { speed: 2, movingTarget: true, fadingTarget: false, reverse: false, teleport: false, tolerance: 10 },
    { speed: 2, movingTarget: false, fadingTarget: true, reverse: false, teleport: false, tolerance: 10 },
    { speed: 3, movingTarget: true, fadingTarget: true, reverse: false, teleport: false, tolerance: 8 },
    { speed: 3, movingTarget: false, fadingTarget: false, reverse: true, teleport: false, tolerance: 8 },
    { speed: 4, movingTarget: false, fadingTarget: false, reverse: false, teleport: true, tolerance: 6 },
    { speed: 4, movingTarget: true, fadingTarget: true, reverse: false, teleport: true, tolerance: 6 },
    { speed: 5, movingTarget: false, fadingTarget: false, reverse: false, teleport: false, tolerance: 4 },
    { speed: 5, movingTarget: true, fadingTarget: true, reverse: true, teleport: true, tolerance: 3 },
  ];

const ArrowCircle = () => {
  const [angle, setAngle] = useState(0);
  const [targetAngle, setTargetAngle] = useState(0);
  const requestRef = useRef();
  const radius = 100;
  const arrowLength = 90;
  const tolerance = 10;

  
  

  useEffect(() => {
    // Set a random target between 0 and 359
    
    const randomAngle = Math.floor(Math.random() * 360);
    setTargetAngle(0);
    const animate = () => {
      setAngle((prev) => (prev + 5) );
      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  },[]);

  const handleTap = () => {
    cancelAnimationFrame(requestRef.current);
    const ang=Math.abs(angle-180)
    const diff = Math.abs(ang - targetAngle);
    console.log(diff);
    console.log(ang,targetAngle)
    const ab=Math.abs(360 - diff)
    const distance = Math.min(diff,ab ); 
    console.log(distance)
    // shortest distance
    if (distance < tolerance) {
      alert('🎯 Success!');
    } else {
      alert('❌ Try again!');
    }
  };

  const targetX = radius * Math.cos((targetAngle - 90) * (Math.PI / 180));
  const targetY = radius * Math.sin((targetAngle - 90) * (Math.PI / 180));

  return (
    <Box
      onClick={handleTap}
      sx={{
        width: 220,
        height: 220,
        borderRadius: '50%',
        border: '4px solid #673ab7',
        position: 'relative',
        margin: '40px auto',
        cursor: 'pointer',
        userSelect: 'none',
      }}
    >
      {/* Rotating Arrow */}
      <Box
        sx={{
          width: 2,
          height: arrowLength,
          backgroundColor: '#f50057',
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: `translate(-50%, -100%) rotate(${angle}deg)`,
          transformOrigin: 'bottom center',
          transition: 'transform 0.05s linear',
        }}
      />

      {/* Target Point */}
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
    </Box>
  );
};

export default ArrowCircle;
