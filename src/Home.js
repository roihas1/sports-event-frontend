import React, { useEffect, useState, useCallback } from 'react';
import axiosInstance from './axiosConfig';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Button, 
  Container, 
  Card, 
  Typography, 
  Grid, 
  Box, 
  CircularProgress, 
  MenuItem, 
  Select 
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useError } from './ErrorContext';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';

// Styled Components
const SortContainer = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  padding: theme.spacing(0),
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[3],
  display: 'flex',          
  alignItems: 'center',     
  justifyContent: 'center', 
  gap: theme.spacing(2),    
}));

const SortLabel = styled(Typography)(({ theme }) => ({
  marginRight: theme.spacing(2),
  color: theme.palette.text.primary,
  fontWeight: 'bold',
}));

const StyledSelect = styled(Select)(({ theme }) => ({
  minWidth: 180,
  backgroundColor: theme.palette.background.default,
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: theme.palette.primary.main,
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: theme.palette.primary.light,
  },
}));

const SortOption = styled(Box)({
  display: 'flex',
  alignItems: 'center',
});

const StyledCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  boxShadow: theme.shadows[5],
  borderRadius: theme.shape.borderRadius,
  transition: 'transform 0.3s, box-shadow 0.3s',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  '&:hover': {
    transform: 'scale(1.02)',
    boxShadow: theme.shadows[8],
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  textTransform: 'uppercase',
  padding: theme.spacing(1.5, 4),
  fontWeight: 'bold',
  marginTop: theme.spacing(2.5),
  marginRight: theme.spacing(2.5),
  backgroundColor: "#2E3B55",
  color: "white",
  transition: "color 0.3s, background-color 0.3s ease", 
  "&:hover": {
    backgroundColor: "#fff", 
    color: "#2E3B55", 
  }
}));


const SectionTitle = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  fontWeight: 'bold',
  color: "#2E3B55",
}));

const SectionContainer = styled(Grid)(({ theme }) => ({
  marginBottom: theme.spacing(4),
}));

const EventLink = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
  color: theme.palette.text.primary,
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
}));

const FooterText = styled(Typography)(({ theme }) => ({
  marginTop: theme.spacing(2),
  fontStyle: 'italic',
  color: theme.palette.text.secondary,
}));

const Home = () => {
  const [events, setEvents] = useState([]);
  const [myEvents, setMyEvents] = useState([]);
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { showError } = useError();
  const navigate = useNavigate();
  const [sortCriteria, setSortCriteria] = useState('date');

  // Fetch functions
  const fetchEvents = useCallback(async () => {
    try {
      const response = await axiosInstance.get('/events/others');
      setEvents(response.data);
    } catch (error) {
      showError('Error fetching other events');
    }
  }, [showError]);

  const fetchMyEvents = useCallback(async () => {
    try {
      const response = await axiosInstance.get('/events');
      setMyEvents(response.data);
    } catch (error) {
      showError('Error fetching my events');
    }
  }, [showError]);

  const fetchRegisteredEvents = useCallback(async () => {
    try {
      const response = await axiosInstance.get('/events/user/registeredEvents');
      setRegisteredEvents(response.data);
    } catch (error) {
      showError('Error fetching registered events');
    }
  }, [showError]);

  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([fetchEvents(), fetchMyEvents(), fetchRegisteredEvents()]);
      } catch (err) {
        showError('Error loading data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [fetchEvents, fetchMyEvents, fetchRegisteredEvents, showError]);

  const sortEvents = (events) => {
    return [...events].sort((a, b) => {
      if (sortCriteria === 'date') {
        return new Date(a.date) - new Date(b.date);
      } else if (sortCriteria === 'sportType') {
        return a.sportType?.localeCompare(b.sportType);
      }
      return 0;
    });
  };
  const handleSortChange = (event) => {
    setSortCriteria(event.target.value);
  };
  const handleAddEvent = () => {
    navigate('/add-event');
  };
  const sortedEvents = sortEvents(events);
  const sortedMyEvents = sortEvents(myEvents);
  const sortedRegisteredEvents = sortEvents(registeredEvents);

  const handleDeleteRegistration = async (eventId, teamName) => {
    try {
      await axiosInstance.delete(`/events/${eventId}/registration/${teamName}`);
      fetchRegisteredEvents(); // Refresh registered events after deletion
    } catch (error) {
      showError('Error deleting registration');
    }
  };

  const handleDeleteEvent = async (eventId) => {
    try {
      await axiosInstance.delete(`/events/${eventId}`);
      setMyEvents((prevEvents) => prevEvents.filter((event) => event.id !== eventId));
    } catch (error) {
      showError('Error deleting event');
    }
  };

  const handleViewAll = (sectionName, eventsList) => {
    navigate('/all-events', { state: { sectionName, events: eventsList } });
  };

  if (loading) {
    return (
      <Box sx={{ flexGrow: 1, bgcolor: '#f5f5f5', py: 6 }}>
        <Container maxWidth="lg">
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
            <CircularProgress />
          </Box>
        </Container>
      </Box>
    );
  }


  return (
    <Box sx={{ flexGrow: 1, bgcolor: '#f5f5f5', py: 6 }}>
      <Container maxWidth="lg">
        <Typography variant="h2" align="center" gutterBottom sx={{ mb: 4 }}>
          Sports Events
        </Typography>
        

        <SortContainer>
        <StyledButton variant="contained" color="primary" onClick={handleAddEvent}>
          Add New Event
        </StyledButton>
          <SortLabel variant="h6" component="span">
            Sort By:
          </SortLabel>
          <StyledSelect
            value={sortCriteria}
            onChange={handleSortChange}
            variant="outlined"
          >
            <MenuItem value="date">
              <SortOption>
                <CalendarTodayIcon sx={{ mr: 1 }} />
                Date
              </SortOption>
            </MenuItem>
            <MenuItem value="sportType">
              <SortOption>
                <SportsSoccerIcon sx={{ mr: 1 }} />
                Sport Category
              </SortOption>
            </MenuItem>
          </StyledSelect>
        </SortContainer>

        <Grid container spacing={4}>
          {/* My Events Section */}
          <SectionContainer item xs={12} md={4}>
            <SectionTitle variant="h4" component="div">
              My Events
            </SectionTitle>
            {sortedMyEvents.length > 0 ? (
              <>
                {sortedMyEvents.slice(0, 5).map(event => (
                  <StyledCard key={event.id}>
                    <EventLink to={`/events/${event.id}`}>
                      <Typography variant="h5" gutterBottom>
                        {event.eventName}
                      </Typography>
                      <Typography variant="body1" color="textSecondary">
                        {event.date}
                      </Typography>
                      <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                        {event.eventDescription}
                      </Typography>
                      <FooterText>
                        Sport Category: {event.sportType || 'General'}
                      </FooterText>
                    </EventLink>
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={() => handleDeleteEvent(event.id)}
                      sx={{ mt: 2 }}
                    >
                      Delete Event
                    </Button>
                  </StyledCard>
                ))}
                {sortedMyEvents.length > 5 && (
                  <StyledButton variant="contained" color="primary" onClick={() => handleViewAll('My Events', sortedMyEvents)}>
                    View All My Events
                  </StyledButton>
                )}
              </>
            ) : (
              <Typography>No events created yet.</Typography>
            )}
          </SectionContainer>

          {/* Registered Events Section */}
          <SectionContainer item xs={12} md={4}>
            <SectionTitle variant="h4" component="div">
              Registered Events
            </SectionTitle>
            {sortedRegisteredEvents.length > 0 ? (
              <>
                {sortedRegisteredEvents.slice(0, 5).map(reg => (
                  <StyledCard key={reg.id}>
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
                        Team: {reg.team.teamName} | Sport Category: {reg.event.sportType || 'General'}
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
                ))}
                {sortedRegisteredEvents.length > 5 && (
                  <StyledButton variant="contained" color="primary" onClick={() => handleViewAll('Registered Events', sortedRegisteredEvents)}>
                    View All Registered Events
                  </StyledButton>
                )}
              </>
            ) : (
              <Typography>You have not registered for any events yet.</Typography>
            )}
          </SectionContainer>

          {/* Other Events Section */}
          <SectionContainer item xs={12} md={4}>
            <SectionTitle variant="h4" component="div">
              Other Events
            </SectionTitle>
            {sortedEvents.length > 0 ? (
              <>
                {sortedEvents.slice(0, 5).map(event => (
                  <StyledCard key={event.id}>
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
                ))}
                {sortedEvents.length > 5 && (
                  <StyledButton variant="contained" color="primary" onClick={() => handleViewAll('Other Events', sortedEvents)}>
                    View All Other Events
                  </StyledButton>
                )}
              </>
            ) : (
              <Typography>No other events available.</Typography>
            )}
          </SectionContainer>
        </Grid>
      </Container>
    </Box>
  );
};

export default Home;