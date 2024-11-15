import { useParams } from 'react-router-dom';

function UpdateTenant() {

  const { id } = useParams();

  return (
    <div>
          { id }
    </div>
  );
}

export default UpdateTenant;
