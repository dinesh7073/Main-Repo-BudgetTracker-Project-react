import React, { useContext, useState } from 'react';
import { message, Form, Input, Button } from 'antd';
import UserContext from '../UserContext';
import axios from 'axios';
import { LockOutlined, MailOutlined, UserOutlined } from '@ant-design/icons';
import '../CSS/LoginSignUp.css';
import { useNavigate } from 'react-router-dom';
import logo from '../images/logo.png';
import pic6 from '../images/pic6.png';


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


const SignUpSection = () => {
    const { isSignUp, setIsSignUp } = useContext<any>(UserContext);
    const [form] = Form.useForm();
    const { setIsLogin, setUserDetails, userDetails } = useContext<any>(UserContext);
    const [inputValue, setInputValue] = useState('');

    // const handleHomeNavigation = () => {
    //     navigate('/home')
    // }

    const handleInputValue = (e: any) => {

        // const { name, value } = e.target;

        // const capitalizedValue = value.charAt(0).toUpperCase() + value.slice(1);

        // form.setFieldsValue({
        //     [name]: capitalizedValue
        // });

        // setFormData(prevData => ({
        //     ...prevData,
        //     [name]: capitalizedValue,
        // }));
        const value = e.target.value;
        return setInputValue(value.charAt(0).toUpperCase() + value.slice(1));
    }

    const onSave = (values: ISignUp) => {

        const updatedData = {
            firstName: values.firstName,
            lastName: values.lastName,
            email: values.email,
            password: values.password,
            contact: values.contact
        }

        console.log(inputValue);
        axios.post(
            `https://localhost:7054/BudgetTracker/CreateUsersAndUpdate`,
            {
                firstName: updatedData.firstName,
                lastName: updatedData.lastName,
                email: updatedData.email,
                password: updatedData.password,
                contact: updatedData.contact
            }).then(
                (response: any) => {
                    setIsLogin(true);
                    navigate('/');
                    setUserDetails({ UserId: response.data.id, userData: response.data })
                    console.log("UserId", response.data.id, "userData", response.data);
                    localStorage.setItem(
                        'isUser',
                        JSON.stringify(
                            {
                                email: response?.data?.email,
                                password: response?.data?.password,
                                UserId: response?.data?.id,
                                FirstName: response?.data?.firstName,
                                LastName: response?.data?.lastName,
                                contact: response?.data?.contact
                            })
                    );
                    form.resetFields();

                }
            ).catch(

                (error) => console.log("error", error)
            )
        form.resetFields();
    };

    const navigate = useNavigate();
    const onLogin = (values: ILogin) => {
        axios.post("https://localhost:7054/UsersController/Login", {
            UserName: values.email,
            password: values.password
        })
            .then((response) => {

                if (response.data.id) {

                    localStorage.setItem('isUser', JSON.stringify(
                        {
                            email: response?.data?.email,
                            password: response?.data?.password,
                            UserId: response?.data?.id,
                            FirstName: response?.data?.firstName,
                            contact: response?.data?.contact
                        }));

                    setUserDetails({ ...userDetails, userData: response.data })
                    setIsLogin(true);
                    navigate('/');
                    message.success('Login successful!');
                } else {
                    message.error(response.request.error);
                }
                form.resetFields();
            })
            .catch((error) => {
                message.error('password or mail is incorrect');
                console.error('Error fetching data:', error);
            });
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
                    <div style={{ width: '100%', minHeight: '100vh' }}>
                        {isSignUp ? (
                            <div style={{ width: '100%', alignContent: 'center', alignItems: 'center', padding: '4% 18%' }}>
                                <Form
                                    layout="vertical"
                                    onFinish={onSave}
                                    form={form}
                                    className='mx-auto  rounded  px-5 py-2 mt-3'
                                    style={{ width: "100%" }}
                                >
                                    <h4 className=' pt-3' style={{ fontWeight: '600' }}>Create Wallet Account</h4>
                                    <p style={{ marginBottom: '40px' }}>Sign up below to create your Wallet account</p>
                                    <div style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginTop: '30px' }}>
                                        <Form.Item
                                            label="Firstname"
                                            name="firstName"
                                            style={{ width: '49%', marginBottom: '18px' }}
                                            rules={[{ required: true, message: 'Please input your firstname!' }
                                            ]}
                                        >
                                            <Input
                                                style={{ border: 'none', borderBottom: '1px solid #B8B8B8', borderRadius: '0px', outline: 'none', boxShadow: 'none' }}
                                                prefix={<UserOutlined />}
                                                placeholder="FirstName"
                                                value={inputValue}
                                                onInput={(e: any) => e.target.value = e.target.value.length > 1 ? e.target.value : e.target.value.toUpperCase()}
                                                onChange={handleInputValue}
                                            />
                                        </Form.Item>

                                        <Form.Item
                                            name="lastName"
                                            label="Lastname"
                                            style={{ width: '49%', marginBottom: '18px' }}
                                            rules={[{ required: true, message: 'Please input your lastname!' }]}
                                        >
                                            <Input
                                                style={{ border: 'none', borderBottom: '1px solid #B8B8B8', borderRadius: '0px', outline: 'none', boxShadow: 'none' }}
                                                prefix={<UserOutlined />}
                                                placeholder='LastName'
                                                onInput={(e: any) => e.target.value = e.target.value.length > 1 ? e.target.value : e.target.value.toUpperCase()}
                                            // value={inputValue}
                                            //  onChange={()=>handleInputValue}
                                            />
                                        </Form.Item>
                                    </div>
                                    <Form.Item
                                        label="E-mail"
                                        name="email"

                                        style={{ marginBottom: '18px' }}
                                        rules={[{ required: true, message: 'Please input your email!' },
                                        {
                                            type: "email",
                                            message: 'Enter a valid email'
                                        }
                                        ]}
                                    >
                                        <Input style={{ border: 'none', borderBottom: '1px solid #B8B8B8', borderRadius: '0px', outline: 'none', boxShadow: 'none' }} prefix={<MailOutlined />} placeholder="Email" />
                                    </Form.Item>
                                    <Form.Item
                                        label="Contact"
                                        name="contact"
                                        style={{ marginBottom: '18px' }}
                                        rules={[{ required: true, message: 'Please input your contact!' },
                                        {
                                            pattern: RegExp("[1-9]{1}[0-9]{9}"),
                                            message: "Invalid Input"
                                        }

                                        ]}
                                    >
                                        <Input style={{ border: 'none', borderBottom: '1px solid #B8B8B8', borderRadius: '0px', outline: 'none', boxShadow: 'none' }} prefix="+91 " placeholder="Contact" max={10} />
                                    </Form.Item>
                                    <Form.Item
                                        label="Password"
                                        name="password"
                                        style={{ marginBottom: '18px' }}
                                        rules={[{ required: true, message: 'Please input your Password!' }]}
                                    >
                                        <Input style={{ border: 'none', borderBottom: '1px solid #B8B8B8', borderRadius: '0px', outline: 'none', boxShadow: 'none' }} prefix={<LockOutlined />} type="password" placeholder="Password" />
                                    </Form.Item>
                                    <Form.Item
                                        label="Confirm Password"
                                        name="confirmPassword"
                                        dependencies={['password']}
                                        rules={[
                                            {
                                                required: true,
                                            },
                                            ({ getFieldValue }) => ({
                                                validator(_, value) {
                                                    if (!value || getFieldValue('password') === value) {
                                                        return Promise.resolve();
                                                    }
                                                    return Promise.reject(new Error('The new password that you entered do not match!'));
                                                },
                                            }),
                                        ]}
                                    >
                                        <Input style={{ border: 'none', borderBottom: '1px solid #B8B8B8', borderRadius: '0px', outline: 'none', boxShadow: 'none' }} type='password' />
                                    </Form.Item>

                                    <Form.Item>
                                        <Button block type="primary" htmlType="submit" style={{ borderRadius: '15px', backgroundColor: '#37B7C3' }}>
                                            Sign Up
                                        </Button>
                                        <p style={{ marginTop: '3px' }} onClick={() => { setIsSignUp(false); navigate('/login'); }}>Already have an account? <b style={{ cursor: "pointer", color: "blue", fontSize: '13.5px', textDecorationLine: 'underline' }} className='signup-text'> Login</b> </p>
                                    </Form.Item>
                                </Form>

                            </div>
                        ) :
                            (
                                <div style={{ width: '100%', alignContent: 'center', alignItems: 'center', padding: '15% 18%' }}>
                                    <div style={{ height: '100%', width: '100%' }}>
                                        <Form
                                            layout="vertical"
                                            onFinish={onLogin}
                                            form={form}
                                            // initialValues={editingExpense || { date: '', category: '', amount: 0, type: 'Cash' }}
                                            className='mx-auto  rounded  px-5 py-4  my-4'
                                            style={{ width: "35vw", boxShadow: 'none' }}
                                        >
                                            <h4 className=' p-2 '>Login</h4>
                                            <Form.Item
                                                label="E-mail"
                                                name="email"

                                                rules={[{ required: true, message: 'Please input your email!' },
                                                {
                                                    type: 'email',
                                                    message: 'Enter a valid email'
                                                }
                                                ]}
                                            >
                                                <Input style={{ border: 'none', borderBottom: '1px solid #B8B8B8', borderRadius: '0px', outline: 'none', boxShadow: 'none' }} prefix={<MailOutlined />} placeholder="Email" />
                                            </Form.Item>

                                            <Form.Item
                                                label="Password"
                                                name="password"
                                                rules={[{ required: true, message: 'Please input your Password!' }]}
                                            >
                                                <Input style={{ border: 'none', borderBottom: '1px solid #B8B8B8', borderRadius: '0px', outline: 'none', boxShadow: 'none' }} prefix={<LockOutlined />} type="password" placeholder="Password" />
                                            </Form.Item>
                                            <Form.Item>
                                                <Button block type="primary" htmlType="submit" style={{ backgroundColor: '#37B7C3', borderRadius: '15px' }}>
                                                    Log in
                                                </Button>
                                                <p style={{ marginTop: '3px' }} onClick={() => { setIsSignUp(true); navigate('/signup'); }}>Don't have account?<b style={{ cursor: "pointer", color: "blue", fontSize: '13.5px', textDecorationLine: 'underline' }} className='signup-text'> SignUp</b> </p>
                                            </Form.Item>
                                        </Form>
                                    </div>
                                </div>
                            )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SignUpSection