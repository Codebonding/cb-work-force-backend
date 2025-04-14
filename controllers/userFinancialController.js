const UserFinancialService = require('../services/userFinancialService');

exports.getUserFinancial = async (req, res) => {
    try {
        const data = await UserFinancialService.getByUserId(req.params.userId);
        if (!data) {
            return res.status(404).json({
                success: false,
                message: 'User financial data not found for the given userId',
            });
        }
        res.status(200).json({
            success: true,
            message: 'User financial data retrieved successfully',
            data,
        });
    } catch (error) {
        console.error('Get UserFinancial Error:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while retrieving user financial data',
            error: error.message,
        });
    }
};
