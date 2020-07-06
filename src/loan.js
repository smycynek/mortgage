const _loan = 100000;
const _totalPayments = 360;
const _rate = 0.05;
const _monthlyRate = _rate / 12;
const _monthIndex = 10;

const powerTerm = (monthlyRate, totalPayments) => (1 + monthlyRate) ** totalPayments;
const powerTermP = (monthlyRate, monthIndex) => (1 + monthlyRate) ** monthIndex;
const monthlyPayment = (loan, monthlyRate, totalPayments) => loan * ((monthlyRate * powerTerm(monthlyRate, totalPayments)) / (powerTerm(monthlyRate, totalPayments) - 1));

const remainingAt = (loan, monthlyRate, monthIndex, totalPayments) => loan * ((powerTerm(monthlyRate, totalPayments) - powerTermP(monthlyRate, monthIndex)) / (powerTerm(monthlyRate, totalPayments) - 1));

const monthly = (monthlyPayment(_loan, _monthlyRate, _totalPayments));


const remaining = [];

for (let i = 0; i < 361; i += 1) {
  remaining.push({
  remaining: (remainingAt(_loan, _monthlyRate, i, _totalPayments))
  });
}




console.log(remaining);

