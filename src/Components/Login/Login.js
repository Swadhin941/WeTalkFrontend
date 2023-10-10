import React, { useContext, useEffect, useState } from 'react';
import "./Login.css";
import { SharedData } from '../SharedData/SharedContext';
import toast from 'react-hot-toast';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import useTitle from '../CustomHook/useTitle/useTitle';
import useToken from '../CustomHook/useToken/useToken';
import uuid from "react-uuid";
import ClockLoader from "react-spinners/ClockLoader";

const Login = () => {
    useTitle('WeTalk-login');
    const { login, googleLogin, logout, user } = useContext(SharedData);
    const [showPassword, setShowPassword] = useState(false);
    const [emailValue, setEmailValue] = useState(null);
    const [token] = useToken(user?.email);
    const [loginLoading, setLoginLoading] = useState(false);
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";
    const navigate = useNavigate();
    useEffect(() => {
        if (token) {
            navigate(from, { replace: true });
        }
    }, [token])


    const handleSubmit = (e) => {
        e.preventDefault();
        const form = e.target;
        const email = form.email.value;
        const password = form.password.value;
        setLoginLoading(true);
        login(email, password)
            .then(user => {
                toast.success("Login Successfully");
                setEmailValue(user.user);
                setLoginLoading(false);
            })
            .catch(error => {
                toast.error(error.message.split('/')[1]);
                setLoginLoading(false);
            })

    }

    const handleGoogle = () => {
        googleLogin()
            .then(users => {
                fetch(`${process.env.REACT_APP_SERVER}/user`, {
                    method: 'POST',
                    headers: {
                        "content-type": "application/json",
                    },
                    body: JSON.stringify({ fullName: users?.user?.displayName, email: users?.user?.email })
                })
                    .then(res => res.json())
                    .then(data => {
                        if (data.acknowledged) {
                            setEmailValue(users.user);
                        }
                    })
            })
            .catch(error => {
                toast.error(error.message);
            })

    }
    return (
        <div className='loginContainer'>
            <div className="card">
                <div className="card-body">
                    <h2 className='text-center fw-bold'><span><i className='bi bi-chat-dots-fill'></i></span>WeTalk</h2>
                    <form className=' form mt-3' onSubmit={handleSubmit}>
                        <div>
                            <label className='form-label text-dark' htmlFor="email">Email:</label>
                            <div className="input-group">
                                <span className='input-group-text'><i className='bi bi-envelope-at-fill'></i></span>
                                <input type="text" className='form-control' name='email' required placeholder='Enter your email' />
                            </div>
                        </div>
                        <div className='mt-2'>
                            <label className='form-label text-dark' htmlFor="password">Password:</label>
                            <div className='input-group'>
                                <span className='input-group-text'><i className='bi bi-key'></i></span>
                                <input type={showPassword ? "text" : "password"} className='form-control' name='password' required placeholder='Enter your password' style={{ borderRight: "0px" }} />
                                <span className='input-group-text bg-white' onClick={() => setShowPassword(!showPassword)}><i className={`bi ${showPassword ? 'bi-eye' : 'bi-eye-slash'}`}></i></span>
                            </div>
                        </div>
                        <div className='d-flex justify-content-end'>
                            <Link to={'/register'}>Don't have a account?</Link>
                        </div>
                        <div className='mt-3'>
                            <button type='submit' className='btn btn-outline-dark w-100 d-flex justify-content-center'>{loginLoading ? <ClockLoader size={24} color='white' /> : 'Login'}</button>
                        </div>
                    </form>
                    <div className='d-flex justify-content-evenly mt-3'>
                        <hr className='w-100' />
                        <h4 className='text-dark'>Or</h4>
                        <hr className='w-100' />
                    </div>
                    <div className='mt-2'>
                        <button className='btn btn-outline-dark w-100' onClick={handleGoogle}> <img src="https://i.ibb.co/Y8TSkVN/google-icon.png" className='img-fluid me-2' height={24} width={24} alt="" /> Continue With Google</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;