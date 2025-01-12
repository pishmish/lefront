import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { getAllSales, getMonthlySales, getQuarterlySales, getYearlySales, getSalesComparison, getDailyProfit, getMonthlyProfit, getQuarterlyProfit, getYearlyProfit, getProfitComparison } from '../../api/analyticsapi';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import './SalesChart.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const SalesChart = () => {
  const [period, setPeriod] = useState('monthly');
  const [salesData, setSalesData] = useState([]);
  const [profitData, setProfitData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState({
    start1: '2024-01-01',
    end1: '2024-12-31',
    start2: '2023-01-01',
    end2: '2023-12-31'
  });
  const [comparisonData, setComparisonData] = useState(null);
  const [activeTab, setActiveTab] = useState('period'); // 'period' or 'compare'

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

  const fetchProfitData = async () => {
    try {
      let response;
      switch (period) {
        case 'daily':
          response = await getDailyProfit();
          break;
        case 'monthly':
          response = await getMonthlyProfit();
          break;
        case 'quarterly':
          response = await getQuarterlyProfit();
          break;
        case 'yearly':
          response = await getYearlyProfit();
          break;
        default:
          response = await getMonthlyProfit();
      }
      setProfitData(response.data);
    } catch (err) {
      console.error('Error fetching profit data:', err);
    }
  };

  useEffect(() => {
    fetchSalesData();
    fetchProfitData();
  }, [period]);

  const handleDateChange = (e) => {
    setDateRange({
      ...dateRange,
      [e.target.name]: e.target.value
    });
  };

  const fetchComparisonData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [salesResponse, profitResponse] = await Promise.all([
        getSalesComparison(
          dateRange.start1,
          dateRange.end1,
          dateRange.start2,
          dateRange.end2
        ),
        getProfitComparison(
          dateRange.start1,
          dateRange.end1,
          dateRange.start2,
          dateRange.end2
        )
      ]);

      setComparisonData({
        period1: {
          ...salesResponse.data.period1,
          totalProfit: profitResponse.data.comparison.period1.totalProfit,
          unitsSold: profitResponse.data.comparison.period1.unitsSold
        },
        period2: {
          ...salesResponse.data.period2,
          totalProfit: profitResponse.data.comparison.period2.totalProfit,
          unitsSold: profitResponse.data.comparison.period2.unitsSold
        }
      });

    } catch (err) {
      setError('Failed to fetch comparison data');
      console.error(err);
    }
    setLoading(false);
  };

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
        label: 'Profit ($)',
        data: profitData.map(item => item.totalProfit),
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
        borderColor: 'rgba(255, 99, 132, 1)',
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

  const comparisonChartData = {
    labels: ['Period 1', 'Period 2'],
    datasets: [
      {
        label: 'Revenue',
        data: comparisonData ? [
          comparisonData.period1.totalRevenue,
          comparisonData.period2.totalRevenue
        ] : [],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
      {
        label: 'Profit',
        data: comparisonData ? [
          comparisonData.period1.totalProfit,
          comparisonData.period2.totalProfit
        ] : [],
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
      },
      {
        label: 'Units Sold',
        data: comparisonData ? [
          comparisonData.period1.unitsSold,
          comparisonData.period2.unitsSold
        ] : [],
        backgroundColor: 'rgba(3, 198, 0, 0.6)',
      }
    ]
  };

  const options1 = {
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
  
  const options2 = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: `Compare Sales`,
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
        {activeTab === 'period' ? (
          <>
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
          </>
        ) : null}
        <button
          className={`tab-button ${activeTab === 'compare' ? 'active' : ''}`}
          onClick={() => setActiveTab(activeTab === 'period' ? 'compare' : 'period')}
        >
          {activeTab === 'period' ? 'Compare Periods' : 'Back to Periods'}
        </button>
      </div>

      {activeTab === 'period' ? (
        <Bar data={chartData} options={options1} />
      ) : (
        <div className="sales-comparison-container">
          <div className="date-inputs">
            <div>
              <h4>Period 1</h4>
              <input
                type="date"
                name="start1"
                value={dateRange.start1}
                onChange={handleDateChange}
              />
              <input
                type="date"
                name="end1"
                value={dateRange.end1}
                onChange={handleDateChange}
              />
            </div>
            <div>
              <h4>Period 2</h4>
              <input
                type="date"
                name="start2"
                value={dateRange.start2}
                onChange={handleDateChange}
              />
              <input
                type="date"
                name="end2"
                value={dateRange.end2}
                onChange={handleDateChange}
              />
            </div>
            <button 
              onClick={fetchComparisonData}
              disabled={loading}
            >
              Compare
            </button>
          </div>

          {error && <div className="error">{error}</div>}
          {loading && <div>Loading...</div>}
          
          {comparisonData && (
            <div className="chart-container">
              <Bar 
                data={{
                  labels: ['Period 1', 'Period 2'],
                  datasets: [
                    {
                      label: 'Revenue',
                      data: [
                        comparisonData.period1.totalRevenue,
                        comparisonData.period2.totalRevenue
                      ],
                      backgroundColor: 'rgba(53, 162, 235, 0.5)'
                    },
                    {
                      label: 'Profit',
                      data: [
                        comparisonData.period1.totalProfit,
                        comparisonData.period2.totalProfit
                      ],
                      backgroundColor: 'rgba(255, 99, 132, 0.6)',
                    },
                    {
                      label: 'Units Sold',
                      data: [
                        comparisonData.period1.unitsSold,
                        comparisonData.period2.unitsSold
                      ],
                      backgroundColor: 'rgba(3, 198, 0, 0.6)',
                    }
                  ]
                }}
                options={options2}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SalesChart;
