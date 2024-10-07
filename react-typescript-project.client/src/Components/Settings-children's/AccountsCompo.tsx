import React, { useState } from 'react';
import { Layout, Input, Button, Table, Typography, Space, Divider, Modal, Select, Switch, Form } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Plus } from 'lucide-react';
import { color } from '@mui/system';

const { Content } = Layout;
const { Text } = Typography;

const initialAccounts = [
    { key: '1', type: 'bank', name: 'name', balance: '₹20,000.00', limit: '' },
    { key: '2', type: 'card', name: 'Dinesh Jangid', balance: '-₹20,000.00', limit: '₹25,000.00' },
    { key: '3', type: 'cash', name: 'Cash', balance: '₹20,000.00', limit: '' },
];

const AccountsCompo = () => {
    const [form] = Form.useForm();
    const [accounts, setAccounts] = useState(initialAccounts);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleChange = (field: string, value: string | number | boolean) => {
        setAccountData((prevData) => ({
            ...prevData,
            [field]: value,
        }));
    };
    const [accountData, setAccountData] = useState({
        name: '',
        color: 'teal',
        accountType: 'General',
        initialAmount: 0,
        currency: 'INR',
        excludeFromStats: false,
    });


    const onFinish = (values: any) => {
        // Here you can make an API call to save `values`
        // Example:
        // axios.post('/api/accounts', values).then(response => console.log(response));

        console.log('Form Values:', values);
        handleOk(); // Close modal
        form.resetFields(); // Reset form fields after submission
    };


    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleOk = () => {
        setIsModalOpen(false);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };
    const handleDelete = (key: any) => {
        setAccounts(accounts.filter(account => account.key !== key));
    };

    const columns = [
        {
            title: 'Type',
            dataIndex: 'type',
            key: 'type',
            render: (type: any) => (
                <span>
                    {/* {accountTypes[type].icon} */}
                </span>
            ),
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Balance',
            dataIndex: 'balance',
            key: 'balance',
            render: (balance: any, record: any) => (
                <div>
                    {balance}
                    {record.limit && <Text type="secondary" style={{ display: 'block' }}>Limit {record.limit}</Text>}
                </div>
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_: any, record: any) => (
                <Space size="middle">
                    <Button type="link" icon={<EditOutlined />} onClick={() => alert(`Edit ${record.name}`)}>Edit</Button>
                    <Button type="link" icon={<DeleteOutlined />} danger onClick={() => handleDelete(record.key)}>Delete</Button>
                </Space>
            ),
        },
    ];



    return (

        <div>

            <Content style={{ backgroundColor: '#fff', }}>

                <div style={{ marginBottom: '24px', display: 'flex', flexDirection: 'column' }}>

                    <Text strong>Add a new account</Text>

                    <Space.Compact className='w-25 mt-2'>
                        <Input defaultValue="" placeholder='Account Name' />
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
                    rowKey="key"
                />
            </Content>

            <Modal
                title="ADD ACCOUNT"
                open={isModalOpen}
                onCancel={handleCancel}
                footer={null}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    initialValues={{
                        color: 'teal',
                        accountType: 'General',
                        initialAmount: 0,
                        currency: 'INR',
                        excludeFromStats: false,
                    }}
                >
                    <Form.Item
                        name="name"
                        label="Name"

                        rules={[{ required: true, message: 'Please enter the account name' }]}
                    >
                        <Input placeholder="Account name"
                            onInput={(e: any) => e.target.value = e.target.value.length > 1 ? e.target.value : e.target.value.toUpperCase()} />
                    </Form.Item>

                    {/* <Form.Item name="color" label="Color">
                        <Select>
                            <Select.Option  value="teal">Teal</Select.Option>
                            <Select.Option value="blue">Blue</Select.Option>
                            <Select.Option value="green">Green</Select.Option>
                       
                        </Select>
                    </Form.Item> */}

                    <Form.Item name="accountType" label="Account type">
                        <Select>
                            <Select.Option value="General">General</Select.Option>
                            <Select.Option value="Savings">Savings</Select.Option>
                            <Select.Option value="Credit">Credit</Select.Option>
                            {/* Add other account types as needed */}
                        </Select>
                    </Form.Item>

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

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            style={{ width: '100%', backgroundColor: 'green', borderColor: 'green' }}
                        >
                            Save
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default AccountsCompo;
