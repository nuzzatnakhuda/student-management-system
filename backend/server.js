const express = require('express')
const cors = require('cors')

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

//router 
const sessionRouter = require('./routes/sessionRoute')
const designationRouter = require('./routes/designationRoute')
const employeeRouter = require('./routes/employeeRoute')
const gardeRouter = require('./routes/gradeRoute')
const gardeSectionRouter = require('./routes/gradeSectionRoute')
const fundTypeRouter = require('./routes/fundTypeRoute')
const studentRouter = require('./routes/studentRoute')
const monthlyFeeRouter = require('./routes/monthlyFeeRoute')
const examFeeRouter = require('./routes/examFeeRoute')
const payRollRouter = require('./routes/payRollRoute')
const randomRouter = require('./routes/generateRandom')
const semesterFeeRouter = require('./routes/semesterFeeRoute')



app.use('/sessions',sessionRouter)
app.use('/designations',designationRouter)
app.use('/employees',employeeRouter)
app.use('/grades',gardeRouter)
app.use('/gradeSection',gardeSectionRouter)
app.use('/fundType',fundTypeRouter)
app.use('/students',studentRouter)
app.use('/monthlyFee',monthlyFeeRouter)
app.use('/examFee',examFeeRouter)
app.use('/semesterFee',semesterFeeRouter)
app.use('/payRoll',payRollRouter)
app.use('/random',randomRouter)



app.get('/', (req, res) => {
    res.json({ message: 'Hello World' })
})

const PORT = process.env.PORT || 8080

app.listen(PORT,()=>{
    console.log(`Server is listening on Port ${PORT}`)
})