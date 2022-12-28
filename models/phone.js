const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class Phone extends Model {
        // Helper method for defining associations.
        // This method is not a part of Sequelize lifecycle.
        // The `models/index` file will call this method automatically.
        static associate() {}
    }
    Phone.init(
        {
            business_phone_id: {
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
            phone: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            business_id: {
                type: DataTypes.BIGINT,
            },
            phone_type_id: {
                type: DataTypes.BIGINT,
            },
        },
        {
            sequelize,
            modelName: Phone.name,
            tableName: "phone",
            timestamps: true,
        }
    );

    return Phone;
};
