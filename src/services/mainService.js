import axios from "axios";

const ApiHostUrl = "https://apiditsch.oderasid.com/";

export const getUserData = async (id) =>{
    const Respo = await axios.get(`${ApiHostUrl}?req=getUserData&user=`+id);
    return Respo.data;
}


export const getAllUHRInMonth = async (id) =>{
    const Respo = await axios.get(`${ApiHostUrl}?req=getAllUHRInMonth&userID=`+id);
    return Respo.data;
}

export const getOverTime = async (id) =>{
    const Respo = await axios.get(`${ApiHostUrl}?req=getOverTime&userID=`+id);
    return Respo.data;
}

export const copmlatedTask = async (obj) =>{
    const Respo = await axios.post(`${ApiHostUrl}?req=copmlatedTask`, JSON.stringify(obj));
    return Respo.data;
}

export const AddBruch = async (obj) =>{
    const Respo = await axios.post(`${ApiHostUrl}`, JSON.stringify(obj));
    return Respo.data;
}

export const AddLieferschein = async (obj) =>{
    const Respo = await axios.post(`${ApiHostUrl}`, JSON.stringify(obj));
    return Respo.data;
}

export const register = async (obj) =>{
    const Respo = await axios.post(`${ApiHostUrl}`, JSON.stringify(obj));
    return Respo.data;
}

export const uploadImage = async (fd) =>{
    const Respo = await axios.post(`${ApiHostUrl}upload.php`, fd);
    return Respo.data;
}