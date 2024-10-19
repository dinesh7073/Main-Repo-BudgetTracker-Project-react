import React, { useState, useRef } from 'react';
import { Form, Input, Button, notification, Spin } from 'antd';
import { LoadingOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import '../CSS/LoginSignUp.css';
import logo from '../images/logo.png';
import pic6 from '../images/pic6.png';
import { useNavigate } from 'react-router-dom';
import emailjs from '@emailjs/browser';
import '../CSS/ForgotPassword.css'
import axios from 'axios';
import { REACT_APP_BASE_URL } from '../Components/Common/Url';
const ForgotpassCompo = () => {
    const [form] = Form.useForm();
    const [loader, setLoader] = useState<boolean>(false);
    const [showForgotForm, setForgotForm] = useState<boolean>(true);
    const [showOTPForm, setOTPForm] = useState<boolean>(false);
    const [showResetForm, setResetForm] = useState<boolean>(false);
    const [otp, setOTP] = useState<any>();
    const [email, setEmail] = useState<string>('');
    const [emailError, setEmailError] = useState<string>('');
    const form1 = useRef<any>();
    const navigate = useNavigate();
    const [userId, setUserId] = useState<string>('');



    const sendEmail = (e: any) => {
        setLoader(true);
        let usermail = (e.target.user_email.value);
        console.log(usermail);

        let userobj = {
            id: "",
            userId: "",
            firstName: "",
            lastName: "",
            email: usermail,
            contact: "",
            password: "",
        }
        e.preventDefault();
        if (!email) {
            setEmailError('Please enter your email address.');
            return;
        }
        setEmailError('');

        axios.post(`${REACT_APP_BASE_URL}UsersController/SendOtp`, userobj).then((response) => {

            console.log("response", response.data.userId);
            setUserId(response.data.userId);
            setLoader(true);
            // emailjs
            //     .sendForm('service_0mfba1c', 'template_486kd9t', form1.current, {
            //         publicKey: 'EkPpgjpV27mSertJH',
            //     })
            //     .then(
            //         (res) => {
            //             setLoader(false);
            //             notification.success({
            //                 message: "Success! An OTP has been sent to your email."
            //             });
            //             setForgotForm(false);
            //             setOTPForm(true);
            //         },
            //         (error) => {
            //             setLoader(false);
            //             notification.error({
            //                 message: "Failed to send email. Please try again.",
            //             });
            //         }
            //     );

        }).catch((error) => {
            setLoader(false);

            if (error.response) {
                if (error.response.status === 404 && error.response.data === "User with the provided email does not exist.") {
                    notification.info({
                        message: "Account with the provided email does not exist!"
                    });
                } else {
                    notification.error({
                        message: error.response.data || "An error occurred. Please try again."
                    });
                }
            } else {
                notification.error({
                    message: "Failed to connect to the server. Please try again."
                });
            }

        });
        setLoader(false);

    };

    const handleOTPSubmit = (e: any) => {

        if (e.otp === "123456") {
            notification.success({ message: "OTP Verified!" });
            setOTPForm(false);
            setResetForm(true);
        } else {
            notification.error({ message: "Invalid OTP. Please try again." });
        }
    };


    const handlePasswordReset = (values: any) => {

        setLoader(true);
        let userobj = {
            id: userId,
            firstName: "",
            lastName: "",
            email: "",
            contact: "",
            password: values.password,
        }
        axios.post(`${REACT_APP_BASE_URL}UsersController/ResetPassword`, userobj)
            .then((response) => {
                notification.success({ message: "Password Reset Successful!" });
                navigate("/login");
                setLoader(false);
            })
            .catch((error) => {
                setLoader(false);
                if (error.response.status === 400 || error.response.data === "Previous password can't be use as new password, enter another password.") {
                    notification.info({
                        message: "Previous password can't be use as new password, enter another password."
                    });
                } else {
                    notification.error({
                        message: "An error occurred. Please try again."
                    });
                }
            });

        setLoader(false);
    };

    const handleEmailChange = (e: any) => {
        setEmail(e.target.value);
        if (e.target.value) {
            setEmailError("");
        }
    };


    const handleInputChange = (e: any) => {
        setOTP(e.target.value);
    };



    return (
        <div style={{ backgroundColor: '#EBF4F6' }}>
            <div style={{ width: '100%', height: '100%' }} className='login-signup-main-container'>
                <div style={{ width: '40%', backgroundColor: '#B1D9DB' }} className='formbackgroundimage'>
                    <div style={{ height: '100vh', width: '100%', position: 'relative' }}>
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
                        <div style={{ alignContent: 'center', alignItems: 'center', padding: '21% 14.5%', width: '77%', marginLeft: '12%' }}>
                            <h4 style={{ textAlign: 'left', marginBottom: '30px' }}>
                                {showForgotForm && "Forgot Password"}
                                {showOTPForm && "OTP Verification"}
                                {showResetForm && "Reset Password"}
                            </h4>

                            {/* Forgot Password Form */}
                            {showForgotForm && (
                                <>
                                    <form ref={form1} onSubmit={sendEmail} style={{ marginBottom: '18px', width: '100%' }}>
                                        <label htmlFor="email" style={{ display: 'block', marginBottom: '10px' }}>Enter the email address you used to register !</label>
                                        <div>

                                            <div style={{ marginBottom: '20px', display: 'flex' }}>
                                                <MailOutlined size={15} />
                                                <input
                                                    id="email"
                                                    type="email"
                                                    name="user_email"
                                                    placeholder="Enter your email to receive OTP"

                                                    style={{
                                                        width: '100%',
                                                        padding: '8px 5px 8px 10px',
                                                        border: 'none',
                                                        borderBottom: '1px solid #B8B8B8',
                                                        borderRadius: '0px',
                                                        outline: 'none',
                                                        boxShadow: 'none',
                                                    }}
                                                    // required
                                                    onChange={handleEmailChange}
                                                />
                                            </div>

                                            {emailError && (
                                                <div style={{ color: 'red', marginBottom: '10px' }}>
                                                    {emailError}
                                                </div>
                                            )}

                                        </div>
                                        <Spin spinning={loader} fullscreen size='large' indicator={<LoadingOutlined spin />} tip="Sending OTP..." />
                                        <input
                                            type="submit"
                                            value="Get Opt"
                                            style={{
                                                padding: '5px 20px',
                                                backgroundColor: '#37B7C3',
                                                color: '#fff',
                                                border: 'none',
                                                borderRadius: '15px',
                                                cursor: 'pointer',
                                                width: '100%',
                                            }}
                                        />
                                    </form>

                                    <p onClick={() => { navigate("/login") }} style={{ cursor: "pointer", color: "blue", fontSize: '15.5px', textDecoration: 'underline' }}>
                                        Back to login
                                    </p>
                                </>
                            )}

                            {/* OTP Form */}
                            {showOTPForm && (
                                <>

                                    <Form onFinish={handleOTPSubmit} style={{ marginBottom: '5px' }}>
                                        <label htmlFor="otp" style={{ display: 'block', marginBottom: '8px' }}>
                                            Enter OTP
                                        </label>
                                        <Form.Item

                                            name="otp"
                                            style={{ marginBottom: '18px' }}
                                            rules={[
                                                {
                                                    required: true,
                                                    message: 'Please input your OTP!'
                                                },
                                                {
                                                    len: 6,
                                                    message: 'OTP must be exactly 6 digits!',
                                                },
                                                {
                                                    pattern: /^[0-9]*$/,
                                                    message: 'OTP must be numeric!',
                                                },
                                            ]}
                                        >
                                            <Input.OTP
                                                id="otp"
                                                value={otp}
                                                onChange={handleInputChange}
                                                style={{
                                                    width: '100%',
                                                    padding: '10px 0px 15px 0px',
                                                    border: 'none',
                                                    // borderBottom: '1px solid #B8B8B8',
                                                    borderRadius: '0px',
                                                    outline: 'none',
                                                    boxShadow: 'none',
                                                }}
                                            />
                                        </Form.Item>
                                        <Spin spinning={loader} fullscreen size='large' indicator={<LoadingOutlined spin />} tip="Sending OTP..." />

                                        <Button block type="primary" htmlType="submit" style={{ borderRadius: '15px', backgroundColor: '#37B7C3' }}>
                                            Verify OTP
                                        </Button>
                                    </Form>

                                    <p onClick={() => { navigate("/forgotPassword") }} style={{ cursor: "pointer", color: "blue", fontSize: '15.5px', textDecoration: 'underline', float: 'right' }}>
                                        Resend OTP
                                    </p>

                                </>
                            )}

                            {/* Reset Password Form */}
                            {showResetForm && (
                                <>
                                    <Form form={form}
                                        onFinish={handlePasswordReset}
                                        layout="vertical"
                                        requiredMark={false}
                                    >
                                        <Form.Item

                                            label="Password"
                                            name="password"
                                            rules={[{ required: true, message: 'Password is required' }, { min: 8, message: 'Password must be at least 8 characters!' }]}>
                                            <Input.Password style={{ border: 'none', borderBottom: '1px solid #B8B8B8', borderRadius: '0px' }} prefix={<LockOutlined />} placeholder="Password" />
                                        </Form.Item>

                                        <Form.Item
                                            label="Confirm Password"
                                            name="confirmPassword"
                                            dependencies={['password']}
                                            rules={[
                                                { required: true, message: 'Please confirm your password!' },
                                                ({ getFieldValue }) => ({
                                                    validator(_, value) {
                                                        if (!value || getFieldValue('password') === value) {
                                                            return Promise.resolve();
                                                        }
                                                        return Promise.reject(new Error('Passwords do not match!'));
                                                    },
                                                }),
                                            ]}>
                                            <Input.Password style={{ border: 'none', borderBottom: '1px solid #B8B8B8', borderRadius: '0px' }} prefix={<LockOutlined />} placeholder="Confirm Password" />
                                        </Form.Item>
                                        <Spin spinning={loader} fullscreen size='large' indicator={<LoadingOutlined spin />} tip="Sending OTP..." />

                                        <Button block type="primary" htmlType="submit" style={{ backgroundColor: '#37B7C3', borderRadius: '15px', marginTop: '3px' }}>
                                            Reset Password
                                        </Button>
                                    </Form>

                                    <p onClick={() => { navigate("/login") }} style={{ cursor: "pointer", color: "blue", fontSize: '15.5px', textDecoration: 'underline' }}>
                                        Back to login
                                    </p>

                                </>
                            )}

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotpassCompo;
