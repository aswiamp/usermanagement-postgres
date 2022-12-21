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
            bt_country_id: {
                type: DataTypes.STRING,
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
            sequenceno: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            is_supported: {
                type: DataTypes.ENUM("Y", "N"),
                defaultValue: "Y",
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
