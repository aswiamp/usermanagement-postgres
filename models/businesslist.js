const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class Stage_Status extends Model {
        // Helper method for defining associations.
        // This method is not a part of Sequelize lifecycle.
        // The `models/index` file will call this method automatically.
        static associate(model) {
            Stage_Status.belongsTo(model.Business, {
                foreignKey: "business_id",
            });
        }
    }
    Stage_Status.init(
        {
            user_id: {
                allowNull: false,
                type: DataTypes.BIGINT,
            },
            status_id: {
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
            membership: {
                type: DataTypes.ENUM("pending", "full"),
                defaultValue: "pending",
            },
            standardc_due_diligence: {
                type: DataTypes.ENUM("pass", "fail"),
                defaultValue: "fail",
            },
            business_kyc_cdd: {
                type: DataTypes.ENUM("pass", "fail"),
                defaultValue: "fail",
            },
            business_profile: {
                type: DataTypes.ENUM("complete", "pending"),
                defaultValue: "pending",
            },
            business_id: {
                allowNull: false,
                type: DataTypes.BIGINT,
            },
        },
        {
            sequelize,
            modelName: Stage_Status.name,
            tableName: "bp_onboard_stage_status",
            timestamps: true,
        }
    );
    return Stage_Status;
};
