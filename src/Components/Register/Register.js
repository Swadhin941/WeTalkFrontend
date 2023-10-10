import React, { useContext, useEffect, useState } from 'react';
import "./Register.css";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { SharedData } from '../SharedData/SharedContext';
import useTitle from '../CustomHook/useTitle/useTitle';
import useToken from '../CustomHook/useToken/useToken';

const Register = () => {
    useTitle("WeTalk-SignUp");
    const [showPassword, setShowPassword] = useState(false);
    const { createAccount, user, updateProfilePicture, updateDisplayName } = useContext(SharedData);
    const [emailValue, setEmailValue] = useState(null);
    const location = useLocation();
    const navigate = useNavigate();
    const from = location.state?.from?.pathname || "/";
    const [token] = useToken(emailValue?.email);
    useEffect(() => {
        if (token) {
            navigate('/', { replace: true });
        }
    }, [token])

    useEffect(() => {
        if (emailValue === null && user !== null) {
            navigate(from, { replace: true });
        }
    }, [emailValue, user])

    const handleSubmit = (e) => {
        e.preventDefault();
        const form = e.target;
        const fullName = form.fullName.value;
        const email = form.email.value;
        const password = form.password.value;
        const confirmPassword = form.confirmPassword.value;
        if (password.length <= 6) {
            toast.error("Password must be longer than 6 character");
            return;
        }
        if (password !== confirmPassword) {
            toast.error("Passwords are not equal");
            return;
        }
        if (/(?=.*[\s])/.test(password)) {
            toast.error('Password cannot contains space');
            return;
        }

        createAccount(email, password)
            .then(user => {
                updateDisplayName(fullName);
                updateProfilePicture('https://i.ibb.co/bmVqbdY/empty-person.jpg')
                fetch(`${process.env.REACT_APP_SERVER}/user`, {
                    method: "POST",
                    headers: {
                        "content-type": "application/json"
                    },
                    body: JSON.stringify({ fullName, email, photoURL: 'https://i.ibb.co/bmVqbdY/empty-person.jpg' })
                })
                    .then(res => res.json())
                    .then(data => {
                        if (data.acknowledged) {
                            setEmailValue(user.user);
                        }
                    })
            })
            .catch(error => {
                toast.error(error.message.split('/')[1].split(')')[0]);
            })


    }
    return (
        <div className='registerContainer'>
            <div className="card">
                <div className="card-body">
                    <h2 className='text-center fw-bold'>Signup Here!</h2>
                    <form onSubmit={handleSubmit} className='mt-4'>
                        <div>
                            <label htmlFor="fullName">Full Name:</label>
                            <div className='input-group'>
                                <span className='input-group-text'><i className='bi bi-person'></i></span>
                                <input type="text" name='fullName' className='form-control' required />
                            </div>
                        </div>
                        <div className='mt-3'>
                            <label htmlFor="email">Email:</label>
                            <div className='input-group'>
                                <span className='input-group-text'><i className='bi bi-envelope-at-fill'></i></span>
                                <input type="email" name='email' className='form-control' required />
                            </div>
                        </div>
                        <div className='mt-3'>
                            <label htmlFor="password">Password:</label>
                            <div className='input-group'>
                                <span className='input-group-text'><i className='bi bi-key'></i></span>
                                <input type={showPassword ? 'text' : 'password'} name='password' className='form-control' style={{ borderRight: "0px" }} />
                                <span className='input-group-text' style={{ backgroundColor: "white" }} onClick={() => setShowPassword(!showPassword)}><i className={`bi ${showPassword ? 'bi-eye' : 'bi-eye-slash'}`}></i></span>
                            </div>
                        </div>
                        <div className='mt-3'>
                            <label htmlFor="confirmPassword">Confirm Password:</label>
                            <div className='input-group'>
                                <span className='input-group-text'><i className='bi bi-key'></i></span>
                                <input type="password" name='confirmPassword' className='form-control' required />
                            </div>
                        </div>
                        <div className='d-flex justify-content-end mt-2'>
                            <Link to={'/login'}>Already have a account?</Link>
                        </div>
                        <div className='mt-2 d-flex justify-content-center'>
                            <button type='submit' className='btn btn-outline-dark'>Register</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register;