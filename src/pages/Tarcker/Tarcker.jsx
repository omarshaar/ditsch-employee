import { useState, useEffect } from 'react';
// components
import MainHeader from "../../components/mainHeader/MainHeader";
// api
import useFetch from '../../hooks/useFetch';






const Tarcker = () => {

    const [target, setTarget] = useState({
      lat: 50.73938653170723,
      lng: 7.10105677908119,
    });
    const [location, setLocation] = useState({});
    const [error, setError] = useState(null);
    const [distance, setDistance] = useState(null);
    const [ zoneMessage, setZoneMessage ] = useState('');
    const [ online, setOnline ] = useState(null);

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
          (position) => setLocation(position.coords),
          (error) => setError(error)
        );
    }, []);



    useEffect(() => {
        if (location.latitude && location.longitude) {
          const distance = calculateDistance(location, target);
          setDistance(distance);
          if (distance > 100) {
            alert("You are more than 100 meters away from your target location!");
          }
        }
      }, [location]);
    
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

                    <div className=''>
                        <p className='m-auto text-3xl font-extrabold mb-10  w-max'>
                            Arbeit beginnen.
                        </p>

                        <p className='m-auto text-xl font-bold mb-10 text-main  w-max'> { zoneMessage  } </p>
                        <p className='m-auto mb-10  w-max'> { distance && parseFloat(distance.toFixed(3)) * 1000 + ' m' } </p>
                        <p className='m-auto mb-10  w-max'> { distance + ' m' } </p>
                    </div>

                    <div className={
                        !online ? "bg-main onlineBtn flex justify-center items-center"
                        : "bg-active onlineBtn flex justify-center items-center"
                    } >
                        <svg width="80%" height="80%" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#fff" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M7 6a7.75 7.75 0 1 0 10 0" /><line x1="12" y1="4" x2="12" y2="12" /></svg>
                    </div>
                </div>


            </div>

        </div>
    );

}

export default Tarcker;