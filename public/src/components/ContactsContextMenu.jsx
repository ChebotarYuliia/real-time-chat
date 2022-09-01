import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { deleteUserFromContacts, pinChat, unpinChat } from '../utils/APIRoutes';
import axios from 'axios';
import styled from 'styled-components';
import { CgTrashEmpty } from 'react-icons/cg';
import { AiOutlinePushpin } from 'react-icons/ai';
import { TbPinnedOff } from 'react-icons/tb';

export default function ContContactsContextMenuextMenu({ targetId, handleDeleteChat, currentUser, togglePinedChats }) {
    const [contextData, setContextData] = useState({ visible: false, posX: 0, posY: 0 });
    const [activeChatId, setActiveChatId] = useState(undefined);
    const [isPined, setIsPined] = useState(false);
    const contextRef = useRef(null);

    useEffect(() => {
        const contextMenuEventHandler = (event) => {
            const targetElement = document.getElementById(targetId)
            if (targetElement && targetElement.contains(event.target)) {
                event.preventDefault();
                setActiveChatId(event.target.dataset['id']);
                setIsPined(event.target.classList.contains('pined'));
                setContextData({ visible: true, posX: event.clientX, posY: event.clientY })
            } else if (contextRef.current && !contextRef.current.contains(event.target)) {
                setContextData({ ...contextData, visible: false })
            }
        }

        const offClickHandler = (event) => {
            if (contextRef.current && !contextRef.current.contains(event.target)) {
                setContextData({ ...contextData, visible: false })
            }
        }

        document.addEventListener('contextmenu', contextMenuEventHandler)
        document.addEventListener('click', offClickHandler)
        return () => {
            document.removeEventListener('contextmenu', contextMenuEventHandler)
            document.removeEventListener('click', offClickHandler)
        }
    }, [contextData, targetId]);

    useLayoutEffect(() => {
        if (contextData.posX + contextRef.current?.offsetWidth > window.innerWidth) {
            setContextData({ ...contextData, posX: contextData.posX - contextRef.current?.offsetWidth })
        }
        if (contextData.posY + contextRef.current?.offsetHeight > window.innerHeight) {
            setContextData({ ...contextData, posY: contextData.posY - contextRef.current?.offsetHeight })
        }
    }, [contextData]);

    const handleDelete = async () => {
        const res = await axios.post(`${deleteUserFromContacts}/${currentUser._id}`, { id: activeChatId });
        if (res.status) {
            handleDeleteChat(activeChatId);
            handleUnpin();
            setContextData({ ...contextData, visible: false });
        }
    };

    const handlePin = async () => {
        const res = await axios.post(`${pinChat}/${currentUser._id}`, { id: activeChatId });
        if (res.status) {
            setContextData({ ...contextData, visible: false });
            togglePinedChats();
        }
    };

    const handleUnpin = async () => {
        const res = await axios.post(`${unpinChat}/${currentUser._id}`, { id: activeChatId });
        if (res.status) {
            setContextData({ ...contextData, visible: false });
            togglePinedChats()
        }
    };

    return (
        <Container
            ref={contextRef}
            style={{ display: `${contextData.visible ? 'block' : 'none'}`, left: contextData.posX, top: contextData.posY }}
        >
            <div className='context-menu'>
                {
                    isPined ? (
                        <li className='context-menu-item' onClick={handleUnpin}>
                            <TbPinnedOff /> <p>Unpin</p>
                        </li>
                    ) : (
                        <li className='context-menu-item' onClick={handlePin}>
                            <AiOutlinePushpin /> <p>Pin</p>
                        </li>
                    )
                }
                <li className='context-menu-item' onClick={handleDelete}>
                    <CgTrashEmpty /> <p>Delete chat</p>
                </li>
            </div>
        </Container >
    );
};

const Container = styled.div`
    position: absolute;
    z-index: 100;
    min-width: 150px;
    background-color: ${({ theme }) => theme.colors.mainBg};
    border-radius: 5px;
    display: none;
    list-style: none;
    .context-menu-item{
        padding: 10px;
        font-size: 1rem;
        color: ${({ theme }) => theme.colors.font};
        border-radius: 5px;
        display: flex;
        align-items: center;
        gap: 10px;
        &:hover{
            background-color: ${({ theme }) => theme.colors.accent};
            cursor: pointer;
        }
        &.alert-item{
            color: #af2424;
        }
        svg{
            font-size: 1.5rem;
        }
    }
`;