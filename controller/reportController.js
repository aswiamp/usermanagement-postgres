const cron = require('node-cron');
const db = require("../models");
const User = db.user;
const Invite = db.invite;
const transporter = require('../utills/sendMail');
const {Op}=require("sequelize");

//get date 

const startOfDay = new Date();
startOfDay.setUTCHours(0, 0, 0, 0);

const endOfDay = new Date();
endOfDay.setUTCHours(23, 59, 59, 999); 


//send email
exports.Report =  async() => {
    //counts
   
    const inviteCount =  await Invite.count({ where: {'createdAt': {[Op.gte]: startOfDay,[Op.lte]:endOfDay}} });
    const userCount = await User.count({ where: {'createdAt': {[Op.gte]: startOfDay,[Op.lte]:endOfDay}} });
    const regUserCount =await Invite.count({ where: {'status':"completed",'createdAt': {[Op.gte]: startOfDay,[Op.lte]:endOfDay}} });
    const awaitingUserCount = await Invite.count({ where: {'status':"waiting",'createdAt': {[Op.gte]: startOfDay,[Op.lte]:endOfDay}} });
    console.log(inviteCount,userCount,regUserCount,awaitingUserCount);

    const  text= 
               `<p>StandardC User Registration Report \n\nDated On:${new Date()}</p>
                <p>number of mail sent today : ${inviteCount}</p>
                <p>total number of users : ${userCount} </p>
                <p>Registered Users : ${ regUserCount } </p>
                <p>pending Users : ${ awaitingUserCount }</p>`;

    //mail sending time scheduled on 23.50
    cron.schedule('50 23 * * *',async() => {
        await transporter.sendMail({
            from :'standardc@gmail.com' ,
            to : 'ADMIN <admin@gmail.com>',
            subject : 'daily user report',
            html: text,
        }); 
    });  
};