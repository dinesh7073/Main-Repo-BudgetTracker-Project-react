import React, { useContext } from 'react'
import UserContext from '../UserContext';
import { Button, Form, Input } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const Welcome = () => {
    const { setIswelcome,} = useContext<any>(UserContext);

    const navigate = useNavigate();
    
    return (
        <div style={{textAlign:'center',marginTop:'13%',}}>
            <div>
                <img src='https://images.pond5.com/gold-coins-cartoon-style-are-footage-276090183_iconl.jpeg' style={{ borderRadius:'50%',  height: '90px', width: '100px', }}></img>
            </div>
            <div  style={{fontFamily:'open sans'}}>
                <b><h4 className='mt-4'>Set up Your cash balance</h4></b>
            </div>
            <div>
            <h6 className='mt-4 ' style={{fontSize:'12px',marginLeft:'-260px'}}>Cash balance</h6>
       
            
                <Input placeholder='0' style={{width:'22%', borderRadius:'px' }} ></Input>
                <p className='mt-2' style={{fontSize:'12px', color:'#41BF00',marginLeft:'-60px'}}>How much cash do you have  in your   physical wallet</p>
         
           </div>
           <Button  onClick={() => {navigate('/dashboard'); window.location.reload(); }} className='mt-5' style={{width:'23%', borderRadius:'19px', height:'37px' ,color:'white',backgroundColor:'#41BF00'}}>Confirm Cash balance</Button>
        </div>
    )
}

export default Welcome