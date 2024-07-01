import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import axiosInstance from "../../utils/Axios";
import { tokenLoader } from "../../utils/token";
import { Bounce, toast } from "react-toastify";

const token = tokenLoader();
const columns = [
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

const ProgramGridComponent = () => {
  const [rows, setRows] = useState([]);

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
    </Box>
  );
};

export default ProgramGridComponent;
