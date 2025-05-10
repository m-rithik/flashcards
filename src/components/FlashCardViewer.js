import React, { useState, useEffect } from 'react';

const TIMER_DURATION = 40;

const FlashCardViewer = ({ cards, onBack }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState('');
  const [showAnswer, setShowAnswer] = useState(false);
  const [timer, setTimer] = useState(TIMER_DURATION);
  const [answers, setAnswers] = useState(Array(cards.length).fill(null));
  const [shuffledOptions, setShuffledOptions] = useState([]);

  useEffect(() => {
    setTimer(TIMER_DURATION);
    setShowAnswer(false);
    setSelectedOption(answers[currentIndex] || '');
    // Shuffle options when card changes
    const options = [...cards[currentIndex].options];
    for (let i = options.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [options[i], options[j]] = [options[j], options[i]];
    }
    setShuffledOptions(options);
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev === 1) {
          clearInterval(interval);
          setShowAnswer(true);
        }
        return prev > 0 ? prev - 1 : 0;
      });
    }, 1000);
    return () => clearInterval(interval);
    // eslint-disable-next-line
  }, [currentIndex]);

  // Normalize for answer checking
  const getCorrectOption = () => {
    const correct = cards[currentIndex].correctOption;
    // If correct is a number, use as index; else, match by value
    if (typeof correct === 'number') {
      return cards[currentIndex].options[correct - 1] || '';
    }
    // Try to match ignoring case and whitespace
    const found = cards[currentIndex].options.find(
      (opt) =>
        String(opt).trim().toLowerCase() === String(correct).trim().toLowerCase()
    );
    return found || correct;
  };

  const handleOptionSelect = (option) => {
    if (showAnswer) return;
    setSelectedOption(option);
    setShowAnswer(true);
    const updatedAnswers = [...answers];
    updatedAnswers[currentIndex] = option;
    setAnswers(updatedAnswers);
  };

  const handleNavigate = (idx) => {
    setCurrentIndex(idx);
  };

  const getOptionClass = (option) => {
    const correctOption = getCorrectOption();
    if (!showAnswer) return 'option-btn';
    if (option === correctOption) return 'option-btn correct';
    if (option === selectedOption) return 'option-btn wrong';
    return 'option-btn';
  };

  const getFeedback = () => {
    const correctOption = getCorrectOption();
    if (!showAnswer) return null;
    if (selectedOption === correctOption) {
      return <div className="feedback correct">Correct!</div>;
    } else if (selectedOption) {
      return (
        <div className="feedback wrong">
          Wrong! Correct Answer: <b>{correctOption}</b>
        </div>
      );
    } else {
      return (
        <div className="feedback wrong">
          Time's up! Correct Answer: <b>{correctOption}</b>
        </div>
      );
    }
  };

  // For navigation panel: 10 per row
  const navRows = [];
  for (let i = 0; i < cards.length; i += 10) {
    navRows.push(cards.slice(i, i + 10));
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', width: '100%', position: 'relative' }}>
      {/* Main Card Area */}
      <div style={{ flex: 1, maxWidth: 750, minWidth: 400, margin: '0 auto', display: 'flex', justifyContent: 'center' }}>
        <div className="card" style={{ margin: '0 auto', marginBottom: 32, width: '100%', boxSizing: 'border-box' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <button onClick={onBack} className="nav-link" style={{ width: 80, fontSize: 16 }}>Back</button>
            <div style={{ fontWeight: 600, fontSize: 18 }}>Question {currentIndex + 1} / {cards.length}</div>
            <div style={{ fontWeight: 600, fontSize: 18, color: timer <= 10 ? '#f15bb5' : '#e0aaff' }}>{timer}s</div>
          </div>
          <h2 style={{ color: '#22223b', marginBottom: 24, fontWeight: 600, fontSize: 28, textAlign: 'left', letterSpacing: 0.5 }}>{cards[currentIndex].question}</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {shuffledOptions.map((option, idx) => (
              <button
                key={idx}
                className={getOptionClass(option)}
                onClick={() => handleOptionSelect(option)}
                disabled={showAnswer}
                style={{ fontSize: 18, padding: '16px 0', borderRadius: 10, border: 'none', cursor: showAnswer ? 'not-allowed' : 'pointer', transition: '0.2s', fontWeight: 500, color: '#22223b', background: '#fff', marginBottom: 8, textAlign: 'left', paddingLeft: 20 }}
              >
                {String.fromCharCode(97 + idx) + '. '} {option}
              </button>
            ))}
          </div>
          {getFeedback()}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 32 }}>
            <button
              className="nav-link"
              style={{ width: 100, fontSize: 16, color: '#22223b' }}
              onClick={() => setCurrentIndex((prev) => Math.max(prev - 1, 0))}
              disabled={currentIndex === 0}
            >
              Previous
            </button>
            <button
              className="nav-link"
              style={{ width: 100, fontSize: 16, color: '#22223b' }}
              onClick={() => setCurrentIndex((prev) => Math.min(prev + 1, cards.length - 1))}
              disabled={currentIndex === cards.length - 1}
            >
              Next
            </button>
          </div>
        </div>
      </div>
      {/* Navigation Panel */}
      <div style={{
        minWidth: 320,
        maxWidth: 400,
        background: 'rgba(128, 106, 200, 0.15)',
        borderRadius: 10,
        padding: 10,
        height: 'fit-content',
        boxShadow: '0 0 8px rgba(255,255,255,0.08)',
        position: 'fixed',
        top: 40,
        right: 40,
        zIndex: 1000
      }}>
        <div style={{ fontWeight: 600, color: '#22223b', marginBottom: 8, fontSize: 15, textAlign: 'center' }}>Quiz navigation</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, justifyContent: 'center' }}>
          {navRows.map((row, rowIdx) => (
            <div key={rowIdx} style={{ display: 'flex', gap: 4, justifyContent: 'center', marginBottom: 2 }}>
              {row.map((_, idx) => {
                const realIdx = rowIdx * 10 + idx;
                return (
                  <button
                    key={realIdx}
                    className="nav-link"
                    style={{
                      minWidth: 28,
                      minHeight: 28,
                      maxWidth: 32,
                      maxHeight: 32,
                      margin: 2,
                      borderRadius: 6,
                      background: realIdx === currentIndex ? '#e0aaff' : answers[realIdx] ? (answers[realIdx] === (typeof cards[realIdx].correctOption === 'number' ? cards[realIdx].options[cards[realIdx].correctOption - 1] : cards[realIdx].correctOption) ? '#38b000' : '#f15bb5') : 'rgba(0,0,0,0.07)',
                      color: realIdx === currentIndex ? '#3a0ca3' : '#22223b',
                      fontWeight: 600,
                      border: realIdx === currentIndex ? '2px solid #f15bb5' : '1px solid rgba(255,255,255,0.1)',
                      boxShadow: realIdx === currentIndex ? '0 0 6px #f15bb5' : 'none',
                      cursor: 'pointer',
                      fontSize: 14,
                      padding: 0
                    }}
                    onClick={() => handleNavigate(realIdx)}
                  >
                    {realIdx + 1}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FlashCardViewer; 