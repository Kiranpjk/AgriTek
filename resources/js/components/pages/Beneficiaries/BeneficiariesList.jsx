// resources/js/pages/Beneficiaries/BeneficiariesList.jsx
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
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Person as PersonIcon,
  Terrain as TerrainIcon,
  Assignment as AssignmentIcon,
} from "@mui/icons-material";

const BeneficiariesList = () => {
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    fetchBeneficiaries();
  }, []);

  const fetchBeneficiaries = () => {
    setLoading(true);
    fetch("/api/beneficiaries")
      .then((response) => response.json())
      .then((data) => {
        setBeneficiaries(data.data || []);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching beneficiaries:", error);
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

  const handleStatusFilterChange = (event) => {
    setStatusFilter(event.target.value);
    setPage(0);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this beneficiary record?")) {
      fetch(`/api/beneficiaries/${id}`, {
        method: "DELETE",
      })
        .then((response) => {
          if (response.ok) {
            fetchBeneficiaries();
          } else {
            throw new Error("Failed to delete beneficiary");
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  };

  // Filter beneficiaries based on search and status filter
  const filteredBeneficiaries = beneficiaries.filter(
    (beneficiary) => {
      const matchesSearch = 
        (beneficiary.farmer && beneficiary.farmer.name && 
          beneficiary.farmer.name.toLowerCase().includes(search.toLowerCase())) ||
        (beneficiary.scheme && beneficiary.scheme.name && 
          beneficiary.scheme.name.toLowerCase().includes(search.toLowerCase()));
      
      const matchesStatus = statusFilter === "" || beneficiary.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    }
  );

  // Pagination
  const displayedBeneficiaries = filteredBeneficiaries.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "success";
      case "rejected":
        return "error";
      case "pending":
        return "warning";
      case "completed":
        return "info";
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
          Beneficiaries
        </Typography>
        <Button
          component={Link}
          to="/beneficiaries/create"
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
        >
          Add Beneficiary
        </Button>
      </Box>

      <Paper sx={{ width: "100%", mb: 2 }}>
        <Box sx={{ p: 2, display: "flex", gap: 2 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search by farmer or scheme name..."
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
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={statusFilter}
              onChange={handleStatusFilterChange}
              label="Status"
              displayEmpty
            >
              <MenuItem value="">All Statuses</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="approved">Approved</MenuItem>
              <MenuItem value="rejected">Rejected</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <TableContainer>
          <Table sx={{ minWidth: 650 }} aria-label="beneficiaries table">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>ID</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Farmer</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Scheme</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Land</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Application Date</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Amount Received</TableCell>
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
              ) : displayedBeneficiaries.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    No beneficiaries found
                  </TableCell>
                </TableRow>
              ) : (
                displayedBeneficiaries.map((beneficiary) => (
                  <TableRow
                    key={beneficiary.id}
                    sx={{ "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.04)" } }}
                  >
                    <TableCell>{beneficiary.id}</TableCell>
                    <TableCell>
                      {beneficiary.farmer ? (
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <PersonIcon sx={{ mr: 1, fontSize: 16, color: "primary.main" }} />
                          <Link to={`/farmers/${beneficiary.farmer.id}/edit`} style={{ textDecoration: "none", color: "#2e7d32" }}>
                            {beneficiary.farmer.name}
                          </Link>
                        </Box>
                      ) : (
                        "N/A"
                      )}
                    </TableCell>
                    <TableCell>
                      {beneficiary.scheme ? (
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <AssignmentIcon sx={{ mr: 1, fontSize: 16, color: "primary.main" }} />
                          <Link to={`/schemes/${beneficiary.scheme.id}/edit`} style={{ textDecoration: "none", color: "#2e7d32" }}>
                            {beneficiary.scheme.name}
                          </Link>
                        </Box>
                      ) : (
                        "N/A"
                      )}
                    </TableCell>
                    <TableCell>
                      {beneficiary.land ? (
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <TerrainIcon sx={{ mr: 1, fontSize: 16, color: "primary.main" }} />
                          <Link to={`/lands/${beneficiary.land.id}/edit`} style={{ textDecoration: "none", color: "#2e7d32" }}>
                            {beneficiary.land.title}
                          </Link>
                        </Box>
                      ) : (
                        "N/A"
                      )}
                    </TableCell>
                    <TableCell>{formatDate(beneficiary.application_date)}</TableCell>
                    <TableCell>
                      <Chip
                        label={beneficiary.status}
                        color={getStatusColor(beneficiary.status)}
                        size="small"
                        sx={{ textTransform: "capitalize" }}
                      />
                    </TableCell>
                    <TableCell>{formatCurrency(beneficiary.amount_received)}</TableCell>
                    <TableCell>
                      <IconButton
                        component={Link}
                        to={`/beneficiaries/${beneficiary.id}/edit`}
                        color="primary"
                        size="small"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        size="small"
                        onClick={() => handleDelete(beneficiary.id)}
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
          count={filteredBeneficiaries.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
};

export default BeneficiariesList;
