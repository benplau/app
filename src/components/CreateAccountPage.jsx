import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Grid,
  Paper,
  CircularProgress,
  IconButton,
  InputAdornment,
  Link,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import CheckIcon from "@mui/icons-material/Check";

const CreateAccountPage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState({ username: false, password: false });
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

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
      const response = await axios.post("/user-auth/create-account", {
        username,
        password,
        email,
      });
      console.log("response", response);
      if (response.data.status === "CREATE_ACCOUNT_SUCCESS") {
        setTimeout(() => {
          setLoading(false);
          setSuccess(true);

          setTimeout(() => {
            navigate("/login");
          }, 1000);
        }, 1000);
      } else if (response.data.status === "USER_ALREADY_EXIST") {
        setTimeout(() => {
          setErrorMessage("User with the same username already exists");
          setLoading(false);
        }, 1000);
      }
    } catch (err) {
      console.error("Error creating account: ", err);
      setLoading(false);
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleNavigateToSignIn = () => {
    navigate("/login");
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
            Create Account
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
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              error={error.username}
              helperText={error.username ? "Username is required" : ""}
              sx={{
                "& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline":
                  {
                    borderColor: "red",
                  },
              }}
            />
            <TextField
              margin="normal"
              fullWidth
              label="Email Address (optional)"
              name="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={error.password}
              helperText={error.password ? "Password is required" : ""}
              sx={{
                "& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline":
                  {
                    borderColor: "red",
                  },
              }}
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
                "Create Account"
              )}
            </Button>
            <Grid container>
              <Grid item>
                <Link href="#" variant="body2" onClick={handleNavigateToSignIn}>
                  {"Back to sign in"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};

export default CreateAccountPage;
