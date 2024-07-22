import { useParams } from "react-router-dom";

const StudentDetailPage = () => {
  const { selectedRowId } = useParams();
  return <div>Student Detail Page with {selectedRowId}</div>;
};

export default StudentDetailPage;
