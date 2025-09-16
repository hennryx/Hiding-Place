import axios from "axios";
import { TOKENHEADER } from "..";

const updateData = async (url, data, token) => {
    try {
        const headers = {
            Authorization: `${TOKENHEADER} ${token}`,
        };

        if (data instanceof FormData) {
            headers['Content-Type'] = 'multipart/form-data';
        }

        const response = await axios.put(
            url, 
            data, 
            { headers }
        )

        return response.data;
    } catch ({ response }) {
        const { error, message } = response.data;
        throw new Error(message ? message : error);
    }
}

export default updateData;