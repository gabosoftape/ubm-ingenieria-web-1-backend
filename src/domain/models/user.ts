export interface IUserResponse<t> {
    status: number;
    message: string;
    data: t | null;
}

export interface IUsersResponse<t> {
    status: number;
    message: string;
    data: t[];
    count: number;
}

export interface IUserToken {
    id: string;
    email: string;
    role: string;
}

/**
 * @openapi
 * components:
 *   schemas:
 *     UserRequestModel:
 *       type: object
 *       required:
 *         - id
 *         - name
 *         - email
 *         - identification
 *         - phone
 *       properties:
 *         id:
 *           type: string
 *           description: ID único del usuario
 *         name:
 *           type: string
 *           description: Nombre del usuario
 *         email:
 *           type: string
 *           format: email
 *           description: Correo electrónico del usuario
 *         identification:
 *           type: string
 *           description: Número de identificación del usuario
 *         phone:
 *           type: string
 *           description: Número de teléfono del usuario
 *         user_type:
 *           type: string
 *           description: Tipo de usuario
 *           nullable: true
 * 
 *     CreateUserDto:
 *       type: object
 *       required:
 *         - id
 *         - name
 *         - email
 *         - identification
 *         - phone
 *         - account_id
 *       properties:
 *         id:
 *           type: string
 *           description: ID único del usuario
 *         name:
 *           type: string
 *           description: Nombre del usuario
 *         email:
 *           type: string
 *           format: email
 *           description: Correo electrónico del usuario
 *         identification:
 *           type: string
 *           description: Número de identificación del usuario
 *         phone:
 *           type: string
 *           description: Número de teléfono del usuario
 *         user_type:
 *           type: string
 *           description: Tipo de usuario
 *           nullable: true
 *         account_id:
 *           type: integer
 *           description: ID único de la cuenta
 *          
 * 
 *     UserResponseModel:
 *       type: object
 *       required:
 *         - id
 *         - name
 *         - email
 *         - identification
 *         - phone
 *       properties:
 *         id:
 *           type: string
 *           description: ID único del usuario
 *         name:
 *           type: string
 *           description: Nombre del usuario
 *         email:
 *           type: string
 *           format: email
 *           description: Correo electrónico del usuario
 *         identification:
 *           type: string
 *           description: Número de identificación del usuario
 *         phone:
 *           type: string
 *           description: Número de teléfono del usuario
 *         user_type:
 *           type: string
 *           description: Tipo de usuario
 *           nullable: true
 *         
 * 
 *     EditUserDto:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - identification
 *         - phone
 *       properties:
 *         name:
 *           type: string
 *           description: Nombre del usuario
 *         email:
 *           type: string
 *           format: email
 *           description: Correo electrónico del usuario
 *         identification:
 *           type: string
 *           description: Número de identificación del usuario
 *         phone:
 *           type: string
 *           description: Número de teléfono del usuario
 *         user_type:
 *           type: string
 *           description: Tipo de usuario
 *           nullable: true
 */


export interface UserRequestModel {

    id: string;
    name: string;
    email: string;
    identification: string;
    phone: string;
    user_type: string | undefined;
}



export interface UserResponseModel {
    id: string;
    name: string;
    email: string;
    identification: string;
    phone: string;
    user_type: string | undefined;
}

export interface CreateUserDto extends UserRequestModel{
    account_id: number;
}
export interface EditUserDto extends CreateUserDto {}
export interface GeneralUserDto extends CreateUserDto {
    account_name: string,
}

export interface CreateUserResponseDto extends CreateUserDto{}
export interface EditUserResponseDto extends CreateUserDto{}