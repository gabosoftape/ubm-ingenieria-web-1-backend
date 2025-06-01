import { NextFunction, Request, Response } from 'express';
import {verifyTokenAuth} from "../config/jsonwebtoken";

export interface IGetAuthTokenRequest extends Request {
    authToken: string;
    authRole: string;
    authEmail: string;
    authUserId: string;
    isAdmin: boolean;
}

export interface IAuthDataRequest{
    authRole: string;
    authEmail: string;
    authUserId: string;
}

export interface IGetAuthTokenUser {
    id: string;
    email: string;
    role: string;
    iat: number;
    exp: number
}

export const getAuthToken = (req: Request, _res: Response, next: NextFunction) => {
    let authToken = "";
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        authToken = req.headers.authorization.split(' ')[1];
    }

    if (authToken) {
        (req as IGetAuthTokenRequest).authToken = authToken;
        next();
    } else {
        (req as IGetAuthTokenRequest).authToken = "Not Authorized";
        next()
    }
};

export const checkIfAuthenticated = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const authToken = (req as IGetAuthTokenRequest).authToken;
    console.info("Se encontro este token en el request ", authToken);
    if (!authToken) {
        return res.status(401).send({ error: 'You are not authorized to make this request' });
    }

    try {
        // decode token
        const userInfo = verifyTokenAuth(authToken);
        console.log("user info in auth middleware", userInfo);
        if(userInfo){
            if(typeof userInfo !== 'string'){
                let userdata =  userInfo as IGetAuthTokenUser;
                let expireDate = new Date(userdata.exp * 1000);
                let remainingTime = ((userdata.exp * 1000) - Date.now()) / 1000;
                console.log("este token expira ", expireDate, remainingTime, (remainingTime / 3600));
                (req as IGetAuthTokenRequest).authRole = userdata.role;
                (req as IGetAuthTokenRequest).authEmail = userdata.email;
                (req as IGetAuthTokenRequest).authUserId = userdata.id;
            }
        }

        return next();
    } catch (e) {
        console.log(e);
        return res.status(401).send({ error: 'You are not authorized to make this request' });
    }
};