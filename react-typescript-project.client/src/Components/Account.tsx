import { Breadcrumb, Button, Card, Form, Input, Modal, notification } from 'antd'
import { Edit } from 'lucide-react'
import { useContext, useEffect, useState } from 'react'
import profile1 from '../images/profile1.png';
import UserContext from '../UserContext';
import axios from 'axios';
import { HomeOutlined, LockOutlined, MailOutlined, UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import '../CSS/ThemeColors.css'
interface ISignUp {
  id: string,
  firstName: string,
  lastName: string,
  email: string,
  password: string,
}

const Account = () => {

  const { UserId, baseUrl } = useContext<any>(UserContext)
  const [profiledata, setProfiledata] = useState<ISignUp>({
    id: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });
  const [editProfile, setEditProfile] = useState<ISignUp | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${baseUrl}BudgetTracker/${UserId}GetUserById`)
      .then((res) => {
        setProfiledata(res.data);
        console.log(res.data);
      })
      .catch((err) => {
        console.log('Error fetching user data:', err);
      });
  });

  const onSave = (values: ISignUp) => {
    const profileData = { ...values, UserId };
    if (editProfile) {
      profileData.id = editProfile.id;
    }
    axios.post(`https://localhost:7054/UsersController/CreateUsersAndUpdate`, profileData)
      .then((response) => {
        const updatedProfile = editProfile ? profileData : response.data;
        setProfiledata(updatedProfile);
        notification.success({
          message: editProfile ? 'Profile updated successfully' : 'Profile created successfully',
        });
      })
      .catch((error) => {
        notification.error({
          message: 'Failed to save profile',
          description: error.message,
        });
      });
    setIsModalVisible(false);
    setEditProfile(null);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleEdit = (profile: ISignUp) => {
    form.setFieldsValue({
      id: UserId,
      firstName: profile.firstName,
      lastName: profile.lastName,
      email: profile.email,
    });
    setEditProfile(profile);
    setIsModalVisible(true);
  }

  // const handleLogout = () => {
  //   window.location.reload();
  //   localStorage.removeItem('isUser');
  //   navigate('/login');
  //   setUserId('')
  //   setIsSignUp(false);
  //   setIsLogin(false);
  // }

  return (
    <div >
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
      <Card style={{ width: 700, height: '89vh', background: '#F5F7F8', color: '#343131', fontSize: '15px', fontFamily: 'sans-serif' }}>



        <img alt='' src={profile1} width={140} height={140} style={{ marginLeft: '256px' }} />
        <h4 className='text-center' >Roky Bhai </h4>
        <div className='d-flex w-25 flex-row justify-content-between justify-content-between' style={{ marginLeft: '23%', }}>
          {/* <h6 className='fs-4 text-center'> </h6> */}
          {/* <p className='text-center' style={{ textAlign: "justify",  }}>{profiledata.firstName}Roky Bhai</p> */}
        </div>
        <div className=' '>

        </div>
        <div className='d-flex flex-row p-4'>


          <div className='ms-5 mt-5 w-75 '>
            <div className='d-flex  flex-row justify-content-between justify-content-between'>
              <h6 className='pt-1  '>First name : </h6>
              <p className='' style={{ width: 200, textAlign: "justify" }}>{profiledata.firstName}Roky</p>
            </div>
            <div className='d-flex  flex-row justify-content-between justify-content-between'>
              <h6 className='pt-1  ' >Last name : </h6>
              <p className='' style={{ width: 200, textAlign: "justify" }}>{profiledata.lastName}Bhai</p>
            </div>
            <div className='d-flex  flex-row justify-content-between justify-content-between'>
              <h6 className='pt-1 '>Contact : </h6>
              <p className='' style={{ width: 200, textAlign: "justify" }}>{profiledata.firstName}5363623346</p>
            </div>
            <div className='d-flex  flex-row justify-content-between justify-content-between'>
              <h6 className='pt-1  '>Email : </h6>
              <p className='' style={{ width: 200, textAlign: "justify" }}>{profiledata.email}rokybhai@gmail.com</p>
            </div>
          </div>
        </div>
        {/* <button onClick={handleLogout} className='btn btn-danger text-white pb-1 py-1 px-5 border-light float-end me-5'>Logout</button> */}
      </Card>


      <div style={{ width: '400px', marginLeft: '60%', marginTop: '-45%', }}>

        {/* <input type="password :" placeholder="Enter Password" name="psw" required/> */}
        <span style={{ marginLeft: '93%' }} onClick={() => handleEdit(profiledata)}><Edit /></span>

        <Form.Item label="FirstName " className='mt-5 ' name="password" rules={[{ required: true, message: 'Please input your Password!' }]}>
          <Input style={{ borderRadius: '0px', outline: 'none', boxShadow: 'none' }} type="password" placeholder="Firstname" />
        </Form.Item>

        <Form.Item label="LastName" className='mt-5' name="LastName"
          rules={[{ required: true, message: 'Please input your Password!' }]}
        >
          <Input style={{ borderRadius: '0px', outline: 'none', boxShadow: 'none' }} type="password" placeholder="lastname" />
        </Form.Item>
        
        <Form.Item
          label="Contact" className='mt-5'
          name="contact  "
          rules={[{ required: true, message: 'Please input your Password!' }]}
        >
          <Input style={{ borderRadius: '0px', outline: 'none', boxShadow: 'none' }} type="password" placeholder="contact" />
        </Form.Item>

        <Form.Item
          label="Password" className='mt-5'
          name="password"
          rules={[{ required: true, message: 'Please input your Password!' }]}
        >
          <Input style={{ borderRadius: '0px', outline: 'none', boxShadow: 'none' }} type="password" placeholder="Password" />
        </Form.Item>

        <Form.Item
          label="Email" className='mt-5 '
          name="password"
          rules={[{ required: true, message: 'Please input your Password!' }]}
        >
          <Input style={{ borderRadius: '0px', outline: 'none', boxShadow: 'none' }} type="password" placeholder="email" />
        </Form.Item>

      </div>



      {/* <Modal
        style={{ width: '650px' }}
        title={'Edit Profile'}
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={[
        ]}
      >
        <Form
          layout="vertical"
          onFinish={onSave}
          form={form}
          className='mx-auto  rounded  px-5 '
          style={{ width: "100%" }}
        >
          <div style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginTop: '30px' }}>
            <Form.Item
              label="Firstname"
              name="firstName"
              style={{ width: '49%', marginBottom: '18px' }}
              rules={[{ required: true, message: 'Please input your firstname!' }]}
            >
              <Input style={{ border: 'none', borderBottom: '1px solid #B8B8B8', borderRadius: '0px', outline: 'none', boxShadow: 'none' }} prefix={<UserOutlined />} />
            </Form.Item>
            <Form.Item
              name="lastName"
              label="Lastname"
              style={{ width: '49%', marginBottom: '18px' }}
              rules={[{ required: true, message: 'Please input your lastname!' }]}
            >
              <Input style={{ border: 'none', borderBottom: '1px solid #B8B8B8', borderRadius: '0px', outline: 'none', boxShadow: 'none' }} prefix={<UserOutlined />} />
            </Form.Item>
          </div>
          <Form.Item
            label="E-mail"
            name="email"
            style={{ marginBottom: '18px' }}
            rules={[{ required: true, message: 'Please input your email!' }]}
          >
            <Input style={{ border: 'none', borderBottom: '1px solid #B8B8B8', borderRadius: '0px', outline: 'none', boxShadow: 'none' }} prefix={<MailOutlined />} />
          </Form.Item>
          <Form.Item
            label="Change Password"
            name="password"
            style={{ marginBottom: '18px' }}
          >
            <Input style={{ border: 'none', borderBottom: '1px solid #B8B8B8', borderRadius: '0px', outline: 'none', boxShadow: 'none' }} prefix={<LockOutlined />} type="password" placeholder="Password" />
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
          >
            <Input style={{ border: 'none', borderBottom: '1px solid #B8B8B8', borderRadius: '0px', outline: 'none', boxShadow: 'none' }} />
          </Form.Item>
          <Form.Item>
            <Button block type="primary" htmlType="submit" style={{ borderRadius: '15px', backgroundColor: 'gray' }}>
              Save
            </Button>
          </Form.Item>
        </Form>
      </Modal> */}

    </div>
  )
}

export default Account