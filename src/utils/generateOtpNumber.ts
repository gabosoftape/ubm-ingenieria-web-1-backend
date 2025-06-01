export function generateOtpNumber(otpLength: number) {
    let otp = '';
    for (let i = 0; i < otpLength; i++) {
        const randomDigit = Math.floor(Math.random() * 10); // Genera un número aleatorio entre 0 y 9
        otp += randomDigit.toString();
    }
    return otp as string;
}