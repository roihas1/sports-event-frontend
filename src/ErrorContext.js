import React, { createContext, useContext, useState } from 'react';
import { Snackbar, SnackbarContent, IconButton, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import ErrorIcon from '@mui/icons-material/Error';

const ErrorContext = createContext();

const StyledSnackbar = styled(Snackbar)(({ theme }) => ({
  '& .MuiSnackbarContent-root': {
    backgroundColor: theme.palette.error.light,
    color: theme.palette.common.white,
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(2), 
    borderRadius: theme.shape.borderRadius, 
    width: 500,  
  },
  
  position: 'absolute',
  top: theme.spacing(2),
  right: theme.spacing(2),
}));

const StyledSnackbarContent = styled(SnackbarContent)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
}));

const ErrorIconStyled = styled(ErrorIcon)(({ theme }) => ({
  marginRight: theme.spacing(1),
}));

const CloseButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.common.white,
}));

export const ErrorProvider = ({ children }) => {
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);

  const showError = (message) => {
    setError(message);
    setOpen(true);
    setTimeout(() => {
      setOpen(false);
    }, 5000);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <ErrorContext.Provider value={{ showError }}>
      {children}
      <StyledSnackbar
        open={open}
        autoHideDuration={5000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }} // Anchor to top-right
      >
        <StyledSnackbarContent
          message={
            <Typography variant="body2" component="span" style={{ display: 'flex', alignItems: 'center', fontSize:'1.2rem' }}>
              <ErrorIconStyled />
              {error}
            </Typography>
          }
          action={
            <CloseButton size="small" onClick={handleClose}>
              <CloseIcon />
            </CloseButton>
          }
        />
      </StyledSnackbar>
    </ErrorContext.Provider>
  );
};

export const useError = () => useContext(ErrorContext);
