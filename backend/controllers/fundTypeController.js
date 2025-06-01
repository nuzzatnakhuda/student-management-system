const db = require('../models')

const FundType = db.fund_types
const FundTransaction=db.fund_transactions

const addFundType = async (req, res) => {
    try {
        const fund_type = await FundType.create({
            name: req.body.name,
            initial_balance: req.body.initial_balance,
            current_balance: req.body.initial_balance,
            description: req.body.description
        })

        res.status(200).send(fund_type)
    } catch (error) {
        console.log(error)
        res.status(500).send({ message: 'Something went wrong' })
    }

}

const getAllFundTypes = async (req, res) => {
    try {
        let fund_types = await FundType.findAll({})
        res.status(200).send(fund_types)
    } catch (error) {
        console.log(error)
        res.status(500).send({ message: 'Something went wrong' })
    }

}

const getFundTypeById = async (req, res) => {
    try {
        let fund_type = await FundType.findOne({
            where: { id: req.params.id }
        })
        res.status(200).send(fund_type)
    } catch (error) {
        console.log(error)
        res.status(500).send({ message: 'Something went wrong' })
    }

}

const updateFundType = async (req, res) => {
    try {
        let fund_type = await FundType.findOne({
            where: { id: req.params.id }
        })
        if (fund_type.initial_balance == fund_type.current_balance) {
            fund_type = await FundType.update(
                {
                    name: req.body.name,
                    initial_balance: req.body.initial_balance,
                    current_balance: req.body.initial_balance,
                    description: req.body.description
                }, {
                where: { id: req.params.id }
            })
            res.status(200).send(fund_type)
        }
        else {
            fund_type = await FundType.update(
                {
                    name: req.body.name,
                    description: req.body.description
                }, {
                where: { id: req.params.id }
            })
            res.status(200).send(fund_type)
        }
    } catch (error) {
        console.log(error)
        res.status(500).send({ message: 'Something went wrong' })
    }

}
const getAllFundTransaction = async (req, res) => {
    try {
        const fund_transaction = await FundTransaction.findAll({
            where : {
                fund_type_id : req.params.id
            },
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

const makeExpense = async (req, res) => {
    try {
        let fund_type = await FundType.findOne({
            where :{
                id:req.params.id
            }
        })
        fund_type=await FundType.update({
            current_balance: parseFloat(fund_type.current_balance) - parseFloat(req.body.amount)
        }, {
            where: {
                id:req.params.id
            }
        })
        fund_type = await FundType.findOne({
            where :{
                id:req.params.id
            }
        })
        let fund_transaction = await FundTransaction.create({
            fund_type_id :req.params.id,
            transaction_date: req.body.transaction_date,
            type: 'expense',
            amount: parseFloat(req.body.amount),
            balance_after: fund_type.current_balance,
            description: req.body.description
        })
        res.status(200).send(fund_transaction)
    } catch (error) {
        console.log(error)
        res.status(500).send({ error: error.message })
    }
}

const getIncome = async (req, res) => {
    try {
        let fund_type = await FundType.findOne({
            where :{
                id:req.params.id
            }
        })
        fund_type=await FundType.update({
            current_balance: parseFloat(fund_type.current_balance) + parseFloat(req.body.amount)
        }, {
            where: {
                id:req.params.id
            }
        })
        fund_type = await FundType.findOne({
            where :{
                id:req.params.id
            }
        })
        let fund_transaction = await FundTransaction.create({
            fund_type_id :req.params.id,
            transaction_date: req.body.transaction_date,
            type: 'income',
            amount: parseFloat(req.body.amount),
            balance_after: fund_type.current_balance,
            description: req.body.description
        })
        res.status(200).send(fund_transaction)
    } catch (error) {
        console.log(error)
        res.status(500).send({ error: error.message })
    }
}
module.exports = {
    addFundType,
    getAllFundTypes,
    getFundTypeById,
    updateFundType,
    getAllFundTransaction,
    makeExpense
}