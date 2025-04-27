// resources/js/pages/Schemes/SchemesList.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  IconButton,
  TextField,
  InputAdornment,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
} from "@mui/icons-material";

const SchemesList = () => {
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchSchemes();
  }, []);

  const fetchSchemes = () => {
    setLoading(true);
    fetch("/api/schemes")
      .then((response) => response.json())
      .then((data) => {
        setSchemes(data.data || []);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching schemes:", error);
        setLoading(false);
      });
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearch = (event) => {
    setSearch(event.target.value);
    setPage(0);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this scheme?")) {
      fetch(`/api/schemes/${id}`, {
        method: "DELETE",
      })
        .then((response) => {
          if (response.ok) {
            fetchSchemes();
          } else {
            throw new Error("Failed to delete scheme");
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  };

  // Filter schemes based on search
  const filteredSchemes = schemes.filter(
    (scheme) =>
      scheme.name.toLowerCase().includes(search.toLowerCase()) ||
      scheme.description.toLowerCase().includes(search.toLowerCase())
  );

  // Pagination
  const displayedSchemes = filteredSchemes.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "success";
      case "inactive":
        return "error";
      case "draft":
        return "warning";
      default:
        return "default";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  const formatCurrency = (amount) => {
    if (!amount) return "₹0";
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
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
          Schemes
        </Typography>
        <Button
          component={Link}
          to="/schemes/create"
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
        >
          Add Scheme
        </Button>
      </Box>

      <Paper sx={{ width: "100%", mb: 2 }}>
        <Box sx={{ p: 2 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search schemes by name or description..."
            value={search}
            onChange={handleSearch}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ mb: 2 }}
          />
        </Box>

        <TableContainer>
          <Table sx={{ minWidth: 650 }} aria-label="schemes table">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>ID</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Start Date</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>End Date</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Budget</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Beneficiaries</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : displayedSchemes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    No schemes found
                  </TableCell>
                </TableRow>
              ) : (
                displayedSchemes.map((scheme) => (
                  <TableRow
                    key={scheme.id}
                    sx={{ "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.04)" } }}
                  >
                    <TableCell>{scheme.id}</TableCell>
                    <TableCell>
                      <Typography fontWeight="medium">{scheme.name}</Typography>
                    </TableCell>
                    <TableCell>{formatDate(scheme.start_date)}</TableCell>
                    <TableCell>{formatDate(scheme.end_date)}</TableCell>
                    <TableCell>{formatCurrency(scheme.budget)}</TableCell>
                    <TableCell>
                      <Chip
                        label={scheme.status}
                        color={getStatusColor(scheme.status)}
                        size="small"
                        sx={{ textTransform: "capitalize" }}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={`${scheme.beneficiaries ? scheme.beneficiaries.length : 0}`}
                        color="primary"
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton
                        component={Link}
                        to={`/schemes/${scheme.id}/edit`}
                        color="primary"
                        size="small"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        size="small"
                        onClick={() => handleDelete(scheme.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredSchemes.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
};

export default SchemesList;

