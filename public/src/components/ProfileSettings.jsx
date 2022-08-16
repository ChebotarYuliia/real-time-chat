import React, { useState, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import { BsFillCameraFill } from 'react-icons/bs';
import axios from 'axios';
import { settingsRoute, host } from '../utils/APIRoutes';
import { io } from 'socket.io-client';

export default function ProfileSettings({ currentUserName, currentUserImage, handleProfileSettingsIsOn, getCurrentUser }) {
    const socket = useRef();
    const navigator = useNavigate();
    const [userName, setUserName] = useState(currentUserName);

    const onChangeHandler = event => {
        const value = event.target.value;
        setUserName(value);
    };

    const handleAvatarChange = () => {
        navigator('/setavatar');
    };

    const handleCanselSettings = () => {
        handleProfileSettingsIsOn();
    };

    const handleSaveSettings = async () => {
        const user = await JSON.parse(localStorage.getItem('chat-app-user'));
        const { data } = await axios.post(`${settingsRoute}/${user._id}`, {
            newUserName: userName,
        });

        if (data.status) {
            localStorage.setItem('chat-app-user', JSON.stringify(data.user));
            handleProfileSettingsIsOn();
            getCurrentUser();

            socket.current = io(host);
            socket.current.emit('edit-user-profile', user._id);
            console.log('changed succesfully');
        } else {
            console.log('was an error');
        }
    };

    return (
        <>
            <div className="current-user">
                <div className="avatar">
                    <img src={`data:image/svg+xml;base64,${currentUserImage}`} alt="avatar" />
                    <button className='avatar-setting-btn' onClick={handleAvatarChange}><BsFillCameraFill /></button>
                </div>
                <div className="username">
                    <input className="username-input" type="text" value={userName} onChange={e => onChangeHandler(e)} />
                </div>
                <div className='controls'>
                    <div className='cancel' onClick={handleCanselSettings}>Cancel</div>
                    <div className='save' onClick={handleSaveSettings}>Save</div>
                </div>
            </div>
        </>
    )
};
