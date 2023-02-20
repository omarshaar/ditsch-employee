import { useContext, useEffect, useState } from "react";
import MainHeader from "../../components/mainHeader/MainHeader";
import mainContext from "../../contextApi/main";
// MUI
import Button from '@mui/material/Button';
// 
import useFetch from "../../hooks/useFetch";

const Lieferungskamera = () => {
    const Context = useContext(mainContext);
    const { data, loading, postData , getDataPro } = useFetch();

    function handleUploadImage(e) {
        let target = e.target;
        let image = target.files[0];
        let user = JSON.parse( localStorage.getItem('userData') );

        const fd = new FormData();
        fd.append('image', image, image.name);
        fd.append('targetUser', user.id);
        fd.append('targetUserName', user.userName);
        fd.append("type", "lieferkamera");

        postData('https://apiditsch.oderasid.com/upload.php', fd);

    }
    
    const roleID = 'lk';
    const [ isRole, setIsRole ] = useState(false);
    useEffect(()=>{
        let roles = Context.data.user.role && (Context.data.user.role).split('-');
        roles && roles.forEach(role => role == roleID && setIsRole(true));
    },[Context]);
    if (!isRole) return;



    return (
        <div className="w-full">
            <MainHeader />

            <div className={loading ? "p-5 page m-auto flex items-center justify-center activeOnBtn" : "p-5 page m-auto flex items-center justify-center"}>
                    <input className="h-full hidden" accept="image/*" id="lieferkamera" type="file" capture="environment" onChange={(e)=> handleUploadImage(e)} disabled={loading} />
                    <label className={"bg-main onlineBtn flex justify-center items-center"} htmlFor="lieferkamera" >
                        <svg width="60%" height="80%" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#fff" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M5 7h1a2 2 0 0 0 2 -2a1 1 0 0 1 1 -1h6a1 1 0 0 1 1 1a2 2 0 0 0 2 2h1a2 2 0 0 1 2 2v9a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-9a2 2 0 0 1 2 -2" /><circle cx="12" cy="13" r="3" /></svg>
                    </label>
            </div>
        </div>
    );
}

export default Lieferungskamera;

