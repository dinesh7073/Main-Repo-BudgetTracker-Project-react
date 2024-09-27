import React, { useState, useEffect, useContext } from 'react';
import { Form, Input, Button, DatePicker, Radio, Select, notification, List, Modal, Popconfirm, Calendar, Breadcrumb, Statistic, StatisticProps, Row, Col, Table, Tag } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { Zap, ShoppingBag, Home, Car, Edit, Trash2, AlertCircle, Briefcase, DollarSign, HelpCircle, Laptop, RotateCcw, CirclePlus, CircleX } from 'lucide-react';
import { IoFastFoodOutline } from 'react-icons/io5';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import '../CSS/TransactionList.css';
import axios from 'axios';
import UserContext from '../UserContext';
import { HomeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import '../CSS/ThemeColors.css'
import CountUp from 'react-countup';
import { REACT_APP_BASE_URL } from '../Components/Common/Url';

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
const { Option } = Select;
const { RangePicker } = DatePicker;
interface FormData {
    id: string;
    userId: string;
    transactionType: number;
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
    transactionType: 1,
    accountType: null,
    categoryType: null,
    currency: 'INR',
    label: '',
    amount: null,
    date: null,
    time: null,
};

const formatter: StatisticProps['formatter'] = (value) => (
    <CountUp end={value as number} separator="," />
);

const transformData = (records: FormData[]): FormData[] => {
    return records.map((transactions) => ({
        ...transactions,
    }));
};

const TransactionList: React.FC = () => {
    const { setTransactionData, userDetails } = useContext<any>(UserContext);
    const [formData, setFormData] = useState<FormData>(initialFormValues);
    const [form] = Form.useForm();
    const [records, setRecords] = useState<FormData[]>([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingTransaction, setEditingTransaction] = useState<FormData | null>(null);
    const [sorttransactionType, setSorttransactionType] = useState<'new' | 'old' | 'high' | 'low'>('new');
    const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
    const [selectedDateRange, setSelectedDateRange] = useState<[Dayjs, Dayjs] | null>(null);
    const [transactiontransactionType, setTransactiontransactionType] = useState<'Income' | 'Expense' | 'All'>('All');
    const [UserWallet, setUserWallet] = useState<number>();
    const navigate = useNavigate();

    const UserId = userDetails.UserId;

    useEffect(() => {

        axios.get(`${REACT_APP_BASE_URL}TransactionsController/${UserId}GetTransactionsByUserId`)
            .then((res) => {
                if (res.status === 200) {
                    const transformedRecords = transformData(res.data);
                    setRecords(transformedRecords.map(record => ({
                        ...record,
                        amount: Number(record.amount),
                    })));
                    setTransactionData(transformedRecords)
                    updateUserWallet(transformedRecords);
                }
            })
            .catch((err) => console.log("Error from server", err));
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

    const totalIncome = records
        .filter(record => record.transactionType === 1 && record.amount !== null)
        .reduce((total, record) => total + (record.amount as number), 0);
    const totalExpenses = records
        .filter(record => record.transactionType === 2)
        .reduce((total, record) => total + (record.amount as number), 0);

    const handleTypeChange = (e: any) => {
        const newtransactionType = e.target.value;
        setFormData((prevData) => ({
            ...prevData,
            transactionType: newtransactionType,
            categoryType: null,
        }));
        form.setFieldsValue({ categoryType: null });
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
        }
    }
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
                // categoryType: getCategoryLabel(transaction.categoryType),
                categoryType: {
                    label: getCategoryLabel(transaction.categoryType),
                    value: transaction.categoryType
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
        const amount = Number(values.amount);
        const userId = UserId;
        const categoryType = values.categoryType.value;
        const apiUrl = `${REACT_APP_BASE_URL}TransactionsController/${UserId}CreateTransactionsAndUpdate`;



        const transactionData = { ...values, amount, userId, categoryType };
        if (editingTransaction) {
            transactionData.id = editingTransaction.id;
        }


        axios.post(apiUrl, transactionData)
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
    };

    const handleCancel = () => {
        setIsModalVisible(false);
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

        // {
        //     title: 'Sr.No',
        //     dataIndex: 'index',
        //     key: 'id',
        //     render: (id: any) => `${id+=1}`,

        // },
        {
            title: 'Category',
            dataIndex: 'categoryType',
            key: 'categoryType',
            render: (categoryType: number) => getCategoryLabel(categoryType), // Assuming you have this helper function
        },
        {
            title: 'Label',
            dataIndex: 'label',
            key: 'label',
        },
        {
            title: 'Account Type',
            dataIndex: 'accountType',
            key: 'accountType',
            render: (accountType: number) => getAccountName(accountType), // Assuming you have this helper function
        },
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
            render: (date: string) => dayjs(date).format('DD-MM-YYYY'),
        },
        {
            title: "Status",
            dataIndex: 'transactionType',
            key: 'transactionType',
            render: (transactionType: number) => <><Tag style={{ width: '57px' }} color={transactionType == 1 ? 'green' : 'red'}>{transactionType == 1 ? " Income " : "Expense"}</Tag> </>,

        },
        {
            title: 'Amount',
            dataIndex: 'amount',
            key: 'amount',
            render: (amount: number, record: any) => (
                <span style={{ color: record.transactionType === 1 ? 'green' : 'red' }} >
                    {record.transactionType === 1 ? `₹ +${amount.toLocaleString()}` : `₹ -${amount.toLocaleString()}`}
                </span>
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (text: string, record: any) => (
                <>
                    <Button className='mx-3 p-0' type='text' icon={<Edit size={21} />} onClick={() => showModal(record)} />
                    <Popconfirm title="Are you sure?" onConfirm={() => handleDelete(record.id)}>
                        <Button type='text' danger icon={<Trash2 size={18} />} />
                    </Popconfirm>
                </>
            ),
        },
    ];
    return (
        <div style={{ padding: '8px 16px 16px 16px', backgroundColor: 'white' }}>
            <Col span={24}>
                <Row gutter={24} className='d-flex flex-row justify-content-between mb-3'>
                    <Col span={16}>
                        <Breadcrumb
                            items={[
                                {
                                    title: < HomeOutlined onClick={() => navigate('/')} />,
                                },
                                {
                                    title: 'Transactions ',
                                },
                            ]}
                        />
                    </Col>
                    <Col span={8} className='d-flex flex-row justify-content-between'>

                        <Statistic className='d-flex mx-2' valueStyle={{ fontSize: '14px' }} title='My Wallet  : ₹' value={UserWallet} formatter={formatter} />
                        <Statistic className='d-flex' valueStyle={{ fontSize: '14px' }} title='Incomes  : ₹' value={totalIncome} formatter={formatter} />

                        <Statistic className='d-flex' valueStyle={{ fontSize: '14px' }} title='Expenses  : ₹' value={totalExpenses} formatter={formatter} />

                    </Col>
                </Row>
                <Row gutter={24} className='d-flex flex-row'>


                    <Col span={3}>
                        <Button className='main-buttons' type="primary" onClick={() => showModal()}>Add Record</Button>
                    </Col>

                    <Col span={21} >

                        <Row className='d-flex flex-row ' justify={'space-between'} gutter={24}  >

                            <Col span={5} className='d-flex' >
                                <span className='align-content-center mx-2' style={{ width: '150px' }}> Sort by type:</span>
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

                            <Col span={5} className='d-flex'>
                                <span className='align-content-center mx-2' style={{ width: '90px' }}> Sort by :</span>
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
                                <span className='align-content-center' style={{ width: '100px' }}> Sort by date:</span>
                                <RangePicker
                                    onChange={handleDateRangeChange}
                                    value={selectedDateRange}
                                />
                            </Col>
                            <Col span={6}>
                                <Select
                                    mode="multiple"
                                    style={{ width: '100%' }}
                                    placeholder="Filter by categoryType"
                                    onChange={handlecategoryTypeChange}
                                    value={selectedCategories}
                                >
                                    {
                                        (transactiontransactionType === 'All'
                                            ? [...incomeCategories, ...expenseCategories]
                                            : transactiontransactionType === 'Income'
                                                ? incomeCategories
                                                : expenseCategories
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


            <hr className='mt-3' />
            <Table
                size='middle'

                dataSource={sortedTransactions}
                columns={columns}
                rowKey="id"
                scroll={{ y: 445 }}
                pagination={false}

            // footer={()=> [{
            //     title:'gajf',

            // }]}
            />
            <Modal
                style={{ width: '650px' }}
                title={editingTransaction ? 'Edit Record' : 'Add Record'}
                visible={isModalVisible}
                onCancel={handleCancel}
                footer={[
                ]}
            >
                <Form
                    form={form}
                    layout="vertical"
                    className='p-3 rounded'
                    style={{ maxWidth: '670px', backgroundColor: '' }}
                    onFinish={handleSubmit}
                    initialValues={formData || { categoryType: '', amount: 0, transactionType: 2, accountType: 1, currency: 'INR' }}
                >
                    <div className='d-flex justify-content-center pt-3' style={{ width: '100%' }}>
                        <Form.Item
                            name="transactionType"
                            rules={[{ required: true, message: 'Please select a transactiontype!' }]}
                            style={{ width: '75%' }}
                        >
                            <Radio.Group onChange={handleTypeChange} value={formData.transactionType} style={{ width: '100%' }}>
                                <Radio.Button value={1} className='text-center w-50' >Income</Radio.Button>
                                <Radio.Button value={2} className='text-center w-50'>Expense</Radio.Button>
                            </Radio.Group>
                        </Form.Item>
                    </div>
                    <div className='d-flex flex-row align-content-center'>
                        <div className='mx-2 w-50'>
                            <Form.Item
                                label="Account Type"
                                name="accountType"
                                rules={[{ required: true, message: 'Please select an account transactiontype!' }]}
                            >
                                <Select
                                    placeholder="Select account type"
                                    className='w-100'
                                    value={formData.accountType}
                                >
                                    {/* <Option value={1}>Cash</Option> */}
                                    <Option value={2}>Saving Account</Option>
                                    {/* <Option value={3}>General</Option> */}
                                    <Option value={4}>Credit Card</Option>
                                    <Option value={5}>Current Account</Option>
                                </Select>
                            </Form.Item>
                            <div className='d-flex flex-row justify-content-between'>
                                <Form.Item
                                    label="Amount"
                                    name="amount"
                                    rules={[{ required: true, message: 'Please enter an amount!' }]}
                                >
                                    <Input
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
                                <Form.Item
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
                                </Form.Item>
                            </div>
                            <Form.Item
                                label="CategoryType"
                                name="categoryType"
                                rules={[{ required: true, message: 'Please select a categorytype!' }]}
                            >
                                <Select
                                    placeholder="Select categorytype"
                                    className='w-100'
                                    labelInValue
                                >
                                    {(formData.transactionType === 2 ? expenseCategories : incomeCategories).map((categoryType) => (
                                        <Option key={categoryType.value} value={categoryType.value}>
                                            {getCategoryLabel(categoryType.value)}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </div>
                        <div className='w-50'>
                            <Form.Item
                                label="Label"
                                name="label"
                            >
                                <Input
                                    onInput={(e: any) => e.target.value = e.target.value.length > 1 ? e.target.value : e.target.value.toUpperCase()}
                                    placeholder="Enter label"
                                />
                            </Form.Item>
                            <Form.Item
                                label="Date"
                                name="date"
                                rules={[{ required: true, message: 'Please select a date!' }]}
                            >
                                <DatePicker
                                    className='w-100'
                                    picker='date'
                                    value={dayjs('2024-08-27', 'YYYY-MM-DD')}

                                />
                            </Form.Item>
                            <Form.Item
                                label="Time"
                                name="time"
                                rules={[{ required: true, message: 'Please select a time!' }]}
                                className='mb-5'
                            >
                                <DatePicker

                                    className='w-100'
                                    showTime={{ format: 'HH:mm' }}
                                    format="HH:mm"
                                    picker="time"
                                />
                            </Form.Item>
                        </div>
                    </div>
                    <div >
                        <Button type="primary" htmlType="submit" onClick={() => form.submit()} className='w-100'>

                            {editingTransaction ? <RotateCcw size={16} /> : <CirclePlus size={16} />}  {editingTransaction ? 'Update record' : 'Add record'}
                        </Button>
                        <Form.Item>
                            <Button type="link" htmlType="button" onClick={() => form.resetFields()} className='w-100 text-center'>
                                <CircleX size={16} />   Reset Form
                            </Button>
                        </Form.Item>
                    </div>
                </Form>
            </Modal>

        </div >
    );
};

export default TransactionList;
