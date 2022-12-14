"use strict";

// eslint-disable-next-line no-unused-vars
const { sequelize } = require("../models");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("userdetails", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            email: {
                type: Sequelize.STRING,
                unique: true,
            },
            emailInviteStatus: {
                type: Sequelize.STRING,
                values: ["sent", "failed"],
            },
            inviteSentAt: {
                type: Sequelize.DATE,
            },
            registerStatus: {
                type: Sequelize.STRING,
                values: ["waiting", "completed"],
                defaultValue: "waiting",
            },
            registeredAt: {
                type: Sequelize.DATE,
            },
        });
    },
    // eslint-disable-next-line no-unused-vars
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable("userdetails");
    },
};
