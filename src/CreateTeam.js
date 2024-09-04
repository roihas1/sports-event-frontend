import React, { useState } from 'react';
import axiosInstance from './axiosConfig';
import { useNavigate } from 'react-router-dom';

function CreateTeam() {
  const [teamName, setTeamName] = useState('');
  const [members, setMembers] = useState(['']); // Start with one empty member field
  const navigate = useNavigate();

  const handleMemberChange = (index, value) => {
    const updatedMembers = [...members];
    updatedMembers[index] = value;
    setMembers(updatedMembers);
  };

  const addMemberField = () => {
    setMembers([...members, '']);
  };

  const removeMemberField = (index) => {
    const updatedMembers = members.filter((_, i) => i !== index);
    setMembers(updatedMembers);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Remove empty members
      const filteredMembers = members.filter(member => member.trim() !== '');
      
      await axiosInstance.post('/team', { teamName, members: filteredMembers });
      alert('Team created successfully!');
      navigate('/home'); // Redirect to home page after creating team
    } catch (err) {
      console.error('Error creating team', err);
      alert('Failed to create team.');
    }
  };

  return (
    <div>
      <h1>Create New Team</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Team Name"
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
          required
        />
        <div>
          <h3>Members</h3>
          {members.map((member, index) => (
            <div key={index}>
              <input
                type="text"
                placeholder={`Member ${index + 1}`}
                value={member}
                onChange={(e) => handleMemberChange(index, e.target.value)}
                required
              />
              <button type="button" onClick={() => removeMemberField(index)}>Remove</button>
            </div>
          ))}
          <button type="button" onClick={addMemberField}>Add Another Member</button>
        </div>
        <button type="submit">Create Team</button>
      </form>
    </div>
  );
}

export default CreateTeam;
