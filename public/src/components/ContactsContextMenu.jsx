import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { deleteUserFromContacts } from '../utils/APIRoutes';
import axios from 'axios';
import styled from 'styled-components';
import { CgTrashEmpty } from 'react-icons/cg';

export default function ContContactsContextMenuextMenu({ targetId, handleDeleteChat, currentUser }) {
    const [contextData, setContextData] = useState({ visible: false, posX: 0, posY: 0 });
    const [activeChatId, setActiveChatId] = useState(undefined);
    const contextRef = useRef(null);

    useEffect(() => {
        const contextMenuEventHandler = (event) => {
            const targetElement = document.getElementById(targetId)
            if (targetElement && targetElement.contains(event.target)) {
                event.preventDefault();
                setActiveChatId(event.target.dataset['id']);
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
            setContextData({ ...contextData, visible: false });
        }
    };

    return (
        <Container
            ref={contextRef}
            style={{ display: `${contextData.visible ? 'block' : 'none'}`, left: contextData.posX, top: contextData.posY }}
        >
            <div className='context-menu'>
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
    background: #0d0d30;
    border-radius: 5px;
    display: none;
    list-style: none;
    .context-menu-item{
        padding: 10px;
        font-size: 1rem;
        color: #fff;
        border-radius: 5px;
        display: flex;
        align-items: center;
        gap: 10px;
        &:hover{
            background: #6a676743;
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