import React, { useState, useEffect, useContext } from 'react';
import { Form, Input, Button, DatePicker, Radio, Select, notification, List, Modal, Popconfirm, Calendar, Breadcrumb, Statistic, StatisticProps, Row, Col } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { Zap, ShoppingBag, Home, Car, Edit, Trash2, AlertCircle, Briefcase, DollarSign, HelpCircle, Laptop } from 'lucide-react';
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
import { TransactionType } from '../Components/Common/App';

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
    const { setTransactionData, userDetails } = useContext<TransactionType[]>(UserContext);
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

        axios.get(`https://localhost:7054/TransactionsController/66d80221687308a6498e5854GetTransactionsByUserId`)
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
                categoryType: getCategoryLabel(transaction.categoryType),
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
        const apiUrl = `https://localhost:7007/BudgetTracker/${userId}CreateTransactionsAndUpdate`;

        const transactionData = { ...values, amount, userId };
        if (editingTransaction) {
            transactionData.id = editingTransaction.id;
        }
        axios.post(apiUrl, transactionData)
            .then((response) => {
                console.log("userId", UserId);
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
        axios.post(`https://localhost:7007/BudgetTracker/${id}DeleteTransaction`)
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

    return (
        <div style={{ padding: '16px', backgroundColor: 'white' }}>
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
            <Row className='d-flex justify-content-between mt-1 mb-2'  >
                <Col>
                    <Button className='main-buttons' type="primary" onClick={() => showModal()}>Add Record</Button>
                </Col>
                <Col >
                    <Statistic className='d-flex' valueStyle={{ fontSize: '14px' }} title='My Wallet  : ₹' value={UserWallet} formatter={formatter} />
                    <Statistic className='d-flex' valueStyle={{ fontSize: '14px' }} title='Incomes  : ₹' value={totalIncome} formatter={formatter} />
                    <Statistic className='d-flex' valueStyle={{ fontSize: '14px' }} title='Incomes  : ₹' value={totalExpenses} formatter={formatter} />
                </Col>
            </Row>
            <Row className='d-flex flex-wrap' gutter={[16, { xs: 8, sm: 16, md: 24, lg: 32 }]} justify="space-between" >
                <Col span={4} className='d-flex' >
                    <span style={{ width: '100px' }}> Sort by - </span>

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
                <Col span={3}>
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
                <Col span={8}>
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

            <hr className='mt-3' />
            <List
                style={{ overflowY: 'scroll', height: '435px', scrollbarWidth: 'thin' }}
                itemLayout="horizontal"
                dataSource={sortedTransactions}
                renderItem={item => (
                    <List.Item
                        className="py-1.2 list-hover-style" style={{ lineHeight: '0' }}
                        actions={[
                            <Button icon={<Edit />} onClick={() => showModal(item)} />,
                            <Popconfirm title="Are you sure?" onConfirm={() => handleDelete(item.id)}>
                                <Button danger icon={<Trash2 />} />
                            </Popconfirm>
                        ]}
                    >
                        <List.Item.Meta
                            avatar={getCategoryTypeIcon(item.categoryType)}
                            title={getCategoryLabel(item.categoryType)}
                            description={
                                <Row className="d-flex justify-content-between align-items-center" >
                                    <Col>{item.label} | {getAccountName(item.accountType)} | {dayjs(item.date).format('DD/MM/YYYY')}</Col>
                                    <Col style={{ fontWeight: '', color: item.transactionType === 1 ? 'green' : 'red' }}>
                                        {item.transactionType === 1 ? `+${item.amount?.toLocaleString()}` : `-${item.amount?.toLocaleString()}`}
                                    </Col>
                                </Row>
                            }
                        />
                    </List.Item>
                )}
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
                    style={{ maxWidth: '650px', margin: 'auto', backgroundColor: '#E8F7FF', padding: '20px', borderRadius: '10px', }}
                    onFinish={handleSubmit}
                    initialValues={formData || { categoryType: '', amount: 0, transactionType: 2, accountType: 1, currency: 'INR' }}
                >
                    <div style={{ display: 'flex', justifyContent: 'center', width: '100%', paddingTop: '20px' }}>
                        <Form.Item
                            name="transactionType"
                            rules={[{ required: true, message: 'Please select a transactionType!' }]}
                            style={{ width: '75%' }}
                        >
                            <Radio.Group onChange={handleTypeChange} value={formData.transactionType} style={{ width: '100%' }}>
                                <Radio.Button value={1} style={{ width: '50%', textAlign: 'center' }}>Income</Radio.Button>
                                <Radio.Button value={2} style={{ width: '50%', textAlign: "center" }}>Expense</Radio.Button>
                            </Radio.Group>
                        </Form.Item>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'row', alignContent: 'center' }}>
                        <div style={{ width: '49%', marginRight: '2%' }}>
                            <Form.Item
                                label="Account Type"
                                name="accountType"
                                rules={[{ required: true, message: 'Please select an account transactionType!' }]}
                            >
                                <Select
                                    placeholder="Select account type"
                                    style={{ width: '100%' }}
                                    value={formData.accountType}
                                >
                                    <Option value={1}>Cash</Option>
                                    <Option value={2}>Saving Account</Option>
                                    <Option value={3}>General</Option>
                                    <Option value={4}>Credit Card</Option>
                                    <Option value={5}>Current Account</Option>
                                </Select>
                            </Form.Item>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Form.Item
                                    label="Amount"
                                    name="amount"
                                    rules={[{ required: true, message: 'Please enter an amount!' }]}
                                >
                                    <Input
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
                                    rules={[{ required: true, message: 'Please select a currency!' }]}
                                >
                                    <Select
                                        placeholder="INR"
                                        value="INR"
                                        style={{ width: '100%' }}
                                    >
                                        <Option value="INR">INR</Option>
                                    </Select>
                                </Form.Item>
                            </div>
                            <Form.Item
                                label="CategoryType"
                                name="categoryType"
                                rules={[{ required: true, message: 'Please select a categoryType!' }]}
                            >
                                <Select
                                    placeholder="Select categorytype"
                                    style={{ width: '100%' }}
                                >
                                    {(formData.transactionType === 2 ? expenseCategories : incomeCategories).map((categoryType) => (
                                        <Option key={categoryType.value} value={categoryType.value}>
                                            {getCategoryLabel(categoryType.value)}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </div>
                        <div style={{ width: '49%' }}>
                            <Form.Item
                                label="Label"
                                name="label"
                            >
                                <Input
                                    placeholder="Enter label"
                                />
                            </Form.Item>
                            <Form.Item
                                label="Date"
                                name="date"
                                rules={[{ required: true, message: 'Please select a date!' }]}
                            >
                                <DatePicker
                                    style={{ width: '100%' }}
                                    picker='date'
                                    value={dayjs('2024-08-27', 'YYYY-MM-DD')}

                                />
                            </Form.Item>
                            <Form.Item
                                label="Time"
                                name="time"
                                rules={[{ required: true, message: 'Please select a time!' }]}
                                style={{ marginBottom: '55px' }}
                            >
                                <DatePicker

                                    style={{ width: '100%' }}
                                    showTime={{ format: 'HH:mm' }}
                                    format="HH:mm"
                                    picker="time"
                                />
                            </Form.Item>
                        </div>
                    </div>
                    <div >
                        <Button type="primary" htmlType="submit" onClick={() => form.submit()} style={{ width: '100%' }}>
                            {editingTransaction ? 'Update record' : 'Add record'}
                        </Button>
                        <Form.Item>
                            <Button type="link" htmlType="button" onClick={() => form.resetFields()} style={{ width: '100%', textAlign: 'center' }}>
                                Reset Form
                            </Button>
                        </Form.Item>
                    </div>
                </Form>
            </Modal>

        </div >
    );
};

export default TransactionList;
