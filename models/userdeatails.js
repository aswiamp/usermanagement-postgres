"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class userdetails extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate() {
            //define association here
        }
    }
    userdetails.init(
        {
            email: {
                type: DataTypes.STRING,
                unique: true,
            },
            emailInviteStatus: {
                type:DataTypes.STRING,
                values: ["sent", "failed"]
            },
            inviteSentAt: {
                type: DataTypes.DATE,
            },
            registerStatus: {
                type:DataTypes.STRING,
                values: ["waiting", "completed"],
                defaultValue : 'waiting'
            },
            registeredAt: {
                type: DataTypes.DATE,                
            },
        },
        {
            sequelize,
            modelName: "userdetails",
            timestamps:false
        }
    );
    return userdetails;
};
