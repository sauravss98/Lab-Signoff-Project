import { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import axiosInstance from "../../utils/Axios";
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register necessary Chart.js components
ChartJS.register(ArcElement, CategoryScale, Title, Tooltip, Legend);

const UserTypeDistributionChart = () => {
  const [chartData, setChartData] = useState({
    labels: [], // Initialize with empty arrays
    datasets: [
      {
        label: "User Type Distribution",
        data: [],
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(75, 192, 192, 0.6)",
        ],
      },
    ],
  });

  useEffect(() => {
    axiosInstance
      .get("/charts/users/type_distribution/")
      .then((response) => {
        // Ensure the data is an array
        if (Array.isArray(response.data)) {
          const userTypes = response.data.map(
            (item) => item.user_type || "Unknown Type"
          );
          const counts = response.data.map((item) => item.count || 0);

          setChartData({
            labels: userTypes,
            datasets: [
              {
                label: "User Type Distribution",
                data: counts,
                backgroundColor: [
                  "rgba(255, 99, 132, 0.6)",
                  "rgba(54, 162, 235, 0.6)",
                  "rgba(255, 206, 86, 0.6)",
                  "rgba(75, 192, 192, 0.6)",
                ],
              },
            ],
          });
        } else {
          console.error("API response is not an array:", response.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching user type distribution:", error);
        // Optionally handle the error state here
        setChartData({
          labels: [],
          datasets: [
            {
              label: "User Type Distribution",
              data: [],
              backgroundColor: [
                "rgba(255, 99, 132, 0.6)",
                "rgba(54, 162, 235, 0.6)",
                "rgba(255, 206, 86, 0.6)",
                "rgba(75, 192, 192, 0.6)",
              ],
            },
          ],
        });
      });
  }, []);

  return (
    <div>
      <h2>User Type Distribution</h2>
      <Pie data={chartData} />
    </div>
  );
};

export default UserTypeDistributionChart;
