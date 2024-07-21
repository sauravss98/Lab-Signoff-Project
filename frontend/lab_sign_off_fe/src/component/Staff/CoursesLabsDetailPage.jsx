import { useParams } from "react-router-dom";

const CoursesLabsDetailPage = () => {
  const { selectedRowId } = useParams();

  return <div>Course Details for ID: {selectedRowId}</div>;
};

export default CoursesLabsDetailPage;
