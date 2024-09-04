import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Button, Grid, Card, CardContent } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { styled } from '@mui/material/styles';

// Custom styles
const useStyles = styled((theme) => ({
  container: {
    marginTop: theme.spacing(12),
    textAlign: 'center',
  },
  card: {
    padding: theme.spacing(4),
    boxShadow: theme.shadows[5],
  },
  button: {
    margin: theme.spacing(1),
    transition: 'background-color 0.3s ease',
    '&:hover': {
      backgroundColor: theme.palette.primary.dark,
      color: theme.palette.getContrastText(theme.palette.primary.dark),
    },
  },
  image: {
    width: '100%',
    height: 'auto',
    marginBottom: theme.spacing(4),
  },
}));

const WelcomePage = () => {
  const classes = useStyles();
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleSignupClick = () => {
    navigate('/signup');
  };

  return (
    <Container maxWidth="md" className={classes.container}>
      <Card className={classes.card}>
        <CardContent>
          {/* Optional Background Image */}
         

          <Typography variant="h3" gutterBottom>
            Welcome to Sports Event Management!
          </Typography>
          <Typography variant="h6" color="textSecondary" paragraph>
            Manage and participate in your favorite sports events with ease! Our platform allows users to create, manage, and join sports events effortlessly. Whether you are an event organizer or a participant, our tools help you stay on top of your game!
          </Typography>
          <Typography variant="h6" color="textSecondary" paragraph>
            Get started by logging in to your account or signing up for a new one. Join our community and explore a world of sports activities!
          </Typography>
          <Grid container spacing={3} justifyContent="center">
            <Grid item>
              <Button variant="contained" color="primary" className={classes.button} onClick={handleLoginClick}>
                Login
              </Button>
            </Grid>
            <Grid item>
              <Button variant="outlined" color="secondary" className={classes.button} onClick={handleSignupClick}>
                Sign Up
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Container>
  );
};

export default WelcomePage;
