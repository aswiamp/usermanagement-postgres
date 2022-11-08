const cron = require('node-cron');
const db = require("../models");
//const User = db.user;
const Invite = db.invite;
const transporter = require('../utills/sendMail');
const {Op}=require("sequelize");

//get date 
const startOfDay = new Date();
//set the hour of the date object according to UTC
startOfDay.setUTCHours(0, 0, 0, 0);

const endOfDay = new Date();
//set the hour of the date object endOfDay
endOfDay.setUTCHours(23, 59, 59, 999); 


//send email
exports.Report =  async() => {
    //counts
   
    const inviteCount =  await Invite.count({ where: {'createdAt': {[Op.gte]: startOfDay,[Op.lte]:endOfDay}} });
    const regUserCount =await Invite.count({ where: {'status':"completed",'createdAt': {[Op.gte]: startOfDay,[Op.lte]:endOfDay}} });
    const awaitingUserCount = await Invite.count({ where: {'status':"waiting",'createdAt': {[Op.gte]: startOfDay,[Op.lte]:endOfDay}} });
    console.log(inviteCount,regUserCount,awaitingUserCount);

    const  text= 
               `<p>StandardC User Registration Report \n\nDated On:${new Date()}</p>
                <p>number of mail sent today : ${inviteCount}</p>
                <p>Registered Users : ${ regUserCount } </p>
                <p>pending Users : ${ awaitingUserCount }</p>`;

    //mail sending time scheduled on 18:28
    cron.schedule('28 18 * * *',async() => {
        await transporter.sendMail({
            from :'standardc@gmail.com' ,
            to : 'ADMIN <admin@gmail.com>',
            subject : 'daily user report',
            html: text,
        }); 
    });  
};