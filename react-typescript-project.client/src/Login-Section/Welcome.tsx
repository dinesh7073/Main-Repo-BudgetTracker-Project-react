import React, { useContext, useEffect, useState } from 'react'
import UserContext from '../UserContext';
import { Button, Form, Input, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { REACT_APP_BASE_URL } from '../Components/Common/Url';
import Dashboard from '../Components/Dashboard';

const Welcome = () => {
   
    const [form] = Form.useForm(); // Create form instance
    const { setAccounts, UserId,userDetails,setLoader ,setUserDetails} = useContext<any>(UserContext);
    const [inputValue, setInputValue] = useState();
    const navigate = useNavigate();

    const handleChange = (e: any) => {
        setInputValue(e.target.value);
    }

    
    const onSave = () => {

        const userId = userDetails?.id;

        const accountdata = {
            userId : userId,
            bankName: 'Cash',
            accountType: 1,
            amount: inputValue == null ? 0 : Number(inputValue)
        }
        axios.post(`https://localhost:7054/AccountsController/${userId}CreateAccountsAndUpdate`, accountdata).then((res) => {
            navigate('/');
            setLoader(true);
            window.location.reload();
            setAccounts(res.data);
           
        }).catch((err) => {
            setLoader(false);
            console.log("error", err,)})

        }
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
            <p className='mt-3' onClick={() => { navigate("/dashboard"); window.location.reload(); }}>
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
