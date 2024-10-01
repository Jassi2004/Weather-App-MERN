import { useState } from 'react';
import { TextField, Button, Container, Typography } from '@mui/material';
import api from '../utils/api';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      console.log("hello there");
      
      const response = await api.post('/register', { username, password });
      setMessage(response.data.message);
    } catch (error) {
      setMessage('Registration failed. Please try again.', error);
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Register</Typography>
      <form onSubmit={handleRegister}>
        <TextField
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          margin="normal"
          required
        />
        <Button variant="contained" color="primary" type="submit" fullWidth>
          Register
        </Button>
      </form>
      {message && <Typography>{message}</Typography>}
    </Container>
  );
};

export default Register;
