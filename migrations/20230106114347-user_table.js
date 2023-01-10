"use strict";

// eslint-disable-next-line no-unused-vars
const { sequelize } = require("../models");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("user", {
            id: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
            },
            firstName: Sequelize.STRING,
            lastName: Sequelize.STRING,
            email: Sequelize.STRING,
            address: Sequelize.JSON,
            phone: Sequelize.STRING,
            image: Sequelize.STRING,
            passwordExpiry: Sequelize.DATEONLY,
        });
    },

    // eslint-disable-next-line no-unused-vars
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable("user");
    },
};
