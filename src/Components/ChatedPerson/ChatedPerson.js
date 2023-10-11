import React, { useContext, useEffect, useState } from 'react';
import { SharedData } from '../SharedData/SharedContext';
import { useNavigate } from 'react-router-dom';
import { PhotoProvider, PhotoView } from 'react-photo-view';
import "./ChatedPerson.css";
import uuid from 'react-uuid';
import socket from '../CustomHook/Socket/Socket';
import UserModal from '../Modals/UserModal/UserModal';
import Spinner from '../Spinner/Spinner';
import toast from 'react-hot-toast';

const ChatedPerson = ({ setSelectedChat, chatedPersonLoad, selectedChat, chattedPerson, setChattedPerson }) => {
    // const [chattedPerson, setChattedPerson] = useState([]);
    const { user, logout, miniWindowOne, handleMiniOne, closeEmoji } = useContext(SharedData);
    const [dataLoading, setDataLoading] = useState(false);
    const navigate = useNavigate();
    useEffect(() => {
        if (user !== null) {
            setDataLoading(true);
            fetch(`${process.env.REACT_APP_SERVER}/allTextedPerson?user=${user?.email}`, {
                method: "GET",
                headers: {
                    authorization: `bearer ${localStorage.getItem("token")}`
                }
            })
                .then(res => {
                    if (res.status === 401) {
                        logout();
                        navigate('/login')
                    }
                    if (res.status === 403) {
                        navigate('/forbidden');
                    }
                    return res.json();
                })
                .then(data => {
                    if (data && !data?.message) {
                        let tempData = [...data];
                        tempData = tempData.sort((a, b) => a.currentTimeMili < b.currentTimeMili);
                        // console.log(test);
                        setChattedPerson(tempData);
                        setDataLoading(false);
                    }


                })
            .catch(error => {
                toast.error(error.message);
            })
        }
    }, [user, chatedPersonLoad])

    const handleClick = (data) => {
        const room = uuid();
        // console.log(data);
        setSelectedChat({ name: data.fullName, roomAddress: data?.roomAddress ? data?.roomAddress : room, receiver: data?.email, sender: user?.email, receiverPhotoURL: data?.photoURL })
    }

    return (
        <div className='container-fluid chattedList' style={{ backgroundColor: "#F3F3F3" }} onClick={() => handleMiniOne(false)}>
            <div className="row p-2 g-2" >
                <div className="col-12 col-md-12 col-lg-12" onClick={() => closeEmoji(false)}>
                    <div style={{ borderBottom: "1px solid black", backgroundColor: "black", borderRadius: "10px" }} className='p-2 d-flex justify-content-between align-items-center'>
                        <div style={{ height: "40px", width: "40px", borderRadius: "50%", border: "1px solid black" }}>
                            <img src={user?.photoURL ? user?.photoURL : "https://i.ibb.co/bmVqbdY/empty-person.jpg"} alt="" className='img-fluid' style={{ borderRadius: "50%", height: "100%", width: "100%" }} />
                        </div>
                        <div className='bg-primary d-flex justify-content-center align-items-center' style={{ cursor: "pointer", borderRadius: "50%", height: "30px", width: "30px" }} data-bs-target="#UserModal" data-bs-toggle="modal">
                            <i className='bi bi-three-dots-vertical text-white'></i>
                        </div>
                    </div>
                </div>
                <UserModal></UserModal>
                {
                    dataLoading ? <Spinner></Spinner> :
                        chattedPerson.map((item, index) => <div className={"col-12 col-md-12 col-lg-12"} key={item._id} onClick={() => closeEmoji(false)}>
                            <div className={`card ${selectedChat && selectedChat.receiver === item.email && "bg-dark text-light"}`} onClick={() => handleClick(item)} style={{ cursor: "pointer" }}>
                                <div className="card-body">
                                    <div className='personBox'>
                                        <div className='personBoxImg'>
                                            <PhotoProvider>
                                                <PhotoView src={item?.photoURL ? item?.photoURL : `https://i.ibb.co/bmVqbdY/empty-person.jpg`}>
                                                    <img src={item?.photoURL ? item?.photoURL : "https://i.ibb.co/bmVqbdY/empty-person.jpg"} alt="" height={50} width={50} style={{ borderRadius: "50%" }} />
                                                </PhotoView>
                                            </PhotoProvider>
                                        </div>


                                        <div className='personBoxInfo'>
                                            <h5 className='my-0'>{item.fullName}</h5>
                                            <p className='my-0' style={{ color: selectedChat && selectedChat.receiver === item.email ? "#14ba3b" : "#6C757D" }}> <small>{item?.data ? item.data.length <= 20 ? item?.data : item.data.slice(0, 20) + `...` : "Start Texting"}</small> </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>)
                }

            </div>
        </div>
    );
};

export default ChatedPerson;