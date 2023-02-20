import { useContext, useEffect, useState } from "react";
import MainHeader from "../../components/mainHeader/MainHeader";
import mainContext from "../../contextApi/main";
// MUI
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';


const Inventar = () => {
    const roleID = 'a';
    const [ isRole, setIsRole ] = useState(false);
    const [item, setItem] = useState('');
    const [unit, setUnit] = useState('');
    const [ menge , setMenge ] = useState('');
    const [ sortByUnit , setSortByUnit ] = useState('');
    const [ sortByArtikel , setSortByArtikel ] = useState('');
    const [ allAddedArtikel , setAllAddedArtikel ] = useState([]);
    const [ ArticlesList , setArticlesList ] = useState(allAddedArtikel);
    const [ fillters , setFilters ] = useState([]);
    const [ summe, setSumme ] = useState([]);
    const [ showSumme, setShowSumme ] = useState(false);
    const [ start, setStart ] = useState(true);

    const Context = useContext(mainContext);
    const articels = Context.data.articels;

    const einheiten = [
        {
            "id": 0,
            "unit": "Kartons",
            "value": "karton"
        },{
            "id": 1,
            "unit": "Tüte",
            "value": "Tüte"
        },{
            "id": 2,
            "unit": "Einzeln",
            "value": "Einzeln"
        }
    ];

    useEffect(()=>{
        setTimeout(() => {
            const addedItems = localStorage.getItem('addedItems') && localStorage.getItem('addedItems');
            const summeItems = localStorage.getItem('summeItems') && localStorage.getItem('summeItems');
            addedItems && setAllAddedArtikel( JSON.parse( addedItems ) );
            summeItems && setSumme( JSON.parse( summeItems ) );
        }, 50);
    },[]);

    useEffect(()=>{
        let roles = Context.data.user.role && (Context.data.user.role).split('-');
        roles && roles.forEach(role => role == roleID && setIsRole(true));
    },[Context]);

    useEffect(()=>{
        setArticlesList(allAddedArtikel);
        sortBy_Halndler();
    },[allAddedArtikel]);

    useEffect(()=>{
        saveInlocalStorage(allAddedArtikel);
    },[allAddedArtikel, summe])

    useEffect(()=> 
        sortBy_Halndler() , [sortByArtikel, sortByUnit]
    );

    useEffect(()=>{
        createAllArtikelSumeList();
    },[articels]);

    const createAllArtikelSumeList = () => {
        articels.forEach( item => {
            summe.push({
                id: item.id,
                number: item.number,
                title: item.title,
                piecesInBag: item.piecesInBag,
                bagInCarton: item.bagInCarton,
                karton: 0,
                Tüte: 0,
                Einzeln: 0,
                sum: 0
            });
        })
        setSumme(summe);
    }

    const randomID = () => {
        return Math.floor(Math.random() * 100000000000000) + 1;
    }

    const handelChange = (event, setStateValue) => {
        const value = event.target.value;
        setStateValue(value);
    }

    const handelFilterChange = (event, setStateValue, keyName, stateValue ) =>{
        const value = event.target.value;
        setStateValue(value);

        const obj = { key: keyName, value: value, stateValue: stateValue }
        const filtersLength = fillters.length;


        // if filter (all) selected
        if (value == 'all') { 
            if(filtersLength <= 0) return;
            for (let index = 0; index < fillters.length; index++){
                if (fillters[index].key == keyName) {
                    fillters.splice(index, 1);
                    setFilters([...fillters]);
                }
            }    
            return
        }


        // if no filterts
        if (filtersLength <= 0){ setFilters([...fillters, obj]); return}

        // if any filter
        for (let index = 0; index < fillters.length; index++) {
            // if filter isset
            if (fillters[index].key == keyName) {
                fillters[index].value = value;
                setFilters([...fillters]);
                return
            } else setFilters([...fillters, obj]);
        }
    }

    const addArticleHandler = () => {
        if(!menge){return}
        // get articel by numbner from articels array
        const articel_Detailes = articels.filter( element => element.number == item )[0];

        const article_Object = {
            id: randomID(),
            number: articel_Detailes.number,
            title: articel_Detailes.title,
            unit: unit,
            amount: menge,
            piecesInBag: articel_Detailes.piecesInBag,
            bagInCarton: articel_Detailes.bagInCarton
        }

        Object.keys(article_Object).every( (k) => article_Object[k] ) && setAllAddedArtikel([...ArticlesList, article_Object]);

        // reset menge
        setMenge('');

        // add to the total 
        !isNaN(menge) && handleSum(articel_Detailes, unit, menge);
    }

    const sortBy_Halndler = () => {
        // filterd array
        var filterd = allAddedArtikel;
        if (fillters.length <= 0) { setArticlesList([...allAddedArtikel]); return }

        fillters.forEach(filter => {
            if (filter['stateValue'] == 'sortByArtikel') {
                filterd = filterd.filter( item => item[filter['key']] == sortByArtikel )
            } 
            else{
                filterd = filterd.filter( item => item[filter['key']] == sortByUnit );
            }
        });
        setArticlesList([...filterd]);
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
        // delete from summe
        handleSub(itemInfo.number, itemInfo.unit, itemInfo.amount);
    }

    const handleSum = (articel, unit, menge) => {
        let targetElement = summe.find( item => item.id == articel.id );
        console.log(targetElement);
        targetElement[unit] = parseInt(targetElement[unit]) + parseInt(menge);
        let bagsInPieces = targetElement['Tüte'] * targetElement['piecesInBag'];
        let kartonInPieces = targetElement['karton'] * ( targetElement['bagInCarton'] * targetElement['piecesInBag'] )
        let pieces = targetElement['Einzeln']
        targetElement.sum = bagsInPieces + kartonInPieces + pieces;
        setSumme(summe);
    }

    const handleSub = (number, unit, menge) => {
        let targetElement = summe.find( item => item.number == number );
        console.log(targetElement);
        targetElement[unit] = parseInt(targetElement[unit]) - parseInt(menge);


        let bagsInPieces = targetElement['Tüte'] * targetElement['piecesInBag'];
        let kartonInPieces = targetElement['karton'] * ( targetElement['bagInCarton'] * targetElement['piecesInBag'] )
        let pieces = targetElement['Einzeln']
        targetElement.sum = bagsInPieces + kartonInPieces + pieces;

        setSumme(summe);
    }

    const saveInlocalStorage = (items) =>{
        if (items.length <= 0 && start) { return }
        localStorage.setItem('addedItems', JSON.stringify(items));
        summe[0] && localStorage.setItem('summeItems', JSON.stringify(summe));
        setStart(false);
    }

    if (!isRole) {
        return;
    }















    return (
        <div className="w-full min-h-screen ">
            <MainHeader />

            <div className="w-full p-5 page m-auto">

                <div className="flex flex-col justify-between mb-4">
                    <p className="text-main font-bold">Artikel</p>
                    <Select className="w-full" id="selectItemArtikel" value={item} onChange={(e)=> handelChange(e, setItem)} >
                        { articels && articels.map( item => <MenuItem key={'arti'+item.id} value={item.number}> <b>{item.number}</b>&nbsp;||&nbsp;{ item.title } </MenuItem> ) }
                    </Select>
                </div>

                <div className="flex flex-col justify-between mb-4">
                    <p className="text-main font-bold">Einheit</p>
                    <Select className="w-full" id="selectItemUnit" value={unit} onChange={(e)=> handelChange(e, setUnit)} >
                        { einheiten.map( (item, index) => <MenuItem key={`selectItem2${index}`} value={item.value}> { item.unit } </MenuItem> ) }
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
                </Button>





                <div className="w-full mt-5">

                    <div className="w-full mb-4">
                        <div className="w-full flex justify-between items-center mb-3">
                            <p className="text-main font-bold ">Hinzugefügte Artikel</p>
                            <button className="p-2 bg-main rounded-md" onClick={() => setShowSumme(!showSumme)}>
                                <svg className="" width="16" height="16" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#fff" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><rect x="4" y="3" width="16" height="18" rx="2" /><rect x="8" y="7" width="8" height="3" rx="1" /><line x1="8" y1="14" x2="8" y2="14.01" /><line x1="12" y1="14" x2="12" y2="14.01" /><line x1="16" y1="14" x2="16" y2="14.01" /><line x1="8" y1="17" x2="8" y2="17.01" /><line x1="12" y1="17" x2="12" y2="17.01" /><line x1="16" y1="17" x2="16" y2="17.01" /></svg>
                            </button>
                        </div>

                        { !showSumme &&
                            <div className="w-full mb-2 flex justify-between">

                                <FormControl sx={{marginRight: 1, width: "100%" }} size="small" >
                                    <Select className="w-full" id="selectItemSortByArtikel" value={sortByArtikel} onChange={(e)=> handelFilterChange(e, setSortByArtikel, 'number', 'sortByArtikel') } >
                                        <MenuItem value={"all"}> all </MenuItem>
                                        { articels && articels.map( item => <MenuItem key={'arti'+item.id} value={item.number}> <b>{item.number}</b>&nbsp;||&nbsp;{ item.title } </MenuItem> ) }
                                    </Select>
                                </FormControl>

                                <FormControl sx={{ width: "100%" }} size="small">
                                    <Select label="Sortieren" className="w-full" id="selectItemSortByUnit" value={sortByUnit} onChange={ (e)=> handelFilterChange(e, setSortByUnit,'unit', 'sortByUnit') }>
                                        <MenuItem value={"all"}> all </MenuItem>
                                        { einheiten.map( (item, index) => <MenuItem key={`CFWAAX${index}`} value={item.value}> { item.unit } </MenuItem> ) }
                                    </Select>
                                </FormControl>

                            </div>
                        }
                        
                    </div>

                    <div className={ showSumme ? "hidden" : "flex flex-col-reverse w-full" }>
                        { ArticlesList && ArticlesList.map( (item, index) => <div className="w-full h-max" key={"kodff3f"+index}><AddedArtikel deleteAddedArtikel={()=> deleteAddedArtikel(item.id)} title={item.title} number={item.number} unit={item.unit} amount={item.amount} /></div> ) }
                    </div>

                    <div className={ showSumme ? "w-full" : "hidden"}>
                        { summe && summe.map( (item, index) => <div key={'gtqwp'+index}><ArtikelDetails title={item.title} number={item.number} karton={item.karton} bag={item.Tüte} einzeln={item.Einzeln} summe={item.sum} /></div> ) } 
                    </div>
                    
                </div>
            </div>

            
        </div>
    );
}

export default Inventar;






















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




function ArtikelDetails(props) {

    return(
        <div className="added-item p-5 py-3 bg-white mb-2" >

            <div className="w-full">
                <p className="font-bold text-main mb-3"> {props.title} | {props.number} </p>
                <p className="text-sm text-second"> Karton: { `${props.karton}` } </p>
                <p className="text-sm text-second"> Tüte: { `${props.bag}` } </p>
                <p className="text-sm text-second"> Einzeln {`${props.einzeln}` } </p>

                <p className="text-second mt-2 font-bold">Summe: {`${props.summe}`} </p>
            </div>


        </div>
    );

}