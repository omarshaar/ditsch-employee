import { useEffect, useState } from "react";
import axios from "axios";

const useFetch = (url) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  
  
  useEffect(() => {
    fetchData();
  }, [url]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(url);
      setData(res.data);
    } catch (err) {
      setError(err);
    }
    setLoading(false);
  };

  const reFetch = async () => {
    setLoading(true);
    try {
      const res = await axios.get(url);
      setData(res.data);
    } catch (err) {
      setError(err);
    }
    setLoading(false);
  };

  const getData = async (url) => {
    setLoading(true);
    try {
        const res = await axios.get(url);
        setData(res.data);
      } catch (err) {
        setError(err);
    }
    setLoading(false);
  }

  const getDataPro = async (url) => {
    let data;
    setLoading(true);
    try {
        const res = await axios.get(url);
        data = res.data;
      } catch (err) {
        setError(err);
    }
    setLoading(false);
    return data;
  }



  const postData = async (url, body) => {
    setLoading(true);
    try {
        const res = await axios.post(url, body);
        setData(res.data);
      } catch (err) {
        setError(err);
    }
    setLoading(false);
  }


  return { data, loading, error, reFetch, getData, getDataPro, postData };
};

export default useFetch;
