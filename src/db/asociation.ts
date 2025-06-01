import UserModel from "./models/UserModel";
import AccountModel from "./models/AccountModel";
import AccountUserRelModel from "./models/AccountUserRelModel";



// rel account-----account_user_rel------user
AccountModel.belongsToMany(UserModel, {
    through: AccountUserRelModel,
    as: 'users',
    foreignKey: 'account_id',
    onDelete: 'CASCADE'
});
UserModel.belongsToMany(AccountModel, {
    through: AccountUserRelModel,
    as: 'accounts',
    foreignKey: 'user_id',
    onDelete: 'CASCADE'
});

// AccountModel.hasMany(TemplateModel, {
//     as: 'templates',
//     foreignKey: 'account_id',
//     onDelete: 'CASCADE'
// });

// TemplateModel.belongsTo(AccountModel, {
//     as: 'accountId',
//     foreignKey: 'account_id',
//     onDelete: 'CASCADE'
// });