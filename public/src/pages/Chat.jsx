import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styled from 'styled-components';
import { allUsersRoute, getAllPinedChats, host } from "../utils/APIRoutes";
import Contacts from "../components/Contacts";
import Welcome from "../components/Welcome";
import ChatContainer from "../components/ChatContainer";
import { light, dark } from "../components/styles/Theme.styled";
import { setAppTheme, getAppTheme } from '../utils/APIRoutes';
import { io } from 'socket.io-client';

function Chat({ handleThemeChange }) {
    const socket = useRef();
    const navigate = useNavigate();
    const [contacts, setContacts] = useState([]);
    const [currentUser, setCurrentUser] = useState(undefined);
    const [currentChat, setCurrentChat] = useState(undefined);
    const [isLoaded, setIsLoaded] = useState(false);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [pinedChats, setPinedChats] = useState([]);
    const [selectedTheme, setSelectedTheme] = useState(dark);

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
        getTheme();
    }, [currentUser])

    const getTheme = async () => {
        if (currentUser) {
            const res = await axios.get(`${getAppTheme}/${currentUser._id}`);
            if (res?.data.status) {
                await setSelectedTheme(res.data.theme);
            } else {
                await setSelectedTheme(dark);
            }
        }
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
        getPinedChats()
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

    async function getPinedChats() {
        if (currentUser) {
            const data = await axios.get(`${getAllPinedChats}/${currentUser._id}`);
            if (data.status) {
                setPinedChats(data.data.pins);
            }
        };
    };

    useEffect(() => {
        setTheme();
        handleThemeChange(selectedTheme);
    }, [selectedTheme]);

    const setTheme = async () => {
        if (currentUser) {
            await axios.post(`${setAppTheme}/${currentUser._id}`, { theme: selectedTheme });
        }
    };

    const hangleTheme = async (bool) => {
        if (bool) {
            await setSelectedTheme(light);
        } else {
            await setSelectedTheme(dark);
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

    const updatePinedChats = async () => {
        getPinedChats();
    };

    return (
        <Container>
            <div className="container">
                <Contacts
                    contacts={contacts}
                    currentUser={currentUser}
                    changeChat={handleChatChange}
                    getCurrentUser={getCurrentUser}
                    onlineUsers={onlineUsers}
                    getContacts={getContacts}
                    deleteChatFromContacts={deleteChatFromContacts}
                    pinedChats={pinedChats}
                    updatePinedChats={updatePinedChats}
                    handleThemeChange={hangleTheme}
                    themeName={selectedTheme.name}
                />
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
    background-color: ${({ theme }) => theme.colors.mainBg};
    .container {
        height: 90vh;
        width: 85vw;
        background-color:  ${({ theme }) => theme.colors.primary};
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