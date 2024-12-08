import { useParams } from 'react-router-dom';

function ListUnit() {

  const { id } = useParams();
  if (id) {
    console.log(id);
  }

  return (
    <>
      <div className="text-center">
          <p>List Property Unit Page</p>
      </div>
    </>
  );
}

export default ListUnit;
