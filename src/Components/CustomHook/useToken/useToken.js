import React, { useEffect, useState } from 'react';

const useToken = (email) => {
    const [token, setToken]= useState(false);
    useEffect(()=>{
        if(email){
            fetch(`${process.env.REACT_APP_SERVER}/jwt?user=${email}`)
            .then(res=>res.json())
            .then(data=>{
                localStorage.setItem('token', data.token);
                setToken(true);
            })
        }
    },[email])
    return [token];
};

export default useToken;