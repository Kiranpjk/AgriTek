// resources/js/pages/Farmers/FarmerForm.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Alert,
  CircularProgress,
} from "@mui/material";
import { Save as SaveIcon, ArrowBack as ArrowBackIcon } from "@mui/icons-material";

const FarmerForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;

  const [farmer, setFarmer] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    id_number: "",
    dob: "",
    gender: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    if (isEditMode) {
      setLoading(true);
      fetch(`/api/farmers/${id}`)
        .then((response) => response.json())
        .then((data) => {
          setFarmer(data.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching farmer:", error);
          setError("Failed to load farmer data. Please try again.");
          setLoading(false);
        });
    }
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFarmer((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(null);

    const url = isEditMode ? `/api/farmers/${id}` : "/api/farmers";
    const method = isEditMode ? "PUT" : "POST";

    fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]').getAttribute("content"),
      },
      body: JSON.stringify(farmer),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to save farmer");
        }
        return response.json();
      })
      .then((data) => {
        setSuccess("Farmer saved successfully!");
        setSubmitting(false);
        // Redirect after a short delay
        setTimeout(() => {
          navigate("/farmers");
        }, 1500);
      })
      .catch((error) => {
        console.error("Error:", error);
        setError("Failed to save farmer. Please try again.");
        setSubmitting(false);
      });
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/farmers")}
          sx={{ mr: 2 }}
        >
          Back
        </Button>
        <Typography variant="h4" fontWeight="bold" color="primary.dark">
          {isEditMode ? "Edit Farmer" : "Add New Farmer"}
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {success}
        </Alert>
      )}

      <Paper sx={{ p: 4 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" color="primary">
                Personal Information
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                required
                fullWidth
                label="Full Name"
                name="name"
                value={farmer.name}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                required
                fullWidth
                label="ID Number"
                name="id_number"
                value={farmer.id_number}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Phone Number"
                name="phone"
                value={farmer.phone || ""}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={farmer.email || ""}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Date of Birth"
                name="dob"
                type="date"
                value={farmer.dob || ""}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Gender</InputLabel>
                <Select
                  name="gender"
                  value={farmer.gender || ""}
                  onChange={handleChange}
                  label="Gender"
                >
                  <MenuItem value="">
                    <em>Select</em>
                  </MenuItem>
                  <MenuItem value="male">Male</MenuItem>
                  <MenuItem value="female">Female</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address"
                name="address"
                multiline
                rows={3}
                value={farmer.address || ""}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sx={{ mt: 2 }}>
              <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate("/farmers")}
                  sx={{ mr: 2 }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  startIcon={<SaveIcon />}
                  disabled={submitting}
                >
                  {submitting ? "Saving..." : "Save Farmer"}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default FarmerForm;
