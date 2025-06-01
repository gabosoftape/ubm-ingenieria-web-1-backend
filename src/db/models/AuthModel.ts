import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../../config/sequelizeConfig";

export interface AuthAttributes {
    id: string;
    password: string;
    user_id: string;
}

export interface AuthAttributesCreationAttributes extends Optional<AuthAttributes, 'id'> {}

class AuthEntity extends Model<AuthAttributes, AuthAttributesCreationAttributes> implements AuthAttributes {
    public id!: string;
    public password!: string;
    public user_id!: string;
}

AuthEntity.init({
    id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
    },
    password: {
        field: 'password',
        type: DataTypes.TEXT,
        allowNull: false,
    },
    user_id: {
        field: 'user_id',
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    sequelize,
    tableName: 'auth'
});

export default AuthEntity;