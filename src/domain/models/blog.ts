export interface IBlogResponse<t> {
    status: number;
    message: string;
    data: t | null;
}

export interface IBlogsResponse<t> {
    status: number;
    message: string;
    data: t[];
    count: number;
}

/**
 * @openapi
 * components:
 *   schemas:
 *     BlogsRequestModel:
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


export interface BlogRequestModel {
    id: string;
    name: string;
    description: string;
    text: string;
    account_id: number;
}



export interface BlogResponseModel {
    id: string;
    name: string;
    description: string;
    text: string;
    account_id: number;
}

export interface CreateBlogDto extends BlogRequestModel{
    account_id: number;
}
export interface EditBlogDto extends CreateBlogDto {}
export interface GeneralBlogDto extends CreateBlogDto {
    account_name: string,
}

export interface CreateBlogResponseDto extends CreateBlogDto{}
export interface EditBlogResponseDto extends CreateBlogDto{}