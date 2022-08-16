import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Buffer } from "buffer";
import styled from 'styled-components';
import loader from '../assets/loader.gif';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { io } from 'socket.io-client';
import { setAvatarRoute, host } from '../utils/APIRoutes';
import { BsFillArrowLeftCircleFill, BsArrowCounterclockwise } from 'react-icons/bs';

export default function SetAvatar() {
    // const api = `https://api.multiavatar.com/4645646`;
    const api = `https://avatars.dicebear.com/api/avataaars`;
    const socket = useRef();
    const navigate = useNavigate();
    const [avatars, setAvatars] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedAvatar, setSelectedAvatar] = useState(undefined);
    const [avatartChange, setAvatarChange] = useState(false);

    const toastOptions = {
        position: 'bottom-right',
        autoClose: 5000,
        pauseOnHover: true,
        draggable: true,
        theme: 'dark',
    };

    useEffect(() => {
        const user = localStorage.getItem('chat-app-user');
        if (!user) {
            navigate('/login');
        };
        if (JSON.parse(user)?.avatarImage !== "") {
            setAvatarChange(true);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const setProfilePicture = async () => {
        if (selectedAvatar === undefined) {
            toast.error('Please select an avatar', toastOptions);
        } else {
            const user = await JSON.parse(localStorage.getItem('chat-app-user'));
            const { data } = await axios.post(`${setAvatarRoute}/${user._id}`, {
                image: avatars[selectedAvatar],
            });

            if (data.isSet) {
                user.isAvatarImageSet = true;
                user.avatarImage = data.image;
                localStorage.setItem('chat-app-user', JSON.stringify(user));
                if (avatartChange) {
                    socket.current = io(host);
                    socket.current.emit('edit-user-profile', user._id);
                }
                navigate('/');
            } else {
                toast.error('Error setting avatar. Please try again', toastOptions);
            }
        }
    };

    useEffect(() => {
        getAvatarImgs();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    async function getAvatarImgs() {
        const data = [];

        function getRandomColor() {
            let letters = '0123456789ABCDEF';
            let color = '';
            for (let i = 0; i < 6; i++) {
                color += letters[Math.floor(Math.random() * 16)];
            }
            return color;
        }

        for (let i = 0; i < 4; i++) {
            const randomColor = getRandomColor();
            const image = await axios.get(`${api}/${Math.round(Math.random() * 10000)}.svg?background=%23${randomColor}`);
            const buffer = new Buffer.from(image.data.toString());
            data.push(buffer.toString('base64'));
        }
        setAvatars(data);
        setIsLoading(false);
    };

    const handleRefresh = event => {
        const target = event.currentTarget;
        target.classList.add('animation');
        setTimeout(() => {
            target.classList.remove('animation');
        }, 1000);
        getAvatarImgs();
    };

    return (
        <>
            {isLoading ? (
                <Container>
                    <img src={loader} alt="loader" className="loader" />
                </Container>
            ) : (
                <Container>
                    {
                        avatartChange && (
                            <div className="get-back" onClick={() => navigate('/')}>
                                <div className='get-back-btn'>
                                    <BsFillArrowLeftCircleFill />
                                </div>
                                <p>get back</p>
                            </div>
                        )
                    }
                    <div className="title-container">
                        <h1>Pick an Avatar as your profile picture</h1>
                    </div>
                    <div className="avatars">
                        {avatars.map((avatar, index) => {
                            return (
                                <div
                                    key={index}
                                    className={`avatar ${selectedAvatar === index ? "selected" : ""
                                        }`}
                                >
                                    <img
                                        src={`data:image/svg+xml;base64,${avatar}`}
                                        alt="avatar"
                                        key={avatar}
                                        onClick={() => setSelectedAvatar(index)}
                                    />
                                </div>
                            );
                        })}
                        <div className="refresh-btn" onClick={(e) => handleRefresh(e)}>
                            <BsArrowCounterclockwise />
                        </div>
                    </div>
                    <button onClick={setProfilePicture} className="submit-btn">
                        Set as Profile Picture
                    </button>
                    <ToastContainer />
                </Container>
            )}
        </>
    );
}

const Container = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    gap: 3rem;
    background-color: #131324;
    height: 100vh;
    width: 100vw;

    .loader {
        max-inline-size: 100%;
    }
    .get-back{
        color: #fff;
        display: flex;
        align-items: center;
        gap: 5px;
        &:hover{
            cursor: pointer;
            .get-back-btn{
                border-color: #fff;
            }
        }
        .get-back-btn{
            transition: all .3s;
            padding: 5px;
            border-radius: 50%;
            border: 1px solid transparent;
            display: flex;
            svg{
                font-size: 26px;
            }
        }
    }

    .title-container {
        h1 {
        color: white;
        }
    }
    .avatars {
        display: flex;
        align-items: center;
        gap: 2rem;
        position: relative;
        .avatar {
        border: 0.4rem solid transparent;
        padding: 0.4rem;
        border-radius: 5rem;
        display: flex;
        justify-content: center;
        align-items: center;
        transition: 0.5s ease-in-out;
        width: 7.5rem;
        height: 7.5rem;
        cursor: pointer;
        img {
            height: 6rem;
            transition: 0.5s ease-in-out;
            border-radius: 50%;
        }
        }
        .selected {
        border: 0.4rem solid #4e0eff;
        }
    }
    .refresh-btn{
        transition: all .3s;
        cursor: pointer;
        position: absolute;
        right: -50px;
        transform: rotate(0deg);
        display: flex;
        svg{
            font-size: 30px;
            color: #fff;
        }
    }
    .animation{
        animation: rotate-keyframes 1s;
    }
    @keyframes rotate-keyframes {
        from {
            transform: rotate(0deg);
        }

        to {
            transform: rotate(-360deg);
        }
    }
    .submit-btn {
        background-color: #4e0eff;
        color: white;
        padding: 1rem 2rem;
        border: none;
        font-weight: bold;
        cursor: pointer;
        border-radius: 0.4rem;
        font-size: 1rem;
        text-transform: uppercase;
        &:hover {
        background-color: #4e0eff;
        }
    }
`;