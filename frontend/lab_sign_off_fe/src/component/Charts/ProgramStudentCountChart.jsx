import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import axiosInstance from "../../utils/Axios";

const ProgramStudentCountChart = () => {
  const [chartData, setChartData] = useState({});

  useEffect(() => {
    axiosInstance
      .get("/charts/programs/student_count/")
      .then((response) => {
        const programs = response.data.map((item) => item.program_name);
        const students = response.data.map((item) => item.students);

        setChartData({
          labels: programs,
          datasets: [
            {
              label: "Number of Students",
              data: students,
              backgroundColor: "rgba(54, 162, 235, 0.6)",
            },
          ],
        });
      })
      .catch((error) =>
        console.error("Error fetching program student counts:", error)
      );
  }, []);

  return (
    <div>
      <h2>Program Student Counts</h2>
      <Bar data={chartData} />
    </div>
  );
};

export default ProgramStudentCountChart;
