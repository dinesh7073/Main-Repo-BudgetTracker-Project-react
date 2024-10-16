import React, { useContext, useState } from 'react';
import UserContext from '../UserContext';
import { Button, Form, FormProps, Input, Segmented, Select, Space } from 'antd';
import { useNavigate } from 'react-router-dom';

// const Demo: React.FC = () => {

//     const [formData, setFormData] = useState({
//         transactionType: 2,
//         categoryType: null,
//         accountType: null,
//     });



//     const handleTypeChange = (value: any) => {
//         setFormData((prevData) => ({
//             ...prevData,
//             transactionType: value,
//             categoryType: null,
//             accountType: null,
//         }));
//     };

//     const selectAfter = (
//         <Select defaultValue=" ">
//             <option value=""></option>
//             <option value=''></option>

//         </Select>
//     );

//     return (
//         <div style={{}}>


{/* <div style={{ marginTop: '5px' }}>

                <div style={{ width: '11%', marginLeft: '44%', }}>
                    <Segmented options={[{ label: 'Cash', value: 1 }, { label: 'Bank', value: 2 },]}

                        onChange={handleTypeChange}
                        value={formData.transactionType}
                        style={{  backgroundColor: '#F3F4FA', border: '1px solid lightgrey', marginTop:'50px'}} block />
                </div> */}

{/* {formData.transactionType === 1 ? (
                <div style={{ textAlign: 'center', marginTop: '13%' }}>

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
                        <Input placeholder="0" style={{ width: '22%', borderRadius: '5px' }} />
                        <p className="mt-2" style={{ fontSize: '12px', marginLeft: '-60px' }}>
                            How much cash do you have in your physical wallet?
                        </p>
                    </div>
                    <Button
                        onClick={() => {
                            navigate('/dashboard');
                            window.location.reload();
                        }}
                        className="mt-5"
                        style={{ width: '23%', borderRadius: '19px', height: '37px', color: 'white', backgroundColor: '#37B7C3' }} >
                        Confirm Cash Balance
                    </Button>


                </div>
            ) : (
                <div style={{ textAlign: 'center', marginTop: '13%' }}>





                    <div className="mt-4">
                        <img
                            src="https://st4.depositphotos.com/20523700/25947/i/450/depositphotos_259477098-stock-photo-illustration-bank-icon.jpg"
                            alt="Coins"
                            style={{ borderRadius: '50%', height: '90px', width: '100px' }}
                        />


                    </div>
                    <div style={{ fontFamily: 'Open Sans' }}>
                        <b>
                            <h4 className="mt-4">Set up your bank balance</h4>
                        </b>
                    </div>
                    <div>
                        <h6 className="mt-4" style={{ fontSize: '12px', marginLeft: '-260px' }}>
                            Bank balance
                        </h6>
                        <Input addonAfter={selectAfter} defaultValue="" placeholder="0" style={{ width: '22%', borderRadius: '5px' }} />


                        {/* <Space direction="vertical"> <Input  addonAfter={selectAfter} defaultValue="mysite"/></Space> */}

//     <p className="mt-2" style={{ fontSize: '12px', marginLeft: '-60px' }}>
//         How much cash do you have in your physical wallet?
//     </p>
// </div>
// <Button
//     onClick={() => {
//         navigate('/dashboard');
//         window.location.reload();
//     }}
//     className="mt-5"
//     style={{ width: '23%', borderRadius: '19px', height: '37px', color: 'white', backgroundColor: '#37B7C3' }} >
//     Confirm Bank Balance
// </Button>



// </div>
// )}
// </div>

// </div >
// );
// }; */}

const Welcome = () => {
    //   const { setIswelcome } = useContext(UserContext);
    const navigate = useNavigate();
    

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


