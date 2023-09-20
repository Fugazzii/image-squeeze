import "./styles/SignUp.css";

import { useLayoutEffect, useRef } from "react";

import { login } from "@src/api";
import { CardTitle, Icon, InputField } from "@src/components/";
import { useAuth } from "@src/hooks";

export const SignIn = () => {
    const emailRef = useRef<any>();
    const passwordRef = useRef<any>();

    const { setUser, setToken, token } = useAuth();

    useLayoutEffect(() => {
        if (token) {
            window.location.href = "/";
        }
    }, [token]);

    const handleLogin = async () => {
        const currentUser = {
            email: emailRef.current.value,
            pwd: passwordRef.current.value,
        };

        const response = await login(currentUser);

        console.log(currentUser, response);

        if (!response.success || !response.data) {
            console.log("Failed to login!");
            return;
        }

        setToken(response.data);
        sessionStorage.setItem("token", response.data);
    };

    return (
        <div className='container'>
            <div className='row'>
                <div className='col-md-6 mx-auto py-4 px-0'>
                    <div className='card p-0'>
                        <CardTitle />

                        <form className='signup'>
                            <InputField
                                Ref={emailRef}
                                type='text'
                                placeholder='Email'
                            />
                            <InputField
                                Ref={passwordRef}
                                type='password'
                                placeholder='Password'
                            />

                            <button
                                type='button'
                                className='btn btn-primary'
                                onClick={handleLogin}
                            >
                                Login
                            </button>

                            <div className='row'>
                                <div className='col-6 col-sm-6'>
                                    <a href='#'>
                                        <p className='text-left pt-2 ml-1'>
                                            Register
                                        </p>
                                    </a>
                                </div>
                            </div>
                            <span className='text-center'>Or</span>
                            <span className='text-center pt-3'>
                                Continue Using
                            </span>
                            <div className='row'>
                                <div className='d-flex mx-auto pt-1 pb-3'>
                                    <Icon href='#' context='fab fa-facebook' />
                                    <Icon href='#' context='fab fa-twitter' />
                                    <Icon href='#' context='fab fa-linkedin' />
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};
