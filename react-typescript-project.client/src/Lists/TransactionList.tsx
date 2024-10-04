import React, { useState, useEffect, useContext } from 'react';
import { Form, Input, Button, DatePicker, Radio, Select, notification, List, Modal, Popconfirm, Calendar, Breadcrumb, Statistic, StatisticProps, Row, Col, Table, Tag, Segmented, DatePickerProps } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { Zap, ShoppingBag, Home, Car, Edit, Trash2, AlertCircle, Briefcase, DollarSign, HelpCircle, Laptop, RotateCcw, CirclePlus, CircleX, Plus } from 'lucide-react';
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
import { Utils } from '../Components/Common/Utilities/Utils';
import buddhistEra from 'dayjs/plugin/buddhistEra';
import en from 'antd/es/date-picker/locale/en_US';
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
dayjs.extend(buddhistEra);
const { Option } = Select;
const { RangePicker } = DatePicker;
interface FormData {
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
    date: null,
    time: null,
};


const transformData = (records: FormData[]): FormData[] => {
    return records.map((transactions) => ({
        ...transactions,
    }));
};

const TransactionList: React.FC = () => {


    const { setTransactionData, userDetails, expensesLimit, UserId, userWallet, setUserWallet } = useContext<any>(UserContext);
    const [formData, setFormData] = useState<FormData>(initialFormValues);
    const [form] = Form.useForm();
    const [records, setRecords] = useState<FormData[]>([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingTransaction, setEditingTransaction] = useState<FormData | null>(null);
    const [sorttransactionType, setSorttransactionType] = useState<'new' | 'old' | 'high' | 'low'>('new');
    const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
    const [selectedDateRange, setSelectedDateRange] = useState<[Dayjs, Dayjs] | null>(null);
    const [transactiontransactionType, setTransactiontransactionType] = useState<'Income' | 'Expense' | 'All'>('All');


    const navigate = useNavigate();


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
            case 2: return 'Saving Account';
            case 4: return 'Credit Card';
            case 5: return 'Current Account';
        }

    }
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

        if (expensesLimit < totalExpenses) {

            alert("You have reached the expenses limit!!")
            const amount = Number(values.amount);
            const userId = UserId;
            const categoryType = values.categoryType.value;
            const accountType = values.accountType.value;
            const apiUrl = `${REACT_APP_BASE_URL}TransactionsController/${UserId}CreateTransactionsAndUpdate`;



            const transactionData = { ...values, amount, userId, categoryType, accountType };

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


        } else {
            const amount = Number(values.amount);
            const userId = UserId;
            const categoryType = values.categoryType.value;
            const accountType = values.accountType.value;
            const apiUrl = `${REACT_APP_BASE_URL}TransactionsController/${UserId}CreateTransactionsAndUpdate`;



            const transactionData = { ...values, amount, userId, categoryType, accountType };
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

        }
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
            render: (categoryType: number) => getCategoryLabel(categoryType),

        },
        {
            title: 'Label',
            dataIndex: 'label',
            key: 'label',
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
            width: '12%',
            title: 'Actions',
            key: 'actions',
            render: (text: string, record: any) => (
                <>

                    <Button className='mx-0 p-0' type='text' icon={<Edit size={21} />} onClick={() => showModal(record)} />
                    <Popconfirm title="Are you sure?" onConfirm={() => handleDelete(record.id)}>
                        <Button type='text' danger icon={<Trash2 size={18} />} />
                    </Popconfirm>
                </>
            ),
        },
    ];


    const buddhistLocale: typeof en = {
        ...en,
        lang: {
            ...en.lang,
            fieldDateFormat: 'DD-MM-YYYY',
            fieldDateTimeFormat: 'DD-MM-YYYY  HH:mm',
            yearFormat: 'YYYY',
            cellYearFormat: 'YYYY',
        },
    };

    return (
        <div style={{ padding: '10px 16px 16px 16px', backgroundColor: 'white' }}>
            <Col span={24}>
                <Row gutter={24} className='d-flex flex-row justify-content-between mb-3'>
                    <Col span={14}>
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
                    <Col span={10} className='d-flex flex-row justify-content-between'>
                        <Statistic className='d-flex mx-1' valueStyle={{ fontSize: '14px', fontWeight: '500' }} title={<span style={{ color: 'goldenrod', marginRight: '5px', fontWeight: '500' }}>My Wallet : ₹ </span>} value={Utils.getFormattedNumber(userWallet)} />
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
                                <span className='align-content-center mx-2' style={{ width: '30px' }}>Type:</span>
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
                                <span className='align-content-center mx-2' style={{ width: '89px' }}>Sort by:</span>
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
                                <span className='align-content-center' style={{ width: '100px' }}>Filter by date:</span>
                                <RangePicker
                                    onChange={handleDateRangeChange}
                                    value={selectedDateRange}
                                />
                            </Col>
                            <Col span={8} className='d-flex'>
                                <span className='align-content-center' style={{ width: '130px' }}>Filter category:</span>
                                <Select
                                    mode="multiple"
                                    style={{ width: '100%' }}
                                    placeholder="Filter by category"
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


            <hr className='mt-2 mb-2' />
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
                                <Table.Summary.Cell index={0}><h6>Total</h6></Table.Summary.Cell>
                                <Table.Summary.Cell index={1}></Table.Summary.Cell>
                                <Table.Summary.Cell index={2}></Table.Summary.Cell>
                                <Table.Summary.Cell index={3}></Table.Summary.Cell>
                                <Table.Summary.Cell index={4}></Table.Summary.Cell>
                                <Table.Summary.Cell index={5}>
                                    <Statistic className='d-flex' valueStyle={{ fontSize: '15px', fontWeight: '500', marginLeft: '5px' }} title=' ₹ ' value={(Utils.getFormattedNumber(totalAmount))} />
                                </Table.Summary.Cell>
                                <Table.Summary.Cell index={6}></Table.Summary.Cell>
                            </Table.Summary.Row>
                        </Table.Summary>
                    )
                }}

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
                    initialValues={formData || { categoryType: '', amount: 0, transactionType: null, accountType: '', currency: 'INR' }}
                >
                    <div className='d-flex justify-content-center pt-3' style={{ width: '100%' }}>

                        <Form.Item
                            name="transactionType"
                            rules={[{ required: true, message: 'Please select a transactiontype!' }]}
                            style={{ width: '100%' }}
                        >

                            <Segmented size='middle' options={[
                                { label: 'Income', value: 1, },
                                { label: 'Expense', value: 2, },
                            ]}
                                onChange={handleTypeChange}
                                defaultValue={2}
                                value={formData.transactionType}
                                style={{ width: '100%', backgroundColor: '#F3F4FA' }}
                                block
                            />

                        </Form.Item>


                    </div>
                    <div className='d-flex flex-row align-content-center'>
                        <div className='mx-2 w-50'>
                            <Form.Item
                                label="Account Type"
                                name="accountType"
                                rules={[{ required: true, message: 'Please select a account type!' }]}
                            >
                                <Select
                                    placeholder="Select accounttype"
                                    className='w-100'
                                    labelInValue
                                >
                                    {(formData.transactionType === 2 ? expenseAccountType : incomeAccountType).map((accountType) => (
                                        <Option key={accountType.value} value={accountType.value}>
                                            {getAccountTypeLabel(accountType.value)}
                                        </Option>
                                    ))}

                                </Select>
                            </Form.Item>
                            <div className='d-flex flex-row justify-content-between'>
                                <Form.Item
                                    label="Amount"
                                    name="amount"
                                    rules={[{ required: true, message: 'Please enter an amount!' }]}
                                >
                                    <Input

                                        style={{ width: '95%' }}
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
                                label="Category"
                                name="categoryType"
                                rules={[{ required: true, message: 'Please select a category!' }]}
                            >
                                <Select
                                    placeholder="Select category"
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
                                rules={[{ required: true, message: 'Please select a date !' }]}
                            >
                                {/* <DatePicker
                                    className='w-100'
                                    picker='date'
                                    value={dayjs()}
                                    format={'DD-MM-YYYY'}

                                /> */}
                                <DatePicker
                                    className='w-100'
                                    defaultValue={dayjs()}
                                    showTime
                                    locale={buddhistLocale}
                                    value={dayjs()}

                                />
                            </Form.Item>
                            {/* <Form.Item
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
                            </Form.Item> */}

                        </div>
                    </div>
                    <div className=''>
                        <Form.Item className='d-flex flex-column'>
                            <Button type="dashed" htmlType="button" onClick={() => form.resetFields()} className=' text-center float-end mx-1' style={{ width: '30%' }}>
                                <CircleX size={16} />   Reset Form
                            </Button>
                            <Button type="primary" htmlType="submit" onClick={() => form.submit()} className='float-end' style={{ width: '30%' }}>

                                {editingTransaction ? <RotateCcw size={16} /> : <Plus size={16} />}  {editingTransaction ? 'Update record' : 'Add record'}
                            </Button>
                        </Form.Item>
                    </div>
                </Form>
            </Modal>

        </div >
    );
};

export default TransactionList;
