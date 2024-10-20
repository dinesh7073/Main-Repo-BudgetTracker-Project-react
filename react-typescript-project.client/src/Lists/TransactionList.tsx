import React, { useState, useEffect, useContext } from 'react';
import { Form, Input, Button, DatePicker, Radio, Select, notification, List, Modal, Popconfirm, Calendar, Breadcrumb, Statistic, StatisticProps, Row, Col, Table, Tag, Segmented, DatePickerProps, Tooltip, Skeleton, Spin, Dropdown, Space, Divider } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { Zap, ShoppingBag, Home, Car, Edit, Trash2, AlertCircle, Briefcase, DollarSign, HelpCircle, Laptop, RotateCcw, CirclePlus, CircleX, Plus } from 'lucide-react';
import { IoFastFoodOutline } from 'react-icons/io5';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import '../CSS/TransactionList.css';
import axios from 'axios';
import UserContext from '../UserContext';
import { DeleteOutlined, EditOutlined, HomeOutlined, MoreOutlined, PlusOutlined, RedoOutlined, SaveOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import '../CSS/ThemeColors.css'
import CountUp from 'react-countup';
import { REACT_APP_BASE_URL } from '../Components/Common/Url';
import { Utils } from '../Components/Common/Utilities/Utils';
import buddhistEra from 'dayjs/plugin/buddhistEra';
import 'dayjs/locale/en';
import buddhistLocale from 'antd/es/date-picker/locale/en_US';
import { CategoriesType } from '../Components/Settings-children\'s/CategoriesCompo';
import { AccountTypes } from '../Components/Settings-children\'s/AccountsCompo';
import { style } from '@mui/system';
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
dayjs.extend(buddhistEra);


const { Option } = Select;
const { RangePicker } = DatePicker;
export interface FormData {
    id: string;
    userId: string;
    transactionType: number | null;
    accountType: number | null;
    categoryType: number | null;
    label: string;
    amount: number | null;
    date: Dayjs | null;
    time: Dayjs | null;
    currency?: string;
}


const initialFormValues: FormData = {
    id: '',
    userId: '',
    transactionType: 2,
    accountType: null,
    categoryType: null,
    currency: 'INR',
    label: '',
    amount: null,
    date: dayjs(new Date),
    time: null,
};


const transformData = (records: FormData[]): FormData[] => {
    return records.map((transactions) => ({
        ...transactions,
    }));
};

const TransactionList: React.FC = () => {

    const { setTransactionData, expensesLimit, userDetails, userWallet, setUserWallet, } = useContext<any>(UserContext);
    const [formData, setFormData] = useState<FormData>(initialFormValues);
    const [form] = Form.useForm();
    const [records, setRecords] = useState<FormData[]>([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingTransaction, setEditingTransaction] = useState<FormData | null>(null);
    const [sorttransactionType, setSorttransactionType] = useState<'new' | 'old' | 'high' | 'low'>('new');
    const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
    const [selectedDateRange, setSelectedDateRange] = useState<[Dayjs, Dayjs] | null>(null);
    const [transactiontransactionType, setTransactiontransactionType] = useState<'Income' | 'Expense' | 'All'>('All');
    const [loader, setLoader] = useState<boolean>(false)

    const [accounts, setAccounts] = useState<AccountTypes[]>([]);
    const [categoryData, setCategoryData] = useState<CategoriesType[]>([]);
    const navigate = useNavigate();


    const [inputValue, setInputValue] = useState('');
    const UserId = userDetails?.id

    useEffect(() => {
        setLoader(true);

        axios.get(`${REACT_APP_BASE_URL}TransactionsController/${UserId}GetTransactionsByUserId`)
            .then((res) => {
                if (res.status === 200) {
                    const transformedRecords = transformData(res.data);
                    setRecords(transformedRecords.map(record => ({
                        ...record,
                        amount: Number(record.amount),
                    })));
                    setTransactionData(transformedRecords);
                    updateUserWallet(transformedRecords);
                    setLoader(false);
                }
            })
            .catch((err) => {
                console.log("Error from server", err);
                setLoader(false)
            });

        axios.get(`${REACT_APP_BASE_URL}AccountsController/${UserId}GetAccountsByUserId`).then((response) => {
            setAccounts(response.data);
            setLoader(false);
        }).catch(() => {
            setLoader(false);
        });

        axios.get(`${REACT_APP_BASE_URL}CategoriesController/${UserId}GetCategoriesByUserId`).then((res) => {
            setCategoryData(res.data);
            setLoader(false);
        }).catch((err) => {
            setLoader(false);
            notification.error({
                message: 'Something went wrong! Please try again later'
            })
        });

    }, [UserId, setTransactionData]);

    const updateUserWallet = (records: FormData[]) => {
        const totalIncome = records
            .filter(record => record.transactionType === 1 && record.amount !== null)
            .reduce((total, record) => total + (record.amount as number), 0);
        const totalExpenses = records
            .filter(record => record.transactionType === 2)
            .reduce((total, record) => total + (record.amount as number), 0);

        setUserWallet(totalIncome - totalExpenses);
    };

    const expenseCategories = [
        { label: 'Food,Drinks', value: 5 },
        { label: 'Clothes & Footwear', value: 6 },
        { label: 'Housing', value: 7 },
        { label: 'Vehicle', value: 8 },
        { label: 'Transportation', value: 9 },
        { label: 'Health Care', value: 10 },
        { label: 'Communication, PC', value: 11 },
        { label: 'Entertainment', value: 12 },
    ];
    const incomeCategories = [
        { label: 'Salary', value: 1 },
        { label: 'Investments', value: 2 },
        { label: 'Business', value: 3 },
        { label: 'Other Income', value: 4 },
    ];

    const CustomExpenseCategory = categoryData
        .filter(category => category.categoryType === 2)
        .map(({ categoryName, categoryNumber }) => ({ label: categoryName, value: categoryNumber }));

    const CustomIncomeCategory = categoryData
        .filter(category => category.categoryType === 1)
        .map(({ categoryName, categoryNumber }) => ({ label: categoryName, value: categoryNumber }));

    const bothCustomCategory = [...CustomExpenseCategory, ...CustomIncomeCategory]
    // console.log('exp', CustomExpenseCategory);
    // console.log('income', CustomIncomeCategory);
    // console.log('both', bothCustomCategory);



    const incomeAccountType = [
        { label: 'Saving Account', value: 2 },
        { label: 'Current Account', value: 5 }
    ]
    const expenseAccountType = [

        { label: 'Saving Account', value: 2 },
        { label: 'Credit Card', value: 4 },
        { label: 'Current Account', value: 5 }
    ]


    const totalIncome = records
        .filter(record => record.transactionType === 1 && record.amount !== null)
        .reduce((total, record) => total + (record.amount as number), 0);
    const totalExpenses = records
        .filter(record => record.transactionType === 2)
        .reduce((total, record) => total + (record.amount as number), 0);


    const handleTypeChange = (value: any) => {

        setFormData((prevData) => ({
            ...prevData,
            transactionType: value,
            categoryType: null,
            accountType: null,
        }));

        form.setFieldsValue({ categoryType: null, accountType: null });
    };

    const handleDateRangeChange = (dates: [Dayjs, Dayjs] | any) => {
        setSelectedDateRange(dates);
    };

    const filteredTransactions = records.filter(record => {
        const iscategoryTypeMatch = selectedCategories.length === 0 || selectedCategories.includes(Number(record.categoryType));
        const transactionDate = dayjs(record.date);
        const isDateMatch = !selectedDateRange ||
            (
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

    const sortedTransactions = filteredTransactions.sort((a, b) => {
        switch (sorttransactionType) {
            case 'high':
                return (b.amount as number) - (a.amount as number);
            case 'low':
                return (a.amount as number) - (b.amount as number);
            case 'old':
                return dayjs(a.date).isBefore(dayjs(b.date)) ? -1 : 1;
            case 'new':
            default:
                return dayjs(b.date).isBefore(dayjs(a.date)) ? -1 : 1;
        }
    });

    const handlecategoryTypeChange = (values: number[]) => {
        setSelectedCategories(values);
    };


    const getAccountTypeLabel = (value: number | null) => {
        switch (value) {
            case 1: return "Cash";
            case 2: return "Saving Account";
            case 3: return "General";
            case 4: return "Credit Card";
            case 5: return "Salary Account";
            case 6: return "Current Account";
        }

    }
    const getCategoryLabel = (category: number | null) => {

        const foundCategory = bothCustomCategory.find(item => item.value === category);
        if (foundCategory) {
            return foundCategory.label;
        }
        switch (category) {
            case 1: return 'Salary';
            case 2: return 'Investments';
            case 3: return 'Business';
            case 4: return 'Other Income';
            case 5: return 'Food & Drinks';
            case 6: return 'Clothes & Footwear';
            case 7: return 'Housing';
            case 8: return 'Vehicle';
            case 9: return 'Transportation';
            case 10: return 'Health Care';
            case 11: return 'Communication & Devices';
            case 12: return 'Entertainment';
        }
    }

    const getAccountName = (accountType: number | null) => {
        switch (accountType) {
            case 1: return "Cash";
            case 2: return "Saving Account";
            case 3: return "General";
            case 4: return "Credit Card";
            case 5: return "Salary Account";
            case 6: return "Current Account";
            default: return "Unknown";
        }
    };



    const getCategoryTypeIcon = (categoryType: number | null) => {
        switch (categoryType) {
            case 1: return <DollarSign />;
            case 2: return <Briefcase />;
            case 3: return <Home />;
            case 4: return <Calendar />;
            case 5: return <IoFastFoodOutline />;
            case 6: return <ShoppingBag />;
            case 7: return <Home />;
            case 8: return <Car />;
            case 9: return <Car />;
            case 10: return <AlertCircle />;
            case 11: return <Laptop />;
            case 12: return <Zap />;
            default: return <HelpCircle />;
        }
    };

    const showModal = (transaction?: FormData) => {


        if (transaction) {
            const myobj = {
                ...transaction,
                transactionType: transaction.transactionType,
                // categoryType: getCategoryLabel(transaction.categoryType),
                categoryType: {
                    label: getCategoryLabel(transaction.categoryType),
                    value: transaction.categoryType
                },
                accountType: {
                    label: getAccountTypeLabel(transaction.accountType),
                    value: transaction.accountType
                },

                time: dayjs(transaction.time),
                date: dayjs(transaction.date),

            }
            setEditingTransaction(transaction);
            form.setFieldsValue({
                ...myobj,


            });
        } else {
            setEditingTransaction(null);
            form.resetFields();
        }
        setIsModalVisible(true);
    };

    const handleSubmit = (values: FormData) => {

        const transactionAmount = Number(values.amount);
        const filteredAccount = accounts.find((a: any) => a.accountType === values.accountType.value);
        if (!filteredAccount) {
            notification.error({
                message: 'Account not found',
                description: 'The selected account type does not exist.',
            });
            return;
        }

        const transactionData = {
            ...values,
            amount: transactionAmount,
            userId: UserId,
            categoryType: values.categoryType.value,
            accountType: values.accountType.value,
        };

        // if (editingTransaction) {
        //     transactionData.id = editingTransaction.id;
        // }
        let calAmount;

        if (editingTransaction) {
            transactionData.id = editingTransaction.id;
            // const getrecord: any = records.find((t) => t.id === editingTransaction.id);
            // if (getrecord) {

            let removeAmount = transactionData.amount - Number(editingTransaction.amount);

            calAmount = values.transactionType === 2
                ? (filteredAccount.amount - removeAmount)
                : (filteredAccount.amount + removeAmount);
            // }

        } else {
            calAmount = values.transactionType === 2
                ? (filteredAccount.amount - transactionAmount)
                : (filteredAccount.amount + transactionAmount);
        }



        const updatedAccountData = { ...filteredAccount, amount: calAmount };

        axios.post(`${REACT_APP_BASE_URL}AccountsController/${UserId}CreateAccountsAndUpdate`, updatedAccountData)
            .then(() => {
                setAccounts(accounts.map((a: any) => a.accountType === updatedAccountData.accountType ? updatedAccountData : a));
            })
            .catch(err => notification.error({
                message: 'Failed to update account balance',
                description: err.message,
            }));


        axios.post(`${REACT_APP_BASE_URL}TransactionsController/${UserId}CreateTransactionsAndUpdate`, transactionData)
            .then((response) => {
                const updatedRecords = editingTransaction
                    ? records.map(record => record.id === editingTransaction.id ? { ...record, ...response.data } : record)
                    : [...records, response.data];

                setRecords(updatedRecords);
                updateUserWallet(updatedRecords);
                notification.success({
                    message: editingTransaction ? 'Transaction updated successfully' : 'Record added successfully',
                });
            })
            .catch(err => notification.error({
                message: editingTransaction ? 'Failed to update transaction' : 'Failed to add record',
                description: err.message,
            }));

        form.resetFields();
        setIsModalVisible(false);
        setInputValue('')
    };


    const handleCancel = () => {
        setIsModalVisible(false);
        setInputValue('')
    };

    const handleDelete = (id: string) => {
        axios.post(`${REACT_APP_BASE_URL}TransactionsController/${id}DeleteTransaction`)
            .then((response) => {
                const updatedRecords = records.filter(record => record.id !== id);
                setRecords(updatedRecords);
                updateUserWallet(updatedRecords);
                notification.success({ message: response.data.message || 'Record deleted successfully' });
            })
            .catch(err => {
                console.error('Delete error:', err);
                notification.error({ message: 'Failed to delete record', description: err.message });
            });
    };



    const columns = [

        {
            width: '5%',
            title: 'Sr No',
            dataIndex: 'sr.no',
            render: (text: any, record: any, index: any) => (index + 1),
        },

        {

            title: 'Category',
            dataIndex: 'categoryType',
            key: 'categoryType',
            render: (categoryType: number) => getCategoryLabel(categoryType),

        },
        {
            width: '15%',
            title: 'Label',
            dataIndex: 'label',
            key: 'label',
            ellipsis: {
                showTitle: false,
            },

            render: (label: string) => (

                <div
                    style={{
                        paddingLeft: label.length > 1 ? '0px' : '10px',
                    }}
                >
                    {label.length > 1 ? label : '-'}
                </div>

            ),

        },
        {
            width: '15%',
            title: 'Account Type',
            dataIndex: 'accountType',
            key: 'accountType',
            render: (accountType: number) => getAccountName(accountType),
        },
        {
            width: '13%',
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
            render: (date: string) => dayjs(date).format('DD-MM-YYYY'),
        },
        {
            width: '11%',
            title: "Type",
            dataIndex: 'transactionType',
            key: 'transactionType',
            render: (transactionType: number) => <><Tag style={{ width: '57px' }} color={transactionType == 1 ? 'green' : 'red'}>{transactionType == 1 ? " Income " : "Expense"}</Tag> </>,

        },
        {
            width: '14%',
            title: 'Amount',
            dataIndex: 'amount',
            key: 'amount',
            render: (amount: number, record: any) => (
                <span style={{ color: record.transactionType === 1 ? 'green' : 'red', }} >
                    {record.transactionType === 1 ? `₹ +${Utils.getFormattedNumber(amount)}` : `₹ -${Utils.getFormattedNumber(amount)}`}
                </span>
            ),
        },

        {
            width: '8%',
            title: 'Actions',
            key: 'actions',
            render: (text: string, record: any) => (
                <>
                    <Dropdown
                        menu={{
                            items: [
                                {
                                    className: 'px-3',
                                    label: <span onClick={() => showModal(record)}><EditOutlined size={15} /> Edit</span>,
                                    key: '0',
                                },
                                {
                                    label: <Popconfirm title="Are you sure?" onConfirm={() => handleDelete(record.id)}><span><DeleteOutlined size={15} /> Delete</span> </Popconfirm>,
                                    key: '1',
                                },

                            ],
                        }}

                        trigger={['click']}
                    >
                        <a className="text-dark fw-bold" onClick={(e) => e.preventDefault()}>
                            <Space>
                                <MoreOutlined size={20} />
                            </Space>
                        </a>
                    </Dropdown >

                </>
            ),
        }
    ];


    const handleAddCategory = (categoryName: any, transactionType: any) => {
        let categoryNum = 0;
        if (categoryData.length === 0) {
            categoryNum = 14;
        } else {
            let lastdata = categoryData.length - 1;
            let getlastdata = categoryData[lastdata]
            categoryNum = getlastdata.categoryNumber + 1;
        }
        const userId = UserId;
        const categoryNumber = categoryNum;
        const apiURL = `${REACT_APP_BASE_URL}CategoriesController/${userId}CreateCategoriesAndUpdate`

        const categorydata = { userId, categoryNumber, categoryName, categoryType: transactionType };

        axios.post(apiURL, categorydata).then(
            (response) => {
                const updatedRecords = [...categoryData, response.data];
                setCategoryData(updatedRecords);
                notification.success({
                    message: 'Category added successfully',
                });
            }
        );
        // Example logic to add the category
        // const newCategory = {
        //     name: categoryName,
        //     type: transactionType === 2 ? 'expense' : 'income', // Handle transaction type
        // };

        // Update the respective categories based on the transactionType
        // if (transactionType === 2) {
        //     setCustomExpenseCategory((prev) => [...prev, newCategory]);
        // } else {
        //     setCustomIncomeCategory((prev) => [...prev, newCategory]);
        // }

        // Clear the input field after adding the category
        setInputValue('');
    };


    return (

        <div style={{ padding: '10px 16px 16px 16px', backgroundColor: 'white' }}>
            <Col span={24}>
                <Row gutter={24} className='d-flex flex-row justify-content-between mb-3'>
                    <Col span={17}>
                        <Breadcrumb
                            items={[
                                {
                                    title: < HomeOutlined onClick={() => navigate('/dashboard')} />,
                                },
                                {
                                    title: 'Transactions ',
                                },
                            ]}
                        />
                    </Col>
                    <Col span={7} className='d-flex flex-row justify-content-between'>
                        {/* <Statistic className='d-flex mx-1' valueStyle={{ fontSize: '14px', fontWeight: '500' }} title={<span style={{ color: 'goldenrod', marginRight: '5px', fontWeight: '500' }}>My Wallet : ₹ </span>} value={Utils.getFormattedNumber(userWallet)} /> */}
                        <Statistic className='d-flex' valueStyle={{ fontSize: '14px', fontWeight: '500' }} title={<span style={{ color: 'green', marginRight: '5px', fontWeight: '500' }}>Incomes  : ₹</span>} value={Utils.getFormattedNumber(totalIncome)} />
                        <Statistic className='d-flex' valueStyle={{ fontSize: '14px', fontWeight: '500' }} title={<span style={{ color: 'red', marginRight: '5px', fontWeight: '500' }}>Expenses  : ₹ </span>} value={Utils.getFormattedNumber(totalExpenses)} />
                    </Col>
                </Row>
                <Row gutter={24} className='d-flex flex-row'>

                    <Col span={2} >
                        <Button className='main-buttons p-2' type="primary" onClick={() => showModal()}><Plus size={19} />Add Record</Button>
                    </Col>

                    <Col span={22} >
                        <Row className='d-flex flex-row mx-1' justify={'space-between'} gutter={24}  >

                            <Col span={4} className='d-flex' >
                                <span className='align-content-center mx-2' style={{ width: '30px' }}>Type</span>
                                <Select
                                    style={{ width: '100%' }}
                                    value={transactiontransactionType}
                                    onChange={value => setTransactiontransactionType(value as 'Income' | 'Expense' | 'All')}
                                >
                                    <Option value="All">All</Option>
                                    <Option value="Income">Income</Option>
                                    <Option value="Expense">Expense</Option>
                                </Select>
                            </Col>

                            <Col span={4} className='d-flex'>
                                <span className='align-content-center mx-2' style={{ width: '89px' }}>Sort by</span>
                                <Select
                                    onChange={(e) => setSorttransactionType(e)}
                                    style={{ width: '100%' }}
                                    value={sorttransactionType}
                                >
                                    <Option value="new">Newest</Option>
                                    <Option value="old">Oldest</Option>
                                    <Option value="high">Highest</Option>
                                    <Option value="low">Lowest</Option>

                                </Select>
                            </Col>
                            <Col span={8} className='d-flex'>
                                <span className='align-content-center' style={{ width: '100px' }}>Filter by date</span>
                                <RangePicker
                                    onChange={handleDateRangeChange}
                                    value={selectedDateRange}
                                />
                            </Col>
                            <Col span={8} className='d-flex'>
                                <span className='align-content-center' style={{ width: '130px' }}>Filter category</span>
                                <Select
                                    mode="multiple"
                                    style={{ width: '100%' }}
                                    placeholder="Filter by category"
                                    onChange={handlecategoryTypeChange}
                                    value={selectedCategories}
                                >
                                    {
                                        (transactiontransactionType === 'All'
                                            ? [...incomeCategories, ...expenseCategories, ...bothCustomCategory]
                                            : transactiontransactionType === 'Income'
                                                ? [...incomeCategories, ...CustomIncomeCategory]
                                                : [...expenseCategories, ...CustomExpenseCategory]
                                        ).map(categoryType => (
                                            <Option key={categoryType.value} value={categoryType.value}>{categoryType.label}</Option>
                                        ))
                                    }
                                </Select>
                            </Col>
                        </Row>

                    </Col>

                </Row>
            </Col>


            <hr className='mt-2 mb-2' />

            {loader ? (
                <Spin spinning={loader} size={'large'} className="d-flex justify-content-center py-5" />
            ) : (
                <Table
                    size='small'
                    dataSource={sortedTransactions}
                    columns={columns}
                    rowKey="id"
                    scroll={{ y: 445 }}


                    pagination={false}

                    summary={(data: any) => {
                        let totalAmount = 0;
                        data.forEach(({ amount }: any) => {
                            totalAmount += amount;
                        });
                        return (
                            <Table.Summary fixed>
                                <Table.Summary.Row>
                                    <Table.Summary.Cell index={0}></Table.Summary.Cell>
                                    <Table.Summary.Cell index={1}><h6>Total</h6></Table.Summary.Cell>
                                    <Table.Summary.Cell index={2}></Table.Summary.Cell>
                                    <Table.Summary.Cell index={3}></Table.Summary.Cell>
                                    <Table.Summary.Cell index={4}></Table.Summary.Cell>
                                    <Table.Summary.Cell index={5}></Table.Summary.Cell>
                                    <Table.Summary.Cell index={6}>
                                        <Statistic className='d-flex' valueStyle={{ fontSize: '15px', fontWeight: '500', marginLeft: '5px' }} title=' ₹ ' value={(Utils.getFormattedNumber(totalAmount))} />
                                    </Table.Summary.Cell>
                                    <Table.Summary.Cell index={7}></Table.Summary.Cell>
                                </Table.Summary.Row>
                            </Table.Summary>
                        )
                    }}

                // footer={()=> [{
                //     title:'gajf',

                // }]}
                />
            )}
            <Modal
                style={{ width: '700px' }}
                title={editingTransaction ? 'Edit Record' : 'Add Record'}
                open={isModalVisible}
                onCancel={handleCancel}
                footer={[
                    <Form.Item className='d-flex flex-column px-3'>
                        <Button type="primary" htmlType="submit" onClick={() => form.submit()} className='float-end' style={{ width: '30%' }}>

                            {editingTransaction ? <RotateCcw size={16} /> : <SaveOutlined size={16} />}  {editingTransaction ? 'Update record' : 'Save record'}
                        </Button>

                        <Button type="dashed" htmlType="button" onClick={() => form.resetFields()} className=' text-center float-end mx-3' style={{ width: '30%' }}>
                            <RedoOutlined size={16} />   Reset Form
                        </Button>
                    </Form.Item>
                ]}
            >
                <Form
                    requiredMark={false}
                    form={form}
                    layout="vertical"
                    className='p-3 rounded'
                    style={{ maxWidth: '100%', backgroundColor: '', minWidth: '100%' }}
                    onFinish={handleSubmit}
                    initialValues={formData || { categoryType: '', amount: 0, transactionType: 2, accountType: '', currency: 'INR' }}
                >
                    <Col span={24} >

                        <Row gutter={24}>

                            <Col span={12}>

                                <Form.Item
                                    label="Transaction Type"
                                    name="transactionType"
                                    rules={[{ required: true, message: 'Please select a transactiontype!' }]}
                                    style={{ width: '100%' }}

                                >

                                    <Segmented size='middle' options={[
                                        { label: 'Income', value: 1, },
                                        { label: 'Expense', value: 2, },
                                    ]}
                                        onChange={handleTypeChange}
                                        value={formData.transactionType}
                                        style={{ width: '100%', backgroundColor: '#F3F4FA', border: '1px solid lightgrey' }}
                                        block
                                    />

                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    label="Account Type"
                                    name="accountType"
                                    rules={[{ required: true, message: 'Please select a account type!' }]}
                                >
                                    <Select
                                        placeholder="Select account type"
                                        className='w-100'
                                        labelInValue
                                    >
                                        {(formData.transactionType === 2 ? accounts : accounts).map((e: any) => (
                                            <Option key={e.accountType} value={e.accountType}>

                                                <Tooltip placement="right" title={e.name}>
                                                    {getAccountTypeLabel(e.accountType)}{` [ ${e.name} ]`}

                                                </Tooltip>
                                            </Option>
                                        ))}

                                    </Select>
                                </Form.Item>
                            </Col>


                        </Row>
                        <Row gutter={24}>
                            <Col span={12} className='d-flex flex-row'>

                                <Form.Item
                                    className='w-100'
                                    label="Amount"
                                    name="amount"
                                    rules={[{ required: true, message: 'Please enter an amount!' }]}
                                >
                                    <Input
                                        suffix="₹"
                                        className='w-100'
                                        type="number"
                                        placeholder="Enter amount"
                                        min={0}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            if (value.startsWith('0') && value.length > 1) {
                                                e.target.value = value.replace(/^0+/, '');
                                            }
                                            form.setFieldsValue({ amount: e.target.value });
                                        }}
                                    />
                                </Form.Item>
                                {/* <Form.Item
                                    label="Currency"
                                    name="currency"
                                    rules={[{ message: 'Please select a currency!' }]}
                                >
                                    <Select
                                        placeholder="INR"
                                        value="INR"
                                        className='w-100 '
                                        disabled={true}
                                    >
                                        <Option value="INR">INR</Option>
                                    </Select>
                                </Form.Item> */}
                            </Col>

                            <Col span={12}>

                                <Form.Item
                                    label="Category"
                                    name="categoryType"
                                    rules={[{ required: true, message: 'Please select a category!' }]}
                                >
                                    <Select
                                        placeholder="Select category"
                                        className='w-100'
                                        labelInValue
                                        dropdownRender={(menu) => (
                                            <>
                                                {menu}
                                                <Divider style={{ margin: '8px 0' }} />
                                                <Space style={{ padding: '0 8px 4px' }}>
                                                    <Input
                                                        placeholder="Please enter item"
                                                        value={inputValue}
                                                        onChange={(e) => setInputValue(e.target.value)}
                                                        onKeyDown={(e) => e.stopPropagation()}
                                                    />
                                                    <Button type="text" icon={<PlusOutlined />} onClick={() => handleAddCategory(inputValue, formData.transactionType)}>

                                                    </Button>
                                                </Space>
                                            </>
                                        )}
                                    >
                                        {(formData.transactionType === 2 ? [...expenseCategories, ...CustomExpenseCategory] : [...incomeCategories, ...CustomIncomeCategory]).map((categoryType) => (
                                            <Option key={categoryType.value} value={categoryType.value}>

                                                {getCategoryLabel(categoryType.value)}
                                            </Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={24}>



                            <Col span={12}>


                                <Form.Item
                                    className='w-100'
                                    label="Date & Time"
                                    name="date"
                                    rules={[{ required: true, message: 'Please select a date !' }]}

                                >

                                    <DatePicker
                                        className='w-100'
                                        placeholder='Select date & time'
                                        type='primary'
                                        showTime
                                        format={"DD-MM-YYYY HH:mm:ss"}
                                        value={dayjs()}


                                    />
                                </Form.Item>
                            </Col>
                            <Col span={12}>



                                <Form.Item
                                    className='w-100'
                                    label="Label"
                                    name="label"
                                >
                                    <Input
                                        type='primary'
                                        onInput={(e: any) => e.target.value = e.target.value.length > 1 ? e.target.value : e.target.value.toUpperCase()}
                                        placeholder="Enter label"
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Col>
                </Form>
            </Modal>

        </div >
    );
};

export default TransactionList;