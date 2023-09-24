const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class Address extends Model {
        // Helper method for defining associations.
        // This method is not a part of Sequelize lifecycle.
        // The `models/index` file will call this method automatically.
        static associate() {}
    }
    Address.init(
        {
            address_id: {
                allowNull: false,
                primaryKey: true,
                autoIncrement: true,
                type: DataTypes.BIGINT,
            },
            is_active: {
                type: DataTypes.ENUM("Y", "N"),
                defaultValue: "Y",
            },
            createdBy: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            updatedBy: {
                type: DataTypes.STRING,
            },
            address1: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            address2: {
                type: DataTypes.STRING,
            },
            zipcodes_id: {
                type: DataTypes.BIGINT,
            },
            street_no: {
                type: DataTypes.STRING,
            },
        },
        {
            sequelize,
            modelName: Address.name,
            tableName: "address",
            timestamps: true,
        }
    );

    return Address;
};
