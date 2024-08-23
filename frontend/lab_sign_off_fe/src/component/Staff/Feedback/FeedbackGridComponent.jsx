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
  useTheme,
} from "@mui/material";

const token = tokenLoader();

const FeedbackGridComponent = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();

  const fetchData = useCallback(async () => {
    try {
      let results = [];
      let nextPageUrl = `lab-session/feedbacks/list/`;
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
        lab_session_name: item.lab_session_name,
        feedback: item.feedback,
        rating: item.rating,
        course_name: item.course_name,
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

  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "lab_session_name", headerName: "Lab Session Name", width: 300 },
    { field: "feedback", headerName: "Feedback Message", width: 400 },
    { field: "rating", headerName: "Rating", width: 50 },
    { field: "course_name", headerName: "Course Name", width: 300 },
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
        Feedback
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

export default FeedbackGridComponent;
