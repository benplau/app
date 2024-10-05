import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Link,
  Grid,
  Paper,
  CircularProgress,
  IconButton,
  InputAdornment,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import axios from "axios";
import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";

const SignInPage = () => {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [error, setError] = useState({ username: false, password: false });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      setError({
        username: !username,
        password: !password,
      });
      return;
    }

    setError({ username: false, password: false });
    setErrorMessage("");
    setLoading(true);

    try {
      const response = await axios.post("/user-auth/login", {
        username,
        password,
      });

      const { status, id, username: userNameFromApi } = response.data;

      if (status === "LOGIN_SUCCESS") {
        setTimeout(() => {
          setLoading(false);
          setSuccess(true);

          setTimeout(() => {
            navigate("/judgment-debt");
            const userInfo = { id, username: userNameFromApi };
            login(userInfo);
          }, 1000);
        }, 1000);
      } else if (status === "USER_NOT_FOUND") {
        setTimeout(() => {
          setErrorMessage("User not found in system");
          setLoading(false);
        }, 1000);
      } else if (status === "INCORRECT_PASSWORD") {
        setTimeout(() => {
          setErrorMessage("Incorrect password");
          setLoading(false);
        }, 1000);
      }
    } catch (err) {
      setErrorMessage("Login failed. Please check your credentials.");
      console.error("Login error: ", err);
      setLoading(false);
    }
  };

  const handleCreateAccount = () => {
    navigate("/create-account");
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Grid container component="main" sx={{ height: "100vh" }}>
      <Grid
        item
        xs={12}
        sm={8}
        md={5}
        component={Paper}
        elevation={6}
        square
        sx={{ margin: "auto" }}
      >
        <Box
          sx={{
            my: 8,
            mx: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography component="h1" variant="h5">
            Sign In
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              label="Username"
              name="username"
              autoComplete="username"
              error={error.username}
              helperText={error.username ? "Username is required" : ""}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              error={error.password}
              helperText={error.password ? "Password is required" : ""}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            {errorMessage && (
              <Typography variant="body2" color="error" sx={{ mt: 2 }}>
                {errorMessage}
              </Typography>
            )}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading || success}
            >
              {loading ? (
                <CircularProgress size={24} />
              ) : success ? (
                <CheckIcon />
              ) : (
                "Sign In"
              )}
            </Button>
            <Grid container>
              <Grid item>
                <Link href="#" variant="body2" onClick={handleCreateAccount}>
                  {"Don't have an account? Create one here"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};

export default SignInPage;
