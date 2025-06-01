import { Routes } from '@angular/router';
import { EmployeeMainComponent } from './employee/employee-main/employee-main.component';
import { MainDashboardComponent } from './dashboard/main-dashboard/main-dashboard.component';
import { MainStudentComponent } from './student/main-student/main-student.component';
import { MainFeesComponent } from './fees/main-fees/main-fees.component';
import { MainPayrollComponent } from './payroll/main-payroll/main-payroll.component';
import { MainSchoolFundComponent } from './school-fund/main-school-fund/main-school-fund.component';
import { MainFinanceComponent } from './finance/main-finance/main-finance.component';
import { EmployeeDesignationComponent } from './employee/employee-designation/employee-designation.component';
import { EmployeeAllComponent } from './employee/employee-all/employee-all.component';
import { EmployeeDetailsComponent } from './employee/employee-details/employee-details.component';
import { EmployeeAddComponent } from './employee/employee-add/employee-add.component';
import { EmployeeUpdateComponent } from './employee/employee-update/employee-update.component';
import { EmployeeExitComponent } from './employee/employee-exit/employee-exit.component';
import { StudentAllComponent } from './student/student-all/student-all.component';
import { StudentDetailsComponent } from './student/student-details/student-details.component';
import { StudentGradeWiseDetailsComponent } from './student/student-grade-wise-details/student-grade-wise-details.component';
import { StudentAddComponent } from './student/student-add/student-add.component';
import { StudentUpdateComponent } from './student/student-update/student-update.component';
import { StudentSectionWiseComponent } from './student/student-section-wise/student-section-wise.component';
import { FeesGradeComponent } from './fees/fees-grade/fees-grade.component';
import { FeesGradePendingComponent } from './fees/fees-grade-pending/fees-grade-pending.component';
import { FeesGradePaidComponent } from './fees/fees-grade-paid/fees-grade-paid.component';
import { FeesStudentComponent } from './fees/fees-student/fees-student.component';
import { PayrollPendingComponent } from './payroll/payroll-pending/payroll-pending.component';
import { PayrollPendingMonthComponent } from './payroll/payroll-pending-month/payroll-pending-month.component';
import { PayrollEmployeeComponent } from './payroll/payroll-employee/payroll-employee.component';
import { SchoolFundTransactionComponent } from './school-fund/school-fund-transaction/school-fund-transaction.component';
import { SchoolFundTransactionMonthlyComponent } from './school-fund/school-fund-transaction-monthly/school-fund-transaction-monthly.component';
import { FundDetailsComponent } from './finance/fund-details/fund-details.component';
import { ViewExamFeeComponent } from './fees/view-exam-fee/view-exam-fee.component';
import { ExamFeeStudentComponent } from './fees/exam-fee-student/exam-fee-student.component';
import { ExamFeeDetailsComponent } from './fees/exam-fee-details/exam-fee-details.component';
import { ViewSemesterFeeComponent } from './fees/view-semester-fee/view-semester-fee.component';
import { SemesterFeeDetailsComponent } from './fees/semester-fee-details/semester-fee-details.component';
import { SemesterFeeStudentComponent } from './fees/semester-fee-student/semester-fee-student.component';
import { FeeMonthlyPendingStudentsComponent } from './fees/fee-monthly-pending-students/fee-monthly-pending-students.component';
import { PayrollViewAllComponent } from './payroll/payroll-view-all/payroll-view-all.component';
import { StudentPastComponent } from './student/student-past/student-past.component';
import { EmployeePastComponent } from './employee/employee-past/employee-past.component';
import { LoginPageComponent } from './authentication/login-page/login-page.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProfileComponent } from './employee/profile/profile.component';

export const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' }, // Redirect to login first
    { path: 'login', component: LoginPageComponent },
    
    {
        path: 'dashboard',
        component: DashboardComponent,
        children: [
            { path: '', redirectTo: 'main', pathMatch: 'full' }, // Default child
            // Employees
            { path: 'main', component: MainDashboardComponent },
            { path: 'profile', component: ProfileComponent },
            { path: 'employees', component: EmployeeMainComponent },
            { path: 'employee-designation/:id', component: EmployeeDesignationComponent },
            { path: 'allEmployees', component: EmployeeAllComponent },
            { path: 'employeeDetails/:id', component: EmployeeDetailsComponent },
            { path: 'addEmployee', component: EmployeeAddComponent },
            { path: 'updateEmployee/:id', component: EmployeeUpdateComponent },
            { path: 'employeeExit/:id', component: EmployeeExitComponent },
            { path: 'pastEmployees', component: EmployeePastComponent },
            // Students
            { path: 'students', component: MainStudentComponent },
            { path: 'allStudents', component: StudentAllComponent },
            { path: 'studentDetails/:id', component: StudentDetailsComponent },
            { path: 'gradeStudents/:id', component: StudentGradeWiseDetailsComponent },
            { path: 'gradeSectionStudents/:id', component: StudentSectionWiseComponent },
            { path: 'addStudent', component: StudentAddComponent },
            { path: 'updateStudent/:id', component: StudentUpdateComponent },
            { path: 'pastStudents', component: StudentPastComponent },
            // Fees
            { path: 'fees', component: MainFeesComponent },
            { path: 'monthlyFees/:month', component: FeeMonthlyPendingStudentsComponent },
            { path: 'examFee', component: ViewExamFeeComponent },
            { path: 'examFeeDetails/:name', component: ExamFeeDetailsComponent },
            { path: 'examFeeStudent/:exam_name/:grade_id', component: ExamFeeStudentComponent },
            { path: 'semesterFee', component: ViewSemesterFeeComponent },
            { path: 'semesterFeeDetails/:name', component: SemesterFeeDetailsComponent },
            { path: 'semesterFeeStudent/:semester/:grade_id', component: SemesterFeeStudentComponent },
            {
                path: 'gradeFees/:id',
                component: FeesGradeComponent,
                children: [
                    { path: 'pendingFees/:id/:date', component: FeesGradePendingComponent },
                    { path: 'paidFees/:id/:date', component: FeesGradePaidComponent }
                ]
            },
            { path: 'studentFees/:id', component: FeesStudentComponent },
            // Payroll
            { path: 'payroll', component: MainPayrollComponent },
            { path: 'payrollPendingAll', component: PayrollPendingComponent },
            { path: 'payrollPending/:month', component: PayrollPendingMonthComponent },
            { path: 'payrollEmployee/:id', component: PayrollEmployeeComponent },
            { path: 'employeeSalary', component: PayrollViewAllComponent },
            // School Fund
            { path: 'school-fund', component: MainSchoolFundComponent },
            { path: 'schoolfundTransaction', component: SchoolFundTransactionComponent },
            { path: 'MonthlySchoolfundTransaction/:month', component: SchoolFundTransactionMonthlyComponent },
            // Other Fund
            { path: 'other-fund', component: MainFinanceComponent },
            { path: 'fundDetails/:id', component: FundDetailsComponent }
        ]
    },
    
    { path: '**', redirectTo: '/login' } // Redirect unknown routes to login
];

