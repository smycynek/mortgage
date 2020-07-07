/* eslint-disable react/prop-types */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/jsx-filename-extension */
import React, { useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { Chart } from 'react-google-charts';
import { Tab, Tabs } from 'react-bootstrap';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import getLoanStats from './loan';

const LOAN_MIN = 40000.0;
const LOAN_MAX = 999999.0;
const INTEREST_MIN = 1.0;
const INTEREST_MAX = 10.0;

const YEARS_MIN = 3;
const YEARS_MAX = 40;

const App = () => {
  const [loanAmount, setLoanAmount] = useState(400000.0);
  const [years, setYears] = useState(30);
  const [rate, setRate] = useState(3.1);

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
      headerName: 'Bill #',
      field: 'paymentNumber',
      minWidth: 70,
      maxWidth: 70,
      flex: 1,
    },
    {
      headerName: 'Principal',
      field: 'principal',
      valueFormatter: currencyFormatter,
      minWidth: 90,
      maxWidth: 125,
      flex: 1,
    },
    {
      headerName: 'Interest',
      field: 'interest',
      valueFormatter: currencyFormatter,
      minWidth: 90,
      maxWidth: 125,
      flex: 1,
    },
    {
      headerName: 'Remaining',
      field: 'remaining',
      valueFormatter: currencyFormatter,
      minWidth: 100,
      maxWidth: 220,
      flex: 4,
    },
  ];

  const handleSetLoan = (e) => {
    const val = e.target.value;
    if (val < 0) {
      return;
    }
    setLoanAmount(val);
  };

  const handleSetYears = (e) => {
    const val = e.target.value;
    if ((val < 0) || (val > 100)) {
      return;
    }
    setYears(val);
  };

  const handleSetRate = (e) => {
    const val = e.target.value;
    if (val < 0) {
      return;
    }
    setRate(val);
  };

  const {
    amortization, monthlyPayment, totalInterest, percentEquity,
  } = getLoanStats(
    loanAmount,
    rate,
    years,
  );

  return (
    <div className="container-fluid">
      <h1 className="text-info">Mortgage Fun</h1>

      <h3 className="text-secondary">Terms</h3>
      <div className="row">
        <div className="col">
          <label className="form-label" htmlFor="loan">
            Loan
          </label>
          <input
            className="form-control"
            id="loan"
            name="loan"
            type="number"
            min={LOAN_MIN}
            max={LOAN_MAX}
            value={loanAmount}
            onChange={handleSetLoan}
          />

        </div>
        <div className="col">
          <label className="form-label" htmlFor="years">
            Years
          </label>
          <input
            className="form-control"
            id="years"
            name="years"
            type="number"
            min={YEARS_MIN}
            max={YEARS_MAX}
            value={years}
            onChange={handleSetYears}
          />
        </div>
        <div className="col">
          <label className="form-label" htmlFor="interest">
            % Interest
          </label>
          <input
            id="interest"
            name="interest"
            className="form-control"
            type="number"
            min={INTEREST_MIN}
            max={INTEREST_MAX}
            value={rate}
            onChange={handleSetRate}
          />
        </div>
      </div>
      { (amortization.length > 0)
      && (
      <>
        <h3 className="text-secondary">Summary</h3>

        <div className="text-muted">
          Monthly payment:
          {formatCurrency(monthlyPayment)}
        </div>
        <div className="text-muted">
          Total interest:
          {formatCurrency(totalInterest)}
        </div>
      </>
      )}

      <h3 className="text-secondary">Statistics</h3>
      <Tabs defaultActiveKey="amortization" id="uncontrolled-tab-example">
        <Tab eventKey="amortization" title="Amortization">
          <AmortizationGrid loanData={amortization} loanDataLabels={columnDefs} />
        </Tab>
        <Tab eventKey="efficiency" title="Efficiency">
          <div className="my-pretty-chart-container">
            <Chart
              chartType="LineChart"
              data={percentEquity}
              options={{
                hAxis: {
                  title: 'Years',
                },
                vAxis: {
                  title: 'Percent Equity',
                },
              }}
            />
          </div>
        </Tab>

      </Tabs>

      <hr />
      <small><a href="https://github.com/smycynek/mortgage">https://github.com/smycynek/mortgage</a></small>
    </div>
  );
};

const AmortizationGrid = ({ loanDataLabels, loanData }) => (
  <div
    className="ag-theme-balham"
    style={{
      height: '230px',
      fontSize: 'smaller',
    }}
  >
    <AgGridReact columnDefs={loanDataLabels} rowData={loanData} />
  </div>
);

export default App;
