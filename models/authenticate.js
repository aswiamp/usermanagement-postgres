/* eslint-disable no-var */
"use strict";

const { Model } = require("sequelize");
// eslint-disable-next-line no-unused-vars
const { Sequelize } = require(".");
module.exports = (sequelize, DataTypes) => {
    class twofactorAuthentication extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate() {
            //define association here
            // user.hasMany(model.user_password, { foreignKey: "id" });
            //twofactorAuthentication.hasMany(model.business_history, { foreignKey: "id"});
        }
    }
    twofactorAuthentication.init(
        {
            id: {
                allowNull: false,
                primaryKey: true,
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
            },
            user_id: DataTypes.UUID,
            otp_enabled: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            },
            otp_verified: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            },
            otp_ascii: DataTypes.STRING,
            otp_hex: DataTypes.STRING,
            otp_base32: DataTypes.STRING,
            otp_auth_url: DataTypes.STRING,
            recoverycode: DataTypes.ARRAY(DataTypes.STRING),
        },
        {
            sequelize,
            modelName: "twofactorAuthentication",
        }
    );
    return twofactorAuthentication;
};
