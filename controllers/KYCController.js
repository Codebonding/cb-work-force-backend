const KYCService = require('../services/KYCService');

const createKYC = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { aadharNumber, panNumber, address } = req.body;
        const response = await KYCService.createKYC(userId, aadharNumber, panNumber, address);
        res.status(201).json(response);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const updateKYC = async (req, res) => {
    try {
        const userId = req.user.userId;
        console.log(userId);
        
        const { aadharNumber, panNumber, address } = req.body;
        console.log(aadharNumber);
        
        const response = await KYCService.updateKYC(userId, aadharNumber, panNumber, address);
        res.status(200).json(response);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const verifyKYC = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { otp } = req.body;
        const response = await KYCService.verifyKYC(userId, otp);
        res.status(200).json(response);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const resendOTP = async (req, res) => {
    try {
        const userId = req.user.userId;
        const response = await KYCService.resendOTP(userId);
        res.status(200).json(response);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getKYCStatus = async (req, res) => {
    try {
        const userId = req.user.userId;
        const response = await KYCService.getKYCStatus(userId);
        res.status(200).json(response);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = { createKYC, updateKYC, verifyKYC, resendOTP, getKYCStatus };
