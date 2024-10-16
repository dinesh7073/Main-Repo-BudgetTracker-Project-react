import React, { useContext, useState } from 'react'
import UserContext from '../UserContext';
import { Button, Form, FormProps, Input, Segmented, Select, Space } from 'antd';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { REACT_APP_BASE_URL } from '../Components/Common/Url';

const Welcome = () => {
    const { userDetails, UserId } = useContext<any>(UserContext);
    const [inputValue, setInputValue] = useState();
    const navigate = useNavigate();

    const handleChange = (e: any) => {
        setInputValue(e.target.value);
    }

    const onSave = () => {
        const account = {
            userId: userDetails.id,
            bankName: 'Cash',
            accountType: 1,
            amount: inputValue
        }
        axios.post(`${REACT_APP_BASE_URL}AccountsController/${userDetails.id}CreateAccountsAndUpdate`, account).then((res) => {
            navigate('/dashboard');
            window.location.reload();
            console.log(res.data);
           
        }).catch((err) => console.log("error", err))


    }

    return (
        <div style={{ height: '' }}>

            <p className='mt-3' onClick={() => { navigate("/dashboard"); window.location.reload(); }}><p style={{ cursor: "pointer", color: "blue", fontSize: '15.5px', marginLeft: '94%', textDecorationLine: 'underline', }}>    Skip</p> </p>

            {/* <Button className=' ps-3 pe-3' onClick={() => { navigate('/dashboard'); window.location.reload(); }} style={{ marginLeft: '94%',  }}>Skip</Button> */}
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
                        <h4 className="mt-4">Set up your cash balance</h4>
                    </b>
                </div>
                <div>
                    <h6 className="mt-4" style={{ fontSize: '12px', marginLeft: '-260px' }}>
                        Cash balance
                    </h6>
                    {/* <Form.Item
                    
                    rules={[{ required: true, message: 'Please input!' }]}
                    
                   style={{ width: '22%', borderRadius: '5px', marginLeft:'39%'}}>
                     <Input   />


                    </Form.Item> */}

                    <Form>
                        <Form.Item name="email"

                            rules={[{ required: true, message: 'Please input your Input!' },

                            ]}
                            style={{ width: '22%', borderRadius: '5px', marginLeft: '39%' }} >
                            <Input />
                        </Form.Item>
                    </Form>

                    <p className="mt-2" style={{ fontSize: '12px', marginLeft: '-60px' }}>
                        How much cash do you have in your physical wallet?
                    </p>
                </div>
                <Button type='primary'
                    onClick={() => {
                        navigate('/dashboard');
                        window.location.reload();
                        // const htmlType="submit" 
                    }}
                    className="mt-5"
                    style={{ width: '23%', borderRadius: '19px', height: '37px', color: 'white',  }} >
                    Confirm Cash Balance
                </Button>


            </div>
        </div>
    );
};

export default Welcome;


