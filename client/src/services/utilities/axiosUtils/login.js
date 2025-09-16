import axios from "axios";

const login = async (url, _data) => {
    try {
        const response = await axios.post(url, _data);
        const { data } = response;
        localStorage.setItem("token", data.token);
        
        return data;
    } catch ({ response }) {
        const { error, message } = response.data;
        throw new Error(message ? `${error}: ${message}` : error);
    }   
}

export default login;