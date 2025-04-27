// resources/js/pages/Farmers/FarmersList.jsx
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

const FarmersList = () => {
  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchFarmers();
  }, []);

  const fetchFarmers = () => {
    setLoading(true);
    fetch("/api/farmers")
      .then((response) => response.json())
      .then((data) => {
        setFarmers(data.data || []);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching farmers:", error);
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
    if (window.confirm("Are you sure you want to delete this farmer?")) {
      fetch(`/api/farmers/${id}`, {
        method: "DELETE",
      })
        .then((response) => {
          if (response.ok) {
            fetchFarmers();
          } else {
            throw new Error("Failed to delete farmer");
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  };

  // Filter farmers based on search
  const filteredFarmers = farmers.filter(
    (farmer) =>
      farmer.name.toLowerCase().includes(search.toLowerCase()) ||
      (farmer.id_number &&
        farmer.id_number.toLowerCase().includes(search.toLowerCase())) ||
      (farmer.phone && farmer.phone.includes(search))
  );

  // Pagination
  const displayedFarmers = filteredFarmers.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

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
          Farmers
        </Typography>
        <Button
          component={Link}
          to="/farmers/create"
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
        >
          Add Farmer
        </Button>
      </Box>

      <Paper sx={{ width: "100%", mb: 2 }}>
        <Box sx={{ p: 2 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search farmers by name, ID, or phone..."
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
          <Table sx={{ minWidth: 650 }} aria-label="farmers table">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>ID</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>ID Number</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Phone</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Email</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Land Parcels</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : displayedFarmers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    No farmers found
                  </TableCell>
                </TableRow>
              ) : (
                displayedFarmers.map((farmer) => (
                  <TableRow
                    key={farmer.id}
                    sx={{ "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.04)" } }}
                  >
                    <TableCell>{farmer.id}</TableCell>
                    <TableCell>{farmer.name}</TableCell>
                    <TableCell>{farmer.id_number}</TableCell>
                    <TableCell>{farmer.phone}</TableCell>
                    <TableCell>{farmer.email}</TableCell>
                    <TableCell>
                      <Chip
                        label={`${farmer.lands ? farmer.lands.length : 0} parcels`}
                        color="primary"
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton
                        component={Link}
                        to={`/farmers/${farmer.id}/edit`}
                        color="primary"
                        size="small"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        size="small"
                        onClick={() => handleDelete(farmer.id)}
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
          count={filteredFarmers.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
};

export default FarmersList;
