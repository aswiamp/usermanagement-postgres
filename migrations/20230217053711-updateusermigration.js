"use strict";

// eslint-disable-next-line no-unused-vars
const { sequelize } = require("../models");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        return Promise.all([
            await queryInterface.addColumn(
                "twofactorAuthentications", // table name
                "recoverycode", // new field name

                {
                    type: Sequelize.ARRAY(Sequelize.STRING),
                    allowNull: true,
                }
            ),
        ]);
    },
    // eslint-disable-next-line no-unused-vars
    async down(queryInterface, Sequelize) {
        return Promise.all([
            await queryInterface.removeColumn(
                "twofactorAuthentications",
                "recoverycode"
            ),
        ]);
    },
};
