/* eslint-disable react/prop-types */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/jsx-filename-extension */
import React, { useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { Chart } from 'react-google-charts';
import { Tab, Tabs } from 'react-bootstrap';
import InputNumber from 'rc-input-number';
import 'rc-input-number/assets/index.css';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import getLoanStats from './loan';

const LOAN_MIN = 40000.0;
const LOAN_MAX = 9999999.0;
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
    const val = e;
    if (val < 0) {
      return;
    }
    setLoanAmount(val);
  };

  const handleSetYears = (e) => {
    const val = e;
    if ((val < 0) || (val > 100)) {
      return;
    }
    setYears(val);
  };

  const handleSetRate = (e) => {
    const val = e;
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

      <h4 className="text-secondary">Terms</h4>
      <div className="row">
        <div className="col-5">Principal</div>
        <div className="col-3">Years</div>
        <div className="col-4">Interest</div>
      </div>
      <div className="row">
        <div className="col-5">
          <InputNumber
            htmlFor="pc"
            id="loan"
            name="loan"
            step={10000}
            formatter={(x) => `$${Number(x).toLocaleString('en-US')}`}
            style={{
              borderWidth: '2px',
              borderColor: 'lightblue',
              margin: 4,
              padding: 5,

              height: 40,
            }}
            min={LOAN_MIN}
            max={LOAN_MAX}
            value={loanAmount}
            onChange={handleSetLoan}
          />
        </div>
        <div className="col-3">
          <InputNumber
            id="years"
            name="years"
            min={YEARS_MIN}
            max={YEARS_MAX}
            value={years}
            step={5}
            onChange={handleSetYears}
            style={{
              borderWidth: '2px',
              borderColor: 'lightblue',
              margin: 4,
              padding: 5,

              height: 40,

            }}
          />
        </div>
        <div className="col-4">
          <InputNumber
            id="interest"
            name="interest"
            step={0.05}
            formatter={(x) => `${x}%`}
            min={INTEREST_MIN}
            max={INTEREST_MAX}
            value={rate}
            onChange={handleSetRate}
            style={{
              borderWidth: '2px',
              borderColor: 'lightblue',
              margin: 4,
              padding: 5,

              height: 40,

            }}
          />
        </div>
      </div>
      { (amortization.length > 0)
      && (
      <>
        <h4 className="text-secondary">Summary</h4>

        <div className="text-muted">
          Monthly payment:
          <b>{formatCurrency(monthlyPayment)}</b>
        </div>
        <div className="text-muted">
          Total interest:
          <b>{formatCurrency(totalInterest)}</b>
        </div>
      </>
      )}

      <h4 className="text-secondary">Statistics</h4>
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
                  title: 'Percent Paid',
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
      height: '210px',
      fontSize: 'smaller',
    }}
  >
    <AgGridReact columnDefs={loanDataLabels} rowData={loanData} />
  </div>
);

export default App;
