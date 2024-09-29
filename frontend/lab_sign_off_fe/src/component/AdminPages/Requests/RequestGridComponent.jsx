import { DataGrid } from "@mui/x-data-grid";
import { useCallback, useState, useEffect } from "react";
import { tokenLoader } from "../../../utils/token";
import axiosInstance from "../../../utils/Axios";
import { Bounce, toast } from "react-toastify";
import {
  Box,
  Paper,
  Typography,
  CircularProgress,
  Chip,
  useTheme,
} from "@mui/material";

const token = tokenLoader();

const RequestGridComponent = () => {
  /**
   * Component for request grid
   */
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();

  const fetchData = useCallback(async () => {
    try {
      let results = [];
      let nextPageUrl = `requests/list/admin`;
      while (nextPageUrl) {
        const response = await axiosInstance.get(nextPageUrl, {
          headers: {
            Authorization: "Token " + token,
          },
        });
        results = results.concat(response.data.results);
        nextPageUrl = response.data.next;
      }
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
  // Custom cell renderer for student field
  const renderStudentCell = (params) => (
    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
      <Chip label={params.value} color="secondary" size="small" />
    </Box>
  );

  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "text", headerName: "Text", width: 250 },
    {
      field: "staff",
      headerName: "Staff",
      width: 350,
      renderCell: renderStaffCell,
    },
    {
      field: "student",
      headerName: "Student",
      width: 350,
      renderCell: renderStudentCell,
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
    </Box>
  );
};

export default RequestGridComponent;
