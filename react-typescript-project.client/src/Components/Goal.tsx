
import { Breadcrumb, Button, Card, DatePicker, Empty, Form, Input, Modal, notification, Popconfirm, Progress, Tooltip, Typography } from 'antd'
import axios from 'axios';
import { FilePenLine, Trash2 } from 'lucide-react';
import dayjs, { Dayjs } from 'dayjs';
import React, { useContext, useEffect, useState } from 'react'
import UserContext from '../UserContext';
import { HomeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import '../CSS/ThemeColors.css';
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
  const { userDetails, baseUrl } = useContext<any>(UserContext);

  const UserId = userDetails.UserId;

  const cardStyle = {
    alignSelf: "center",
    marginRight: "auto",
    marginLeft: "auto",
    lineHeight: 1,
  }
  const transformData = (goals: GoalData[]): GoalData[] => {
    return goals.map((goal) => ({
      ...goal,
    }));
  };


  useEffect(() => {
debugger
    axios.get(`${baseUrl}SavingsController/${UserId}GetSavingsByUserId`)
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

  const handleSubmit = (values: GoalData) => {

    const userId = UserId;
    const apiUrl = `${baseUrl}SavingsController/${userId}CreateSavingsandUpdate`;
    const formattedDate = values.targetDate ? dayjs(values.targetDate).format('YYYY-MM-DD') : null;
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
    axios.post(`${baseUrl}SavingsController/${id}DeleteSavings`)
      .then((response) => {
        const updatedGoal = goals.filter(goal => goal.id !== id);
        setGoals(updatedGoal);
        console.log(updatedGoal);
        notification.success({
          message: response.data.message || 'Goal deleted successfully',
        });
      })
      .catch(err => {
        console.error('Delete error:', err);
        notification.error({ message: 'Failed to delete goal', description: err.message });
      });
  };


  const GoalCard = () => {
    return (
      <div className='d-flex flex-wrap'>
        <div onClick={() => setIsModalVisible(true)}>
          <Empty
            image="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQlR-KpSAQDBPRVK8PNFcjjtGw0G8Gx89CKBScwQr_vr6DsurTBLXyhQIfFX-dRMxQT5T8&usqp=CAU"
            imageStyle={{ height: 110, width: 170 }}
            className='border rounded '
            description={false}
            style={{
              cursor: "pointer",
              height: 180,
              marginTop: 15,
              marginBottom: 10,
              outline: 'dotted',
              outlineColor: 'grey',
              outlineWidth: 2,
            }}
          >
            <Button className='sub1-buttons'
              type="dashed"
              onClick={() => setIsModalVisible(true)}
              style={{ lineHeight: 1, marginBottom: 8 }}
            >
              CREATE GOAL
            </Button>
          </Empty>
        </div>

        {goals.map((goal: GoalData, index: number) => {

          const percent = (goal.savedAmount / goal.targetAmount) * 100;
          const isComplete = goal.savedAmount >= goal.targetAmount;
          const color =
            percent <= 20 ? '#ff4d4f' :
              percent <= 40 ? '#ffa940' :
                percent <= 70 ? 'blue' :
                  '#52c41a';
          return (
            <Card
              className='total-cards-background'
              hoverable
              key={goal.id}
              extra={
                <div className='text-secondary '>
                  <small className=' p-2'>
                    <Tooltip color='grey' title="edit goal">
                      <Button icon={< FilePenLine />} onClick={() => { handleEdit(goal) }} />
                    </Tooltip>
                  </small>
                  <small>
                    <Popconfirm title="Are you sure?" onConfirm={() => handleDelete(goal.id)}>
                      <Button danger icon={<Trash2 />} />
                    </Popconfirm>
                  </small>
                </div>
              }
              title={goal.goal}
              style={{
                width: 300,
                height: 180,
                margin: 15,
                padding: 6,
                backgroundColor: isComplete ? '#dff0d8' : '#CCD7ED'
              }}>
              <Card.Meta
                avatar={
                  <Progress
                    type="circle"
                    width={70}
                    percent={(goal.savedAmount / goal.targetAmount) * 100}
                    strokeColor={isComplete ? '#52c41a' : color}
                    format={(percent: any) => `${Math.round(percent).toLocaleString()}%`}
                    className='align-self-center py-1'
                    style={{ margin: 'auto' }}
                  />
                }
                description={
                  <div className='d-flex flex-column pt-1 px-3 '>
                    <small className='text-dark'>Target Amount-{goal.targetAmount}</small>
                    <small className='text-dark'>Saved Amount-{goal.savedAmount}</small>
                    <small className='text-dark'>Target Date {dayjs(goal.targetDate).format('DD/MM/YYYY')}</small>
                  </div>
                }
              />
              <Button className='sub1-buttons' style={{ width: '150px', fontSize: '10px', marginLeft: '50px', marginTop: "15px" }} color='blue' onClick={() => { handleEdit(goal) }}>ADD SAVED AMOUNT</Button>
            </Card>
          )
        }
        )}
      </div>
    )
  }
  return (
    <>
      <div className='p-3'>
        <Breadcrumb
          items={[
            {
              title: < HomeOutlined onClick={() => navigate('/')} />,
            },
            {
              title: 'Goals',
            },
          ]}
        />
      </div>
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
          initialValues={{ goal: "", targetAmount: 0, savedAmount: 0, date: null }}
        >
          <Form.Item
            label="Goal"
            name="goal"
            rules={[{
              required: true,
              message: 'Please select a type!',
            }]}

          >
            <Input placeholder='Enter your goal' />
          </Form.Item>
          <Form.Item
            label="Target Amount"
            name="targetAmount"
            rules={[{ required: true, message: 'Please enter an amount!' }]}
          >
            <Input
              type="number"
              placeholder="Enter Amount"
              min={0}
              onChange={(e) => {
                const value = e.target.value;
                if (value.startsWith('0') && value.length > 1) {
                  e.target.value = value.replace(/^0+/, '');
                }
                form.setFieldsValue({ amount: e.target.value });
              }}
            />
          </Form.Item>

          <Form.Item
            label="Saved Amount"
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
                form.setFieldsValue({ amount: e.target.value });
              }}
            />
          </Form.Item>

          <Form.Item
            label="Desired Date"
            name="targetDate"
            rules={[{ required: true, message: 'Please select a date!' }]}
          >
            <DatePicker
              format="YYYY-MM-DD"
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
            image="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQlR-KpSAQDBPRVK8PNFcjjtGw0G8Gx89CKBScwQr_vr6DsurTBLXyhQIfFX-dRMxQT5T8&usqp=CAU"
            imageStyle={{ height: 200, width: 500, marginLeft: "auto", marginRight: "auto" }}
            style={cardStyle}
            description={
              <Typography.Text
                style={{
                  lineHeight: 1,
                }}>
                No goals set. Start by creating a financial goal to stay on track!
              </Typography.Text>
            }
          >
            <Button type="primary" onClick={() => setIsModalVisible(true)}>Add a goal</Button>
          </Empty>
      }
    </>

  )
}

export default Goal