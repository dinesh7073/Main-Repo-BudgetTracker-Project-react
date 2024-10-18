import React, { useContext, useEffect, useState } from 'react'
import UserContext from '../UserContext';
import { Button, Form, Input, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { REACT_APP_BASE_URL } from '../Components/Common/Url';
import Dashboard from '../Components/Dashboard';

const Welcome = () => {
   
    const [form] = Form.useForm(); // Create form instance
    const {userDetails,setLoader , setIsLogin, setBalanceExists} = useContext<any>(UserContext);
    const navigate = useNavigate();


    const onSave = (value:any) => {

        const userId = userDetails?.id;
        console.log(value.amount)
        const accountdata = {
            userId : userId,
            name: 'Cash',
            accountType: 1,
            amount: value.amount == null ? 0 : Number(value.amount)
        }
        
        axios.post(`https://localhost:7054/AccountsController/${userId}CreateAccountsAndUpdate`, accountdata).then((res) => {

            
            navigate("/dashboard");
            setLoader(true);
            setIsLogin(true);
            setBalanceExists(true);
            localStorage.setItem(
                'isUser',
                JSON.stringify(
                    {
                        // email: response?.data?.email,
                        // password: response?.data?.password,
                        UserId: userDetails.id
                        // FirstName: response?.data?.firstName,
                        // LastName: response?.data?.lastName,
                        // contact: response?.data?.contact
                    })
            );
            //  window.location.reload();
            // setAccounts(res.data);
           
        }).catch((err) => {
            setLoader(false);
            console.log("error", err,)})

        }

    return (
        <div style={{ height: '' }}>
            <div className='mt-3' onClick={()=>onSave(0)}>
                <p style={{ cursor: "pointer", color: "blue", fontSize: '15.5px', marginLeft: '94%', textDecorationLine: 'underline', }}>Skip</p>
            </div>

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
                <Form 
                form={form} 
                onFinish={onSave}
                >
                    <p  className='mt-4' style={{marginLeft:'-16.4%',}}>Cash Balance</p>
                    <Form.Item name="amount" 
                    rules={[{ required: true, message: 'Please input your cash amount!' },
                        // {
                        //     // pattern: RegExp("[1-9]{1}[0-9]{9}"),
                        //     message: 'Invalid input',
                        //     validateTrigger: 'onFinish',
                            
                        // }



                    ]} style={{ width: '22%', marginLeft: '39%' }}>
                        <Input placeholder="Enter cash amount" type='number'/>
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
