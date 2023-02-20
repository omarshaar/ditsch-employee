import React, { createContext, useEffect, useState } from 'react';
import useFetch from '../hooks/useFetch';

const mainContext = createContext();


export const MainProvider = ({children}) => {
    const { data, loading, error, getData, getDataPro, reFetch } = useFetch("https://apiditsch.oderasid.com?req=allArticle");

    const [state, setState] = useState({
        data: {
            articels: data,
            user: {},
            toClean: {}
        }
    });

    useEffect(()=>{
        getUserRoles();
        //getToClean();
    },[]);

    useEffect(()=>{
        state.data.articels = data;
        setState({...state});
    },[loading]);


    function getUserRoles() {
        //##
        let userData = localStorage.getItem('userData');
        if(!userData) return;
        let id = (JSON.parse(userData)).id ;
        getDataPro('https://apiditsch.oderasid.com?req=getUserRoles&userID='+id).then(data =>{
            state.data.user = data;
            setState({...state});
        });
    }

    function getToClean() {
        getDataPro('https://apiditsch.oderasid.com/?req=getToClean').then(data =>{
            state.data.toClean = data;
            setState({...state});
        });
    }

    
    return (
        <mainContext.Provider value={state}>
            { children }
        </mainContext.Provider>
    );
}


export default mainContext;