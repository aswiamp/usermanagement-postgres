const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class Phonetype extends Model {
        // Helper method for defining associations.
        // This method is not a part of Sequelize lifecycle.
        // The `models/index` file will call this method automatically.
        static associate() {}
    }
    Phonetype.init(
        {
            bt_phone_type_id: {
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
            shortcode: {
                type: DataTypes.STRING(50),
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            sequenceno: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            description: {
                type: DataTypes.STRING,
            },
        },
        {
            sequelize,
            modelName: Phonetype.name,
            tableName: "phonetype",
            timestamps: false,
        }
    );

    return Phonetype;
};
