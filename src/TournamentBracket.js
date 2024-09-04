import React, { useState, useEffect } from "react";
import { Card, CardContent, Typography, Divider, Box, Button, CircularProgress } from "@mui/material";
import { styled } from "@mui/material/styles";
import axiosInstance from './axiosConfig';
import { useError } from './ErrorContext';
import { useLocation, useNavigate, useParams } from "react-router-dom";

// Styled components (unchanged)
const StyledCard = styled(Card)(({ theme }) => ({
  marginTop: theme.spacing(3),
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[3],
  width: '100%',
  overflowX: 'auto',
}));

const StyledButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(1),
  padding: theme.spacing(1, 2),
  borderRadius: theme.shape.borderRadius,
  textTransform: 'none',
}));

const Title = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  fontWeight: 'bold',
  color: theme.palette.primary.main,
  textAlign: 'center',
}));

const BracketContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'flex-start',
  alignItems: 'center',
  padding: theme.spacing(2),
}));

const Round = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  marginRight: theme.spacing(4),
}));

const Match = styled(Box)(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(1),
  marginBottom: theme.spacing(2),
  width: '220px', // Slightly increased width to accommodate scores
  backgroundColor: theme.palette.background.default,
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

const TeamRow = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
});

const Team = styled(Typography)(({ theme, winner }) => ({
  fontWeight: winner ? 'bold' : 'normal',
  color: winner ? theme.palette.success.main : theme.palette.text.primary,
}));

const Score = styled(Typography)(({ theme }) => ({
  marginLeft: theme.spacing(1),
  fontWeight: 'bold',
}));

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  });
};

function TournamentBracket() {
  const { id } = useParams();
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showError } = useError();
  const navigate = useNavigate();
  const location = useLocation();
  const isOwner = location.state?.isOwner || false;

  
  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await axiosInstance.get(`/schedule/games/${id}`);
        setGames(response.data);
      } catch (err) {
        console.error('Error fetching games:', err);
        showError('Failed to fetch games');
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, [id, showError]);

  const handleBack = () => navigate(`/events/${id}`);

  const deleteAllGames = async () => {
    try {
      await axiosInstance.delete(`/schedule/games/${id}`);
      setGames([]); // Clear the games state after deletion
    } catch (error) {
      console.error('Error deleting games:', error);
      showError('Failed to delete games');
    }
  };
  const handleUpdateScore = async (game) => {
    const team1Score = prompt(`Enter the new score for ${game.team1.teamName}:`, game.score ? game.score[0] : 0);
    const team2Score = prompt(`Enter the new score for ${game.team2.teamName}:`, game.score ? game.score[1] : 0);
  
    if (team1Score !== null && team2Score !== null) {
      try {
        setLoading(true);
        const response = await axiosInstance.patch(`/schedule/update/${game.id}/score`, {
          matchScore: [Number(team1Score), Number(team2Score)]
        });
  
        setGames((prevGames) => {
          console.log(prevGames)
          const newGames = prevGames.map((g) =>
            g.id === game.id ? { ...g, score: response.data.score } : g
          );
          return newGames;  
        });
      } catch (error) {
        console.error('Error updating score:', error);
        showError('Failed to update score');
      }
      finally{
        setLoading(false);
      }
    }
  };
  
  // Group games by round
  const roundsMap = games.reduce((acc, game) => {
    acc[game.round] = [...(acc[game.round] || []), game];
    return acc;
  }, {});

  const rounds = Object.entries(roundsMap).sort(([a], [b]) => Number(a) - Number(b));

  if (loading) {
    return (
      <StyledCard>
        <CardContent>
          <Title variant="h5">Tournament Bracket</Title>
          <Divider style={{ marginBottom: '16px' }} />
          <CircularProgress />
        </CardContent>
      </StyledCard>
    );
  }


  return (
    <StyledCard>
      <CardContent>
        <Title variant="h5">Tournament Bracket</Title>
        <Divider style={{ marginBottom: '16px' }} />
       
        <Box display="flex" justifyContent="flex-start" mb={2} gap={1}>
          <StyledButton
            variant="outlined" 
            color="primary"
            onClick={handleBack}
          >
            Back to Event Details
          </StyledButton>
          <StyledButton 
            variant="contained" 
            color="error" 
            onClick={deleteAllGames}
          >
            Delete All Games
          </StyledButton>
        </Box>
        
        <BracketContainer>
          {rounds.map(([roundNum, roundGames]) => (
            <Round key={roundNum}>
              <Typography variant="subtitle1" align="center" gutterBottom>
                Round {roundNum}
              </Typography>
              {roundGames.map((game, index) => (
                <Match key={index}>
                  <TeamRow>
                    <Team winner={game.winnerId === game.team1?.id}>
                      {game.team1 ? game.team1.teamName : 'N/A'}
                    </Team>
                    {game.score && <Score>{game.score[0]}</Score>}
                  </TeamRow>
                  <TeamRow>
                    <Team winner={game.winnerId === game.team2?.id}>
                      {game.team2 ? game.team2.teamName : 'N/A'}
                    </Team>
                    {game.score && <Score>{game.score[1]}</Score>}
                  </TeamRow>
                  <Typography variant="caption" color="textSecondary">
                    {formatDate(game.date)}
                  </Typography>
                  {isOwner && (
                    <StyledButton
                      variant="contained"
                      color="primary"
                      onClick={() => handleUpdateScore(game)}
                    >
                      Update Score
                    </StyledButton>
                  )}
                </Match>
              ))}
            </Round>
          ))}
          
        </BracketContainer>
        
      </CardContent>
    </StyledCard>
  );
}

export default TournamentBracket;
