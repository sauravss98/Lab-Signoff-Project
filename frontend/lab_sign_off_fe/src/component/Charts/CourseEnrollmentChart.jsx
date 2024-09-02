import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import axiosInstance from "../../utils/Axios";
import "./styles.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const CourseEnrollmentChart = () => {
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });

  useEffect(() => {
    let chartInstance;

    axiosInstance
      .get("/charts/enrollment/course_count/")
      .then((response) => {
        const data = response.data || [];
        if (Array.isArray(data) && data.length > 0) {
          const courses = data.map(
            (item) => item.course_name || "Unknown Course"
          );
          const enrollments = data.map(
            (item) => item.total_course_enrollments || 0
          );

          setChartData({
            labels: courses,
            datasets: [
              {
                label: "Enrollments",
                data: enrollments,
                backgroundColor: "rgba(255, 206, 86, 0.6)",
              },
            ],
          });
        } else {
          console.error("Unexpected data format:", data);
          setChartData({
            labels: [],
            datasets: [
              {
                label: "Enrollments",
                data: [],
                backgroundColor: "rgba(255, 206, 86, 0.6)",
              },
            ],
          });
        }
      })
      .catch((error) => {
        console.error("Error fetching course enrollments:", error);
        setChartData({
          labels: [],
          datasets: [
            {
              label: "Enrollments",
              data: [],
              backgroundColor: "rgba(255, 206, 86, 0.6)",
            },
          ],
        });
      });

    return () => {
      if (chartInstance) {
        chartInstance.destroy();
      }
    };
  }, []);

  return (
    <div className="chart-container">
      <h2>Course Enrollment Counts</h2>
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
            },
            y: {
              beginAtZero: true,
              ticks: {
                callback: function (value) {
                  return Number.isInteger(value) ? value : "";
                },
              },
            },
          },
        }}
        ref={(ref) => {
          if (ref && ref.chartInstance) {
            // eslint-disable-next-line no-undef
            chartInstance = ref.chartInstance;
          }
        }}
      />
    </div>
  );
};

export default CourseEnrollmentChart;
