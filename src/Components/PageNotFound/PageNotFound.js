import React from 'react';
import "./PageNotFound.css";
import { useNavigate } from 'react-router-dom';

const PageNotFound = () => {
    const navigate = useNavigate();

    return (
        <div className='pageNotFoundContainer'>
            <div>
                <h1 className='errorCode'>4<span style={{ color: "red" }}>0</span><span style={{ color: "yellowgreen" }}>4</span></h1>
                <h2 className='text-white mt-0 text-center' style={{ fontWeight: "600" }} >Page Not Found</h2>
                <div className='d-flex justify-content-center'>
                    <button className='btn' style={{ backgroundColor: "rgb(182, 147, 186)", fontWeight: "600" }} onClick={() => navigate(-1, { replace: true })}>Go back to previous page</button>
                </div>
            </div>
        </div>
    );
};

export default PageNotFound;