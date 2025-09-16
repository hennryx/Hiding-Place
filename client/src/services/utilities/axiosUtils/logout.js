import axios from "axios";
import { TOKENHEADER } from "..";

const logOut = async (url, token) => {
    try {
        const response = await axios.post(url,  {}, { headers: { Authorization: `${TOKENHEADER} ${token}` }},)
        const { message } = response.data;
        return message;
    } catch ({ response }) {
        const { error, message } = response.data;
        throw new Error(message ? `${error}: ${message}` : error);
    }
}

export default logOut;