import { useEffect, useState } from "react";

const Alert = (props) => {
    const show = props.show

    return (
        <div  className={show ? "block w-max h-max" : "hidden w-max h-max"} >
            <div className="fixed w-11/12 max-w-md top-5 left-2/4 -translate-x-2/4 p-6 py-9 bg-white shadow-lg z-40 rounded-md">
                <p className="text-main font-semibold"> {props.msg} </p>
            </div>
        </div>
    );
}

export default Alert;