import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import {  Typography, Paper, Button } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import * as XLSX from 'xlsx';

const FlashCardUploader = ({ onFileUpload }) => {
  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(firstSheet);

      const formattedCards = jsonData.map(row => ({
        question: row.question || '',
        options: [
          row.option1 || '',
          row.option2 || '',
          row.option3 || '',
          row.option4 || '',
          row.option5 || ''
        ].filter(option => option !== ''),
        correctOption: row.correctOption || ''
      }));

      onFileUpload(formattedCards);
    };

    reader.readAsArrayBuffer(file);
  }, [onFileUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls']
    },
    multiple: false
  });

  return (
    <Paper
      elevation={3}
      sx={{
        p: 4,
        textAlign: 'center',
        borderRadius: 2,
        bgcolor: 'background.paper'
      }}
    >
      <Typography variant="h4" gutterBottom>
        Flash Card Generator
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Upload your Excel file containing questions and options
      </Typography>
      <Box
        {...getRootProps()}
        sx={{
          border: '2px dashed',
          borderColor: isDragActive ? 'primary.main' : 'grey.300',
          borderRadius: 2,
          p: 4,
          cursor: 'pointer',
          '&:hover': {
            borderColor: 'primary.main',
            bgcolor: 'action.hover'
          }
        }}
      >
        <input {...getInputProps()} />
        <CloudUploadIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
        <Typography variant="h6" gutterBottom>
          {isDragActive
            ? 'Drop the Excel file here'
            : 'Drag and drop an Excel file here, or click to select'}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Supported formats: .xlsx, .xls
        </Typography>
      </Box>
    </Paper>
  );
};

export default FlashCardUploader; 
