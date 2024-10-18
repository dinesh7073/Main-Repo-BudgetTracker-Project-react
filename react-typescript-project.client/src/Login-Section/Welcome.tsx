import React, { useContext, useEffect, useState } from 'react'
import UserContext from '../UserContext';
import { Button, Form, Input, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { REACT_APP_BASE_URL } from '../Components/Common/Url';
import Dashboard from '../Components/Dashboard';

const Welcome = () => {
   
    const [form] = Form.useForm(); // Create form instance
    const {userDetails,setLoader } = useContext<any>(UserContext);
    const [inputValue, setInputValue] = useState();
    const navigate = useNavigate();

    const handleChange = (q:any) =>{
        setInputValue(q.target.value);
    }

    const onSave = () => {

        const userId = userDetails?.id;

        const accountdata = {
            userId : userId,
            name: 'Cash',
            accountType: 1,
            amount: inputValue == null ? 0 : Number(inputValue)
        }
        
        axios.post(`https://localhost:7054/AccountsController/${userId}CreateAccountsAndUpdate`, accountdata).then((res) => {
            navigate("/dashboard");
            setLoader(true);
            window.location.reload();
            // setAccounts(res.data);
           
        }).catch((err) => {
            setLoader(false);
            console.log("error", err,)})

        }

    return (
        <div style={{ height: '' }}>
            <div className='mt-3' onClick={onSave}>
                <p style={{ cursor: "pointer", color: "blue", fontSize: '15.5px', marginLeft: '94%', textDecorationLine: 'underline', }}>Skip</p>
            </div>

            <div style={{ textAlign: 'center', marginTop: '11%' }}>
                <div className="mt-4">
                    <img
                        src="https://cdn-icons-png.flaticon.com/512/1578/1578656.png"
                        alt="Coins"
                        style={{ borderRadius: '50%', height: '90px', width: '100px' }}
                    />
                </div>
                <div style={{ fontFamily: 'Open Sans' }}>
                    <b>
                        <h4 className="mt-4"><b>Set up your cash balance</b></h4>
                    </b>
                </div>
                {/* <p   className='mt-5'  style={{marginLeft:'-16.6%', fontSize:'13px'}}>Cash Balance</p> */}
                <Form 
                form={form} 
                onFinish={onSave}
                >
                   <p   className='mt-5'  style={{marginLeft:'-16.6%', fontSize:'13px'}}>Cash Balance</p>
                    <Form.Item name="amount" 
                    rules={[{ required: true, message: 'Please input your cash amount!' },
                        // {
                        //     // pattern: RegExp("[1-9]{1}[0-9]{9}"),
                        //     message: 'Invalid input',
                        //     validateTrigger: 'onFinish',
                            
                        // }



                    ]} style={{ width: '22%', marginLeft: '38.9%' }}>
                        <Input placeholder="Enter cash amount" type='number' value={inputValue} onChange={handleChange}/>
                        {/* <p className='me-5'  style={{ fontSize:'13px'}}>How much cash do you have in your physical wllet</p> */}
                    </Form.Item>

                    <Button
                        type="primary"
                        htmlType="submit"
                        className="mt-3"
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
