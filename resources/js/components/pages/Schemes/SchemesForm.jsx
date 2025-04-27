// resources/js/pages/Schemes/SchemeForm.jsx
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
  InputAdornment,
} from "@mui/material";
import { Save as SaveIcon, ArrowBack as ArrowBackIcon } from "@mui/icons-material";

const SchemeForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;

  const [scheme, setScheme] = useState({
    name: "",
    description: "",
    start_date: "",
    end_date: "",
    budget: "",
    eligibility_criteria: "",
    benefits: "",
    status: "draft",
  });
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    if (isEditMode) {
      setLoading(true);
      fetch(`/api/schemes/${id}`)
        .then((response) => response.json())
        .then((data) => {
          setScheme(data.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching scheme:", error);
          setError("Failed to load scheme data. Please try again.");
          setLoading(false);
        });
    }
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setScheme((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(null);

    const url = isEditMode ? `/api/schemes/${id}` : "/api/schemes";
    const method = isEditMode ? "PUT" : "POST";

    fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]').getAttribute("content"),
      },
      body: JSON.stringify(scheme),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to save scheme");
        }
        return response.json();
      })
      .then((data) => {
        setSuccess("Scheme saved successfully!");
        setSubmitting(false);
        // Redirect after a short delay
        setTimeout(() => {
          navigate("/schemes");
        }, 1500);
      })
      .catch((error) => {
        console.error("Error:", error);
        setError("Failed to save scheme. Please try again.");
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
          onClick={() => navigate("/schemes")}
          sx={{ mr: 2 }}
        >
          Back
        </Button>
        <Typography variant="h4" fontWeight="bold" color="primary.dark">
          {isEditMode ? "Edit Scheme" : "Add New Scheme"}
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
                Scheme Information
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                required
                fullWidth
                label="Scheme Name"
                name="name"
                value={scheme.name}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Status</InputLabel>
                <Select
                  name="status"
                  value={scheme.status}
                  onChange={handleChange}
                  label="Status"
                >
                  <MenuItem value="draft">Draft</MenuItem>
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                required
                fullWidth
                label="Start Date"
                name="start_date"
                type="date"
                value={scheme.start_date || ""}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="End Date"
                name="end_date"
                type="date"
                value={scheme.end_date || ""}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Budget"
                name="budget"
                type="number"
                value={scheme.budget || ""}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">₹</InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Description"
                name="description"
                multiline
                rows={3}
                value={scheme.description}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Eligibility Criteria"
                name="eligibility_criteria"
                multiline
                rows={3}
                value={scheme.eligibility_criteria}
                onChange={handleChange}
                placeholder="Specify who can apply for this scheme..."
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Benefits"
                name="benefits"
                multiline
                rows={3}
                value={scheme.benefits}
                onChange={handleChange}
                placeholder="Describe the benefits farmers will receive..."
              />
            </Grid>

            <Grid item xs={12} sx={{ mt: 2 }}>
              <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate("/schemes")}
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
                  {submitting ? "Saving..." : "Save Scheme"}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default SchemeForm;
