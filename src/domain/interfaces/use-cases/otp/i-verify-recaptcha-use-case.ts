export interface IVerifyRecaptchaUseCase {
    execute(recaptcha: string):Promise<boolean>;
}