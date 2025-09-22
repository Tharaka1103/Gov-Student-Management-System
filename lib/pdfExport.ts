import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Employee } from '@/types';

interface PDFExportOptions {
  employees: Employee[];
  directorName: string;
  departmentName?: string;
}

export const generateEmployeePDF = ({ employees, directorName, departmentName }: PDFExportOptions) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  
  // Header
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('EMPLOYEE REPORT', pageWidth / 2, 25, { align: 'center' });
  
  // Subheader
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(`Director: ${directorName}`, 20, 40);
  if (departmentName) {
    doc.text(`Department: ${departmentName}`, 20, 50);
  }
  doc.text(`Generated on: ${new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })}`, 20, departmentName ? 60 : 50);
  doc.text(`Total Employees: ${employees.length}`, pageWidth - 20, 40, { align: 'right' });
  
  // Line separator
  const lineY = departmentName ? 70 : 60;
  doc.setLineWidth(0.5);
  doc.line(20, lineY, pageWidth - 20, lineY);
  
  // Statistics section
  const stats = calculateStats(employees);
  const statsY = lineY + 15;
  
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('SUMMARY STATISTICS', 20, statsY);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  const statsData = [
    ['Total Employees', stats.total.toString()],
    ['Active Employees', stats.active.toString()],
    ['Employees with Degree', stats.withDegree.toString()],
    ['Average Service Years', `${stats.avgServiceYears} years`],
    ['Longest Serving', `${stats.longestServing} years`],
    ['Newest Employee', `${stats.newestEmployee} years`]
  ];
  
  autoTable(doc, {
    startY: statsY + 10,
    head: [['Metric', 'Value']],
    body: statsData,
    theme: 'grid',
    styles: {
      fontSize: 9,
      cellPadding: 3,
    },
    headStyles: {
      fillColor: [0, 0, 0],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245],
    },
    margin: { left: 20, right: pageWidth / 2 + 10 },
  });
  
  // Employee details table
  const tableStartY = statsY + 80;
  
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('EMPLOYEE DETAILS', 20, tableStartY - 10);
  
  const tableData = employees.map((employee, index) => [
    (index + 1).toString(),
    employee.name,
    employee.email,
    employee.nic,
    employee.mobile,
    formatDate(employee.dateOfJoiningService),
    calculateServiceYears(employee).toString() + 'y',
    employee.degree || 'N/A',
    employee.isActive ? 'Active' : 'Inactive'
  ]);
  
  autoTable(doc, {
    startY: tableStartY,
    head: [['#', 'Name', 'Email', 'NIC', 'Mobile', 'Join Date', 'Service', 'Degree', 'Status']],
    body: tableData,
    theme: 'striped',
    styles: {
      fontSize: 8,
      cellPadding: 2,
    },
    headStyles: {
      fillColor: [0, 0, 0],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 9,
    },
    alternateRowStyles: {
      fillColor: [248, 248, 248],
    },
    columnStyles: {
      0: { halign: 'center', cellWidth: 10 },
      1: { cellWidth: 25 },
      2: { cellWidth: 35 },
      3: { cellWidth: 25 },
      4: { cellWidth: 22 },
      5: { cellWidth: 20 },
      6: { halign: 'center', cellWidth: 15 },
      7: { cellWidth: 20 },
      8: { halign: 'center', cellWidth: 18 },
    },
    margin: { left: 20, right: 20 },
    didDrawPage: (data) => {
      // Footer on each page
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.text(
        `Page ${data.pageNumber}`,
        pageWidth / 2,
        pageHeight - 10,
        { align: 'center' }
      );
    },
  });
  
  // Final footer with signature section
  const finalY = (doc as any).lastAutoTable.finalY + 30;
  
  if (finalY + 40 < pageHeight - 20) {
    doc.setLineWidth(0.3);
    doc.line(20, finalY, pageWidth - 20, finalY);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Prepared by:', 20, finalY + 15);
    doc.text(directorName, 20, finalY + 25);
    doc.text('Director', 20, finalY + 35);
    
    doc.text('Date:', pageWidth - 80, finalY + 15);
    doc.text(new Date().toLocaleDateString(), pageWidth - 80, finalY + 25);
    
    // Signature line
    doc.line(20, finalY + 45, 80, finalY + 45);
    doc.text('Signature', 20, finalY + 52);
  }
  
  return doc;
};

const calculateStats = (employees: Employee[]) => {
  const serviceYears = employees.map(emp => calculateServiceYears(emp));
  
  return {
    total: employees.length,
    active: employees.filter(emp => emp.isActive).length,
    withDegree: employees.filter(emp => emp.degree).length,
    avgServiceYears: employees.length > 0 
      ? Math.round(serviceYears.reduce((sum, years) => sum + years, 0) / employees.length)
      : 0,
    longestServing: serviceYears.length > 0 ? Math.max(...serviceYears) : 0,
    newestEmployee: serviceYears.length > 0 ? Math.min(...serviceYears) : 0,
  };
};

const calculateServiceYears = (employee: Employee) => {
  const joiningDate = new Date(employee.dateOfJoiningService);
  const now = new Date();
  return Math.floor((now.getTime() - joiningDate.getTime()) / (1000 * 60 * 60 * 24 * 365));
};

const formatDate = (dateString: string | Date) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit'
  });
};

export const downloadEmployeePDF = (options: PDFExportOptions) => {
  const doc = generateEmployeePDF(options);
  const fileName = `employees_report_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);
};