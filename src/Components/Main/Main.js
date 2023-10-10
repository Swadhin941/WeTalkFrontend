import React, { useContext, useState } from 'react';
import ChatedPerson from '../ChatedPerson/ChatedPerson';
import "./Main.css";
import AllMessages from '../AllMessages/AllMessages';
import useTitle from '../CustomHook/useTitle/useTitle';
import { useLocation } from 'react-router-dom';
import { SharedData } from '../SharedData/SharedContext';

const Main = () => {
    const [selectedChat, setSelectedChat] = useState(null);
    const [chatedPersonLoad, setChatedPersonLoad] = useState(false);
    const [chattedPerson, setChattedPerson]= useState([]);
    const { miniWindowOne, windowOneState, handleMiniOne } = useContext(SharedData);
    useTitle("WeTalk-Chats");
    return (
        <div className='container-fluid' >
            <div className="contentAlign">
                <div className="">
                    <ChatedPerson setSelectedChat={setSelectedChat} chatedPersonLoad={chatedPersonLoad} selectedChat={selectedChat} chattedPerson={chattedPerson} setChattedPerson={setChattedPerson}></ChatedPerson>
                </div>
                <div className="" style={{ overflow: "auto", overflowX: "hidden", overflowY: "auto" }}>
                    {
                        !selectedChat ? <div className='notSelected'><div>
                            <h1 className='fw-bold text-white text-center'><i className='bi bi-chat-dots-fill'></i>WeTalk</h1>
                            <p className='text-white text-center'>Let's communicate with WeTalk</p>
                        </div></div> : <div style={{ backgroundColor: "#111B21" }}>
                            <AllMessages selectedPerson={selectedChat} setSelectedPerson={setSelectedChat} setChatedPersonLoad={setChatedPersonLoad} chatedPersonLoad={chatedPersonLoad} chattedPerson={chattedPerson} setChattedPerson= {setChattedPerson}></AllMessages>
                        </div>
                    }
                </div>
            </div>
        </div>
    );
};

export default Main;