import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import axiosInstance from "../../utils/Axios";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
);

const LabRequestTrendsChart = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "Requests Over Time",
        data: [],
        backgroundColor: "rgba(153, 102, 255, 0.6)",
        borderColor: "rgba(153, 102, 255, 1)",
        fill: false,
      },
    ],
  });

  useEffect(() => {
    axiosInstance
      .get("/charts/lab-requests/trends/")
      .then((response) => {
        if (Array.isArray(response.data)) {
          const dates = response.data.map(
            (item) => item.created_at__date || "Unknown Date"
          );
          const requests = response.data.map((item) => item.requests || 0);

          setChartData({
            labels: dates,
            datasets: [
              {
                label: "Requests Over Time",
                data: requests,
                backgroundColor: "rgba(153, 102, 255, 0.6)",
                borderColor: "rgba(153, 102, 255, 1)",
                fill: false,
              },
            ],
          });
        } else {
          console.error("API response is not an array:", response.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching lab request trends:", error);
        setChartData({
          labels: [],
          datasets: [
            {
              label: "Requests Over Time",
              data: [],
              backgroundColor: "rgba(153, 102, 255, 0.6)",
              borderColor: "rgba(153, 102, 255, 1)",
              fill: false,
            },
          ],
        });
      });
  }, []);

  return (
    <div>
      <h2>Lab Request Trends</h2>
      <Line data={chartData} />
    </div>
  );
};

export default LabRequestTrendsChart;
