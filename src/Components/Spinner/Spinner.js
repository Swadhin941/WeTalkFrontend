import React from 'react';
import "./Spinner.css";
import DotLoader from "react-spinners/DotLoader";

const Spinner = () => {
    return (
        <div className='container-fluid spinnerContainer'>
            <DotLoader color="black" size={34} />
        </div>
    );
};

export default Spinner;