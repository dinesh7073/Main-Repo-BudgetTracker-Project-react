// import { Breadcrumb, Button, Card, Form, Input, Modal, notification } from 'antd'
// import { Edit } from 'lucide-react'
// import { useContext, useEffect, useState } from 'react'
// import profile1 from '../images/profile1.png';
// import UserContext from '../UserContext';
// import axios from 'axios';
// import { HomeOutlined, LockOutlined, MailOutlined, UserOutlined } from '@ant-design/icons';
// import { useNavigate } from 'react-router-dom';
// import '../CSS/ThemeColors.css'
// import { REACT_APP_BASE_URL } from './Common/Url';

// interface ISignUp {
//   id: string,
//   firstName: string,
//   lastName: string,
//   email: string,
//   password: string,
//   contact: number
// }

// const Account = () => {

//   const { UserId, userDetails, setUserDetails } = useContext<any>(UserContext)
//   const [visible, setVisible] = useState<boolean>(true);
//   const [profiledata, setProfiledata] = useState<ISignUp>({
//     id: '',
//     firstName: '',
//     lastName: '',
//     email: '',
//     password: '',
//     contact: 0
//   });
//   const [editProfile, setEditProfile] = useState<ISignUp | null>(null);
//   const [isModalVisible, setIsModalVisible] = useState(false);
//   const [form] = Form.useForm();
//   const navigate = useNavigate();

//   // useEffect(() => {
//   //   axios.get(`${REACT_APP_BASE_URL }BudgetTracker/${UserId}GetUserById`)
//   //     .then((res) => {
//   //       setProfiledata(res.data);
//   //       console.log(res.data);
//   //     })
//   //     .catch((err) => {
//   //       console.log('Error fetching user data:', err);
//   //     });
//   // });

//   const onSave = (values: ISignUp) => {
//     debugger
//     const profileData = { ...values, UserId };
//     if (editProfile) {
//       profileData.id = editProfile.id;
//     }
//     axios.post(`${REACT_APP_BASE_URL}UsersController/CreateUsersAndUpdate`, profileData)
//       .then((response) => {
//         const updatedProfile = editProfile ? profileData : response.data;
//         setUserDetails(updatedProfile);
//         notification.success({
//           message: editProfile ? 'Profile updated successfully' : 'Profile created successfully',
//         });
//       })
//       .catch((error) => {
//         notification.error({
//           message: 'Failed to save profile',
//           description: error.message,
//         });
//       });

//     setEditProfile(null);
//   };

//   const handleCancel = () => {
//     setIsModalVisible(false);
//   };

//   const handleEdit = (profile: ISignUp) => {
//     form.setFieldsValue({
//       id: UserId,
//       firstName: userDetails.firstName,
//       lastName: userDetails.lastName,
//       email: userDetails.email,
//       contact: userDetails.contact,
//       // password: userDetails.password,
//     });
//     setEditProfile(userDetails);
//     setIsModalVisible(true);
//   }

//   // const handleLogout = () => {
//   //   window.location.reload();
//   //   localStorage.removeItem('isUser');
//   //   navigate('/login');
//   //   setUserId('')
//   //   setIsSignUp(false);
//   //   setIsLogin(false);
//   // }

//   return (
//     <div >
//       {/* <div className='p-10'>
//         <Breadcrumb
//           items={[
//             {
//               title: < HomeOutlined onClick={() => navigate('/')} />,
//             },
//             {
//               title: 'Account  ',
//             },
//           ]}
//         />
//       </div> */}
//       <Card style={{ width: 700, height: '89vh', background: '#F5F7F8', color: '#343131', fontSize: '15px', fontFamily: 'sans-serif' }}>

//         <img alt='' src={profile1} width={140} height={140} style={{ marginLeft: '256px' }} />
//         <h4 className='text-center' >{userDetails.firstName} {userDetails.lastName} </h4>
//         <div className='d-flex w-25 flex-row justify-content-between justify-content-between' style={{ marginLeft: '23%', }}>
//           {/* <h6 className='fs-4 text-center'> </h6> */}
//           {/* <p className='text-center' style={{ textAlign: "justify",  }}>{profiledata.firstName}Roky Bhai</p> */}
//         </div>
//         <div className=' '>

//         </div>
//         <div className='d-flex flex-row p-4'>


//           <div className='ms-5 mt-5 w-75 '>
//             <div className='d-flex  flex-row justify-content-between justify-content-between'>
//               <h6 className='pt-1  '>First name : </h6>
//               <p className='' style={{ width: 200, textAlign: "justify" }}>{userDetails.firstName}</p>
//             </div>
//             <div className='d-flex  flex-row justify-content-between justify-content-between'>
//               <h6 className='pt-1  ' >Last name : </h6>
//               <p className='' style={{ width: 200, textAlign: "justify" }}>{userDetails.lastName}</p>
//             </div>

//             <div className='d-flex  flex-row justify-content-between justify-content-between'>
//               <h6 className='pt-1  '>Email : </h6>
//               <p className='' style={{ width: 200, textAlign: "justify" }}>{userDetails.email}</p>
//             </div>
//             <div className='d-flex  flex-row justify-content-between justify-content-between'>
//               <h6 className='pt-1 '>Contact : </h6>
//               <p className='' style={{ width: 200, textAlign: "justify" }}>{userDetails.contact}</p>
//             </div>
//           </div>
//         </div>
//         {/* <button onClick={handleLogout} className='btn btn-danger text-white pb-1 py-1 px-5 border-light float-end me-5'>Logout</button> */}
//       </Card>

//       <div style={{ width: '400px', marginLeft: '60%', marginTop: '-45%', }}>
//         <span style={{ marginLeft: '93%' }} onClick={() => handleEdit(userDetails)}><Edit /></span>
//         <Form
//           layout="horizontal"
//           onFinish={onSave}
//           form={form}
//           className='mx-auto  rounded  px-5 '
//           style={{ width: "100%" }}

//           initialValues={{ firstName: userDetails.firstName, lastName: userDetails.lastName, email: userDetails.email, contact: userDetails.contact }}
//         >
//           {/* <input type="password :" placeholder="Enter Password" name="psw" required/> */}

//           <Form.Item label="First name " className='mt-5 ' name="firstName" rules={[{ required: true, message: 'Please input your first name!' }]}>
//             <Input
//               onInput={(e: any) => e.target.value = e.target.value.length > 1 ? e.target.value : e.target.value.toUpperCase()}
//               style={{ borderRadius: '0px', outline: 'none', boxShadow: 'none' }} placeholder="First name" />
//           </Form.Item>

//           <Form.Item label="Last name" className='mt-5' name="lastName"
//             rules={[{ required: true, message: 'Please input your last name!' }]}
//           >
//             <Input
//               style={{ borderRadius: '0px', outline: 'none', boxShadow: 'none' }}
//               placeholder="Last name"
//               onInput={(e: any) => e.target.value = e.target.value.length > 1 ? e.target.value : e.target.value.toUpperCase()} />
//           </Form.Item>

//           <Form.Item
//             label="Email" className='mt-5 '
//             name="email"
//             rules={[{ required: true, message: 'Please input your email!' },
//             {
//               type: "email",
//               message: 'Enter a valid email'
//             }
//             ]}
//           >
//             <Input style={{ borderRadius: '0px', outline: 'none', boxShadow: 'none' }} placeholder="Email" />
//           </Form.Item>

//           <Form.Item
//             label="Contact" className='mt-5'
//             name="contact"
//             rules={[{ required: true, message: 'Contact is required' },
//             {
//               pattern: RegExp("[1-9]{1}[0-9]{9}"),
//               message: 'Invalid input',
//               validateTrigger: 'onFinish'
//             }
//             ]}
//           >
//             <Input style={{ borderRadius: '0px', outline: 'none', boxShadow: 'none' }} placeholder="Contact" />
//           </Form.Item>
//           {editProfile ?
//             <div>

//               {/* <Form.Item
//             label="Password" 
//             name="password"

//           >
//             <Input.Password style={{ borderRadius: '0px', outline: 'none', boxShadow: 'none' }} type="password" placeholder="Password" />
//           </Form.Item> */}
//               <Button style={{ marginLeft: '93%' }} onClick={() => setVisible(!visible)}>  {visible ? 'Show' : 'Hide'}  </Button>
//             </div>
//             : ''
//           }
//         </Form>
//       </div>



//       {/* <Modal
//         style={{ width: '650px' }}
//         title={'Edit Profile'}
//         visible={isModalVisible}
//         onCancel={handleCancel}
//         footer={[
//         ]}
//       >
//         <Form
//           layout="vertical"
//           onFinish={onSave}
//           form={form}
//           className='mx-auto  rounded  px-5 '
//           style={{ width: "100%" }}
//         >
//           <div style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginTop: '30px' }}>
//             <Form.Item
//               label="Firstname"
//               name="firstName"
//               style={{ width: '49%', marginBottom: '18px' }}
//               rules={[{ required: true, message: 'Please input your firstname!' }]}
//             >
//               <Input style={{ border: 'none', borderBottom: '1px solid #B8B8B8', borderRadius: '0px', outline: 'none', boxShadow: 'none' }} prefix={<UserOutlined />} />
//             </Form.Item>
//             <Form.Item
//               name="lastName"
//               label="Lastname"
//               style={{ width: '49%', marginBottom: '18px' }}
//               rules={[{ required: true, message: 'Please input your lastname!' }]}
//             >
//               <Input style={{ border: 'none', borderBottom: '1px solid #B8B8B8', borderRadius: '0px', outline: 'none', boxShadow: 'none' }} prefix={<UserOutlined />} />
//             </Form.Item>
//           </div>
//           <Form.Item
//             label="E-mail"
//             name="email"
//             style={{ marginBottom: '18px' }}
//             rules={[{ required: true, message: 'Please input your email!' }]}
//           >
//             <Input style={{ border: 'none', borderBottom: '1px solid #B8B8B8', borderRadius: '0px', outline: 'none', boxShadow: 'none' }} prefix={<MailOutlined />} />
//           </Form.Item>
//           <Form.Item
//             label="Change Password"
//             name="password"
//             style={{ marginBottom: '18px' }}
//           >
//             <Input style={{ border: 'none', borderBottom: '1px solid #B8B8B8', borderRadius: '0px', outline: 'none', boxShadow: 'none' }} prefix={<LockOutlined />} type="password" placeholder="Password" />
//           </Form.Item>
//           <Form.Item
//             label="Confirm Password"
//             name="confirmPassword"
//             dependencies={['password']}
//             rules={[
//               ({ getFieldValue }) => ({
//                 validator(_, value) {
//                   if (!value || getFieldValue('password') === value) {
//                     return Promise.resolve();
//                   }
//                   return Promise.reject(new Error('The new password that you entered do not match!'));
//                 },
//               }),
//             ]}
//           >
//             <Input style={{ border: 'none', borderBottom: '1px solid #B8B8B8', borderRadius: '0px', outline: 'none', boxShadow: 'none' }} />
//           </Form.Item>
//           <Form.Item>
//             <Button block type="primary" htmlType="submit" style={{ borderRadius: '15px', backgroundColor: 'gray' }}>
//               Save
//             </Button>
//           </Form.Item>
//         </Form>
//       </Modal> */}

//     </div>
//   )
// }

// export default Account

import { Breadcrumb, Button, Card, Col, Form, Input, Modal, notification, Row } from 'antd'
import { Edit } from 'lucide-react'
import { useContext, useEffect, useState } from 'react'
import profile1 from '../images/profile1.png';
import UserContext from '../UserContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../CSS/ThemeColors.css'
import { REACT_APP_BASE_URL } from './Common/Url';
import { IoMdClose } from "react-icons/io";
import '../CSS/Account.css';

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


  const onSave = (values: ISignUp) => {
    
    console.log(userDetails);
    const profileData = { ...values, id : UserId };

    if (editProfile) {
      profileData.id = editProfile.id;
    }

    axios.post(`${REACT_APP_BASE_URL}UsersController/CreateUsersAndUpdate`, profileData)
      .then((response) => {
        const updatedProfile =  profileData ;
        console.log(response.data);
        setUserDetails(updatedProfile);
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
    console.log(!visible);
  };

  // const handleEdit = (profile: ISignUp) => {

  //   form.setFieldsValue({
  //     id: UserId,
  //     firstName: userDetails.firstName,
  //     lastName: userDetails.lastName,
  //     email: userDetails.email,
  //     contact: userDetails.contact,
  //     password: userDetails.password
  //   });
  //   setEditProfile(profile);
  //   setVisible(visible);

  // }

  return (
    <div style={{ width: '100%', height: '87vh', overflow: 'hidden' }} >
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

        <Col xs={{ span: 10, offset: 0 }} lg={{ span: 12 }}>

          <Card style={{ width: '100%', height: '100%', background: '#ffffff', color: '#343131', fontSize: '15px', fontFamily: 'sans-serif', boxShadow : 'rgba(149, 157, 165, 0.2) 0px 8px 24px;' }} >
            <img alt='' src={profile1} width={140} height={140} style={{ marginLeft: '100px' }} />
            <h4 className='text-center' >{userDetails.firstName} {userDetails.lastName}</h4>
            <div className='d-flex w-25 flex-row justify-content-between justify-content-between' style={{ marginLeft: '23%', }}>
              {/* <h6 className='fs-4 text-center'> </h6> */}
              {/* <p className='text-center' style={{ textAlign: "justify",  }}>{profiledata.firstName}Roky Bhai</p> */}
            </div>
            <div className=' '>

            </div>
            <div className='d-flex flex-row px-4' style={{ height: '700px' }}>


              <div className=' mt-4 '>
                <div className='d-flex align-self-center '>
                  <p className=' pe-3'>First name </p>
                  <p>:</p>
                  <p className='' style={{ textAlign: "justify" }}>{userDetails.firstName}</p>
                </div>
                <div className='d-flex  '>
                  <h6 className='pe-3  ' >Last name </h6>
                  <p className='' style={{ textAlign: "justify" }}>{userDetails.lastName}</p>
                </div>
                <div className='d-flex'>
                  <h6 className='pe-3  '>Email : </h6>
                  <p className='' style={{ textAlign: "justify" }}>{userDetails.email}</p>
                </div>
                <div className='d-flex '>
                  <h6 className='pe-3 '>Contact : </h6>
                  <p className='' style={{ textAlign: "justify" }}>{userDetails.contact} </p>
                </div>
              </div>
            </div>


            <p>Delete user data</p>
          </Card>

          {/* <button onClick={handleLogout} className='btn btn-danger text-white pb-1 py-1 px-5 border-light float-end me-5'>Logout</button> */}

        </Col>
        <Col xs={{ span: 10, offset: 0 }} lg={{ span: 12 }}>
          <Card style={{ width: '100%', height: '100%', background: '#ffffff', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1);' }}>

            {/* <input type="password :" placeholder="Enter Password" name="psw" required/> */}
            {/* <span style={{ marginLeft: '93%' }} onClick={() => handleEdit(profiledata)}><Edit /></span> */}
            <Button style={{ marginLeft: '93%' }} onClick={() =>setVisible(!visible) }>  {visible ? <Edit /> : <IoMdClose />}  </Button>

            <Form
              layout="horizontal"
              onFinish={onSave}
              form={form}
              className='mx-auto  rounded  px-3 '
              style={{ width: "100%" }}
              requiredMark={false}
              initialValues={{ firstName: userDetails.firstName, lastName: userDetails.lastName, email: userDetails.email, contact: userDetails.contact, password: userDetails.password }}
            >
              {/* <input type="password :" placeholder="Enter Password" name="psw" required/> */}

              <Form.Item label="First name " className='mt-5 ' name="firstName" rules={[{ required: true, message: 'Please input your first name!' }]}>
                <Input
                  onInput={(e: any) => e.target.value = e.target.value.length > 1 ? e.target.value : e.target.value.toUpperCase()}
                  style={{ borderRadius: '0px', outline: 'none', boxShadow: 'none', width:'75%' }} placeholder="First name"
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
                label="Email" className='mt-5 '
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
              <Form.Item
                label="Password"
                name="password"
                style={{ marginBottom: '18px' }}
              >
                <Input style={{ borderBottom: '1px solid #B8B8B8', borderRadius: '0px', boxShadow: 'none' }} type="password" placeholder="Password" />
              </Form.Item>

              {!visible ?

                <Button style={{ float: 'right', width: '70px' }} type='primary' htmlType='submit' >  Save  </Button>

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
