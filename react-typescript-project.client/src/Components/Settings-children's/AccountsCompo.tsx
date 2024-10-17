import React, { lazy, useContext, useEffect, useState } from 'react';
import { Layout, Input, Button, Table, Typography, Space, Divider, Modal, Select, Switch, Form, Spin, notification, Row, Col, Segmented, message, Dropdown, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined, MoreOutlined } from '@ant-design/icons';
import { Plus, Target } from 'lucide-react';
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

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loader, setLoader] = useState(false);
    const [editingAccount, setEditingAccount] = useState<AccountTypes | null | any>(null);
    const [accounts, setAccounts] = useState<AccountTypes[]>([]);
    const { UserId } = useContext<any>(UserContext);
    const [transactionData, setTransactionData] = useState<FormData[]>([])

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
                        message: editingAccount ? 'Transaction updated successfully' : 'Record added successfully',
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
                            message: editingAccount ? 'Transaction updated successfully' : 'Record added successfully',
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
        { label: 'SavingAccount', value: 2 },
        { label: 'General', value: 3 },
        { label: 'CreditCard', value: 4 },
        { label: 'SalaryAccount', value: 5 },
        { label: 'CurrentAccount', value: 6 },
    ];

    const getAccountLabel = (type: number) => {
        switch (type) {
            case 1: return "Cash";
            case 2: return "SavingAccount";
            case 3: return "General";
            case 4: return "CreditCard";
            case 5: return "SalaryAccount";
            case 6: return "CurrentAccount";
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

    const columns = [
        {
            title: 'Type',
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
            render: (text: any, record: any) => <span> {record.name}</span>
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


    const [bankNameInput, setBankNameInput] = useState<any>('');

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
                <Divider />


                <h6>Your accounts</h6>
                <Spin spinning={loader} size="large" />
                <Table
                    columns={columns}
                    dataSource={accounts}
                    pagination={false}
                    style={{ marginTop: '16px' }}
                    scroll={{ y: 360 }}
                    size='small'
                    rowKey="key"
                />
            </Content>


            <Modal
                title="Add Account"
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
                >
                    <Form.Item
                        name="name"
                        label="Name"


                        rules={[{ required: true, message: 'Please enter an account name' }]}
                    >
                        <Select
                            showSearch

                            optionFilterProp="label"
                            // onChange={onChange}
                            // onSearch={onSearch}
                            options={[
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
                            ]}
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

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            style={{ width: '100%' }}
                        >
                            {editingAccount ? "Update" : "Save"}
                        </Button>
                    </Form.Item>


                </Form>
            </Modal>
        </div>
    );
};

export default AccountsCompo;
