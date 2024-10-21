import React, { useEffect, useState, useCallback } from "react";
import axiosInstance from "./axiosConfig";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Button, Grid, Box, Typography, Paper } from "@mui/material";
import EventSummary from "./EventSummary";
import TeamOptions from "./TeamOptions";
import CreateTeamForm from "./CreateTeamForm";
import { styled } from '@mui/material/styles';
import { useError } from './ErrorContext';

const StyledButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(1),
  padding: theme.spacing(1, 2),
  borderRadius: theme.shape.borderRadius,
  textTransform: 'none',
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  fontWeight: 'bold',
  color: "#2E3B55",
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  height: '100%',
}));

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState("");
  const [showTeamOptions, setShowTeamOptions] = useState(false);
  const [showCreateTeam, setShowCreateTeam] = useState(false);
  const [newTeamName, setNewTeamName] = useState("");
  const [newTeamMembers, setNewTeamMembers] = useState([]);
  const [numOfTeams, setNumOfTeams] = useState(0);
  const [isOwner, setIsOwner] = useState(false);
  const [isScheduleCreated, setIsScheduleCreated] = useState(false);
  const [eventDate, setEventDate] = useState(null);
  const [registrationDeadline, setRegistrationDeadline] = useState(null);
  const { showError } = useError();
  
  useEffect(() => {
    async function fetchEvent() {
      try {
        const response = await axiosInstance.get(`/events/${id}`);
        setEvent(response.data);
        setEventDate(new Date(response.data.date));
        setRegistrationDeadline(new Date(response.data.registrationDeadline));

        const teamsResponse = await axiosInstance.get(`/events/${id}/numOfTeams`);
        setNumOfTeams(teamsResponse.data);

        const myResponse = await axiosInstance.get("/events");
        const events = myResponse.data;
        const foundEvent = events.find((event) => event.id === id);

        setIsOwner(foundEvent);

        // Check if schedule is created
        const scheduleResponse = await axiosInstance.get(`/schedule/games/${id}`);
        setIsScheduleCreated(scheduleResponse.data.length > 0);
      } catch (err) {
        showError("Error fetching event details");
      }
    }
    fetchEvent();
  }, [id, showError]);

  useEffect(() => {
    async function fetchUserTeams() {
      try {
        const response = await axiosInstance.get("/team");
        setTeams(response.data);
      } catch (err) {
        showError("Error fetching your teams");
      }
    }
    fetchUserTeams();
  }, [showError]);

  const handleBack = () => navigate("/home");
  const handleRegister = () => setShowTeamOptions(true);
  const handleCreateTeam = () => setShowCreateTeam(true);
  const handleViewBracket = () => navigate(`/tournament-bracket/${id}`,{
    state:{isOwner}
  });

  const handleSubmitRegistration = async () => {
    if (selectedTeam) {
      try {
        await axiosInstance.post(`/events/${id}/register`, {
          teamName: selectedTeam,
          status: "registered",
        });
        navigate("/home");
      } catch (err) {
        showError("Error registering for event");
      }
    } else if (newTeamName && newTeamMembers.length > 0) {
      try {
        await axiosInstance.post("/team", {
          teamName: newTeamName,
          members: newTeamMembers,
        });

        await axiosInstance.post(`/events/${id}/register`, {
          teamName: newTeamName,
          status: "registered",
        });
        navigate("/home");
      } catch (err) {
        showError("Error creating team or registering for event");
      }
    } else {
      showError("Please select an existing team or create a new one.");
    }
  };

  const handleCreateSchedule = async () => {
    try {
      await axiosInstance.post(`/schedule/create/${id}`, {
        startDate: event.date,
        startTime: event.time,
      });
      setIsScheduleCreated(true);
    } catch (err) {
      showError("Error creating schedule");
    }
  };

  const isPastRegistrationDeadline = registrationDeadline ? new Date() > registrationDeadline : false;
  const canCreateSchedule = numOfTeams > 2;

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <SectionTitle variant="h4">Event Details</SectionTitle>
        </Grid>
        <Grid item xs={12}>
          <StyledPaper elevation={3}>
            <EventSummary event={event} numOfTeams={numOfTeams} />
            <Box sx={{ mt: 3 }}>
              <Grid container spacing={2}>
                <Grid item>
                  <StyledButton variant="outlined" color="primary" onClick={handleBack}>
                    BACK TO ALL EVENTS
                  </StyledButton>
                </Grid>
                {!showTeamOptions && (
                  <Grid item>
                    <StyledButton 
                      variant="contained" 
                      color="secondary" 
                      onClick={handleRegister} 
                      disabled={isPastRegistrationDeadline}
                    >
                      Register
                    </StyledButton>
                  </Grid>
                )}
                {isOwner && (
                  <Grid item>
                    <StyledButton
                      variant="contained"
                      color="success"
                      onClick={handleCreateSchedule}
                      disabled={isScheduleCreated || !canCreateSchedule}
                    >
                      Create Schedule
                    </StyledButton>
                  </Grid>
                )}
                {isScheduleCreated && (
                  <Grid item>
                    <StyledButton
                      variant="contained"
                      color="primary"
                      onClick={handleViewBracket}
                    >
                      View Tournament Bracket
                    </StyledButton>
                  </Grid>
                )}
              </Grid>
            </Box>
          </StyledPaper>
        </Grid>
        {showTeamOptions && (
          <Grid item xs={12}>
            <StyledPaper elevation={3}>
              <TeamOptions
                teams={teams}
                selectedTeam={selectedTeam}
                setSelectedTeam={setSelectedTeam}
                handleSubmitRegistration={handleSubmitRegistration}
                handleCreateTeam={handleCreateTeam}
                showCreateTeam={showCreateTeam}
                setShowCreateTeam={setShowCreateTeam}
                setShowTeamOptions={setShowTeamOptions}
              />
            </StyledPaper>
          </Grid>
        )}
        {showCreateTeam && (
          <Grid item xs={12}>
            <StyledPaper elevation={3}>
              <CreateTeamForm
                newTeamName={newTeamName}
                setNewTeamName={setNewTeamName}
                newTeamMembers={newTeamMembers}
                setNewTeamMembers={setNewTeamMembers}
                handleSubmitRegistration={handleSubmitRegistration}
                setShowCreateTeam={setShowCreateTeam}
              />
            </StyledPaper>
          </Grid>
        )}
      </Grid>
    </Container>
  );
};

export default EventDetails;
