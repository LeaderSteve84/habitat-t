import { useEffect, useState } from 'react';
import axios from 'axios';

const useFetch = (URL) => {

  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(true);
        
  useEffect(() => {

    const abortCont = new AbortController();

    setTimeout(() => {

      const fetchData = async () => {

        try {

          const response = await axios.get(URL, { signal: abortCont.signal });
          setData(response.data);
          setIsPending(false);
          setError(null);

        } catch (error) {

          if (error.name === "AbortError") {
            console.log("fetch aborted");

          } else {

          const errorMessage = "Error fetching data from server.";
          setIsPending(false);
          console.error(error.response?.data?.error)
          setError({ error: errorMessage });
          }
        }
      }
      fetchData();
            
    }, 500);

    return () => abortCont.abort();

  }, [URL]);

  return { data, isPending, error };
}

export default useFetch;
