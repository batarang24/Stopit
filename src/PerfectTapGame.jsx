import React, { useState, useEffect, useRef } from 'react';
import { Button, Card, CardContent, Typography, TextField, Box, Container } from '@mui/material';

const levels = [
  { speed: 1,upsideDown:false }, // Level 1: Normal speed
  { speed: 2,upsideDown:false }, // Level 2: Increased speed fadingArrow   //upsideDown,
  { speed: 2,fadingTarget: true,upsideDown:false },
  { speed: 2,movingTarget: true,upsideDown:false},
  {speed:3,upsideDown:true},
  { speed: 3, movingTarget: true ,upsideDown:false },
  {speed:3, movingTarget:true, fadingTarget:true,upsideDown:false},
  {speed:2,fadingArrow:true,upsideDown:false}, 
  {speed:3,fadingArrow:true,movingTarget:true,upsideDown:false},
  { speed: 2, fadingArrow: true ,movingTarget:true,fadingTarget:true,upsideDown:false}, // Level 10: Insane speed
];

const MainScreen = ({ onStart }) => {
  return (
    <Container maxWidth="sm" style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Box textAlign="center">
        <Typography variant="h3" sx={{ color: 'primary.main', fontWeight: 'bold', mb: 4 }}>
          🎯 Stop it
        </Typography>
        <Card elevation={6} sx={{ borderRadius: 4, padding: 4 }}>
          <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Button variant="contained" size="large" onClick={onStart}>Start Game</Button>
            <Button variant="outlined" size="large">Leaderboard</Button>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

const GameScreen = ({ onGameOver }) => {
  const [timeLeft, setTimeLeft] = useState(50);
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [gameEnded, setGameEnded] = useState(false);
  const [angle, setAngle] = useState(0);
  const [clicked, setClicked] = useState(false);
  const [targetAngle, setTargetAngle] = useState(Math.random() * 360);
  const [fade, setFade] = useState(true);
  const [fadeArrow,setFadeArrow]=useState(true);
  const requestRef = useRef();
  const fadeInterval = useRef();
  const fadeArrowInterval=useRef();

  const radius = 150;
  const arrowLength = 120;
  const center = 200;

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setGameEnded(true);
          return 0;
        }
        
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const currentLevel = levels[level - 1];

  useEffect(() => {
    const rotate = () => {
      setAngle(prev =>{
        const delta= currentLevel.upsideDown ? -currentLevel.speed :currentLevel.speed;
        return(prev + delta+360) % 360
      
      });
      requestRef.current = requestAnimationFrame(rotate);
    };
    requestRef.current = requestAnimationFrame(rotate);
    return () => cancelAnimationFrame(requestRef.current);
  }, [currentLevel.upsideDown]);

  useEffect(() => {
    if (currentLevel.fadingTarget) {
      fadeInterval.current = setInterval(() => setFade(f => !f), 1000);
      return () => clearInterval(fadeInterval.current);
    }
  }, [currentLevel.fadingTarget]);

 
  useEffect(() => {
    if (currentLevel.fadingArrow) {
      fadeArrowInterval.current = setInterval(() => setFadeArrow(f => !f), 1000);
      return () => clearInterval(fadeArrowInterval.current);
    }
  }, [currentLevel.fadingArrow]);

 

  useEffect(() => {
    if (currentLevel.movingTarget) {
      const moveInterval = setInterval(() => {
        setTargetAngle(Math.random() * 360);
      }, 2000);
      return () => clearInterval(moveInterval);
    }
  }, [currentLevel.movingTarget]);

  const arrowX = center + arrowLength * Math.cos((angle - 90) * Math.PI / 180);
  const arrowY = center + arrowLength * Math.sin((angle - 90) * Math.PI / 180);
  const targetX = center + (radius - 30) * Math.cos((targetAngle - 90) * Math.PI / 180);
  const targetY = center + (radius - 30) * Math.sin((targetAngle - 90) * Math.PI / 180);

  const handleClick = () => {
    if (clicked || gameEnded) return;
    setClicked(true);
    console.log(angle,targetAngle)
    //const ang=Math.abs(angle-currentLevel.speed)
    const diff = Math.abs(angle - targetAngle) % 360;
    const hit = diff < 15 || diff > 350; // Within 10 degrees

    if (hit) {
      setScore(prev => prev + 1);
      setTimeLeft(prev => {
        if (prev+10>=50) {
            return 50;
        }
        return prev+10;
      });
      if (level < levels.length) {
        setLevel(prev => prev + 1);
        setTargetAngle(Math.random() * 360);
      } else {
        setGameEnded(true);
      }
    }
    setTimeout(() => setClicked(false), 500);
  };

  return (
    <Container maxWidth="sm" style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Box textAlign="center"> 
        {!gameEnded ? (
          <>
            <Typography variant="h5">⏱️ Time Left: {timeLeft}s</Typography>
            <Typography variant="h6">🚀 Level: {level}</Typography>
            <svg width="400" height="400" onClick={handleClick} style={{ backgroundColor: '#f3f3f3', borderRadius: '50%', marginBottom: 20, cursor: 'pointer' }}>
              <circle cx={center} cy={center} r={radius} stroke="black" strokeWidth="2" fill="none" />
              {
                (!currentLevel.fadingArrow || fadeArrow) &&(
                  <line x1={center} y1={center} x2={arrowX} y2={arrowY} stroke="violet" strokeWidth="4" strokeLinecap="round" />
                )
              }
              {(!currentLevel.fadingTarget || fade) && (
                <circle cx={targetX} cy={targetY} r="8" fill="red" />
              )}
            </svg>
          </>
        ) : (
          <Box>
            <Typography variant="h6">Game Over! Your Score: {score}</Typography>
            <TextField label="Enter your name" variant="outlined" sx={{ mt: 2 }} />
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default function PerfectTapGame() {
  const [gameStarted, setGameStarted] = useState(false);

  return gameStarted ? (
    <GameScreen onGameOver={() => setGameStarted(false)} />
  ) : (
    <MainScreen onStart={() => setGameStarted(true)} />
  );
}
