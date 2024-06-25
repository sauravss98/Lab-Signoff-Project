import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import axiosInstance from "../../utils/Axios";
import { tokenLoader } from "../../utils/token";

const token = tokenLoader();
const columns = [
  { field: "id", headerName: "ID", width: 90 },
  {
    field: "first_name",
    headerName: "First name",
    width: 150,
    editable: false,
  },
  {
    field: "last_name",
    headerName: "Last name",
    width: 150,
    editable: false,
  },
  {
    field: "email",
    headerName: "Email",
    width: 150,
    editable: false,
  },
  {
    field: "user_type",
    headerName: "User Type",
    width: 150,
    editable: false,
  },
];
const UserGridComponent = () => {
  const [rows, setRows] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      let results = [];
      let nextPageUrl = "users/users_list";

      while (nextPageUrl) {
        const response = await axiosInstance.get(nextPageUrl, {
          headers: {
            Authorization: "Token " + token,
          },
        });
        results = results.concat(response.data.results);
        nextPageUrl = response.data.next; // Update nextPageUrl to the next page
      }

      setRows(results);
    };
    fetchData();
  }, []);

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
      />
    </Box>
  );
};

export default UserGridComponent;