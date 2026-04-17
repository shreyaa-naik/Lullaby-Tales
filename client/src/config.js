// Use VITE_API_URL if set (like in Vercel env vars), otherwise fallback to the production Render URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://lullaby-tales-api.onrender.com';

export default API_BASE_URL;
