import { useCallback, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import IconButton from "@mui/material/IconButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import axiosInstance from "../../utils/Axios";
import { tokenLoader } from "../../utils/token";
import { Bounce, toast } from "react-toastify";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Badge from "react-bootstrap/Badge";
import "bootstrap/dist/css/bootstrap.min.css";
import Button from "react-bootstrap/Button";
import CourseCreateComponent from "./CourseCreateComponent";
import CoursesEditComponent from "./CoursesEditComponent";

const token = tokenLoader();

const CoursesGridComponent = () => {
  /**
   * Courses Grid component
   */
  const [rows, setRows] = useState([]);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      let results = [];
      let nextPageUrl = "/courses/list/";
      while (nextPageUrl) {
        const response = await axiosInstance.get(nextPageUrl, {
          headers: {
            Authorization: "Token " + token,
          },
        });
        results = results.concat(response.data.results);
        nextPageUrl = response.data.next;
      }
      setRows(results);
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
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleMenuOpen = (event, row) => {
    setMenuAnchor(event.currentTarget);
    setSelectedRow(row);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  const renderPrograms = (programs = []) => {
    return programs.map((program) => (
      <Badge key={program.id} pill bg="dark" className="me-1">
        {program.program_name}
      </Badge>
    ));
  };

  const renderStaff = (staff = []) => {
    return staff.map((staffMember) => (
      <Badge key={staffMember.id} pill bg="dark" className="me-1">
        {staffMember.first_name + " " + staffMember.last_name}
      </Badge>
    ));
  };

  const getRowHeight = (params) => {
    if (!params.row) return 52;

    const staffCount = params.row.staff ? params.row.staff.length : 0;
    const programsCount = params.row.programs ? params.row.programs.length : 0;
    const baseHeight = 52;
    const extraHeight = 25;

    const numLines = Math.max(staffCount, programsCount);
    return baseHeight + (numLines > 1 ? (numLines - 1) * extraHeight : 0);
  };

  const handleCreateModalClose = () => {
    setOpenCreateModal(false);
    fetchData();
  };

  const handleCreateCoursemClick = () => {
    setOpenCreateModal(true);
  };

  const handleDeleteClick = async () => {
    if (!selectedRow) {
      toast.error("No course selected for deletion.", {
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
      return;
    }

    try {
      const response = await axiosInstance.delete(
        `/courses/delete/${selectedRow.id}/`,
        {
          headers: {
            Authorization: "Token " + token,
          },
        }
      );
      handleMenuClose();
      if (response.status === 204) {
        toast.success("Course deleted successfully", {
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
      }
    } catch (error) {
      console.log(error);
    }
    fetchData();
  };

  const handleEditClick = () => {
    if (!selectedRow) {
      toast.error("No course selected for editing.", {
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
      return;
    }
    setOpenEditModal(true);
    handleMenuClose();
  };

  const handleEditModalClose = () => {
    setOpenEditModal(false);
    fetchData();
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
      field: "course_name",
      headerName: "Course Name",
      width: 300,
      editable: false,
    },
    {
      field: "staff",
      headerName: "Staff",
      width: 300,
      editable: false,
      renderCell: (params) => <Box>{renderStaff(params.row.staff)}</Box>,
    },
    {
      field: "programs",
      headerName: "Programs",
      width: 300,
      editable: false,
      renderCell: (params) => <Box>{renderPrograms(params.row.programs)}</Box>,
    },
  ];

  return (
    <>
      <Box sx={{ height: 400, width: "100%" }}>
        {rows.length > 0 ? (
          <DataGrid
            rows={rows}
            columns={columns}
            getRowHeight={getRowHeight}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 10,
                },
              },
            }}
            pageSizeOptions={[10]}
            disableRowSelectionOnClick
          />
        ) : (
          <p>Loading...</p>
        )}
        <Menu
          anchorEl={menuAnchor}
          open={Boolean(menuAnchor)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleEditClick}>Edit</MenuItem>
          <MenuItem onClick={handleDeleteClick}>Delete</MenuItem>
        </Menu>
      </Box>
      <CourseCreateComponent
        open={openCreateModal}
        handleClose={handleCreateModalClose}
      />
      <Button onClick={handleCreateCoursemClick} variant="dark">
        Create new Course
      </Button>
      {openEditModal && (
        <CoursesEditComponent
          open={openEditModal}
          handleClose={handleEditModalClose}
          courseId={selectedRow?.id}
        />
      )}
    </>
  );
};

export default CoursesGridComponent;
