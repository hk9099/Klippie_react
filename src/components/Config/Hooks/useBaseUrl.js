import { useEffect, useState } from 'react';

const useBaseUrl = () => {
  const [baseUrl, setBaseUrl] = useState('');

  useEffect(() => {
    const baseUrl = process.env.REACT_APP_DEV_HOSTING_URL
    setBaseUrl(baseUrl);
  }, []);

  return baseUrl;
};

export default useBaseUrl;
