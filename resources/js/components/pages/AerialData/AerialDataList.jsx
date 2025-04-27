// resources/js/pages/AerialData/AerialDataList.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Chip,
  IconButton,
  TextField,
  InputAdornment,
  CircularProgress,
  Pagination,
} from "@mui/material";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Timeline as TimelineIcon,
  Visibility as VisibilityIcon,
} from "@mui/icons-material";

const AerialDataList = () => {
  const [aerialData, setAerialData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const itemsPerPage = 8;

  useEffect(() => {
    fetchAerialData();
  }, []);

  const fetchAerialData = () => {
    setLoading(true);
    fetch("/api/aerial-data")
      .then((response) => response.json())
      .then((data) => {
        setAerialData(data.data || []);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching aerial data:", error);
        setLoading(false);
      });
  };

  const handleSearch = (event) => {
    setSearch(event.target.value);
    setPage(1);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this aerial data?")) {
      fetch(`/api/aerial-data/${id}`, {
        method: "DELETE",
      })
        .then((response) => {
          if (response.ok) {
            fetchAerialData();
          } else {
            throw new Error("Failed to delete aerial data");
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  };

  const handleAnalyze = (id) => {
    fetch(`/api/aerial-data/${id}/analyze`, {
      method: "POST",
    })
      .then((response) => response.json())
      .then((data) => {
        window.location.href = `/analysis/${data.data.id}`;
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("Failed to start analysis. Please try again.");
      });
  };

  // Filter aerial data based on search
  const filteredData = aerialData.filter(
    (item) =>
      (item.land && item.land.title && item.land.title.toLowerCase().includes(search.toLowerCase())) ||
      (item.file_type && item.file_type.toLowerCase().includes(search.toLowerCase()))
  );

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const displayedData = filteredData.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const handleChangePage = (event, value) => {
    setPage(value);
  };

  const getImagePreview = (item) => {
    // This is a placeholder. In a real app, you'd use the actual file path
    if (item.file_type && ['jpg', 'jpeg', 'png', 'gif'].includes(item.file_type.toLowerCase())) {
      return `/storage/${item.file_path}`;
    }
    return 'https://via.placeholder.com/300x200?text=Aerial+Data';
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4" fontWeight="bold" color="primary.dark">
          Aerial Data
        </Typography>
        <Button
          component={Link}
          to="/aerial-data/upload"
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
        >
          Upload New Data
        </Button>
      </Box>

      <Paper sx={{ p: 3, mb: 3 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search by land title or file type..."
          value={search}
          onChange={handleSearch}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Paper>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : displayedData.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="h6" color="text.secondary">
            No aerial data found
          </Typography>
          <Button
            component={Link}
            to="/aerial-data/upload"
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
          >
            Upload New Data
          </Button>
        </Paper>
      ) : (
        <>
          <Grid container spacing={3}>
            {displayedData.map((item) => (
              <Grid item xs={12} sm={6} md={3} key={item.id}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: '0 12px 20px rgba(0, 0, 0, 0.1)',
                    },
                  }}
                >
                  <CardMedia
                    component="img"
                    height="160"
                    image={getImagePreview(item)}
                    alt={`Aerial data for ${item.land?.title || 'Unknown land'}`}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" component="div" noWrap>
                      {item.land?.title || 'Unknown land'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Captured: {new Date(item.capture_date).toLocaleDateString()}
                    </Typography>
                    <Box sx={{ mt: 1 }}>
                      <Chip
                        label={item.file_type?.toUpperCase() || 'Unknown'}
                        color="primary"
                        size="small"
                        sx={{ mr: 1 }}
                      />
                      {item.trajectoryAnalyses && item.trajectoryAnalyses.length > 0 && (
                        <Chip
                          label="Analyzed"
                          color="success"
                          size="small"
                        />
                      )}
                    </Box>
                  </CardContent>
                  <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                    <Box>
                      <IconButton
                        color="primary"
                        size="small"
                        component={Link}
                        to={`/aerial-data/${item.id}`}
                      >
                        <VisibilityIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        size="small"
                        onClick={() => handleDelete(item.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                    <Button
                      variant="outlined"
                      color="primary"
                      size="small"
                      startIcon={<TimelineIcon />}
                      onClick={() => handleAnalyze(item.id)}
                    >
                      Analyze
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={handleChangePage}
              color="primary"
              size="large"
            />
          </Box>
        </>
      )}
    </Box>
  );
};

export default AerialDataList;
