import React, { useContext } from 'react';
import { SharedData } from '../../SharedData/SharedContext';
import { useNavigate } from 'react-router-dom';

const NoToken = () => {
    const {user, logout}= useContext(SharedData);
    const navigate= useNavigate();
    logout()
    navigate('/login');
};

export default NoToken;