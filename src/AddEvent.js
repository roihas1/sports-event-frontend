import React, { useState } from 'react';
import axiosInstance from './axiosConfig';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Button,
  TextField,
  Card,
  CardContent,
  Grid,
  Alert,
  Box,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Stack
} from '@mui/material';
import SportType from './SportType';
import { useError } from './ErrorContext';

export default function AddEvent() {
  const [eventName, setEventName] = useState('');
  const [sportType, setSportType] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [maxParticipants, setMaxParticipants] = useState('');
  const [registrationDeadline, setRegistrationDeadline] = useState('');
  const { showError } = useError();
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (setter) => (e) => {
    setter(e.target.value);
  };

  const handleSportTypeChange = (e) => {
    setSportType(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post('/events', {
        eventName,
        sportType,
        description,
        date,
        time,
        location,
        maxParticipants: parseInt(maxParticipants, 10),
        registrationDeadline,
      });
      setSuccess('Event created successfully!');
      resetForm();
      setTimeout(() => navigate('/home'), 1500);
    } catch (err) {
      showError('Failed to create event. Please try again.');
    }
  };

  const resetForm = () => {
    setEventName('');
    setSportType('');
    setDescription('');
    setDate('');
    setTime('');
    setLocation('');
    setMaxParticipants('');
    setRegistrationDeadline('');
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
      <Card sx={{ p: 4, borderRadius: 2, boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h4" align="center" gutterBottom>
            Add New Event
          </Typography>
          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Event Name"
                  variant="outlined"
                  value={eventName}
                  onChange={handleInputChange(setEventName)}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth variant="outlined" required>
                  <InputLabel id="sport-type-label">Sport Category</InputLabel>
                  <Select
                    labelId="sport-type-label"
                    value={sportType}
                    onChange={handleSportTypeChange}
                    label="Sport Category"
                  >
                    {Object.values(SportType).map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  variant="outlined"
                  multiline
                  rows={4}
                  value={description}
                  onChange={handleInputChange(setDescription)}
                  required
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Date"
                  type="date"
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  value={date}
                  onChange={handleInputChange(setDate)}
                  required
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Time"
                  type="time"
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  value={time}
                  onChange={handleInputChange(setTime)}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Location (optional)"
                  variant="outlined"
                  value={location}
                  onChange={handleInputChange(setLocation)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Max Participants"
                  type="number"
                  variant="outlined"
                  value={maxParticipants}
                  onChange={handleInputChange(setMaxParticipants)}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Registration Deadline"
                  type="date"
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  value={registrationDeadline}
                  onChange={handleInputChange(setRegistrationDeadline)}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{ mt: 2 }}
                >
                  Add Event
                </Button>
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="outlined"
                  color="secondary"
                  fullWidth
                  onClick={() => navigate('/home')}
                  sx={{ mt: 2 }}
                >
                  Back to all events
                </Button>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}
