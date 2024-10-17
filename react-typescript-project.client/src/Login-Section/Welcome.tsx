import React, { useContext, useState } from 'react';
import UserContext from '../UserContext';
import { Button, Form, Input, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { REACT_APP_BASE_URL } from '../Components/Common/Url';
import Dashboard from '../Components/Dashboard';

const Welcome = () => {
    const { userDetails, setUserDetails } = useContext<any>(UserContext); // Make sure to provide setter in context
    const [form] = Form.useForm(); // Create form instance
    const navigate = useNavigate();

    const onSave = (values: any) => {
        const account = {
            userId: userDetails.id,
            bankName: 'Cash',
            accountType: 1,
            amount: values.cashAmount, // Use form value
        };
        axios.post(`${REACT_APP_BASE_URL}AccountsController/${userDetails.id}CreateAccountsAndUpdate`, account)
            .then((res) => {
                navigate('/dashboard');
                console.log(res.data);
            })
            .catch((err) => console.log("error", err));
    };

    const ondata = (values: any) => {
        axios.post(`${REACT_APP_BASE_URL}UsersController/Login`, {
            UserName: values.email,
            password: values.password,
        }).then((response) => {
            if (response.data.id) {
                localStorage.setItem('isUser', JSON.stringify({
                    UserId: response.data.id,
                }));
                setUserDetails({ ...userDetails, userData: response.data });
                navigate('/dashboard');
                message.success(' successful!');
            }
        }).catch((error) => {
            message.error('password or email is incorrect');
            console.error('Error fetching data:', error);
        });
    };

    return (
        <div style={{ height: '' }}>
            <p className='mt-3' onClick={() => { navigate("/dashboard"); }}>
                <p style={{ cursor: "pointer", color: "blue", fontSize: '15.5px', marginLeft: '94%', textDecorationLine: 'underline', }}>Skip</p>
            </p>

            <div style={{ textAlign: 'center', marginTop: '11%' }}>
                <div className="mt-4">
                    <img
                        src="https://images.pond5.com/gold-coins-cartoon-style-are-footage-276090183_iconl.jpeg"
                        alt="Coins"
                        style={{ borderRadius: '50%', height: '90px', width: '100px' }}
                    />
                </div>
                <div style={{ fontFamily: 'Open Sans' }}>
                    <b>
                        <h4 className="mt-4"><b>Set up your cash balance</b></h4>
                    </b>
                </div>
                <Form form={form} onFinish={onSave}>
                    <p  className='mt-4' style={{marginLeft:'-16.4%',}}>Cash Balance</p>
                    <Form.Item name="bankName" rules={[{ required: true, message: 'Please input your cash amount!' },
                        // {
                        //     // pattern: RegExp("[1-9]{1}[0-9]{9}"),
                        //     message: 'Invalid input',
                        //     validateTrigger: 'onFinish',
                            
                        // }



                    ]} style={{ width: '22%', marginLeft: '39%' }}>
                        <Input placeholder="Enter cash amount" type='number' />
                    </Form.Item>

                    <Button
                        type="primary"
                        htmlType="submit"
                        className="mt-5"
                        style={{ width: '23%', borderRadius: '19px', height: '37px', color: 'white' }}
                    >
                        Confirm Cash Balance
                    </Button>
                </Form>
            </div>
        </div>
    );
};

export default Welcome;
