import { useParams } from 'react-router-dom';

function UpdateUnit() {

  const { unitId } = useParams();

  return (
    <>
      <div className="text-center">
         Update property Unit page
      </div>
      <p>{ unitId }</p>
    </>
  );
}

export default UpdateUnit;
