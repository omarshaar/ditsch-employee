import { useContext, useEffect, useState } from "react";
// components
import MainHeader from "../../components/mainHeader/MainHeader";
import Alert from "../../components/alert/Alert";
// context 
import mainContext from "../../contextApi/main";
// useFetch
import useFetch from "../../hooks/useFetch";
// MUI
import CircularProgress from '@mui/material/CircularProgress';


const Reinigung = () => {
    const cameraIcon = <svg className="" width="28" height="28" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#000000" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M5 7h1a2 2 0 0 0 2 -2a1 1 0 0 1 1 -1h6a1 1 0 0 1 1 1a2 2 0 0 0 2 2h1a2 2 0 0 1 2 2v9a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-9a2 2 0 0 1 2 -2" /><path d="M9.5 15a3.5 3.5 0 0 0 5 0" /><line x1="15" y1="11" x2="15.01" y2="11" /><line x1="9" y1="11" x2="9.01" y2="11" /></svg>;
    const { data, loading, postData , getDataPro } = useFetch();
    const [ toLoadingID, setToloadingID ] = useState('');
    const [ toCleanList, setToCleanList ] = useState([]);

    useEffect(()=>{
        getToCleanData();
    },[]);

    useEffect(()=>{
        if (data.includes('Successfully')) getToCleanData();
    },[data]);

    function getToCleanData() {
        let userID;
        try{userID = (JSON.parse( localStorage.getItem('userData') )).id;}
        finally{ getDataPro("https://apiditsch.oderasid.com/?req=getToClean&userID="+userID).then(data => handelToCleanList(data)); }
    }

    function handleUploadImage(e, id) {
        let target = e.target;
        let image = target.files[0];
        let TaskObject = JSON.stringify( (toCleanList.filter( item => item.id == id ))[0] );
        let user = JSON.parse( localStorage.getItem('userData') ).id;
        setToloadingID(id);

        const fd = new FormData();
        fd.append('image', image, image.name);
        fd.append('TaskObject', TaskObject);
        fd.append('taskID', id);
        fd.append('targetUser', user);
        fd.append("type", "clean");

        postData('https://apiditsch.oderasid.com/upload.php', fd);
    }
   
    function handelToCleanList(data) {
        let tody = new Date();
        let dataCopy = data.filter( item => item.interval == 'dayli' || item.interval <= daysBetweenDates(tody, new Date(item.lastComplatedDate)) )
        setToCleanList(dataCopy);
    }

    function daysBetweenDates(date1, date2) {
        var date1InSeconds = date1.getTime();
        var date2InSeconds = date2.getTime();
        
        var differenceInSeconds = Math.abs(date1InSeconds - date2InSeconds);
        var differenceInDays = differenceInSeconds / (1000 * 60 * 60 * 24);
        
        return differenceInDays;
    }


    

    
    const roleID = 'b';
    const [ isRole, setIsRole ] = useState(false);
    const Context = useContext(mainContext);
    useEffect(()=>{
        let roles = Context.data.user.role && (Context.data.user.role).split('-');
        roles && roles.forEach(role => role == roleID && setIsRole(true));
    },[Context]);
    if (!isRole) {
        return;
    }

    



    return (
        <div className="w-full min-h-screen ">
            <MainHeader />

            <div className="w-full p-5 page m-auto">
            { toCleanList.map( item =>
                <div key={"cleanListItem"+item.id} className="mb-5 shadow-sm cleanlist-item ">
                    
                    <div className="w-full bg-white rounded-md p-5 flex justify-between items-center">
                        
                        <div className="pr-4">
                            <p className="font-bold text-main mb-2 text-lg"> { item.title } </p>
                            { item.description  && <p className="text-sm text-second"> { item.description } </p> }
                        </div>
                    
                        <div className="w-7 h-7 relative" >
                            <div className="w-full h-full opacity-0 overflow-hidden absolute top-0 left-0">
                                <input className="h-full" accept="image/*" id={`cleanListItemImage${item.id+5}`} type="file" capture="environment" onChange={(e)=> handleUploadImage(e, item.id)}/>
                            </div>

                            {   
                                toLoadingID == item.id ? loading ? <CircularProgress color="inherit" size={32} /> : cameraIcon
                                : cameraIcon
                            }
                            
                        </div>
                    </div>
                </div>
            )}
            </div>
        </div>
    );
}

export default Reinigung;