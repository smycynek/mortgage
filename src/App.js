/* eslint-disable react/prop-types */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/jsx-filename-extension */
import React, { useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { Chart } from 'react-google-charts';
import { Tab, Tabs } from 'react-bootstrap';
import InputNumber from 'rc-input-number';
import styled from 'styled-components';
import 'rc-input-number/assets/index.css';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';

import 'bootstrap/dist/css/bootstrap.css';
import './App.css';
import getLoanStats from './loan';

const LOAN_MIN = 40000.0;
const LOAN_MAX = 9999999.0;
const INTEREST_MIN = 1.0;
const INTEREST_MAX = 10.0;

const YEARS_MIN = 3;
const YEARS_MAX = 40;

const TitleHeading = styled.h1`
  font-size: 1.6em;
`;
const SubHeading = styled.h2`
  margin-top: 1.2em;
  margin-bottom: 0.2em;
  font-size: 1.4em;
`;

const BoldSummary = styled.span`
  font-weight: bold
`;

const App = () => {
  const [loanAmount, setLoanAmount] = useState(400000.0);
  const [years, setYears] = useState(30);
  const [rate, setRate] = useState(3.1);

  const [, updateState] = React.useState();
  const forceUpdate = React.useCallback(() => updateState({}), []);

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
    <div className="container-fluid" role="main">
      <TitleHeading className="text-primary">Mortgage Fun</TitleHeading>

      <SubHeading className="text-secondary">Terms</SubHeading>
      <div style={{ display: 'flex' }}>
        <div>
          <label className="text-secondary" style={{ display: 'block', fontWeight: 600 }} htmlFor="loan">Principal</label>
          <InputNumber
            id="loan"
            name="loan"
            step={10000}
            formatter={(x) => `$${Number(x).toLocaleString('en-US')}`}
            style={{
              display: 'block',
              borderWidth: '2px',
              borderColor: '#0275d8',
              margin: 2,
              padding: 2,
              height: 40,
            }}
            min={LOAN_MIN}
            max={LOAN_MAX}
            value={loanAmount}
            onChange={handleSetLoan}
          />
        </div>
        <div>
          <label className="text-secondary" style={{ display: 'block', fontWeight: 600 }} htmlFor="years">Years</label>
          <InputNumber
            id="years"
            name="years"
            min={YEARS_MIN}
            max={YEARS_MAX}
            value={years}
            step={5}
            onChange={handleSetYears}
            style={{
              display: 'block',
              borderWidth: '2px',
              borderColor: '#0275d8',
              margin: 2,
              padding: 2,

              height: 40,

            }}
          />
        </div>
        <div>
          <label className="text-secondary" style={{ display: 'block', fontWeight: 600 }} htmlFor="interest">Interest</label>
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
              display: 'block',
              borderWidth: '2px',
              borderColor: '#0275d8',
              margin: 2,
              padding: 2,

              height: 40,

            }}
          />
        </div>
      </div>
      { (amortization.length > 0)
      && (
      <>
        <SubHeading className="text-secondary">Summary</SubHeading>

        <div className="text-muted">
          Monthly payment:
          <BoldSummary>{formatCurrency(monthlyPayment)}</BoldSummary>
        </div>
        <div className="text-muted">
          Total interest:
          <BoldSummary>{formatCurrency(totalInterest)}</BoldSummary>
        </div>

      </>
      )}

      <SubHeading className="text-secondary">Statistics</SubHeading>
      <Tabs onSelect={forceUpdate} defaultActiveKey="amortization" id="uncontrolled-tab-example">
        <Tab eventKey="amortization" title="Amortization">
          <AmortizationGrid loanData={amortization} loanDataLabels={columnDefs} />
        </Tab>
        <Tab eventKey="efficiency" title="Efficiency">
          <div width="100%">
            <Chart
              width="100%"
              chartType="LineChart"
              data={percentEquity}
              options={{
                legend: 'none',
                hAxis: {
                  title: 'Years',
                  titleTextStyle: {
                    fontSize: 20,
                    italic: false,
                    fontName: 'Helvetica Neue',
                    fontColor: 'ddd',
                  },
                },
                vAxis: {
                  title: 'Percent Paid',
                  titleTextStyle: {
                    fontSize: 20,
                    italic: false,
                    fontName: 'Helvetica Neue',
                    fontColor: 'ddd',
                  },
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
      height: '200px',
      fontSize: 'smaller',
    }}
  >
    <AgGridReact columnDefs={loanDataLabels} rowData={loanData} />
  </div>
);

export default App;
