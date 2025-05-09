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

const TIMER_DURATION = 40;

const FlashCardViewer = ({ cards, onBack }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [selectedOption, setSelectedOption] = useState('');
  const [timer, setTimer] = useState(TIMER_DURATION);
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const [answers, setAnswers] = useState(Array(cards.length).fill(null));

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

  useEffect(() => {
    setTimer(TIMER_DURATION);
    setIsTimerRunning(true);
    setShowAnswer(false);
    setSelectedOption(answers[currentIndex] || '');
  }, [currentIndex]);

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    setShowAnswer(true);
    setIsTimerRunning(false);
    const updatedAnswers = [...answers];
    updatedAnswers[currentIndex] = option;
    setAnswers(updatedAnswers);
  };

  const handleNavigate = (idx) => {
    setCurrentIndex(idx);
  };

  const currentCard = cards[currentIndex];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'row', gap: 4 }}>
      <Box sx={{ flex: 1, position: 'relative' }}>
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
            background: 'rgba(255,255,255,0.95)',
            borderRadius: 3,
          }}
        >
          <Typography variant="h6">
            Card {currentIndex + 1} of {cards.length}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <TimerIcon color={timer <= 10 ? 'error' : 'primary'} />
            <Typography variant="h6" color={timer <= 10 ? 'error' : 'primary'}>
              {timer}s
            </Typography>
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
            <Card sx={{ mb: 3, minHeight: 200, borderRadius: 3 }}>
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
                        sx={{
                          bgcolor:
                            showAnswer && option === currentCard.correctOption
                              ? 'success.light'
                              : showAnswer && option === selectedOption && option !== currentCard.correctOption
                              ? 'error.light'
                              : 'inherit',
                          borderRadius: 2,
                          my: 0.5,
                        }}
                      />
                    ))}
                  </RadioGroup>
                </FormControl>
                {showAnswer && (
                  <Box sx={{ mt: 2, p: 2, bgcolor: selectedOption === currentCard.correctOption ? 'success.light' : 'error.light', borderRadius: 1 }}>
                    <Typography variant="h6" color={selectedOption === currentCard.correctOption ? 'success.main' : 'error.main'}>
                      {selectedOption === currentCard.correctOption ? 'Correct!' : `Wrong! Correct Answer: ${currentCard.correctOption}`}
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
            onClick={() => setCurrentIndex((prev) => Math.max(prev - 1, 0))}
            disabled={currentIndex === 0}
          >
            Previous
          </Button>
          <Button
            variant="contained"
            onClick={() => setCurrentIndex((prev) => Math.min(prev + 1, cards.length - 1))}
            disabled={currentIndex === cards.length - 1}
          >
            Next
          </Button>
        </Box>
      </Box>
      {/* Navigation Panel */}
      <Box sx={{ width: 120, bgcolor: 'rgba(255,255,255,0.85)', borderRadius: 3, p: 2, height: 'fit-content', mt: 2 }}>
        <Typography variant="subtitle1" align="center" gutterBottom>
          Questions
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center' }}>
          {cards.map((_, idx) => (
            <Button
              key={idx}
              variant={idx === currentIndex ? 'contained' : answers[idx] ? 'outlined' : 'text'}
              color={answers[idx] ? (answers[idx] === cards[idx].correctOption ? 'success' : 'error') : 'primary'}
              size="small"
              sx={{ minWidth: 36, minHeight: 36, m: 0.5, borderRadius: 2 }}
              onClick={() => handleNavigate(idx)}
            >
              {idx + 1}
            </Button>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default FlashCardViewer; 
