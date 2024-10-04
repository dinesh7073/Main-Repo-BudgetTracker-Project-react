
import { Breadcrumb, Button, Card, Col, DatePicker, Empty, Form, Input, Modal, notification, Popconfirm, Progress, Row, Select, Tooltip, Typography } from 'antd'
import axios from 'axios';
import { Edit, FilePenLine, Plus, Trash2 } from 'lucide-react';
import dayjs, { Dayjs } from 'dayjs';
import React, { useContext, useEffect, useState } from 'react'
import UserContext from '../UserContext';
import { HomeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import '../CSS/ThemeColors.css';
import { REACT_APP_BASE_URL } from '../Components/Common/Url';
const { RangePicker } = DatePicker;

interface GoalData {
  id: string,
  userId: string,
  goal: string,
  targetAmount: number,
  savedAmount: number,
  targetDate: Dayjs | null
}
const Goal = () => {

  const navigate = useNavigate();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [goalExists, setGoalExists] = useState(false);
  const [goals, setGoals] = useState<GoalData[]>([]);
  const [editGoal, setEditGoal] = useState<GoalData | null>(null);
  const [form] = Form.useForm();
  const { userDetails, baseUrl, UserId } = useContext<any>(UserContext);
  const [selectedDateRange, setSelectedDateRange] = useState<[Dayjs, Dayjs] | null>(null);


  const cardStyle = {
    alignSelf: "center",
    marginRight: "auto",
    marginLeft: "auto",
    lineHeight: 1,
    marginTop:'50px',
    width:'300px'
  }
  const transformData = (goals: GoalData[]): GoalData[] => {
    return goals.map((goal) => ({
      ...goal,
    }));
  };


  useEffect(() => {

    axios.get(`${REACT_APP_BASE_URL}SavingsController/${UserId}GetSavingsByUserId`)
      .then((res) => {

        if (res.status === 200) {
          const transformedGoal = transformData(res.data);
          setGoalExists(res.data.length > 0);
          setGoals(transformedGoal.map(goal => ({
            ...goal,
            targetAmount: Number(goal.targetAmount),
            savedAmount: Number(goal.savedAmount),
            targetDate: dayjs(goal.targetDate)
          })));
        }
      })
      .catch((err) => console.log("Error from server", err));
  }, []);

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  }
  const handleEdit = (goal: GoalData) => {
    form.setFieldsValue({
      ...goal,
      targetDate: goal.targetDate ? dayjs(goal.targetDate) : null
    });
    setEditGoal(goal);
    setIsModalVisible(true);
  }

  const handleDateRangeChange = (dates: [Dayjs, Dayjs] |any) => {
    console.log(dates);
    // console.log(dateStrings)
    setSelectedDateRange(dates);
  };

  const handleSubmit = (values: GoalData) => {

    const userId = UserId;
    const apiUrl = `${REACT_APP_BASE_URL}SavingsController/${userId}CreateSavingsandUpdate`;
    const formattedDate = values.targetDate ? dayjs(values.targetDate).format('DD-MM-YYYY') : null;
    const GoalData = { ...values, userId, date: formattedDate };

    if (editGoal) {
      GoalData.id = editGoal.id;
    }

    axios.post(apiUrl, GoalData)
      .then((response) => {
        const isComplete = GoalData.savedAmount >= GoalData.targetAmount;
        const updatedGoals = editGoal
          ? goals.map(goal => goal.id === editGoal.id ? { ...goal, ...response.data } : goal)
          : [...goals, response.data];

        setGoals(updatedGoals);
        notification.success({
          message: editGoal ? 'Goal updated successfully' : 'Goal added successfully',
          description: isComplete ? 'Congratulations! You have completed your goal.' : undefined
        });
      })
      .catch(err => notification.error({
        message: editGoal ? 'Failed to update goal' : 'Failed to add goal',
        description: err.message,
      }));

    form.resetFields();
    setIsModalVisible(false);
    setEditGoal(null);
    setGoalExists(true)
  };

  const handleDelete = (id: string) => {
    axios.post(`${REACT_APP_BASE_URL}SavingsController/${id}DeleteSavings`)
      .then((response) => {
        const updatedGoal = goals.filter(goal => goal.id !== id);
        setGoals(updatedGoal);
        console.log(updatedGoal);
        notification.success({
          message: 'Goal deleted successfully',

        });
      })
      .catch(err => {
        console.error('Delete error:', err);
        notification.error({ message: 'Failed to delete goal', description: err.message });
      });
  };


  const GoalCard = () => {

    const filteredGoals = selectedDateRange?goals.filter((goal)=>{
      return(
      goal.targetDate?.isSameOrAfter(selectedDateRange[0], 'day') &&
      goal.targetDate.isSameOrBefore(selectedDateRange[1], 'day')
      )
    }):goals;

    return (

      <div className='d-flex flex-wrap my-2 '>

        {filteredGoals.length > 0?(
        filteredGoals.map((goal: GoalData, index: number) => {

          const percent = (goal.savedAmount / goal.targetAmount) * 100;
          const isComplete = goal.savedAmount >= goal.targetAmount;
          const color =
            percent <= 20 ? '#ff4d4f' :
              percent <= 40 ? '#ffa940' :
                percent <= 70 ? 'blue' :
                  '#52c41a';
          return (
            <div>
              <Card
                className='total-cards-background'
                hoverable
                key={goal.id}
                // ={[


                // ]}

                style={{
                  width: 290,
                  height:'74%',
                  margin: 10,
                  padding:5,
                  backgroundColor: isComplete ? '#dff0d8' : '#e1e8f5'
                }}>
                <Card.Meta


                  description={
                    <div className='d-flex flex-column '>
                      <div className='d-flex justify-content-between'>
                        <p className='text-dark' style={{ fontSize: '17px', marginLeft: '6px' }}>{goal.goal}</p>
                        <div>
                          <small className='pe-2'>

                            <Edit
                              size={19}
                              key="edit"
                              onClick={() => handleEdit(goal)}
                              style={{ cursor: "pointer" }} />

                          </small>
                          <small>

                            <Trash2
                              size={19}
                              key="delete"
                              style={{ cursor: "pointer", color: 'red', opacity: 0.5 }}
                              onClick={() => handleDelete(goal.id)} />

                          </small>
                        </div>
                      </div>
                      <div className='d-flex '>
                        <Progress
                          type="circle"
                          width={60}
                          percent={(goal.savedAmount / goal.targetAmount) * 100}
                          strokeColor={isComplete ? '#52c41a' : color}
                          format={(percent: any) => `${Math.round(percent).toLocaleString()}%`}

                          style={{ marginRight: '19px', paddingLeft: '8px', paddingTop: '3px' }}
                        />
                        <div className='d-flex flex-column '>

                          <small className='text-dark'>Target amount - ₹{goal.targetAmount.toLocaleString()}</small>
                          <small className='text-dark'>Saved amount - ₹{goal.savedAmount.toLocaleString()}</small>
                          <small className='text-dark'>Target date - {dayjs(goal.targetDate).format('DD-MM-YYYY')}</small>
                        </div>



                      </div>
                    </div>
                  }
                  style={{height:'100%'}}

                />
                <Button className='sub1-buttons'
                style={{ width: '130px', fontSize: '10px', marginLeft: '60px', marginTop:'17px' }}
                color='blue'
                onClick={() => { handleEdit(goal) }}>
                ADD SAVED AMOUNT
              </Button>
              </Card>

            </div>
          )
        }
        )
      ):(
      '')}
      </div>
      )
    
  }

  return (
    <>
      <Card style={{ width: '100%', height: '87vh', overflow:'auto' }}>
        <div className='px-3 my-3'>
          <Breadcrumb
            items={[
              {
                title: < HomeOutlined onClick={() => navigate('/dashboard')} />,
              },
              {
                title: 'Goals',
              },
            ]}
          />

        </div>
        <Row gutter={24} className='d-flex flex-row  justify-between' style={{width:'100%'}}>


          <Col span={17} style={{width:'100%'}}>
            <Button className='main-buttons p-2 mx-3' type="primary" onClick={() => setIsModalVisible(true)}>Add Goal</Button>
          </Col>

          <Col lg={{span:7}} className='d-flex flex-row'  >

            
                <span className='align-content-center ' style={{ width: '100px' }}> Sort by date:</span>
                
                <RangePicker
                  onChange={ handleDateRangeChange}
                  value={selectedDateRange}
                  format='DD-MM-YYYY'
                />
              
          </Col>
        </Row>
        <Modal
          title={editGoal ? "Edit Goal" : "Add Goal"}
          visible={isModalVisible}
          onCancel={handleCancel}
          footer={[
          ]}
        >
          <Form
            form={form}
            layout="vertical"
            style={{ maxWidth: '600px', margin: 'auto', padding: '20px', borderRadius: '10px', }}
            onFinish={handleSubmit}
            initialValues={{ goal: "", targetAmount: '', savedAmount: '', date: null }}
            requiredMark={false}
          >
            <Form.Item
              label="Goal"
              name="goal"
              rules={[{
                required: true,
                message: 'Please enter your goal!',
              }]}

            >
              <Input placeholder='Enter your goal'
                onInput={(e: any) => e.target.value = e.target.value.length > 1 ? e.target.value : e.target.value.toUpperCase()} />
            </Form.Item>
            <Form.Item
              label="Target amount"
              name="targetAmount"
              rules={[{ required: true, message: 'Please enter an amount!' }]}
            >
              <Input
                type="number"
                placeholder="Enter amount"
                min={0}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value.startsWith('0') && value.length > 1) {
                    e.target.value = value.replace(/^0+/, '');
                  }
                  form.setFieldsValue({ targetAmount: e.target.value });
                }}
              />
            </Form.Item>

            <Form.Item
              label="Saved amount"
              name="savedAmount"
              rules={[{ required: true, message: 'Please enter an amount to save!' }]}
            >
              <Input
                placeholder="Enter amount"
                type='number'
                min={0}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value.startsWith('0') && value.length > 1) {
                    e.target.value = value.replace(/^0+/, '');
                  }
                  form.setFieldsValue({ savedAmount: e.target.value });
                }}
              />
            </Form.Item>

            <Form.Item
              label="Desired date"
              name="targetDate"
              rules={[{ required: true, message: 'Please select a date!' }]}
            >
              <DatePicker
                format="DD-MM-YYYY"
                style={{ width: '100%' }}
              />
            </Form.Item>
            <div >
              <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
                {editGoal ? "Edit Goal" : "Add Goal"}
              </Button>

            </div>
          </Form>
        </Modal>
        {
          goalExists ?
            <GoalCard />
            :
            <Empty
              // image="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQlR-KpSAQDBPRVK8PNFcjjtGw0G8Gx89CKBScwQr_vr6DsurTBLXyhQIfFX-dRMxQT5T8&usqp=CAU"
              // imageStyle={{ height: 200, width: 500, marginLeft: "auto", marginRight: "auto" }}
              image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
              imageStyle={{ height: 150 }}
               style={cardStyle}
              // description={
              //   <Typography.Text
              //     style={{
              //       lineHeight: 1,
              //     }}>
              //     No goals set. Start by creating a financial goal to stay on track!
              //   </Typography.Text>
              // }
            >
              {/* <Button type="primary" onClick={() => setIsModalVisible(true)}>Add a goal</Button> */}
            </Empty>
        }

      </Card>
    </>

  )
}

export default Goal