import {  useEffect, useState } from 'react';
import './login.css';
// icons
import Logo from '../../assets/icons/logo.png';
// MUI
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
// api
import useFetch from '../../hooks/useFetch';
import { register } from '../../services/mainService';



const Login = (props) => {

    const [ data, setData ] = useState("");
    const handelLogIn = props.callback;
    const [ loded , setLoded ] = useState(false);
    const [ registery, setRegister ] = useState(false);
    const [userName, setUserName] = useState('');
    const [pass, setPass] = useState('');
    const [ showAvatars, setShowAvatars ] = useState(false);
    const [ registerData, setRegisterData ] = useState({
        userName: "",
        pass: "",
        pass2: "",
        email: "",
        avatar: null,
    });
    const avatars = [
        "https://cdn2.iconfinder.com/data/icons/avatars-60/5985/1-Girl-128.png",
        "https://cdn2.iconfinder.com/data/icons/avatars-60/5985/13-Captain-128.png",
        "https://cdn2.iconfinder.com/data/icons/avatars-60/5985/28-School_Girl-128.png",
        "https://cdn2.iconfinder.com/data/icons/avatars-60/5985/35-Athlete-128.png",
        "https://cdn2.iconfinder.com/data/icons/avatars-60/5985/36-Grandfather-128.png",
        "https://cdn2.iconfinder.com/data/icons/avatars-60/5985/30-Scientist-128.png",
        "https://cdn1.iconfinder.com/data/icons/user-pictures/100/male3-128.png",
        "https://cdn2.iconfinder.com/data/icons/avatars-60/5985/4-Writer-128.png",
        "https://cdn2.iconfinder.com/data/icons/avatars-60/5985/9-Student-128.png"
    ];

    const handleRegister = () => {
        let d = registerData;
        if (d.pass == d.pass2 && d.userName.length > 1 && d.avatar) {
            setLoded(true);
            register({
                req: "register",
                userName: d.userName,
                email: d.email,
                pass: d.pass,
                avatar: d.avatar,
                ip: getMachineId(),
            }).then(data => setData(data));
        }else{
            alert("Bitte alle felder richtig ausfühlen...");
        }
    }

    function getMachineId() {
        let machineId = localStorage.getItem('MachineId');
        if (!machineId) {
            machineId = crypto.randomUUID();
            localStorage.setItem('MachineId', machineId);
        }
        return machineId;
    }

    useEffect(()=>{
        setRegisterData({...registerData, userName: ""})
        if (data == "successfully") {
            setLoded(false);
            let copy = {...registerData};
            Object.keys(copy).map( key => copy[key] = "" );
            setRegisterData(copy);
            document.getElementById("reg-mesg").innerHTML = "1- Sie haben erfolgreich ein neues Konto registriert. <br /><br /> 2- Bitte warten sie auf die Bestätigung von der Arbeitgeber, um sich später anmelden zu können.";
        }
    },[data]);

    function changeAvatar(index) {
        let avatar = avatars[index];
        setRegisterData({...registerData, avatar: avatar });
        setShowAvatars(false);
    }

    return (
        <div className="loginPageContainer flex justify-center">

            <div className='loginformContainer rounded-lg'>

                    <div className='loginFormHeader w-full h-14 flex items-center justify-between px-4'>
                        <img src={Logo} id="avatar-reg" alt="Logo" className='ditschLogo h-4/6' />
                        <p className='text-white'> { registery ? "Register" : "LogIn" } </p>
                    </div>

                {   registery 
                    ?
                    <div className='LoginBody w-full h-full p-4 pt-6'>

                        <Box component="form" noValidate autoComplete="off"  className='w-full'>

                            {
                                showAvatars 
                                ?
                                    <div className='w-full flex justify-center py-6 flex-wrap'>
                                        { avatars.map((avatar, i) => <img key={'avatar'+i} className='sm:h-20 h-16 m-2 cursor-pointer' src={avatar} alt="avatar" onClick={()=>changeAvatar(i)} />) }
                                    </div>
                                :
                                <div className='w-full flex justify-center py-6' onClick={()=> setShowAvatars(true)}>
                                    <img className='h-32 cursor-pointer' src={registerData.avatar || "https://cdn4.iconfinder.com/data/icons/office-thick-outline/36/office-14-128.png"} alt="avatar"  />
                                </div>
                            }

                            <TextField label="Name" variant="outlined" className='w-full !mb-6' value={registerData.userName} onChange={(e)=>{ setRegisterData({...registerData, userName: e.target.value}) }}/>
                            <TextField label="Email" variant="outlined" className='w-full !mb-6' type={"email"} value={registerData.email} onChange={(e)=>{ setRegisterData({...registerData, email: e.target.value}) }}/>
                            <TextField label="Password" variant="outlined" className='!mb-6 !w-full' type='password' value={registerData.pass} onChange={(e)=>{ setRegisterData({...registerData, pass: e.target.value}) }} />
                            <TextField label="Password wiederholen" variant="outlined" className='!mb-6 !w-full' type='password' value={registerData.pass2} onChange={(e)=>{ setRegisterData({...registerData, pass2: e.target.value}) }} />
                            <Button variant="contained" className='!w-full h-14 btn' onClick={handleRegister}>
                                { loded ? <CircularProgress className='prog' /> : <span>Register</span> }
                            </Button>
                            <p className='mt-6 p-2 text-lg text-main font-bold' id="reg-mesg"></p>
                        </Box>

                    </div>
                    :
                    <div className='LoginBody w-full h-full p-4 pt-6'>
                        <Box component="form" noValidate autoComplete="off"  className='w-full'>
                            <TextField label="Name" variant="outlined" className='w-full !mb-6' value={userName} onChange={(e)=>{ setUserName(e.target.value) }}/>
                            <TextField label="Password" variant="outlined" className='!mb-6 !w-full' type='password' value={pass} onChange={(e)=>{ setPass(e.target.value) }} />
                            <Button variant="contained" className='!w-full h-14 btn' onClick={()=> {handelLogIn(userName , pass); setLoded(true)}}>
                                { props.loading ? <CircularProgress className='prog' /> : <span>Login</span> }
                            </Button>
                            <div className='w-full text-center mt-6 cursor-pointer' onClick={()=> setRegister(true)}> <p className='underline'>register</p> </div>
                        </Box>
                    </div>
                }

            </div>
        </div>
    );
}

export default Login;