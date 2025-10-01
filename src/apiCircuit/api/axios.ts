import axios from 'axios';

const CIRCUIT_API_URL = process.env.CIRCUIT_API_URL;
const CIRCUIT_API_KEY = process.env.CIRCUIT_API_KEY;

if (!CIRCUIT_API_URL) {
    throw new Error("Falta la variable de entorno CIRCUIT_API_URL");
}
if (!CIRCUIT_API_KEY) {
    throw new Error("Falta la variable de entorno CIRCUIT_API_KEY");
}

const api = axios.create({
    baseURL: CIRCUIT_API_URL,
    headers: {
        'Authorization': `Bearer ${CIRCUIT_API_KEY}`
    }
});

export default api;