import {
  Button,
  DatePicker,
  Form,
  Input,
  Select,
  Modal,
  Progress,
  notification,
  Card,
  Tooltip,
  Popconfirm,
  Breadcrumb,
  Empty,
  Col,
  Row,
  Statistic,
  Tag,
  Alert,
  Space,
  Popover,
  Spin,
  Table,
  Dropdown,
} from "antd";
import dayjs, { Dayjs } from "dayjs";
import {
  Car,
  Edit,
  HelpCircle,
  Home,
  IndianRupee,
  Laptop,
  Plus,
  ShoppingBag,
  Trash2,
  Zap,
} from "lucide-react";
import { useContext, useEffect, useState } from "react";
import UserContext from "../UserContext";
import { IoFastFoodOutline } from "react-icons/io5";
import axios from "axios";
import "../CSS/Budget.css";
import {
  DeleteOutlined,
  EditOutlined,
  HomeOutlined,
  MoreOutlined, 
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { MdOutlineHealthAndSafety } from "react-icons/md";
import "../CSS/ThemeColors.css";
import { REACT_APP_BASE_URL } from "./Common/Url";
import { Utils } from "./Common/Utilities/Utils";

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
interface FormData {
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

interface ExpenseLimitTypes {
  id: string;
  userId: string;
  amount: number;
}

type PieDataType = {
  id: number;
  value: number;
  label: string;
};
const transformData = (records: FormData[]): FormData[] => {
  return records.map((transactions) => ({
    ...transactions,
  }));
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
  };

  const navigate = useNavigate();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  const [budget, setBudget] = useState<Budget>(BudgetData);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [transactionData, setTransactionData] = useState<FormData[]>([]);
  const [budgetExists, setBudgetExists] = useState<boolean>(false);
  // const [pieChartData, setPieChartData] = useState<PieDataType[]>([]);
  const [loader, setLoader] = useState<boolean>(false);
  // const [editingLimit, setEditingLimit] = useState(false);

  const {
    userDetails,
    userWallet,
    setUserWallet,
    expensesLimit,
    setexpensesLimit,
    
  } = useContext<any>(UserContext);

  const getCategoryLabel = (category: number | null) => {
    switch (category) {
      case 5:
        return "Food & Drinks";
      case 6:
        return "Clothes & Footwear";
      case 7:
        return "Housing";
      case 8:
        return "Vehicle";
      case 9:
        return "Transportation";
      case 10:
        return "Health Care";
      case 11:
        return "Communication & Devices";
      case 12:
        return "Entertainment";
      case 13:
        return "Income";
    }
  };

  const getCategoryTypeIcon = (categoryType: number | null) => {
    switch (categoryType) {
      case 5:
        return <IoFastFoodOutline size={20} />;
      case 6:
        return <ShoppingBag size={20} />;
      case 7:
        return <Home size={20} />;
      case 8:
        return <Car size={20} />;
      case 9:
        return <Car size={20} />;
      case 10:
        return <MdOutlineHealthAndSafety size={20} />;
      case 11:
        return <Laptop size={20} />;
      case 12:
        return <Zap size={20} />;
      case 13:
        return <IndianRupee size={20} />;
      default:
        return <HelpCircle size={20} />;
    }
  };

  const UserId = userDetails?.id;

  useEffect(() => {
    axios
      .get(
        `${REACT_APP_BASE_URL}TransactionsController/${UserId}GetTransactionsByUserId`
      )
      .then((res) => {
        if (res.status === 200) {
          setTransactionData(res.data);
          const transformedRecords = transformData(res.data);
          updateUserWallet(transformedRecords);
        }
      })
      .catch((err) => console.log("Error fetching transactions", err));
  }, []);

  useEffect(() => {
    setLoader(true);

    axios
      .get(`${REACT_APP_BASE_URL}BudgetsController/${UserId}GetBudgetById`)
      .then((res) => {
        if (res.status === 200) {
          setLoader(false);
          setBudgetExists(true);
          
          let totalAmountSpent = 0;

          const transformedBudgets = res.data.map((budget: Budget) => {
            const amountSpent = transactionData
              .filter(
                (transactionObj: FormData) =>
                  transactionObj.categoryType === budget.category
              )
              .reduce(
                (total: number, transactionObj: FormData) =>
                  total + transactionObj.amount,
                0
              );

            // if (budget.category !== 13) {
            //   totalAmountSpent += budget.amountSpent;
            // }
            setLoader(false);

            // setPieChartData(
            //   budgets
            //     .filter((budget) => budget.category !== 13)
            //     .map((budget: Budget, index) => ({
            //       id: index,
            //       value: budget.amountSpent,
            //       label:
            //         getCategoryLabel(budget.category) ||
            //         `Category ${budget.category}`,
            //     }))
            // );

            return {
              ...budget,
              amount: Number(budget.amount),
              amountSpent: Number(amountSpent),
              startDate: budget.startDate,
              endDate: budget.endDate,
            };
          });

          // const updatedBudget = transformedBudgets.map((budget: Budget) => {
          //   if (budget.category === 13) {
          //     return {
          //       ...budget,
          //       amountSpent: totalAmountSpent,
          //     };
          //   }
          //   return budget;
          // });

          setBudgets(transformedBudgets);

        }
      })

      .catch((err) => console.log("Error from server", err));

      
  }, [transactionData]);

  useEffect(() => {
    
  budgets.forEach((budget: Budget) => {

    if(budget.amountSpent == budget.amount){
      notification.warning({
        message: "Budget Completed",
        description: `You have completed the budget for the category ${getCategoryLabel(
          budget.category
        )}.`,
        placement: "topRight",
      });

    }

    if (budget.amountSpent > budget.amount) {
      notification.warning({
        message: "Budget Exceeded",
        description: `You have exceeded your budget for the category ${getCategoryLabel(
          budget.category
        )}.`,
        placement: "topRight",
      });
    }
  });
}, [budgets]);
  


  const updateUserWallet = (records: FormData[]) => {
    const totalIncome = records
      .filter(
        (record) => record.transactionType === 1 && record.amount !== null
      )
      .reduce((total, record) => total + (record.amount as number), 0);
    const totalExpenses = records
      .filter((record) => record.transactionType === 2)
      .reduce((total, record) => total + (record.amount as number), 0);
    setUserWallet(totalIncome - totalExpenses);
  };
  const totalexpense = transactionData
    .filter((record) => record.transactionType === 2)
    .reduce((total, record) => total + (record.amount as number), 0);

  const handleFormSubmit = (values: any) => {
    const userId = UserId;
    const apiUrl = `${REACT_APP_BASE_URL}BudgetsController/${userId}CreateBudgetAndUpdate`;

    const [startDate, endDate] = values.dateRange || [null, null];
    const formattedStartingDate = dayjs(startDate).format("YYYY-MM-DD");
    const formattedEndingDate = dayjs(endDate).format("YYYY-MM-DD");

    const Budgetdata: Budget = {
      ...values,
      userid: UserId,
      startDate: formattedStartingDate,
      endDate: formattedEndingDate,
      amountSpent: budget.amountSpent,
    };

    if (editingBudget) {
      Budgetdata.id = editingBudget.id;
    }

    const existingBudget = budgets.find(
      (budget) => budget.category === values.category
    );

    if (existingBudget) {
      Budgetdata.id = existingBudget.id;

      axios
        .post(apiUrl, Budgetdata)
        .then((response) => {
          const updatedBudgets = budgets.map((budget) =>
            budget.id === existingBudget.id
              ? { ...budget, ...response.data }
              : budget
          );
          setBudgets(updatedBudgets);
          notification.success({
            message: "Budget updated successfully",
          });
        })
        .catch((err) =>
          notification.error({
            message: "Failed to update budget",
            description: err.message,
          })
        );
    } else {
      axios
        .post(apiUrl, Budgetdata)
        .then((response) => {
          setBudgets([...budgets, response.data]);
          notification.success({
            message: "Budget added successfully",
          });
        })
        .catch((err) =>
          notification.error({
            message: "Failed to add budget",
            description: err.message,
          })
        );
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
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleDelete = (id: string) => {
    axios
      .post(`${REACT_APP_BASE_URL}BudgetsController/${id}DeleteBudget`)
      .then((response) => {
        const updatedBudget = budgets.filter((budget) => budget.id !== id);
        setBudgets(updatedBudget);
        notification.success({
          message: response.data.message || "Budget deleted successfully",
        });
      })
      .catch((err) => {
        console.error("Delete error:", err);
        notification.error({
          message: "Failed to delete budget",
          description: err.message,
        });
      });
  };

  const groupedBudgets = [];
  for (let i = 0; i < budgets.length; i += 3) {
    groupedBudgets.push(budgets.slice(i, i + 3));
  }


  // const [open, setOpen] = useState(false);
  // const [validationError, setValidationError] = useState<string | null>(null);

  // useEffect(() => {
  //   axios
  //     .get(
  //       `${REACT_APP_BASE_URL}BudgetsController/${UserId}GetExpenseLimitById`
  //     )
  //     .then((res) => {
  //       if (res.status === 200) {
  //         setexpensesLimit(res.data);
  //       }
  //     })
  //     .catch(() => {
  //       notification.error({
  //         message: "Failed to fetch expense limit",
  //         description: "Something went wrong!",
  //       });
  //     });
  // }, []);

  // const handleSetLimit = (e: any) => {
  //   e.preventDefault();
  //   const amount = Number(e.target.elements.limitInput.value);
  //   if (!amount || amount <= 0) {
  //     setValidationError("Please enter a valid amount!");
  //     return;
  //   }
  //   setValidationError(null);
  //   const ExpenseLimitData = { amount, UserId, id: expensesLimit?.id };
  //   axios
  //     .post(
  //       `${REACT_APP_BASE_URL}BudgetsController/${UserId}CreateExpenseLimitAndUpdate`,
  //       ExpenseLimitData
  //     )
  //     .then((response) => {
  //       setexpensesLimit(response.data.amount);
  //       notification.success({
  //         message: editingLimit
  //           ? "Expense Limit updated successfully"
  //           : "Expense Limit added successfully",
  //       });
  //       setEditingLimit(false);
  //       setOpen(false);
  //     })
  //     .catch((e) => {
  //       console.log(e.message);
  //       notification.error({
  //         message: "Failed to set expense limit",
  //         description: "Something went wrong!",
  //       });
  //     });
  // };

  const columns = [
    {
      width: "6%",
      title: "S No",
      dataIndex: "sr.no",
      render: (text: any, budget: any, index: any) => index + 1,
    },

    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      render: (text: any, budget: Budget) => (getCategoryLabel(budget.category))
    },
    {
      title: "Budget",
      dataIndex: "amount",
      key: "amount",
      render: (text: any) => (
        <span style={{ color: "blue" }}>{`₹${Utils.getFormattedNumber(
          text
        )}`}</span>
      ),
    },
    {
      title: "Spent",
      dataIndex: "amountSpent",
      key: "amountSpent",
      render: (text: any) => (
        <span style={{ color: "red" }}>
          {" "}
          {`₹${Utils.getFormattedNumber(text)}`}
        </span>
      ),
    },
    {
      width: "14%",
      title: "Remaining",
      dataIndex: "remainingAmount",
      key: "remaining",
      render: (text: any, budget: Budget) => (
        <span>
          {`₹ ${Utils.getFormattedNumber(budget.amount - budget.amountSpent)}`}
        </span>
      ),
    },
    {
      width: "13%",
      title: "From",
      dataIndex: "startDate",
      key: "startDate",
      render: (date: string) => dayjs(date).format("DD-MM-YYYY"),
    },
    {
      width: "13%",
      title: "To",
      dataIndex: "endDate",
      key: "endDate",
      render: (date: string) => dayjs(date).format("DD-MM-YYYY"),
    },
    {
      title: "Used",
      dataIndex: "completion",
      key: "completion",
      render: (text: any, budget: any) => (
        <span>
          <Progress
            strokeColor={"primary"}
            steps={4}
            percent={Math.round((budget.amountSpent / budget.amount) * 100)}
            status="normal"
          />
        </span>
      ),
    },
    {
      width: "8%",
      title: "Actions",
      key: "actions",
      render: (text: string, record: any) => (
        <>
          <Dropdown
            menu={{
              items: [
                {
                  className: "px-3",
                  label: (
                    <span onClick={() => handleOpenModal(record)}>
                      <EditOutlined size={15} /> Edit
                    </span>
                  ),
                  key: "0",
                },
                {
                  label: (
                    <Popconfirm
                      title="Are you sure?"
                      onConfirm={() => handleDelete(record.id)}
                    >
                      <span>
                        <DeleteOutlined size={15} /> Delete
                      </span>{" "}
                    </Popconfirm>
                  ),
                  key: "1",
                },
              ],
            }}
            trigger={["click"]}
          >
            <a
              className="text-dark fw-bold"
              onClick={(e) => e.preventDefault()}
            >
              <Space>
                <MoreOutlined size={20} />
              </Space>
            </a>
          </Dropdown>
        </>
      ),
    },
  ];

  return (
    <>
      <div
        style={{
          padding: "10px 16px 16px 16px",
          backgroundColor: "white",
        }}
      >
        <Row
          gutter={24}
          className="d-flex flex-row justify-content-between mb-2"
        >
          <Col span={19}>
            <Breadcrumb
              items={[
                {
                  title: (
                    <HomeOutlined onClick={() => navigate("/dashboard")} />
                  ),
                },
                {
                  title: "Budget ",
                },
              ]}
            />
          </Col>

          <Col span={5} className="d-flex flex-row justify-content-between">
            {/* <Statistic
              className="d-flex mx-2  py-1"
              style={{
                backgroundColor: "",
                borderRadius: "5px",
                cursor: "pointer",
              }}
              valueStyle={{ fontSize: "15px", fontWeight: "500" }}
              title={
                <span
                  style={{
                    color: "#69727A",
                    marginRight: "5px",
                    fontWeight: "500",
                  }}
                  onClick={() =>
                    console.log("clicked on expeses limit amount!!")
                  }
                >
                  Expenses Limit : ₹
                </span>
              }
              value={Utils.getFormattedNumber(expensesLimit?.amount)}
            /> */}
            <Statistic
              className="d-flex mx-2  py-1 "
              style={{ backgroundColor: "", borderRadius: "5px" }}
              valueStyle={{ fontSize: "15px", fontWeight: "500" }}
              title={
                <span
                  style={{
                    color: "#69727A",
                    marginRight: "5px",
                    fontWeight: "500",
                  }}
                >
                  Total Expenses : ₹
                </span>
              }
              value={Utils.getFormattedNumber(totalexpense)}
            />
            {/* <Statistic
              className="d-flex mx-2  py-1 "
              style={{ backgroundColor: "", borderRadius: "5px" }}
              valueStyle={{ fontSize: "15px", fontWeight: "500" }}
              title={
                <span
                  style={{
                    color: "#69727A",
                    marginRight: "5px",
                    fontWeight: "500",
                  }}
                >
                  My Wallet : ₹
                </span>
              }
              value={Utils.getFormattedNumber(userWallet)}
            /> */}
          </Col>
        </Row>

        <Row gutter={24} className="d-flex flex-row mb-1 ">
          <Col span={3.5} style={{ paddingRight: 0 }}>
            <Button
              type="primary"
              className="p-2 text-center"
              onClick={() => setIsModalVisible(true)}
            >
              <Plus size={19} />
              Add Budget
            </Button>
          </Col>
          <Col span={11}>
            {/* <Space direction="horizontal" size="middle">
              <Popover
                content={
                  <form onSubmit={handleSetLimit}>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      <Input
                        type="number"
                        name="limitInput"
                        placeholder="Enter Limit"
                        defaultValue={expensesLimit.amount}
                        style={{ width: "130px", marginBottom: "5px" }}
                      />

                      <Button
                        type="primary"
                        size="middle"
                        className="px-2 mx-1"
                        htmlType="submit"
                      >
                        Save
                      </Button>
                    </div>
                    <span className={validationError ? "text-danger" : ""}>
                      {validationError}
                    </span>
                  </form>
                }
                title="Set Expense Limit"
                trigger="click"
                placement="right"
                open={open}
                onOpenChange={setOpen}
              >
                {editingLimit ? (
                  <Button type="primary" className="m-0 px-2 border-0">
                    Set Expenses Limit <PlusOutlined size={19} />
                  </Button>
                ) : (
                  <Button
                    type="primary"
                    onClick={() => setEditingLimit(true)}
                    className="m-0 px-2 py-0 border-0"
                  >
                    Edit Expenses Limit <EditOutlined size={19} />
                  </Button>
                )}
              </Popover>
            </Space> */}
          </Col>

          <Col span={10}>
            {parseInt(expensesLimit) < totalexpense ? (
              <Alert
                className="py-1 px-3"
                message="Warning You have reached the total expense limit!"
                type="warning"
                action={<Space></Space>}
                closable
              />
            ) : (
              ""
            )}
          </Col>

        </Row>
        {/* <hr className='mt-2 mb-2' /> */}
        {loader ? (
          <Spin
            spinning={loader}
            size={"large"}
            className="d-flex justify-content-center py-5"
          />
        ) : (
          <div>
            {budgetExists ? (
              <div>
                {/* <Carousel className="p" arrows infinite={true} style={{ width: '100%', backgroundColor: '#F5F5F5', borderRadius: '10px' }} >

                  {groupedBudgets.length > 0 ? (

                    groupedBudgets.map((budget: Budget[], index) => (

                      // <Carousel key={index} style={{ width: '100%' }} >

                      // <div className="d-flex justify-content-between">

                      <Row gutter={10} className="d-flex flex-row justify-content-between ">

                        {budget.map((budget) => (
                          <Col span={8} className="">


                            <Card

                              className="total-cards-background "
                              key={budget.id}
                              onClick={() => handlePie(budget.category)}
                              actions={[
                                <text className='text-dark'>Budget : <br /> ₹{Utils.getFormattedNumber(budget.amount)}</text>,
                                <text className='text-danger'>Spent : <br /> ₹{budget.category === 13 ? TotalSpentOfOtherCategories() : Utils.getFormattedNumber(budget.amountSpent)}</text>,
                                <text
                                  className={budget.category === 13 ?
                                    (Utils.getFormattedNumber(budget.amount - TotalSpentOfOtherCategories() < 0) ? 'text-danger' : 'text-success')
                                    : ((budget.amount - budget.amountSpent) < 0 ? 'text-danger' : 'text-success')
                                  }

                                >
                                  Remaining:<br />  {remainingAmt(budget, budget.category, budget.amount)}
                                </text>
                              ]}
                              extra={
                                <div className='text-secondary'>
                                  <small className=' px-2 '>
                                    <Tooltip color='grey' title="Edit budget">
                                      <Edit
                                        size={19}
                                        key="edit"
                                        onClick={() => handleOpenModal(budget)}
                                        style={{ cursor: "pointer" }} />

                                    </Tooltip>
                                  </small>
                                  <small>
                                    <Popconfirm title="Are you sure?" onConfirm={() => handleDelete(budget.id)}>

                                      <Trash2
                                        size={19}
                                        key="delete"
                                        style={{ cursor: "pointer" }} />

                                    </Popconfirm>
                                  </small>
                                </div>
                              }
                              title={
                                <div >
                                  <text>{getCategoryLabel(budget.category)} <span style={{ fontSize: '14px' }}> </span></text>
                                </div>}
                              style={{
                                width: '100%',
                                height: 190,
                                margin: 5,
                                padding: 5,
                                backgroundColor: "white",
                                boxShadow: 'rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.06) 0px 1px 2px 0px'
                              }}>

                              <Card.Meta
                                style={{
                                  padding: 5
                                }}
                                avatar={getCategoryTypeIcon(budget.category)}
                                description={
                                  <div>
                                    <Progress
                                      percent={budget.category === 13 ? (TotalSpentOfOtherCategories() / budget.amount * 100) : (budget.amountSpent / budget.amount) * 100}
                                      format={(percent: any) => `${percent.toLocaleString()}%`}
                                      strokeColor={progressColor(budget.amount, budget.amountSpent, budget.category)}
                                    />
                                  </div>
                                }
                              />
                            </Card>
                          </Col>

                        ))}
                      </Row>
                      // </div>

                      // </Carousel>
                    )
                    )) : ""}
                </Carousel> */}

                <Table
                  size="small"
                  dataSource={groupedBudgets.flat()}
                  columns={columns}
                  rowKey="id"
                  scroll={{ y: 445 }}
                  pagination={false}
                  summary={(data: any) => {
                    let totalAmount = 0;
                    let totalSpent = 0;
                    data.forEach(({ amount, amountSpent }: any) => {
                      totalAmount += amount;
                      totalSpent += amountSpent;
                    });
                    let totalRemaining = totalAmount - totalSpent;

                    return (
                      <Table.Summary fixed>
                        <Table.Summary.Row>
                          <Table.Summary.Cell index={0}></Table.Summary.Cell>
                          <Table.Summary.Cell index={1}>
                            <h6>Total</h6>
                          </Table.Summary.Cell>
                          <Table.Summary.Cell index={2}>
                            <Statistic
                              className="d-flex"
                              valueStyle={{
                                fontSize: "15px",
                                fontWeight: "500",
                                marginLeft: "5px",
                              }}
                              title="₹"
                              value={Utils.getFormattedNumber(totalAmount)}
                            />
                          </Table.Summary.Cell>
                          <Table.Summary.Cell index={3}>
                            <Statistic
                              className="d-flex"
                              valueStyle={{
                                fontSize: "15px",
                                fontWeight: "500",
                                marginLeft: "5px",
                              }}
                              title="₹"
                              value={Utils.getFormattedNumber(totalSpent)}
                            />
                          </Table.Summary.Cell>
                          <Table.Summary.Cell index={4}>
                            <Statistic
                              className="d-flex"
                              valueStyle={{
                                fontSize: "15px",
                                fontWeight: "500",
                                marginLeft: "5px",
                              }}
                              title="₹"
                              value={Utils.getFormattedNumber(totalRemaining)}
                            />
                          </Table.Summary.Cell>
                          <Table.Summary.Cell index={5}></Table.Summary.Cell>
                          <Table.Summary.Cell index={6}></Table.Summary.Cell>
                          <Table.Summary.Cell index={7}></Table.Summary.Cell>
                        </Table.Summary.Row>
                      </Table.Summary>
                    );
                  }}

                // footer={()=> [{
                //     title:'gajf',

                // }]}
                />

                {/* <div className="d-flex flex-row mt-2 justify-content-between " style={{ height: '100%', width: '100%' }}>

                  <Card className="mx-">
                    <h4>Expense Pie Chart</h4>
                    <PieChart
                      className="mt-5  "
                      width={490}
                      height={180}
                      series={[
                        {
                          innerRadius: 50,
                          data: pieChartData
                        }
                      ]}
                    />
                  </Card>
                  <Card className="">
                    <BarChart
                      width={680}
                      height={300}
                      xAxis={[{ scaleType: 'band', data: categories }]}
                      series={[
                        { label: 'Budgeted Amount', data: seriesData.map(data => data.amount), color: '#C4D7FF' },
                        { label: 'Spent Amount', data: seriesData.map(data => data.amountSpent), color: '#87A2FF' }
                      ]}
                    />
                  </Card>
                </div> */}
              </div>
            ) : (
              <Empty />
            )}
          </div>
        )}

        <Modal visible={isModalVisible} onCancel={handleCancel} footer={null}>
          <Form
            requiredMark={false}
            form={form}
            layout="vertical"
            onFinish={handleFormSubmit}
          >
            <h5>{editingBudget ? "Edit Budget" : "Add Budget"}</h5>
            <Form.Item
              name="category"
              label="Category"
              rules={[{ required: true, message: "Please select a category" }]}
            >
              <Select placeholder="Select category">
                <Option value={5}>Food & Beverages</Option>
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

            <div className="d-flex flex-row justify-content-between ">
              <Form.Item
                style={{ width: "33%" }}
                name="amount"
                label="Amount"
                rules={[
                  { required: true, message: "Please enter the amount!" },
                ]}
              >
                <Input
                  className="w-100"
                  type="number"
                  placeholder="Enter amount"
                  onChange={(e) =>
                    setBudget({ ...budget, amount: +e.target.value })
                  }
                  min={0}
                />
              </Form.Item>

              <Form.Item
                style={{ width: "65%" }}
                name="dateRange"
                label="Date"
                rules={[{ required: true, message: "Please enter the date!" }]}
              >
                <RangePicker className="w-100" format="DD-MM-YYYY" />
              </Form.Item>
            </div>
            <Form.Item>
              <Button
                className="px-3"
                type="primary"
                htmlType="submit"
                style={{ float: "right" }}
              >
                {editingBudget ? "Update" : "Save"}
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </>
  );
};
export default Budget;
