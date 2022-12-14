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
            bp_business_id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.BIGINT,
            },
            fedtax_id: {
                type: DataTypes.STRING(50),
                allowNull: false,
            },
            dba: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            is_active: {
                type: DataTypes.ENUM("Y", "N"),
                defaultValue: "Y",
            },
            createdAt: {
                type: DataTypes.DATE,
            },
            createdBy: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            updatedAt: {
                type: DataTypes.DATE,
            },
            updatedBy: {
                type: DataTypes.STRING,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            is_cannabis_business: {
                type: DataTypes.ENUM("Y", "N"),
                defaultValue: "Y",
            },
            bp_business_license_id: {
                type: DataTypes.STRING,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: Business.name,
            tableName: "bp_business",
        }
    );

    return Business;
};
