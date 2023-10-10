import React, { createContext, useEffect, useState } from 'react';
import { GoogleAuthProvider, createUserWithEmailAndPassword, getAuth, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile } from "firebase/auth";
import app from '../firebase/Firebase';

export const SharedData = createContext();

const SharedContext = ({ children }) => {
    const auth = getAuth(app);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const googleProvider = new GoogleAuthProvider();
    const [miniWindowOne, setMiniWindowOne]= useState(false);
    const [emojiViewer, setEmojiViewer]= useState(false);

    const windowOneState= ()=>{
        setMiniWindowOne(!miniWindowOne);
    }

    const handleEmoji= ()=>{
        setEmojiViewer(!emojiViewer);
    }

    const closeEmoji= (value)=>{
        setEmojiViewer(value);
    }

    const login = (email, password) => {
        setLoading(true);
        return signInWithEmailAndPassword(auth, email, password);
    }

    const createAccount = (email, password) => {
        setLoading(true);
        return createUserWithEmailAndPassword(auth, email, password);
    }

    const googleLogin = () => {
        setLoading(true);
        return signInWithPopup(auth, googleProvider);
    }

    const logout = () => {
        setLoading(true);
        localStorage.removeItem('token');
        // localStorage.removeItem('specialPath');
        return signOut(auth);
    }

    const updateDisplayName= (fullName)=>{
        setLoading(true);
        return updateProfile(auth.currentUser, {
            displayName: fullName
        })
    };

    const updateProfilePicture= (picture)=>{
        setLoading(true);
        return updateProfile(auth.currentUser, {
            photoURL: picture
        })
    }
 
    const handleMiniOne=(value)=>{
        setMiniWindowOne(value);
    }

    useEffect(() => {
        const check = onAuthStateChanged(auth, currentUser => {
            // if (currentUser === null || currentUser.emailVerified) {
                // console.log(currentUser);
                setUser(currentUser);
            // }
            setLoading(false);
        })
        return () => check();
    })


    const authInfo = { googleLogin, login, createAccount, logout, user, loading, setLoading,windowOneState, updateDisplayName, updateProfilePicture, miniWindowOne, handleMiniOne, emojiViewer, handleEmoji, closeEmoji }
    return (
        <div>
            <SharedData.Provider value={authInfo}>
                {children}
            </SharedData.Provider>
        </div>
    );
};

export default SharedContext;