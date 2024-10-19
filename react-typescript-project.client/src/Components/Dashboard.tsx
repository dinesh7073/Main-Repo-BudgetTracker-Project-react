import React, { useContext, useEffect, useState } from 'react';
import { Button, Card, List, Typography, Statistic, StatisticProps, Flex, Progress, ProgressProps, Row, Col, Tag, Empty } from 'antd';
import { ArrowLeftRight, CircleArrowDown, CircleArrowUp, Goal, Plus, } from 'lucide-react';
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
import { PieChartOutlined } from '@ant-design/icons';
import { Utils } from './Common/Utilities/Utils';
import EChartsReact from "echarts-for-react";
import { FaCoins, FaCreditCard } from 'react-icons/fa';
import { MdAccountBalance, MdAccountBalanceWallet, MdSavings } from 'react-icons/md';
import { GiReceiveMoney } from 'react-icons/gi';
import ScrollContainer from 'react-indiana-drag-scroll';


// const formatter: StatisticProps['formatter'] = (value) => (
//   <CountUp end={value as number} separator="," />
// );
const { Text } = Typography;
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

interface Account {

  id: string,
  userId: string,
  name: string,
  accountType: number,
  amount: number

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

  const { userDetails, setTransactionData, transactionData, setLoader } = useContext<any>(UserContext);
  var navigate = useNavigate();
  const [records, setRecords] = useState<TransactionType[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [selectedDateRange, setSelectedDateRange] = useState<[Dayjs, Dayjs] | null>(null);
  const [transactiontransactionType, setTransactiontransactionType] = useState<'Income' | 'Expense' | 'All'>('All');
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [goalExists, setGoalExists] = useState(false);
  const [goals, setGoals] = useState<GoalData[]>([]);
  // const [isExpanded, setIsExpanded] = useState(false);
  const [accountData, setAccountData] = useState<Account[]>([]);

  // const formatter: StatisticProps['formatter'] = (value) => (
  //   <CountUp end={value as number} separator="," />
  // );

  const UserId = userDetails?.id;

  // useEffect(() => {



  //   axios.get(`${REACT_APP_BASE_URL}AccountsController/${userDetails?.id}GetAccountsByUserId`).then((res) => {

  //     setAccountData(res.data);
  //     console.log(res.data);
  //   }).catch((err) => console.log('error', err));

  // }, []);


  useEffect(() => {

    // BudgetAPI
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
  }, [transactionData]);


  useEffect(() => {

    // TransactionAPI
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
      .catch((err) => console.log("Error from server", err, UserId)
      );

    // SavingsAPI
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

    // AccountsAPI

    axios.get(`${REACT_APP_BASE_URL}AccountsController/${UserId}GetAccountsByUserId`).then((response) => {
      setAccountData(response.data);
    }).catch(() => setLoader(false))

  }, [UserId]);


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
    amountSpent: budget.amountSpent,
    label: getCategoryLabel(budget.category)
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

  // const handleTimeRangeChange = (value: 'weekly' | 'monthly' | 'yearly') => {
  //   setTimeRange(value);
  // };

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

  // const twoColors: ProgressProps['strokeColor'] = {
  //   '0%': '#ffffff',
  //   '20%': 'blue',
  //   '100%': '#088395',
  // };


  // const oneColors: ProgressProps['strokeColor'] = {
  //   '0%': '#ffffff',
  //   '100%': '#FF4D4F',
  // };

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

  const getTotalBudget = (budget: Budget[]) => {
    return budget.reduce((total, budget) => total + budget.amount, 0)
  }

  const getTotalIncome = (income: TransactionType[]) => {
    return income.reduce((total, income) => total + income.amount, 0);
  };

  const getTotalAmountSpent = (budget: Budget[]) => {
    return budget.reduce((total, budget) => total + budget.amountSpent, 0);
  }

  const totalIncome = getTotalExpenses(filteredIncome);
  const totalExpenses = getTotalIncome(filteredExpenses);
  const totalBudget = getTotalBudget(budgets);
  const totalAmountSpent = getTotalAmountSpent(budgets);

  const transformData = (goals: GoalData[]): GoalData[] => {
    return goals.map((goal) => ({
      ...goal,
    }));
  };




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

  const Incomepercent = Math.ceil((totalExpenses / totalIncome) * 100);

  const Expensepercent = Math.ceil((totalAmountSpent / totalBudget) * 100);

  const progressColor = (percent: number) => {

    return percent <= 25 ? 'rgb(145, 204, 117)' :
      percent <= 50 ? 'rgb(250, 200, 88)' :
        percent <= 75 ? 'rgb(84, 112, 198)' :
          'rgb(238, 102, 102)';
  }

  const pieData = pieChartData.map((v) => ({
    name: v.label,
    value: v.value
  }))

  const option = {
    tooltip: {

      trigger: 'item',
      textStyle: {
        fontSize: 10,
      },
    },
    legend: {
      top: '0',
      left: 'center',
      margin: 0,
      show: false
    },
    series: [
      {
        type: 'pie',
        radius: ['50%', '90%'],
        avoidLabelOverlap: true,
        itemStyle: {
          borderRadius: 1,
          borderColor: '#fff',
          borderWidth: 2,

        },
        label: {
          show: false,
          //  position: 'center'
        },
        emphasis: {
          label: {
            show: false,
            fontSize: 10,
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: pieData
      }
    ]
  };

  const barData = {
    grid: {
      left: '4%',
      right: '5%',
      bottom: '2%',
      top: '14%',
      containLabel: true,
      show: false
    },
    responsive: true,
    maintainAspectRatio: false,
    legend: {
      data: ['Budget amount', 'Amount spent'],
      top: '0%',
      orient: 'horizontal',
      itemGap: 20,
      textStyle: {
        fontSize: 13,
        color: '#333'
      }
    },
    tooltip: {
      textStyle: {
        fontSize: 12,
      },
    },
    dataset: {
      source: [
        ['categories', 'Budget amount', 'Amount spent'],
        ...seriesData.map(item => [item.label, item.amount, item.amountSpent])
      ]
    },
    xAxis: [{
      type: 'category',
      axisLabel: {

        formatter: function(value:any) {
          return value.length > 6 ? value.substring(0, 6) + '...' : value; 
        }
      }
    }],
    yAxis: {},
    series: [{
      type: 'bar'
    }, {
      type: 'bar'
    }]
  };
  

  const getAccountLabel = (type: number) => {
    switch (type) {
      case 1: return "Cash";
      case 2: return "Saving account";
      case 3: return "General";
      case 4: return "Credit card";
      case 5: return "Salary account";
      case 6: return "Current account";
    }
  }

  const getAccountIcon = (type: number) => {
    switch (type) {
      case 1: return <FaCoins size={22} color='#FFB300' />
      case 2: return <MdSavings size={22} color='#26C6DA' />
      case 3: return <MdAccountBalanceWallet size={22} color='#D32F2F' />
      case 4: return <FaCreditCard size={22} color='#64B5F6' />
      case 5: return <GiReceiveMoney size={22} color='#FFB300' />
      case 6: return <MdAccountBalance size={22} color='#039BE5' />
      default: return 'unknown';
    }
  }

  const bankName = [
    { value: 'AXIS_BANK', label: 'Axis Bank' },
    { value: 'ICICI_BANK', label: 'ICICI Bank' },
    { value: 'HDFC_BANK', label: 'HDFC Bank' },
    { value: 'BANK_OF_BARODA', label: 'Bank of Baroda' },
    { value: 'INDUSIND_BANK', label: 'IndusInd Bank' },
    { value: 'PNB', label: 'Punjab National Bank' },
    { value: 'KOTAK_MAHINDRA_BANK', label: 'Kotak Mahindra Bank' },
    { value: 'SBI', label: 'State Bank of India' },
    { value: 'CANARA_BANK', label: 'Canara Bank' },
    { value: 'UNION_BANK_OF_INDIA', label: 'Union Bank of India' },
    { value: 'BANK_OF_INDIA', label: 'Bank Of India' },
    { value: 'YES_BANK', label: 'YES BANK' },
    { value: 'FEDERAL_BANK', label: 'Federal Bank' },
    { value: 'IDBI_BANK', label: 'IDBI Bank' },
    { value: 'INDIAN_OVERSEAS_BANK', label: 'Indian Overseas Bank' },
    { value: 'INDIAN_BANK', label: 'Indian Bank' },
    { value: 'IDFC_FIRST_BANK', label: 'IDFC FIRST Bank' },
    { value: 'JAMMU_AND_KASHMIR_BANK', label: 'Jammu & Kashmir Bank' },
    { value: 'RBL_BANK', label: 'RBL Bank' },
    { value: 'BANK_OF_MAHARASHTRA', label: 'Bank of Maharashtra' },
    { value: 'CITY_UNION_BANK', label: 'City Union Bank' },
    { value: 'PUNJAB_AND_SIND_BANK', label: 'Punjab and Sind Bank' },
    { value: 'UCO_BANK', label: 'UCO Bank' },
    { value: 'DCB_BANK', label: 'DCB Bank' }
  ]

  const getBankName = (name: string) => {

    const bank = bankName.find((obj) => obj.value === name);

    if (bank) {
     
      return  bank.label.length > 10 ? bank.label.substring(0, 10) + '...' : bank.label; 

    }

    if (name == 'Cash') {
      return 'Cash'
    }

  }

  return (
    <>
      <div style={{ width: "100%", height: "100%", backgroundColor: "#f3f4fa", overflow: 'hidden' }}>
        <Row gutter={[16, 24]} style={{ marginBottom: '12px' }}>
          <Col xs={24} sm={12} md={accountData.length == 1 ? 5 : 21}  >

            <ScrollContainer horizontal={true} className='scroll-container' style={{  width: '100%', overflowX: 'auto', whiteSpace: 'nowrap', padding: '0', margin: '0' }}>
              <Row gutter={[16, 24]} wrap={false} >

                {accountData.map((obj: Account, i: number) => (

                  <Col xs={24} sm={12} md={6} key={i} style={{ flex: '0 0 auto', cursor: 'pointer' }}>
                    <Card style={{ height: '100%', width: '270px' }} className="scrollCard" >
                      <div className="d-flex flex-row py-1 px-2" style={{ gap: '25px' }}>
                        <p className="my-1">{getAccountIcon(obj.accountType)}</p>
                        <div className="lh-1">
                          <h6 className='mb-1'>₹ {Utils.getFormattedNumber(obj.amount)}</h6>
                          {/* <span>{getAccountLabel(obj.accountType)}</span> */}
                          <div className='d-flex p-0 m-0'>
                            <Text>{getAccountLabel(obj.accountType)}</Text>
                            <Text className='bank-name'>
                              ({getBankName(obj.name)})
                            </Text>
                          </div>

                        </div>
                      </div>
                    </Card>
                  </Col>

                ))}
              </Row>
            </ScrollContainer>
          </Col>

          <Col xs={24} sm={12} md={3}>
            <Button style={{ width: '100%', height: '40px', border: '1px dashed', color: 'blue', background: 'none', marginTop: '20px' }} onClick={() => navigate('/settings/accounts')} >
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span className='align-items-center'><Plus /> Add Account</span>
              </div>
            </Button>
          </Col>
        </Row>




        <Row gutter={[16, 24]} style={{ marginBottom: '0px' }}>
          <Col xs={{ span: 5, offset: 0 }} lg={{ span: 6 }}>
            <Card style={{ width: "100%", height: "94%", }}>
              <p className='lh-1 card-title'>
                <PieChartOutlined color="#3C3D37" className='me-2 ' />
                Expenses Structure
              </p>

              <div className='d-flex flex-column justify-center ' >

                <EChartsReact
                  option={option}
                  style={{ width: '200px', height: '150px', marginRight: 'auto', marginLeft: 'auto', marginBottom: '1px' , marginTop:'6px'}}

                />

                {/* <Card style={{height:'40px', alignContent:'center'}} > */}
                <div className='d-flex flex-row pt-2' style={{ padding: 0, gap: '5px' }}>
                  <p style={{ fontSize: '16px', padding: 0 }}>Total Expense  :</p>
                  <Statistic

                    value={Utils.getFormattedNumber(totalExpenses)}

                    prefix="₹"
                    valueStyle={{ color: '#ff4d4f', fontSize: '16px', margin: 0 }}
                  />
                </div>
                {/* </Card> */}

              </div>

            </Card>
          </Col>
          <Col xs={{ span: 10, offset: 0 }} lg={{ span: 6 }}>
            <Card style={{ width: "100%", height: "94%", position: 'relative' }}>
              <p style={{ position: 'absolute', top: '3%' }} className='card-title'>
                <BiCoin className="recent-transactions-icon" color="#3C3D37" size={20} />
                Budget
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', margin: 0, position: 'absolute', top: '14%', width: '90%' }} className='px-1 '>

                <div>
                  <div onClick={() => navigate("/budget")} className='d-flex flex-row'>
                    {/* <CircleArrowDown className="card-icon" color="#2F70F2" size={25} /> */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignContent: 'center' }}>
                      <p className="card-title total-income">
                        {categories.map((category) => category === "Income") ? "Income" : ""}
                      </p>
                      <div className="statistic-container" style={{ margin: 0 }}>
                        <span style={{ fontSize: '18px', marginRight: '5px' }}> ₹ </span>
                        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', fontSize: '17px' }}>
                          <Statistic className="statistic-value" value={Utils.getFormattedNumber(totalIncome)} valueStyle={{ fontSize: '18px' }} />
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className='text-end' style={{ alignContent: 'end', fontSize: '13px', margin: '0px' }}>Spent <span style={{ fontWeight: 500 }}> ₹{`${Utils.getFormattedNumber(totalExpenses)}`}</span></p>
                  <Flex vertical gap="middle">
                    <Progress percent={Incomepercent} strokeColor={progressColor(Incomepercent)} />
                  </Flex>
                </div>
              </div>
              <div style={{ margin: 0, position: 'absolute', top: '55%', width: '90%' }}>
                <div className=" card-spacing d-flex flex-row">
                  {/* <CircleArrowUp className="card-icon" color="#876AFE" size={28} /> */}

                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <p className="card-title total-expense">
                      Expense
                    </p>
                    <div className="statistic-container">
                      <span style={{ fontSize: '18px', marginRight: '4px' }}> ₹ </span>

                      {/* <div style={{ display: 'flex', flexDirection: 'row', fontSize: '16px' }}> */}
                      <Statistic value={Utils.getFormattedNumber(totalAmountSpent)} valueStyle={{ fontSize: '18px' }} />
                      {/* </div> */}
                    </div>

                  </div>
                </div>
                <p className='text-end' style={{ alignContent: 'end', fontSize: '13px', margin: '0px' }}>Target <span style={{ fontWeight: 500 }}>₹{Utils.getFormattedNumber(totalBudget)}</span></p>
                <Flex vertical gap="middle">
                  <Progress percent={Expensepercent} strokeColor={progressColor(Expensepercent)} />
                </Flex>
              </div>


            </Card>
          </Col>
          <Col xs={{ span: 5, offset: 0 }} lg={{ span: 6 }}>
            <Card style={{ width: "100%", height: "94%", padding: '0px 5px', position: 'relative' }}>
              <p style={{ position: 'absolute', top: '3%' }} className='card-title'>
                <Goal style={{ color: 'rgb(105, 114, 122)' }} className="recent-transactions-icon" color="#3C3D37" size={18} />
                Recent Goals
              </p>

              <div className="top-one-cards" onClick={() => navigate("/goal")} style={{ position: 'absolute', top: '15%', width: '90%' }}>
                {sortedGoals.length > 0 ?
                  (sortedGoals.map((goal: GoalData, index: number) => {

                    const percent = (goal.savedAmount / goal.targetAmount) * 100;
                    const isComplete = goal.savedAmount >= goal.targetAmount;
                    const color =
                      percent <= 20 ? 'rgb(238, 102, 102)' :
                        percent <= 40 ? 'rgb(84, 112, 198)' :
                          percent <= 70 ? 'rgb(250, 200, 88)' :
                            'rgb(145, 204, 117)';

                    return (
                      <Card
                        hoverable
                        key={goal.id}
                        style={{
                          // width: 200,
                          height: 77,
                          marginBottom: 6,
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
                              <small className='text-dark ' style={{ fontSize: '13px' }}>Target amount - ₹{Utils.getFormattedNumber(goal.targetAmount)}</small>
                              <small className='text-dark'>Saved amount - ₹{Utils.getFormattedNumber(goal.savedAmount)}</small>
                              <small className='text-dark'>Target date -  {dayjs(goal.targetDate).format('DD-MM-YYYY')}</small>
                            </div>
                          }
                        />


                      </Card>
                    )
                  })) : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} style={{ position: 'absolute', left: '80px', width: '100px', top: '10px' }} />}
              </div>
              {sortedGoals.length > 0 ? <Button className="view-all-transactions-button" onClick={() => navigate("/goal")} style={{ position: 'absolute', top: '87%', left: '20%' }}>
                View all goals
              </Button> : ''}
            </Card>
          </Col>
          <Col xs={{ span: 5 }} lg={{ span: 6 }}>
            <Card style={{ width: "100%", height: "94%", padding: '0px 5px', position: 'relative' }}>
              <p style={{ margin: 0, paddingBottom: "6px", position: 'absolute', top: '3%' }}className='card-title' >
                <ArrowLeftRight style={{ color: 'rgb(105, 114, 122)' }} className="recent-transactions-icon " color="#3C3D37" size={20} />
                Recent Transactions
              </p>


              <div style={{ position: 'absolute', top: '13%', height: '220px', width: '90%' }}>


                <List
                  itemLayout="horizontal"
                  dataSource={sortedTransactions}

                  renderItem={(transaction) => (
                    <List.Item>
                      <List.Item.Meta
                        title={<Text style={{ fontSize: '14px', fontWeight: 450 }} >{getCategoryLabel(transaction.categoryType)}</Text>}
                        description={<p style={{ fontSize: '13px' }}>{getAccountName(transaction.accountType)} - {dayjs(transaction.date).format('DD-MM-YYYY')}</p>}
                      />
                      <Text type={transaction.transactionType === 1 ? 'success' : 'danger'} style={{ fontSize: '14px' }}>
                        {transaction.transactionType === 1 ? '+' : '-'}₹{Utils.getFormattedNumber(transaction.amount)}
                      </Text>
                    </List.Item>
                  )}
                />
              </div>
              {sortedTransactions.length > 0 ? <Button className="view-all-transactions-button " onClick={() => navigate("/transaction")} style={{ position: 'absolute', top: '85%', marginTop: '5px', left: '20%' }}>
                View all transactions
              </Button> : ''}
              {/* <Tag color="default"> View All Transaction</Tag> */}
            </Card>


          </Col>
        </Row>
        <Row gutter={[16, 20]} style={{ marginBottom: 0 }}>
          <Col xs={{ span: 5, offset: 0 }} lg={{ span: 12 }}>
            <Card style={{ width: "100%", height: "100%", padding: 0, margin: 0 }}>

              {/* <Card className='five-cards total-cards-background' style={{ width: '57.5%', height: 340 }} > */}
              {/* <div style={{
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
              </div> */}
              <LineChart
                width={600}
                height={265}
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
          <Col xs={{ span: 5, }} lg={{ span: 12 }}>
            <Card className='total-cards-background' style={{ width: '100%', height: '100%', margin: 0 }}>
              <div style={{ height: '100%', width: '100%', boxShadow: 'none' }}>
                <p className="recent-transactions-title">
                  Budget v/s Expenses
                </p>

                <div onClick={() => navigate("/budget")}>
                  {/* <BarChart
                    width={630}
                    height={235}
                    series={[
                      { data: seriesData.map(data => data.amount), label: 'Budget', color: '#2190A0' },
                      { data: seriesData.map(data => data.amountSpent), label: 'Expenses', color: '#FF8485' },
                    ]}
                    xAxis={[{ data: categories, scaleType: 'band' }]}
                  /> */}

                  <EChartsReact option={barData} style={{ width: '100%', height: '230px', padding: '0', margin: '0' }} />
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
