import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import axiosInstance from "../../utils/Axios";
import { tokenLoader } from "../../utils/token";
import { Bounce, toast } from "react-toastify";
import IconButton from "@mui/material/IconButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

const token = tokenLoader();

const ProgramGridComponent = () => {
  const [rows, setRows] = useState([]);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);

  const handleMenuOpen = (event, row) => {
    setMenuAnchor(event.currentTarget);
    setSelectedRow(row);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setSelectedRow(null);
  };

  const handleEditClick = () => {
    console.log("Selected item = ", selectedRow);
  };

  const handleDeleteClick = () => {
    console.log("Selected item = ", selectedRow.id);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        let results = [];
        let nextPageUrl = "/programs/list";
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
        console.log(errorMessage);
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
    };
    fetchData();
  }, []);

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
      field: "program_name",
      headerName: "Program name",
      width: 300,
      editable: false,
    },
    {
      field: "program_lenght",
      headerName: "Program lenght (Years)",
      width: 300,
      editable: false,
    },
  ];

  return (
    <Box sx={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={rows}
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
        // onCellClick={(params) => {
        //   if (params.field === "id") {
        //     handleRowClick(params);
        //   }
        // }}
      />
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleEditClick}>Edit</MenuItem>
        <MenuItem onClick={handleDeleteClick}>Delete</MenuItem>
      </Menu>
    </Box>
  );
};

export default ProgramGridComponent;
