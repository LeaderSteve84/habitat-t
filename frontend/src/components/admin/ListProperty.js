import { useParams } from 'react-router-dom';

function ListProperty() {

  const { id } = useParams();
  if (id) {
    console.log(id);
  }

  return (
    <>
      <div className="text-center">
          <p>List Property Page</p>
      </div>
    </>
  );
}

export default ListProperty;
