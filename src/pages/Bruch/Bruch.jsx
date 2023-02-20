import { useContext, useEffect, useState } from "react";
import MainHeader from "../../components/mainHeader/MainHeader";
import mainContext from "../../contextApi/main";
// MUI
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
// MUI DatePicker
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// components
import Alert from "../../components/alert/Alert";
// api
import { AddBruch } from "../../services/mainService";

const Bruch = () => {
    const [ date, setDate ] = useState(null);
    const [item, setItem] = useState('');
    const [unit, setUnit] = useState('Einzeln');
    const [ menge , setMenge ] = useState('');
    const [ allAddedArtikel , setAllAddedArtikel ] = useState([]);
    const [ ArticlesList , setArticlesList ] = useState(allAddedArtikel);
    const [ data, setData ] = useState({});
    const [ loading, setLoading ] = useState(false);
    const [ showAlert, setshowAlert ] = useState(false);
    const [ alertMessage, setAlertMessage ] = useState('Die Hinzufügung wurde erfolgreich abgeschlossen.');

    const Context = useContext(mainContext);
    const articels = Context.data.articels;

    const roleID = 'd';
    const [ isRole, setIsRole ] = useState(false);
    useEffect(()=>{
        let roles = Context.data.user.role && (Context.data.user.role).split('-');
        roles && roles.forEach(role => role == roleID && setIsRole(true));
    },[Context]);

    useEffect(()=>{
        setArticlesList(allAddedArtikel);
    },[allAddedArtikel]);

    const randomID = () => {
        return Math.floor(Math.random() * 1000100000010009) + 1;
    }

    const handelChange = (event, setStateValue) => {
        const value = event.target.value;
        setStateValue(value);
    }

    const addArticleHandler = () => {
        if(!menge){return}
        // get articel by numbner from articels array
        const articel_Detailes = articels.filter( element => element.number == item )[0];
        let articleIsset = ArticlesList.filter( item => item.number == articel_Detailes.number);

        if (articleIsset.length > 0) {
            articleIsset[0].amount = parseInt(articleIsset[0].amount) + parseInt(menge);
            setAllAddedArtikel([...ArticlesList]);
        }else{
            const article_Object = {
                id: randomID(),
                number: articel_Detailes.number,
                title: articel_Detailes.title,
                unit: unit,
                amount: menge,
            }
    
            Object.keys(article_Object).every( (k) => article_Object[k] ) && setAllAddedArtikel([...ArticlesList, article_Object]);
        }
        
        // reset menge
        setMenge('');
    }

    const deleteAddedArtikel = (id) =>{
        if (!window.confirm('Sicher?')) { return }
        let itemInfo;
        allAddedArtikel.map((item, index) =>{
            if(item.id == id) {
                allAddedArtikel.splice(index , 1);
                itemInfo = item
            }
        });
        setAllAddedArtikel([...allAddedArtikel]);
    }

    const applayHandle = () => {
        let authorData;
        try{
            authorData = localStorage.getItem('userData') && (JSON.parse( localStorage.getItem('userData') ));
        }finally{
            if(window.confirm('Sind Sie Sicher?')){ 
                setLoading(true);
                AddBruch({
                    req: "AddBruch",
                    articels: ArticlesList, 
                    length: ArticlesList.length, 
                    date: formatDate(date),
                    authorID: authorData.id,
                    authorName: authorData.userName
                }).then(data => {
                    setData(data);
                    setLoading(false);
                });
            }
        }
    }

    useEffect(()=>{
        if (data[0]) {
            if (data.includes('Updated Successfully')) {
                setAllAddedArtikel([]);
                setshowAlert(true);
                setTimeout(() => setshowAlert(false), 4000);
            }
        }
    },[data]);

    // Date Formater
    function formatDate(date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2) 
            month = '0' + month;
        if (day.length < 2) 
            day = '0' + day;

        return [year, month, day].join('-');
    }













    if (!isRole) return;
    return (
        <div className="w-full min-h-screen ">
            <MainHeader />
            <Alert show={showAlert} msg={alertMessage} />

            <div className="w-full p-5 page m-auto">


                <div className="w-full mb-4">
                    <p className="text-main text-2xl font-bold">Bruch</p>
                </div>

                <div className="w-full mb-4">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            className="w-full"
                            label="Datum"
                            value={date}
                            onChange={v => setDate(v)}
                            renderInput={(params) => <TextField {...params} />}
                        />
                    </LocalizationProvider>
                </div>

                <div className="flex flex-col justify-between mb-4">
                    <p className="text-main font-bold">Artikel</p>
                    <Select className="w-full" id="selectItemArtikel" value={item} onChange={(e)=> handelChange(e, setItem)} >
                        { articels && articels.map( item => <MenuItem key={'arti'+item.id} value={item.number}> <b>{item.number}</b>&nbsp;||&nbsp;{ item.title } </MenuItem> ) }
                    </Select>
                </div>

                <div className="flex flex-col justify-between mb-5">
                    <p className="text-main font-bold">Menge</p>
                    <TextField
                        type="number"
                        placeholder="0"
                        value={menge}
                        onChange={(e)=> handelChange(e, setMenge)}
                    />
                </div>

                <Button variant="contained" className='!w-full h-14 btn' onClick={addArticleHandler} >
                    <span>einfügen</span>
                    <svg className="ml-1" width="22" height="22" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#fff" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><rect x="4" y="4" width="16" height="16" rx="2" /><line x1="9" y1="12" x2="15" y2="12" /><line x1="12" y1="9" x2="12" y2="15" /></svg>
                </Button>



                {
                    loading && <div className="fixed w-full h-full flex justify-center items-center top-0 left-0 z-10 black-op7 text-white">
                        <span className="text-lg">
                            Warten Sie kurz...
                        </span>
                    </div>
                }

                <div className="flex flex-col-reverse w-full mt-5" >
                    { ArticlesList && ArticlesList.map( (item, index) => <div className="w-full h-max" key={"kodff3f"+index}><AddedArtikel deleteAddedArtikel={()=> deleteAddedArtikel(item.id)} title={item.title} number={item.number} unit={item.unit} amount={item.amount} /></div> ) }
                </div>


                <div className="mt-3">
                    { ArticlesList.length > 0 && 
                    <Button variant="contained" className='!w-full h-14 btn' onClick={applayHandle} >
                        <span>Übernehmen</span>
                        <svg className="ml-1" width="22" height="22" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#fff" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M9 4h6a2 2 0 0 1 2 2v14l-5 -3l-5 3v-14a2 2 0 0 1 2 -2" /></svg>
                    </Button>}
                </div>
            </div>

            
        </div>
    );
}

export default Bruch;






















function AddedArtikel(props) {

    return(
        <div key={props.k} className="added-item p-5 py-3 bg-white flex justify-between items-center mb-2" >

            <div className="w-full">
                <p className="font-bold text-main"> {props.title} | {props.number} </p>
                <p className="text-sm text-second"> { `${props.amount} ${props.unit}` } </p>
            </div>

            <button className="p-2 bg-main rounded-md" onClick={props.deleteAddedArtikel}>
                <svg className="" width="16" height="16" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#fff" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><line x1="4" y1="7" x2="20" y2="7" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" /><path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" /><path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" /></svg>
            </button>

        </div>
    );

}
