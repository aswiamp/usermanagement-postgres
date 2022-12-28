const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class UserAssociation extends Model {
        // Helper method for defining associations.
        // This method is not a part of Sequelize lifecycle.
        // The `models/index` file will call this method automatically.
        static associate() {}
    }
    UserAssociation.init(
        {
            business_user_assoc_id: {
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
            description: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            user_assoc_role: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            UserId: {
                allowNull: false,
                type: DataTypes.BIGINT,
            },
            business_id: {
                allowNull: false,
                type: DataTypes.BIGINT,
            },
            investor_type_id: {
                type: DataTypes.INTEGER,
            },
            user_assoc_id: {
                allowNull: false,
                type: DataTypes.BIGINT,
            },

            is_contact_person: {
                type: DataTypes.STRING,
                defaultValue: "N",
            },
            ownership_percent: {
                type: DataTypes.BIGINT,
            },
            name: {
                type: DataTypes.STRING,
            },
            email: {
                type: DataTypes.STRING,
            },
        },
        {
            sequelize,
            modelName: UserAssociation.name,
            tableName: "user_association",
            timestamps: true,
        }
    );

    return UserAssociation;
};
