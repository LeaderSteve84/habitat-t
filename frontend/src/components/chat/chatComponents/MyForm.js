import { useState } from 'react';
import { socket } from '../socket';

export function MyForm() {
  const [value, setValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  function onSubmit(event) {
    event.preventDefault();
    setIsLoading(true);

    socket.timeout(5000).emit('receive_message', value, (err) => {
      setIsLoading(false);
      if (!err) {
        setValue('');
      } else {
        console.error("message not delivered: ", err);
      }
    });
  }

  return (
    <div>
       <form onSubmit={ onSubmit }>
         <input onChange={ e => setValue(e.target.value) }/>
         <button type="submit" disabled={ isLoading }>
           {isLoading ? 'Sending...' : 'Submit'}
         </button>
       </form>
    </div>
  );
}
