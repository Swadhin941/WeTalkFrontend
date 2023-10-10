import React, { useContext } from 'react';
import { SharedData } from '../../SharedData/SharedContext';
import Spinner from '../../Spinner/Spinner';
import { Navigate, useLocation } from 'react-router-dom';

const SpecialRoute = ({children}) => {
    const {user, loading}= useContext(SharedData);
    if(loading){
        return <Spinner></Spinner>
    }

    if(user && user?.uid){
        // return <Navigate to={'/'} ></Navigate>
        return <Navigate to="/not_found" replace></Navigate>;
        // return window.history.back();
    }
    return children;
};

export default SpecialRoute;