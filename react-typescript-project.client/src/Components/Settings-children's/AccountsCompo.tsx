import React, { useContext, useEffect, useState } from 'react';
import { Layout, Input, Button, Table, Typography, Space, Divider, Modal, Select, Switch, Form, Spin, notification, Row, Col, Segmented, message, Dropdown, Popconfirm, Card, List } from 'antd';
import { EditOutlined, DeleteOutlined, MoreOutlined, SaveOutlined } from '@ant-design/icons';
import { Plus, RotateCcw, Target } from 'lucide-react';
import { color } from '@mui/system';
import axios from 'axios';
import { REACT_APP_BASE_URL } from '../Common/Url';
import UserContext from '../../UserContext';
import { Utils } from '../Common/Utilities/Utils';
import { FaCoins } from "react-icons/fa";
import { MdSavings } from "react-icons/md";
import { MdAccountBalanceWallet } from "react-icons/md";
import { FaCreditCard } from "react-icons/fa6";
import { MdAccountBalance } from "react-icons/md";
import { GiReceiveMoney } from "react-icons/gi";
import dayjs from 'dayjs';
import EChartsReact from "echarts-for-react";


const { Content } = Layout;
const { Text } = Typography;

import { FormData } from '../../Lists/TransactionList';
export interface AccountTypes {
    id: string;
    userId: string;
    name: string;
    accountType: number;
    amount: number;
}

const AccountsCompo = () => {
    const [form] = Form.useForm();
    const [expandedRowKey, setExpandedRowKey] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loader, setLoader] = useState(false);
    const [editingAccount, setEditingAccount] = useState<AccountTypes | null | any>(null);
    const [accounts, setAccounts] = useState<AccountTypes[]>([]);
    const { UserId } = useContext<any>(UserContext);
    const [transactionData, setTransactionData] = useState<FormData[]>([])
    const [filteredTransaction, setFilteredTransaction] = useState<any>([]);


    const transformData = (records: FormData[]): FormData[] => {
        return records.map((transactions) => ({
            ...transactions,
        }));
    }

    useEffect(() => {

        setLoader(true)
        axios.get(`${REACT_APP_BASE_URL}AccountsController/${UserId}GetAccountsByUserId`).then((response) => {
            setAccounts(response.data);
            setLoader(false);
        }).catch(() => {
            setLoader(false);
        });

        axios.get(`${REACT_APP_BASE_URL}TransactionsController/${UserId}GetTransactionsByUserId`)
            .then((res) => {
                if (res.status === 200) {
                    const transformedRecords = transformData(res.data);
                    setTransactionData(transformedRecords.map(record => ({
                        ...record,
                        amount: Number(record.amount),
                    })));

                    setLoader(false);
                }
            })
            .catch((err) => {
                console.log("Error from server", err);
                setLoader(false)
            });

    }, [])


    // useEffect(() => {
    //     transactionData
    //     console.log(transactionData);

    // }, [transactionData.length > 0])

    const onFinish = (values: AccountTypes) => {

        if (editingAccount != null) {
            const amount = Number(values.amount);
            const userId = UserId;
            const apiURL = `${REACT_APP_BASE_URL}AccountsController/${UserId}CreateAccountsAndUpdate`
            const accountData = { ...values, amount, userId };

            if (editingAccount) {
                accountData.id = editingAccount.id;
            }
            axios.post(apiURL, accountData).then(
                (response) => {
                    const updatedRecords = editingAccount
                        ? accounts.map((record: { id: string; }) => record.id === editingAccount.id ? { ...record, ...response.data } : record)
                        : [...accounts, response.data];

                    setAccounts(updatedRecords);
                    notification.success({
                        message: editingAccount ? 'Account updated successfully' : 'Account added successfully',
                    });
                }
            );
            setIsModalOpen(false);
            form.resetFields();
        } else {

            const filteracc = accounts.filter((acc: AccountTypes) => (acc.name === values.name && acc.accountType === values.accountType))
            if (filteracc.length != 0) {
                notification.info({
                    message: 'Account with same name & type already exists'
                })
            } else {
                const amount = Number(values.amount);
                const userId = UserId;
                const apiURL = `${REACT_APP_BASE_URL}AccountsController/${UserId}CreateAccountsAndUpdate`
                const accountData = { ...values, amount, userId };

                if (editingAccount) {
                    accountData.id = editingAccount.id;
                }
                axios.post(apiURL, accountData).then(
                    (response) => {
                        const updatedRecords = editingAccount
                            ? accounts.map((record: { id: string; }) => record.id === editingAccount.id ? { ...record, ...response.data } : record)
                            : [...accounts, response.data];

                        setAccounts(updatedRecords);
                        notification.success({
                            message: editingAccount ? 'Account updated successfully' : 'Account added successfully',
                        });
                    }
                );
                setIsModalOpen(false);
                form.resetFields();
            }


        }
    };

    const handleOpenModal = (account?: AccountTypes) => {

        if (account) {

            setEditingAccount(account);

            form.setFieldsValue({
                ...account,
                name: account.name,
                accounType: {
                    label: getAccountLabel(account.accountType),
                    value: account.accountType
                },
                amount: account.amount,
            });

        } else {
            setEditingAccount(null);
            form.resetFields();
        }
        setIsModalOpen(true);
    };


    const showModal = () => {
        form.setFieldsValue({ name: bankNameInput });
        setIsModalOpen(true);
        setEditingAccount(null);
    };

    const handleCancel = () => {
        setEditingAccount(null);
        setIsModalOpen(false);
        form.resetFields();
    };

    const handleDelete = (id: any, acc: any) => {

        const associatedTransaction = transactionData.filter((t: any) => t.accountType === acc.accountType);

        if (associatedTransaction.length > 0) {
            notification.info({
                message: 'Account cannot be deleted because transactions are already exists!'
            })
        } else {
            axios.post(`${REACT_APP_BASE_URL}AccountsController/${id}DeleteAccount`)
                .then((response) => {
                    const updatedRecords = accounts.filter((record: { id: any; }) => record.id !== id);
                    setAccounts(updatedRecords);
                    notification.success({ message: response.data.message || 'Account deleted successfully' });
                })
                .catch(err => {
                    console.error('Delete error:', err);
                    notification.error({ message: 'Failed to delete account', description: err.message });
                });

        }

    };
    const accounttypes = [
        { label: 'Saving account', value: 2 },
        { label: 'General', value: 3 },
        { label: 'Credit card', value: 4 },
        { label: 'Salary account', value: 5 },
        { label: 'Current account', value: 6 },
    ];


    const getAccountLabel = (type: number | null) => {
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
            return bank.label
        }

        if (name == 'Cash') {
            return 'Cash'
        }

    }

    const [bankNameInput, setBankNameInput] = useState<any>('');

    const columns = [
        {
            title: 'Account Type',
            dataIndex: 'accountType',
            key: 'accountType',
            render: (text: any, accountType: any) => (
                <span className='d-flex flex-row'>
                    <span style={{ marginRight: '10px' }}>
                        {getAccountIcon(accountType.accountType)}
                    </span>
                    <span style={{ fontWeight: '500' }} >

                        {getAccountLabel(accountType.accountType)}
                    </span>
                </span>
            ),

        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: (text: any, record: any) => <span> {getBankName(record.name)}</span>
        },
        {
            title: 'Balance',
            dataIndex: 'balance',
            key: 'balance',
            render: (balance: any, record: any) => (
                <div>
                    <Text style={{ display: 'block' }}>₹{Utils.getFormattedNumber(record.amount)}</Text>
                </div>
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (text: any, record: any) => (
                // <Space size="middle">
                //     <Button type="link" icon={<EditOutlined />} onClick={() => handleOpenModal(record)}>Edit</Button>
                //     <Button type="link" icon={<DeleteOutlined />} danger onClick={() => handleDelete((record.id), record)}>Delete</Button>
                // </Space>
                <>
                    <Dropdown
                        menu={{
                            items: [
                                {
                                    className: 'px-3',
                                    label: <span onClick={() => handleOpenModal(record)}><EditOutlined size={15} /> Edit</span>,
                                    key: '0',
                                },
                                {
                                    label: <Popconfirm title="Are you sure?" onConfirm={() => handleDelete((record.id), record)}><span><DeleteOutlined size={15} /> Delete</span> </Popconfirm>,
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
        },
    ];

    const onRowClick = (record: any) => {
        console.log('Row clicked:', record);
    };


    const xData = (data: any) => {
        const accountTransaction = transactionData
            .filter((x) => x.accountType === data.accountType)
            .map((obj) => ({
                date: dayjs(obj.date)
            }));


        accountTransaction.sort((a, b) => {
            return a.date.isBefore(b.date) ? -1 : 1;
        })

        return accountTransaction.map((obj) => obj.date.format('DD/MM'));
    }

    const yData = (data: any) => {
        const accountTransaction = transactionData
            .filter((x) => x.accountType === data.accountType && data.name )
            .map((obj) => ({

                amount: obj.amount,
                date: dayjs(obj.date),
                transactionType: obj.transactionType,
                categoryType : obj.categoryType
            }));


        accountTransaction.sort((a, b) => {
            return a.date.isBefore(b.date) ? -1 : 1;
        });


        return accountTransaction;
    }

    const getCategoryLabel = (category: number | null) => {

        // const foundCategory = bothCustomCategory.find(item => item.value === category);
        // if (foundCategory) {
        //     return foundCategory.label;
        // }
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


    const getOption = (data: any) => {
    console.log(yData(data).map((obj) => getCategoryLabel(obj.categoryType)));
        return{
        xAxis: {
            type: 'category',
            data: xData(data)
        },
        yAxis: {
            type: 'value',
            // axisLabel: {
            //     formatter: function (value: any) {
            //         return value.toLocaleString();
                // }
            // }
        },
        tooltip: {
            trigger: 'axis',
            formatter: function (params: any) {
                const param = params[0]; 
                const value = param.data; 
                const transactiontype = value.transactionType; 
                const formattedValue =  Utils.getFormattedNumber(value);
                const color = transactiontype === 1 ? 'green' : 'red'; 
    
                return `
                    <div>
                        <span>Income</span><br />
                        <span>Expense</span><br />
                        <span style="color:${color}">${formattedValue}</span>
                    </div>
                `;
            }
        },
        series: [{
            // name: yData(data).map((obj) => getCategoryLabel(obj.categoryType)),
            name:'category',
            type: 'line',
            data: yData(data).map((obj) => obj.amount),
            symbol: 'none',
            lineStyle: {
                width: 2
            },
            emphasis: {
                focus: 'series',
                itemStyle: {
                    borderColor: '#fff',
                    borderWidth: 2
                },
                label: {
                    show: true
                },
                symbol: 'circle',
                symbolSize: 8
            }
        }]
    }};

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

      const accountCash = accounts.map((obj)=>(obj.accountType===1))

    return (

        <div>

            <Content style={{ backgroundColor: '#fff', height: '71vh' }}>

                <Row gutter={24}>

                    {/* <Text strong>Add a new account</Text> */}
                    {/* <Space.Compact className='w-25 mt-2'>
                        <Input placeholder='Account Name' onChange={(e) => setBankNameInput(e.target.value)} /> */}


                    <Col span={5}>
                        <Button type="primary" size='middle' className='m-0 px-2 py-3' onClick={showModal} > <Plus size={19} />Add Account</Button>
                    </Col>

                    {/* </Space.Compact> */}

                </Row>

                {/* <h6 className='mt-3'>Your accounts</h6> */}
                <Spin spinning={loader} size="large" />

                <Table

                    columns={columns}
                    dataSource={accounts}
                    pagination={false}
                    style={{ marginTop: '18px' }}
                    scroll={{ y: 360 }}
                    size="small"
                    rowKey="id"
                    onRow={(record) => ({
                        onClick: () => onRowClick(record),
                    })}
                    // expandIconColumnIndex={-1}
                    expandable={{
                        expandedRowRender: (record) => {

                            const AccountData = transactionData.filter((obj)=>obj.accountType === record.accountType)

                            return(
                            <Card style={{ width: '1200px', height: '400px', boxShadow: ' 0 0 10px rgba(0, 0, 0, 0.1) ', marginLeft: 'auto', marginRight: 'auto', }}>
                                <div className='d-flex flex-row px-3 my-2 justify-between ' style={{width:'800px'}}>
                                <h5 style={{fontSize:'16px',fontWeight:500,}}>Account balance</h5>
                                <h5 style={{fontSize:'16px',fontWeight:500}}>Balance : ₹{record.amount}</h5>
                                </div>
                                <div className='d-flex flex-row m-0 p-0'>
                                    <div style={{ width: '850px' }}>
                                        <EChartsReact
                                            option={getOption(record)}
                                            style={{ width: '100%', height: '350px',marginTop:'0' }}
                                        />
                                    </div>
                                    <Card  className='recordCard'>
                                        <h6>Records</h6>
                                        <List
                                            itemLayout="horizontal"
                                            dataSource={AccountData}

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
                                    </Card>
                                </div>
                            </Card>
                        )},
                        expandedRowKeys: expandedRowKey ? [expandedRowKey] : [],
                        onExpand: (expanded, record) => {
                            console.log('Row expanded:', expanded, record);
                            setExpandedRowKey(expanded ? record.id : null);
                        },
                    }}
                />

            </Content>


            <Modal
                title={editingAccount ? "Edit Account" : "Add Account"}
                open={isModalOpen}
                onCancel={handleCancel}
                footer={''}
                maskClosable={false}
            >
                <Form
                    requiredMark={false}
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    initialValues={{ accountType: 6, name: bankNameInput }}
                    style={{ maxWidth: '600px', margin: 'auto', padding: '20px 20px 0px 20px', borderRadius: '10px', }}
                >
                    <Form.Item
                        name="name"
                        label="Name"


                        rules={[{ required: true, message: 'Please enter an account name' }]}
                    >
                       
                        <Select
                            showSearch
                            optionFilterProp="label"
                            placeholder="ex: sbi,pnb etc..."
                            // onChange={onChange}
                            // onSearch={onSearch}

                            options={bankName}
                        />
                    </Form.Item>

                    {/* <Form.Item name="color" label="Color">
                        <Select>
                            <Select.Option  value="teal">Teal</Select.Option>
                            <Select.Option value="blue">Blue</Select.Option>
                            <Select.Option value="green">Green</Select.Option>
                        </Select>
                    </Form.Item> */}

                    {/* <Segmented options={['Cash', 'Bank']} block /> */}
                    <Form.Item
                        name="accountType"
                        label="Account Type"
                        rules={[{ required: true, message: 'Please select an accountType!' }]}>
                        <Select placeholder="Account type">
                            {accounttypes.map(a =>
                                <Select.Option value={a.value} >{a.label}</Select.Option>
                            )}
                        </Select>
                    </Form.Item>


                    <Form.Item
                        className='w-100'
                        label="Initial Amount"
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

                    <Form.Item className='w-100'>
                        <Button
                            type="primary"
                            htmlType="submit"
                            className=' text-center float-end ' style={{ width: '30%', marginBottom: '-20px' }}
                        >
                            {editingAccount ? <RotateCcw size={16} /> : <SaveOutlined size={16} />}  {editingAccount ? 'Update record' : 'Save Account'}
                        </Button>
                    </Form.Item>


                </Form>
            </Modal>
        </div>
    );
};

export default AccountsCompo;
