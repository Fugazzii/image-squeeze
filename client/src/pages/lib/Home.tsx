import "./styles/Home.css";
import { Fragment, useLayoutEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { AddProductInterface, UserInterface } from "@src/interfaces";
import { findUsers } from "@src/api/lib/users";
import { findProducts, insertOneProduct } from "@src/api";
import { CardTitle, InputField, Icon } from "@src/components";

export function Home() {
    const [products, setProducts] = useState<Array<UserInterface>>([]);

    useLayoutEffect(() => {
        const fetchProducts = async () => {
            if (!sessionStorage["token"]) {
            window.location.href = "/sign-in";
            return;
	    };
            const { data } = await findProducts(sessionStorage["token"]);
            return data;
        };

        fetchProducts().then((res) => {
            setProducts(res);
            console.log(products);
        });
    }, []);

    const handleAddProduct = async (e: any) => {
        e.preventDefault();
        
        const currentProduct: AddProductInterface = {
            title: titleRef.current.value,
            img: imageRef.current.files[0],
            quantity: quantityRef.current.value,
            price: priceRef.current.value
        };
        const response = await insertOneProduct(sessionStorage["token"], currentProduct);

        return response;
    }

    const titleRef = useRef<any>();
    const priceRef = useRef<any>();
    const quantityRef = useRef<any>();
    const imageRef = useRef<any>();

    return (
        <div className='home-container'>
            <h1>Welcome to our website!</h1>
            <Link to='/sign-up' className='sign-up-button'>
                Sign Up
            </Link>

            <Link to='/sign-in' className='sign-up-button'>
                Sign In
            </Link>

            <div className='container'>
                <div className='row'>
                    <div className='col-md-6 mx-auto py-4 px-0'>
                        <div className='card p-0'>
                            <CardTitle />

                            <form className='signup' onSubmit={handleAddProduct} encType="multipart/form-data">
                                <InputField
                                    Ref={titleRef}
                                    type='text'
                                    placeholder='Title'
                                />
                                <InputField
                                    Ref={priceRef}
                                    type='number'
                                    placeholder='Price'
                                />
                                <InputField
                                    Ref={quantityRef}
                                    type='number'
                                    placeholder='quantity'
                                />
                                <InputField
                                    Ref={imageRef}
                                    type='file'
                                />

                                <button 
                                    type='submit'
                                    className='btn btn-primary'
                                >
                                    Add product
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
                                        <Icon
                                            href='#'
                                            context='fab fa-facebook'
                                        />
                                        <Icon
                                            href='#'
                                            context='fab fa-twitter'
                                        />
                                        <Icon
                                            href='#'
                                            context='fab fa-linkedin'
                                        />
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
