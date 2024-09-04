import React from "react";
import { Button, TextField, Card, CardContent, Typography } from "@mui/material";

function CreateTeamForm({
  newTeamName,
  setNewTeamName,
  newTeamMembers,
  setNewTeamMembers,
  handleSubmitRegistration,
  setShowCreateTeam,
}) {
  return (
    <Card style={{ marginTop: "20px" }}>
      <CardContent>
      <Button
          variant="outlined"
          color="error"
          onClick={() => setShowCreateTeam(false)} // Close the component
          style={{ marginBottom: "10px" }}
        >
          Close
        </Button>
        <Typography variant="h6">Create a New Team</Typography>
        <TextField
          label="Team Name"
          variant="outlined"
          fullWidth
          margin="normal"
          value={newTeamName}
          onChange={(e) => setNewTeamName(e.target.value)}
        />
        <TextField
          label="Members (comma separated)"
          variant="outlined"
          fullWidth
          margin="normal"
          value={newTeamMembers.join(",")}
          onChange={(e) => setNewTeamMembers(e.target.value.split(","))}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmitRegistration}
        >
          Create Team and Register
        </Button>
      </CardContent>
    </Card>
  );
}

export default CreateTeamForm;
