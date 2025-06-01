const dbConfig = require('../config/dbConfig');

const {Sequelize,DataTypes} = require('sequelize')

const sequelize = new Sequelize(
    dbConfig.DB,
    dbConfig.USER,
    dbConfig.PASSWORD,
    {
        host:dbConfig.HOST,
        dialect:dbConfig.dialect,
        operatorsAliases : false,
        pool :{
            max :dbConfig.pool.max,
            min : dbConfig.pool.min,
            acquire : dbConfig.pool.acquire,
            idle : dbConfig.pool.idle,
        }
    }
)

sequelize.authenticate()
.then(()=>{
    console.log("Connected")
})
.catch(err=>{
    console.log(`Error : ${err}`)
})

const db = {}

db.Sequelize = Sequelize
db.sequelize = sequelize

db.designations = require('../models/designationModel')(sequelize,DataTypes)
db.employees = require('./employeeModel')(sequelize,DataTypes)
db.employee_provident = require('./employeeProvidentModel')(sequelize,DataTypes)
db.exam_fee = require('./examFeeModel')(sequelize,DataTypes)
db.fund_transactions = require('./fundTransactionModel')(sequelize,DataTypes)
db.fund_types = require('./fundTypeModel')(sequelize,DataTypes)
db.grade_fees = require('./gradeFeeModel')(sequelize,DataTypes)
db.grades = require('./gradeModel')(sequelize,DataTypes)
db.grade_sections = require('./gradeSectionModel')(sequelize,DataTypes)
db.job_details = require('./jobDetailModel')(sequelize,DataTypes)
db.login  = require('./loginModel')(sequelize,DataTypes)
db.monthly_fee = require('./monthlyFeeModel')(sequelize,DataTypes)
db.pay_roll = require('./payRollModel')(sequelize,DataTypes)
db.provident_fund = require('./providentFundModel')(sequelize,DataTypes)
db.salary = require('./salaryModel')(sequelize,DataTypes)
db.school_fund = require('./schoolFundModel')(sequelize,DataTypes)
db.school_fund_transaction = require('./schoolFundTransactionModel')(sequelize,DataTypes)
db.semester_fee = require('./semesterFeeModel')(sequelize,DataTypes)
db.sessions = require('./sessionModel')(sequelize,DataTypes)
db.student_enrollment = require('./studentEnrollmentModel')(sequelize,DataTypes)
db.student_exit = require('./studentExitModel')(sequelize,DataTypes)
db.student_family = require('./studentFamilyInfo')(sequelize,DataTypes)
db.student = require('./studentModel')(sequelize,DataTypes)
db.student_past_school = require('./studentPastSchoolModel')(sequelize,DataTypes)
db.student_promotions = require('./studentPromotionModel')(sequelize,DataTypes)



//RealtionShips

//FundTransaction Table
db.fund_types.hasMany(db.fund_transactions,{
    foreignKey : 'fund_type_id',
    as : 'fund_transaction'
})
db.fund_transactions.belongsTo(db.fund_types,{
    foreignKey : 'fund_type_id',
    as : 'fund_type'  
})

//Grade Table
db.sessions.hasMany(db.grades,{
    foreignKey : 'session_id',
    as : 'grade'
})
db.grades.belongsTo(db.sessions,{
    foreignKey : 'session_id',
    as :'session'
})

//GradeFees Table
db.grades.hasOne(db.grade_fees,{
    foreignKey : 'grade_id',
    as : 'grade_fee'
})
db.grade_fees.belongsTo(db.grades,{
    foreignKey : 'grade_id',
    as : 'grade'
})

//GradeSection Table
db.grades.hasMany(db.grade_sections,{
    foreignKey : 'grade_id',
    as : 'grade_section'
})
db.grade_sections.belongsTo(db.grades,{
    foreignKey : 'grade_id',
    as : 'grade'
})

//Job Details Table
db.sessions.hasMany(db.job_details,{
    foreignKey : 'session_id',
    as : 'job_detail'
})
db.job_details.belongsTo(db.sessions,{
    foreignKey : 'session_id',
    as : 'session'
})
db.designations.hasMany(db.job_details,{
    foreignKey : 'designation_id',
    as : 'job_detail'
})
db.job_details.belongsTo(db.designations,{
    foreignKey : 'designation_id',
    as : 'designation'
})
db.employees.hasOne(db.job_details,{
    foreignKey : 'employee_id',
    as : 'job_detail'
})
db.job_details.belongsTo(db.employees,{
    foreignKey : 'employee_id',
    as : 'employee'
})

//Salary Table
db.employees.hasOne(db.salary,{
    foreignKey : 'employee_id',
    as : 'salary'
})
db.salary.belongsTo(db.employees,{
    foreignKey : 'employee_id',
    as : 'employee'
})

//Provident Fund Table
db.employees.hasMany(db.provident_fund,{
    foreignKey : 'employee_id',
    as : 'provident_fund'
})
db.provident_fund.belongsTo(db.employees,{
    foreignKey : 'employee_id',
    as : 'employee'
})

//EmployeeProvident Table
db.employees.hasOne(db.employee_provident,{
    foreignKey : 'employee_id',
    as : 'employee_provident'
})
db.employee_provident.belongsTo(db.employees,{
    foreignKey : 'employee_id',
    as : 'employee'
})

//PayRoll Table
db.employees.hasMany(db.pay_roll,{
    foreignKey : 'employee_id',
    as : 'pay_roll'
})
db.pay_roll.belongsTo(db.employees,{
    foreignKey : 'employee_id',
    as : 'employee'
})
db.pay_roll.hasMany(db.provident_fund,{
    foreignKey : 'pay_roll_id',
    as : 'provident_fund'
})
db.provident_fund.belongsTo(db.pay_roll,{
    foreignKey : 'pay_roll_id',
    as : 'pay_roll'
})

//Login Table
db.employees.hasOne(db.login,{
    foreignKey : 'employee_id',
    as : 'login'
})
db.login.belongsTo(db.employees,{
    foreignKey : 'employee_id',
    as : 'employee'
})

//Student Enrollment Table
db.student.hasMany(db.student_enrollment,{
    foreignKey : 'student_id',
    as :'student_enrollment'
})
db.student_enrollment.belongsTo(db.student,{
    foreignKey : 'student_id',
    as :'student'  
})
db.grade_sections.hasMany(db.student_enrollment,{
    foreignKey : 'grade_section_id',
    as :'student_enrollment'
})
db.student_enrollment.belongsTo(db.grade_sections,{
    foreignKey : 'grade_section_id',
    as :'grade_section'  
})

//Monthly Fees
db.student.hasMany(db.monthly_fee,{
    foreignKey : 'student_id',
    as :'monthly_fee'
})
db.monthly_fee.belongsTo(db.student,{
    foreignKey : 'student_id',
    as :'student'  
})
db.student_enrollment.hasMany(db.monthly_fee,{
    foreignKey : 'student_enrollment_id',
    as :'monthly_fee'
})
db.monthly_fee.belongsTo(db.student_enrollment,{
    foreignKey : 'student_enrollment_id',
    as :'student_enrollment'  
})

//Exam Fee
db.student.hasMany(db.exam_fee, {
    foreignKey: 'student_id',
    as: 'exam_fees'
});
db.exam_fee.belongsTo(db.student, {
    foreignKey: 'student_id',
    as: 'student'
});
db.student_enrollment.hasMany(db.exam_fee, {
    foreignKey: 'student_enrollment_id',
    as: 'exam_fees'
});
db.exam_fee.belongsTo(db.student_enrollment, {
    foreignKey: 'student_enrollment_id',
    as: 'student_enrollment'
});

//Semester Fee
db.student.hasMany(db.semester_fee, {
    foreignKey: 'student_id',
    as: 'semester_fees'
});
db.semester_fee.belongsTo(db.student, {
    foreignKey: 'student_id',
    as: 'student'
});

db.student_enrollment.hasMany(db.semester_fee, {
    foreignKey: 'student_enrollment_id',
    as: 'semester_fees'
});
db.semester_fee.belongsTo(db.student_enrollment, {
    foreignKey: 'student_enrollment_id',
    as: 'student_enrollment'
});


//Student Exit
db.student.hasOne(db.student_exit,{
    foreignKey : 'student_id',
    as :'student_exit'  
})
db.student_exit.belongsTo(db.student,{
    foreignKey : 'student_id',
    as :'student'  
})
db.student_enrollment.hasOne(db.student_exit,{
    foreignKey : 'student_enrollment_id',
    as :'student_exit'  
})
db.student_exit.belongsTo(db.student_enrollment,{
    foreignKey : 'student_enrollment_id',
    as :'student_enrollment'  
})

//Student Family
db.student.hasOne(db.student_family,{
    foreignKey : 'student_id',
    as :'student_family'  
})
db.student_family.belongsTo(db.student,{
    foreignKey : 'student_id',
    as :'student'  
})

//Student Past School
db.student.hasOne(db.student_past_school,{
    foreignKey : 'student_id',
    as :'student_past_school'  
})
db.student_past_school.belongsTo(db.student,{
    foreignKey : 'student_id',
    as :'student'  
})

//Student Promotions
db.student.hasMany(db.student_promotions,{
    foreignKey : 'student_id',
    as :'student_promotion'  
})
db.student_promotions.belongsTo(db.student,{
    foreignKey : 'student_id',
    as :'student'  
})
db.student_enrollment.hasMany(db.student_promotions,{
    foreignKey : 'old_enrollment_id',
    as :'old_promotion'  
})
db.student_promotions.belongsTo(db.student_enrollment,{
    foreignKey : 'old_enrollment_id',
    as :'old_enrollment'  
})
db.student_enrollment.hasMany(db.student_promotions,{
    foreignKey : 'new_enrollment_id',
    as :'new_promotion'  
})
db.student_promotions.belongsTo(db.student_enrollment,{
    foreignKey : 'new_enrollment_id',
    as :'new_enrollment'  
})

db.sequelize.sync({force:false})
.then(()=>{
    console.log('Resync done')
})

module.exports = db