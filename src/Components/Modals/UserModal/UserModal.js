import React, { useContext, useEffect, useRef, useState } from 'react';
import { SharedData } from '../../SharedData/SharedContext';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import RingLoader from 'react-spinners/RingLoader';

const UserModal = () => {
    const { user, logout, updateProfilePicture } = useContext(SharedData);
    const [userInfo, setUserInfo] = useState(null);
    const [editBio, setEditBio] = useState(false);
    const [bioLoading, setBioLoading] = useState(false);
    const [tempImage, setTempImage] = useState(null);
    // const [imgUrlInfo, setImgUrlInfo]= useState(null);
    const bioRef = useRef();
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            console.log("UserModal", user);
            fetch(`${process.env.REACT_APP_SERVER}/getUserDetails?user=${user?.email}`, {
                method: "GET",
                headers: {
                    authorization: `bearer ${localStorage.getItem('token')}`
                }
            })
                .then(res => {
                    if (res.status === 401) {
                        logout()
                        navigate('/login');
                    }
                    if (res.status === 403) {
                        navigate("/forbidden");
                    }
                    return res.json();
                })
                .then(data => {
                    setUserInfo(data);
                })
        }

    }, [user])

    const handleSubmit = (e) => {
        e.preventDefault();
        const bio = bioRef.current.value;
        if (bio.trim() === '') {
            toast.error("You cannot leave it empty");
            return;
        }
        setBioLoading(true);
        fetch(`${process.env.REACT_APP_SERVER}/updateUser?user=${user?.email}`, {
            method: "PATCH",
            headers: {
                authorization: `bearer ${localStorage.getItem('token')}`,
                "content-type": "application/json"
            },
            body: JSON.stringify({ bio: bio })
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
                console.log(data);
                if (data.modifiedCount >= 1) {
                    bioRef.current.value = "";
                    setBioLoading(false);
                    setEditBio(false);
                }
            })
    }

    const handleImageChange = (e) => {
        // console.log(e.target.files[0]);
        // setImgUrlInfo(e.target.files[0]);
        setTempImage(URL.createObjectURL(e.target.files[0]));
    }

    const handleImageSubmit= (e)=>{
        // console.log(e.files[0]);
        const formData= new FormData();
        formData.append('image', e.files[0]);
        // console.log(formData);
        fetch(`https://api.imgbb.com/1/upload?key=${process.env.REACT_APP_imgBB}`, {
            method:"POST",
            body: formData
        })
        .then(res=>res.json())
        .then(imgData=>{
            if(imgData.success){
                fetch(`${process.env.REACT_APP_SERVER}/updateUser?user=${user?.email}`, {
                    method: "PATCH",
                    headers: {
                        authorization: `bearer ${localStorage.getItem('token')}`,
                        "content-type": "application/json"
                    },
                    body: JSON.stringify({ photoURL: imgData.data.url })
                })
                .then(res=>{
                    if(res.status===401){
                        logout()
                        navigate('/login')
                    }
                    if(res.status===403){
                        navigate('/forbidden');
                    }
                    return res.json()
                })
                .then(data=>{
                    if(data.modifiedCount>=1){
                        updateProfilePicture(imgData.data.url)
                        .then(()=>{
                            setTempImage(null);
                            toast.success("Profile Picture Updated");
                        })
                        .catch(error=>{
                            toast.error(error.message);
                        })
                    }
                })
                .catch(error=>{
                    toast.error(error.message);
                })
            }
        })
    }

    const handleLogout=()=>{
        logout()
        navigate('/login');
    }

    return (
        <div className='modal fade' id='UserModal' data-bs-keyboard="false" data-bs-backdrop="static">
            <div className="modal-dialog modal-dialog-centered modal-sm modal-dialog-scrollable">
                <div className="modal-content">
                    <div className="modal-header" style={{ borderBottom: "none" }}>
                        <button className='btn btn-close' data-bs-dismiss="modal"></button>
                    </div>
                    <div className="modal-body">
                        <div className='d-flex justify-content-center align-items-center' onClick={() => document.querySelector('#imgUpload').click()}>
                            <img src={userInfo?.photoURL ? userInfo?.photoURL : tempImage ? tempImage : "https://i.ibb.co/bmVqbdY/empty-person.jpg"} alt="" height={120} width={120} style={{ borderRadius: "50%" }} />

                            <input type="file" name='imgUpload' id='imgUpload' hidden onChange={handleImageChange} />
                        </div>
                        {
                            tempImage && <div className='d-flex justify-content-center mt-2'>
                                <button className='btn btn-success btn-sm mx-2'data-bs-dismiss="modal"  onClick={()=>handleImageSubmit(document.querySelector("#imgUpload"))}>Save</button>
                                <button className='btn btn-danger btn-sm mx-2' onClick={()=> setTempImage(null)}>Cancel</button>

                            </div>
                        }
                        <div className='d-flex justify-content-center mt-2 mb-0'>
                            <h4 style={{ fontWeight: "600" }} className='mb-0'>{user?.displayName}</h4>
                        </div>
                        <div className='d-flex justify-content-center mt-0'>
                            <p className='mt-0'><small>{user?.email}</small></p>
                        </div>
                        <div className='mt-1'>
                            <div>
                                <div className='d-flex justify-content-between'>
                                    <div className='d-flex'>
                                        <p className='text-success mb-0 fs-5'>Bio</p>  {bioLoading && <RingLoader size={22} color='black' />}
                                    </div>

                                    {
                                        !editBio && <div onClick={() => setEditBio(!editBio)}>
                                            <span><i className='bi bi-pencil-square fs-5 text-success'></i></span>
                                        </div>
                                    }

                                </div>
                                <hr className='my-0' />
                                {
                                    editBio ?
                                        <div className='mt-2' >
                                            <form className='form' onSubmit={handleSubmit}>
                                                <div className='input-group'>
                                                    <textarea className='form-control' name="" id="" cols="24" rows="1" style={{ resize: "none", borderRight: "none" }} required ref={bioRef}></textarea>
                                                    <button type='submit' className='input-group-text bg-white' style={{ cursor: "pointer" }}><i className='bi bi-check2 text-success fs-5'></i></button>
                                                </div>
                                            </form>
                                        </div>
                                        :
                                        <div>
                                            <p>{userInfo?.bio ? userInfo?.bio : "Default"}</p>
                                        </div>
                                }

                            </div>
                        </div>
                        <div>
                            <button className='btn w-100' style={{border: " 2px solid #05ffaf", backgroundColor: "#8cf298"}} data-bs-dismiss="modal" onClick={handleLogout}>Logout</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserModal;