import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { searchForUsers, addNewContact } from "../utils/APIRoutes";
import styled from 'styled-components';
import Logo from '../assets/logo.svg';
import ProfileSettingsBtn from './ProfileSettingsBtn';
import ContactsContextMenu from './ContactsContextMenu';
import ProfileSettings from './ProfileSettings';
import { BsCircleFill } from 'react-icons/bs';
import { AiTwotonePushpin } from 'react-icons/ai';

export default function Contacts({ contacts, currentUser, changeChat, getCurrentUser, onlineUsers, getContacts, deleteChatFromContacts, pinedChats, updatePinedChats, handleThemeChange, themeName }) {
    const [currentUserName, setCurrentUserName] = useState(undefined);
    const [currentUserImage, setCurrentUserImage] = useState(undefined);
    const [currentSelected, setCurrentSelected] = useState(undefined);
    const [profileSettingsIsOn, setProfileSettingsIsOn] = useState(false);
    const [searchInput, setSearchInput] = useState('');
    const [timeOutId, setTimeOutId] = useState(undefined);
    const [foundContacts, setFoundContacts] = useState([]);
    const [noUserFound, setNoUserFound] = useState(false);

    useEffect(() => {
        if (currentUser) {
            setCurrentUserImage(currentUser.avatarImage);
            setCurrentUserName(currentUser.username);
        }
    }, [currentUser]);

    const changeCurrentChat = (contact) => {
        setCurrentSelected(contact._id);
        changeChat(contact)
    };

    const handleProfileSettingsIsOn = () => {
        setProfileSettingsIsOn(!profileSettingsIsOn);
    };

    const findUsersInDB = async (value) => {
        if (value && value !== '' && value.length > 0) {
            const { data } = await axios.get(`${searchForUsers}/${currentUser._id}/${value}`);
            if (data.status) {
                setFoundContacts(data.users);
                setNoUserFound(false);
            } else {
                setFoundContacts([]);
                setNoUserFound(true);
            }
        }
    };

    let timer;
    const handleSearchInput = event => {
        const value = event.target.value;
        setSearchInput(value);

        clearTimeout(timeOutId);
        setTimeOutId(undefined);

        if (value) {
            timer = setTimeout(async () => {
                await findUsersInDB(value);
            }, 800);
        } else {
            setNoUserFound(false);
            setFoundContacts([]);
        };

        setTimeOutId(timer);
    };

    const handleAddToContacts = async (contact) => {
        const { data } = await axios.post(`${addNewContact}/${currentUser._id}`, {
            contact,
        });
        if (data.status) {
            setFoundContacts([]);
            setSearchInput('');
            setNoUserFound(false);
            getContacts();
        };
    };

    const handleDeleteChat = (id) => {
        deleteChatFromContacts(id);
    };

    const togglePinedChats = () => {
        updatePinedChats()
    }

    const createContactList = () => {
        const pined = [];
        const rest = [];
        contacts.map((contact, index) => {
            if (pinedChats.includes(contact._id)) {
                return pined.push(
                    <div
                        className={`contact pined ${contact._id === currentSelected ? 'selected' : ''}`}
                        key={index}
                        onClick={() => changeCurrentChat(contact)}
                        data-id={contact._id}
                    >
                        <div className="avatar">
                            <img src={`data:image/svg+xml;base64,${contact.avatarImage}`} alt="avatar" />
                            <div className={`status ${onlineUsers.includes(contact._id) ? 'online' : ''}`}>
                                <BsCircleFill />
                            </div>
                        </div>
                        <div className="userName">
                            <h3>{contact.username}</h3>
                        </div>
                        <AiTwotonePushpin className="pin" />
                    </div>
                )
            } else {
                return rest.push(
                    <div
                        className={`contact ${contact._id === currentSelected ? 'selected' : ''}`}
                        key={index}
                        onClick={() => changeCurrentChat(contact)}
                        data-id={contact._id}
                    >
                        <div className="avatar">
                            <img src={`data:image/svg+xml;base64,${contact.avatarImage}`} alt="avatar" />
                            <div className={`status ${onlineUsers.includes(contact._id) ? 'online' : ''}`}>
                                <BsCircleFill />
                            </div>
                        </div>
                        <div className="userName">
                            <h3>{contact.username}</h3>
                        </div>
                    </div>
                )
            }
        });
        return (
            [...pined, ...rest].map(item => item)
        );
    };

    const toggleTheme = (e) => {
        handleThemeChange(e.target.checked);
    };

    return (
        <>
            {
                currentUserImage && currentUserName && (
                    <Container>
                        <div className="brand">
                            <img src={Logo} alt="logo" />
                            <h3>snappy</h3>
                            <div className="theme-switch-wrapper">
                                <label id="switch" className="theme-switch">
                                    <input type="checkbox" onChange={toggleTheme} id="theme-slider" checked={themeName === 'dark-theme' ? false : true} />
                                    <span className="slider"></span>
                                </label>
                            </div>
                        </div>
                        <div className="contacts">
                            <div className="search-contact">
                                <input
                                    type="text"
                                    placeholder='Search here for users'
                                    onChange={handleSearchInput}
                                    value={searchInput}
                                    autoFocus={true}
                                />
                            </div>
                            {
                                !!foundContacts?.length && (
                                    <div className="contacts-search-result">
                                        {
                                            foundContacts.map((contact, index) => {
                                                return (
                                                    <div
                                                        className={`contact ${contact._id === currentSelected ? 'selected' : ''}`}
                                                        onClick={() => changeCurrentChat(contact)}
                                                        key={index}
                                                    >
                                                        <div className="avatar">
                                                            <img src={`data:image/svg+xml;base64,${contact.avatarImage}`} alt="avatar" />
                                                            <div className={`status ${onlineUsers.includes(contact._id) ? 'online' : ''}`}>
                                                                <BsCircleFill />
                                                            </div>
                                                        </div>
                                                        <div className="userName">
                                                            <h3>{contact.username}</h3>
                                                        </div>
                                                        {
                                                            (contacts.find(data => data._id === contact._id) === undefined) && (
                                                                <div className="add-to-contacts" onClick={() => handleAddToContacts(contact._id)}>
                                                                    Add
                                                                </div>
                                                            )
                                                        }
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                )
                            }
                            {
                                noUserFound && (
                                    <div className="contacts-search-result">
                                        <p className="no-user-found">No such user</p>
                                    </div>
                                )
                            }
                            <div className="contacts" id="user-contact-list">
                                <ContactsContextMenu
                                    targetId='user-contact-list'
                                    handleDeleteChat={handleDeleteChat}
                                    currentUser={currentUser}
                                    togglePinedChats={togglePinedChats}
                                />
                                {
                                    createContactList()
                                }
                            </div>
                        </div>
                        {
                            profileSettingsIsOn ? (
                                <ProfileSettings currentUserName={currentUserName} currentUserImage={currentUserImage} handleProfileSettingsIsOn={handleProfileSettingsIsOn} getCurrentUser={getCurrentUser} />
                            ) : (
                                <div className="current-user">
                                    <div className="avatar">
                                        <img src={`data:image/svg+xml;base64,${currentUserImage}`} alt="avatar" />
                                    </div>
                                    <div className="username">
                                        <h2>{currentUserName}</h2>
                                    </div>
                                    <ProfileSettingsBtn handleProfileSettingsIsOn={handleProfileSettingsIsOn} />
                                </div>
                            )
                        }
                    </Container>
                )
            }
        </>
    )
}

const Container = styled.div`
    display: grid;
    grid-template-rows: 10% 75% 15%;
    overflow: hidden;
    background-color: ${({ theme }) => theme.colors.secondary};
    .brand {
        display: flex;
        align-items: center;
        gap: 1rem;
        justify-content: center;
        img {
            height: 2rem;
        }
        h3 {
            color: ${({ theme }) => theme.colors.font};
            text-transform: uppercase;
        }
    }
    .theme-switch-wrapper{
        .theme-switch {
            position: relative;
            display: inline-block;
            width: 40px;
            height: 14px;
            }
        input {
            opacity: 0;
            width: 0;
            height: 0;
        }
        .slider {
            position: absolute;
            cursor: pointer;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: ${({ theme }) => theme.colors.details};
            transition: 0.4s;
            border-radius: 20px;
        }
        .slider:before {
            position: absolute;
            content: "";
            height: 25px;
            width: 25px;
            left: 0px;
            bottom: 4px;
            top: 0;
            bottom: 0;
            margin: auto 0;
            transition: 0.4s;
            box-shadow: 0 0px 15px #2020203d;
            background: #fff url('https://i.ibb.co/FxzBYR9/night.png');
            background-size: 67%;
            background-repeat: no-repeat;
            background-position: center;
            border-radius: 50%;
        }
        input:checked + .slider {
            background-color: ${({ theme }) => theme.colors.accent};
        }
        input:focus + .slider {
            box-shadow: 0 0 1px ${({ theme }) => theme.colors.accent};
        }
        input:checked + .slider:before {
            transform: translateX(24px);
            background: #fff url('https://i.ibb.co/7JfqXxB/sunny.png');
            background-repeat: no-repeat;
            background-position: center;
        }
    }
    .contacts {
        display: flex;
        flex-direction: column;
        align-items: center;
        overflow: auto;
        gap: 0.8rem;
        width: 100%;
        &::-webkit-scrollbar {
            width: 0.2rem;
            &-thumb {
                background-color: ${({ theme }) => theme.colors.primary};
                width: 0.1rem;
                border-radius: 1rem;
            }
        }
        .search-contact{
            width: 100%;
            input{
                border: none;
                outline: none;
                color: ${({ theme }) => theme.colors.font};
                padding: .5rem 1rem;
                font-size: .9rem;
                background: transparent;
                width: 100%;
            }
        }
        .add-to-contacts{
            color: ${({ theme }) => theme.colors.darkText};
            font-size: 1rem;
            padding: 0.3rem;
            background-color: ${({ theme }) => theme.colors.accent};
            border-radius: 5px;
            cursor: pointer;
            transition: all .3s;
            margin-left: auto;
        }
        .contacts-search-result{
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 0.8rem;
            width: 100%;
            padding-bottom: .8rem;
            border-bottom: 1px solid ${({ theme }) => theme.colors.details};
            .no-user-found{
                color: ${({ theme }) => theme.colors.details};
                font-style: italic;
            }
        }
        .contact {
            color: ${({ theme }) => theme.colors.font};
            cursor: pointer;
            width: 90%;
            border-radius: 0.2rem;
            padding: 0.4rem;
            display: flex;
            gap: 1rem;
            align-items: center;
            transition: 0.5s ease-in-out;
            &.pined {
                .pin{
                    font-size: 1.2rem;
                    margin-left: auto;
                    color: #6060608f;
                }
                &.selected{
                    .status.online{
                        svg{
                            color: #fff;
                        }
                    }
                }
            }
            .avatar {
                position: relative;
                img {
                    height: 3rem;
                    border-radius: 50%;
                }
                .status{
                    position: absolute;
                    color: ${({ theme }) => theme.colors.details};
                    font-size: .8rem;
                    bottom: -1px;
                    right: 4px;
                    &.online{
                        color: ${({ theme }) => theme.colors.accent};
                    }
                }
            }
            .username {
                h3 {
                    color: ${({ theme }) => theme.colors.font};
                }
            }
        }
        .selected {
            background-color: ${({ theme }) => theme.colors.primary};
        }
    }

    .current-user {
        background-color: ${({ theme }) => theme.colors.primary};
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 1rem;
        width: 100%;
        padding: 0.5rem;
        .avatar {
            position: relative;
            height: 64px;
            width: 64px;
            overflow: hidden;
            img {
                height: 4rem;
                border-radius: 50%;
            }
        }
        .avatar-setting-btn{
            position: absolute;
            bottom: 0;
            left: 0;
            height: 100%;
            width: 100%;
            border: none;
            background: transparent;
            border-radius: 50%;
            overflow: hidden;
            display:flex;
            justify-content: center;
            &:before{
                background: #00000073;
                border-radius: 0px 0px 50% 50%;
                height: 50%;
                width: 100%;
                position: absolute;
                left: 0;
                bottom: 0;
                content: '';
            }
            cursor: pointer;
                svg{
                    color: #fff;
                    font-size: 1.3rem;
                    position: absolute;
                    bottom: 7px;
                }
                }
        }
        .username {
            h2 {
                color: ${({ theme }) => theme.colors.font};
            }
        }
        @media screen and (min-width: 720px) and (max-width: 1080px) {
            gap: 0.5rem;
            grid-template-rows: 10% calc(75% - 1rem) 15%;
            .username {
                h2 {
                font-size: 1rem;
                }
            }
        }
        .username-input{
            background-color: transparent;
            color: ${({ theme }) => theme.colors.font};
            border: none;
            font-size: 1.2rem;
            border: none;
            outline: none;
            width: 100px;
            padding: 5px 5px 5px 10px;
            background: ${({ theme }) => theme.colors.details};
            border-radius: 20px;
            font-size: 1rem;
        }
        .controls{
            color: ${({ theme }) => theme.colors.font};
            div{
                cursor: pointer;
                transition: all .3s;
                &:hover{
                    color: ${({ theme }) => theme.colors.accent};
                }
            }
        }
`;