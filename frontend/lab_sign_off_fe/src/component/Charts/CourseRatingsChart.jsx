import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
import axiosInstance from "../../utils/Axios";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);

const CourseRatingsChart = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "Average Rating",
        data: [],
        backgroundColor: "rgba(153, 102, 255, 0.6)",
      },
    ],
  });

  useEffect(() => {
    axiosInstance
      .get("/charts/feedback/course_ratings/")
      .then((response) => {
        const courses = response.data.map((item) => item.course__course_name);
        const averageRatings = response.data.map((item) => item.average_rating);

        setChartData({
          labels: courses,
          datasets: [
            {
              label: "Average Rating",
              data: averageRatings,
              backgroundColor: "rgba(153, 102, 255, 0.6)",
            },
          ],
        });
      })
      .catch((error) => console.error("Error fetching course ratings:", error));
  }, []);

  return (
    <div style={{ position: "relative", height: "400px", width: "100%" }}>
      <h2>Average Course Ratings</h2>
      <Bar
        data={chartData}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: "top",
            },
            tooltip: {
              callbacks: {
                label: (context) => {
                  return `${context.label}: ${context.raw}`;
                },
              },
            },
          },
          scales: {
            x: {
              beginAtZero: true,
              ticks: {
                callback: (value) => (Number.isInteger(value) ? value : ""),
              },
            },
            y: {
              beginAtZero: true,
              ticks: {
                callback: (value) => (Number.isInteger(value) ? value : ""),
              },
            },
          },
        }}
      />
    </div>
  );
};

export default CourseRatingsChart;
