import axios from "axios";
import { TOKENHEADER } from "..";

const deleteData = async(url, data, token) => {
    try {
        const response = await axios.delete(
            url, 
            { 
                data,
                headers: { Authorization: `${TOKENHEADER} ${token}` },
            },
        )
        return response.data
    } catch ({response}) {
        const { error, message } = response.data;
        throw new Error(message ? `${error}: ${message}` : error);
    }
}

export default deleteData;