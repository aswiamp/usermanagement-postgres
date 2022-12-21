"use strict";

const { Model } = require("sequelize");
const bucket = require("../utills/s3bucket");
module.exports = (sequelize, DataTypes) => {
    class user extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate() {
            //define association here
            // user.hasMany(model.user_password,{ foreignKey: 'id' });
        }
    }
    user.init(
        {
            firstName: DataTypes.STRING,
            lastName: DataTypes.STRING,
            email: DataTypes.STRING,
            address: DataTypes.JSON,
            phone: DataTypes.STRING,
            image: DataTypes.STRING,
            passwordExpiry: DataTypes.DATEONLY,
            fullName: {
                type: DataTypes.VIRTUAL,
                get() {
                    return (
                        this.getDataValue("firstName") +
                        " " +
                        this.getDataValue("lastName")
                    );
                },
            },
            imageUrl: {
                type: DataTypes.VIRTUAL,
                get() {
                    {
                        if (this.image !== null) {
                            var result = bucket.getSignedURL(this.image);
                            //console.log(result);
                            return result;
                        }
                    }
                },
            },
        },
        {
            sequelize,
            modelName: "user",
        }
    );
    return user;
};
