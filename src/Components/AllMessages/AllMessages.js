import React, { useContext, useEffect, useRef, useState } from 'react';
import "./AllMessages.css";
import toast from 'react-hot-toast';
import socket from '../CustomHook/Socket/Socket';
import { SharedData } from '../SharedData/SharedContext';
import { useNavigate } from 'react-router-dom';
import Spinner from '../Spinner/Spinner';
import PulseLoader from "react-spinners/PulseLoader";
import ConfirmBlock from '../Modals/ConfirmBlock/ConfirmBlock';
import EmojiPicker from 'emoji-picker-react';

const AllMessages = ({ selectedPerson, setSelectedPerson, chatedPersonLoad, setChatedPersonLoad, chattedPerson, setChattedPerson }) => {
    const { user, logout, windowOneState, miniWindowOne, handleMiniOne, closeEmoji, handleEmoji, emojiViewer } = useContext(SharedData);
    const navigate = useNavigate();
    const messageRef = useRef();
    const [fakeData, setFakeData] = useState([]);
    const [dataLoading, setDataLoading] = useState(false);
    const [updatedPerson, setUpdatedPerson] = useState(null);
    const [typingState, setTypingState] = useState(false);
    const [blockState, setBlockState] = useState(false);
    const [blocked, setBlocked] = useState(null);
    const [selectEmoji, setSelectEmoji] = useState(null);

    //Selected Persons All Message;
    useEffect(() => {
        if (selectedPerson) {
            setDataLoading(true);
            setBlocked(null);
            fetch(`${process.env.REACT_APP_SERVER}/getAllMessages?user=${user?.email}&to=${selectedPerson?.receiver}`, {
                method: "POST",
                headers: {
                    authorization: `bearer ${localStorage.getItem('token')}`,
                    'content-type': "application/json"
                },
                body: JSON.stringify({ selectedPerson })
            })
                .then(res => {
                    if (res.status === 401) {
                        logout()
                        navigate("/login");
                    }
                    if (res.status === 403) {
                        navigate('/forbidden');
                    }
                    return res.json();
                })
                .then(data => {
                    if (data.length !== 0) {
                        let tempData = { ...selectedPerson, roomAddress: data[1]?.roomAddress };
                        if (data[1]?.blockedBy) {
                            const tempData2 = { blockedBy: data[1]?.blockedBy }
                            console.log("tempData2", tempData2);
                            setBlocked(tempData2);
                        }
                        // tempData.roomAddress = data[1]?.roomAddress;
                        // tempData.blockedBy= data[1]?.blockedBy;
                        setUpdatedPerson(tempData);
                        socket.emit('joinRoom', { roomAddress: tempData.roomAddress });
                        setFakeData(data[0]);
                        setDataLoading(false);
                    }

                })
        }
    }, [selectedPerson])

    const handleSend = () => {
        if (messageRef.current.value.trim() === '') {
            toast.error("Please type something");
            return;
        }
        socket.emit('joinRoom', { roomAddress: updatedPerson?.roomAddress });
        socket.auth = { token: `bearer ${localStorage.getItem('token')}`, email: updatedPerson?.sender };
        socket.connect();
        const currentTimeMili = Date.now();
        const currentTime = new Date().toLocaleTimeString();
        const currentDate = new Date().toLocaleDateString()
        socket.emit('reactEvent', { data: messageRef.current.value, roomAddress: updatedPerson?.roomAddress, sender: user?.email, receiver: updatedPerson?.receiver, currentTimeMili, currentTime, currentDate, token: `bearer ${localStorage.getItem('token')}`, email: user?.email }, (response) => {
            if (response.status) {
                if (response.status) {
                    if (response.status === 'Denied') {
                        logout()
                        navigate('/login');
                    }
                    if (response.status === 'Forbidden') {
                        navigate('/forbidden');
                    }
                    if (response.status === 'Send') {
                        setChatedPersonLoad(!chatedPersonLoad);
                    }
                }
            }
        });
        const tempVariable = [...fakeData, { data: messageRef.current.value, roomAddress: updatedPerson?.roomAddress, sender: user?.email, receiver: updatedPerson?.receiver, currentTimeMili, currentTime, currentDate }]
        setFakeData(tempVariable);
        closeEmoji(false);
        messageRef.current.value = "";
    }

    const handleChange = (e) => {
        socket.auth = { token: `bearer ${localStorage.getItem('token')}`, email: updatedPerson?.sender };
        socket.connect();
        socket.emit('joinRoom', { roomAddress: updatedPerson?.roomAddress });
        socket.emit('typing', { data: e.target.value, joinRoom: updatedPerson?.roomAddress, token: `bearer ${localStorage.getItem('token')}`, email: user?.email }, (response) => {
            if (response.status) {
                if (response.status === 'Denied') {
                    logout()
                    navigate('/login');
                }
                if (response.status === 'Forbidden') {
                    navigate('/forbidden')
                }
            }
        });
        closeEmoji(false);
    }


    useEffect(() => {
        socket.on('showMessage', (data, callback) => {
            const tempVariable = [...fakeData, { data: data.data, roomAddress: data.roomAddress, sender: data.email, receiver: data.receiver, currentTimeMili: data.currentTimeMili, currentTime: data.currentTime, currentDate: data.currentDate }]
            setFakeData(tempVariable);
            setChatedPersonLoad(!chatedPersonLoad);

        })
        socket.on("typing", (data) => {
            setTypingState(true);
            setTimeout(() => {
                setTypingState(false);
            }, 3000)

        })
        socket.on('blockDetails', (data) => {
            setBlocked(data);
        })

        socket.on('UnblockDetails', (data) => {

            setDataLoading(true);
            if (!data.blockedBy) {
                setBlocked(null);
            }
            else {
                const tempData = { blockedBy: data.blockedBy };
                setBlocked(tempData);
            }
            setDataLoading(false);
        })


        socket.on('connect_error', (error) => {
            console.log(error);
            if (error.message === "forbidden") {
                navigate("/forbidden");
            }
            if (error.message === 'empty_auth' || error.message === 'tokenError') {
                logout();
                navigate('/login')
            }
        })
    }, [socket]);

    useEffect(() => {
        if (blockState) {
            setDataLoading(true);
            // console.log(updatedPerson);
            socket.emit('blockRequest', {
                sender: updatedPerson?.sender,
                roomAddress: updatedPerson?.roomAddress,
                token: `bearer ${localStorage.getItem('token')}`,
                email: user?.email
            }, (response) => {
                if (response.status) {
                    if (response.status === 'Denied') {
                        logout()
                        navigate('/login');
                    }
                    if (response.status === 'Forbidden') {
                        navigate('/forbidden')
                    }
                }
            })
            const tempData = { blockedBy: updatedPerson?.sender };
            setBlocked(tempData);
            closeEmoji(false)
            setBlockState(false);
            setDataLoading(false);

        }
    }, [blockState])

    const handleUnblock = () => {
        socket.emit('UnblockRequest', {
            sender: updatedPerson?.sender,
            roomAddress: updatedPerson?.roomAddress,
            token: `bearer ${localStorage.getItem('token')}`,
            email: user?.email
        }, (response) => {
            if (response.status) {
                if (response.status === 'Denied') {
                    logout()
                    navigate('/login');
                }
                if (response.status === 'Forbidden') {
                    navigate('/forbidden')
                }
            }
        })
        fetch(`${process.env.REACT_APP_SERVER}/Unblock_data_for_current_user?user=${user?.email}&roomAddress=${updatedPerson?.roomAddress}`, {
            method: "get",
            headers: {
                authorization: `bearer ${localStorage.getItem('token')}`
            }
        })
            .then(res => {
                if (res.status === 401) {
                    logout()
                    navigate('/login')
                }
                if (res.status === 403) {
                    navigate('/forbidden')
                }
                return res.json();
            })
            .then(data => {
                if (Object.keys(data).length === 0) {
                    setBlocked(null);
                }
                else {
                    const tempData = { blockedBy: data.blockedBy };
                    setBlocked(tempData);
                }
                setDataLoading(false);
            })
    }

    const handleWindowOne = () => {
        windowOneState();
    }

    useEffect(() => {
        if (selectEmoji) {
            messageRef.current.value = messageRef?.current?.value + `${selectEmoji.emoji}`;
            setSelectEmoji(null);
        }
    }, [selectEmoji])

    return (
        <div className='container-fluid bg-white' style={{ borderLeft: "1px solid black", borderRight: "1px solid black" }} >
            <div className="row " >
                <div className="col-12 col-sm-12 col-md-12 col-lg-12 text-white" style={{ borderBottomLeftRadius: "10px", borderBottomRightRadius: "10px", backgroundColor: "rgb(25,25,112)" }}>
                    <div className='p-2 d-flex justify-content-between'>
                        <div className='d-flex' onClick={() => handleMiniOne(false)}>
                            <img src={ updatedPerson?.receiverPhotoURL ? updatedPerson.receiverPhotoURL: 'https://i.ibb.co/bmVqbdY/empty-person.jpg'} alt="" height={40} width={40} style={{ borderRadius: "50%" }} />
                            <div>
                                <h5 className='ms-3 mb-0'>{selectedPerson?.name}</h5>
                                {
                                    typingState && <div className='d-flex ms-3 mt-0'>
                                        <span style={{ fontWeight: "600", fontSize: "13px" }} >typing</span>
                                        <span className='mt-0 ms-1'><PulseLoader size={4} color="white" /></span>
                                    </div>
                                }
                            </div>
                        </div>

                        <div className='bg-primary d-flex justify-content-center align-items-center' style={{ cursor: "pointer", borderRadius: "50%", height: "30px", width: "30px" }} onClick={() => { handleWindowOne(); closeEmoji(false) }}>
                            <i className='bi bi-three-dots-vertical text-white'></i>
                        </div>
                    </div>
                    {
                        miniWindowOne && <div className='miniWindowOne'>
                            {
                                blocked ? blocked?.blockedBy === user?.email ? <button className='btn btn-dark w-100' onClick={handleUnblock}>Unblock</button> : <button className='btn btn-dark w-100' data-bs-target="#ConfirmBlock" data-bs-toggle="modal" >Block</button> :
                                    <button className='btn btn-dark w-100' data-bs-target="#ConfirmBlock" data-bs-toggle="modal" >Block</button>
                            }
                        </div>
                    }


                    <ConfirmBlock blockState={setBlockState}></ConfirmBlock>
                </div>

                <div className="col-12 col-md-12 col-lg-12" onClick={() => handleMiniOne(false)}>
                    {
                        dataLoading ? <Spinner></Spinner> : <div className='allMessagesDiv' onClick={() => closeEmoji(false)}>
                            {
                                fakeData.map((item, index) => <div className={item.sender === user?.email ? 'd-flex justify-content-end' : ''} key={index}>
                                    <div className='d-inline-block my-2 p-2 rounded ' style={{ maxWidth: '50%', backgroundColor: item.sender === user?.email ? "rgb(25,25,112)" : "#F8F8FF", color: item.sender === user?.email ? "white" : "black", border: "2px solid transparent", textAlign: "justify" }} >
                                        <p className='m-0'>{item.data} </p>
                                        <div className='m-0 mt-2 mb-1 d-flex justify-content-end'>
                                            <sub className='ms-2' style={{ fontSize: "10px" }}>{item.currentTime}</sub>
                                        </div>

                                    </div>
                                </div>)
                            }

                        </div>
                    }

                    <div className='messageBox' >
                        {
                            blocked ? blocked?.blockedBy === user?.email ? <div>
                                <hr />
                                <div className='d-flex justify-content-center'>
                                    <button className='btn btn-dark' onClick={handleUnblock}>Unblock</button>
                                </div>
                                <p className='text-center'>Please unblock to send message</p>
                            </div> : <div>
                                <hr />
                                <p className='text-center'>You can't send message to this person</p>
                            </div> : <form>
                                <div className='d-flex p-2'>
                                    <div className='input-group'>
                                        <textarea className='form-control' rows={1} cols={5} style={{ resize: "none", borderRight: "none" }} required ref={messageRef} onChange={handleChange} placeholder='Type a message'  ></textarea>
                                        <span className='input-group-text bg-white' style={{ cursor: "pointer" }} onClick={() => handleEmoji()}><i className='bi bi-emoji-smile'></i></span>
                                        <span className='input-group-text text-success' onClick={handleSend} style={{ cursor: "pointer" }}><i className='bi bi-send'></i></span>
                                        <div style={{ position: "absolute", top: "-29rem", right: "3.5rem" }}>
                                            {
                                                emojiViewer && <EmojiPicker onEmojiClick={setSelectEmoji} />
                                            }
                                        </div>
                                    </div>
                                </div>

                            </form>
                        }
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AllMessages;