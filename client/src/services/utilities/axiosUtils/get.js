import axios from "axios";
import { TOKENHEADER } from "..";

const getData = async (url, key = "", token) => {
    let queryString = "";
    if (typeof key === "object") {
        Object.keys(key).forEach((i) => {
            const value = Array.isArray(key[i]) ? JSON.stringify(key[i]) : key[i];
            queryString += `${encodeURIComponent(i)}=${encodeURIComponent(
                value
            )}&`;
        });
        queryString = `?${queryString.slice(0, -1)}`;
    }
    
    try {
        const response = await axios.get(`${url}${queryString}`, {
            headers: {
            Authorization: `${TOKENHEADER} ${token}`,
            },
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        if (error.response) {
            const { data } = error.response;
            const errorMessage = data.message
                ? `${data.error}: ${data.message}`
                : data.error;
            throw new Error(errorMessage);
        } else {
            throw error;
        }
    }
}

export default getData;