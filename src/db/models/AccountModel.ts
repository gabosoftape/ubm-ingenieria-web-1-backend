import { DataTypes, Model, Optional } from "sequelize";
import {sequelize} from '../../config/sequelizeConfig'

export interface AccountAttributes {
    id: number;
    name: string;
    domain: string;
    parent_account_id?: number;
}

interface AccountCreationAttributes extends Optional<AccountAttributes, 'id'> {}

class AccountModel extends Model<AccountAttributes, AccountCreationAttributes> implements AccountAttributes {
    public id!: number;
    public name!: string;
    public domain!: string;
    public parent_account_id!: number;

}

AccountModel.init( {
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
    },
    name: {
        field: 'name',
        type: DataTypes.STRING,
        allowNull: false,
    },
    domain: {
        field: 'domain',
        type: DataTypes.TEXT,
        allowNull: false,
    },
    parent_account_id: {
        field: 'parent_account_id',
        type: DataTypes.INTEGER,
        allowNull: true,
    }
}, {
    sequelize,
    tableName: 'account'
});
export default AccountModel;
