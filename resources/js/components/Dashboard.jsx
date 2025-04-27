// resources/js/components/Dashboard.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Paper,
  Divider,
} from "@mui/material";
import {
  People as PeopleIcon,
  Terrain as TerrainIcon,
  Assignment as AssignmentIcon,
  CardGiftcard as CardGiftcardIcon,
  CloudUpload as CloudUploadIcon,
  TrendingUp as TrendingUpIcon,
} from "@mui/icons-material";

// Import chart components
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title, BarElement } from 'chart.js';
import { Pie, Line, Bar } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title, BarElement);

const Dashboard = () => {
  const [stats, setStats] = useState({
    farmers_count: 0,
    lands_count: 0,
    schemes_count: 0,
    active_schemes: 0,
    beneficiaries_count: 0,
    pending_applications: 0,
    aerial_data_count: 0,
    analyses_count: 0,
  });

  useEffect(() => {
    // Fetch dashboard stats
    fetch('/api/stats/dashboard')
      .then(response => response.json())
      .then(data => {
        setStats(data);
      })
      .catch(error => {
        console.error('Error fetching dashboard stats:', error);
      });
  }, []);

  // Sample chart data
  const pieData = {
    labels: ['Active Schemes', 'Inactive Schemes'],
    datasets: [
      {
        data: [stats.active_schemes, stats.schemes_count - stats.active_schemes],
        backgroundColor: ['#4caf50', '#e0e0e0'],
        borderColor: ['#ffffff', '#ffffff'],
        borderWidth: 2,
      },
    ],
  };

  const lineData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Farmers Registered',
        data: [12, 19, 25, 32, 45, stats.farmers_count],
        borderColor: '#2e7d32',
        backgroundColor: 'rgba(46, 125, 50, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const barData = {
    labels: ['Pending', 'Approved', 'Rejected', 'Completed'],
    datasets: [
      {
        label: 'Beneficiary Applications',
        data: [stats.pending_applications, 15, 5, 25],
        backgroundColor: ['#ff9800', '#4caf50', '#f44336', '#2196f3'],
      },
    ],
  };

  const statCards = [
    { title: 'Total Farmers', value: stats.farmers_count, icon: <PeopleIcon sx={{ fontSize: 40 }} color="primary" />, link: '/farmers' },
    { title: 'Land Parcels', value: stats.lands_count, icon: <TerrainIcon sx={{ fontSize: 40 }} color="primary" />, link: '/lands' },
    { title: 'Schemes', value: stats.schemes_count, icon: <AssignmentIcon sx={{ fontSize: 40 }} color="primary" />, link: '/schemes' },
    { title: 'Beneficiaries', value: stats.beneficiaries_count, icon: <CardGiftcardIcon sx={{ fontSize: 40 }} color="primary" />, link: '/beneficiaries' },
    { title: 'Aerial Data', value: stats.aerial_data_count, icon: <CloudUploadIcon sx={{ fontSize: 40 }} color="primary" />, link: '/aerial-data' },
    { title: 'Analyses', value: stats.analyses_count, icon: <TrendingUpIcon sx={{ fontSize: 40 }} color="primary" />, link: '/aerial-data' },
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom fontWeight="bold" color="primary.dark">
        Dashboard
      </Typography>
      
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {statCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
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
              <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h6" color="text.secondary">
                    {card.title}
                  </Typography>
                  {card.icon}
                </Box>
                <Typography variant="h3" component="div" fontWeight="bold" sx={{ mb: 2 }}>
                  {card.value}
                </Typography>
                <Box sx={{ mt: 'auto' }}>
                  <Button 
                    component={Link} 
                    to={card.link} 
                    variant="outlined" 
                    color="primary" 
                    size="small"
                  >
                    View Details
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Scheme Status
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ height: 250, display: 'flex', justifyContent: 'center' }}>
              <Pie data={pieData} options={{ maintainAspectRatio: false }} />
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Farmer Registration Trend
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ height: 250 }}>
              <Line 
                data={lineData} 
                options={{ 
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true
                    }
                  }
                }} 
              />
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Beneficiary Application Status
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ height: 300 }}>
              <Bar 
                data={barData} 
                options={{ 
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true
                    }
                  }
                }} 
              />
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
