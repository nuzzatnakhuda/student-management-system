import { Injectable } from '@angular/core';
import { jsPDF } from 'jspdf';
import { LOGO } from '../logo';

@Injectable({
  providedIn: 'root'
})
export class PdfGeneratorService {

  constructor() { }

  generateFeePdf(student: any, feeData: any) {
    const doc = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });
    console.log(feeData)
    const logoUrl = LOGO;
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const margin = 15; // Left margin
    const headingColor: [number, number, number] = [114, 28, 36]; // Deep red #721c24
    const textColor: [number, number, number] = [102, 51, 51]; // Soft grayish red for text

    const schoolAddress = 'Vehvaria School Complex, Vehvaria Memon Road, inside Khoja Gate, Jamnagar, GUJARAT, 361001'; // School address

    // 🎨 Set Background Color for the entire page (pastel pink)
    doc.setFillColor(255, 218, 230); // Very light baby pink pastel
    doc.rect(0, 0, pageWidth, pageHeight, 'F'); // Fill the entire page with the new background color


    // 🏫 **School Header for Official Copy**
    const topHalfHeight = pageHeight / 2;
    doc.setTextColor(...headingColor); // Set heading color to deep red #721c24
    doc.addImage(logoUrl, 'PNG', margin, 10, 25, 25);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text('Vehvaria National Primary Secondary School, Jamnagar', margin + 35, 20);

    // Add the school address below the name in smaller font with wrapping
    doc.setFont('helvetica', 'normal'); // Use regular font for the address
    doc.setFontSize(10); // Smaller font for the address
    doc.setTextColor(120, 60, 60);  // Light grayish red for the address
    const addressLines = doc.splitTextToSize(schoolAddress, pageWidth - 2 * margin); // Split address into lines that fit the page width
    doc.text(addressLines, margin + 35, 26); // Address below the school name

    doc.setFontSize(12);
    doc.setTextColor(...textColor);
    doc.text('Official Fee Receipt', margin + 35, 40);

    // 📌 **Student & Fee Info for Official Copy**
    let yOffset = 50;
    doc.setFontSize(11);
    doc.setTextColor(...headingColor); // Set heading color to deep red #721c24
    doc.setFont('helvetica', 'bold');

    doc.text('Student ID:', margin, yOffset);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...textColor); // Set data color
    doc.text(`${student.id}`, margin + 25, yOffset);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...headingColor); // Set heading color to deep red #721c24
    doc.text('Fee ID:', margin + 80, yOffset);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...textColor); // Set data color
    doc.text(`${feeData.id}`, margin + 100, yOffset);

    yOffset += 7;

    const boldText = (label: string, value: string, y: number) => {
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...headingColor); // Set heading color to deep red #721c24
      doc.text(`${label}:`, margin, y);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...textColor); // Set data color
      doc.text(value, margin + 35, y);
    };

    boldText('Name', `${student.first_name} ${student.last_name}`, yOffset);
    boldText("Father's Name", `${student.father_name}`, yOffset + 7);
    boldText('Grade', `${student.student_enrollment[0].grade_section.grade.name} - ${student.student_enrollment[0].grade_section.name}`, yOffset + 14);

    yOffset += 25;

    // 📊 **Fee Table for Official Copy (Properly formatted)**
    const columnWidths = [35, 40, 40, 35, 30]; // Adjusted widths for better fitting

    doc.setFont('helvetica', 'bold');
    doc.setFillColor(255, 204, 204); // Pastel rose background for table headers
    doc.rect(margin, yOffset, pageWidth - margin * 2, 10, 'F');

    doc.setTextColor(102, 51, 51); // Pastel red for table headers text
    let xPos = margin;
    const headers = ['Month', 'Amount Due Rs.', 'Amount Paid Rs.', 'Payment Date', 'Status'];

    headers.forEach((header, index) => {
      doc.text(header, xPos + 2, yOffset + 7);
      xPos += columnWidths[index];
    });

    yOffset += 12;

    // Table Row for Official Copy
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setDrawColor(180, 180, 180); // Light gray borders
    doc.rect(margin, yOffset, pageWidth - margin * 2, 8);

    xPos = margin;

    // Format the month and payment date
    const formattedMonth = new Date(feeData.month).toLocaleString('default', { month: 'long', year: 'numeric' }); // "January 2025"
    const formattedPaymentDate = new Date(feeData.payment_date).toLocaleString('default', { day: 'numeric', month: 'long', year: 'numeric' }); // "25 January 2025"

    const rowData = [
      formattedMonth,
      `Rs.${feeData.amount_paid}`,  // Using Rs. instead of symbol
      `Rs.${feeData.amount_paid}`,  // Using Rs. instead of symbol
      formattedPaymentDate ? formattedPaymentDate : 'N/A',
      'Paid'
    ];

    rowData.forEach((data, index) => {
      doc.text(data, xPos + 2, yOffset + 5);
      xPos += columnWidths[index];
    });

    yOffset += 15;

    // ✍️ **Signatures for Official Copy**
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...headingColor); // Set signature heading color to deep red #721c24
    doc.text('Authorized Signature:', margin, yOffset);
    doc.line(margin, yOffset + 5, margin + 50, yOffset + 5);
    doc.text('Date:', margin + 130, yOffset);
    doc.line(margin + 130, yOffset + 5, margin + 180, yOffset + 5);

    yOffset += 20;

    // 🛑 **Divider for Parent Copy**
    doc.setDrawColor(100, 100, 100);
    doc.setLineWidth(0.5);
    doc.line(margin, yOffset, pageWidth - margin, yOffset);

    // **Parents Copy (On the bottom half of the page)**
    const bottomHalfOffset = topHalfHeight + 10; // Start the Parent Copy after the Official Copy

    doc.addImage(logoUrl, 'PNG', margin, bottomHalfOffset, 25, 25);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(...headingColor); // Set heading color for Parent Copy
    doc.text('Vehvaria National Primary Secondary School, Jamnagar', margin + 35, bottomHalfOffset + 10);

    // Add the school address below the name in smaller font with wrapping for Parent Copy
    doc.setFont('helvetica', 'normal'); // Use regular font for the address
    doc.setFontSize(10); // Smaller font for the address
    doc.setTextColor(120, 60, 60);  // Light grayish red for the address
    const addressLinesForParents = doc.splitTextToSize(schoolAddress, pageWidth - 2 * margin); // Split address into lines that fit the page width
    doc.text(addressLinesForParents, margin + 35, bottomHalfOffset + 16); // Address below the school name for parents copy

    doc.setFontSize(12);
    doc.setTextColor(...textColor);
    doc.text('Parents Copy - Fee Receipt', margin + 35, bottomHalfOffset + 28);

    let parentYOffset = bottomHalfOffset + 40; // Adjusting the space between address and student info

    // 📌 **Student & Fee Info for Parent Copy**
    doc.setTextColor(...headingColor); // Set heading color for Parent info
    doc.text('Student ID:', margin, parentYOffset);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...textColor); // Set data color
    doc.text(`${student.id}`, margin + 25, parentYOffset);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...headingColor); // Set heading color for Parent info
    doc.text('Fee ID:', margin + 80, parentYOffset);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...textColor); // Set data color
    doc.text(`${feeData.id}`, margin + 100, parentYOffset);

    boldText('Name', `${student.first_name} ${student.last_name}`, parentYOffset + 7);
    boldText("Father's Name", `${student.father_name}`, parentYOffset + 14);
    boldText('Grade', `${student.student_enrollment[0].grade_section.grade.name} - ${student.student_enrollment[0].grade_section.name}`, parentYOffset + 21);

    parentYOffset += 40; // Adjusting the space between student details and the fee table

    // 📊 **Parent Copy Fee Table**
    doc.setFont('helvetica', 'bold');
    doc.setFillColor(255, 204, 204); // Pastel rose background for table headers
    doc.rect(margin, parentYOffset, pageWidth - margin * 2, 10, 'F');

    xPos = margin;
    headers.forEach((header, index) => {
      doc.text(header, xPos + 2, parentYOffset + 7);
      xPos += columnWidths[index];
    });

    parentYOffset += 12;
    doc.setDrawColor(180, 180, 180); // Light gray borders
    doc.rect(margin, parentYOffset, pageWidth - margin * 2, 8);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);

    xPos = margin;
    rowData.forEach((data, index) => {
      doc.text(data, xPos + 2, parentYOffset + 5);
      xPos += columnWidths[index];
    });

    parentYOffset += 15;

    // ✍️ **Parents Copy Signature**
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...headingColor); // Set signature heading color to deep red #721c24
    doc.text('Authorized Signature:', margin, parentYOffset);
    doc.line(margin, parentYOffset + 5, margin + 50, parentYOffset + 5);
    doc.text('Date:', margin + 130, parentYOffset);
    doc.line(margin + 130, parentYOffset + 5, margin + 180, parentYOffset + 5);

    // 🎯 **Auto Open in New Tab**
    doc.output('dataurlnewwindow');
  }

  generateTransactionPDF(fundDetails: any, transactions: any[]): void {
    const doc: any = new jsPDF();

    // Title section with a light red color
    doc.setFontSize(20);
    doc.setTextColor('#E91E63');  // Soft pink for the title
    doc.text(fundDetails.name, 105, 20, { align: 'center' });  // Centered Fund Name as heading

    // Fund Details Section
    doc.setFontSize(14);
    doc.setTextColor('#C2185B');  // Pinkish color for fund headings

    // Fund Details with labels in bold and pinkish color
    doc.setFont('helvetica', 'bold');
    doc.setTextColor('#D81B60');  // Darker pink for labels
    doc.text('Initial Balance:', 20, 50);
    doc.text('Current Balance:', 20, 60);
    doc.text('Description:', 20, 70);

    // Now the actual fund data, in regular text
    doc.setFont('helvetica', 'normal');
    doc.setTextColor('#333333');  // Dark gray for the actual data
    doc.text(`Rs ${Number(fundDetails.initial_balance).toLocaleString()}`, 80, 50);  // Format with commas
    doc.text(`Rs ${Number(fundDetails.current_balance).toLocaleString()}`, 80, 60);  // Format with commas
    doc.text(fundDetails.description || '-', 80, 70);

    // Add a little space before the table
    doc.line(20, 75, 190, 75); // A simple line separating sections

    // Create Transaction Table
    const tableHeaders = ['Date', 'Type', 'Amount', 'Balance After', 'Description'];

    const tableData = transactions.map(transaction => [
      transaction.transaction_date,
      transaction.type === 'income' ? 'Income' : 'Expense',
      `Rs ${Number(transaction.amount).toLocaleString()}`,  // Format with commas
      `Rs ${Number(transaction.balance_after).toLocaleString()}`,  // Format with commas
      transaction.description || '-'
    ]);

    // Table styling with autoTable
    doc.autoTable({
      startY: 80,
      head: [tableHeaders],
      body: tableData,
      theme: 'striped',
      headStyles: {
        fillColor: '#F8BBD0',  // Light pinkish tone for header
        textColor: '#880E4F',    // Dark pink for text in header
        fontSize: 12,
        font: 'helvetica',
        halign: 'center',
        bold: true
      },
      bodyStyles: {
        fillColor: '#FFEBEE',  // Lighter pink background for rows
        textColor: '#333333',   // Dark gray text color for rows
        fontSize: 10,
        halign: 'center',
        valign: 'middle'
      },
      alternateRowStyles: {
        fillColor: '#FAD0D4'  // Slightly darker pink for alternate rows
      },
      margin: { top: 10, left: 20, right: 20 },
      didDrawPage: () => {
        // Add footer text on every page
        const pageHeight = doc.internal.pageSize.height;
        doc.setFontSize(8);
        doc.setTextColor('#C2185B');  // Pink footer color
        doc.text('Thank you for trusting us with your funds.', 20, pageHeight - 10);
      }
    });

    // Save and open PDF
    doc.output('dataurlnewwindow'); // To open in a new window
  }

  generatePDF(date: any, data: any) {
    const doc: any = new jsPDF();

    // Page width and height for positioning
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;

    doc.setFontSize(18);
    doc.setTextColor(194, 24, 91);  // Deep rose pink color (#c2185b) for the title
    const title = 'Transaction Report';
    const titleWidth = doc.getStringUnitWidth(title) * doc.internal.getFontSize() / doc.internal.scaleFactor;
    const xPos = (pageWidth - titleWidth) / 2; // Center the title
    doc.text(title, xPos, 10);

    // Add a Horizontal Rule (HR) after the heading
    doc.setDrawColor(194, 24, 91); // Deep rose pink color for the HR
    doc.setLineWidth(0.5);
    doc.line(14, 14, pageWidth - 14, 14); // Horizontal line (top border)
    doc.setLineWidth(0.1); // Reset to default

    // Format the date to "01 January 2025"
    const formatDate = (date: string) => {
      const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: '2-digit' };
      const d = new Date(date);
      return d.toLocaleDateString('en-GB', options);  // Format to "01 January 2025"
    };

    // Format start_date and end_date
    const startDateFormatted = formatDate(date.startDate);
    const endDateFormatted = formatDate(date.endDate);

    // Add start date and end date to the document (left aligned)
    doc.setFontSize(12);
    doc.setTextColor(194, 24, 91);  // Deep rose pink for date text
    doc.text(`Start Date: ${startDateFormatted}`, 14, 20);
    doc.text(`End Date: ${endDateFormatted}`, 14, 30);  // End date below start date

    // Group data by Incomes and Expenses
    const groupedData = this.groupDataByIncomeExpense(data);

    // Expenses Section
    doc.setFontSize(14);
    doc.setTextColor(139, 0, 34); // Darker rose color (#8B0022) for Expenses Heading
    doc.text('Expenses', 14, 40);

    // Table data for Expenses (formatted amount with commas)
    const expenseTableData = groupedData.expenses.map((item: any) => {
      return [item.description, `Rs ${Number(item.total_amount).toLocaleString()}`];  // Format with commas
    });

    // Table headers for Expenses
    const expenseHeaders = ['Description', 'Total Amount'];

    // Using autoTable to generate the table for Expenses
    doc.autoTable({
      startY: 45,  // Start position of the table
      head: [expenseHeaders],  // Table headers
      body: expenseTableData,  // Table rows
      theme: 'striped',  // Styling the table with a striped theme
      headStyles: { fillColor: [244, 143, 177] },  // Soft pink for header background (#f48fb1)
      alternateRowStyles: { fillColor: [255, 228, 236] },  // Lighter pastel pink for alternate rows
      margin: { top: 5, bottom: 5 },
      styles: {
        cellPadding: 5,
        fontSize: 10,
        textColor: [194, 24, 91],  // Deep rose pink color for table text
      }
    });

    // Total Expense (formatted with commas)
    const totalExpense = groupedData.expenses.reduce((total: number, item: any) => total + parseFloat(item.total_amount), 0);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(194, 24, 91); // Deep rose pink for total text
    doc.text(`Total Expense: Rs ${totalExpense.toLocaleString()}`, 14, doc.lastAutoTable.finalY + 10);  // Format with commas

    // Add a Horizontal Rule (HR) after the Expenses table
    doc.line(14, doc.lastAutoTable.finalY + 12, pageWidth - 14, doc.lastAutoTable.finalY + 12); // Horizontal line

    // Incomes Section
    doc.setFontSize(14);
    doc.setTextColor(139, 0, 34); // Darker rose color (#8B0022) for Incomes Heading
    doc.text('Incomes', 14, doc.lastAutoTable.finalY + 25);

    // Table data for Incomes (formatted amount with commas)
    const incomeTableData = groupedData.incomes.map((item: any) => {
      return [item.description, `Rs ${Number(item.total_amount).toLocaleString()}`];  // Format with commas
    });

    // Table headers for Incomes
    const incomeHeaders = ['Description', 'Total Amount'];

    // Using autoTable to generate the table for Incomes
    doc.autoTable({
      startY: doc.lastAutoTable.finalY + 30,  // Start position of the table
      head: [incomeHeaders],  // Table headers
      body: incomeTableData,  // Table rows
      theme: 'striped',  // Styling the table with a striped theme
      headStyles: { fillColor: [244, 143, 177] },  // Soft pink for header background (#f48fb1)
      alternateRowStyles: { fillColor: [255, 228, 236] },  // Lighter pastel pink for alternate rows
      margin: { top: 5, bottom: 5 },
      styles: {
        cellPadding: 5,
        fontSize: 10,
        textColor: [194, 24, 91],  // Deep rose pink color for table text
      }
    });

    // Total Income (formatted with commas)
    const totalIncome = groupedData.incomes.reduce((total: number, item: any) => total + parseFloat(item.total_amount), 0);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(194, 24, 91); // Deep rose pink for total text
    doc.text(`Total Income: Rs ${totalIncome.toLocaleString()}`, 14, doc.lastAutoTable.finalY + 10);  // Format with commas

    doc.output('dataurlnewwindow');
  }

  groupDataByIncomeExpense(data: any[]) {
    const grouped = {
      incomes: [] as any[],  // Explicitly define the type as Transaction[]
      expenses: [] as any[]   // Explicitly define the type as Transaction[]
    };

    data.forEach((item: any) => {
      // Format the amount with commas where necessary
      const formattedAmount = `Rs ${Number(item.amount).toLocaleString()}`;

      if (item.type === 'income') {
        grouped.incomes.push({ ...item, amount: formattedAmount });  // Push income with formatted amount
      } else if (item.type === 'expense') {
        grouped.expenses.push({ ...item, amount: formattedAmount });  // Push expense with formatted amount
      }
    });

    return grouped;
  }

  generateSchoolFundTransactionPDF(data: any, startDate: string, endDate: string) {
    const doc: any = new jsPDF();

    // Helper function to format date
    const formatDate = (dateString: string): string => {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('en-GB', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      }).format(date);
    };

    // 1. Header (Title & Date Range)
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.setTextColor(180, 50, 60); // Pastel red/rose theme
    doc.text('School Fund Transaction Report', 14, 20);

    // Date range for transactions
    doc.setFontSize(12);
    doc.setTextColor(80, 80, 80);
    doc.text(`Date Range: ${formatDate(startDate)} - ${formatDate(endDate)}`, 14, 30);

    // 2. Summary Section (Initial & Remaining Balance)
    doc.setFontSize(12);
    doc.setTextColor(100, 50, 50);
    doc.text(`Initial Balance: Rs ${Number(data.initialBalance).toLocaleString()}`, 14, 40);  // Added commas
    doc.text(`Remaining Balance: Rs ${Number(data.remainingBalance).toLocaleString()}`, 14, 50);  // Added commas

    // 3. Transaction Table
    const rows = data.transactions.map((tx: any) => [
      formatDate(tx.transaction_date), // Formatted date
      tx.type.toUpperCase(),
      `Rs ${Number(tx.amount).toLocaleString()}`, // Added commas for Amount
      `Rs ${Number(tx.balance_after).toLocaleString()}`, // Added commas for Balance After
      tx.description
    ]);

    doc.autoTable({
      startY: 60,
      head: [['Date', 'Type', 'Amount (Rs)', 'Balance After (Rs)', 'Description']],
      body: rows,
      theme: 'striped',
      styles: { fontSize: 10, textColor: [50, 50, 50], cellPadding: 5 },
      headStyles: { fillColor: [255, 105, 97] }, // Rose pastel header
      alternateRowStyles: { fillColor: [255, 220, 220] }, // Light pastel alternate rows
      margin: { top: 55 },
      didDrawPage: () => {
        // Add footer
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text('Generated by School Fund Management System', 14, doc.internal.pageSize.height - 10);
      }
    });

    // Final output
    doc.output('dataurlnewwindow'); // To open in a new window
  }

  generateSalaryPdf(salaryData: any[], totalSalary: number, totalPF: number, grandTotal: number): void {
    const doc: any = new jsPDF();
    // Title
    doc.setFontSize(20);
    doc.setTextColor(255, 82, 82); // Soft Pastel Red color for title (Rose Red)
    doc.text('Employee Salary Details', 14, 20);

    // Table Styles
    doc.setFontSize(12);
    const columns = ['ID', 'Name', 'Designation', 'Salary (Rs)', 'Provident Fund (Rs)'];

    // Rows with data
    const rows = salaryData.map(element => [
      element.id,
      element.employee.full_name,
      element.designation.designation,
      `Rs ${element.employee.salary.salary.toLocaleString()}`, // Adding commas for Salary
      `Rs ${(element.employee.salary.salary * 0.13).toLocaleString()}` // Adding commas for Provident Fund
    ]);

    // Adding table to the PDF with pastel rose red styling
    doc.autoTable(columns, rows, {
      startY: 30,
      theme: 'striped',
      headStyles: {
        fillColor: [255, 82, 82],  // Pastel Rose Red header
        textColor: 255,
        fontStyle: 'bold',
        fontSize: 12
      },
      bodyStyles: {
        fillColor: [255, 230, 230],  // Light pastel red for rows
        textColor: [50, 50, 50],
        fontSize: 10
      },
      alternateRowStyles: {
        fillColor: [255, 245, 245]  // Slightly lighter row color
      },
      margin: { top: 30, left: 14, right: 14 }
    });

    // Totals Section with a soft background color and clean font
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0); // Black text for totals

    doc.setFontSize(12);
    doc.text(`Total Salary: Rs ${totalSalary.toLocaleString()}`, 14, doc.lastAutoTable.finalY + 10); // Commas for Total Salary
    doc.text(`Total Provident Fund: Rs ${totalPF.toLocaleString()}`, 14, doc.lastAutoTable.finalY + 20); // Commas for Provident Fund
    doc.text(`Grand Total: Rs ${grandTotal.toLocaleString()}`, 14, doc.lastAutoTable.finalY + 30); // Commas for Grand Total

    // Background color for footer
    doc.setFillColor(255, 230, 230); // Soft pastel red footer background
    doc.rect(0, doc.lastAutoTable.finalY + 35, doc.internal.pageSize.width, 20, 'F');

    // Footer text in a gray tone
    doc.setTextColor(100, 100, 100);
    doc.setFontSize(9);
    doc.text("Generated by Vehvaria National School - Payroll System", 14, doc.lastAutoTable.finalY + 45);
    // Save PDF
    doc.output('dataurlnewwindow'); // To open in a new window
  }

  generateSemesterFeeReceipt(student: any, paymentData: any): void {
    const doc: any = new jsPDF();

    // Constants for styling and layout
    const logoUrl = LOGO;
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const margin = 15; // Left margin
    const headingColor: [number, number, number] = [90, 2, 33]; // RGB for heading color
    const textColor: [number, number, number] = [50, 50, 50];  // Default text color for data
    const schoolAddress = 'Vehvaria School Complex, Vehvaria Memon Road, Inside Khoja Gate, Jamnagar, GUJARAT, 361001'; // School address

    // 🎨 Background Color
    doc.setFillColor(255, 245, 248); // Light pink
    doc.rect(0, 0, pageWidth, pageHeight, 'F'); // Apply background color to the entire page

    // 🏫 **School Header for Official Copy**
    doc.setTextColor(...headingColor); // Set heading color
    doc.addImage(logoUrl, 'PNG', margin, 10, 25, 25); // Logo placed at the top-left corner
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text('Vehvaria National Primary Secondary School, Jamnagar', margin + 35, 20); // School name

    // Add the school address below the name in smaller font with wrapping
    doc.setFont('helvetica', 'normal'); // Use regular font for the address
    doc.setFontSize(10); // Smaller font for the address
    doc.setTextColor(80, 80, 80);  // Light gray text color for the address
    const addressLines = doc.splitTextToSize(schoolAddress, pageWidth - 2 * margin); // Split address into lines that fit the page width
    doc.text(addressLines, margin + 35, 26); // Address below the school name, adjusting y position

    // Adjusted spacing for "Official Fee Receipt"
    doc.setFontSize(12);
    doc.setTextColor(80, 80, 80);  // Light gray text color
    doc.text('Official Fee Receipt', margin + 35, 40); // Move the title further down

    // Format the payment date as '27 January 2025'
    const paymentDate = new Date(paymentData.payment_date);
    const formattedDate = paymentDate.toLocaleString('en-US', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });

    // Adjusting space between heading and student info to only 10px
    // Student Information Section for School Copy
    doc.setFont('helvetica', 'bold'); // Make the student name bold
    doc.setFontSize(14);
    doc.setTextColor(114, 28, 36); // Dark red (same as your main heading color)
    doc.text(`Student: ${student.first_name} ${student.last_name}`, 20, 50); // Position at y = 50


    // Add a line to separate student info and payment details (Top Half)
    doc.line(20, 70, 190, 70); // Line separator at y = 70

    // Payment Details Table for School Copy (Top Half)
    const tableHeaders = ['Field', 'Details'];
    const tableData = [
      ['Semester', paymentData.semester],
      ['Amount Paid', `Rs ${paymentData.amount_paid}`],
      ['Payment Date', formattedDate],  // Use the formatted payment date here
    ];

    doc.autoTable({
      startY: 75, // Table starts 10px below the line separator
      head: [tableHeaders],
      body: tableData,
      theme: 'striped',
      headStyles: {
        fillColor: '#F8BBD0',  // Light pinkish tone for header
        textColor: '#880E4F',   // Dark pink for text in header
        fontSize: 12,
        font: 'helvetica',
        halign: 'center',
        bold: true,
      },
      bodyStyles: {
        fillColor: '#FFEBEE',  // Lighter pink background for rows
        textColor: '#333333',   // Dark gray text color for rows
        fontSize: 10,
        halign: 'center',
        valign: 'middle',
      },
      alternateRowStyles: {
        fillColor: '#FAD0D4', // Slightly darker pink for alternate rows
      },
      margin: { top: 10, left: 20, right: 20 },
    });

    // Add Date Section for School Copy (Top Half)
    doc.text(`Date: ${formattedDate}`, 20, doc.autoTable.previous.finalY + 10);

    // Add Signature Section for School Copy (Top Half)
    doc.text('Signature: ______________________', 20, doc.autoTable.previous.finalY + 20);

    // Divider Between School Copy and Parents Copy
    const dividerY = doc.autoTable.previous.finalY + 30;
    doc.setDrawColor(0, 0, 0); // White color for divider line
    doc.line(20, dividerY, 190, dividerY); // Divider line between both copies

    // Start the Parents Copy directly below the School Copy (No new page)
    const bottomHalfStartY = dividerY + 10; // Starting Y position for the bottom half

    // 🏫 **School Header for Parents Copy**
    doc.setTextColor(...headingColor); // Set heading color
    doc.addImage(logoUrl, 'PNG', margin, bottomHalfStartY + 10, 25, 25); // Logo placed at the top-left corner of the bottom half
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text('Vehvaria National Primary Secondary School, Jamnagar', margin + 35, bottomHalfStartY + 15); // School name for parents copy

    // Add the school address below the name in smaller font with wrapping
    doc.setFont('helvetica', 'normal'); // Use regular font for the address
    doc.setFontSize(10); // Smaller font for the address
    doc.setTextColor(80, 80, 80);  // Light gray text color for the address
    const addressLinesForParents = doc.splitTextToSize(schoolAddress, pageWidth - 2 * margin); // Split address into lines that fit the page width
    doc.text(addressLinesForParents, margin + 35, bottomHalfStartY + 21); // Address below the school name for parents copy

    doc.setFontSize(12);
    doc.setTextColor(80, 80, 80);  // Light gray text color
    doc.text('Parent Fee Receipt', margin + 35, bottomHalfStartY + 30); // Receipt title for parents copy

    // Student Information Section for Parents Copy (Bottom Half)
    // Student Information Section for Parents Copy
    doc.setFont('helvetica', 'bold'); // Make the student name bold
    doc.setFontSize(14);
    doc.setTextColor(114, 28, 36); // Dark red
    doc.text(`Student: ${student.first_name} ${student.last_name}`, 20, bottomHalfStartY + 38);

    // Add a line to separate student info and payment details for Parents Copy (Bottom Half)
    doc.line(20, bottomHalfStartY + 58, 190, bottomHalfStartY + 58); // Line separator at y = bottomHalfStartY + 58

    // Payment Details Table for Parents Copy (Bottom Half)
    doc.autoTable({
      startY: bottomHalfStartY + 63, // Table starts 10px below the line separator
      head: [tableHeaders],
      body: tableData,
      theme: 'striped',
      headStyles: {
        fillColor: '#F8BBD0',  // Light pinkish tone for header
        textColor: '#880E4F',   // Dark pink for text in header
        fontSize: 12,
        font: 'helvetica',
        halign: 'center',
        bold: true,
      },
      bodyStyles: {
        fillColor: '#FFEBEE',  // Lighter pink background for rows
        textColor: '#333333',   // Dark gray text color for rows
        fontSize: 10,
        halign: 'center',
        valign: 'middle',
      },
      alternateRowStyles: {
        fillColor: '#FAD0D4', // Slightly darker pink for alternate rows
      },
      margin: { top: 10, left: 20, right: 20 },
    });

    // Add Date Section for Parents Copy (Bottom Half)
    doc.text(`Date: ${formattedDate}`, 20, doc.autoTable.previous.finalY + 10);

    // Add Signature Section for Parents Copy (Bottom Half)
    doc.text('Signature: ______________________', 20, doc.autoTable.previous.finalY + 20);

    // Open the PDF in a new window
    doc.output('dataurlnewwindow');
  }

  generateAdmissionReceipt(student: any, monthly_fee: any, semester_fee: any, admission_fee: number) {
    const doc: any = new jsPDF();

    // **Lighter Background Color (Very Light Rose)**
    doc.setFillColor(255, 245, 247); // Softer pastel shade
    doc.rect(0, 0, 210, 297, 'F'); // Cover full page

    // **School Logo**
    const logoUrl = LOGO; // Update with your logo path
    doc.addImage(logoUrl, 'PNG', 15, 10, 25, 25); // Logo placement

    // **Official Copy Header (School Name & Address)**
    doc.setFontSize(16);
    doc.setTextColor(139, 0, 0); // Dark red for school name
    doc.text('Vehvaria National Primary Secondary School, Jamnagar', 105, 20, { align: 'center' });

    doc.setFontSize(10);
    doc.setTextColor(80, 80, 80); // Soft gray for the address
    doc.text('Vehvaria School Complex, Vehvaria Memon Road, inside Khoja Gate,', 105, 27, { align: 'center' });
    doc.text('Jamnagar, GUJARAT, 361001', 105, 32, { align: 'center' });

    doc.setFontSize(12);
    doc.setTextColor(139, 0, 0);
    doc.text('Official Copy - Admission Fee Receipt', 105, 40, { align: 'center' });

    // **Student Details with Different Heading Colors**
    doc.setFontSize(10);
    doc.setTextColor(150, 0, 0); // Slightly lighter red for headings
    doc.text('Student Name:', 15, 50);
    doc.text('Contact Number:', 15, 55);

    doc.setTextColor(0, 0, 0); // Black text for details
    doc.text(`${student.first_name} ${student.father_name} ${student.last_name}`, 50, 50);
    doc.text(`${student.contact_number}`, 50, 55);

    // **Format the dates**
    const formatDate = (date: string) => {
      const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      };
      const formattedDate = new Date(date).toLocaleDateString('en-GB', options);

      // Check if the date is valid
      if (isNaN(new Date(date).getTime())) {
        console.error('Invalid date format:', date);
        return '';
      }

      return formattedDate; // Format to "28 January 2025"
    };

    const formatMonth = (date: string) => {
      const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long'
      };
      return new Date(date).toLocaleDateString('en-GB', options); // Format to "January 2025"
    };

    // **Fee Details Tables with Reduced Spacing**
    doc.autoTable({
      startY: 60,
      headStyles: { fillColor: [139, 0, 0] }, // Dark red table header
      styles: { fillColor: [255, 248, 250] }, // Softer light pink row background
      head: [['Fee Type', 'Amount Due', 'Amount Paid']],
      body: [['Admission Fee', `Rs. ${admission_fee}`, `Rs. ${admission_fee}`]],
      margin: { top: 2 }
    });

    doc.autoTable({
      startY: doc.lastAutoTable.finalY + 3,
      headStyles: { fillColor: [139, 0, 0] },
      styles: { fillColor: [255, 248, 250] },
      head: [['Fee Type', 'Amount Due', 'Amount Paid', 'Month', 'Payment Date']],
      body: [['Monthly Fee', `Rs. ${monthly_fee.amount_due}`, `Rs. ${monthly_fee.amount_paid}`, formatMonth(monthly_fee.month), formatDate(monthly_fee.payment_date)]],
      margin: { top: 2 }
    });

    doc.autoTable({
      startY: doc.lastAutoTable.finalY + 3,
      headStyles: { fillColor: [139, 0, 0] },
      styles: { fillColor: [255, 248, 250] },
      head: [['Fee Type', 'Amount Due', 'Amount Paid', 'Semester', 'Payment Date']],
      body: [['Semester Fee', `Rs. ${semester_fee.amount_due}`, `Rs. ${semester_fee.amount_paid}`, semester_fee.semester, formatDate(semester_fee.payment_date)]],
      margin: { top: 2 }
    });

    // **Total Fee Calculation**
    const totalFee = admission_fee + monthly_fee.amount_paid + semester_fee.amount_paid;
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`Total Amount Paid: Rs. ${totalFee}`, 15, doc.lastAutoTable.finalY + 5);

    // **Signature Section for Official Copy**
    doc.setTextColor(0, 0, 0); // Black text for label
    doc.setFontSize(12);
    doc.text('Signature of Authorized Person:', 15, doc.lastAutoTable.finalY + 10);
    doc.setLineWidth(0.5);
    doc.line(15, doc.lastAutoTable.finalY + 15, 95, doc.lastAutoTable.finalY + 15); // Shorter Signature line

    // **Divider Between Official and Parent's Copy**
    doc.setLineWidth(1);
    doc.line(10, 148, 200, 148); // Divider line

    // **Parent's Copy Header (School Name & Address)**
    doc.addImage(logoUrl, 'PNG', 15, 155, 25, 25); // Logo for Parent's Copy

    doc.setFontSize(16);
    doc.setTextColor(139, 0, 0); // Dark red for school name
    doc.text('Vehvaria National Primary Secondary School, Jamnagar', 105, 160, { align: 'center' });

    doc.setFontSize(10);
    doc.setTextColor(80, 80, 80); // Soft gray for the address
    doc.text('Vehvaria School Complex, Vehvaria Memon Road, inside Khoja Gate,', 105, 167, { align: 'center' });
    doc.text('Jamnagar, GUJARAT, 361001', 105, 172, { align: 'center' });

    doc.setFontSize(12);
    doc.setTextColor(139, 0, 0);
    doc.text('Parent\'s Copy - Admission Fee Receipt', 105, 180, { align: 'center' });

    // **Student Details (Parent's Copy)**
    doc.setFontSize(10);
    doc.setTextColor(150, 0, 0); // Slightly lighter red for headings
    doc.text('Student Name:', 15, 190);
    doc.text('Contact Number:', 15, 195);

    doc.setTextColor(0, 0, 0); // Black text for details
    doc.text(`${student.first_name} ${student.father_name} ${student.last_name}`, 50, 190);
    doc.text(`${student.contact_number}`, 50, 195);

    // **Fee Details Tables for Parent's Copy with Reduced Spacing**
    doc.autoTable({
      startY: 200,
      headStyles: { fillColor: [139, 0, 0] },
      styles: { fillColor: [255, 248, 250] },
      head: [['Fee Type', 'Amount Due', 'Amount Paid']],
      body: [['Admission Fee', `Rs. ${admission_fee}`, `Rs. ${admission_fee}`]],
      margin: { top: 2 }
    });

    doc.autoTable({
      startY: doc.lastAutoTable.finalY + 3,
      headStyles: { fillColor: [139, 0, 0] },
      styles: { fillColor: [255, 248, 250] },
      head: [['Fee Type', 'Amount Due', 'Amount Paid', 'Month', 'Payment Date']],
      body: [['Monthly Fee', `Rs. ${monthly_fee.amount_due}`, `Rs. ${monthly_fee.amount_paid}`, formatMonth(monthly_fee.month), formatDate(monthly_fee.payment_date)]],
      margin: { top: 2 }
    });

    doc.autoTable({
      startY: doc.lastAutoTable.finalY + 3,
      headStyles: { fillColor: [139, 0, 0] },
      styles: { fillColor: [255, 248, 250] },
      head: [['Fee Type', 'Amount Due', 'Amount Paid', 'Semester', 'Payment Date']],
      body: [['Semester Fee', `Rs. ${semester_fee.amount_due}`, `Rs. ${semester_fee.amount_paid}`, semester_fee.semester, formatDate(semester_fee.payment_date)]],
      margin: { top: 2 }
    });

    // **Total Fee Calculation for Parent's Copy**
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`Total Amount Paid: Rs. ${totalFee}`, 15, doc.lastAutoTable.finalY + 5);

    // **Signature Section for Parent's Copy**
    doc.setTextColor(0, 0, 0); // Black text for label
    doc.setFontSize(12);
    doc.text('Signature of Authorized Person:', 15, doc.lastAutoTable.finalY + 10);
    doc.setLineWidth(0.5);
    doc.line(15, doc.lastAutoTable.finalY + 15, 95, doc.lastAutoTable.finalY + 15); // Shorter Signature line

    // Open in a New Tab
    const pdfBlob = doc.output('blob');
    const pdfUrl = URL.createObjectURL(pdfBlob);
    window.open(pdfUrl);
  }

}
