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

export default function Contacts({ contacts, currentUser, changeChat, getCurrentUser, onlineUsers, getContacts, deleteChatFromContacts, pinedChats, updatePinedChats }) {
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
                pined.push(
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
                rest.push(
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

    return (
        <>
            {
                currentUserImage && currentUserName && (
                    <Container>
                        <div className="brand">
                            <img src={Logo} alt="logo" />
                            <h3>snappy</h3>
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
    background-color: #080420;
    .brand {
        display: flex;
        align-items: center;
        gap: 1rem;
        justify-content: center;
        img {
            height: 2rem;
        }
        h3 {
            color: white;
            text-transform: uppercase;
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
                background-color: #ffffff39;
                width: 0.1rem;
                border-radius: 1rem;
            }
        }
        .search-contact{
            width: 100%;
            input{
                border: none;
                outline: none;
                color: #fff;
                padding: .5rem 1rem;
                font-size: .9rem;
                background: transparent;
                width: 100%;
            }
        }
        .add-to-contacts{
            color: #0a0a13;
            font-size: 1rem;
            padding: 0.3rem;
            background: #4e0eff;
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
            border-bottom: 1px solid grey;
            .no-user-found{
                color: grey;
                font-style: italic;
            }
        }
        .contact {
            background-color: #ffffff34;
            color: #ffffff;
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
                    color: #ffffff59;
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
                    color: #919191;
                    font-size: .8rem;
                    bottom: -1px;
                    right: 4px;
                    &.online{
                        color: #4e0eff;
                    }
                }
            }
            .username {
                h3 {
                    color: white;
                }
            }
        }
        .selected {
            background-color: #9a86f3;
        }
    }

    .current-user {
        background-color: #0d0d30;
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
                color: white;
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
            color: white;
            border: none;
            font-size: 1.2rem;
            border: none;
            outline: none;
            width: 100px;
            padding: 5px 5px 5px 10px;
            background: #ffffff34;
            border-radius: 20px;
            font-size: 1rem;
        }
        .controls{
            color: #fff;
            div{
                cursor: pointer;
                transition: all .3s;
                &:hover{
                    color: #4e0eff;
                }
            }
        }
`;