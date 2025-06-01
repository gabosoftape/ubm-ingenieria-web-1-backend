import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import {IUserToken} from "../domain/models/user";

dotenv.config();

const secret = process.env.JWT_SECRET || 'dsf456sdf65sd4fsd56-prime';
const timeExpires = process.env.JWT_EXPIRES_IN || '43200s';

export function generateTokenAuth(payload: IUserToken): string {
    return jwt.sign(payload, secret, {
        expiresIn: timeExpires,
    });
}
export function verifyTokenAuth(token: string): string | jwt.JwtPayload | null {
    try {
        return jwt.verify(token, secret);
    } catch (error) {
        console.log(error);
        return null
    }
}



