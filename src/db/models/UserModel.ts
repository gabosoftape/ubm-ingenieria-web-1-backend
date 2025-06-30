import {DataTypes, Model, Optional} from "sequelize";
import {sequelize} from '../../config/sequelizeConfig';

export interface UserAttributes {
    id: string;
    name: string;
    email: string;
    identification: string;
    phone?: string;
    user_type: string | undefined;
    google_uid?: string;
    photo_url?: string;
    auth_provider?: string;
}

export interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {}

class UserModel extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
    public id!: string;
    public name!: string;
    public email!: string;
    public identification!: string;
    public phone!: string;
    public user_type!: string | undefined;
    public google_uid!: string;
    public photo_url!: string;
    public auth_provider!: string;
}

UserModel.init( {
    id: {
        allowNull: false,
        autoIncrement: false,
        primaryKey: true,
        type: DataTypes.STRING,
    },
    name: {
        field: 'name',
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        field: 'email',
        type: DataTypes.STRING,
        allowNull: false,
    },
    identification: {
        field: 'identification',
        type: DataTypes.STRING,
        allowNull: false,
    },
    phone: {
        field: 'phone',
        type: DataTypes.STRING,
        allowNull: false,
    },
    user_type: {
        field: 'user_type',
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'user'
    },
    google_uid: {
        field: 'google_uid',
        type: DataTypes.STRING,
        allowNull: true,
    },
    photo_url: {
        field: 'photo_url',
        type: DataTypes.STRING,
        allowNull: true,
    },
    auth_provider: {
        field: 'auth_provider',
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: 'local'
    },
}, {
    sequelize,
    tableName: 'users'
});
export default UserModel;