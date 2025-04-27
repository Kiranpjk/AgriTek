// resources/js/pages/Lands/LandsList.jsx
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
  Person as PersonIcon,
} from "@mui/icons-material";

const LandsList = () => {
  const [lands, setLands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchLands();
  }, []);

  const fetchLands = () => {
    setLoading(true);
    fetch("/api/lands")
      .then((response) => response.json())
      .then((data) => {
        setLands(data.data || []);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching lands:", error);
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
    if (window.confirm("Are you sure you want to delete this land parcel?")) {
      fetch(`/api/lands/${id}`, {
        method: "DELETE",
      })
        .then((response) => {
          if (response.ok) {
            fetchLands();
          } else {
            throw new Error("Failed to delete land");
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  };

  // Filter lands based on search
  const filteredLands = lands.filter(
    (land) =>
      land.title.toLowerCase().includes(search.toLowerCase()) ||
      (land.address && land.address.toLowerCase().includes(search.toLowerCase())) ||
      (land.farmer && land.farmer.name && land.farmer.name.toLowerCase().includes(search.toLowerCase()))
  );

  // Pagination
  const displayedLands = filteredLands.slice(
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
          Land Parcels
        </Typography>
        <Button
          component={Link}
          to="/lands/create"
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
        >
          Add Land Parcel
        </Button>
      </Box>

      <Paper sx={{ width: "100%", mb: 2 }}>
        <Box sx={{ p: 2 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search by title, address, or farmer name..."
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
          <Table sx={{ minWidth: 650 }} aria-label="lands table">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>ID</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Title</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Area</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Farmer</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Address</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Soil Type</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Irrigation</TableCell>
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
              ) : displayedLands.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    No land parcels found
                  </TableCell>
                </TableRow>
              ) : (
                displayedLands.map((land) => (
                  <TableRow
                    key={land.id}
                    sx={{ "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.04)" } }}
                  >
                    <TableCell>{land.id}</TableCell>
                    <TableCell>{land.title}</TableCell>
                    <TableCell>
                      {land.area} {land.unit || "hectares"}
                    </TableCell>
                    <TableCell>
                      {land.farmer ? (
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <PersonIcon sx={{ mr: 1, fontSize: 16 }} />
                          <Link to={`/farmers/${land.farmer.id}/edit`} style={{ textDecoration: "none", color: "#2e7d32" }}>
                            {land.farmer.name}
                          </Link>
                        </Box>
                      ) : (
                        "N/A"
                      )}
                    </TableCell>
                    <TableCell>{land.address || "N/A"}</TableCell>
                    <TableCell>{land.soil_type || "N/A"}</TableCell>
                    <TableCell>
                      {land.irrigation_type ? (
                        <Chip
                          label={land.irrigation_type}
                          color="primary"
                          size="small"
                        />
                      ) : (
                        "N/A"
                      )}
                    </TableCell>
                    <TableCell>
                      <IconButton
                        component={Link}
                        to={`/lands/${land.id}/edit`}
                        color="primary"
                        size="small"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        size="small"
                        onClick={() => handleDelete(land.id)}
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
          count={filteredLands.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
};

export default LandsList;
