import axios from "axios";
import { TOKENHEADER } from "..";

const validateToken = async(url, token) => {
    try {
        const { data } = await axios.get(url, {
          headers: { Authorization: `${TOKENHEADER} ${token}` },
          withCredentials: true,
        });
        
        return data;
      } catch (error) {
        const errorMsg = error.response ? error.response.data.message : error.message;
        throw new Error(errorMsg);
      }
}

export default validateToken;