import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../../../services/authService";
import { isUsernameUnique } from "../../../services/userService";
import styles from './Register.module.css';

export const Register = () => {
    const navigate = useNavigate();
    const [input, setInput] = useState({
        username: '',
        email: '',
        password: '',
        rePassword: ''
    })
    const [errors, setErrors] = useState({
        username: false,
        uniqueUsername: false,
        email: false,
        password: false,
        rePassword: false,
    })
    const [authErrors, setAuthErrors] = useState({
        usernameNotUnique: false,
        emailTaken: false
    })
    const [formValid, setFormValid] = useState(false);

    const onChangeHandler = (e) => {
        setInput(state => ({
            ...state,
            [e.target.name]: e.target.value
        }))
        setErrors(state => ({
            ...state,
            [e.target.name]: false,
        }))
        setAuthErrors(false, false);
        setFormValid(
            input.username.length >= 3 && input.username.length <= 15
            && (/\S+@\S+\.\S+/.test(input.email))
            && input.password.length >= 6 && input.password.length <= 50
            && input.rePassword.length >= 5 && input.rePassword.length <= 51)
    }

    const onSubmit = (e) => {
        e.preventDefault();


        if (input.password !== input.rePassword) {
            setErrors(state => ({
                ...state,
                rePassword: true
            }))
            return;
        }

        isUsernameUnique(input.username)
            .then(result => {
                if (!result) {
                    setAuthErrors(state => ({
                        ...state,
                        usernameNotUnique: true
                    }))
                    return;
                }

                register(input.username, input.email, input.password)
                    .then(() => {
                        navigate('/');
                    })
                    .catch((e) => {
                        if (e.code === "auth/email-already-in-use") {
                            setAuthErrors(state => ({
                                ...state,
                                emailTaken: true
                            }))
                        }
                        else {
                            console.log(e.code);
                            navigate('/not-found');
                        }
                    })
            })


    }


    const usernameValidator = (e) => {
        setErrors(state => ({
            ...state,
            username: input.username.length < 3 || input.username.length > 15,
        }))
    }

    const emailValidator = (e) => {
        setErrors(state => ({
            ...state,
            email: !(/\S+@\S+\.\S+/.test(input.email))
        }))
    }

    const passwordValidator = (e) => {
        setErrors(state => ({
            ...state,
            password: input.password.length < 6 || input.password.length > 50
        }))
    }

    const rePasswordValidator = (e) => {
        setErrors(state => ({
            ...state,
            rePassword: input.password !== input.rePassword
        }))
    }


    return (
        <form id="register" onSubmit={onSubmit}>
            <div className={styles.container}>
                <h1 className={styles.title}>Register</h1>

                <div className={styles.area}>
                    <label className={styles.label} htmlFor="username">Username</label>
                    <input className={styles.input}
                        type="text" id="username" name="username"
                        placeholder="John"
                        value={input.username}
                        onChange={onChangeHandler}
                        onBlur={usernameValidator} />
                    {errors.username && <p className={styles.error}>Username should be between 3 and 15 characters long!</p>}
                </div>

                <div className={styles.area}>
                    <label className={styles.label} htmlFor="email">Email</label>
                    <input className={styles.input}
                        type="email" id="email" name="email"
                        placeholder="john@email.com"
                        value={input.email}
                        onChange={onChangeHandler}
                        onBlur={emailValidator} />
                    {errors.email && <p className={styles.error}>Please use a valid email!</p>}
                </div>

                <div className={styles.area}>
                    <label className={styles.label} htmlFor="password">Password</label>
                    <input className={styles.input}
                        type="password" id="password" name="password"
                        placeholder="*********"
                        value={input.password}
                        onChange={onChangeHandler}
                        onBlur={passwordValidator} />
                    {errors.password && <p className={styles.error}>Password should be between 6 and 50 characters long!</p>}
                </div>

                <div className={styles.area}>
                    <label className={styles.label} htmlFor="rePassword">Repeat Password</label>
                    <input className={styles.input}
                        type="password" id="rePassword" name="rePassword"
                        placeholder="*********"
                        value={input.rePassword}
                        onChange={onChangeHandler}
                        onBlur={rePasswordValidator} />
                    {errors.rePassword && <p className={styles.error}>Passwords should match!</p>}
                </div>

                <div>
                    <input type="submit" disabled={!formValid} className={styles.btn} value="Register" />
                    {authErrors.emailTaken && <p className={styles.error}>Email is already taken!</p>}
                    {authErrors.usernameNotUnique && <p className={styles.error}>Username is already taken!</p>}
                </div>

                <div>
                    <p>Already have a profile? <span><Link className={styles.span} to='/login'>Click here.</Link></span></p>
                </div>
            </div>
        </form>
    );
}