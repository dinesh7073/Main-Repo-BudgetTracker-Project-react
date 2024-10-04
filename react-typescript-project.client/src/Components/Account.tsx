import { Avatar, Breadcrumb, Button, Card, Col, Divider, Form, Input, Modal, notification, Row, Spin } from 'antd'
import { Edit, Rotate3D } from 'lucide-react'
import { useContext, useEffect, useState } from 'react'
import profile1 from '../images/profile1.png';
import UserContext from '../UserContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../CSS/ThemeColors.css'
import { REACT_APP_BASE_URL } from './Common/Url';
import { IoMdClose } from "react-icons/io";
import '../CSS/Account.css';
import { MailOutlined, PhoneOutlined, UserOutlined } from '@ant-design/icons';

interface ISignUp {
  id: string,
  firstName: string,
  lastName: string,
  email: string,
  contact: number,
  password: string
}

const Account = () => {

  const [visible, setVisible] = useState<boolean>(true);
  const { UserId, userDetails, setUserDetails } = useContext<any>(UserContext)

  const [profiledata, setProfiledata] = useState<ISignUp>({
    id: '',
    firstName: '',
    lastName: '',
    email: '',
    contact: 0,
    password: ''
  });

  const [editProfile, setEditProfile] = useState<ISignUp | null>(null);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loader, setLoader] = useState(false);

  const letter = userDetails.firstName.charAt(0) + userDetails.lastName.charAt(0);


  const onSave = (values: ISignUp) => {
    setLoader(true);
    console.log(userDetails);
    const profileData = { ...values, id: UserId, password:userDetails.password };

    if (editProfile) {
      profileData.id = editProfile.id;
    }

    axios.post(`${REACT_APP_BASE_URL}UsersController/CreateUsersAndUpdate`, profileData)
      .then((response) => {
        const updatedProfile = profileData;
        console.log(response.data);
        setUserDetails(updatedProfile);
        setLoader(false);
        notification.success({
          message: editProfile ? 'Profile created successfully' : 'Profile updated successfully'
        });
      })
      .catch((error) => {
        notification.error({
          message: 'Failed to save profile',
          description: error.message,
        });
      });

    setEditProfile(null);
   setVisible(!visible);
  };


  return (
    <div style={{ width: '100%', height: '87vh', overflow: 'hidden', }} >
      {/* <div className='p-10'>
<Breadcrumb
          items={[
            {
              title: < HomeOutlined onClick={() => navigate('/')} />,
            },
            {
              title: 'Account  ',
            },
          ]}
        />
</div> */}
      
      <Row gutter={18}>

        <Col xs={{ span: 10, offset: 0 }} lg={{ span: 10 }}>

          <Row gutter={18}>
            <Card style={{ width: '100%', height: '100%', background: '#ffffff', color: '#343131', fontSize: '15px', fontFamily: 'sans-serif', borderRadius: '10px', padding: '10px 0px' }} >
              {/* <Avatar icon={<UserOutlined />} size={150} style={{ marginLeft: '35%', color: 'gray', background: '#f3f4fa', marginTop: '10px' }} /> */}
        <div style={{  color: 'gray', background: '#f3f4fa', marginTop: '10px', fontSize:'50px', width:'150px', textAlign:'center',borderRadius:'50%', height:'150px',justifyContent:'center', paddingTop:'35px', margin:'0 auto'  }}>{letter}</div>
              <h3 className='text-center' style={{ fontWeight: 500, paddingTop: '12px' }} >{userDetails.firstName} {userDetails.lastName}</h3>
        
            </Card>
          </Row>
          <Row gutter={18} >



            <Card style={{ width: '100%', marginTop: '10px', height: '100%', }}>
              <p className='fw-100 fs-4 ms-4 pt-2'>User Details</p>
              <div className='d-flex justify-center' >


                <div className=' mt-2 pb-3'>
                  <Row gutter={24}>
                    <Col lg={{ span: 12 }} >
                      <Card className='d-flex justify-between ' style={{ width: '220px', height: '100px', background: '#f3f4fa' }}>
                        <div className='d-flex flex-row ' style={{ justifyContent: 'space-evenly' }}>
                          <p className='pe-2'><UserOutlined /></p>
                          <h6 style={{ fontSize: '16px', paddingTop: '1px' }}>First name</h6>

                        </div>
                        {/* <p style={{fontSize:'16px'}}>:</p> */}
                        <p style={{ fontSize: '16px' }}>{userDetails.firstName}</p>
                      </Card>
                    </Col>
                    <Col lg={{ span: 12 }}>
                      <Card className='d-flex justify-between' style={{ background: '#f3f4fa', width: '220px', height: '100px', }} >
                        <div className='d-flex justify-content-between'>
                          <p className='pe-2'><UserOutlined /></p>
                          <h6 style={{ fontSize: '16px', paddingTop: '1px' }}>Last name</h6>

                        </div>
                        <p className='' style={{ textAlign: "justify", fontSize: '16px' }}>{userDetails.lastName}</p>
                      </Card>
                    </Col>
                  </Row>
                  <Row gutter={24} >
                    <Col lg={{ span: 12 }}>
                      <Card className='d-flex text-justify justify-between mt-3' style={{ width: '220px', height: '100px', background: '#f3f4fa' }}>
                        <div className='d-flex '>
                          <p className='pe-2'><MailOutlined /></p>
                          <h6 style={{ fontSize: '16px', paddingTop: '1px' }}>Email</h6>

                        </div>
                        <p className='text-justify' style={{ fontSize: '16px' }}>{userDetails.email}</p>
                      </Card>
                    </Col>
                    <Col lg={{ span: 12 }}>
                      <Card className='d-flex   justify-between mt-3' style={{ width: '220px', height: '100px', background: '#f3f4fa' }}>
                        <div className='d-flex '>
                          <p className='pe-2'><PhoneOutlined style={{rotate:'90deg'}}/></p>
                          <h6 style={{ fontSize: '16px', paddingTop: '1px' }}> Contact</h6>

                        </div>
                        <p className='' style={{ textAlign: "justify" }}>{userDetails.contact} </p>
                      </Card>
                    </Col>
                  </Row>
                </div>
              </div>

            </Card>
          </Row>

          {/* <button onClick={handleLogout} className='btn btn-danger text-white pb-1 py-1 px-5 border-light float-end me-5'>Logout</button> */}

        </Col>
        <Col xs={{ span: 10, offset: 0 }} lg={{ span: 14 }}>
          <Card style={{ width: '100%', height: '100%', background: '#ffffff', position: 'relative', paddingLeft: '5px' }}>
            <Spin spinning={loader} />

            <Button style={{ position: 'absolute', right: '50px', top: '30px', cursor: 'pointer', fontSize: '18px' }} onClick={() => setVisible(!visible)}>  {visible ? <Edit /> : <IoMdClose />}  </Button>

            <Form
              layout="vertical"
              onFinish={onSave}
              form={form}
              className='mx-auto  rounded px-5  '
              style={{ width: "95%", top: '13%', position: 'absolute' }}
              requiredMark={false}
              initialValues={{ firstName: userDetails.firstName, lastName: userDetails.lastName, email: userDetails.email, contact: userDetails.contact, password: userDetails.password }}
            >
              {/* <input type="password :" placeholder="Enter Password" name="psw" required/> */}

              <Form.Item label="First name " className='mt-3' name="firstName" rules={[{ required: true, message: 'Please input your first name!' }]} style={{ color: '#595959' }}>
                <Input
                  onInput={(e: any) => e.target.value = e.target.value.length > 1 ? e.target.value : e.target.value.toUpperCase()}
                  style={{ borderRadius: '0px', outline: 'none', boxShadow: 'none', }} placeholder="First name"
                  disabled={visible} />
              </Form.Item>

              <Form.Item label="Last name" className='mt-5' name="lastName"
                rules={[{ required: true, message: 'Please input your last name!' }]}
              >
                <Input
                  style={{ borderRadius: '0px', outline: 'none', boxShadow: 'none' }}
                  placeholder="Last name"
                  onInput={(e: any) => e.target.value = e.target.value.length > 1 ? e.target.value : e.target.value.toUpperCase()}
                  disabled={visible} />
              </Form.Item>

              <Form.Item
                label="Email" className='mt-5'
                name="email"
                rules={[{ required: true, message: 'Please input your email!' },
                {
                  type: "email",
                  message: 'Enter a valid email'
                }
                ]}
              >
                <Input style={{ borderRadius: '0px', outline: 'none', boxShadow: 'none' }} placeholder="Email"
                  disabled={visible} />
              </Form.Item>

              <Form.Item
                label="Contact" className='mt-5'
                name="contact"
                rules={[{ required: true, message: 'Contact is required' },
                {
                  pattern: RegExp("[1-9]{1}[0-9]{9}"),
                  message: 'Invalid input',
                  validateTrigger: 'onFinish'
                }
                ]}
              >
                <Input style={{ borderRadius: '0px', outline: 'none', boxShadow: 'none' }} placeholder="Contact"
                  disabled={visible}
                  maxLength={10} />
              </Form.Item>

              {/* <Form.Item
    label="Password"
    name="password"
    style={{ marginBottom: '18px' }}
  >
    <Input style={{ borderBottom: '1px solid #B8B8B8', borderRadius: '0px', boxShadow: 'none' }} type="password" placeholder="Password" />
  </Form.Item> */}

              {!visible ?

                <Button style={{ float: 'right', width: '70px', background: ' #1890ff ' }} type='primary' htmlType='submit' >  Save  </Button>

                : ''
              }
            </Form>
          </Card>

        </Col>
      </Row>
    </div>
  )
}

export default Account
