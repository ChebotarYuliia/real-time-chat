import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Logo from '../assets/logo.svg';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { loginRoute } from '../utils/APIRoutes';

function Login() {
    const navigate = useNavigate();
    const [values, setValues] = useState({
        username: '',
        password: '',
    });

    const toastOptions = {
        position: 'bottom-right',
        autoClose: 5000,
        pauseOnHover: true,
        draggable: true,
        theme: 'dark',
    };

    useEffect(() => {
        if (localStorage.getItem('chat-app-user')) {
            navigate('/');
        }
    }, []);

    const handleSubmit = async event => {
        event.preventDefault();
        if (handleValidation()) {
            const { password, username } = values;
            const { data } = await axios.post(loginRoute, {
                username,
                password,
            });

            ;
            if (data.status === true) {
                localStorage.setItem('chat-app-user', JSON.stringify(data.user));
                navigate('/');
            } else if (data.status === false) {
                toast.error(data.msg, toastOptions);
            };
        };
    };

    const handleValidation = () => {
        const { password, username } = values;
        let res = true;
        if (password === "") {
            toast.error('password is requered', toastOptions);
            res = false;
        };
        if (username === "") {
            toast.error('username is required', toastOptions);
            res = false;
        };
        return res;
    };

    const handleChange = event => {
        setValues({ ...values, [event.target.name]: event.target.value });
    };

    return (
        <>
            <FormContainer>
                <form onSubmit={e => handleSubmit(e)}>
                    <div className="brand">
                        <img src={Logo} alt="logo" />
                        <h1>snappy</h1>
                    </div>
                    <input type="text" placeholder='username' name='username' min="3" onChange={e => handleChange(e)} />
                    <input type="password" placeholder='password' name='password' onChange={e => handleChange(e)} />
                    <button type="submit">Log in</button>
                    <span>Don't have an accounte? <Link to="/register">Register</Link></span>
                </form>
            </FormContainer>
            <ToastContainer />
        </>
    )
};

const FormContainer = styled.div`
    height: 100vh;
    width: 100vw;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 1rem;
    align-items: center;
    background-color: ${({ theme }) => theme.colors.primary};
    .brand{
        display: flex;
        align-items: center;
        gap: 1rem;
        justify-content: center;
        img{
            height: 5rem;
        }
        h1{
            color: ${({ theme }) => theme.colors.font};
            text-transform: uppercase;
        }
    }
    form {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        background-color: ${({ theme }) => theme.colors.secondary};
        border-radius: 2rem;
        padding: 1.5rem 3rem;
    }
    input {
        background-color: transparent;
        padding: 1rem;
        border: 0.1rem solid ${({ theme }) => theme.colors.accent};
        border-radius: 0.4rem;
        color: ${({ theme }) => theme.colors.font};
        width: 100%;
        font-size: 1rem;
        &:focus {
            border: 0.1rem solid ${({ theme }) => theme.colors.accent};
            outline: none;
        }
    }
    button {
        background-color: ${({ theme }) => theme.colors.accent};
        color: ${({ theme }) => theme.colors.font};
        padding: 1rem 2rem;
        border: none;
        font-weight: bold;
        cursor: pointer;
        border-radius: 0.4rem;
        font-size: 1rem;
        text-transform: uppercase;
        &:hover {
            background-color: ${({ theme }) => theme.colors.accent};
        }
    }
    span {
        color: ${({ theme }) => theme.colors.font};
        text-transform: uppercase;
        a {
            color: ${({ theme }) => theme.colors.accent};
            text-decoration: none;
            font-weight: bold;
        }
    }
`;

export default Login;