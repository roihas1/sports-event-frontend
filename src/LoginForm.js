import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from './axiosConfig';
import {
  Container,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Grid,
 
} from '@mui/material';
import { useError } from './ErrorContext';

const LoginForm = ({handleLoginExtra}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  // const [error] = useState('');
  const { showError } = useError();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post('/auth/signin', { username, password });
      const { accessToken } = response.data;
      const { expiresIn } = response.data;


      localStorage.setItem('token', accessToken);
      localStorage.setItem('expiresIn',  Date.now() + expiresIn * 1000);
      console.log("in handle submit",expiresIn);
      handleLoginExtra();
      navigate('/home'); // Redirect to the Home page
    } catch (err) {
      console.log(err);
      showError('Login failed. Please check your credentials.');
    }
  };

  const handleNavigateToSignup = () => {
    navigate('/signup'); // Redirect to the Sign Up page
  };

  return (
    <Container maxWidth="sm">
      <Card>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            Login
          </Typography>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Username"
                  variant="outlined"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Password"
                  type="password"
                  variant="outlined"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                >
                  Login
                </Button>
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="outlined"
                  color="secondary"
                  fullWidth
                  onClick={handleNavigateToSignup}
                >
                  Don't have an account? Sign Up
                </Button>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </Container>
  );
};

export default LoginForm;
