const cron = require("node-cron");
const db = require("../models");
const User = db.user;
const transporter = require("./sendmail");
const moment = require("moment");

//send email
exports.reminder = async () => {
    const users = await User.findAll({
        where: { passwordExpiry: moment().add(1, "days").format("YYYY-MM-DD") },
    });

    //scheduled on 23.55 everyday
    cron.schedule("55 23 * * *", async () => {
        await users.map(async (a) => {
            await transporter.sendMail({
                from: "sample@gmail.com",
                to: `${a.email}`,
                subject: "StandardC password remainder",
                html: `<p>Hi, ${a.firstName + " " + a.lastName}!</p>
                <p>  This is a remainder mail from Standard C. </p>
                <p>Your password will be expired on  <b>Tommorow</b><i> ${
                    a.passwordExpiry
                }</i>.</p>
                <p>Login to StandardC and reset the password as soon as possible.</p>
                <p>Thank you.</p>`,
            });
        });
    });
};
