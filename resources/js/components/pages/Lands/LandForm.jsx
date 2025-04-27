// resources/js/pages/Lands/LandForm.jsx
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

const LandForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;

  const [land, setLand] = useState({
    farmer_id: "",
    title: "",
    area: "",
    unit: "hectares",
    address: "",
    coordinates: "",
    soil_type: "",
    irrigation_type: "",
  });
  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    // Fetch farmers for dropdown
    fetch("/api/farmers")
      .then((response) => response.json())
      .then((data) => {
        setFarmers(data.data || []);
      })
      .catch((error) => {
        console.error("Error fetching farmers:", error);
      });

    if (isEditMode) {
      setLoading(true);
      fetch(`/api/lands/${id}`)
        .then((response) => response.json())
        .then((data) => {
          const landData = data.data;
          // Convert coordinates object to string for form
          if (landData.coordinates && typeof landData.coordinates === 'object') {
            landData.coordinates = JSON.stringify(landData.coordinates);
          }
          setLand(landData);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching land:", error);
          setError("Failed to load land data. Please try again.");
          setLoading(false);
        });
    }
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLand((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(null);

    // Prepare data for submission
    const formData = new FormData();
    
    // Append all fields to FormData
    Object.keys(land).forEach(key => {
      if (key === 'coordinates' && land[key]) {
        // Ensure coordinates are properly formatted as JSON
        try {
          // Check if it's already a string
          if (typeof land[key] === 'string') {
            // Try to parse it to validate JSON format
            JSON.parse(land[key]);
            formData.append(key, land[key]);
          } else {
            // If it's an object, stringify it
            formData.append(key, JSON.stringify(land[key]));
          }
        } catch (e) {
          setError("Invalid coordinates format. Please use valid JSON.");
          setSubmitting(false);
          return;
        }
      } else if (land[key] !== null && land[key] !== undefined) {
        formData.append(key, land[key]);
      }
    });

    // Handle file upload if present
    if (document.getElementById('ownership_document').files[0]) {
      formData.append('ownership_document', document.getElementById('ownership_document').files[0]);
    }

    const url = isEditMode ? `/api/lands/${id}` : "/api/lands";
    const method = isEditMode ? "POST" : "POST"; // Using POST with FormData for both create and update

    // Add _method field for Laravel to recognize as PUT when editing
    if (isEditMode) {
      formData.append('_method', 'PUT');
    }

    fetch(url, {
      method: method,
      headers: {
        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
      },
      body: formData,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to save land");
        }
        return response.json();
      })
      .then((data) => {
        setSuccess("Land parcel saved successfully!");
        setSubmitting(false);
        // Redirect after a short delay
        setTimeout(() => {
          navigate("/lands");
        }, 1500);
      })
      .catch((error) => {
        console.error("Error:", error);
        setError("Failed to save land parcel. Please try again.");
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
          onClick={() => navigate("/lands")}
          sx={{ mr: 2 }}
        >
          Back
        </Button>
        <Typography variant="h4" fontWeight="bold" color="primary.dark">
          {isEditMode ? "Edit Land Parcel" : "Add New Land Parcel"}
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
                Land Parcel Information
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Farmer</InputLabel>
                <Select
                  name="farmer_id"
                  value={land.farmer_id || ""}
                  onChange={handleChange}
                  label="Farmer"
                >
                  <MenuItem value="">
                    <em>Select a farmer</em>
                  </MenuItem>
                  {farmers.map((farmer) => (
                    <MenuItem key={farmer.id} value={farmer.id}>
                      {farmer.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                required
                fullWidth
                label="Land Title"
                name="title"
                value={land.title || ""}
                onChange={handleChange}
                placeholder="e.g., North Field"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                required
                fullWidth
                label="Area"
                name="area"
                type="number"
                value={land.area || ""}
                onChange={handleChange}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <FormControl variant="standard" sx={{ minWidth: 80 }}>
                        <Select
                          name="unit"
                          value={land.unit || "hectares"}
                          onChange={handleChange}
                        >
                          <MenuItem value="hectares">hectares</MenuItem>
                          <MenuItem value="acres">acres</MenuItem>
                          <MenuItem value="sq.m">sq.m</MenuItem>
                        </Select>
                      </FormControl>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Soil Type"
                name="soil_type"
                value={land.soil_type || ""}
                onChange={handleChange}
                placeholder="e.g., Clay, Sandy, Loam"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Irrigation Type"
                name="irrigation_type"
                value={land.irrigation_type || ""}
                onChange={handleChange}
                placeholder="e.g., Drip, Sprinkler, Flood"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Coordinates (JSON)"
                name="coordinates"
                value={land.coordinates || ""}
                onChange={handleChange}
                placeholder='e.g., {"lat": 12.345, "lng": 67.890}'
                helperText="Enter as JSON object with latitude and longitude"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address"
                name="address"
                multiline
                rows={2}
                value={land.address || ""}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Ownership Document
              </Typography>
              <input
                id="ownership_document"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                style={{ width: '100%', padding: '10px 0' }}
              />
              {land.ownership_document && (
                <Typography variant="caption" display="block" gutterBottom>
                  Current document: {land.ownership_document.split('/').pop()}
                </Typography>
              )}
            </Grid>

            <Grid item xs={12} sx={{ mt: 2 }}>
              <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate("/lands")}
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
                  {submitting ? "Saving..." : "Save Land Parcel"}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default LandForm;
