import React, { useEffect, useState } from 'react';
import axiosInstance from './axiosConfig';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import CreateTeamForm from './CreateTeamForm';
import { useError } from './ErrorContext';

// Styled Components
const StyledCard = styled(Card)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  boxShadow: theme.shadows[3],
  
}));

const StyledCardContent = styled(CardContent)(({ theme }) => ({
  flex: '1 0 auto',
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
  transition: "color 0.3s, background-color 0.3s ease", // Transition for smooth hover effect
  "&:hover": {
    backgroundColor: "#fff", // Change the background color on hover
    color: "#2E3B55", // Change text color to the same as the original background color
  }
}));


const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    padding: theme.spacing(2),
  },
}));


function MyTeams() {
  const [teams, setTeams] = useState([]);
  const [error] = useState('');
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false); // State for Create Team dialog
  const [newTeamName, setNewTeamName] = useState(''); // State for new team name
  const [newTeamMembers, setNewTeamMembers] = useState([]); // State for new team members
  const [newMember, setNewMember] = useState(''); // State for new member
  const [memberToDelete, setMemberToDelete] = useState(''); // State for member to delete
  const [successMessage, setSuccessMessage] = useState('');
  const { showError } = useError();

  useEffect(() => {
    fetchTeams();
  },[]);

  const fetchTeams = async () => {
    try {
      const response = await axiosInstance.get('/team');
      setTeams(response.data);
    } catch (err) {
      showError('Error fetching your teams');
    }
  };

  const handleEditOpen = (team) => {
    setSelectedTeam(team);
    setIsEditOpen(true);
  };

  const handleEditClose = () => {
    setIsEditOpen(false);
    setNewMember('');
    setMemberToDelete('');
  };

  const handleCreateOpen = () => {
    setIsCreateOpen(true);
  };

  const handleCreateClose =  () => {
    setIsCreateOpen(false);
    setNewTeamName('');
    setNewTeamMembers([]);
    fetchTeams();
  };


  const handleCreateTeam = async () => {
    if (newTeamName && newTeamMembers.length) {
      try {
       await axiosInstance.post('/team', {
          teamName: newTeamName,
          members: newTeamMembers,
        });
        setSuccessMessage('Team created successfully!');
        setTimeout(() => {
          setSuccessMessage('');
        }, 5000);
        fetchTeams();
        handleCreateClose();
      } catch (err) {
        
        showError(err.response.data.message);
      }
    }
  };

  const handleAddMember = async () => {
    if (newMember) {
      try {
        await axiosInstance.put(`/team/${selectedTeam.teamName}/add`, { memberName: newMember });
        setTeams(teams.map(team => team.teamName === selectedTeam.teamName ? { ...team, members: [...team.members, newMember] } : team));
        handleEditClose();
      } catch (err) {
        showError('Error adding new member to the team');
      }
    }
  };

  const handleDeleteMember = async () => {
    if (memberToDelete) {
      try {
        await axiosInstance.delete(`/team/${selectedTeam.teamName}/deleteMember`, { data: { memberName: memberToDelete } });
        setTeams(teams.map(team => team.teamName === selectedTeam.teamName ? { ...team, members: team.members.filter(member => member !== memberToDelete) } : team));
        handleEditClose();
      } catch (err) {
        showError('Error deleting member from the team');
      }
    }
  };

  const handleDeleteTeam = async () => {
    try {
      await axiosInstance.delete(`/team/${selectedTeam.teamName}/delete`);
      setTeams(teams.filter(team => team.teamName !== selectedTeam.teamName));
      handleEditClose();
    } catch (err) {
      showError('Error deleting the team');
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        My Teams
      </Typography>

      {error && <Alert severity="error">{error}</Alert>}
      {successMessage && <Alert severity="success">{successMessage}</Alert>} {/* Success message */}
      <StyledButton variant="contained" color="primary" onClick={handleCreateOpen} sx={{ mb: 4 }}>
        Create New Team
      </StyledButton>

      <Grid container spacing={3}>
        {teams.length > 0 ? (
          teams.map((team) => (
            <Grid item xs={12} sm={6} md={4} key={team.id}>
              <StyledCard>
                <StyledCardContent>
                  <Typography variant="h6" gutterBottom>
                    {team.teamName}
                  </Typography>
                  <Typography variant="body1">
                    Members:
                    <ul>
                      {team.members.map((member, index) => (
                        <li key={index}>{member}</li>
                      ))}
                    </ul>
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Created on: {new Date(team.createdAt).toLocaleDateString()}
                  </Typography>
                  <StyledButton
                    variant="outlined"
                    onClick={() => handleEditOpen(team)}
                  >
                    Edit Team
                  </StyledButton>
                </StyledCardContent>
              </StyledCard>
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Typography variant="body1">You have no teams yet.</Typography>
          </Grid>
        )}
      </Grid>

      <Dialog open={isCreateOpen} onClose={handleCreateClose}>
        <CreateTeamForm
          newTeamName={newTeamName}
          setNewTeamName={setNewTeamName}
          newTeamMembers={newTeamMembers}
          setNewTeamMembers={setNewTeamMembers}
          handleSubmitRegistration={handleCreateTeam}
          setShowCreateTeam={setIsCreateOpen}
        />
      </Dialog>

      <StyledDialog open={isEditOpen} onClose={handleEditClose}>
        <DialogTitle>Edit Team - {selectedTeam?.teamName}</DialogTitle>
        <DialogContent>
          <DialogContentText>Add a new member to the team:</DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="New Member Name"
            fullWidth
            value={newMember}
            onChange={(e) => setNewMember(e.target.value)}
          />
          <DialogContentText>Delete a member from the team:</DialogContentText>
          <TextField
            margin="dense"
            label="Member Name to Delete"
            fullWidth
            value={memberToDelete}
            onChange={(e) => setMemberToDelete(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddMember} color="primary">
            Add Member
          </Button>
          <Button onClick={handleDeleteMember} color="secondary">
            Delete Member
          </Button>
          <Button onClick={handleDeleteTeam} color="error">
            Delete Team
          </Button>
          <Button onClick={handleEditClose} color="inherit">
            Cancel
          </Button>
        </DialogActions>
      </StyledDialog>
    </Container>
  );
}

export default MyTeams;
