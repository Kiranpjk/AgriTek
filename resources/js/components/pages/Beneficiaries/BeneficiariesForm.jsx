// resources/js/pages/Beneficiaries/BeneficiaryForm.jsx
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

const BeneficiaryForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;

  const [beneficiary, setBeneficiary] = useState({
    farmer_id: "",
    scheme_id: "",
    land_id: "",
    application_date: new Date().toISOString().split("T")[0],
    status: "pending",
    amount_received: "",
    remarks: "",
  });
  
  const [farmers, setFarmers] = useState([]);
  const [schemes, setSchemes] = useState([]);
  const [lands, setLands] = useState([]);
  const [farmerLands, setFarmerLands] = useState([]);
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

    // Fetch schemes for dropdown
    fetch("/api/schemes")
      .then((response) => response.json())
      .then((data) => {
        setSchemes(data.data || []);
      })
      .catch((error) => {
        console.error("Error fetching schemes:", error);
      });

    // Fetch all lands
    fetch("/api/lands")
      .then((response) => response.json())
      .then((data) => {
        setLands(data.data || []);
      })
      .catch((error) => {
        console.error("Error fetching lands:", error);
      });

    if (isEditMode) {
      setLoading(true);
      fetch(`/api/beneficiaries/${id}`)
        .then((response) => response.json())
        .then((data) => {
          setBeneficiary(data.data);
          // If there's a farmer_id, fetch their lands
          if (data.data.farmer_id) {
            fetchFarmerLands(data.data.farmer_id);
          }
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching beneficiary:", error);
          setError("Failed to load beneficiary data. Please try again.");
          setLoading(false);
        });
    }
  }, [id, isEditMode]);

  const fetchFarmerLands = (farmerId) => {
    const filtered = lands.filter(land => land.farmer_id === farmerId);
    setFarmerLands(filtered);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // If changing farmer, update available lands
    if (name === "farmer_id") {
      setBeneficiary(prev => ({
        ...prev,
        [name]: value,
        land_id: "" // Reset land selection when farmer changes
      }));
      fetchFarmerLands(value);
    } else {
      setBeneficiary(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(null);

    const url = isEditMode ? `/api/beneficiaries/${id}` : "/api/beneficiaries";
    const method = isEditMode ? "PUT" : "POST";

    fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]').getAttribute("content"),
      },
      body: JSON.stringify(beneficiary),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to save beneficiary");
        }
        return response.json();
      })
      .then((data) => {
        setSuccess("Beneficiary saved successfully!");
        setSubmitting(false);
        // Redirect after a short delay
        setTimeout(() => {
          navigate("/beneficiaries");
        }, 1500);
      })
      .catch((error) => {
        console.error("Error:", error);
        setError("Failed to save beneficiary. Please try again.");
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
          onClick={() => navigate("/beneficiaries")}
          sx={{ mr: 2 }}
        >
          Back
        </Button>
        <Typography variant="h4" fontWeight="bold" color="primary.dark">
          {isEditMode ? "Edit Beneficiary" : "Add New Beneficiary"}
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
                Beneficiary Information
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Farmer</InputLabel>
                <Select
                  name="farmer_id"
                  value={beneficiary.farmer_id || ""}
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
              <FormControl fullWidth required>
                <InputLabel>Scheme</InputLabel>
                <Select
                  name="scheme_id"
                  value={beneficiary.scheme_id || ""}
                  onChange={handleChange}
                  label="Scheme"
                >
                  <MenuItem value="">
                    <em>Select a scheme</em>
                  </MenuItem>
                  {schemes.map((scheme) => (
                    <MenuItem key={scheme.id} value={scheme.id}>
                      {scheme.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Land Parcel</InputLabel>
                <Select
                  name="land_id"
                  value={beneficiary.land_id || ""}
                  onChange={handleChange}
                  label="Land Parcel"
                  disabled={!beneficiary.farmer_id || farmerLands.length === 0}
                >
                  <MenuItem value="">
                    <em>Select a land parcel</em>
                  </MenuItem>
                  {farmerLands.map((land) => (
                    <MenuItem key={land.id} value={land.id}>
                      {land.title} ({land.area} {land.unit})
                    </MenuItem>
                  ))}
                </Select>
                {beneficiary.farmer_id && farmerLands.length === 0 && (
                  <Typography variant="caption" color="error">
                    This farmer has no registered land parcels
                  </Typography>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                required
                fullWidth
                label="Application Date"
                name="application_date"
                type="date"
                value={beneficiary.application_date || ""}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Status</InputLabel>
                <Select
                  name="status"
                  value={beneficiary.status || "pending"}
                  onChange={handleChange}
                  label="Status"
                >
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="approved">Approved</MenuItem>
                  <MenuItem value="rejected">Rejected</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Amount Received"
                name="amount_received"
                type="number"
                value={beneficiary.amount_received || ""}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">₹</InputAdornment>
                  ),
                }}
                disabled={beneficiary.status !== "approved" && beneficiary.status !== "completed"}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Remarks"
                name="remarks"
                multiline
                rows={3}
                value={beneficiary.remarks || ""}
                onChange={handleChange}
                placeholder="Add any additional notes or comments..."
              />
            </Grid>

            <Grid item xs={12} sx={{ mt: 2 }}>
              <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate("/beneficiaries")}
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
                  {submitting ? "Saving..." : "Save Beneficiary"}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default BeneficiaryForm;
