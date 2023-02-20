import { useState, useEffect } from "react";
// compontens
import MainHeader from "../../components/mainHeader/MainHeader";
import { TaskCard } from "../Home/home";
// useFetch
import useFetch from "../../hooks/useFetch";

const Tasks = () => {

    const { data, loading, error, getData } = useFetch();
    const [ tasks, setTasks ] = useState([]);


    useEffect(()=>{
        getTasks();
    },[]);

    useEffect(()=>{
        data.length && setTasks(data);
    },[data]);

    const getTasks = () => {
        let userData;
        try{
            userData = localStorage.getItem('userData') && JSON.parse(localStorage.getItem('userData'));
            getData('https://apiditsch.oderasid.com?req=gettasks&userID='+userData.id);
        }catch{
            window.alert('Beim Abrufen der täglichen Aufgaben ist ein Problem aufgetreten');
        }
    }

    return (
        <div className="w-full">
            <div className="page m-auto">
                <MainHeader />

                <div className="p-5">
                    { tasks && tasks.map((task, index) => <div key={'taskItem'+index}><TaskCard date={ task.end } title={ task.title } desc={ task.description } id={task.id} callback={getTasks} /></div>) }
                </div>
            </div>
        </div>
    );
}

export default Tasks;