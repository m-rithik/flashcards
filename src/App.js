import React, { useState } from 'react';
import './quizsphere.css';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import FlashCardUploader from './components/FlashCardUploader';
import FlashCardViewer from './components/FlashCardViewer';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2196f3',
    },
    secondary: {
      main: '#f50057',
    },
  },
});

function App() {
  const [flashCards, setFlashCards] = useState([]);
  const [showCards, setShowCards] = useState(false);

  const handleFileUpload = (cards) => {
    setFlashCards(cards);
    setShowCards(true);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', py: 4 }}>
        <Container maxWidth="md">
          {!showCards ? (
            <FlashCardUploader onFileUpload={handleFileUpload} />
          ) : (
            <FlashCardViewer 
              cards={flashCards} 
              onBack={() => setShowCards(false)} 
            />
          )}
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App; 