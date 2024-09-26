import React, { useState } from 'react';
import { Form, Input, Button } from 'antd';
import { MailOutlined } from '@ant-design/icons';
import '../CSS/LoginSignUp.css';
import logo from '../images/logo.png';
import pic6 from '../images/pic6.png';
import { useNavigate } from 'react-router-dom';


interface ISignUp {
    contact: any;
    firstName: string,
    lastName: string,
    email: string,
    password: string,

}
interface ILogin {
    email: string,
    password: string,
}


const ForgotpassCompo = () => {

    const [form] = Form.useForm();
    const [inputValue, setInputValue] = useState('');
    const navigate = useNavigate(); 



    return (
        <div style={{ backgroundColor: '#EBF4F6' }}>
            <div style={{ width: '100%', height: '100%' }} className='login-signup-main-container'>
                <div style={{ width: '40%', backgroundColor: '#B1D9DB' }} className='formbackgroundimage'>
                    <div style={{ height: '100vh', width: '100%', position: 'relative' }}>
                        {/* <span onClick={handleHomeNavigation}><HomeOutlined /></span> */}
                        <div style={{ width: '29%', padding: '10px 0px 10px 45px' }}>
                            <img style={{ width: '100%', height: '100%' }} src={logo} alt="" />
                        </div>
                        <div style={{ width: '100%', height: '180px', padding: '30px 20px 0px 55px', alignContent: 'center', }}>
                            <h1 style={{ fontWeight: '600', color: '#071952', fontFamily: 'sans-serif' }}>
                                Track your spending, <br />secure your future.
                            </h1>
                        </div>
                        <div style={{ position: 'absolute' }}>
                            <img style={{ width: '540px', height: '495px', marginLeft: '10px', marginTop: '-10px' }} src={pic6} alt="" />
                        </div>

                    </div>
                </div>
                

                <div style={{ width: '61%', backgroundColor: '#FFFFFF', borderTopLeftRadius: '55px', borderBottomLeftRadius: '55px' }}>
                    <div style={{ width: '100%', minHeight: '100vh' }}>
                        <div style={{  alignContent: 'center', alignItems: 'center', padding: '15% 18%', width:'80%', marginLeft:'12%' }}>

                            <h3 style={{ textAlign: 'center' }}>Forgot Password</h3>

                            <Form.Item
                                label="E-mail"
                                name="email"
                                // style={{ marginBottom: '18px' }}    
                                rules={[{ required: true, message: 'Please input your email!' },
                                {
                                    type: 'email',
                                    message: 'Enter a valid email'
                                }
                                ]}
                            />
                            <Input style={{ border: 'none', borderBottom: '1px solid #B8B8B8', borderRadius: '0px', outline: 'none', boxShadow: 'none' }} prefix={<MailOutlined />} placeholder="Email" />


                            <Button block type="primary" htmlType="submit" style={{ backgroundColor: '#37B7C3', borderRadius: '15px', marginTop: '60px', }}>     Submit        </Button>
                                
                           
                        <Button  style={{color:'#B1D9DB',left:'1%', backgroundColor:'#FFFFFF', top:'20px'}} onClick={() => navigate('/login')} size="large" >Back to Login</Button>
                        </div>
                        
                    </div>
                </div>
            </div>
        </div>
    )
}
export default ForgotpassCompo;

