const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class Business extends Model {
        // Helper method for defining associations.
        // This method is not a part of Sequelize lifecycle.
        // The `models/index` file will call this method automatically.
        static associate() {}
    }
    Business.init(
        {
            business_id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.BIGINT,
            },
            isactive: {
                type: DataTypes.ENUM("Y", "N"),
                defaultValue: "Y",
            },
            created: {
                type: DataTypes.DATE,
            },
            createdby: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            updated: {
                type: DataTypes.DATE,
            },
            updatedby: {
                type: DataTypes.STRING,
            },
            short_name: {
                type: DataTypes.STRING(50),
                allowNull: false,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            is_approved: {
                type: DataTypes.ENUM("Y", "N"),
                defaultValue: "N",
            },
            dba: {
                type: DataTypes.STRING,
            },
            fedtaxid: {
                type: DataTypes.INTEGER,
            },
            is_cannabis_business: {
                type: DataTypes.ENUM("Y", "N"),
                defaultValue: "Y",
            },
            is_approved_vendor: {
                type: DataTypes.ENUM("Y", "N"),
                defaultValue: "N",
            },
            is_createdby_stdc: {
                type: DataTypes.ENUM("Y", "N"),
                defaultValue: "N",
            },
        },
        {
            sequelize,
            modelName: Business.name,
            tableName: "business",
            timestamps: false,
        }
    );

    return Business;
};
