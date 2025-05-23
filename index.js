const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { sequelize } = require('./config/database');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const kycRoutes = require('./routes/kycRoutes');
const referralRoutes = require('./routes/referralRoutes');
const simRoutes = require('./routes/simRoutes');
const planRoutes = require('./routes/planRoutes');
const adminRoutes = require('./routes/adminRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const userFinancialRoutes = require('./routes/userFinancialRoutes');
const investmentRoutes = require('./routes/investmentRoutes');
const userInvestmentRoutes = require('./routes/userInvestmentRoutes');
const adminInvestmentRoutes = require('./routes/adminInvestmentRoutes');
const payoutHistoryRoutes = require('./routes/payoutHistoryRoutes');
const mobileRechargeRoutes = require('./routes/rechargeRoutes');
const commissionRateRoutes = require('./routes/commissionRate');
const adminPanelRoutes = require('./routes/adminPanelRoutes');
const withdrawalRoutes = require('./routes/withdrawalRoutes');
const bankAccountRoutes = require('./routes/bankAccount');
const serverless = require('serverless-http');
const os = require('os');

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Sync Database
(async () => {
    try {
        await sequelize.sync({ alter: true });
        console.log('Database synced!');
    } catch (error) {
        console.error('Database sync failed:', error);
    }
})();

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/kyc', kycRoutes);
app.use('/api/referrals', referralRoutes);
app.use('/api/sim', simRoutes);
app.use('/api/plan', planRoutes);
app.use('/api/admin-portal', adminRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/user-financial', userFinancialRoutes);
app.use('/api/investments', investmentRoutes);
app.use('/api/user-investments', userInvestmentRoutes);
app.use('/api/admin-investments', adminInvestmentRoutes);
app.use('/api/payout-history', payoutHistoryRoutes);
app.use('/api/commision-rate', commissionRateRoutes);
app.use('/api/mobile-recharge', mobileRechargeRoutes);
app.use('/api/admin-panel', adminPanelRoutes);
app.use('/api/withdrawals', withdrawalRoutes);
app.use('/api/bank-accounts', bankAccountRoutes);


app.get('/', (req, res) => {
    const networkInterfaces = os.networkInterfaces();
    const localIps = [];

    Object.values(networkInterfaces).forEach(iface => {
        iface.forEach(addr => {
            if (addr.family === 'IPv4' && !addr.internal) {
                localIps.push(addr.address);
            }
        });
    });

    res.json({
        message: "Hello, World!",
        ipAddresses: localIps
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});