import React, { useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ActivityBarChart = ({ expensesData, incomeData, theme }) => {
  const isDarkMode = theme === 'dark';
  const textColor = isDarkMode ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.9)';
  const gridColor = isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';

  const chartData = useMemo(() => {
    // Combine all dates from both datasets and create unique, sorted labels
    const allDates = [...expensesData.map(d => d.date), ...incomeData.map(d => d.date)];
    const uniqueDates = [...new Set(allDates)].sort();

    const expenseMap = new Map(expensesData.map(d => [d.date, d.total]));
    const incomeMap = new Map(incomeData.map(d => [d.date, d.total]));

    return {
      labels: uniqueDates,
      datasets: [
        {
          label: 'Daily Income',
          data: uniqueDates.map(date => incomeMap.get(date) || 0),
          backgroundColor: isDarkMode ? 'rgba(34, 197, 94, 0.8)' : 'rgba(34, 197, 94, 0.7)', // Green
          borderRadius: 4,
        },
        {
          label: 'Daily Expenses',
          data: uniqueDates.map(date => expenseMap.get(date) || 0),
          backgroundColor: isDarkMode ? 'rgba(239, 68, 68, 0.8)' : 'rgba(239, 68, 68, 0.7)', // Red
          borderRadius: 4,
        },
      ],
    };
  }, [expensesData, incomeData, isDarkMode]);

  const options = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: textColor } },
      title: { display: true, text: 'Daily Activity (Last 30 Days)', color: textColor },
    },
    scales: {
      y: { stacked: true, ticks: { color: textColor }, grid: { color: gridColor } },
      x: { stacked: true, ticks: { color: textColor }, grid: { color: gridColor } },
    }
  }), [textColor, gridColor]);

  return <Bar options={options} data={chartData} />;
};

export default ActivityBarChart;