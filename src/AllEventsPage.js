import React, { useState, useCallback, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Typography, Container, Box, Card, Grid, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useError } from './ErrorContext'; // Import useError context
import axiosInstance from './axiosConfig';

// Styled Components
const StyledCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  boxShadow: theme.shadows[5],
  borderRadius: theme.shape.borderRadius,
  transition: 'transform 0.3s, box-shadow 0.3s',
  '&:hover': {
    transform: 'scale(1.02)',
    boxShadow: theme.shadows[8],
  },
}));

const FooterText = styled(Typography)(({ theme }) => ({
  marginTop: theme.spacing(2),
  fontStyle: 'italic',
  color: theme.palette.text.secondary,
}));

const EventLink = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
  color: theme.palette.text.primary,
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
}));

const AllEventsPage = () => {
  const { state } = useLocation();
  const { sectionName, events } = state || { sectionName: 'Events', events: [] };
  const { showError } = useError(); // Access error handling context
  const [fetchedEvents, setFetchedEvents] = useState([]);

  // Function to fetch registered events
  const fetchRegisteredEvents = useCallback(async () => {
    try {
      const response = await axiosInstance.get('/events/user/registeredEvents');
      setFetchedEvents(response.data);
    } catch (error) {
      showError('Error fetching registered events');
    }
  }, [showError]);

  // Fetch events on mount if viewing registered events
  useEffect(() => {
    if (sectionName === 'Registered Events') {
      fetchRegisteredEvents();
    }
  }, [sectionName, fetchRegisteredEvents]);

  // Handle deletion of a registration
  const handleDeleteRegistration = async (eventId, teamName) => {
    try {
      await axiosInstance.delete(`/events/${eventId}/registration/${teamName}`);
      fetchRegisteredEvents(); // Refetch events after deletion
    } catch (error) {
      showError('Error deleting registration');
    }
  };

  return (
    <Box sx={{ flexGrow: 1, bgcolor: '#f5f5f5', py: 6 }}>
      <Container maxWidth="lg">
        <Typography variant="h2" align="center" gutterBottom sx={{ mb: 4 }}>
          {sectionName}
        </Typography>
        
        {fetchedEvents.length > 0 || events.length > 0 ? (
          <Grid container spacing={4}>
            {sectionName === 'Registered Events' ? (
              fetchedEvents.map(reg => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={reg.id}>
                  <StyledCard>
                    <EventLink to={`/events/${reg.event.id}`}>
                      <Typography variant="h5" gutterBottom>
                        {reg.event.eventName}
                      </Typography>
                      <Typography variant="body1" color="textSecondary">
                        {reg.event.date}
                      </Typography>
                      <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                        {reg.event.description}
                      </Typography>
                      <FooterText>
                        Team: {reg.team.teamName}
                      </FooterText>
                      <FooterText>
                        Sport Category: {reg.event.sportType || 'General'}
                      </FooterText>
                      </EventLink>
                      <Button
                        variant="outlined"
                        color="secondary"
                        onClick={() => handleDeleteRegistration(reg.event.id, reg.team.teamName)}
                        sx={{ mt: 2 }}
                      >
                        Cancel Registration
                      </Button>
                    
                  </StyledCard>
                </Grid>
              ))
            ) : (
              events.map(event => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={event.id}>
                  <StyledCard>
                    <EventLink to={`/events/${event.id}`}>
                      <Typography variant="h5" gutterBottom>
                        {event.eventName}
                      </Typography>
                      <Typography variant="body1" color="textSecondary">
                        {event.date}
                      </Typography>
                      <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                        {event.description}
                      </Typography>
                      <FooterText>
                        Sport Category: {event.sportType || 'General'}
                      </FooterText>
                    </EventLink>
                  </StyledCard>
                </Grid>
              ))
            )}
          </Grid>
        ) : (
          <Typography>No events available.</Typography>
        )}
      </Container>
    </Box>
  );
};

export default AllEventsPage;
