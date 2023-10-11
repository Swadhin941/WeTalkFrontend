import React from 'react';
import "./ForbiddenPage.css";

const ForbiddenPage = () => {

    return (
        <div className='container-fluid forbiddenContainer'>
            <div>
                <h1 className='errorCode'>4<span style={{ color: "red" }}>0</span><span style={{ color: "yellowgreen" }}>3</span></h1>
                <h2 className='text-white mt-0 text-center' style={{ fontWeight: "600" }} >Forbidden Access</h2>
            </div>
        </div>
    );
};

export default ForbiddenPage;