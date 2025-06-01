import { DataTypes, Model, Optional } from "sequelize";
import {sequelize} from '../../config/sequelizeConfig'

export interface OtpDataAttributes {
    id: number;
    otp: string;
    token: string;
    create_date: number;
    end_date: number;
    status: boolean;
}

export interface OtpDataCreationAttributes extends Optional<OtpDataAttributes, 'id'> {}

class OtpDataModel extends Model<OtpDataAttributes, OtpDataCreationAttributes> implements OtpDataAttributes {
    public id!: number;
    public otp!: string;
    public token!: string;
    public create_date!: number;
    public end_date!: number;
    public status!: boolean;
}

OtpDataModel.init( {
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
    },
    otp: {
        field: 'otp',
        type: DataTypes.STRING,
        allowNull: false,
    },
    token: {
        field: 'token',
        type: DataTypes.STRING(500),
        allowNull: false,
    },
    create_date: {
        field: 'create_date',
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    end_date: {
        field: 'end_date',
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    status: {
        field: 'status',
        type: DataTypes.BOOLEAN,
        allowNull: true,
    },
}, {
    sequelize,
    tableName: 'otp_data'
});
export default OtpDataModel;
