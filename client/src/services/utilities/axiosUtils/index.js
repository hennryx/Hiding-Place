import deleteData from "./delete";
import getData from "./get";
import saveData from "./post";
import updateData from "./update";

import login from "./login";
import logOut from "./logout";
import register from "./register";
import validateToken from "./validateToken";
import creteData from "./create";

const axiosTools = {
    register,
    login,
    logOut,
    validateToken,
    saveData,
    getData,
    updateData,
    deleteData,
    creteData
}

export default axiosTools;