import axios from "axios";

const register = async (url, data) => {
    try {
        const response = await axios.post(url, data);
        
        return response.data;
    } catch (error) {
        if (error.response) {
            const { data } = error.response;
            const errorMessage = data.message
                ? `${data.error}: ${data.message}`
                : data.error;
            throw errorMessage;
        } else {
            throw error;
        }
    }
}

export default register;