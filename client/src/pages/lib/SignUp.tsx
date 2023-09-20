import "./styles/SignUp.css";

import { useEffect, useLayoutEffect, useRef } from "react";

import { register } from "@src/api";
import { CardTitle, Icon, InputField } from "@src/components/";
import { useAuth } from "@src/hooks";

export const SignUp = () => {
    const emailRef = useRef<any>();
    const passwordRef = useRef<any>();
    const usernameRef = useRef<any>();

    const { token } = useAuth();

    useLayoutEffect(() => {
        if (token) {
            window.location.href = "/";
        }
    }, [token]);

    const handleRegister = async () => {
        const currentUser = {
            email: emailRef.current.value,
            pwd: passwordRef.current.value,
            username: usernameRef.current.value,
        };

        const response = await register(currentUser);
        if(response.success) {
            window.location.href = "/sign-in";
        } else {
            console.log(response.message)
        }
    };

    return (
        <div className='container'>
            <div className='row'>
                <div className='col-md-6 mx-auto py-4 px-0'>
                    <div className='card p-0'>
                        <CardTitle />

                        <form className='signup'>
                            <InputField
                                Ref={usernameRef}
                                type='text'
                                placeholder='Username'
                            />
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
                                onClick={handleRegister}
                            >
                                Register
                            </button>

                            <div className='row'>
                                <div className='col-6 col-sm-6'>
                                    <a href='#'>
                                        <p className='text-left pt-2 ml-1'>
                                            Login
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
