import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Logo from '../assets/logo.svg';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { registerRoute } from '../utils/APIRoutes';

function Register() {
    const navigate = useNavigate();
    const [values, setValues] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
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
            const { password, username, email } = values;
            const { data } = await axios.post(registerRoute, {
                username,
                email,
                password,
            });

            if (data.status === true) {
                localStorage.setItem('chat-app-user', JSON.stringify(data.user));
            } else if (data.status === false) {
                toast.error(data.msg, toastOptions);
            };
            navigate('/');
        };
    };

    const handleValidation = () => {
        const { password, confirmPassword, username, email } = values;
        let res = true;
        if (password !== confirmPassword) {
            toast.error('passwords should be the same', toastOptions);
            res = false;
        };
        if (password.length < 8) {
            toast.error('password should be equal or longer than 8 characters', toastOptions);
            res = false;
        };
        if (username.length < 3) {
            toast.error('username should be longer than 3 characters', toastOptions);
            res = false;
        };
        if (email === "") {
            toast.error('email is requared', toastOptions);
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
                    <input type="text" placeholder='username' name='username' onChange={e => handleChange(e)} />
                    <input type="email" placeholder='email' name='email' onChange={e => handleChange(e)} />
                    <input type="password" placeholder='password' name='password' onChange={e => handleChange(e)} />
                    <input type="password" placeholder='confirm password' name='confirmPassword' onChange={e => handleChange(e)} />
                    <button type="submit">Create user</button>
                    <span>Already have an accounte? <Link to="/login">Login</Link></span>
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
    background-color: #131324;
    .brand{
        display: flex;
        align-items: center;
        gap: 1rem;
        justify-content: center;
        img{
            height: 5rem;
        }
        h1{
            color: white;
            text-transform: uppercase;
        }
    }
    form {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        background-color: #00000076;
        border-radius: 2rem;
        padding: 1.5rem 3rem;
    }
    input {
        background-color: transparent;
        padding: 1rem;
        border: 0.1rem solid #4e0eff;
        border-radius: 0.4rem;
        color: white;
        width: 100%;
        font-size: 1rem;
        &:focus {
        border: 0.1rem solid #997af0;
        outline: none;
        }
    }
    button {
        background-color: #997af0;
        color: white;
        padding: 1rem 2rem;
        border: none;
        font-weight: bold;
        cursor: pointer;
        border-radius: 0.4rem;
        font-size: 1rem;
        text-transform: uppercase;
        &:hover {
        background-color: #4e0eff;
        }
    }
    span {
        color: white;
        text-transform: uppercase;
        a {
        color: #4e0eff;
        text-decoration: none;
        font-weight: bold;
        }
    }
`;

export default Register;