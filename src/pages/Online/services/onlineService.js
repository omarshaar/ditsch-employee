import axios from "axios";

const ApiHostUrl = "https://apiditsch.oderasid.com/online.php";

export const getIpData = async () =>{
    const Respo = await axios.get(`https://api.ipdata.co/?api-key=cc633ae9c71c2ba4043e9d39a9513b888f49ec4650591593d3d8da80`);
    return Respo.data;
}

export const handleOnlineAPI = async (obj) =>{
    const Respo = await axios.post(`${ApiHostUrl}`, JSON.stringify(obj));
    return Respo.data;
}
