import React, { useEffect, useRef, useState } from 'react';
import { Button, Typography, Box, Card, CardContent } from '@mui/material';

const levelConfigs = [
  {
    speed: 2,
    movingTarget: false,
    fadingTarget: false
  },
  {
    speed: 4,
    movingTarget: false,
    fadingTarget: false
  },
  {
    speed: 4,
    movingTarget: true,
    fadingTarget: false
  },
  {
    speed: 4,
    movingTarget: true,
    fadingTarget: true
  }
  // Add more levels as needed
];

const Game = () => {
  const [angle, setAngle] = useState(0);
  const [timer, setTimer] = useState(60);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(0);
  const [targetAngle, setTargetAngle] = useState(Math.random() * 360);
  const [targetVisible, setTargetVisible] = useState(true);

  const radius = 150;
  const arrowLength = 100;
  const center = 200;
  const intervalRef = useRef(null);

  const currentConfig = levelConfigs[Math.min(level, levelConfigs.length - 1)];

  useEffect(() => {
    if (timer <= 0) {
      setGameOver(true);
      clearInterval(intervalRef.current);
    }
  }, [timer]);

  useEffect(() => {
    if (!gameOver) {
      const rotateInterval = setInterval(() => {
        setAngle((prev) => (prev + currentConfig.speed) % 360);
      }, 20);
      intervalRef.current = rotateInterval;

      const timerInterval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);

      let fadeInterval;
      if (currentConfig.fadingTarget) {
        fadeInterval = setInterval(() => {
          setTargetVisible((v) => !v);
        }, 1000);
      }

      let moveInterval;
      if (currentConfig.movingTarget) {
        moveInterval = setInterval(() => {
          setTargetAngle(Math.random() * 360);
        }, 2000);
      }

      return () => {
        clearInterval(rotateInterval);
        clearInterval(timerInterval);
        clearInterval(fadeInterval);
        clearInterval(moveInterval);
      };
    }
  }, [gameOver, level]);

  const targetX = center + (arrowLength * 0.8) * Math.cos((targetAngle - 90) * (Math.PI / 180));
  const targetY = center + (arrowLength * 0.8) * Math.sin((targetAngle - 90) * (Math.PI / 180));

  const arrowX = center + arrowLength * Math.cos((angle - 90) * (Math.PI / 180));
  const arrowY = center + arrowLength * Math.sin((angle - 90) * (Math.PI / 180));

  const handleTap = () => {
    const diff = Math.abs(angle - targetAngle);
    if (diff < 10 || diff > 350) {
      alert('Success!');
      setScore((prev) => prev + 1);
      setTimer((prev) => prev + 10);
      setLevel((prev) => prev + 1);
      setTargetAngle(Math.random() * 360);
    } else {
      alert('Miss!');
    }
  };

  if (gameOver) {
    return (
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100vh">
        <Typography variant="h3">Game Over</Typography>
        <Typography variant="h5">Your Score: {score}</Typography>
      </Box>
    );
  }

  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100vh" onClick={handleTap}>
      <Card elevation={3}>
        <CardContent>
          <Typography variant="h6">Time: {timer}s</Typography>
          <Typography variant="h6">Score: {score}</Typography>
          <Typography variant="h6">Level: {level + 1}</Typography>
        </CardContent>
      </Card>
      <svg width="400" height="400" style={{ marginTop: 20 }}>
        <circle cx={center} cy={center} r={radius} stroke="#ccc" strokeWidth="4" fill="none" />
        <line x1={center} y1={center} x2={arrowX} y2={arrowY} stroke="black" strokeWidth="4" />
        {targetVisible && <circle cx={targetX} cy={targetY} r="8" fill="red" />}
      </svg>
    </Box>
  );
};

export default Game;
