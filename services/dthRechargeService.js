const { v4: uuidv4 } = require('uuid');
const { Op } = require('sequelize');
const axios = require('axios');
const Dth = require('../models/Dth');
const CommissionRate = require('../models/CommissionRate');
const User = require('../models/User');
const UserFinancial = require('../models/UserFinancial');
const RechargeHistory = require('../models/RechargeHistory');


const processDTHRecharge = async (userId, body) => {
    const { number, amount, operatorCode, circleCode } = body;
    const orderId = `ORD-${uuidv4()}`;
  
    // Fetch necessary data
    const [dth, commissionRate, user, userFinancial] = await Promise.all([
      Dth.findOne({ where: { operatorCode } }),
      CommissionRate.findOne({ where: { operatorCode } }),
      User.findByPk(userId),
      UserFinancial.findOne({ where: { userId } })
    ]);
  
    if (!user || !userFinancial || !commissionRate || !dth) {
      throw new Error("User, financial, commission, or dth data not found.");
    }
  
    // ✅ Check if user has enough balance
    if (userFinancial.accountBalance < amount) {
      throw new Error("Insufficient account balance for recharge.");
    }
  
    // 🔗 External API call
    const url = `https://business.a1topup.com/recharge/api?username=${process.env.A1_USERNAME}&pwd=${process.env.A1_PASSWORD}&circlecode=${dth.circleCode}&operatorcode=${dth.operatorCode}&number=${number}&amount=${amount}&orderid=${orderId}&format=json`;
  
    const response = await axios.get(url);
    console.log("Recharge API Response:", response.data);
  
    // 📦 Parse response
    let txid = null, status = 'Failure', opid = null, reason = 'Unknown';
  
    if (typeof response.data === 'string') {
      const parts = response.data.split(',');
      [txid, status, opid] = parts.length >= 3 ? parts : [null, 'Failure', null];
    } else if (typeof response.data === 'object' && response.data !== null) {
      txid = response.data.txid || null;
      status = response.data.status || 'Failure';
      opid = response.data.opid || null;
      reason = response.data.reason || 'Unknown';
    } else {
      throw new Error('Unexpected response format from recharge API.');
    }
  
    if (status === 'Success') {
      const userCommission = amount * (commissionRate.userCommission / 100);
      let referrerCommission = 0;
  
      if (user.referredBy) {
        referrerCommission = amount * (commissionRate.referrerCommission / 100);
      }
  
      const recharge = await RechargeHistory.create({
        userId,
        number,
        amount,
        operatorCode,
        circleCode,
        orderId,
        txid,
        opid,
        status,
        userCommission,
        referrerCommission
      });
  
      // 💰 Deduct amount + add commission
      userFinancial.accountBalance = userFinancial.accountBalance - amount + userCommission;
      userFinancial.totalCommission += userCommission;
      userFinancial.totalRechargePaid += amount;
      userFinancial.lastUpdated = new Date();
      await userFinancial.save();
  
      // Referrer commission update
      if (user.referredBy) {
        const referrerFinancial = await UserFinancial.findOne({ where: { userId: user.referredBy } });
        if (referrerFinancial) {
          referrerFinancial.accountBalance += referrerCommission;
          referrerFinancial.totalCommission += referrerCommission;
          referrerFinancial.lastUpdated = new Date();
          await referrerFinancial.save();
        }
      }
  
      return { txid, status, opid, recharge };
    }
  
    // 🟡 Handle pending
    if (status === 'Pending') {
      return { txid, status, opid };
    }
  
    // 🔴 Handle failure — Optional: log failed recharge
    await RechargeHistory.create({
      userId,
      number,
      amount,
      operatorCode,
      circleCode,
      orderId,
      txid,
      opid,
      status,
      userCommission: 0,
      referrerCommission: 0,
      failureReason: reason
    });
  
    throw new Error(`Recharge failed with status: ${status} - ${reason}`);
  };

  
  const fetchUserDTHRechargeHistory = async (userId, page = 1, limit = 10) => {
    const offset = (page - 1) * limit;
    return await RechargeHistory.findAndCountAll({
      where: { userId },
      order: [['createdAt', 'DESC']],
      offset,
      limit
    });
  };

  

module.exports = { processDTHRecharge, fetchUserDTHRechargeHistory};