import './home.css';
import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
// components
import MainHeader from '../../components/mainHeader/MainHeader';
// MUI
import useFetch from '../../hooks/useFetch';
import mainContext from '../../contextApi/main';
// apis
import { getUserData, getAllUHRInMonth, getOverTime, copmlatedTask } from '../../services/mainService.js';


const Home = () => {
    const today = new Date();
    const [ userName, setUserName ] = useState("Omar");
    const [ todayDate, setTodayDate ] = useState(`${today.getDate()}-${today.getMonth() + 1}-${today.getFullYear()}`);

    useEffect(()=>{
        let userData; 
        try{ userData = localStorage.getItem('userData') && JSON.parse(localStorage.getItem('userData')) }
        finally{ setUserName(userData.userName) }
    },[]);


    return (
        <div className="homepageContaine  w-full min-h-screen ">
            <MainHeader />

            <div className="homepagebody page mx-auto">

                <div className='home-body-head p-5 flex justify-between items-center'>
                    <div>
                        <p className='font-bold text-3xl text-main titlefont'> { userName && 'Hallo ' + userName + '!' } </p>
                        <p className='text-xs text-second'> { todayDate } </p>
                    </div>
                    
                    <Link to={'/online'}><div className='noti-container shadow-lg p-2 rounded-lg'>
                        <svg width="20" height="20" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#a2271c" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M7 6a7.75 7.75 0 1 0 10 0" /><line x1="12" y1="4" x2="12" y2="12" /></svg>
                    </div></Link>
                </div>

                <div className='home-body p-5 pt-0'>
                    <EmployeesDashbordCards />
                    {/* <TasksSection /> */}
                    <AppsSection />
                </div>
            </div>
        </div>
    );
}

export default Home;


















//////////////// Site Sections ////////////////

function EmployeesDashbordCards(props){
    const [ data, setData ] = useState();
    const [ stdInMonat , setstdInMonat ] = useState(0); 
    const [ minutsInMonat , setMinutsInMonat ] = useState(0); 
    const [ total, setTotal ] = useState(0);
    const [ std_euro, setStd_euro ] = useState(0);
    const [ buy, setBuy ] = useState(0);
    const [ overTime, setOverTimes ] = useState(0);

    useEffect(()=>{
        getSTDinMonate();
    },[]);

    useEffect(()=>{
        if (data && data.total != 'null') {
            let uhrs = data.total &&  Math.floor(data.total);
            let minute = Math.round((data.total - uhrs) * 60);
            uhrs && setstdInMonat(uhrs);
            minute && setMinutsInMonat(minute);
            setTotal(data.total);
        }else{
            setstdInMonat(0);
        }
    },[data]);

    useEffect(()=>{
        if (std_euro && total || overTime) {
            let result,
                number = (total + overTime || 0) * std_euro;
            if (number.toString().split(".")[1]) {
                var firstTwoAfterDot = parseInt(number.toString().split(".")[1].substr(0, 2));
                result = parseFloat(number.toString().split(".")[0] + "." + firstTwoAfterDot);
            }else{
                result = number;
            }
            setBuy(result);
        } 
    },[std_euro, total, overTime]);

    const getSTDinMonate = () => {
        let userData;
        try {
            userData = localStorage.getItem('userData') && (JSON.parse(localStorage.getItem('userData')));
        }
        finally{
            getAllUHRInMonth(userData.id).then(data => {
                setData(data);
            });

            getUserData(userData.id).then(data => {
                data && localStorage.setItem('userData' , JSON.stringify(data));
                setStd_euro(data.euro_std);
            });
            getOverTime(userData.id).then(data => {
                setOverTimes(data.totalOverTime);
            });
        }
    }




    return(
        <div className='w-full'>
            <Card title="Diesem Monate" tow={true} info={stdInMonat} Unit="std" info2={minutsInMonat} Unit2="min" icon={<svg className='mr-2' width="20" height="20" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#fff" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M11.795 21h-6.795a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v4" /><circle cx="18" cy="18" r="4" /><path d="M15 3v4" /><path d="M7 3v4" /><path d="M3 11h16" /><path d="M18 16.496v1.504l1 1" /></svg>} />
            <div className=' home-cards-body grid w-full mt-4'>
                <Card title="Über Stunden" info={overTime} Unit="std" icon={<svg className='mr-2' width="20" height="20" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#fff" fill="none" strokeLinecap="round" strokeLinejoin="round"> <path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 4h-6a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h8" /><path d="M18 20v-17" /><path d="M15 6l3 -3l3 3" /></svg>} />
                <Card title="Auszahlungen" info={buy} Unit="Euro" icon={<svg className='mr-2' width="20" height="20" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#fff" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M17.2 7a6 7 0 1 0 0 10" /><path d="M13 10h-8m0 4h8" /></svg>} />
            </div>
        </div>
    )
}

function TasksSection(props) {
    
    const { data, loading, error, getData } = useFetch();
    const [ tasks, setTasks ] = useState([]);

    useEffect(()=>{
        getTasks();
    },[]);

    useEffect(()=>{
        setTasks(data.slice(0, 1));
        data.length <= 0 ? document.getElementById("tasks-container").style.display = "none" : document.getElementById("tasks-container").style.display = "block";
    },[data]);

    const getTasks = () => {
        let userData;
        try{
            userData = localStorage.getItem('userData') && JSON.parse(localStorage.getItem('userData'));
            getData('https://apiditsch.oderasid.com/?req=gettasks&userID='+userData.id);
        }catch{
            window.alert('Beim Abrufen der täglichen Aufgaben ist ein Problem aufgetreten');
        }
    }


    return(
        <div className='tasks-list-container w-full mt-8' id="tasks-container">

            <Link to={'/tasks'}> <div className='w-full flex justify-between'>
                <p className='tasksTitle text-xl text-main font-bold'>Aufgaben</p>
                <svg className='' width="20" height="20" viewBox="0 0 24 24" strokeWidth="2" stroke="#a2271c" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M3.5 5.5l1.5 1.5l2.5 -2.5" /><path d="M3.5 11.5l1.5 1.5l2.5 -2.5" /><path d="M3.5 17.5l1.5 1.5l2.5 -2.5" /><line x1="11" y1="6" x2="20" y2="6" /><line x1="11" y1="12" x2="20" y2="12" /><line x1="11" y1="18" x2="20" y2="18" /></svg>
            </div> </Link>

            <div className='w-ful mt-2'>
                { tasks && tasks.map((task, index) => <div key={'taskItem'+index}><TaskCard date={ task.end } title={ task.title } desc={ task.description } id={task.id}  callback={getTasks}/></div>) }
            </div>

            {
                data && data.length > 1 &&
                <div className='w-max m-auto mt-4'>
                    <Link to={'/tasks'}><p className='text-sm text-main font-bold underline'>Alle Anzeigen</p></Link>
                </div>
            }

        </div>
    )
}

function AppsSection(props) {
    const contx = useContext(mainContext);
    const [ roles, setRole ] = useState([]);
    const apps = {
        'a': <AppCard title="Inventar" routeName="/inventar" icon={<svg width="38" height="38" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#fff" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M9 5h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2h-2" /><rect x="9" y="3" width="6" height="4" rx="2" /><path d="M14 11h-2.5a1.5 1.5 0 0 0 0 3h1a1.5 1.5 0 0 1 0 3h-2.5" /><path d="M12 17v1m0 -8v1" /></svg>} />,
        'b': <AppCard title="Reinigung" routeName="/reinigung" icon={ <svg width="38" height="38" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#fff" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><rect x="5" y="3" width="14" height="6" rx="2" /><path d="M19 6h1a2 2 0 0 1 2 2a5 5 0 0 1 -5 5l-5 0v2" /><rect x="10" y="15" width="4" height="6" rx="1" /></svg> } />,
        'c': <AppCard title="Lager" routeName="/Lager" icon={ <svg width="38" height="38" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#fff" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M3 21v-13l9 -4l9 4v13" /><path d="M13 13h4v8h-10v-6h6" /><path d="M13 21v-9a1 1 0 0 0 -1 -1h-2a1 1 0 0 0 -1 1v3" /></svg> } />,
        'd': <AppCard title="Bruch" routeName="/bruch" icon={ <svg width="38" height="38" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#fff" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><line x1="4" y1="7" x2="20" y2="7" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" /><path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" /><path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" /></svg> } />,
        'e': <AppCard title="Lieferschein" routeName="/lieferschein" icon={ <svg width="38" height="38" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#fff" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><circle cx="7" cy="17" r="2" /><circle cx="17" cy="17" r="2" /><path d="M5 17h-2v-4m-1 -8h11v12m-4 0h6m4 0h2v-6h-8m0 -5h5l3 5" /><line x1="3" y1="9" x2="7" y2="9" /></svg> } />,
        'v': <AppCard title="Verkauf" routeName="/verkauf" icon={ <svg width="38" height="38" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#fff" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><line x1="3" y1="21" x2="21" y2="21" /><path d="M3 7v1a3 3 0 0 0 6 0v-1m0 1a3 3 0 0 0 6 0v-1m0 1a3 3 0 0 0 6 0v-1h-18l2 -4h14l2 4" /><line x1="5" y1="21" x2="5" y2="10.85" /><line x1="19" y1="21" x2="19" y2="10.85" /><path d="M9 21v-4a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v4" /></svg> } />,
        't': <AppCard title="Theke" routeName="/theke" icon={ <svg width="38" height="38" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#fff" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M13 5h8" /><path d="M13 9h5" /><path d="M13 15h8" /><path d="M13 19h5" /><rect x="3" y="4" width="6" height="6" rx="1" /><rect x="3" y="14" width="6" height="6" rx="1" /></svg> } />,
        'lk': <AppCard title="Lierferung" routeName="/lieferungskamera" icon={ <svg width="38" height="38" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#fff" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><circle cx="12" cy="13" r="3" /><path d="M5 7h2a2 2 0 0 0 2 -2a1 1 0 0 1 1 -1h2m9 7v7a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-9a2 2 0 0 1 2 -2" /><line x1="15" y1="6" x2="21" y2="6" /><line x1="18" y1="3" x2="18" y2="9" /></svg> } /> 
    }

    useEffect(()=>{
        let roles = contx.data.user.role;
        roles && setRole(roles.split('-'));
    },[contx]);
    

    return(
        <div className='home-apps mt-8'>
            <div className='w-full flex justify-between mb-2'>
                <p className='tasksTitle text-xl text-main font-bold'>Actions</p>
                <svg width="20" height="20" viewBox="0 0 24 24" strokeWidth="2" stroke="#a2271c" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><rect x="4" y="4" width="6" height="6" rx="1" /><rect x="4" y="14" width="6" height="6" rx="1" /><rect x="14" y="14" width="6" height="6" rx="1" /><line x1="14" y1="7" x2="20" y2="7" /><line x1="17" y1="4" x2="17" y2="10" /></svg>
            </div>

            <div className='apps-home-cards-container grid grid-cols-2 gap-3'>
                { roles && roles.map((item,index) => item  && item != " " && <div key={'appcard-'+index}> { apps[item] } </div> )}
            </div>
            
        </div>
    )
}












//////////////// components ////////////////

function Card(props) {

    return (
        <div className='homepage-card shadow-lg p-3 py-5 w-full rounded-md home-card flex flex-col '>
            <div className='flex mb-4'>
                {props.icon}
                <span className='text-white font-bold text-sm'> {props.title} </span>
            </div>
            <div className='flex items-center'>
                <p className='text-white text-xl'>{props.info}<span className='text-xs'> {props.Unit} </span></p>
                { props.tow && <p className='text-white text-xl !ml-3'>{props.info2}<span className='text-xs'> {props.Unit2} </span></p> }
            </div>
        </div>
    )
}

export function TaskCard(props) {
    const { data, loading, error, postData } = useFetch();

    const copmlatedHandler = (id) => {
        const complated = window.confirm('Haben Sie Diese Aufgabe erledigt?');
        complated && copmlatedTask({ taskID: id }).then();
    }

    useEffect(()=>{
        data == 'Updated Successfully' && setTimeout(() => props.callback(), 800);
    },[data]);

    return (
        <div className='task-card-container w-full h-max rounded-md mb-3 bg-second ' onClick={()=> copmlatedHandler(props.id)}>

            <div className='task-head w-full px-5 py-4 flex justify-between items-center bg-main rounded-md'>
                <p className='font-semibold text-white'> {props.title} </p>
                <p className='text-sm text-white'> {props.date} </p>
            </div>

            <div  className='p-5 py-4'>
                <p className='text-sm text-white'> { props.desc } </p>
            </div>

        </div>
    )
}

function AppCard(props) {
    
    return(
        <Link to={props.routeName}>
            <div className='app-home-card flex justify-center items-center flex-col h-32 rounded-md bg-main'>
                <div className='mb-2'>
                    { props.icon }
                </div>
                <p className='App-title text-white'> { props.title } </p>
            </div>
        </Link>
    )
}

