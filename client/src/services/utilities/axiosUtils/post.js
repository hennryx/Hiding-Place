import axios from "axios";
import { TOKENHEADER } from "..";

const saveData = async (url, formData, token) => {
    try {
        const headers = {
            Authorization: `${TOKENHEADER} ${token}`,
        };

        if (formData instanceof FormData) {
            headers['Content-Type'] = 'multipart/form-data';
        }

        const response = await axios.post(
            url, 
            formData, 
            { headers }
        )
        return response.data;
    } catch ({ response }) {
        const { error, message } = response.data;
        throw new Error(message ? `${error}: ${message}` : error);
    }
}

export default saveData;