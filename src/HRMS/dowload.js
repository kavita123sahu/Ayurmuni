import React, { useState } from "react";
import * as XLSX from "xlsx";

/* ================== DUMMY DATA ================== */

const dummyEmployees = [
  {
    employee: {
      name: "Rahul Sharma",
      email: "rahul@company.com",
      mobile: "9876543210",
      employee_details: {
        emp_code: "EMP001",
        reporting_head_name: "Amit Verma",
        department: "Engineering",
        designation: "Senior Developer"
      }
    },
    personal_details: {
      name: "Rahul Sharma",
      employee: "rahul.personal@gmail.com",
      alternate_email: "rahul.alt@gmail.com",
      mobile: "9876543210",
      gender: "Male",
      pan: "ABCDE1234F",
      aadhaar: "1234-5678-9012"
    },
    org_details: {
      employee_type: "Full Time",
      role: "Developer",
      joining_date: "2022-06-01"
    },
    family_details: {
      father_name: "Ramesh Sharma",
      mother_name: "Sita Sharma",
      married_status: "Married"
    },
    emergency_details: [
      { person_name: "Sita Sharma", relation: "Mother", phone_number: "9999999999" }
    ],
    education_details: [
      {
        college: "IIT Indore",
        stream: "CSE",
        endDate: "2020-06-30"
      }
    ],
    work_experience_details: [
      {
        company: "ABC Tech",
        jobposition: "Developer",
        startDate: "2020-08-01",
        endDate: "2022-05-31"
      }
    ],
    bank_details: {
      bank_name: "SBI",
      account_number: "1234567890"
    },
    job_posting_details: [{ job_name: "Senior Developer" }],
    increment_data: [
      {
        wefdate: "2023-04-01",
        increment_percentage: 10
      }
    ],
    certifications: [{ certification_name: "AWS Certified" }]
  }
];

/* ================== HELPERS ================== */

const formatObject = (obj) => {
  if (!obj) return "-";
  return Object.entries(obj)
    .map(([k, v]) => `${k} : ${v}`)
    .join("\n");
};

const formatArray = (arr) => {
  if (!arr?.length) return "-";
  return arr
    .map((item, i) =>
      `#${i + 1}\n` +
      Object.entries(item)
        .map(([k, v]) => `${k} : ${v}`)
        .join("\n")
    )
    .join("\n\n");
};

/* ================== EXCEL DOWNLOAD ================== */

const downloadAsExcel = (employees) => {
  const headers = [
    "Emp Code",
    "Name",
    "Email",
    "Mobile",
    "Reporting Head",
    "Department",
    "Designation",
    "Personal Details",
    "Organization Details",
    "Family Details",
    "Emergency Contacts",
    "Education Details",
    "Work Experience",
    "Bank Details",
    "Job Position",
    "Increment History",
    "Certifications"
  ];

  const rows = employees.map((emp) => [
    emp.employee?.employee_details?.emp_code,
    emp.employee?.name,
    emp.employee?.email,
    emp.employee?.mobile,
    emp.employee?.employee_details?.reporting_head_name,
    emp.employee?.employee_details?.department,
    emp.employee?.employee_details?.designation,
    formatObject(emp.personal_details),
    formatObject(emp.org_details),
    formatObject(emp.family_details),
    formatArray(emp.emergency_details),
    formatArray(emp.education_details),
    formatArray(emp.work_experience_details),
    formatObject(emp.bank_details),
    formatArray(emp.job_posting_details),
    formatArray(emp.increment_data),
    formatArray(emp.certifications)
  ]);

  const sheet = XLSX.utils.aoa_to_sheet([headers, ...rows]);
  sheet["!cols"] = headers.map(() => ({ wch: 35 }));

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, sheet, "Employees");
  XLSX.writeFile(wb, "employees.xlsx");
};

/* ================== COMPONENT ================== */

const Download = () => {
  const [filteredEmployee] = useState(dummyEmployees);

  return (
    <div>
      <button
        style={{ marginBottom: 12, padding: "8px 14px" }}
        onClick={() => downloadAsExcel(filteredEmployee)}
      >
        ⬇ Download Excel
      </button>

      <table border="1" cellPadding="6">
        <thead>
          <tr>
            <th>Emp Code</th>
            <th>Name</th>
            <th>Designation</th>
          </tr>
        </thead>
        <tbody>
          {filteredEmployee.map((emp, i) => (
            <tr key={i}>
              <td>{emp.employee.employee_details.emp_code}</td>
              <td>{emp.employee.name}</td>
              <td>{emp.employee.employee_details.designation}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Download;
