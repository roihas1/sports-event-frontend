import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Typography, Container, Box, Card, Grid } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useError } from './ErrorContext'; // Import useError context

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

  return (
    <Box sx={{ flexGrow: 1, bgcolor: '#f5f5f5', py: 6 }}>
      <Container maxWidth="lg">
        <Typography variant="h2" align="center" gutterBottom sx={{ mb: 4 }}>
          {sectionName}
        </Typography>
        
        {events.length > 0 ? (
          <Grid container spacing={4}>
            {sectionName === 'Registered Events' ? (
              events.map(reg => (
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
                        Sport Type: {reg.event.sportType || 'General'}
                      </FooterText>
                    </EventLink>
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
                        Sport Type: {event.sportType || 'General'}
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
