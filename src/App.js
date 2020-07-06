/* eslint-disable react/jsx-filename-extension */
import React, { useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';

import './App.css';

import 'bootstrap/dist/css/bootstrap.css';

const App = () => {
  const [loanAmount, setLoanAmount] = useState(100000);
  const [years, setYears] = useState(30);
  const [rate, setRate] = useState(3);

  function formatCurrency(val) {
    return val.toLocaleString('en-US', {
      style: 'currency', currency: 'USD', maximumFractionDigits: 2, minimumFractionDigits: 2,
    });
  }
  function currencyFormatter(params) {
    return formatCurrency(params.value);
  }

  const columnDefs = [
    {
      headerName: 'Payment Number',
      field: 'paymentNumber',
    },
    {
      headerName: 'Principal',
      field: 'principal',
      valueFormatter: currencyFormatter,
    },
    {
      headerName: 'Interest',
      field: 'interest',
      valueFormatter: currencyFormatter,
    },
    {
      headerName: 'Remaining Principal',
      field: 'remaining',
      valueFormatter: currencyFormatter,
    },
  ];

  const handleSetLoan = (e) => {
    setLoanAmount(e.target.value);
  };

  const handleSetYears = (e) => {
    setYears(e.target.value);
  };

  const handleSetRate = (e) => {
    setRate(e.target.value);
  };

  const _totalPayments = years * 12;

  const _monthlyRate = rate / 1200;

  const powerTerm = (monthlyRate, totalPayments) => (1 + monthlyRate) ** totalPayments;
  const powerTermP = (monthlyRate, monthIndex) => (1 + monthlyRate) ** monthIndex;
  const monthlyPayment = (loan, monthlyRate, totalPayments) => loan
    * ((monthlyRate * powerTerm(monthlyRate, totalPayments))
      / (powerTerm(monthlyRate, totalPayments) - 1));
  const remainingAt = (loan, monthlyRate, monthIndex, totalPayments) => loan
    * ((powerTerm(monthlyRate, totalPayments)
      - powerTermP(monthlyRate, monthIndex))
      / (powerTerm(monthlyRate, totalPayments) - 1));

  const monthly = monthlyPayment(loanAmount, _monthlyRate, _totalPayments);
  const amortization = [];

  for (let i = 0; i < _totalPayments + 1; i += 1) {
    amortization.push({
      paymentNumber: i,
      remaining: remainingAt(loanAmount, _monthlyRate, i, _totalPayments),
    });
  }

  for (let i = 1; i < _totalPayments + 1; i += 1) {
    const principal = amortization[i - 1].remaining - amortization[i].remaining;
    const interest = monthly - principal;
    amortization[i].principal = principal;
    amortization[i].interest = interest;
  }

  const rowData = amortization.slice(1);
  amortization[0].interest = 0;
  amortization[0].principal = 0;
  const sumInterest = (accumulator, currentValue) => accumulator + currentValue.interest;
  const totalInterest = amortization.reduce(sumInterest, 0);
  return (
    <div className="container-fluid border border-secondary">
      <h1 className="text-info">Mortgage Fun</h1>
      <div className="form-group">
      <h2 className="text-secondary">Terms</h2>
        <label className="form-label" htmlFor="loan">Loan $</label>
        <input
          className="form-control"
          id="loan"
          name="loan"
          type="number"
          min="100000"
          max="5000000"
          value={loanAmount}
          onChange={handleSetLoan}
        />
      </div>
      <div className="form-group">
        <label className="form-label" htmlFor="years">Years</label>
        <input
          className="form-control"
          id="years"
          name="years"
          type="number"
          min="5"
          max="40"
          value={years}
          onChange={handleSetYears}
        />
      </div>
      <div className="form-group">
        <label className="form-label" htmlFor="interest">Interest Rate %</label>
        <input
          id="interest"
          name="interest"
          className="form-control"
          type="number"
          min="1"
          max="10"
          value={rate}
          onChange={handleSetRate}
        />
      </div>
      <h2 className="text-secondary">Summary</h2>
      <div className="row">
        <div className="col-sm">
          <small className="text-muted">
            Monthly payment:
            { formatCurrency(monthly)}
          </small>
        </div>
      </div>

      <div className="row">
        <div className="col-sm">
          <small className="text-muted">
            Total interest:
            { formatCurrency(totalInterest)}
          </small>
        </div>
      </div>
      <h2 className="text-secondary">Amortization</h2>
      <MyGrid rowData={rowData} columnDefs={columnDefs} />
    </div>
  );
};

const MyGrid = ({ columnDefs, rowData }) => (
  <div
    className="ag-theme-alpine"
    style={{
      height: '650px',
      width: '900px',
    }}
  >
    <AgGridReact columnDefs={columnDefs} rowData={rowData} />
  </div>
);

export default App;
