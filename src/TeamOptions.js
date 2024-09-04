import React from "react";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  Card,
  CardContent,
} from "@mui/material";

function TeamOptions({
  teams,
  selectedTeam,
  setSelectedTeam,
  handleSubmitRegistration,
  handleCreateTeam,
  showCreateTeam,
  setShowCreateTeam,
  setShowTeamOptions, 
}) {
  return (
    <Card style={{ marginTop: "20px" }}>
      <CardContent>
        <Button
          variant="outlined"
          color="error"
          onClick={() => setShowTeamOptions(false)} // Close the component
          style={{ marginBottom: "10px" }}
        >
          Close
        </Button>
        {teams.length > 0 ? (
          <>
            <Typography variant="h6">Select a Team</Typography>
            <FormControl fullWidth variant="outlined" margin="normal">
              <InputLabel id="team-select-label">Team</InputLabel>
              <Select
                labelId="team-select-label"
                value={selectedTeam}
                onChange={(e) => setSelectedTeam(e.target.value)}
                label="Team"
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {teams.map((team) => (
                  <MenuItem key={team.id} value={team.teamName}>
                    {team.teamName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmitRegistration}
            >
              Register with Selected Team
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => setShowCreateTeam(true)}
              style={{ marginLeft: "10px" }}
            >
              Create New Team
            </Button>
          </>
        ) : (
          <>
            <Typography>
              You don't have any teams. Please create a new team.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setShowCreateTeam(true)}
            >
              Create New Team
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}

export default TeamOptions;
