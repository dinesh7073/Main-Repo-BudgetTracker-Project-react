import React, { useContext, useEffect, useState } from 'react';
import { Button, Card, List, Select, Typography, Statistic, StatisticProps, Flex, Progress, ProgressProps, Row, Col, Tag } from 'antd';
import { ArrowLeftRight, CircleArrowDown, CircleArrowUp, Goal, } from 'lucide-react';
import dayjs, { Dayjs } from 'dayjs';
import CountUp from 'react-countup';
import { useNavigate } from 'react-router-dom';
import '../CSS/Dashboard.css';
import { BiCoin } from 'react-icons/bi';
import { MenuItem } from '@mui/material';
import { BarChart, LineChart, PieChart } from '@mui/x-charts';
import axios from 'axios';
import UserContext from '../UserContext';
import '../CSS/ThemeColors.css'
import { REACT_APP_BASE_URL } from './Common/Url';
import '../Common_CSS_Class/commonCss.css';

const formatter: StatisticProps['formatter'] = (value) => (
  <CountUp end={value as number} separator="," />
);
const { Title, Text } = Typography;
interface TransactionType {  // the final fileds for frontend and backend 
  id: string;
  userId: string;
  transactionType: number;
  accountType: number | null;
  categoryType: number | null;
  label: string;
  amount: number;
  date: Dayjs | null;
  time: Dayjs | null;
  currency?: string;
}
interface Budget {
  id: string;
  userid: string;
  startDate: string | null;
  endDate: string | null;
  category: number | null;
  amount: number;
  amountSpent: number;

}

const transTransactionType = (records: TransactionType[]): TransactionType[] => {
  return records.map((transactions) => ({
    ...transactions,
  }));
};
interface GoalData {
  id: string,
  userId: string,
  goal: string,
  targetAmount: number,
  savedAmount: number,
  targetDate: Dayjs | null
}

const Dashboard = () => {

  const { userDetails, setTransactionData, transactionData } = useContext<any>(UserContext);
  var navigate = useNavigate();
  const [records, setRecords] = useState<TransactionType[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [selectedDateRange, setSelectedDateRange] = useState<[Dayjs, Dayjs] | null>(null);
  const [transactiontransactionType, setTransactiontransactionType] = useState<'Income' | 'Expense' | 'All'>('All');
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [goalExists, setGoalExists] = useState(false);
  const [goals, setGoals] = useState<GoalData[]>([]);

  const UserId = userDetails.UserId;


  useEffect(() => {
    axios.get(`${REACT_APP_BASE_URL}TransactionsController/${UserId}GetTransactionsByUserId`)
      .then((res) => {
        if (res.status === 200) {

          const transformedRecords = transTransactionType(res.data);
          setRecords(transformedRecords.map(record => ({
            ...record,
            amount: Number(record.amount),
          })));
          setTransactionData(transformedRecords)
        }
      })
      .catch((err) => console.log("Error from server", err, 'userDetails', userDetails));
  }, []);


  useEffect(() => {
    axios.get(`${REACT_APP_BASE_URL}BudgetsController/${UserId}GetBudgetById`)
      .then((res) => {
        if (res.status === 200) {

          const transformedBudgets = res.data.map((budget: Budget) => {
            const amountSpent = transactionData
              .filter((transactionObj: TransactionType) => transactionObj.categoryType === budget.category)
              .reduce((total: number, transactionObj: TransactionType) => total + transactionObj.amount, 0);

            return {
              ...budget,
              amount: Number(budget.amount),
              amountSpent: Number(amountSpent),
              startDate: budget.startDate,
              endDate: budget.endDate,
            };
          });
          setBudgets(transformedBudgets);
        }
      })
      .catch((err) => console.log("Error from server", err));
  }, [UserId, transactionData]);


  const getCategoryLabel = (category: number | null) => {
    switch (category) {
      case 1: return 'Salary';
      case 2: return 'Investments';
      case 3: return 'Business';
      case 4: return 'Other Income';
      case 5: return 'Food,Drinks';
      case 6: return 'Clothes & Footwear';
      case 7: return 'Housing';
      case 8: return 'Vehicle';
      case 9: return 'Transportation';
      case 10: return 'Health Care';
      case 11: return 'Communication, PC';
      case 12: return 'Entertainment';
      case 13: return 'Income';
    }
  }
  const categories = budgets.map(budget => getCategoryLabel(budget.category));
  const seriesData = budgets.map(budget => ({
    amount: budget.amount,
    amountSpent: budget.amountSpent
  }));
  const filteredTransactions = records.filter(record => {
    const iscategoryTypeMatch = selectedCategories.length === 0 || selectedCategories.includes(Number(record.categoryType));
    const transactionDate = dayjs(record.date);
    const isDateMatch = !selectedDateRange || (
      transactionDate.isValid()
      &&
      transactionDate.isSameOrAfter(selectedDateRange[0], 'day') &&
      transactionDate.isSameOrBefore(selectedDateRange[1], 'day')
    );
    return iscategoryTypeMatch && isDateMatch && (
      transactiontransactionType === 'All' ||
      (transactiontransactionType === 'Income' && record.transactionType === 1) ||
      (transactiontransactionType === 'Expense' && record.transactionType === 2)
    );
  });

  const sortedTransactions = filteredTransactions
    .sort((a, b) => dayjs(a.date).isBefore(dayjs(b.date)) ? 1 : -1)
    .slice(0, 3);

  const getAccountName = (accountType: number | null) => {
    switch (accountType) {
      case 1: return "Cash";
      case 2: return "Saving Account";
      case 3: return "General";
      case 4: return "Credit Card";
      case 5: return "Current Account";
      default: return "Unknown";
    }
  };

  const [timeRange, setTimeRange] = useState<'weekly' | 'monthly' | 'yearly'>('weekly');
  const handleTimeRangeChange = (value: 'weekly' | 'monthly' | 'yearly') => {
    setTimeRange(value);
  };

  const getDataForTimeRange = (range: 'weekly' | 'monthly' | 'yearly') => {
    switch (range) {
      case 'weekly':
        return {
          pData: [4000, 3000, 2000, 2780, 1890, 2390, 2333],
          uData: [2400, 1398, 9800, 3908, 4800, 3800, 1222],
          xLabels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        };
      case 'monthly':
        return {
          pData: [12000, 15000, 17000, 13000, 16000, 18000, 20000, 22000, 21000, 24000, 23000, 25000],
          uData: [11000, 14000, 16000, 12000, 15000, 17000, 19000, 21000, 20000, 23000, 22000, 24000],
          xLabels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        };
      case 'yearly':
        return {
          pData: [150000, 170000, 180000, 200000],
          uData: [140000, 160000, 175000, 190000],
          xLabels: ['2021', '2022', '2023', '2024'],
        };
      default:
        return { pData: [], uData: [], xLabels: [] };
    }
  };

   const { pData, uData, xLabels } = getDataForTimeRange(timeRange);
  const twoColors: ProgressProps['strokeColor'] = {
    '0%': '#ffffff',
    '100%': '#088395',
  };
  const oneColors: ProgressProps['strokeColor'] = {
    '0%': '#ffffff',
    '100%': '#FF4D4F',
  };

  const colors = [
    '#FF6384',
    '#36A2EB',
    '#FFCE56',
    '#4BC0C0',
    '#9966FF',
    '#FF9F40',
    '#66FF66',
    '#FF6666',
    '#66CCFF',
    '#FFCC99',
  ];

  const filteredExpenses = records.filter(record =>
    record.transactionType === 2 &&
    (selectedCategories.length === 0 || selectedCategories.includes(Number(record.categoryType))) &&
    (!selectedDateRange || (
      dayjs(record.date).isValid() &&
      dayjs(record.date).isSameOrAfter(selectedDateRange[0], 'day') &&
      dayjs(record.date).isSameOrBefore(selectedDateRange[1], 'day')
    ))
  );
  const filteredIncome = records.filter(record =>
    record.transactionType === 1 &&
    (selectedCategories.length === 0 || selectedCategories.includes(Number(record.categoryType))) &&
    (!selectedDateRange || (
      dayjs(record.date).isValid() &&
      dayjs(record.date).isSameOrAfter(selectedDateRange[0], 'day') &&
      dayjs(record.date).isSameOrBefore(selectedDateRange[1], 'day')
    ))
  );

  const aggregateExpensesByCategory = (expenses: TransactionType[]) => {
    const categoryTotals: { [key: string]: number } = {};
    expenses.forEach(expense => {
      const category = getCategoryLabel(expense.categoryType);
      if (category) {
        categoryTotals[category] = (categoryTotals[category] || 0) + expense.amount;
      }
    });

    return Object.entries(categoryTotals).map(([label, value], index) => ({
      id: index,
      value,
      label,
      color: colors[index % colors.length],
    }));
  };

  const pieChartData = aggregateExpensesByCategory(filteredExpenses);
  const getTotalExpenses = (expenses: TransactionType[]) => {
    return expenses.reduce((total, expense) => total + expense.amount, 0);
  };

  const getTotalIncome = (income: TransactionType[]) => {
    return income.reduce((total, income) => total + income.amount, 0);
  };
  const getExpenseBudgetAmount = (budgetAmount: Budget[]) => {
    budgetAmount
      .filter(budget => budget.category === 2)
      .reduce((acc, budget) => acc + budget.amount, 0);
    return budgetAmount

  }
  const totalIncome = getTotalExpenses(filteredIncome);
  const totalExpenses = getTotalIncome(filteredExpenses);

  const transformData = (goals: GoalData[]): GoalData[] => {
    return goals.map((goal) => ({
      ...goal,
    }));
  };


  useEffect(() => {
    axios.get(`${REACT_APP_BASE_URL}SavingsController/${UserId}GetSavingsByUserId`)
      .then((res) => {
        if (res.status === 200) {
          const transformedGoal = transformData(res.data);
          setGoalExists(res.data.length > 0);
          setGoals(transformedGoal.map(goal => ({
            ...goal,
            targetAmount: Number(goal.targetAmount),
            savedAmount: Number(goal.savedAmount),
            targetDate: dayjs(goal.targetDate)

          })));
        }
      })
      .catch((err) => console.log("Error from server", err));
  }, []);

  let searchTerm: string = '';

  const filteredGoals = goals.filter(goalObj => {
    const isGoalStringMatch = searchTerm === '' || goalObj.goal.toLowerCase().includes(searchTerm.toLowerCase());

    const targetDate = dayjs(goalObj.targetDate);
    const isDateMatch = !selectedDateRange || (
      targetDate.isValid() &&
      targetDate.isSameOrAfter(selectedDateRange[0], 'day') &&
      targetDate.isSameOrBefore(selectedDateRange[1], 'day')
    );
    return isGoalStringMatch && isDateMatch;
  });

  const sortedGoals = filteredGoals
    .sort((a, b) => dayjs(a.targetDate).isBefore(dayjs(b.targetDate)) ? 1 : -1)
    .slice(0, 2);

  const Incomepercent = (totalExpenses / totalIncome) * 100;

  return (
    <>

      {/* <div className="flex-row-container"> */}
      {/* <div className='top-main-container'>
            <div className="three-cards-container">
              <div className=' d-cards' style={{ marginRight: '10px', backgroundColor:"#ffffff"  }}>
                <p className="recent-transactions-title" >
                  Expenses Structure
                </p>
                <hr />
                <div className="top-one-cards" >
                  <Row gutter={20}>
                    <Col span={12}>
                      <PieChart
                        slotProps={{
                          legend: { hidden: true },
                        }}
                        width={300}
                        height={200}
                        series={[
                          {
                            data: pieChartData,
                            highlightScope: { fade: 'global', highlight: 'item' },
                            faded: { innerRadius: 40, additionalRadius: -20, color: 'gray' },
                          },
                        ]}
                      />
                    </Col>
                    <Col span={8}>


                      <Card className='total-subcards-background ' style={{ width: '145px' }} >
                        <Title className='fs-6'>Total Expenses</Title>
                        <Statistic

                          value={totalExpenses}

                          prefix="₹"
                          valueStyle={{ color: '#ff4d4f', fontSize: '22px' }}
                        />
                      </Card>

                    </Col>
                  </Row>
                </div>
              </div> */}


      {/* <div style={{ width: '24%', height: '80%', marginRight: '10px' }}>
                <Card className="three-cards  total-cards-background   five-cards" style={{ height: '100%', width: '100%' }}>
                  <p className="recent-transactions-title">
                    <Goal className="recent-transactions-icon" color="#121212" size={20} />
                    Recent Goals
                  </p>
                  <hr style={{ marginBottom: '5px' }} />
                  <div className="top-one-cards" onClick={() => navigate("/goal")}>
                    {sortedGoals.map((goal: GoalData, index: number) => {

                      const percent = (goal.savedAmount / goal.targetAmount) * 100;
                      const isComplete = goal.savedAmount >= goal.targetAmount;
                      const color =
                        percent <= 20 ? '#ff4d4f' :
                          percent <= 40 ? '#ffa940' :
                            percent <= 70 ? 'blue' :
                              '#52c41a'; */}

      {/* return (
                        <Card
                          hoverable
                          key={goal.id}
                          style={{
                            width: 280,
                            height: 105,
                            margin: 0,
                            padding: 6,
                            backgroundColor: isComplete ? '#dff0d8' : 'white',
                            marginBottom: 7
                          }}>

                          <Card.Meta
                            avatar={
                              <Progress
                                type="circle"
                                width={65}
                                percent={(goal.savedAmount / goal.targetAmount) * 100}
                                strokeColor={isComplete ? '#52c41a' : color}
                                format={(percent: any) => `${Math.round(percent).toLocaleString()}%`}
                                className='align-self-center py-1 '
                                style={{ margin: '0' }}
                              />

                            }
                            description={
                              <div className='d-flex flex-column '>
                                <small className='text-dark'>Target Amount-{goal.targetAmount}</small>
                                <small className='text-dark'>Saved Amount-{goal.savedAmount}</small>
                                <small className='text-dark'>Target Date {dayjs(goal.targetDate).format('DD/MM/YYYY')}</small>
                              </div>
                            }
                          />
                      </Card>
                      ) */}
      {/* }
                    )}
                  </div>
                </Card>
              </div> */}


      {/* <div className='d-flex flex-column' style={{ width: '24%', height: '80%', marginRight: '10px' }}>
                <Card className='five-cards total-cards-background' style={{
                  height: '100%'
                }}>
                  <p className="recent-transactions-title">
                    <BiCoin className="recent-transactions-icon" color="#121212" size={20} />
                    Budget
                  </p>
                  <hr style={{ marginBottom: '10px' }} />
                  <div style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>

                    <div className=" card-spacing " style={{ marginBottom: '20px' }} >
                      <div className="top-three-cards" onClick={() => navigate("/budget")}>
                        <CircleArrowDown className="card-icon" color="#2F70F2" size={35} />
                        <div style={{ display: 'flex', flexDirection: 'column', alignContent: 'center' }}>
                          <p className="card-title total-income">
                            {categories.map((category) => category === "Income") ? "Income" : ""}
                          </p>
                          <div className="statistic-container">
                            <span style={{ fontSize: '20px', marginRight: '5px' }}> ₹ </span>
                            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                              <Statistic className="statistic-value" value={totalIncome} formatter={formatter} />
                            </div>
                          </div>
                        </div>
                      </div>
                      <p className='text-end' style={{ alignContent: 'end', fontSize: '13px', margin: '0px' }}>Spent <span style={{ fontWeight: 'bold' }}> ₹{`${totalExpenses}`}</span></p>
                      <Flex vertical gap="middle">
                        <Progress percent={Incomepercent} format={(percent: any) => `${Math.round(percent).toLocaleString()}%`} strokeColor={twoColors} />
                      </Flex>
                    </div> */}

      {/* <div className=" card-spacing">
                      <div className="top-three-cards" onClick={() => navigate("/budget")}>
                        <CircleArrowUp className="card-icon" color="#876AFE" size={35} />

                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <p className="card-title total-expense">
                            Expense
                          </p>
                          <div className="statistic-container">
                            <span style={{ fontSize: '20px', marginRight: '5px' }}> ₹ </span>

                            <div style={{ display: 'flex', flexDirection: 'row' }}>
                              <Statistic className="statistic-value" value={totalExpenses} formatter={formatter} />
                            </div>
                          </div>
                        </div>
                      </div>
                      <p className='text-end' style={{ alignContent: 'end', fontSize: '13px', margin: '0px' }}>Target <span style={{ fontWeight: 'bold' }}>₹{`${Number()}`}</span></p>
                      <Flex vertical gap="middle">
                        <Progress percent={69.9} strokeColor={oneColors} />
                      </Flex>
                    </div>
                  </div>
                </Card>
              </div> */}

      {/* <div style={{ width: '25%', height:"90%",  }} >
                <Card className="recent-transactions-card total-cards-background  five-cards" style={{ paddingBottom: '0px' }}>
                  <p className="recent-transactions-title" >
                    <ArrowLeftRight className="recent-transactions-icon" color="#121212" size={20} />
                    Recent Transactions
                  </p>
                  <hr style={{ marginBottom: '0px' }} />
                  <div className="transactions-list-container">
                    <div style={{ height: '200px' }}>


                      <List
                        itemLayout="horizontal"
                        dataSource={sortedTransactions}
                        renderItem={(transaction) => (
                          <List.Item>
                            <List.Item.Meta
                              title={<Text strong>{getCategoryLabel(transaction.categoryType)}</Text>}
                              description={<Text type="secondary">{getAccountName(transaction.accountType)} - {dayjs(transaction.date).format('YYYY-MM-DD')}</Text>}
                            />
                            <Text type={transaction.transactionType === 1 ? 'success' : 'danger'}>
                              {transaction.transactionType === 1 ? '+' : '-'}₹{transaction.amount.toLocaleString()}
                            </Text>
                          </List.Item>
                        )}
                      />
                    </div>
                    <Button block className="view-all-transactions-button  main-buttons" onClick={() => navigate("/transaction")}>
                      View All Transaction
                    </Button>
                  </div>
                </Card>
              </div>
            </div> */}

      {/* <div className="three-cards-container" style={{ marginTop: '10px' }}>
              <Card className='five-cards total-cards-background' style={{ width: '57.5%', height: 340 }} >
                <div style={{
                  marginBottom: '-15px'

                }}>
                  <Select
                    value={timeRange}
                    onChange={handleTimeRangeChange}
                    style={{ width: 120 }}
                  >
                    <MenuItem value="weekly">Weekly</MenuItem>
                    <MenuItem value="monthly">Monthly</MenuItem>
                    <MenuItem value="yearly">Yearly</MenuItem>
                  </Select>
                </div>
                <LineChart
                  width={740}
                  height={300}
                  series={[
                    { data: pData, label: 'Income', color: '#071952' },
                    { data: uData, label: 'Expenses', color: '#088395' },
                  ]}
                  xAxis={[
                    {
                      scaleType: 'point',
                      data: xLabels,
                      label: '',
                    }
                  ]}
                  yAxis={[
                    {
                      label: '',
                    }
                  ]}
                />
              </Card>
              <Card className='total-cards-background' style={{ width: '41.5%', height: '340px' }}>
                <div className="three-cards   five-cards" style={{ height: '100%', width: '100%', boxShadow: 'none' }}>
                  <p className="recent-transactions-title">
                    Budget v/s Expenses
                  </p>
                  <hr style={{ margin: '10px 0px 0px 0px' }} />
                  <div className="top-one-cards" onClick={() => navigate("/goal")}>
                    <BarChart
                      width={530}
                      height={295}
                      series={[
                        { data: seriesData.map(data => data.amount), label: 'Budget', color: '#2190A0' },
                        { data: seriesData.map(data => data.amountSpent), label: 'Expenses', color: '#FF8485' },
                      ]}
                      xAxis={[{ data: categories, scaleType: 'band' }]}
                    />
                  </div>
                </div>
              </Card>
            </div>
          </div> */}
      {/* </div> */}

      <div style={{ width: "100%", height: "100%", backgroundColor: "#f5f5f5" }}>
        <Row>
          <Col xs={{ span: 5, offset: 1 }} lg={{ span: 5, offset: 0 }}>
            <Card style={{ width: "300px", height: "95%", padding: "5px" }}>
              <p style={{ marginBottom: 5}}> Expenses Structure</p>
              <div className="top-one-cards" >
                <Row gutter={20}>
                  <Col span={12}>
                    <PieChart
                      slotProps={{
                        legend: { hidden: true },
                      }}
                      width={260}
                      height={200}
                      series={[
                        {
                          data: pieChartData,
                          highlightScope: { fade: 'global', highlight: 'item' },
                          faded: { innerRadius: 40, additionalRadius: -20, color: 'gray' },
                        },
                      ]}
                    />
                  </Col>
                  <Col span={2}>


                    <Card style={{ width: '120px', height: '90px',padding:0 }}  className='expenseCard ant-card ant-card-body'>
                      <p style={{marginBottom:4, fontSize:'13px'}}>Total Expenses</p>
                      <Statistic

                        value={totalExpenses}

                        prefix="₹"
                        valueStyle={{ color: '#ff4d4f', fontSize: '18px' }}
                      />
                    </Card>

                  </Col>
                </Row>
              </div>
            </Card>
          </Col>
          <Col xs={{ span: 11, offset: 1 }} lg={{ span: 5 }}>
            <Card style={{ width: "300px", height: "95%", padding:'0px 5px 10px 5px'}}>
              <p>
                <BiCoin className="recent-transactions-icon" color="#121212" size={20} />
                Budget
              </p>

              <div style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>

                <div>
                  <div className="top-three-cards" onClick={() => navigate("/budget")} >
                    <CircleArrowDown className="card-icon" color="#2F70F2" size={25} />
                    <div style={{ display: 'flex', flexDirection: 'column', alignContent: 'center' }}>
                      <p className="card-title total-income">
                        {categories.map((category) => category === "Income") ? "Income" : ""}
                      </p>
                      <div className="statistic-container" style={{margin:0}}>
                        <span style={{ fontSize: '18px', marginRight: '5px' }}> ₹ </span>
                        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', fontSize:'16px' }}>
                          <Statistic className="statistic-value" value={totalIncome} formatter={formatter} valueStyle={{  fontSize: '18px' }} />
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className='text-end' style={{ alignContent: 'end', fontSize: '13px', margin: '0px' }}>Spent <span style={{ fontWeight: 500 }}> ₹{`${totalExpenses}`}</span></p>
                  <Flex vertical gap="middle">
                    <Progress percent={Incomepercent} format={(percent: any) => `${Math.round(percent).toLocaleString()}%`} strokeColor={twoColors} />
                  </Flex>
                </div>
              </div>
              <div className=" card-spacing" style={{margin:0, paddingTop:8 }}>
                      <div className="top-three-cards" onClick={() => navigate("/budget")}>
                        <CircleArrowUp className="card-icon" color="#876AFE" size={28} />

                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <p className="card-title total-expense">
                            Expense
                          </p>
                          <div className="statistic-container">
                            <span style={{ fontSize: '18px', marginRight: '4px' }}> ₹ </span>

                            <div style={{ display: 'flex', flexDirection: 'row' ,fontSize: '16px'}}>
                              <Statistic  value={totalExpenses} formatter={formatter} valueStyle={{fontSize: '18px'}}/>
                            </div>
                          </div>
                        </div>
                      </div>
                      <p className='text-end' style={{ alignContent: 'end', fontSize: '13px', margin: '0px' }}>Target <span style={{ fontWeight: 'bold' }}>₹{`${Number()}`}</span></p>
                      <Flex vertical gap="middle">
                        <Progress percent={69.9} strokeColor={oneColors} />
                      </Flex>
                    </div>
                  
              
            </Card>
          </Col>
          <Col xs={{ span: 5, offset: 1 }} lg={{ span: 5 }}>
            <Card style={{ width: "300px", height: "95%", padding:'0px 5px' }}>
              <p >
                <Goal className="recent-transactions-icon" color="#121212" size={18} />
                Recent Goals
              </p>

              <div className="top-one-cards" onClick={() => navigate("/goal")}>
                {sortedGoals.map((goal: GoalData, index: number) => {

                  const percent = (goal.savedAmount / goal.targetAmount) * 100;
                  const isComplete = goal.savedAmount >= goal.targetAmount;
                  const color =
                    percent <= 20 ? '#ff4d4f' :
                      percent <= 40 ? '#ffa940' :
                        percent <= 70 ? 'blue' :
                          '#52c41a';

                  return (
                    <Card
                      hoverable
                      key={goal.id}
                      style={{
                        // width: 200,
                        // height: 100,
                        marginBottom: 10,
                        // padding: 6,
                        backgroundColor: isComplete ? '#dff0d8' : 'white',
                        // marginBottom: 7
                      }}>

                      <Card.Meta
                        avatar={
                          <Progress
                            type="circle"
                            width={50}
                            percent={(goal.savedAmount / goal.targetAmount) * 100}
                            strokeColor={isComplete ? '#52c41a' : color}
                            format={(percent: any) => `${Math.round(percent).toLocaleString()}%`}
                            className='align-self-center py-1 '
                            style={{ margin: '0' }}
                          />

                        }
                        description={
                          <div className='d-flex flex-column '>
                            <small className='text-dark ' style={{ fontSize: '13px' }}>Target amount-{goal.targetAmount}</small>
                            <small className='text-dark'>Saved amount-{goal.savedAmount}</small>
                            <small className='text-dark'>Target date {dayjs(goal.targetDate).format('DD-MM-YYYY')}</small>
                          </div>
                        }
                      />
                    </Card>
                  )
                })}
              </div>

            </Card>
          </Col>
          <Col xs={{ span: 5, offset: 1 }} lg={{ span: 5 }}>
            <Card style={{ width: "300px", height: "95%", padding:'0px 5px' }}>
              <p style={{margin:0,paddingBottom:"6px"}} >
                <ArrowLeftRight className="recent-transactions-icon "  color="#121212" size={20} />
                Recent Transactions
              </p>

             
                <div>


                  <List
                    itemLayout="horizontal"
                    dataSource={sortedTransactions}
                    
                    renderItem={(transaction) => (
                      <List.Item>
                        <List.Item.Meta
                          title={<Text >{getCategoryLabel(transaction.categoryType)}</Text>}
                          description={<p style={{fontSize:'13px'}}>{getAccountName(transaction.accountType)} - {dayjs(transaction.date).format('YYYY-MM-DD')}</p>}
                        />
                        <Text type={transaction.transactionType === 1 ? 'success' : 'danger'} style={{fontSize:'14px'}}>
                          {transaction.transactionType === 1 ? '+' : '-'}₹{transaction.amount.toLocaleString()}
                        </Text>
                      </List.Item>
                    )}
                  />
                </div>
                <Button  className="view-all-transactions-button " onClick={() => navigate("/transaction")} style={{marginLeft:'50px'}}>
                  View All Transaction
                </Button>
              {/* <Tag color="default"> View All Transaction</Tag> */}
            </Card>


          </Col>
        </Row>
        <Row>
    <Col xs={{ span: 5, offset: 0}} lg={{ span: 12 }}>
    <Card style={{width:"100%", height:"100%"}}>
    
              {/* <Card className='five-cards total-cards-background' style={{ width: '57.5%', height: 340 }} > */}
                <div style={{
                  marginBottom: '-15px'

                }}>
                  <Select
                    value={timeRange}
                    onChange={handleTimeRangeChange}
                    style={{ width: 100 }}
                  >
                    <MenuItem value="weekly">Weekly</MenuItem>
                    <MenuItem value="monthly">Monthly</MenuItem>
                    <MenuItem value="yearly">Yearly</MenuItem>
                  </Select>
                </div>
                <LineChart
                  width={600}
                  height={300}
                  series={[
                    { data: pData, label: 'Income', color: '#071952' },
                    { data: uData, label: 'Expenses', color: '#088395' },
                  ]}
                  xAxis={[
                    {
                      scaleType: 'point',
                      data: xLabels,
                      label: '',
                    }
                  ]}
                  yAxis={[
                    {
                      label: '',
                    }
                  ]}
                />
              {/* </Card> */}
             
            
      </Card>
      </Col>
    <Col xs={{ span: 5, offset: 1 }} lg={{ span: 10 }}>
    <Card className='total-cards-background' style={{ width: '100%', height: '100%' }}>
                <div className="three-cards   five-cards" style={{ height: '100%', width: '100%', boxShadow: 'none' }}>
                  <p className="recent-transactions-title">
                    Budget v/s Expenses
                  </p>
                  <hr style={{ margin: '10px 0px 0px 0px' }} />
                  <div className="top-one-cards" onClick={() => navigate("/goal")}>
                    <BarChart
                      width={530}
                      height={295}
                      series={[
                        { data: seriesData.map(data => data.amount), label: 'Budget', color: '#2190A0' },
                        { data: seriesData.map(data => data.amountSpent), label: 'Expenses', color: '#FF8485' },
                      ]}
                      xAxis={[{ data: categories, scaleType: 'band' }]}
                    />
                  </div>
                </div>
              </Card>
              </Col>
  </Row>
      </div>

    </>

  );
}

export default Dashboard;
