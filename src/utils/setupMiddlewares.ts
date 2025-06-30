import { AccountRepository } from "../domain/repository/account-repository";
import { AuthRepository } from "../domain/repository/auth-repository";
import { OtpRepository } from "../domain/repository/otp-repository";
import { UserRepository } from "../domain/repository/user-repository";
import { AccountService } from "../infrastructure/services/account-service";
import { AuthService } from "../infrastructure/services/auth-service";
import { OtpService } from "../infrastructure/services/otp-service";
import { UserService } from "../infrastructure/services/user-service";
import { CreateAccount } from "../infrastructure/use-cases/account/create-account";
import { DeleteAccount } from "../infrastructure/use-cases/account/delete-account";
import { GetAllAccount } from "../infrastructure/use-cases/account/get-all-account";
import { GetSelfAvailableAccounts } from "../infrastructure/use-cases/account/get-self-available-accounts";
import { UpdateAccount } from "../infrastructure/use-cases/account/update-account";
import { LoginUseCase } from "../infrastructure/use-cases/auth/login-use-case";
import { RegisterUseCase } from "../infrastructure/use-cases/auth/register-use-case";
import { LoginGoogleUseCase } from "../infrastructure/use-cases/auth/login-google-use-case";
import { RegisterGoogleUseCase } from "../infrastructure/use-cases/auth/register-google-use-case";
import { VerifyAuthTokenCaseUse } from "../infrastructure/use-cases/auth/verify-auth-token-case-use";
import { VerifyUserByPhone } from "../infrastructure/use-cases/auth/verify-user-by-phone";
import { SendMessageOtpUseCase } from "../infrastructure/use-cases/otp/send-message-otp-use-case";
import { VerifyOtpUseCase } from "../infrastructure/use-cases/otp/verify-otp-use-case";
import { VerifyRecaptchaUseCase } from "../infrastructure/use-cases/otp/verify-recaptcha-use-case";
import { CreateUser } from "../infrastructure/use-cases/user/create-user";
import { DeleteUser } from "../infrastructure/use-cases/user/delete-user";
import { GetAllUsersByAccount } from "../infrastructure/use-cases/user/get-all-users-by-account";
import { GetUserByEmail } from "../infrastructure/use-cases/user/get-user-by-email";
import { UpdateUser } from "../infrastructure/use-cases/user/update-user";
import AccountsRouter from "../presentation/routers/accounts_router";
import AuthRouter from "../presentation/routers/auth-router";
import OtpRouter from "../presentation/routers/otp-router";
import UserRouter from "../presentation/routers/user-router";
import { UpdateUserPasswordUseCase } from "../infrastructure/use-cases/auth/update-user-password-case-use";
import { AssociateUserToAccountsUseCase } from "../infrastructure/use-cases/account/associate-user-to-accounts";
import { BlogRepository } from "../domain/repository/blog-repository";
import { CreateBlogUseCase } from "../infrastructure/use-cases/blog/create-blog";
import { UpdateBlogUseCase } from "../infrastructure/use-cases/blog/update-blog";
import { DeleteBlogUseCase } from "../infrastructure/use-cases/blog/delete-blog";
import { GetAllBlogsByAccountUseCase } from "../infrastructure/use-cases/blog/get-all-blogs-by-account";
import { BlogService } from "../infrastructure/services/blog-service";
import BlogsRouter from "../presentation/routers/blog-router";

export function setupMiddlewares() {
    // instances of the repository class
    const accountDataStorage = new AccountRepository();
    const userDataStorage = new UserRepository();
    const authDataStorage = new AuthRepository();
    const otpDataStorage = new OtpRepository();
    const blogDataStorage = new BlogRepository();

    // middleware for accounts
    const accountMiddleware = AccountsRouter(
        new CreateAccount(new AccountService(accountDataStorage, userDataStorage)),
        new UpdateAccount(new AccountService(accountDataStorage, userDataStorage)),
        new DeleteAccount(new AccountService(accountDataStorage, userDataStorage)),
        new GetAllAccount(new AccountService(accountDataStorage, userDataStorage)),
        new GetSelfAvailableAccounts(new AccountService(accountDataStorage, userDataStorage)),
        new AssociateUserToAccountsUseCase(new AccountService(accountDataStorage, userDataStorage))
    );

    // middleware for users
    const userMiddleware = UserRouter(
        new CreateUser(new UserService(userDataStorage, accountDataStorage)),
        new GetAllUsersByAccount(new UserService(userDataStorage, accountDataStorage)),
        new GetUserByEmail(new UserService(userDataStorage, accountDataStorage)),
        new UpdateUser(new UserService(userDataStorage, accountDataStorage)),
        new DeleteUser(new UserService(userDataStorage, accountDataStorage)),
    );

    // middleware for auth
    const authMiddleware = AuthRouter(
        new VerifyUserByPhone(new AuthService(authDataStorage)),
        new VerifyAuthTokenCaseUse(new AuthService(authDataStorage)),
        new LoginUseCase(new AuthService(authDataStorage)),
        new RegisterUseCase(new AuthService(authDataStorage)),
        new LoginGoogleUseCase(new AuthService(authDataStorage)),
        new RegisterGoogleUseCase(new AuthService(authDataStorage)),
        new UpdateUserPasswordUseCase(new AuthService(authDataStorage))
    );

    // middleware for otp
    const otpMiddleware = OtpRouter(
        new SendMessageOtpUseCase(new OtpService(otpDataStorage)),
        new VerifyOtpUseCase(new OtpService(otpDataStorage)),
        new VerifyRecaptchaUseCase(new OtpService(otpDataStorage)),
    );

    // middleware for blogs
    const blogMiddleware = BlogsRouter(
        new CreateBlogUseCase(new BlogService(blogDataStorage, accountDataStorage)),
        new GetAllBlogsByAccountUseCase(new BlogService(blogDataStorage, accountDataStorage)),
        new UpdateBlogUseCase(new BlogService(blogDataStorage, accountDataStorage)),
        new DeleteBlogUseCase(new BlogService(blogDataStorage, accountDataStorage)),
    );

    return { 
        accountMiddleware, 
        userMiddleware, 
        authMiddleware, 
        otpMiddleware,
        blogMiddleware
    }
}