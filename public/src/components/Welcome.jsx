import React from 'react';
import styled from 'styled-components';
import Robot from '../assets/robot.gif';

export default function Welcome({ currentUser }) {
    return (
        <>
            <Container>
                <img src={Robot} alt="welcome picture" />
                <h1>Welcome <span>{currentUser?.username || 'dear'}</span> !</h1>
                <h3>Please select a chat to Start</h3>
            </Container>
        </>
    )
};

const Container = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    color: ${({ theme }) => theme.colors.font};
    flex-direction: column;
    img {
        height: 20rem;
    }
    span {
        color: ${({ theme }) => theme.colors.secondary};
    }
`;
