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
const commissionRateRoutes = require('./routes/commissionRate')
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

// Routes
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

// Default route that returns the server's IP address
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

// Uncomment to run locally
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
