import { BaseSyntheticEvent, Dispatch, SetStateAction, useState } from 'react'
import styles from '../UserLogin/UserLogin.module.css';
import Cookies, { CookieSetOptions } from 'universal-cookie';
import axios, { AxiosError } from "axios";
import { ApolloClient, NormalizedCacheObject } from '@apollo/client';

const cookies = new Cookies();

interface IProps {
    client: ApolloClient<NormalizedCacheObject>;
    authenticated: boolean;
    setAuthenticated: Dispatch<SetStateAction<boolean>>;
}

function UserLogin(props: IProps) {
    const [userName, setUserName] = useState<string>("");
    const [password, setPassword] = useState<string>("");


    const handleUserNameChange = (e: BaseSyntheticEvent) => {
        setUserName(e.target.value);
    };

    const handlePasswordChange = (e: BaseSyntheticEvent) => {
        setPassword(e.target.value);
    };

    const handleSubmit = async () => {
        const data = {
            username: userName,
            password: password
        };
        axios.post("http://localhost:5162/api/Account/login",
            data, { withCredentials: true, headers: {} }
        ).then((response: any) => {
            const options: CookieSetOptions = {
                expires: new Date(response.data.cookieExpiryDate),
                httpOnly: false,
                secure: false,
                sameSite: false,
            };
            props.setAuthenticated(true);
            cookies.set("authToken", response.data.token, options);
        }).catch((error: AxiosError | Error) => {
            if (axios.isAxiosError(error)) {
            } else {
            }
            props.setAuthenticated(false);
            cookies.remove("authToken");
            alert(error.message);
        });
    };

    return (
        <>
            <div className={styles.parentdiv}>
                <div className={styles.loginform}>
                    <h2 className={styles.headerTitle}>{"Login"}</h2>
                    <FormInput description="Username" placeholder="Enter your username" type="text" onChange={handleUserNameChange} />
                    <FormInput description="Password" placeholder="Enter your password" type="password" onChange={handlePasswordChange} />
                    <FormButton title="Log in" handleSubmit={handleSubmit} />
                </div>
            </div>
        </>


    )
};



const FormInput = (props: any) => (
    <div className={styles.row} >
        <label>{props.description}</label>
        <input type={props.type} placeholder={props.placeholder} onChange={props.onChange} />
    </div>
);

const FormButton = (props: any) => (
    <div className={styles.row + " " + styles.button}>
        <button onClick={props.handleSubmit}>{props.title}</button>
    </div>
);





export default UserLogin;

