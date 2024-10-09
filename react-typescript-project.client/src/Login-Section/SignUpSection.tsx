import React, { useContext, useState } from 'react';
import { message, Form, Input, Button, Spin } from 'antd';
import UserContext from '../UserContext';
import axios from 'axios';
import { KeyOutlined, LockOutlined, MailOutlined, UserOutlined } from '@ant-design/icons';
import '../CSS/LoginSignUp.css';
import { useNavigate } from 'react-router-dom';
import logo from '../images/logo.png';
import pic6 from '../images/pic6.png';
import { REACT_APP_BASE_URL } from '../Components/Common/Url';


interface ISignUp {
    contact: any;
    firstName: string,
    lastName: string,
    email: string,
    password: string,

}

const SignUpSection = () => {
    const { setIsSignUp, setIsLogin, setUserDetails } = useContext<any>(UserContext);
    const [form] = Form.useForm();
    const [loader, setLoader] = useState<boolean>(false);

    const onSave = (values: ISignUp) => {
        setLoader(true);

        // const validate = ()=>{
        //     const contact = values.contact;
        //     if(contact.test())
        // }
        // form.validateFields({ validateOnly: true }).then(() => {
        const updatedData = {
            firstName: values.firstName,
            lastName: values.lastName,
            email: values.email,
            password: values.password,
            contact: values.contact
        }


        axios.post(
            `${REACT_APP_BASE_URL}UsersController/CreateUsersAndUpdate`,
            {
                firstName: updatedData.firstName,
                lastName: updatedData.lastName,
                email: updatedData.email,
                password: updatedData.password,
                contact: updatedData.contact
            }).then(
                (response: any) => {
                    setLoader(false);
                    setIsLogin(true);
                    navigate('/dashboard');
                    setUserDetails(response.data)
                    
                    console.log("UserId", response.data.id, "userData", response.data);
                    localStorage.setItem(
                        'isUser',
                        JSON.stringify(
                            {
                                // email: response?.data?.email,
                                // password: response?.data?.password,
                                UserId: response?.data?.id,
                                // FirstName: response?.data?.firstName,
                                // LastName: response?.data?.lastName,
                                // contact: response?.data?.contact
                            })
                    );
                    form.resetFields();

                }
            ).catch(

                (error) => {
                    console.log("error", error)
                    setLoader(false);
                }

            )
        // }).catch()

        form.resetFields();
    };

    const navigate = useNavigate();

    const onFinishFailed = (errorInfo: any) => {
        console.log('Validation failed:', errorInfo);
    };


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
                    <div style={{ width: '100%', height: '100%' }}>

                        <div style={{ width: '100%', alignContent: 'center', alignItems: 'center', padding: '4% 18%', height: "100vh" }}>
                            <Spin spinning={loader} fullscreen />
                            <Form
                                layout="vertical"
                                onFinish={onSave}
                                onFinishFailed={onFinishFailed}
                                form={form}
                                className='mx-auto  rounded  px-5  mt-3 '
                                style={{ width: "100%", height: '100%' }}
                                name='validateOnly'
                            >
                                <h4 className=' pt-3' style={{ fontWeight: '600' }}>Create Wallet Account</h4>
                                <p style={{ marginBottom: '35px', fontSize: '16px' }}>Sign up below to create your Wallet account</p>
                                <div style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginTop: '30px' }}>
                                    <Form.Item
                                        label="First name"
                                        name="firstName"
                                        style={{ width: '49%', height: '65px' }}
                                        rules={[{ required: true, message: 'First name is required' }
                                        ]}
                                    required={false}>
                                        <Input
                                            style={{ border: 'none', borderBottom: '1px solid #B8B8B8', borderRadius: '0px', outline: 'none', boxShadow: 'none' }}
                                            prefix={<UserOutlined />}
                                            placeholder="First name"
                                            onInput={(e: any) => e.target.value = e.target.value.length > 1 ? e.target.value : e.target.value.toUpperCase()}

                                        />
                                    </Form.Item>

                                    <Form.Item
                                        name="lastName"
                                        label="Last name"
                                        style={{ width: '49%', height: '65px' }}
                                        rules={[{ required: true, message: 'Last name is required' }]}
                                    required={false}>
                                        <Input
                                            style={{ border: 'none', borderBottom: '1px solid #B8B8B8', borderRadius: '0px', outline: 'none', boxShadow: 'none' }}
                                            prefix={<UserOutlined />}
                                            placeholder='Last name'
                                            onInput={(e: any) => e.target.value = e.target.value.length > 1 ? e.target.value : e.target.value.toUpperCase()}

                                        />
                                    </Form.Item>
                                </div>
                                <Form.Item
                                    label="Email"
                                    name="email"

                                    style={{ height: '65px' }}
                                    rules={[{ required: true, message: 'Email is required' },
                                    {
                                        type: "email",
                                        message: 'Enter a valid email'
                                    }
                                    ]}
                                required={false}>
                                    <Input style={{ border: 'none', borderBottom: '1px solid #B8B8B8', borderRadius: '0px', outline: 'none', boxShadow: 'none' }} prefix={<MailOutlined />} placeholder="Email" />
                                </Form.Item>
                                <Form.Item
                                    label="Contact"
                                    name="contact"
                                    style={{ height: '65px' }}
                                    rules={[{ required: true, message: 'Contact is required' },
                                        {
                                            pattern:RegExp("[1-9]{1}[0-9]{9}"),
                                            message:'Invalid input',
                                            validateTrigger:'onFinish'
                                        }
                                    ]}

                                required={false}>
                                    <Input style={{ border: 'none', borderBottom: '1px solid #B8B8B8', borderRadius: '0px', outline: 'none', boxShadow: 'none' }} prefix="+91 " placeholder="Contact" maxLength={10} />

                                </Form.Item>
                                <Form.Item
                                    label="Password"
                                    name="password"
                                    style={{ height: '65px' }}
                                    rules={[{ required: true, message: 'Password is required' }, {  min: 8, validateTrigger:'onFinish', message:'Password must be at least 8 characters!'}]}
                               required={false} >
                                    <Input.Password style={{ border: 'none', borderBottom: '1px solid #B8B8B8', borderRadius: '0px', outline: 'none', boxShadow: 'none' }} prefix={<LockOutlined />} type="password" placeholder="Password" />
                                </Form.Item>
                                <Form.Item
                                    label="Confirm Password"
                                    name="confirmPassword"
                                    dependencies={['password']}
                                    rules={[
                                       
                                        ({ getFieldValue }) => ({
                                            validator(_, value) {
                                                if (!value || getFieldValue('password') === value) {
                                                    return Promise.resolve();
                                                }
                                                return Promise.reject(new Error('The new password that you entered do not match!'));
                                            },
                                        }),
                                    ]}
                                    style={{ height: '65px' }}
                                >
                                    <Input style={{ border: 'none', borderBottom: '1px solid #B8B8B8', borderRadius: '0px', outline: 'none', boxShadow: 'none' }}  type='password' prefix={<LockOutlined />} placeholder="Confirm Password" />
                                </Form.Item>

                                <Form.Item>
                                    <Button block type="primary" htmlType="submit" style={{ borderRadius: '15px', backgroundColor: '#37B7C3' }}>
                                        Sign Up
                                    </Button>
                                    <div className='d-flex '>
                                    <p style={{ marginTop: '3px' }} >Already have an account? </p>
                                    
                                    <p   onClick={() => { setIsSignUp(false); navigate('/login'); }} style={{ cursor: "pointer", color: "blue", fontSize: '13px', textDecorationLine: 'underline' }} className='signup-text mt-1 ms-1'> Login</p> 
                                    </div>
                                </Form.Item>
                            </Form>

                        </div>


                    </div>
                </div>
            </div>
        </div>
    )
}

export default SignUpSection