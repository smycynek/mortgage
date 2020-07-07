// Not super-elegant, but I'll clean this up
const getLoanStats = (principal, rate, years) => {
  const totalPayments = years * 12;

  const powerTerm = (monthlyPercentInt, paymentMonths) => (1 + monthlyPercentInt) ** paymentMonths;
  const powerTermP = (monthlyPercentInt, monthIndex) => (1 + monthlyPercentInt) ** monthIndex;

  if ((rate === '0') || (rate === '')) {
    const amortization = [];
    const monthlyPayment = principal / totalPayments;
    const totalInterest = 0;
    for (let i = 0; i < totalPayments + 1; i += 1) {
      amortization.push(
        {
          interest: 0,
          principal: monthlyPayment,
          paymentNumber: `${i}/${totalPayments}`,
          remaining: principal - monthlyPayment * i,
        },
      );
    }
    return {
      amortization: amortization.slice(1),
      totalInterest,
      monthlyPayment,
    };
  }
  const monthlyRate = rate / 1200;
  // eslint-disable-next-line arrow-body-style
  const calculateMonthlyPayment = (loan, monthlyPercentInt, paymentMonths) => {
    return loan * ((monthlyPercentInt * powerTerm(monthlyPercentInt, paymentMonths))
    / (powerTerm(monthlyPercentInt, paymentMonths) - 1));
  };

  // eslint-disable-next-line arrow-body-style
  const remainingAt = (loan, monthlyPercentInt, monthIndex, paymentMonths) => {
    return loan * ((powerTerm(monthlyPercentInt, paymentMonths)
      - powerTermP(monthlyPercentInt, monthIndex))
      / (powerTerm(monthlyPercentInt, paymentMonths) - 1));
  };

  const monthlyPayment = calculateMonthlyPayment(principal, monthlyRate, totalPayments);
  const amortization = [];

  for (let i = 0; i < totalPayments + 1; i += 1) {
    amortization.push({
      paymentNumber: `${i}/${totalPayments}`,
      remaining: remainingAt(principal, monthlyRate, i, totalPayments),
    });
  }

  for (let i = 1; i < totalPayments + 1; i += 1) {
    const monthlyPrincipal = amortization[i - 1].remaining - amortization[i].remaining;
    const interest = monthlyPayment - monthlyPrincipal;
    amortization[i].principal = monthlyPrincipal;
    amortization[i].interest = interest;
  }

  amortization[0].interest = 0;
  amortization[0].principal = 0;
  const sumInterest = (acc, currentValue) => acc + currentValue.interest;
  const totalInterest = amortization.reduce(sumInterest, 0);
  return {
    amortization: amortization.slice(1),
    totalInterest,
    monthlyPayment,
  };
};

export default getLoanStats;
