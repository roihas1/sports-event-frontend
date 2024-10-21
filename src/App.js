import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginForm from './LoginForm';
import Home from './Home';
import SignupForm from './SignUpForm';
import AddEvent from './AddEvent';
import EventDetails from './EventDetails';
import CreateTeam from './CreateTeam';
import MyTeams from './MyTeams';
import Navbar from './NavBar';
import { ErrorProvider } from './ErrorContext';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import axiosInstance  from './axiosConfig';
import PrivateRoute from './PrivateRoute';
import WelcomePage from './WelcomePage';
import AllEventsPage from './AllEventsPage';
import TournamentBracket from './TournamentBracket';


function isTokenExpired() {
  const token = localStorage.getItem('token');
  const expiresIn = localStorage.getItem('expiresIn');

  if (!token || !expiresIn) {
    return true;
  }

  return Date.now()+2005 > Number(expiresIn);
}
function App() {
  const [isLoggedOut, setIsLoggedOut] = useState(false);
  const [authStatus, setAuthStatus] = useState(false);



  useEffect(() => {
    
    let interval;
    if (authStatus) {
      const checkTokenExpiration = () => {
        console.log("inside interval");
        if (isTokenExpired() ) {
          handleLogout(true);
        }
      };
      const expiresIn = localStorage.getItem('expiresIn');
      console.log(Date.now()+1000  )
      console.log(Number(expiresIn))
      interval = setInterval(checkTokenExpiration,Number(expiresIn) - Date.now()- 2000); 
    }

    return () => clearInterval(interval); 
  }, [authStatus]);

  const handleLogout = async (fromInterval) => {
    try {
      await axiosInstance.patch('/auth/logout');
    } catch (err) {
      console.log('Logout failed:', err);
    }
    console.log("logout");
    localStorage.removeItem('token');
    localStorage.removeItem('expiresIn');
    setAuthStatus(false); 
    if(fromInterval){
      setIsLoggedOut(true);
    }
    
    
  };
  
  const handleDialogClose = () => {
    setIsLoggedOut(false);
    window.location.href = '/login';
   
  };

  const handleLoginExtra = () => {
    console.log('in handle extra');
    setAuthStatus(true);
  };
  return (
    <Router>
      <ErrorProvider >
      <Navbar handleLogout={handleLogout}/>
      
      <Routes>
        <Route path="/login" element={<LoginForm handleLoginExtra={handleLoginExtra}/>} />
        <Route path="/signup" element={<SignupForm/>} />
        <Route path="/" exact element={<WelcomePage />} />

        <Route path="/home" element={<PrivateRoute><Home/></PrivateRoute>} />
        <Route path="/add-event" element={<PrivateRoute><AddEvent /></PrivateRoute>} />
        <Route path="/events/:id" element={<PrivateRoute><EventDetails /></PrivateRoute>} />
        <Route path="/create-team" element={<PrivateRoute><CreateTeam /></PrivateRoute>} />
        <Route path="/my-teams" element={<PrivateRoute><MyTeams/></PrivateRoute>}/>
        <Route path="/all-events" element={<PrivateRoute><AllEventsPage /></PrivateRoute>} />
        <Route path='/tournament-bracket/:id' element={<PrivateRoute><TournamentBracket/></PrivateRoute>}/>

      </Routes>
      <Dialog
          open={isLoggedOut}
          onClose={handleDialogClose}
          disableBackdropClick
          disableEscapeKeyDown
        >
          <DialogTitle>Session Expired</DialogTitle>
          <DialogContent>
            Your session has expired. You have been logged out.
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogClose}>Login Again</Button>
          </DialogActions>
        </Dialog>
      </ErrorProvider>
    </Router>
  );
}

export default App;
