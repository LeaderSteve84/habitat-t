import { useParams } from 'react-router-dom';

function UpdateProperty() {

  const { id } = useParams();

  return (
    <>
      <div className="text-center">
         Update property page
      </div>
      <p>{ id }</p>
    </>
  );
}

export default UpdateProperty;
