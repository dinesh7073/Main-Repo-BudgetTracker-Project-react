import { Button, DatePicker, Form, Input, Select, Modal, Progress, notification, Card, Tooltip, Popconfirm, Breadcrumb, Empty, } from "antd"
import dayjs, { Dayjs } from "dayjs";
import { Car, DollarSign, Edit, HelpCircle, Home, Laptop, Plus, ShoppingBag, Trash2, Zap } from "lucide-react"
import { useContext, useEffect, useState } from "react";
import UserContext from "../UserContext";
import { IoFastFoodOutline } from "react-icons/io5";
import axios from "axios";
import { BarChart } from "@mui/x-charts";
import { PieChart } from '@mui/x-charts/PieChart'
import '../CSS/Budget.css';
import { HomeOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { MdOutlineHealthAndSafety } from "react-icons/md";
import { REACT_APP_BASE_URL } from '../Components/Common/Url';

import { Carousel } from 'react-bootstrap';

import '../CSS/ThemeColors.css'

const { RangePicker } = DatePicker;
const { Option } = Select;
interface Budget {
  id: string;
  userid: string;
  startDate: string | null;
  endDate: string | null;
  category: number | null;
  amount: number;
  amountSpent: number;
}
interface TransactionType {
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

type PieDataType = {
  id: number;
  value: number;
  label: string;
};
const Budget = () => {
  const BudgetData: Budget = {
    id: "",
    userid: "",
    startDate: null,
    endDate: null,
    category: null,
    amount: 0,
    amountSpent: 0,
  }

  const navigate = useNavigate();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  const [budget, setBudget] = useState<Budget>(BudgetData);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [transactionData, setTransactionData] = useState<TransactionType[]>([]);
  const [budgetExists, setBudgetExists] = useState<boolean>(false);
  const [pieChartData, setPieChartData] = useState<PieDataType[]>([]);
  const { userDetails, baseUrl } = useContext<any>(UserContext);


  const UserId = userDetails.UserId;
  
  const getCategoryLabel = (category: number | null) => {
    switch (category) {
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

  const getCategoryTypeIcon = (categoryType: number | null) => {
    switch (categoryType) {
      case 5: return <IoFastFoodOutline className="fs-3" />;
      case 6: return <ShoppingBag />;
      case 7: return <Home />;
      case 8: return <Car />;
      case 9: return <Car />;
      case 10: return <MdOutlineHealthAndSafety />;
      case 11: return <Laptop />;
      case 12: return <Zap />;
      case 13: return <DollarSign />;
      default: return <HelpCircle />;
    }
  };

  useEffect(() => {
    axios.get(`${REACT_APP_BASE_URL}TransactionsController/${UserId}GetTransactionsByUserId`)
      .then((res) => {
        if (res.status === 200) {
          setTransactionData(res.data);
        }
      })
      .catch((err) => console.log("Error fetching transactions", err));
  }, [UserId]);



  // const ExceedsBudget = Boolean(budget.amountSpent > budget.amount);

  useEffect(() => {
    
    axios.get(`${REACT_APP_BASE_URL}BudgetsController/${UserId}GetBudgetById`)
      .then((res) => {
        if (res.status === 200) {

          setBudgetExists(true)
          let totalAmountSpent = 0;

          const transformedBudgets = res.data.map((budget: Budget) => {
            const amountSpent = transactionData
              .filter((transactionObj: TransactionType) => transactionObj.categoryType === budget.category)
              .reduce((total: number, transactionObj: TransactionType) => total + transactionObj.amount, 0);

            if (budget.category !== 13) {
              totalAmountSpent += budget.amountSpent
            }

            setPieChartData(budgets
              .filter(budget => budget.category !== 13)
              .map((budget: Budget, index) => ({
                id: index,
                value: budget.amountSpent,
                label: getCategoryLabel(budget.category) || `Category ${budget.category}`,
              })));


            return {
              ...budget,
              amount: Number(budget.amount),
              amountSpent: Number(amountSpent),
              startDate: budget.startDate,
              endDate: budget.endDate,
            };

          });

          const updatedBudget = transformedBudgets.map((budget: Budget) => {
            if (budget.category === 13) {
              return {
                ...budget,
                amountSpent: totalAmountSpent
              }
            }


            return budget;
          })

          setBudgets(updatedBudget);




          budgets.map((budget: Budget) => {

            if (budget.amountSpent > budget.amount) {
              notification.warning({
                message: 'Budget Exceeded',
                description: `You have exceeded your budget for the category ${getCategoryLabel(budget.category)}.`,
                placement: 'topRight',
              });
            }
          })



          // transformedBudgets.map((budget: Budget) => {
          //   if (budget.amountSpent > budget.amount) {
          //     notification.warning({
          //       message: 'Budget Exceeded',
          //       description: `You have exceeded your budget for the category ${getCategoryLabel(budget.category)}.`,
          //       placement: 'topRight',
          //     });
          //   }

          //   // if (budget.category === 13 && (budget.amountSpent > budget.amount)) {
          //   //   console.log("13 budget exceed")
          //   //   notification.warning({
          //   //     message: 'Budget Exceeded',
          //   //     description: `You have exceeded your budget for the category ${getCategoryLabel(budget.category)}.`,
          //   //     placement: 'topRight',
          //   //   });
          //   // }

          // })

        }
        // transformedBudgets.forEach((budget: Budget) => {

        // if (ExceedsBudget) {

        //   notification.warning({
        //     message: 'Budget Exceeded',
        //     description: `You have exceeded your budget for the category ${getCategoryLabel(budget.category)}.`,
        //     placement: 'topRight',
        //   });
        // }

        // if (budget.category === 13 && (totalAmountSpent > budget.amount)) {
        //   console.log("13 budget exceed")
        //   notification.warning({
        //     message: 'Budget Exceeded',
        //     description: `You have exceeded your budget for the category ${getCategoryLabel(budget.category)}.`,
        //     placement: 'topRight',
        //   }); 
        // }
        //   else if (budget.category !== 13 && budget.amountSpent > budget.amount) {
        //   console.log(" budget exceed")
        //   notification.warning({
        //     message: 'Budget Exceeded',
        //     description: `You have exceeded your budget for the category ${getCategoryLabel(budget.category)}.`,
        //     placement: 'topRight',
        //   });
        // }

        // if (budget.category !== 13 && budget.amountSpent > budget.amount) {
        // };
      })



      .catch((err) => console.log("Error from server", err));
  }, [UserId, transactionData]);

  const TotalSpentOfOtherCategories = () => {
    return budgets.reduce((total, budget) => {
      if (budget.category !== 13) {
        total += budget.amountSpent;
      }
      return total;
    }, 0);
  };

  const handleFormSubmit = (values: any) => {
    const userId = UserId;
    const apiUrl = `${REACT_APP_BASE_URL}BudgetsController/${userId}CreateBudgetAndUpdate`;

    const [startDate, endDate] = values.dateRange || [null, null];
    const formattedStartingDate = dayjs(startDate).format('YYYY-MM-DD');
    const formattedEndingDate = dayjs(endDate).format('YYYY-MM-DD');

    const Budgetdata: Budget = {
      ...values,
      userid: UserId,
      startDate: formattedStartingDate,
      endDate: formattedEndingDate,
      amountSpent: budget.amountSpent
    };
    if (editingBudget) {
      Budgetdata.id = editingBudget.id;
    }
    const existingBudget = budgets.find(budget => budget.category === values.category);
    if (existingBudget) {
      Budgetdata.id = existingBudget.id;

      axios.post(apiUrl, Budgetdata)
        .then((response) => {
          const updatedBudgets = budgets.map(budget =>
            budget.id === existingBudget.id ? { ...budget, ...response.data } : budget
          );
          setBudgets(updatedBudgets);
          notification.success({
            message: 'Budget updated successfully',
          });
        })
        .catch(err => notification.error({
          message: 'Failed to update budget',
          description: err.message,
        }));
    } else {
      axios.post(apiUrl, Budgetdata)
        .then((response) => {
          setBudgets([...budgets, response.data]);
          notification.success({
            message: 'Budget added successfully',
          });
        })
        .catch(err => notification.error({
          message: 'Failed to add budget',
          description: err.message,
        }));
    }
    form.resetFields();
    setIsModalVisible(false);
    setEditingBudget(null);
    setBudgetExists(true);
  };

  const handleOpenModal = (budget?: Budget) => {
    if (budget) {
      setEditingBudget(budget);
      setBudget(budget);
      form.setFieldsValue({
        category: budget.category,
        amount: budget.amount,
        dateRange: [dayjs(budget.startDate), dayjs(budget.endDate)],
      });
    } else {
      setEditingBudget(null);
      setBudget(BudgetData);
      form.resetFields();
    }
    setIsModalVisible(true);
  }

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  }

  const handleDelete = (id: string) => {
    axios.post(`${baseUrl}BudgetsController/${id}DeleteBudget`)
      .then((response) => {
        const updatedBudget = budgets.filter(budget => budget.id !== id);
        setBudgets(updatedBudget);
        notification.success({
          message: response.data.message || 'Budget deleted successfully',
        });
      })
      .catch(err => {
        console.error('Delete error:', err);
        notification.error({ message: 'Failed to delete budget', description: err.message });
      });
  };

  const progressColor = (amount: number, spent: number, category: number | null) => {
    const percent = (spent / amount) * 100;
    if (category === 13) {
      const percent = (TotalSpentOfOtherCategories() / amount) * 100;
      return percent <= 20 ? '#52c41a' :
        percent <= 40 ? 'blue' :
          percent <= 70 ? '#ffa940' :
            '#ff4d4f';
    }
    return percent <= 20 ? '#52c41a' :
      percent <= 40 ? 'blue' :
        percent <= 70 ? '#ffa940' :
          '#ff4d4f';
  }

  const handlePie = (category: number | null) => {
    const transcategory = transactionData.filter(
      (transactionObj: TransactionType) => transactionObj.categoryType === category
    );
    if (category === 13) {
      const pieData = budgets
        .filter(budget => budget.category !== 13)
        .map((budget: Budget, index) => ({
          id: index,
          value: budget.amountSpent,
          label: getCategoryLabel(budget.category) || `Category ${budget.category}`,
        }));
      setPieChartData(pieData);
    } else {

      const pieData = transcategory.map((transactionObj, index) => ({
        id: index,
        value: transactionObj.amount,
        label: transactionObj.label,
      }));
      setPieChartData(pieData);
    }
  };

  const categories = budgets.map(budget => getCategoryLabel(budget.category));
  const seriesData = budgets.map((budget: Budget) =>
  ({
    amount: budget.amount,
    amountSpent: budget.category === 13 ? TotalSpentOfOtherCategories() : budget.amountSpent
  }));

  const groupedBudgets = [];
  for (let i = 0; i < budgets.length; i += 3) {
    groupedBudgets.push(budgets.slice(i, i + 3));
  }
  const remainingAmt = (budget: Budget, category: number | null, amount: number) => {
    let remaining;
    if (category === 13) {
      const remaingamt = amount - TotalSpentOfOtherCategories();
      remaining = remaingamt;

      if (remaining < 0) { return '-₹' + Math.abs(remaingamt).toLocaleString() }
      else { return '₹' + remaining.toLocaleString() }

    } else {
      remaining = budget.amount - budget.amountSpent;
      return remaining < 0 ? ('-₹' + Math.abs(remaining).toLocaleString()) : ('₹' + remaining.toLocaleString());
    }
  }

  return (
    <>
      <div>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          padding: " 16px"
        }} >
          <Breadcrumb
            items={[
              {
                title: < HomeOutlined onClick={() => navigate('/')} />,
              },
              {
                title: 'Budget ',
              },
            ]}
          />
          <Button type="primary" className="py-1 text-center pe-3" onClick={() => setIsModalVisible(true)}><Plus />Add </Button>
        </div>
      </div>

      {budgetExists ? <div> <Carousel indicators={true} interval={null} style={{ width: '100%', backgroundColor: '' }} >

        {groupedBudgets.length > 0 ? (

          groupedBudgets.map((budget: Budget[], index) => (

            <Carousel.Item key={index} style={{ width: '100%' }}>
              <div className="d-flex">
                {budget.map((budget) => (
                  <Card
                    hoverable
                    className="total-cards-background shadow"
                    key={budget.id}
                    onClick={() => handlePie(budget.category)}
                    actions={[
                      <text className='text-dark'>Budget :  ₹{budget.amount}</text>,
                      <text className='text-danger'>Spent :  ₹{budget.category === 13 ? TotalSpentOfOtherCategories() : budget.amountSpent}</text>,
                      <text
                        className={budget.category === 13 ?
                          ((budget.amount - TotalSpentOfOtherCategories() < 0) ? 'text-danger' : 'text-success')
                          : (budget.amount - budget.amountSpent < 0 ? 'text-danger' : 'text-success')}>
                        Remaining:  {remainingAmt(budget, budget.category, budget.amount)}
                      </text>
                    ]}
                    extra={
                      <div className='text-secondary'>
                        <small className=' px-2 '>
                          <Tooltip color='grey' title="Edit budget">
                            <Edit
                              key="edit"
                              onClick={() => handleOpenModal(budget)}
                              style={{ cursor: "pointer" }} />

                          </Tooltip>
                        </small>
                        <small>
                          <Popconfirm title="Are you sure?" onConfirm={() => handleDelete(budget.id)}>

                            <Trash2
                              key="delete"
                              style={{ cursor: "pointer" }} />

                          </Popconfirm>
                        </small>
                      </div>
                    }
                    title={
                      <div>
                        <text>{getCategoryLabel(budget.category)}</text>
                      </div>}
                    style={{
                      width: 400,
                      height: 200,
                      margin: 15,
                      padding: 10,
                      backgroundColor: "#F8F8F8"
                    }}>
                    <Card.Meta
                      style={{
                        padding: 10
                      }}
                      avatar={getCategoryTypeIcon(budget.category)}
                      description={
                        <div>
                          <Progress
                            percent={budget.category === 13 ? (TotalSpentOfOtherCategories() / budget.amount * 100) : (budget.amountSpent / budget.amount) * 100}
                            format={(percent: any) => `${Math.round(percent).toLocaleString()}%`}
                            strokeColor={progressColor(budget.amount, budget.amountSpent, budget.category)}
                          />
                        </div>
                      }
                    />
                  </Card>
                ))}
              </div>

            </Carousel.Item>
          )
          )) : ""}
      </Carousel>

        <div className="d-flex flex-row mt-2 " style={{ height: '350px' }}>
          <Card className="ps-2 m-e-2 ">
            <BarChart
              width={700}
              height={350}
              xAxis={[{ scaleType: 'band', data: categories }]}
              series={[
                { label: 'Budgeted Amount', data: seriesData.map(data => data.amount) },
                { label: 'Spent Amount', data: seriesData.map(data => data.amountSpent) }
              ]}
            />
          </Card>

          <Card className="mx-2">
            <h4>Expense Pie Chart</h4>
            <PieChart
              className="mt-5 "
              width={500}
              height={200}
              series={[
                {
                  innerRadius: 50,
                  data: pieChartData
                }
              ]}
            />
          </Card>
        </div>

      </div> : <Empty />}
      <Modal
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFormSubmit}
        >
          <h5>{editingBudget ? 'Edit Budget' : 'Add Budget'}</h5>
          <Form.Item
            name="category"
            label="Category"
            rules={[{ required: true, message: 'Please select a category' }]}
          >

            <Select placeholder="Select category">
              <Option value={13}>Income</Option>
              <Option value={5} >Food & Beverages</Option>
              <Option value={6}>Clothes & Footwear</Option>
              <Option value={7}>Housing</Option>
              <Option value={8}>Vehicle & Transportation</Option>
              <Option value={9}>Transportation</Option>
              <Option value={10}>Health Care</Option>
              <Option value={11}>Communication & PC</Option>
              <Option value={12}>Life & Entertainment</Option>
              <Option value="Other">Other</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="amount"
            label="Amount"
            rules={[{ required: true, message: 'Please enter the amount' }]}
          >
            <Input
              type='number'
              placeholder="Enter amount"
              onChange={e => setBudget({ ...budget, amount: +e.target.value })}
              min={0} />
          </Form.Item>

          <Form.Item
            name="dateRange"
            label="Date"
            rules={[{ required: true, message: 'Please enter the date' }]}
          >
            <RangePicker
              format="YYYY-MM-DD"
            />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              style={{ float: "right" }}>
              {editingBudget ? 'Update' : 'Add'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>

  )
}

export default Budget


