import Button from "react-bootstrap/Button";
import { DataGrid } from "@mui/x-data-grid";
import {
  Box,
  CircularProgress,
  IconButton,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useCallback, useEffect, useState } from "react";
import axiosInstance from "../../../utils/Axios";
import { Bounce, toast } from "react-toastify";
import { tokenLoader } from "../../../utils/token";
import PropTypes from "prop-types";
import LabSessionCreateModal from "./LabSessionCreateModal";

const token = tokenLoader();

const CoursesLabsGrid = ({ course_id }) => {
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openCreateModal, setOpenCreateModal] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      let results = [];
      let nextPageUrl = `/lab-session/courses/${course_id}/lab-sessions/`;
      while (nextPageUrl) {
        const response = await axiosInstance.get(nextPageUrl, {
          headers: {
            Authorization: "Token " + token,
          },
        });
        results = results.concat(response.data.results);
        nextPageUrl = response.data.next;
      }
      setData(results);
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
  }, [course_id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleMenuOpen = (event) => {
    setMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  const handleCreateModalClose = () => {
    setOpenCreateModal(false);
    fetchData();
  };
  const handleCreateSessionClick = () => {
    setOpenCreateModal(true);
  };

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
    {
      field: "name",
      headerName: "Lab Name",
      width: 300,
      editable: false,
    },
  ];

  return (
    <>
      <Box sx={{ padding: 2 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 2,
          }}
        >
          <Typography variant="h6" component="div">
            Lab Sessions
          </Typography>
          <Button onClick={handleCreateSessionClick} variant="dark">
            Create New Lab Session
          </Button>
        </Box>
        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: 300,
            }}
          >
            <CircularProgress />
          </Box>
        ) : data.length > 0 ? (
          <Box
            sx={{
              height: 400,
              width: "100%",
              "& .MuiDataGrid-root": {
                border: "none",
              },
              "& .MuiDataGrid-cell": {
                borderBottom: "1px solid #e0e0e0",
              },
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: "#f5f5f5",
                borderBottom: "1px solid #e0e0e0",
              },
              "& .MuiDataGrid-footerContainer": {
                borderTop: "1px solid #e0e0e0",
              },
            }}
          >
            <DataGrid
              rows={data}
              columns={columns}
              initialState={{
                pagination: {
                  paginationModel: {
                    pageSize: 5,
                  },
                },
              }}
              pageSizeOptions={[5]}
              disableRowSelectionOnClick
            />
          </Box>
        ) : (
          <Typography variant="body1">No lab sessions found.</Typography>
        )}
        <Menu
          anchorEl={menuAnchor}
          open={Boolean(menuAnchor)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleMenuClose}>Edit</MenuItem>
          <MenuItem onClick={handleMenuClose}>Delete</MenuItem>
        </Menu>
      </Box>
      <LabSessionCreateModal
        open={openCreateModal}
        handleClose={handleCreateModalClose}
        course_id={course_id}
      />
    </>
  );
};

CoursesLabsGrid.propTypes = {
  course_id: PropTypes.number,
};

export default CoursesLabsGrid;
