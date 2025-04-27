// resources/js/pages/AerialData/AerialDataUpload.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  LinearProgress,
} from "@mui/material";
import {
  CloudUpload as CloudUploadIcon,
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
} from "@mui/icons-material";

const AerialDataUpload = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    land_id: "",
    capture_date: new Date().toISOString().split("T")[0],
    resolution: "",
    metadata: "",
  });
  
  const [file, setFile] = useState(null);
  const [lands, setLands] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    // Fetch lands for dropdown
    fetch("/api/lands")
      .then((response) => response.json())
      .then((data) => {
        setLands(data.data || []);
      })
      .catch((error) => {
        console.error("Error fetching lands:", error);
        setError("Failed to load land data. Please try again.");
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      
      // Create preview for images
      if (selectedFile.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = () => {
          setPreviewUrl(reader.result);
        };
        reader.readAsDataURL(selectedFile);
      } else {
        setPreviewUrl(null);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!file) {
      setError("Please select a file to upload");
      return;
    }
    
    if (!formData.land_id) {
      setError("Please select a land parcel");
      return;
    }
    
    setUploading(true);
    setError(null);
    setSuccess(null);
    
    // Create FormData object for file upload
    const uploadData = new FormData();
    uploadData.append('land_id', formData.land_id);
    uploadData.append('capture_date', formData.capture_date);
    uploadData.append('aerial_file', file);
    
    if (formData.resolution) {
      uploadData.append('resolution', formData.resolution);
    }
    
    if (formData.metadata) {
      uploadData.append('metadata', formData.metadata);
    }
    
    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 95) {
          clearInterval(progressInterval);
          return prev;
        }
        return prev + 5;
      });
    }, 300);
    
    fetch("/api/aerial-data", {
      method: "POST",
      headers: {
        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
      },
      body: uploadData,
    })
      .then((response) => {
        clearInterval(progressInterval);
        setUploadProgress(100);
        
        if (!response.ok) {
          throw new Error("Failed to upload aerial data");
        }
        return response.json();
      })
      .then((data) => {
        setSuccess("Aerial data uploaded successfully!");
        setUploading(false);
        // Redirect after a short delay
        setTimeout(() => {
          navigate("/aerial-data");
        }, 1500);
      })
      .catch((error) => {
        clearInterval(progressInterval);
        console.error("Error:", error);
        setError("Failed to upload aerial data. Please try again.");
        setUploading(false);
        setUploadProgress(0);
      });
  };

  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/aerial-data")}
          sx={{ mr: 2 }}
        >
          Back
        </Button>
        <Typography variant="h4" fontWeight="bold" color="primary.dark">
          Upload Aerial Data
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
                Aerial Data Information
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Land Parcel</InputLabel>
                <Select
                  name="land_id"
                  value={formData.land_id}
                  onChange={handleChange}
                  label="Land Parcel"
                >
                  <MenuItem value="">
                    <em>Select a land parcel</em>
                  </MenuItem>
                  {lands.map((land) => (
                    <MenuItem key={land.id} value={land.id}>
                      {land.title} ({land.farmer?.name || 'Unknown farmer'})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                required
                fullWidth
                label="Capture Date"
                name="capture_date"
                type="date"
                value={formData.capture_date}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Resolution (px)"
                name="resolution"
                type="number"
                value={formData.resolution}
                onChange={handleChange}
                placeholder="e.g., 1920"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Metadata (JSON)"
                name="metadata"
                value={formData.metadata}
                onChange={handleChange}
                placeholder='e.g., {"altitude": 100, "device": "DJI Phantom 4"}'
                helperText="Enter as JSON object with additional information"
              />
            </Grid>

            <Grid item xs={12}>
              <Box
                sx={{
                  border: '2px dashed #4caf50',
                  borderRadius: 2,
                  p: 3,
                  textAlign: 'center',
                  bgcolor: 'background.default',
                  cursor: 'pointer',
                  '&:hover': {
                    bgcolor: 'background.paper',
                  },
                }}
                onClick={() => document.getElementById('aerial-file-input').click()}
              >
                <input
                  id="aerial-file-input"
                  type="file"
                  accept=".jpg,.jpeg,.png,.tif,.tiff,.geotiff,.csv,.zip"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />
                <CloudUploadIcon sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
                <Typography variant="h6" gutterBottom>
                  Drag & Drop or Click to Upload
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Supported formats: JPG, PNG, TIFF, GeoTIFF, CSV, ZIP
                </Typography>
                {file && (
                  <Typography variant="body2" sx={{ mt: 2, fontWeight: 'medium' }}>
                    Selected: {file.name} ({(file.size / (1024 * 1024)).toFixed(2)} MB)
                  </Typography>
                )}
              </Box>
            </Grid>

            {previewUrl && (
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  Preview:
                </Typography>
                <Box
                  component="img"
                  src={previewUrl}
                  alt="Preview"
                  sx={{
                    maxHeight: 200,
                    maxWidth: '100%',
                    objectFit: 'contain',
                    borderRadius: 1,
                    boxShadow: 1,
                  }}
                />
              </Grid>
            )}

            {uploading && (
              <Grid item xs={12}>
                <Typography variant="body2" gutterBottom>
                  Uploading: {uploadProgress}%
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={uploadProgress}
                  sx={{ height: 10, borderRadius: 5 }}
                />
              </Grid>
            )}

            <Grid item xs={12} sx={{ mt: 2 }}>
              <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate("/aerial-data")}
                  sx={{ mr: 2 }}
                  disabled={uploading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  startIcon={<SaveIcon />}
                  disabled={uploading || !file}
                >
                  {uploading ? "Uploading..." : "Upload Data"}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default AerialDataUpload;
