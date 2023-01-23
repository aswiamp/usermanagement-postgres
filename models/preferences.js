"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class user_prefrences extends Model {
        // Helper method for defining associations.
        // This method is not a part of Sequelize lifecycle.
        // The `models/index` file will call this method automatically.
        static associate() {
            // user_password.belongsTo(model.user, { foreignKey: "userId" });
        }
    }

    user_prefrences.init(
        {
            id: {
                allowNull: false,
                primaryKey: true,
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
            },
            sortKey: {
                type: DataTypes.STRING,
            },
            sortOrder: {
                type: DataTypes.STRING,
            },
            filterby: {
                type: DataTypes.STRING,
            },
            pref_key: {
                type: DataTypes.STRING,
            },
            updatedBy: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            createdBy: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            user_id: {
                type: DataTypes.UUID,
            },
        },
        {
            sequelize,
            modelName: "user_prefrences",
            timestamps: true,
        }
    );

    return user_prefrences;
};
