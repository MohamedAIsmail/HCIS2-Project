import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const defaultTheme = createTheme();

const SignIn: React.FC = () => {
  const [emailError, setEmailError] = React.useState<string>('');
  const [passwordError, setPasswordError] = React.useState<string>('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = data.get('email')as string;
    const password = data.get('password')as string;
    console.log(email)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      setEmailError('Please enter a valid email address.');
      return;
    } else {
      setEmailError('');
    }
  
    // Password Validation
    if (!password || password.length < 6) {
      setPasswordError('Password must be at least 6 characters.');
      return;
    } else {
      setPasswordError('');
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 15,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              error={!!emailError}
              helperText={emailError}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              error={!!passwordError}
              helperText={passwordError}
              sx={{
                '&:hover': {
                  borderColor: 'red',
                },
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, backgroundColor: '#7c73e6', '&:hover': {
                backgroundColor: '#9370DB',
              } }}
            >
              Sign In
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default SignIn;
