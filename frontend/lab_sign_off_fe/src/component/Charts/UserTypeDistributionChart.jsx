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

ChartJS.register(ArcElement, CategoryScale, Title, Tooltip, Legend);
// eslint-disable-next-line react/prop-types
const UserTypeDistributionChart = ({ selectedType }) => {
  const [chartData, setChartData] = useState({
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

  useEffect(() => {
    axiosInstance
      .get("/charts/users/type_distribution/")
      .then((response) => {
        if (Array.isArray(response.data)) {
          const filteredData = response.data.filter((item) => {
            if (selectedType === "all") return true;
            // eslint-disable-next-line react/prop-types
            return item.user_type.toLowerCase() === selectedType.toLowerCase();
          });

          const userTypes = filteredData.map(
            (item) => item.user_type || "Unknown Type"
          );
          const counts = filteredData.map((item) => item.count || 0);

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
  }, [selectedType]);

  return (
    <div>
      <Pie data={chartData} />
    </div>
  );
};

export default UserTypeDistributionChart;
