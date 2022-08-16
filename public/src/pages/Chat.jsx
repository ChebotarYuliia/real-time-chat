import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styled from 'styled-components';
import { allUsersRoute, host } from "../utils/APIRoutes";
import Contacts from "../components/Contacts";
import Welcome from "../components/Welcome";
import ChatContainer from "../components/ChatContainer";
import { io } from 'socket.io-client';

function Chat() {
    const socket = useRef();
    const navigate = useNavigate();
    const [contacts, setContacts] = useState([]);
    const [currentUser, setCurrentUser] = useState(undefined);
    const [currentChat, setCurrentChat] = useState(undefined);
    const [isLoaded, setIsLoaded] = useState(false);
    const [onlineUsers, setOnlineUsers] = useState([]);

    useEffect(() => {
        getCurrentUser();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    async function getCurrentUser() {
        if (!localStorage.getItem('chat-app-user')) {
            navigate('/login');
        } else {
            setCurrentUser(await JSON.parse(localStorage.getItem('chat-app-user')));
            setIsLoaded(true);
        };
    };

    useEffect(() => {
        if (currentUser) {
            socket.current = io(host);
            socket.current.emit('add-user', currentUser._id);
            socket.current.on('user-connetion', users => {
                setOnlineUsers(users);
            });
            socket.current.on('update-user-profile', () => getContacts());
        }
    }, [currentUser]);

    useEffect(() => {
        getContacts();
    }, [currentUser]);

    async function getContacts() {
        if (currentUser) {
            if (currentUser.isAvatarImageSet) {
                const data = await axios.get(`${allUsersRoute}/${currentUser._id}`);
                setContacts(data.data);
            } else {
                navigate('/setavatar');
            }
        };
    };

    const handleChatChange = (chat) => {
        setCurrentChat(chat);
    };

    const deleteChatFromContacts = (id) => {
        if (id === currentChat._id) {
            setCurrentChat(undefined);
        }
        getContacts();
    };

    return (
        <Container>
            <div className="container">
                <Contacts contacts={contacts} currentUser={currentUser} changeChat={handleChatChange} getCurrentUser={getCurrentUser} onlineUsers={onlineUsers} getContacts={getContacts} deleteChatFromContacts={deleteChatFromContacts} />
                {isLoaded && currentChat === undefined ? (
                    <Welcome currentUser={currentUser} />
                ) : (
                    <ChatContainer currentUser={currentUser} currentChat={currentChat} socket={socket} onlineUsers={onlineUsers} />
                )}
            </div>
        </Container>
    );
}

const Container = styled.div`
    height: 100vh;
    width: 100vw;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 1rem;
    align-items: center;
    background-color: #131324;
    .container {
        height: 90vh;
        width: 85vw;
        background-color: #00000076;
        display: grid;
        grid-template-columns: 25% 75%;
        @media screen and (min-width: 720px) and (max-width: 1080px) {
            grid-template-columns: 35% 65%;
        }
        @media screen and (max-width: 719px) {
            width: 95vw;
            grid-template-columns: 35% 65%;
        }
    }
`;

export default Chat;