import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Logo from '../assets/logo.svg';
import ProfileSettingsBtn from './ProfileSettingsBtn';
import ProfileSettings from './ProfileSettings';

export default function Contacts({ contacts, currentUser, changeChat, getCurrentUser }) {
    const [currentUserName, setCurrentUserName] = useState(undefined);
    const [currentUserImage, setCurrentUserImage] = useState(undefined);
    const [currentSelected, setCurrentSelected] = useState(undefined);
    const [profileSettingsIsOn, setProfileSettingsIsOn] = useState(false);

    useEffect(() => {
        if (currentUser) {
            setCurrentUserImage(currentUser.avatarImage);
            setCurrentUserName(currentUser.username);
        }
    }, [currentUser]);

    const changeCurrentChat = (index, contact) => {
        setCurrentSelected(index);
        changeChat(contact)
    };

    const handleProfileSettingsIsOn = () => {
        setProfileSettingsIsOn(!profileSettingsIsOn);
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
                            {
                                contacts.map((contact, index) => {
                                    return (
                                        <div className={`contact ${index === currentSelected ? 'selected' : ''}`} key={index} onClick={() => changeCurrentChat(index, contact)}>
                                            <div className="avatar">
                                                <img src={`data:image/svg+xml;base64,${contact.avatarImage}`} alt="avatar" />
                                            </div>
                                            <div className="userName">
                                                <h3>{contact.username}</h3>
                                            </div>
                                        </div>
                                    )
                                })
                            }
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
        &::-webkit-scrollbar {
            width: 0.2rem;
            &-thumb {
                background-color: #ffffff39;
                width: 0.1rem;
                border-radius: 1rem;
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
            .avatar {
                img {
                    height: 3rem;
                    border-radius: 50%;
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