import { useParams } from 'react-router-dom';

function ClusterDashboard() {
  const { clusterName } = useParams();

  return (
    <>
      <div className="text-center">
        { clusterName } Dashboard
      </div>
    </>
  );
}

export default ClusterDashboard;
