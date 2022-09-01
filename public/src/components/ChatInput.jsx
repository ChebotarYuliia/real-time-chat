import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import Picker from 'emoji-picker-react';
import { IoMdSend } from 'react-icons/io';
import { BsEmojiSmileFill } from 'react-icons/bs';


export default function ChatInput({ handleSendMsg, currentChat }) {
    const inputRef = useRef(null);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [cursorPosition, setCursorPosition] = useState(null);
    const [chatsInputValues, setChatsInputValues] = useState({});

    useEffect(() => {
        const handleDocumentClick = event => {
            const target = event.target;
            if (target.closest('.emoji') || target.closest('.emoji-picker-react')) {
                return;
            } else {
                if (showEmojiPicker) {
                    handleEmojiPickerhideShow();
                }
            }
        };

        document.addEventListener('click', handleDocumentClick);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [showEmojiPicker]);

    useEffect(() => {
        if (currentChat) {
            if (!chatsInputValues[currentChat._id]) {
                chatsInputValues[currentChat._id] = '';
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentChat]);

    const handleEmojiPickerhideShow = () => {
        setShowEmojiPicker(!showEmojiPicker);
    };

    useEffect(() => {
        inputRef.current.selectionEnd = cursorPosition;
    }, [cursorPosition]);

    const handleEmojiClick = (event, emojiObject) => {
        const ref = inputRef.current;
        const msg = chatsInputValues[currentChat._id];
        ref.focus();
        const start = msg.substring(0, ref.selectionStart);
        const end = msg.substring(ref.selectionEnd);
        const message = start + emojiObject.emoji + end;
        setChatsInputValues({ ...chatsInputValues, [currentChat._id]: message });
        setCursorPosition(start.length + emojiObject.emoji.length);
    };

    const sendChat = event => {
        event.preventDefault();
        const msg = chatsInputValues[currentChat._id];
        if (msg.length > 0) {
            handleSendMsg(msg);
            setChatsInputValues({ ...chatsInputValues, [currentChat._id]: '' });
        }
    };

    const handleInputChange = event => {
        const value = event.target.value;
        setChatsInputValues({ ...chatsInputValues, [currentChat._id]: value });
    };

    return (
        <>
            <Container>
                <div className="button-container">
                    <div className="emoji">
                        <BsEmojiSmileFill onClick={handleEmojiPickerhideShow} />
                        {
                            showEmojiPicker && <Picker onEmojiClick={handleEmojiClick} />
                        }
                    </div>
                </div>
                <form className="input-container" onSubmit={e => sendChat(e)}>
                    <textarea
                        name="chat-main-input"
                        id="chat-main-input"
                        placeholder="Write a message..."
                        onInput={handleInputChange}
                        ref={inputRef}
                        value={chatsInputValues[currentChat._id]}
                    />
                    <button className="submit">
                        <IoMdSend />
                    </button>
                </form>
            </Container>
        </>
    )
}

const Container = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-around;
    background-color: ${({ theme }) => theme.colors.primary};
    padding: 0 2rem;
    gap: 1rem;
    height: 15%;
    @media screen and (min-width: 720px) and (max-width: 1080px) {
        padding: 0 1rem;
    }
    .button-container {
        display: flex;
        align-items: center;
        color: ${({ theme }) => theme.colors.font};
        gap: 1rem;
        .emoji {
            position: relative;
            svg {
                font-size: 1.5rem;
                color: ${({ theme }) => theme.colors.details};
                cursor: pointer;
            }
            .emoji-picker-react {
                position: absolute;
                top: -350px;
                background-color: ${({ theme }) => theme.colors.secondary};
                box-shadow: 0 5px 10px ${({ theme }) => theme.colors.accent};
                border-color: ${({ theme }) => theme.colors.accent};
                .emoji-scroll-wrapper::-webkit-scrollbar {
                    background-color: ${({ theme }) => theme.colors.secondary};
                    width: 5px;
                    &-thumb {
                        background-color: ${({ theme }) => theme.colors.accent};
                    }
                }
            .emoji-categories {
                button {
                    filter: contrast(0);
                }
            }
            .emoji-search {
                background-color: transparent;
                border-color: ${({ theme }) => theme.colors.accent};
            }
            .emoji-group:before {
                background-color: ${({ theme }) => theme.colors.secondary};
            }
        }
        }
    }
    .input-container {
        width: calc(100% - 1rem - 50px);
        border-radius: 2rem;
        display: flex;
        align-items: center;
        gap: 2rem;
        #chat-main-input {
            -moz-appearance: textfield;
            -webkit-appearance: textfield;
            display: inline-block;
            width: 90%;
            background-color: transparent;
            color: ${({ theme }) => theme.colors.font};
            border: none;
            padding-left: 1.5rem;
            font-size: 1rem;
            padding-bottom: 10px;
            padding-top: 10px;
            max-height: 44.78px;
            overflow-y: auto;
            resize: none;
            &::-webkit-scrollbar {
                width: 0.2rem;
                &-thumb {
                    background-color: ${({ theme }) => theme.colors.primary};
                    width: 0.1rem;
                    border-radius: 1rem;
                }
            }
            &:focus{
                border: none;
                outline: none;
            }
        }
        input {
            width: 90%;
            height: 30px;
            background-color: transparent;
            color: ${({ theme }) => theme.colors.font};
            border: none;
            padding-left: 1rem;
            font-size: 1.2rem;

            &::selection {
                color: ${({ theme }) => theme.colors.accent};
            }
            &:focus {
                outline: none;
            }
        }
        button {
            padding: 0.4rem 2rem;
            border-radius: 2rem;
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: transparent;
            border: none;
            cursor: pointer;
            @media screen and (min-width: 720px) and (max-width: 1080px) {
                padding: 0.4rem 1rem;
                svg {
                font-size: 1rem;
                }
            }
            svg {
                font-size: 2rem;
                color: ${({ theme }) => theme.colors.font};
            }
        }
    }
`;
