import React, { useContext, useState } from 'react'
import UserContext from '../UserContext';
import { Button, Form, Input } from 'antd';
import { UserOutlined } from '@ant-design/icons';
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
        <div style={{ textAlign: 'center', marginTop: '13%', }}>
            <div>
                <img src='https://images.pond5.com/gold-coins-cartoon-style-are-footage-276090183_iconl.jpeg' style={{ borderRadius: '50%', height: '90px', width: '100px', }}></img>
            </div>
            <div style={{ fontFamily: 'open sans' }}>
                <b><h4 className='mt-4'>Set up your cash balance</h4></b>
            </div>
            <div>
                <h6 className='mt-4 ' style={{ fontSize: '12px', marginLeft: '-260px' }}>Cash balance</h6>
                <Input placeholder='0' style={{ width: '22%', borderRadius: 'px' }} onChange={handleChange} value={inputValue} ></Input>
                <p className='mt-2' style={{ fontSize: '12px', marginLeft: '-60px' }}>How much cash do you have  in your   physical wallet</p>

            </div>
            <Button className='mt-5' style={{ width: '23%', borderRadius: '19px', height: '37px', color: 'white', backgroundColor: '#37B7C3' }} onClick={onSave}>Confirm cash balance</Button>
        </div>
    )
}

export default Welcome