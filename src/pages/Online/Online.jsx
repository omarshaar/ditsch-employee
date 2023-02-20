import { useState, useEffect } from 'react';
import './online.css';
// components
import MainHeader from "../../components/mainHeader/MainHeader";
// api
import { getIpData, handleOnlineAPI, postData } from './services/onlineService';


const Online = () => {

    const DOMAIN = "telefonica.com";
    const ROUTE = "46.114.0.0/15";

    const [target, setTarget] = useState({
      lat: 50.73938653170723,
      lng: 7.10105677908119,
    });
    const [location, setLocation] = useState({});
    const [ distance, setDistance ] = useState(null);
    const [ radius, setRadius ] = useState(1000);
    const [ online, setOnline ] = useState(null);
    const [ zoneMessage, setZoneMessage ] = useState('');
    const [ inTheZone, setInTheZone ] = useState(null); 
    const [ data, setData ] = useState({});

    useEffect(() => {
        setOnline( localStorage.getItem('online') && JSON.parse(localStorage.getItem('online')) );
    }, []);

    useEffect(() => {
        runLocation();
    });

    function runLocation() {
        navigator.geolocation.watchPosition(handlePositionReceived);
    }

    useEffect(() => {
        if (location.latitude && location.longitude) {
          const distance = calculateDistance(location, target);
          setDistance(distance);
          if (parseFloat(distance.toFixed(3)) * 1000 < radius) {
            setInTheZone(true);
          }else{
            setInTheZone(false);
          }
        }
    }, [location]);

    useEffect(()=>{
        //online === false && navigator.geolocation.clearWatch(watchId);
        const pageBody = document.querySelector('#page-body');
        online && pageBody.classList.add('activeOnBtn');
    },[online]);

    function handlePositionReceived({ coords }) {
        setLocation({
          latitude: coords.latitude,
          longitude: coords.longitude,
        });
    }
    
    function OnlineHandler() {
        
        if (inTheZone === false) setZoneMessage('Sie Sind nicht in der Zone');
        if (inTheZone && !online)postOnline(1);
        else postOnline(0);

        getIpData().then(data => {
            if (data.asn.domain == DOMAIN && data.asn.route == ROUTE) {}
        });
    }

    function postOnline(state) {
        let userID;
        try{ userID = localStorage.getItem('userData') && JSON.parse(localStorage.getItem('userData')).id }
        finally{ 
            userID && handleOnlineAPI({state: state, userID: userID}).then(data =>{ 
                console.log(data);
                setData(data);
                
            }); 
            // userID && postData({state: state, userID: userID}).then(data => console.log(data));
        }
    }
    
    useEffect(()=>{ 
        if (data && data == 'online successfully') {
            setOnline(true);
            localStorage.setItem('online', true);
            setZoneMessage('');
        }else if (data && data == 'Error') {
            setZoneMessage('Es liegt ein Fehler vom Server vor');
        }

        if (data && data == 'offline successfully') {
            const pageBody = document.querySelector('#page-body');
            setOnline(false);
            localStorage.setItem('online', false);
            pageBody.classList.remove('activeOnBtn');
        }
    },[data]);

    useEffect(()=>{
        inTheZone === false && postOnline(0);
    },[inTheZone]);

    function calculateDistance(location1, location2) {
        const lat1 = location1.latitude;
        const lng1 = location1.longitude;

        const lat2 = location2.lat;
        const lng2 = location2.lng;


        const R = 6371; // radius of Earth in kilometers
        const dLat = (lat2 - lat1) * (Math.PI / 180);
        const dLng = (lng2 - lng1) * (Math.PI / 180);
        const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat1 * Math.PI) / 180) *
            Math.cos((lat2 * Math.PI) / 180) *
            Math.sin(dLng / 2) *
            Math.sin(dLng / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const d = R * c;
        return d;
    }












    return (
        <div className="w-full">
            <MainHeader />

            <div className="page m-auto flex justify-center items-center flex-col" id='page-body'>

                <div className='w-max mb-11 text-center flex justify-center items-center flex-col'>

                    <div>
                        <p className='m-auto text-3xl font-extrabold mb-10  w-max'> 
                            {  online ? "Arbeit beenden." :  "Arbeit beginnen." }
                        </p>
                        <p className='m-auto text-xl font-bold mb-10 text-main  w-max'> { zoneMessage  } </p>
                        <p className='m-auto mb-10  w-max'> { distance && parseFloat(distance.toFixed(3)) * 1000 + ' m' } </p>
                    </div>

                    <div className={
                        !online ? "bg-main onlineBtn flex justify-center items-center"
                        : "bg-active onlineBtn flex justify-center items-center"
                    }  onClick={()=>{ OnlineHandler() }} >
                        <svg width="80%" height="80%" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#fff" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M7 6a7.75 7.75 0 1 0 10 0" /><line x1="12" y1="4" x2="12" y2="12" /></svg>
                    </div>
                </div>

            </div>

        </div>
    );

}

export default Online;