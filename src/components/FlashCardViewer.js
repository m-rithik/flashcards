import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
  Slider,
  Paper,
  Grid,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import TimerIcon from '@mui/icons-material/Timer';

const FlashCardViewer = ({ cards, onBack }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [selectedOption, setSelectedOption] = useState('');
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerDuration, setTimerDuration] = useState(30);

  useEffect(() => {
    let interval;
    if (isTimerRunning && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      setShowAnswer(true);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timer]);

  const handleNext = () => {
    setShowAnswer(false);
    setSelectedOption('');
    setCurrentIndex((prev) => (prev + 1) % cards.length);
    if (isTimerRunning) {
      setTimer(timerDuration);
    }
  };

  const handlePrevious = () => {
    setShowAnswer(false);
    setSelectedOption('');
    setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
    if (isTimerRunning) {
      setTimer(timerDuration);
    }
  };

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    setShowAnswer(true);
    setIsTimerRunning(false);
  };

  const toggleTimer = () => {
    if (!isTimerRunning) {
      setTimer(timerDuration);
      setIsTimerRunning(true);
    } else {
      setIsTimerRunning(false);
    }
  };

  const currentCard = cards[currentIndex];

  return (
    <Box sx={{ position: 'relative' }}>
      <IconButton
        onClick={onBack}
        sx={{ position: 'absolute', left: -60, top: 0 }}
      >
        <ArrowBackIcon />
      </IconButton>

      <Paper
        elevation={3}
        sx={{
          p: 3,
          mb: 3,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Typography variant="h6">
          Card {currentIndex + 1} of {cards.length}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton onClick={toggleTimer} color={isTimerRunning ? 'primary' : 'default'}>
            <TimerIcon />
          </IconButton>
          {isTimerRunning && (
            <Typography variant="h6" color="primary">
              {timer}s
            </Typography>
          )}
        </Box>
      </Paper>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.3 }}
        >
          <Card sx={{ mb: 3, minHeight: 200 }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                {currentCard.question}
              </Typography>
              <FormControl component="fieldset" sx={{ width: '100%' }}>
                <RadioGroup
                  value={selectedOption}
                  onChange={(e) => handleOptionSelect(e.target.value)}
                >
                  {currentCard.options.map((option, index) => (
                    <FormControlLabel
                      key={index}
                      value={option}
                      control={<Radio />}
                      label={option}
                      disabled={showAnswer}
                    />
                  ))}
                </RadioGroup>
              </FormControl>
              {showAnswer && (
                <Box sx={{ mt: 2, p: 2, bgcolor: 'action.hover', borderRadius: 1 }}>
                  <Typography variant="h6" color="primary">
                    Correct Answer: {currentCard.correctOption}
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
        <Button
          variant="contained"
          onClick={handlePrevious}
          disabled={currentIndex === 0}
        >
          Previous
        </Button>
        <Button
          variant="contained"
          onClick={handleNext}
          disabled={currentIndex === cards.length - 1}
        >
          Next
        </Button>
      </Box>

      <Box sx={{ mt: 4 }}>
        <Typography gutterBottom>Timer Duration (seconds)</Typography>
        <Slider
          value={timerDuration}
          onChange={(e, newValue) => setTimerDuration(newValue)}
          min={5}
          max={120}
          step={5}
          marks
          valueLabelDisplay="auto"
        />
      </Box>
    </Box>
  );
};

export default FlashCardViewer; 