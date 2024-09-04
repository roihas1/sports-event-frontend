import React from "react";
import { Card, CardContent, Typography, Divider, Grid, Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import { Event, LocationOn, DateRange, Group, AccessTime } from "@mui/icons-material";

// Styled components
const StyledCard = styled(Card)(({ theme }) => ({
  marginTop: theme.spacing(3),
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[5], // Slightly increase shadow for more emphasis
}));

const Title = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  fontWeight: 'bold',
  color: theme.palette.primary.main,
  textAlign: 'center',
}));

const InfoItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: theme.spacing(1.5),
}));

const IconWrapper = styled(Box)(({ theme }) => ({
  marginRight: theme.spacing(1),
  color: theme.palette.text.secondary,
}));

const DividerStyled = styled(Divider)(({ theme }) => ({
  margin: theme.spacing(2, 0),
}));

const EventSummary = ({ event, numOfTeams }) => {
  return (
    <StyledCard>
      <CardContent>
        <Title variant="h5" gutterBottom>
          {event?.eventName || "Event Name"}
        </Title>
        <DividerStyled />

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <InfoItem>
              <IconWrapper>
                <Event />
              </IconWrapper>
              <Typography variant="h6" color="textSecondary">Sport Type:</Typography>
              <Typography variant="body1" marginLeft={1}>{event?.sportType || "N/A"}</Typography>
            </InfoItem>

            <InfoItem>
              <IconWrapper>
                <DateRange />
              </IconWrapper>
              <Typography variant="h6" color="textSecondary">Date:</Typography>
              <Typography variant="body1" marginLeft={1}>{event?.date || "N/A"}</Typography>
            </InfoItem>

            <InfoItem>
              <IconWrapper>
                <AccessTime />
              </IconWrapper>
              <Typography variant="h6" color="textSecondary">Time:</Typography>
              <Typography variant="body1" marginLeft={1}>{event?.time || "N/A"}</Typography>
            </InfoItem>
          </Grid>

          <Grid item xs={12} sm={6}>
            <InfoItem>
              <IconWrapper>
                <LocationOn />
              </IconWrapper>
              <Typography variant="h6" color="textSecondary">Location:</Typography>
              <Typography variant="body1" marginLeft={1}>{event?.location || "N/A"}</Typography>
            </InfoItem>

            <InfoItem>
              <IconWrapper>
                <Group />
              </IconWrapper>
              <Typography variant="h6" color="textSecondary">Max Teams:</Typography>
              <Typography variant="body1" marginLeft={1}>{event?.maxParticipants || "N/A"}</Typography>
            </InfoItem>

            <InfoItem>
              <IconWrapper>
                <Group />
              </IconWrapper>
              <Typography variant="h6" color="textSecondary">Registered Teams:</Typography>
              <Typography variant="body1" marginLeft={1}>{numOfTeams || "0"}</Typography>
            </InfoItem>
          </Grid>
        </Grid>

        <DividerStyled />

        <InfoItem>
          <Typography variant="h6" color="textSecondary">Registration Deadline:</Typography>
          <Typography variant="body1" marginLeft={1}>{event?.registrationDeadline || "N/A"}</Typography>
        </InfoItem>

      </CardContent>
    </StyledCard>
  );
}

export default EventSummary;
