import { DataGrid } from "@mui/x-data-grid";
import { useCallback, useState, useEffect } from "react";
import { tokenLoader } from "../../../utils/token";
import axiosInstance from "../../../utils/Axios";
import { Bounce, toast } from "react-toastify";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {
  Box,
  Paper,
  Typography,
  CircularProgress,
  Chip,
  useTheme,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const token = tokenLoader();

const StaffRequestGridComponent = () => {
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRow, setSelectedRow] = useState(null);
  const theme = useTheme();
  const navigate = useNavigate();

  const fetchData = useCallback(async () => {
    try {
      let results = [];
      let nextPageUrl = `requests/list/`;
      while (nextPageUrl) {
        const response = await axiosInstance.get(nextPageUrl, {
          headers: {
            Authorization: "Token " + token,
          },
        });
        results = results.concat(response.data.results);
        nextPageUrl = response.data.next;
      }
      // Format the data
      const formattedData = results.map((item) => ({
        id: item.id,
        text: item.text,
        student: `${item.student.first_name} ${item.student.last_name}`,
        staff: item.staff.map((s) => s.first_name + " " + s.last_name),
        status: item.status,
        fileExists: item.file ? "Yes" : "No",
      }));
      setData(formattedData);
    } catch (error) {
      let errorMessage = "Error loading data";
      const errorData = error.response;
      if (
        errorData?.data.detail ===
        "You do not have permission to perform this action."
      ) {
        errorMessage = "You do not have permission to perform this action.";
      }
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
    } finally {
      setLoading(false);
    }
  }, []);

  const handleMenuOpen = (event, row) => {
    setMenuAnchor(event.currentTarget);
    setSelectedRow(row);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setSelectedRow(null);
  };

  const handleEdit = () => {
    navigate(`/staff/request/${selectedRow.id}/detail`);
    handleMenuClose();
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Custom cell renderer for staff field
  const renderStaffCell = (params) => (
    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
      {params.value.map((staff, index) => (
        <Chip key={index} label={staff} color="primary" size="small" />
      ))}
    </Box>
  );

  // Define columns for DataGrid
  const columns = [
    {
      field: "actions",
      headerName: "",
      width: 50,
      renderCell: (params) => (
        <IconButton
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            handleMenuOpen(e, params.row);
          }}
        >
          <MoreVertIcon />
        </IconButton>
      ),
    },
    { field: "id", headerName: "ID", width: 90 },
    { field: "text", headerName: "Text", width: 250 },
    {
      field: "staff",
      headerName: "Staff",
      width: 350,
      renderCell: renderStaffCell,
    },
    { field: "status", headerName: "Status", width: 150 },
    { field: "fileExists", headerName: "File Exists", width: 150 },
  ];

  return (
    <Box
      sx={{
        padding: 2,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Typography variant="h6" gutterBottom>
        Requests
      </Typography>
      <Paper
        elevation={3}
        sx={{ width: "100%", height: 600, overflow: "hidden" }}
      >
        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
          <DataGrid
            rows={data}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10]}
            pagination
            disableRowSelectionOnClick
            sx={{
              "& .MuiDataGrid-cell": {
                border: `1px solid ${theme.palette.divider}`,
              },
              "& .MuiDataGrid-columnHeader": {
                backgroundColor: theme.palette.grey[100],
                color: theme.palette.text.primary,
              },
              "& .MuiDataGrid-footerContainer": {
                backgroundColor: theme.palette.grey[100],
                borderTop: `1px solid ${theme.palette.divider}`,
              },
              "& .MuiDataGrid-toolbarContainer": {
                backgroundColor: theme.palette.grey[100],
              },
            }}
          />
        )}
      </Paper>
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleEdit}>Edit</MenuItem>
      </Menu>
    </Box>
  );
};

export default StaffRequestGridComponent;
