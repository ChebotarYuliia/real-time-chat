import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import Logout from './Logout';
import ChatInput from './ChatInput';
import axios from 'axios';
import { v4 as uuidv4 } from "uuid";
import { getAllMessagesRoute, sendMessageRoute } from '../utils/APIRoutes';
import { IoIosArrowDown } from 'react-icons/io';

export default function ChatContainer({ currentChat, currentUser, socket, onlineUsers }) {
    const [messages, setMessages] = useState([]);
    const [arrivalMessage, setArrivalMessage] = useState(null);
    const [showScrollBtn, setShowScrollBtn] = useState(false);
    const scrollRef = useRef();

    useEffect(() => {
        if (currentChat) {
            async function getCurrentChat() {
                const res = await axios.post(getAllMessagesRoute, {
                    from: currentUser._id,
                    to: currentChat._id
                });
                setMessages(res.data);
            };
            getCurrentChat();
        }
    }, [currentChat]);

    useEffect(() => {
        if (socket.current) {
            socket.current.on('msg-receive', msg => {
                setArrivalMessage({ fromSelf: false, message: msg.msg, time: msg.time });
            })
        }
    }, []);

    useEffect(() => {
        arrivalMessage && setMessages(prev => [...prev, arrivalMessage]);
    }, [arrivalMessage]);

    useEffect(() => {
        handleScrollDown();
    }, [messages]);

    useEffect(() => {
        const chat = document.getElementById('chat-messages');

        if (chat) {
            const toggleVisible = () => {
                const scrollHeight = chat.scrollHeight;
                const chatHeight = chat.clientHeight;
                const scrolled = chat.scrollTop;

                if (scrollHeight - chatHeight - scrolled > 300) {
                    setShowScrollBtn(true);
                }
                else if (scrollHeight - chatHeight - scrolled < 300) {
                    setShowScrollBtn(false);
                }
            };
            chat.addEventListener('scroll', toggleVisible);
        }
    }, []);

    function handleScrollDown() {
        scrollRef.current?.scrollIntoView({ behaviour: 'smooth' });
    };

    const handleSendMsg = async (msg) => {
        await axios.post(sendMessageRoute, {
            from: currentUser._id,
            to: currentChat._id,
            message: msg,
        });
        socket.current.emit('send-msg', {
            to: currentChat._id,
            from: currentUser._id,
            message: msg,
            time: new Date()
        });
        const msgs = [...messages];
        msgs.push({ fromSelf: true, message: msg, time: new Date() });
        setMessages(msgs);
    };

    const createMessages = () => {
        const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        let newDateNeeded = true;
        let date = null;
        const result = [];

        messages.map((msg) => {

            if (date === null) {
                newDateNeeded = true;
                date = new Date(msg.time);
            } else if (date.getDate() !== new Date(msg.time).getDate()) {
                newDateNeeded = true;
                date = new Date(msg.time);
            };

            if (date) {

                const hours = new Date(msg.time).getHours() < 10 ? '0' + new Date(msg.time).getHours() : new Date(msg.time).getHours();
                const minutes = new Date(msg.time).getMinutes() < 10 ? '0' + new Date(msg.time).getMinutes() : new Date(msg.time).getMinutes();

                result.push(
                    <div ref={scrollRef} key={uuidv4()}>
                        {
                            newDateNeeded && <div className="date">{months[date.getMonth()]} {date.getDate()}, {date.getFullYear()}</div>
                        }
                        <div className={`message ${msg.fromSelf ? 'sended' : 'received'}`}>
                            <div className="content-wrapper">
                                <p className="time">{hours}:{minutes}</p>
                                <div className="content">
                                    <p>
                                        {msg.message}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            };
            return newDateNeeded = false;
        });
        return result.map(msg => msg);
    };

    return (
        <>
            {
                currentChat && (
                    <Container>
                        <div className="chat-header">
                            <div className="user-details">
                                <div className="avatar">
                                    <img src={`data:image/svg+xml;base64,${currentChat.avatarImage}`} alt="avatar" />
                                </div>
                                <div className="username">
                                    <h3>{currentChat.username}</h3>
                                    <span className='status'>{onlineUsers.includes(currentChat._id) ? 'online' : 'offline'}</span>
                                </div>
                            </div>
                            <Logout socket={socket} />
                        </div>
                        <div className="chat-messages" id="chat-messages">
                            {
                                createMessages()
                            }
                        </div>
                        {
                            showScrollBtn && (
                                <div className="arrow-scroll" onClick={handleScrollDown}>
                                    <IoIosArrowDown />
                                </div>
                            )
                        }
                        <ChatInput handleSendMsg={handleSendMsg} currentChat={currentChat} />
                    </Container>
                )
            }
        </>
    )
}

const Container = styled.div`
    position: relative;
    gap: 0.1rem;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    .chat-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 2rem;
        background: #080420;
        position: absolute;
        top: 0;
        left: 0;
        z-index: 100;
        height: 15%;
        width: 100%;
        .user-details {
            display: flex;
            align-items: center;
            gap: 1rem;
            .avatar {
                img {
                    height: 3rem;
                    border-radius: 50%;
                }
            }
            .username {
                display: flex;
                align-items: center;
                gap: 10px;
                h3 {
                    color: white;
                }
                .status{
                    font-size: .9rem;
                    color: #919191;
                }
            }
        }
    }
    .chat-messages {
        padding: 1rem 2rem;
        display: flex;
        flex-direction: column;
        gap: 1rem;
        overflow: auto;
        height: 70%;
        scroll-behavior: smooth;
        @media screen and (max-width: 720px) {
            padding: 1rem;
        }
        &::-webkit-scrollbar {
            width: 0.2rem;
            &-thumb {
                background-color: #ffffff39;
                width: 0.1rem;
                border-radius: 1rem;
            }
        }
        .date{
            color: #fff;
            font-size: 1rem;
            padding: .5rem 1rem;
            border-radius: 1rem;
            background: #60606a;
            margin: 0 auto;
            width: fit-content;
        }
        .message {
            display: flex;
            align-items: center;
            .content-wrapper{
                max-width: 40%;
                @media screen and (min-width: 720px) and (max-width: 1080px) {
                    max-width: 70%;
                }
                @media screen and (max-width: 720px) {
                    max-width: 70%;
                }
            }
            .content {
                overflow-wrap: break-word;
                padding: 0.5rem 1rem;
                font-size: 1.1rem;
                border-radius: 1rem;
                color: #d1d1d1;
            }
            .time{
                text-align: right;
                color: #60606a;
                width: 100%;
            }
        }
        .sended {
            justify-content: flex-end;
            .content {
                background-color: #4f04ff21;
            }
        }
        .received {
            justify-content: flex-start;
            .content {
                background-color: #9900ff20;
            }
        }
    }
    .arrow-scroll{
        position: absolute;
        bottom: calc(15% + 20px);
        right: 20px;
        width: 39px;
        height: 40px;
        border-radius: 50%;
        background: #60606a;
        color: #fff;
        font-size: 1.2rem;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
    }
`;
