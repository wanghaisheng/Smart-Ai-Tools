const API_BASE_URL = process.env.NODE_ENV === 'production'
  ? 'https://5a955861-0833-4fa6-b0d5-523efe7779c1.e1-us-east-azure.choreoapps.dev'
  : 'http://localhost:5000';

export const apiConfig = {
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: true
};
