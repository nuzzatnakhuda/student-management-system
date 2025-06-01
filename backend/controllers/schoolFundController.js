const db = require('../models')
const { Op, Sequelize } = require('sequelize')

const SchoolFund = db.school_fund
const SchoolFundTransaction = db.school_fund_transaction


const addSchoolFund = async (req, res) => {
    try {
        const schoolFund = await SchoolFund.create({
            initial_balance: req.body.initial_balance,
            current_balance: req.body.initial_balance,
        })

        res.status(200).send(schoolFund)
    } catch (error) {
        console.log(error)
        res.status(500).send({ message: 'Something went wrong' })
    }

}

const getSchoolFund = async (req, res) => {
    try {
        let school_fund = await SchoolFund.findOne({})
        res.status(200).send(school_fund)
    } catch (error) {
        console.log(error)
        res.status(500).send({ message: 'Something went wrong' })
    }

}

const getSchoolFundTransactionByDateRange = async (req, res) => {
    try {
        const transactions = await SchoolFundTransaction.findAll({
            attributes: ['id', 'transaction_date', 'type', 'amount', 'balance_after', 'description'],
            where: {
                transaction_date: { [Op.between]: [req.query.startDate, req.query.endDate] }
            },
            order: [['createdAt', 'DESC']] // Ordered by latest transaction first
        });
    
        // Get Initial Balance (Before Start Date)
        const initialBalanceRecord = await SchoolFundTransaction.findOne({
            attributes: ['balance_after'],
            where: {
                transaction_date: { [Op.lt]: req.query.startDate }
            },
            order: [['transaction_date', 'DESC']] // Get the latest one before startDate
        });
    
        const initialBalance = initialBalanceRecord ? parseFloat(initialBalanceRecord.balance_after) : 0;
    
        // Get Remaining Balance (Since transactions are DESC, take the first one's balance_after)
        const remainingBalance = transactions.length > 0 ? parseFloat(transactions[0].balance_after) : initialBalance;
    
        res.status(200).send({
            initialBalance,
            remainingBalance,
            transactions
        });
    } catch (error) {
        console.log(error)
        res.status(500).send({ message: 'Something went wrong' })
    }
}

const getMonthlyIncomeExpenses = async (req, res) => {
    try {

        const results = await SchoolFundTransaction.findAll({
            attributes: [
                // Group by Year-Month format (YYYY-MM)
                [Sequelize.fn('DATE_FORMAT', Sequelize.col('transaction_date'), '%Y-%m'), 'month'],
                [Sequelize.fn('SUM', Sequelize.literal('CASE WHEN type = "income" THEN amount ELSE 0 END')), 'total_income'],
                [Sequelize.fn('SUM', Sequelize.literal('CASE WHEN type = "expense" THEN amount ELSE 0 END')), 'total_expense']
            ],
            group: [
                Sequelize.fn('DATE_FORMAT', Sequelize.col('transaction_date'), '%Y-%m') // Group by year and month
            ],
            order: [
                [Sequelize.fn('DATE_FORMAT', Sequelize.col('transaction_date'), '%Y-%m'), 'ASC'] // Order by month
            ],
            raw: true // To get the results as plain objects
        });

        res.status(200).send(results)

    } catch (error) {
        console.log(error)
        res.status(500).send({ message: error.message })
    }
}

const getAllSchoolFundTransaction = async (req, res) => {
    try {
        const fund_transaction = await SchoolFundTransaction.findAll({
            order: [
                ['createdAt', 'DESC'] // This will order by createdAt in descending order
            ]
        });
        res.status(200).send(fund_transaction)

    }
    catch (error) {
        console.log(error)
        res.status(500).send({ error: error.message })
    }

}

const getGroupedTransaction = async (req, res) => {
    try {
        const groupedData = await SchoolFundTransaction.findAll({
            attributes: [
                "description",
                "type",
                [Sequelize.fn("SUM", Sequelize.col("amount")), "total_amount"]
            ],
            where: {
                transaction_date: {
                    [Op.between]: [req.query.startDate, req.query.endDate] // Ensure startDate and endDate are properly formatted Date objects or strings
                }
            },
            group: ["description", "type"],
            order: [[Sequelize.literal("total_amount"), "DESC"]] // Sort by total amount in descending order
        });
        res.status(200).send(groupedData)
    } catch (error) {
        console.log(error)
        res.status(500).send({ error: error.message })
    }
}

const makeExpense = async (req, res) => {
    try {
        let school_fund = await SchoolFund.findOne({})
        school_fund=await SchoolFund.update({
            current_balance: parseFloat(school_fund.current_balance) - parseFloat(req.body.amount)
        }, {
            where: {
                id: 1
            }
        })
        school_fund = await SchoolFund.findOne({})
        let school_fund_transaction = await SchoolFundTransaction.create({
            transaction_date: req.body.transaction_date,
            type: 'expense',
            amount: parseFloat(req.body.amount),
            balance_after: school_fund.current_balance,
            description: req.body.description
        })
        res.status(200).send(school_fund_transaction)
    } catch (error) {
        console.log(error)
        res.status(500).send({ error: error.message })
    }
}

const getIncome = async (req, res) => {
    try {
        let school_fund = await SchoolFund.findOne({})
        school_fund=await SchoolFund.update({
            current_balance: parseFloat(school_fund.current_balance) + parseFloat(req.body.amount)
        }, {
            where: {
                id: 1
            }
        })
        school_fund = await SchoolFund.findOne({})
        let school_fund_transaction = await SchoolFundTransaction.create({
            transaction_date: req.body.transaction_date,
            type: 'income',
            amount: parseFloat(req.body.amount),
            balance_after: school_fund.current_balance,
            description: req.body.description
        })
        res.status(200).send(school_fund_transaction)
    } catch (error) {
        console.log(error)
        res.status(500).send({ error: error.message })
    }
}
module.exports = {
    addSchoolFund,
    getSchoolFund,
    getSchoolFundTransactionByDateRange,
    getMonthlyIncomeExpenses,
    getAllSchoolFundTransaction,
    getGroupedTransaction,
    makeExpense,
    getIncome
}