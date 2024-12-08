import { useParams } from 'react-router-dom';

function CompanyDashboard() {

  const { id } = useParams();

  return (
    <>
      <div className="text-center">
        Welcome to Company Dashboard
        <p>{ id }</p>
      </div>
    </>
  );
}

export default CompanyDashboard;
