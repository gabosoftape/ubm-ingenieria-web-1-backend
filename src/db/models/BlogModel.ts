import {DataTypes, Model, Optional} from "sequelize";
import {sequelize} from '../../config/sequelizeConfig';

export interface BlogAttributes {
    id: string;
    name: string;
    description: string;
    text: string;
    account_id: number;
}

export interface BlogCreationAttributes extends Optional<BlogAttributes, 'id'> {}

class BlogModel extends Model<BlogAttributes, BlogCreationAttributes> implements BlogAttributes {
    public id!: string;
    public name!: string;
    public description!: string;
    public text!: string;
    public account_id!: number;
}

BlogModel.init( {
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
    description: {
        field: 'description',
        type: DataTypes.STRING,
        allowNull: true,
    },
    text: {
        field: 'text',
        type: DataTypes.TEXT,
        allowNull: true,
    },
    account_id: {
        field: 'account_id',
        type: DataTypes.INTEGER,
        allowNull: false,
    }
}, {
    sequelize,
    tableName: 'blogs'
});
export default BlogModel;