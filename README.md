# Flash Card Generator

A modern web application for creating and studying flash cards from Excel files. The application features a beautiful UI, timer functionality, and smooth animations.

## Features

- Upload Excel files containing questions and options
- Interactive flash card interface
- Timer functionality with adjustable duration
- Multiple choice questions with immediate feedback
- Smooth animations and transitions
- Responsive design

## Excel File Format

Your Excel file should have the following columns:
- `question`: The question text
- `option1`, `option2`, `option3`, `option4`, `option5`: The possible answers
- `correctOption`: The correct answer (should match one of the options)

Example:
```
question | option1 | option2 | option3 | option4 | option5 | correctOption
What is 2+2? | 3 | 4 | 5 | 6 | 7 | 4
```

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

## Usage

1. Click the upload area or drag and drop your Excel file
2. Once uploaded, you'll see your flash cards
3. Use the timer button to start/stop the timer
4. Adjust the timer duration using the slider
5. Select an answer to see if it's correct
6. Use the Previous/Next buttons to navigate between cards

## Technologies Used

- React
- Material-UI
- Framer Motion
- XLSX
- React Dropzone 