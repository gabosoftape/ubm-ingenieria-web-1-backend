import {sequelize} from '../../config/sequelizeConfig';
import {DataTypes, Model, Optional} from "sequelize";

export interface AccountUserRelAttributes {
    id: number;
    account_id: number;
    user_id: string;
}
export interface AccountUserRelCreationAttributes extends Optional<AccountUserRelAttributes, 'id'> {}

class AccountUserRelModel extends Model<AccountUserRelAttributes, AccountUserRelCreationAttributes> implements AccountUserRelAttributes {
    public id!: number;
    public account_id!: number;
    public user_id!: string;
}

AccountUserRelModel.init({
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
    },
    account_id: {
        field: 'account_id',
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    user_id: {
        field: 'user_id',
        type: DataTypes.STRING,
        allowNull: false,
    }
}, {
    sequelize,
    tableName: 'account_user_rel'
});

export default AccountUserRelModel;