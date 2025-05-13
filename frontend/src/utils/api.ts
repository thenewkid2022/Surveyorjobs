export const getApiUrl = () => {
  if (process.env.NODE_ENV === 'development') {
    return process.env.NEXT_PUBLIC_API_URL_DEV || 'http://localhost:4000';
  }
  return process.env.NEXT_PUBLIC_API_URL_PROD || 'https://surveyorjobs.onrender.com';
};
