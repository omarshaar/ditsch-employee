import { useContext, useEffect, useState } from "react";
import MainHeader from "../../components/mainHeader/MainHeader";
import mainContext from "../../contextApi/main";
// MUI
import Button from '@mui/material/Button';

const Lager = () => {
    const Context = useContext(mainContext);
    const articels = Context.data.articels;

    const kartonCalc = (item) => {
        let karton = parseInt(item.sum / (item.piecesInBag * item.bagInCarton));
        return karton;
    }
    
    const roleID = 'b';
    const [ isRole, setIsRole ] = useState(false);
    useEffect(()=>{
        let roles = Context.data.user.role && (Context.data.user.role).split('-');
        roles && roles.forEach(role => role == roleID && setIsRole(true));
    },[Context]);


    
    if (!isRole) return;
    return (
        <div className="w-full">
            <MainHeader />

            <div className="p-5 page m-auto">
                { articels.map( (item, index) => <div key={'hjpp'+index}><Artikel title={item.title} number={item.number} summe={item.sum} karton={kartonCalc(item)} /></div> ) }
            </div>
        </div>
    );
}

export default Lager;





function Artikel(props) {

    return(
        <div className="added-item p-5 py-3 bg-white mb-2" >

            <div className="w-full">
                <p className="font-bold text-main mb-3"> {props.title} | {props.number} </p>
                <p className="text-sm text-second"> Karton: { `${props.karton}` } </p>
                <p className="text-second mt-2 font-bold">Summe: {`${props.summe}`} </p>
            </div>


        </div>
    );

}