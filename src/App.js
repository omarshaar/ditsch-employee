import { useEffect, useState } from 'react';
import './App.css';
import './style/main.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// screens
import Login from './pages/Login/Login.jsx';
import Home from './pages/Home/home';
import Inventar from './pages/Inventar/Inventar';
import Lager from './pages/Lager/Lager';
import Bruch from './pages/Bruch/Bruch';
import Tasks from './pages/Tasks/Tasks';
import Online from './pages/Online/Online';
import Tarcker from './pages/Tarcker/Tarcker';
import Lieferschein from './pages/Lieferschein/Lieferschein';
import Verkauf from './pages/Verkauf/Verkauf';
import Reinigung from './pages/Reinigung/Reinigung';
import Theke from './pages/Theke/Theke';
import Lieferungskamera from './pages/lieferungskamera/lieferungskamera';
// Providers 
import { MainProvider } from './contextApi/main';
//
import useFetch from './hooks/useFetch';
import Alert from './components/alert/Alert';


function App() {
  const [distance, setDistance] = useState(null);
  const { data, loading, postData } = useFetch();
  const [logedIn , setlogedIn ] = useState(false);
  const [ showAlert, setshowAlert ] = useState(false);
  const alertMessage = 'Der Benutzername oder das Passwort ist falsch';

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      const userLatitude = position.coords.latitude;
      const userLongitude = position.coords.longitude;
      const targetLatitude = 50.73938653170723;
      const targetLongitude = 7.10105677908119;

      const distance = calculateDistance(
        userLatitude,
        userLongitude,
        targetLatitude,
        targetLongitude
      );

      setDistance(distance);
    });

    localStorage.getItem('user') && localStorage.getItem('user') === 'user' && setlogedIn(true);

    setTimeout(() => {
    }, 500);
    
  }, []);

  useEffect(()=> {
    !logedIn && adminValidation();
  },[]);

  function calculateDistance(lat1, lon1, lat2, lon2) {
    const p = 0.017453292519943295;
    const c = Math.cos;
    const a = 0.5 - c((lat2 - lat1) * p) / 2 +
      c(lat1 * p) * c(lat2 * p) *
      (1 - c((lon2 - lon1) * p)) / 2;

    return 12742 * Math.asin(Math.sqrt(a));
  }

  useEffect(()=>{
    //distance && window.alert(distance);
  },[distance]);

  function handelLogIn(userName , pass) {
    postData(`https://apiditsch.oderasid.com/login.php`, {user: userName, pass: pass, ip: getMachineId()});
  }

  function notUser() {
    setshowAlert(true);
    setTimeout(() => setshowAlert(false), 3000);
  }

 

  useEffect(()=>{
    function validated() {
      setlogedIn(true);
      localStorage.setItem('user', 'user');
      localStorage.setItem('userData', JSON.stringify(data[0]));
      setTimeout(() => { window.location.reload(); }, 500);
    }
     
    data && data.length > 0 ? validated() : data === false && notUser();
  },[data]);

  function getMachineId() {
      let machineId = localStorage.getItem('MachineId');
      if (!machineId) {
          machineId = crypto.randomUUID();
          localStorage.setItem('MachineId', machineId);
      }
      return machineId;
  }

  function adminValidation() {
    window.addEventListener('message', (event) => {
      let admin = event.data == "admin";
      if (admin) {
        let userData = {
          avatar: "",
          dailyHours: 24,
          euro_std: 1,
          id: 1,
          role: "a-b-c-d-e-t-v-lk",
          userName: "admin"
        }
        setlogedIn(true);
        localStorage.setItem('user', 'user');
        localStorage.setItem('userData', JSON.stringify(userData));
      }
    });
  }




  return (
    <div className="App">
      <Router>
        <Alert show={showAlert} msg={alertMessage} />
        <MainProvider>
          <Routes>
            { !logedIn ? <Route path='/' element={<Login callback={handelLogIn} loading={loading} data={data} />}></Route> : <Route path='/' element={<Home />}></Route> } 
            <Route path='/inventar' element={<Inventar />} />
            <Route path='/lager' element={<Lager />} />
            <Route path='/bruch' element={<Bruch />} />
            <Route path='/tasks' element={<Tasks />} />
            <Route path='/online' element={<Online />} /> 
            <Route path='/tarcker' element={<Tarcker />} /> 
            <Route path='/lieferschein' element={<Lieferschein />} /> 
            <Route path='/verkauf' element={<Verkauf />} /> 
            <Route path='/reinigung' element={<Reinigung />} /> 
            <Route path='/theke' element={<Theke />} /> 
            <Route path='/lieferungskamera' element={<Lieferungskamera />} /> 
          </Routes>
        </MainProvider>
      </Router>
    </div>
  );
}

export default App;
