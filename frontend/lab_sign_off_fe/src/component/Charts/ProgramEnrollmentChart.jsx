import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import axiosInstance from "../../utils/Axios";

const ProgramEnrollmentChart = () => {
  const [chartData, setChartData] = useState({});

  useEffect(() => {
    axiosInstance
      .get("/charts/enrollment/program_count/")
      .then((response) => {
        const programs = response.data.map((item) => item.program_name);
        const enrollments = response.data.map((item) => item.enrollments);

        setChartData({
          labels: programs,
          datasets: [
            {
              label: "Enrollments",
              data: enrollments,
              backgroundColor: "rgba(75, 192, 192, 0.6)",
            },
          ],
        });
      })
      .catch((error) =>
        console.error("Error fetching program enrollments:", error)
      );
  }, []);

  return (
    <div>
      <h2>Program Enrollment Counts</h2>
      <Bar data={chartData} />
    </div>
  );
};

export default ProgramEnrollmentChart;
