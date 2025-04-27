// resources/js/app.jsx
import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Layout components
import Dashboard from "./components/Dashboard";
import Sidebar from "./components/Sidebar";
import TopBar from "./components/TopBar";

// Pages
import FarmersList from "./components/pages/Famers/FarmersList.jsx";
import FarmerForm from "./components/pages/Famers/FarmerForm.jsx";
import LandsList from "./components/pages/Lands/LandsList.jsx";
import LandForm from "./components/pages/Lands/LandForm.jsx";
import SchemesList from "./components/pages/Schemes/SchemesList.jsx";
import SchemeForm from "./components/pages/Schemes/SchemesForm.jsx";
import BeneficiariesList from "./components/pages/Beneficiaries/BeneficiariesList.jsx";
import BeneficiaryForm from "./components/pages/Beneficiaries/BeneficiariesForm.jsx";
import AerialDataList from "./components/pages/AerialData/AerialDataList.jsx";
import AerialDataUpload from "./components/pages/AerialData/AerialDataUpload.jsx";
import TrajectoryAnalysis from "./components/pages/Analysis/TrajectoryAnalysis";

// Create a custom theme with rich green colors
const theme = createTheme({
  palette: {
    primary: {
      light: "#4caf50",
      main: "#2e7d32",
      dark: "#1b5e20",
      contrastText: "#fff",
    },
    secondary: {
      light: "#8bc34a",
      main: "#689f38",
      dark: "#33691e",
      contrastText: "#fff",
    },
    background: {
      default: "#e8f5e9",
      paper: "#f1f8e9",
    },
    success: {
      main: "#4caf50",
    },
    info: {
      main: "#81c784",
    },
  },
  typography: {
    fontFamily: "Roboto, Arial, sans-serif",
    h1: {
      fontWeight: 700,
      color: "#2e7d32",
    },
    h2: {
      fontWeight: 600,
      color: "#2e7d32",
    },
    h3: {
      fontWeight: 600,
      color: "#2e7d32",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: "none",
          fontWeight: 600,
        },
        containedPrimary: {
          boxShadow: "0 4px 10px rgba(46, 125, 50, 0.25)",
          "&:hover": {
            boxShadow: "0 6px 12px rgba(46, 125, 50, 0.3)",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
        },
      },
    },
  },
});

function App() {
  const [open, setOpen] = useState(true);
  const toggleDrawer = () => {
    setOpen(!open);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Box sx={{ display: "flex", minHeight: "100vh" }}>
          <Sidebar open={open} toggleDrawer={toggleDrawer} />
          <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
            <TopBar open={open} toggleDrawer={toggleDrawer} />
            <Box component="main" sx={{ flexGrow: 1, p: 3, pt: 10 }}>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/farmers" element={<FarmersList />} />
                <Route path="/farmers/create" element={<FarmerForm />} />
                <Route path="/farmers/:id/edit" element={<FarmerForm />} />
                <Route path="/lands" element={<LandsList />} />
                <Route path="/lands/create" element={<LandForm />} />
                <Route path="/lands/:id/edit" element={<LandForm />} />
                <Route path="/schemes" element={<SchemesList />} />
                <Route path="/schemes/create" element={<SchemeForm />} />
                <Route path="/schemes/:id/edit" element={<SchemeForm />} />
                <Route path="/beneficiaries" element={<BeneficiariesList />} />
                <Route path="/beneficiaries/create" element={<BeneficiaryForm />} />
                <Route path="/beneficiaries/:id/edit" element={<BeneficiaryForm />} />
                <Route path="/aerial-data" element={<AerialDataList />} />
                <Route path="/aerial-data/upload" element={<AerialDataUpload />} />
                <Route path="/analysis/:id" element={<TrajectoryAnalysis />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Box>
          </Box>
        </Box>
      </BrowserRouter>
    </ThemeProvider>
  );
}

ReactDOM.createRoot(document.getElementById("app")).render(<App />);
