export const getApiUrl = () => {
  if (process.env.NODE_ENV === 'development') {
    return process.env.API_URL || 'http://localhost:4000';
  }
  return process.env.API_URL || 'https://surveyorjobs.onrender.com';
};
