import { useEffect, useState } from 'react';
import axios from 'axios';

const useFetch = (URL) => {

  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(true);
  const baseUrl = "http://localhost:5000";
        
  useEffect(() => {

    const abortCont = new AbortController();

    setTimeout(() => {

      const fetchData = async () => {

        try {

          const response = await axios.get(`${baseUrl}${URL}`, {
            signal: abortCont.signal,
            headers: {
              "Content-Type": "application/json",
            },
          });
          if (response.status === 200) {
            setData(response.data);
            setError(null);
            setIsPending(false);
          } else {
            setError(null);
            setIsPending(false);
          }

        } catch (error) {

          if (error.name === "AbortError") {
            console.log("fetch aborted");

          } else {
            const errorMessage = "Error fetching data from server.";
            if (isPending) {
              console.error(error.response?.data?.error)
              setIsPending(false);
            } else {
              const err = error.response?.data?.error || errorMessage;
              setError({ error: err });
            }
          }
        }
      }
      fetchData();
            
    }, 200);

    return () => abortCont.abort();

  }, [URL, isPending]);

  return { data, isPending, error };
}

export default useFetch;
