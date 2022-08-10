import React from 'react';
import styled from 'styled-components';
import { BsFillGearFill } from 'react-icons/bs';

export default function ProfileSettingsBtn({ handleProfileSettingsIsOn }) {

    const handleClick = () => {
        handleProfileSettingsIsOn();
    };

    return (
        <>
            <Button onClick={handleClick}>
                <BsFillGearFill />
            </Button>
        </>
    )
};

const Button = styled.button`
    padding: 0.5rem;
    background-color: transparent;
    border: none;
    cursor: pointer;
    margin-left: auto;
    svg {
        font-size: 1.3rem;
        color: #ebe7ff;
        transition: all .5s;
        transform-origin: 50% 50%;
    }
    &:hover{
        svg{
            animation-name: spin;
            animation-duration: .5s;
            animation-timing-function: ease-in-out;
        }
    }

    @keyframes spin {
        0%   { transform: rotate(360deg); }
        100% {transform: rotate(0deg); }
    }
`;
