import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import axiosInstance from "../../utils/Axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const CourseParticipationChart = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "Participation",
        data: [],
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
    ],
  });

  useEffect(() => {
    axiosInstance
      .get("/charts/lab-sessions/course_participation/")
      .then((response) => {
        if (Array.isArray(response.data)) {
          const courses = response.data.map(
            (item) => item.course__course_name || "Unknown Course"
          );
          const participation = response.data.map(
            (item) => item.participation || 0
          );

          setChartData({
            labels: courses,
            datasets: [
              {
                label: "Participation",
                data: participation,
                backgroundColor: "rgba(75, 192, 192, 0.6)",
              },
            ],
          });
        } else {
          console.error("API response is not an array:", response.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching course participation:", error);
        setChartData({
          labels: [],
          datasets: [
            {
              label: "Participation",
              data: [],
              backgroundColor: "rgba(75, 192, 192, 0.6)",
            },
          ],
        });
      });
  }, []);

  return (
    <div>
      <h2>Lab Session Participation</h2>
      <Bar data={chartData} />
    </div>
  );
};

export default CourseParticipationChart;
