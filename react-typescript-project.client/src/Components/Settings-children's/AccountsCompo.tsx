import React, { lazy, useContext, useEffect, useState } from 'react';
import { Layout, Input, Button, Table, Typography, Space, Divider, Modal, Select, Switch, Form, Spin, notification } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
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


interface AccountTypes {
    id: string;
    userId: string;
    bankName: string;
    accountType: number;
    amount: number;
}

const AccountsCompo = () => {
    const [form] = Form.useForm();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loader, setLoader] = useState(false);
    const [editingAccount, setEditingAccount] = useState<AccountTypes | null>(null);

    const { UserId, accounts, setAccounts } = useContext<any>(UserContext);



    // useEffect(() => {
    //     setLoader(true)
    //     axios.get(`${REACT_APP_BASE_URL}AccountsController/${UserId}GetAccountsByUserId`).then((response) => {
    //         setAccounts(response.data);
    //         setLoader(false);
    //     }).catch(() => {
    //         setLoader(false);
    //     });
    // }, [])



    const onFinish = (values: AccountTypes) => {

        const amount = Number(values.amount);
        const userId = UserId;
        const apiURL = `${REACT_APP_BASE_URL}AccountsController/${UserId}CreateAccountsAndUpdate`

        const accountData = { ...values, amount, userId };

        if (editingAccount) {
            accountData.id = editingAccount.id;
        }
        
        axios.post(apiURL, accountData
        ).then(
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
    };

    const handleOpenModal = (account?: AccountTypes) => {

        if (account) {

            setEditingAccount(account);

            form.setFieldsValue({
                ...account,
                bankName: account.bankName,
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
        form.setFieldsValue({ bankName: bankNameInput });
        setIsModalOpen(true);
        setEditingAccount(null);
    };

    const handleCancel = () => {
        setEditingAccount(null);
        setIsModalOpen(false);
        form.resetFields();
    };
    const handleDelete = (id: any) => {

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

    };
    const accounttypes = [
        { label: 'Cash', value: 1 },
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
            title: 'BankName',
            dataIndex: 'bankName',
            key: 'bankName',
            render: (text: any, record: any) => <span> {record.bankName}</span>
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
                <Space size="middle">
                    <Button type="link" icon={<EditOutlined />} onClick={() => handleOpenModal(record)}>Edit</Button>
                    <Button type="link" icon={<DeleteOutlined />} danger onClick={() => handleDelete(record.id)}>Delete</Button>
                </Space>
            ),
        },
    ];


    const [bankNameInput, setBankNameInput] = useState<any>('');

    return (

        <div>
            <Spin spinning={loader} size="large" />

            <Content style={{ backgroundColor: '#fff', }}>

                <div style={{ marginBottom: '24px', display: 'flex', flexDirection: 'column' }}>

                    <Text strong>Add a new account</Text>
                    <Space.Compact className='w-25 mt-2'>
                        <Input placeholder='Account Name' onChange={(e) => setBankNameInput(e.target.value)} />
                        <Button type="primary" size='middle' className='m-0 px-2 py-3' onClick={showModal} > <Plus size={19} />Add</Button>
                    </Space.Compact>

                </div>
                <Divider />

                <Text strong>Your accounts</Text>
                <Table
                    columns={columns}
                    dataSource={accounts}
                    pagination={false}
                    style={{ marginTop: '16px' }}
                    size='small'
                    rowKey="key"
                />
            </Content>

            <Modal
                title="ADD ACCOUNT"
                open={isModalOpen}
                onCancel={handleCancel}
                footer={''}
            >
                <Form
                    requiredMark={false}
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    initialValues={{ accountType: 1, bankName: bankNameInput }}


                >
                    <Form.Item
                        name="bankName"
                        label="BankName"

                        rules={[{ required: true, message: 'Please enter the account name' }]}
                    >
                        <Input placeholder="Bank name"
                            onInput={(e: any) => e.target.value = e.target.value.length > 1 ? e.target.value : e.target.value.toUpperCase()} />
                    </Form.Item>

                    {/* <Form.Item name="color" label="Color">
                        <Select>
                            <Select.Option  value="teal">Teal</Select.Option>
                            <Select.Option value="blue">Blue</Select.Option>
                            <Select.Option value="green">Green</Select.Option>
                       
                        </Select>
                    </Form.Item> */}

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
                            style={{ width: '100%', backgroundColor: 'green' }}
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
