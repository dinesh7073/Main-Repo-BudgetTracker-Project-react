import React, { useContext, useState } from 'react';
import { message, Form, Input, Button, Spin } from 'antd';
import UserContext from '../UserContext';
import axios from 'axios';
import { LockOutlined, MailOutlined } from '@ant-design/icons';
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
interface ILogin {
    email: string,
    password: string,
}


const LoginCompo = () => {



    const [form] = Form.useForm();
    const { setIsLogin, setUserDetails, setIsSignUp } = useContext<any>(UserContext);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: ''
    })
    const [inputValue, setInputValue] = useState('');
    const [loader, setLoader] = useState<boolean>(false);




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
    // Frogot password ......................................................................................................




    const navigate = useNavigate();
    const onLogin = (values: ILogin) => {
        setLoader(true);

        axios.post(`${REACT_APP_BASE_URL}UsersController/Login`, {
            UserName: values.email,
            password: values.password
        })
            .then((response) => {


                if (response.data.id) {

                    localStorage.setItem('isUser', JSON.stringify(
                        {
                            // email: response?.data?.email,
                            UserId: response?.data?.id,
                            // FirstName: response?.data?.firstName,

                        }));

                    setUserDetails({ ...setUserDetails, userData: response.data })

                    setIsLogin(true);
                    setLoader(false)
                    navigate('/');
                    message.success('Login successful!');
                } else {
                    setLoader(false);
                    message.error(response.request.error);
                }
                form.resetFields();
            })
            .catch((error) => {
                setLoader(false);
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

                        <div style={{ width: '100%', alignContent: 'center', alignItems: 'center', padding: '15% 18%' }}>
                            <div style={{ height: '100%', width: '100%' }}>
                                <Spin spinning={loader} fullscreen />
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
                                        label="Email"
                                        name="email"

                                        rules={[{ required: true, message: 'Please input your email!' },
                                        {
                                            type: 'email',
                                            message: 'Enter a valid email'
                                        }
                                        ]}
                                        required={false} >
                                        <Input style={{ border: 'none', borderBottom: '1px solid #B8B8B8', borderRadius: '0px', outline: 'none', boxShadow: 'none' }} prefix={<MailOutlined />} placeholder="Email" />
                                    </Form.Item>

                                    <Form.Item
                                        label="Password"
                                        name="password"
                                       rules={[
                                            { required: true, message: 'Please input your password!' },
                                            
                                           
                                            //  {
                                            //         pattern: /^(?=.*[!@#$%^&*])/,
                                            //         message: 'Password must contain at least one special character!',
                                            //     },
                                        ]}    required={false}>

                                        <Input.Password style={{ border: 'none', borderBottom: '1px solid #B8B8B8', borderRadius: '0px', outline: 'none', boxShadow: 'none' }} prefix={<LockOutlined />} type="password" placeholder="Password" />
                                    </Form.Item>

                                    <Form.Item>
                                        
                                        <Button block type="primary" htmlType="submit" style={{ backgroundColor: '#37B7C3', borderRadius: '15px' }}>
                                          
                                            Log in
                                        </Button>

                                        <div style={{ display: 'flex', justifyContent: 'space-between', width: '430px' }}>

                                            <div>
                                                <p style={{ marginTop: '3px', }} >Don't have an account?</p>
                                           
                                            </div>
                                            <div style={{marginRight:'120px', marginTop:'3px'}}><p onClick={() => { setIsSignUp(true); navigate('/signup'); }} style={{ cursor: "pointer", color: "blue", fontSize: '13.5px', textDecorationLine: 'underline', }} className='signup-text'> SignUp</p> </div>

                                            <div>
                                                <p style={{ marginTop: '3px', }} onClick={() => { navigate("/forgotPassword") }}><p style={{ cursor: "pointer", color: "blue", fontSize: '13.5px', textDecorationLine: 'underline', }} className='signup-text'> Forgot Password</p> </p>



                                                {/* <p style={{ marginTop: '3px' }} onClick={() => { setIsSignUp(true); navigate('/forgot'); }}>Don't have account?<b style={{ cursor: "pointer", color: "blue", fontSize: '13.5px', textDecorationLine: 'underline' }} className='signup-text'> forgot</b> </p> */}

                                            </div>
                                        </div>
                                    </Form.Item>

                                </Form>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}
export default LoginCompo;

//Email required is removed and signup or forgot password text not bold
//Email (lable) replace by Email only
// the password take min latter 8
//fogot password the bact button is not
// E-mail => Email (NOt'-')
