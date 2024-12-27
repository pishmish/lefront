import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { getAllSales, getMonthlySales, getQuarterlySales, getYearlySales } from '../../api/analyticsapi';
import './SalesChart.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const SalesChart = () => {
  const [period, setPeriod] = useState('monthly');
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSalesData = async () => {
    setLoading(true);
    setError(null);
    try {
      let response;
      switch (period) {
        case 'daily':
          response = await getAllSales();
          break;
        case 'monthly':
          response = await getMonthlySales();
          break;
        case 'quarterly':
          response = await getQuarterlySales();
          break;
        case 'yearly':
          response = await getYearlySales();
          break;
        default:
          response = await getMonthlySales();
      }
      setSalesData(response.data);
    } catch (err) {
      setError('Failed to fetch sales data');
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSalesData();
  }, [period]);

  const chartData = {
    labels: salesData.map(item => {
      switch (period) {
        case 'daily':
          return item.date;
        case 'monthly':
          return item.month;
        case 'quarterly':
          return item.quarter;
        case 'yearly':
          return item.year;
        default:
          return item.month;
      }
    }),
    datasets: [
      {
        label: 'Revenue ($)',
        data: salesData.map(item => item.totalRevenue),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      },
      {
        label: 'Units Sold',
        data: salesData.map(item => item.unitsSold),
        backgroundColor: 'rgba(53, 162, 235, 0.6)',
        borderColor: 'rgba(53, 162, 235, 1)',
        borderWidth: 1
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: `Sales Overview - ${period.charAt(0).toUpperCase() + period.slice(1)}`,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <div className="period-selector">
        <button
          className={period === 'daily' ? 'active' : ''}
          onClick={() => setPeriod('daily')}
        >
          Daily
        </button>
        <button
          className={period === 'monthly' ? 'active' : ''}
          onClick={() => setPeriod('monthly')}
        >
          Monthly
        </button>
        <button
          className={period === 'quarterly' ? 'active' : ''}
          onClick={() => setPeriod('quarterly')}
        >
          Quarterly
        </button>
        <button
          className={period === 'yearly' ? 'active' : ''}
          onClick={() => setPeriod('yearly')}
        >
          Yearly
        </button>
      </div>
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default SalesChart;
