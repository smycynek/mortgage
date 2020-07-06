/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/jsx-filename-extension */
import React, { useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import getLoanStats from './loan';

const App = () => {
  const [loanAmount, setLoanAmount] = useState(100000);
  const [years, setYears] = useState(30);
  const [rate, setRate] = useState(3);

  function formatCurrency(val) {
    return val.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
    });
  }
  function currencyFormatter(params) {
    return formatCurrency(params.value);
  }

  const columnDefs = [
    {
      headerName: 'Payment #',
      field: 'paymentNumber',
      width: 120,
    },
    {
      headerName: 'Principal',
      field: 'principal',
      valueFormatter: currencyFormatter,
      width: 120,
    },
    {
      headerName: 'Interest',
      field: 'interest',
      valueFormatter: currencyFormatter,
      width: 120,
    },
    {
      headerName: 'Remaining',
      field: 'remaining',
      valueFormatter: currencyFormatter,
      width: 140,
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

  const { amortization, monthlyPayment, totalInterest } = getLoanStats(loanAmount, rate, years);
  return (
    <div className="container-fluid border border-secondary">
      <h1 className="text-info">Mortgage Fun</h1>
      <div className="form-group">
        <h2 className="text-secondary">Terms</h2>
        <label className="form-label" htmlFor="loan">
          Loan $
        </label>
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
        <label className="form-label" htmlFor="years">
          Years
        </label>
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
        <label className="form-label" htmlFor="interest">
          Interest Rate %
        </label>
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
            {formatCurrency(monthlyPayment)}
          </small>
        </div>
      </div>

      <div className="row">
        <div className="col-sm">
          <small className="text-muted">
            Total interest:
            {formatCurrency(totalInterest)}
          </small>
        </div>
      </div>
      <h2 className="text-secondary">Amortization</h2>
      <AmortizationGrid loanData={amortization} loanDataLabels={columnDefs} />
    </div>
  );
};

const AmortizationGrid = ({ loanDataLabels, loanData }) => (
  <div
    className="ag-theme-alpine"
    style={{
      height: '650px',
      width: '500px',
    }}
  >
    <AgGridReact columnDefs={loanDataLabels} rowData={loanData} />
  </div>
);

export default App;
