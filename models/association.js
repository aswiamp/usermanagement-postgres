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
            investor_type_comment: {
                type: DataTypes.STRING,
            },
            user_assoc_id: {
                allowNull: false,
                type: DataTypes.BIGINT,
            },
            is_contact_person: {
                type: DataTypes.STRING,
                defaultValue: "N",
            },
        },
        {
            sequelize,
            modelName: UserAssociation.name,
            tableName: "userassociation",
            timestamps: true,
        }
    );

    return UserAssociation;
};
