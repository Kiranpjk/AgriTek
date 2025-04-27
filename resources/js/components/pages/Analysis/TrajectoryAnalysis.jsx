// resources/js/pages/Analysis/TrajectoryAnalysis.jsx
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  Divider,
  Chip,
  CircularProgress,
  Card,
  CardContent,
} from "@mui/material";
import { ArrowBack as ArrowBackIcon } from "@mui/icons-material";
import { Scatter } from 'react-chartjs-2';
import { Chart as ChartJS, LinearScale, PointElement, LineElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend);

const TrajectoryAnalysis = () => {
  const { id } = useParams();
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`/api/trajectory-analyses/${id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to load analysis data");
        }
        return response.json();
      })
      .then((data) => {
        setAnalysis(data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error:", error);
        setError("Failed to load analysis data. Please try again.");
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box>
        <Typography variant="h5" color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
        <Button
          component={Link}
          to="/aerial-data"
          variant="contained"
          startIcon={<ArrowBackIcon />}
        >
          Back to Aerial Data
        </Button>
      </Box>
    );
  }

  if (!analysis) {
    return (
      <Box>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Analysis not found
        </Typography>
        <Button
          component={Link}
          to="/aerial-data"
          variant="contained"
          startIcon={<ArrowBackIcon />}
        >
          Back to Aerial Data
        </Button>
      </Box>
    );
  }

  // Prepare scatter plot data
  const scatterData = {
    datasets: analysis.trajectory_data.points.map(point => ({
      label: `Cluster ${point.cluster_id}`,
      data: [{ x: point.x, y: point.y }],
      backgroundColor: getClusterColor(point.cluster_id),
    })),
  };

  // Group points by cluster for better visualization
  const groupedData = {
    datasets: Object.entries(
      analysis.trajectory_data.points.reduce((acc, point) => {
        const clusterId = point.cluster_id || 0;
        if (!acc[clusterId]) {
          acc[clusterId] = [];
        }
        acc[clusterId].push({ x: point.x, y: point.y });
        return acc;
      }, {})
    ).map(([clusterId, points]) => ({
      label: `Cluster ${clusterId}`,
      data: points,
      backgroundColor: getClusterColor(parseInt(clusterId)),
      pointRadius: 6,
    })),
  };

  function getClusterColor(clusterId) {
    const colors = ['#4caf50', '#2196f3', '#ff9800', '#f44336', '#9c27b0', '#00bcd4'];
    return colors[clusterId % colors.length];
  }

  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <Button
          component={Link}
          to="/aerial-data"
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          sx={{ mr: 2 }}
        >
          Back
        </Button>
        <Typography variant="h4" fontWeight="bold" color="primary.dark">
          Trajectory Analysis Results
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Analysis Information
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Analysis Type
              </Typography>
              <Typography variant="body1" fontWeight="medium">
                {analysis.analysis_type}
              </Typography>
            </Box>
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Created At
              </Typography>
              <Typography variant="body1" fontWeight="medium">
                {new Date(analysis.created_at).toLocaleString()}
              </Typography>
            </Box>
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Land Parcel
              </Typography>
              <Typography variant="body1" fontWeight="medium">
                {analysis.aerialData?.land?.title || 'Unknown'}
              </Typography>
            </Box>
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Capture Date
              </Typography>
              <Typography variant="body1" fontWeight="medium">
                {analysis.aerialData?.capture_date ? new Date(analysis.aerialData.capture_date).toLocaleDateString() : 'Unknown'}
              </Typography>
            </Box>
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Summary
              </Typography>
              <Typography variant="body1">
                {analysis.summary || 'No summary available'}
              </Typography>
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Trajectory Clustering
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Box sx={{ height: 400, mb: 3 }}>
              <Scatter 
                data={groupedData} 
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    x: {
                      title: {
                        display: true,
                        text: 'X Coordinate'
                      }
                    },
                    y: {
                      title: {
                        display: true,
                        text: 'Y Coordinate'
                      }
                    }
                  },
                  plugins: {
                    legend: {
                      position: 'top',
                    },
                    tooltip: {
                      callbacks: {
                        label: function(context) {
                          return `${context.dataset.label}: (${context.parsed.x.toFixed(2)}, ${context.parsed.y.toFixed(2)})`;
                        }
                      }
                    }
                  }
                }}
              />
            </Box>
            
            <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
              Cluster Statistics
            </Typography>
            
            <Grid container spacing={2}>
              {analysis.clusters && analysis.clusters.centroids && analysis.clusters.centroids.map((centroid) => (
                <Grid item xs={12} sm={4} key={centroid.id}>
                  <Card sx={{ bgcolor: 'background.default' }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Cluster {centroid.id}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Centroid: ({centroid.x.toFixed(2)}, {centroid.y.toFixed(2)})
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Size: {centroid.size} points
                      </Typography>
                      <Chip 
                        label={`ID: ${centroid.id}`} 
                        size="small" 
                        sx={{ 
                          mt: 1, 
                          bgcolor: getClusterColor(centroid.id),
                          color: 'white'
                        }} 
                      />
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>
        
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Algorithm Details
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Algorithm
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {analysis.trajectory_data.metadata?.algorithm || 'Unknown'}
                </Typography>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Parameters
                </Typography>
                <Typography variant="body1">
                  {analysis.trajectory_data.metadata?.parameters ? (
                    Object.entries(analysis.trajectory_data.metadata.parameters).map(([key, value]) => (
                      <Box component="span" key={key} sx={{ mr: 2 }}>
                        {key}: {value}
                      </Box>
                    ))
                  ) : (
                    'No parameters available'
                  )}
                </Typography>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Cluster Count
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {analysis.clusters?.count || 'Unknown'}
                </Typography>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Statistics
                </Typography>
                <Typography variant="body1">
                  {analysis.clusters?.stats ? (
                    Object.entries(analysis.clusters.stats).map(([key, value]) => (
                      <Box component="span" key={key} sx={{ mr: 2 }}>
                        {key.replace(/_/g, ' ')}: {typeof value === 'number' ? value.toFixed(2) : value}
                      </Box>
                    ))
                  ) : (
                    'No statistics available'
                  )}
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default TrajectoryAnalysis;
