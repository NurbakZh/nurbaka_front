import { Card, Spin, Switch, Typography } from 'antd';
import React, { useState, useEffect } from 'react';
import { Bar, CartesianGrid, ComposedChart, Funnel, FunnelChart, Legend, Line, LineChart, Pie, PieChart, Tooltip, XAxis, YAxis, LabelList } from 'recharts';
import NavBar from '../../shared/components/NavBar/NavBar';
import { useThemeStore } from '../../shared/stores/theme';
import dayjs from 'dayjs';
import type { RadioChangeEvent } from 'antd';
import { getDealDynamics, getRevenueAnalytics, getSalesFunnelData, getClientReturnRate } from '../../api';

const buttonStyle = (isActive: boolean, theme: string) => ({
  padding: '8px 12px',
  margin: '4px',
  borderRadius: '8px',
  border: 'none',
  backgroundColor: isActive 
    ? theme === 'light' ? '#1890ff' : '#177ddc'
    : theme === 'light' ? '#f0f0f0' : '#141414',
  color: isActive 
    ? '#ffffff' 
    : theme === 'light' ? '#000000' : '#ffffff',
  cursor: 'pointer',
  fontSize: '14px',
  transition: 'all 0.3s',
});

const buttonContainerStyle = {
  display: 'flex',
  flexWrap: 'wrap' as const,
  gap: '4px',
  marginBottom: '12px',
};

const AnalyticsPage: React.FC = () => {
  const theme = useThemeStore((x) => x.theme);
  
  // State variables for filters
  const [dealData, setDealData] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [funnelData, setFunnelData] = useState([]);
  const [clientReturnData, setClientReturnData] = useState([]);

  const [dealPeriod, setDealPeriod] = useState<string>('30');
  const [revenuePeriod, setRevenuePeriod] = useState<string>('30');
  const [clientReturnPeriod, setClientReturnPeriod] = useState('all');
  const [conversionRates, setConversionRates] = useState([]);
  const [showTrend, setShowTrend] = useState(false);
  

  // Fetch data from APIs
  useEffect(() => {
    const fetchData = async () => {
      try {
        const deals = await getDealDynamics(dealPeriod); // Pass the selected dynamic
        setDealData(deals);

        const revenue = await getRevenueAnalytics(revenuePeriod); // Fetch revenue analytics
        setRevenueData(revenue);

        const funnel = await getSalesFunnelData(); // Fetch sales funnel data
        const conversionRates = funnel.map((item, index, arr) => {
            const conversionRate = index > 0 
                ? ((item.value / arr[index - 1].value) * 100).toFixed(1) 
                : '100';
            const overallConversion = ((item.value / arr[0].value) * 100).toFixed(1);
            return {
                conversionRate,
                overallConversion,
            };
        });
        setConversionRates(conversionRates);
        
        setFunnelData(funnel);

        const clientReturn = await getClientReturnRate(clientReturnPeriod); // Fetch client return rate
        setClientReturnData(clientReturn);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [dealPeriod, revenuePeriod, clientReturnPeriod]); // Dependencies for refetching
  
  // Handle filter changes
  const handleDealPeriodChange = (e: RadioChangeEvent) => {
    setDealPeriod(e.target.value);
  };

  const handleRevenuePeriodChange = (e: RadioChangeEvent) => {
    setRevenuePeriod(e.target.value);
  };
  
  const handleClientReturnPeriodChange = (e: RadioChangeEvent) => {
    setClientReturnPeriod(e.target.value);
  };

  const getChartWidth = () => {
    const maxWidth = window.innerWidth - 68;
    return maxWidth;
  };


  // Calculate trend direction
  const calculateTrendDirection = (data: typeof revenueData) => {
    if (data.length < 2) return 'neutral'; // Not enough data to determine trend

    const firstValue = data[0].revenue;
    const lastValue = data[data.length - 1].revenue;

    console.log(firstValue, lastValue);

    if (lastValue > firstValue) return 'positive';
    if (lastValue < firstValue) return 'negative';
    return 'neutral';
  };

  // Get trend line color
  const getTrendColor = (direction: string) => {
    switch (direction) {
      case 'positive':
        return '#52c41a';
      case 'negative':
        return '#ff4d4f';
      default:
        return 'yellow'; 
    }
  };

  // Add fill color to each data entry
  const coloredClientReturnData = clientReturnData.map((entry, index) => {
    const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#ff0000'];
    return {
      ...entry,
      fill: entry.name === 'Возвращающиеся' ? colors[0] : colors[1],
    };
  });

  return (
    <div className={`page ${theme}`}>
      <div className='container' style={{
        padding: '20px'
      }}>
        <Typography.Title level={2} style={{
          color: theme === 'light' ? 'var(--text-light)' : 'var(--text-dark)',
          marginBottom: '24px'
        }}>
          Аналитика
        </Typography.Title>
        
        {/* Global Date Range Filter */}
        {/* <Card className={`card ${theme}`} style={{ 
          backgroundColor: theme === 'light' ? 'var(--card-light)' : 'var(--card-dark)', 
          border: 'none',
          borderRadius: '12px',
          boxShadow: theme === 'light' ? '0px 4px 10px rgba(0, 0, 0, 0.2)' : '0px 4px 10px rgba(255, 255, 255, 0.1)',
          color: theme === 'light' ? 'var(--text-light)' : 'var(--text-dark)',
          marginBottom: '24px',
          padding: '20px',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography.Title level={4} style={{ margin: 0, color: theme === 'light' ? 'var(--text-light)' : 'var(--text-dark)' }}>
              Фильтр по периоду
            </Typography.Title>
            <RangePicker 
              style={{ width: '300px' }}
              onChange={handleDateRangeChange}
            />
          </div>
        </Card> */}

        {/* Deal Dynamics Chart */}
        <Card className={`card ${theme}`} style={{ 
          backgroundColor: theme === 'light' ? 'var(--card-light)' : 'var(--card-dark)', 
          border: 'none',
          borderRadius: '12px',
          boxShadow: theme === 'light' ? '0px 4px 10px rgba(0, 0, 0, 0.2)' : '0px 4px 10px rgba(255, 255, 255, 0.1)',
          color: theme === 'light' ? 'var(--text-light)' : 'var(--text-dark)',
          marginBottom: '24px',
          padding: '20px',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <Typography.Title level={4} style={{ margin: 0, color: theme === 'light' ? 'var(--text-light)' : 'var(--text-dark)' }}>
              Динамика сделок
            </Typography.Title>
          </div>
          <div style={buttonContainerStyle}>
            {['7', '30', '90', '365'].map((period) => (
              <button
                key={period}
                style={buttonStyle(dealPeriod === period, theme)}
                onClick={() => handleDealPeriodChange({ target: { value: period } } as RadioChangeEvent)}
              >
                {period === '7' && 'Неделя'}
                {period === '30' && 'Месяц'}
                {period === '90' && 'Квартал'}
                {period === '365' && 'Год'}
              </button>
            ))}
          </div>
          <div style={{ width: '100%', height: 300 }}>
            <LineChart
              data={dealData}
              height={300}
              margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
              width={getChartWidth()}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip 
                formatter={(value, name, props) => {
                  const period = props.payload.period;
                  const formattedPeriod = dayjs(period).format('DD.MM.YYYY');
                  return [`${value}`, `${name} (${formattedPeriod})`];
                }}
              />
              <Legend align="center" layout="horizontal" verticalAlign="bottom" />
              <Line activeDot={{ r: 6 }} dataKey="new" name="Новые" stroke="#8884d8" type="monotone" />
              <Line dataKey="open" name="Открытые" stroke="#82ca9d" type="monotone" />
              <Line dataKey="closed" name="Закрытые" stroke="#ffc658" type="monotone" />
            </LineChart>
          </div>
        </Card>

        {/* Revenue Analytics */}
        <Card className={`card ${theme}`} style={{ 
          backgroundColor: theme === 'light' ? 'var(--card-light)' : 'var(--card-dark)', 
          border: 'none',
          borderRadius: '12px',
          boxShadow: theme === 'light' ? '0px 4px 10px rgba(0, 0, 0, 0.2)' : '0px 4px 10px rgba(255, 255, 255, 0.1)',
          color: theme === 'light' ? 'var(--text-light)' : 'var(--text-dark)',
          marginBottom: '24px',
          padding: '20px',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <Typography.Title level={4} style={{ margin: 0, color: theme === 'light' ? 'var(--text-light)' : 'var(--text-dark)' }}>
              Аналитика дохода
            </Typography.Title>
          </div>
          <div style={buttonContainerStyle}>
            {['30', '90', '365'].map((period) => (
              <button
                key={period}
                style={buttonStyle(revenuePeriod === period, theme)}
                onClick={() => handleRevenuePeriodChange({ target: { value: period } } as RadioChangeEvent)}
              >
                {period === '30' && 'Месяц'}
                {period === '90' && 'Квартал'}
                {period === '365' && 'Год'}
              </button>
            ))}
            <div style={{ display: 'flex', alignItems: 'center', marginLeft: '12px' }}>
              <Switch
                checked={showTrend}
                style={{ marginRight: '8px' }}
                onChange={setShowTrend}
              />
              <span style={{ color: theme === 'light' ? 'var(--text-light)' : 'var(--text-dark)' }}>
                {showTrend ? 'Скрыть тренд' : 'Показать тренд'}
              </span>
            </div>
          </div>
          <div style={{ width: '100%', height: 300 }}>
            {revenueData && revenueData.length > 0 ? (
              <ComposedChart
                data={revenueData}
                height={300}
                margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                width={getChartWidth()}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip 
                  formatter={(value, name, props) => {
                    const date = dayjs(props.payload.period).format('DD.MM.YYYY');
                    return [`${value.toLocaleString()} ₽`, `Доход (${date})`];
                  }}
                />
                <Legend />
                <Bar dataKey="revenue" fill="#82ca9d" name="Доход" />
                {showTrend && revenuePeriod !== 'month' && (
                  <Line
                    dataKey="revenue"
                    dot={false}
                    name="Тренд"
                    stroke={getTrendColor(calculateTrendDirection(revenueData))}
                    strokeWidth={2}
                    type="monotone"
                  />
                )}
              </ComposedChart>
            ) : (
               <Spin />
            )}
          </div>
        </Card>

        {/* Sales Funnel */}
        <Card className={`card ${theme}`} style={{ 
          backgroundColor: theme === 'light' ? 'var(--card-light)' : 'var(--card-dark)', 
          border: 'none',
          borderRadius: '12px',
          boxShadow: theme === 'light' ? '0px 4px 10px rgba(0, 0, 0, 0.2)' : '0px 4px 10px rgba(255, 255, 255, 0.1)',
          color: theme === 'light' ? 'var(--text-light)' : 'var(--text-dark)',
          marginBottom: '24px',
          padding: '20px',
        }}>
          <Typography.Title level={4} style={{ marginBottom: '16px', color: theme === 'light' ? 'var(--text-light)' : 'var(--text-dark)' }}>
            Воронка продаж
          </Typography.Title>
          <div style={{ width: '100%', height: 300 }}>
            <FunnelChart
              height={300}
              margin={{ top: 20, right: 20, left: 0, bottom: 0 }}
              width={getChartWidth()}
            >
              <Funnel
                isAnimationActive
                dataKey="value"
                nameKey="name"
                data={funnelData.map((item, index) => ({
                  ...item,
                  fill: ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#ff0000'][index % 5],
                }))}
              >
                <LabelList
                  position="right"
                  content={(props: any) => {
                    const { index } = props;
                    const conversionRate = conversionRates[index]?.conversionRate;
                    if (!conversionRate || conversionRate === '100') return null;
                    return (
                      <text fill="black" fontSize={16} textAnchor="middle" x={props.x + props.width / 2} y={props.y + 5}>
                        {`${conversionRate}%`}
                      </text>
                    );
                  }}
                />
              </Funnel>
              <Tooltip formatter={(value) => [`${value} клиентов`, '']} />
            </FunnelChart>
          </div>
          <div style={{ marginTop: '16px' }}>
            {conversionRates.map((item, index, arr) => {
              return (
                <div key={item.name} style={{ 
                  borderBottom: index < arr.length - 1 ? '1px solid #eee' : 'none',
                  color: theme === 'light' ? 'var(--text-light)' : 'var(--text-dark)',
                  display: 'flex', 
                  justifyContent: 'space-between',
                  padding: '8px 0',
                }}>
                  <span>{funnelData[index].name}</span>
                  <span>
                    {funnelData[index].value} клиентов
                    {index > 0 ? (
                      <span style={{ marginLeft: '8px', fontSize: '0.9em', color: '#888' }}>
                        (конверсия с пред. шага: {item.conversionRate}%, общая: {item.overallConversion}%)
                      </span>
                    ) : ''}
                  </span>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Client Return Rate */}
        <Card className={`card ${theme}`} style={{ 
          backgroundColor: theme === 'light' ? 'var(--card-light)' : 'var(--card-dark)', 
          border: 'none',
          borderRadius: '12px',
          boxShadow: theme === 'light' ? '0px 4px 10px rgba(0, 0, 0, 0.2)' : '0px 4px 10px rgba(255, 255, 255, 0.1)',
          color: theme === 'light' ? 'var(--text-light)' : 'var(--text-dark)',
          marginBottom: '24px',
          padding: '20px',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <Typography.Title level={4} style={{ margin: 0, color: theme === 'light' ? 'var(--text-light)' : 'var(--text-dark)' }}>
              Возвращаемость клиентов
            </Typography.Title>
          </div>
          <div style={buttonContainerStyle}>
            {['30', '60', '90', 'all'].map((period) => (
              <button
                key={period}
                style={buttonStyle(clientReturnPeriod === period, theme)}
                onClick={() => handleClientReturnPeriodChange({ target: { value: period } } as RadioChangeEvent)}
              >
                {period === '30' && '30 дней'}
                {period === '60' && '60 дней'}
                {period === '90' && '90 дней'}
                {period === 'all' && 'Все время'}
              </button>
            ))}
          </div>
          <div style={{ width: '100%', height: 300, display: 'flex', justifyContent: 'center' }}>
            <PieChart
              height={300}
              width={Math.min(getChartWidth(), 400)}
            >
              <Pie
                cx="50%"
                cy="50%"
                data={coloredClientReturnData}
                dataKey="value"
                labelLine={true}
                nameKey="name"
                outerRadius={Math.min(getChartWidth() / 4, 100)}
                label={(entry) => {
                  const total = clientReturnData.reduce((sum, item) => sum + item.value, 0);
                  const percentage = ((entry.value / total) * 100).toFixed(1);
                  return `${entry.value} (${percentage}%)`;
                }}
              />
              <Tooltip formatter={(value) => [`${value}%`, '']} />
              <Legend align="center" layout="horizontal" verticalAlign="bottom" />
            </PieChart>
          </div>
        </Card>
      </div>
      <NavBar />
    </div>
  );
};

export default AnalyticsPage;