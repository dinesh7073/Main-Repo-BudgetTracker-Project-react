import React, { useContext, useEffect, useState } from 'react';
import { Input, Button, message, Col, Divider, Row, Spin, Table, Dropdown, Popconfirm, Space, Form, Modal, Select, Segmented, notification } from 'antd';
import { Content } from 'antd/es/layout/layout';
import { Plus, RotateCcw } from 'lucide-react';
import { EditOutlined, DeleteOutlined, MoreOutlined, SaveOutlined } from '@ant-design/icons';
import { Utils } from '../Common/Utilities/Utils';
import form from 'antd/es/form';
import axios from 'axios';
import UserContext from '../../UserContext';
import { REACT_APP_BASE_URL } from '../Common/Url';

export interface CategoriesType {
  id: string;
  userId: string;
  categoryName: string;    // this will taken from user
  categoryType: number | null;  // this will take from user
  categoryNumber: number;  // this will be generated by system default
}

const CategoriesCompo = () => {
  const [categoryData, setCategoryData] = useState<CategoriesType[]>([]);
  const [loader, setLoader] = useState(false);
  const [editingCategory, seteditingCategory] = useState<CategoriesType | null | any>(null);
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { UserId } = useContext<any>(UserContext);



  useEffect(() => {
    setLoader(true)
    axios.get(`${REACT_APP_BASE_URL}CategoriesController/${UserId}GetCategoriesByUserId`).then((res) => {

      setCategoryData(res.data);
      setLoader(false);
    }).catch((err) => {
      setLoader(false);
      notification.error({
        message: 'Something went wrong! Please try again later'
      })
    });
  }, [])

  const showModal = () => {
    form.setFieldsValue({});// we can override  any field values
    setIsModalOpen(true);
    seteditingCategory(null);
  };

  const handleCancel = () => {
    seteditingCategory(null);
    setIsModalOpen(false);
    form.resetFields();
  };
  const getCategoryTypeName = (categoryType: number | null) => {
    switch (categoryType) {
      case 1: return "Income";
      case 2: return "Expense";
      default: return "Unknown";
    }
  };

  // console.log(categoryData);




  const onFinish = (values: CategoriesType) => {
    debugger

    let categoryNum = 0;
    if (categoryData.length === 0) {
      categoryNum = 14;
    } else {
      let lastdata = categoryData.length - 1;
      let getlastdata = categoryData[lastdata]
      categoryNum = getlastdata.categoryNumber + 1;
    }

    const userId = UserId;
    const categoryNumber = categoryNum;
    const apiURL = `${REACT_APP_BASE_URL}CategoriesController/${userId}CreateCategoriesAndUpdate`

    const categorydata = { ...values, userId, categoryNumber };

    if (editingCategory) {
      categorydata.id = editingCategory.id;
    }
    axios.post(apiURL, categorydata).then(
      (response) => {
        const updatedRecords = editingCategory
          ? categoryData.map((record: { id: string; }) => record.id === editingCategory.id ? { ...record, ...response.data } : record)
          : [...categoryData, response.data];

        setCategoryData(updatedRecords);
        notification.success({
          message: editingCategory ? 'Category updated successfully' : 'Category added successfully',
        });
      }
    );
    setIsModalOpen(false);
    form.resetFields();
  }


  const handleOpenModal = (category?: CategoriesType) => {
    if (category) {
      seteditingCategory(category);

      form.setFieldsValue({
        ...category,
        categoryName: category.categoryName,
        categoryType: category.categoryType,
      });

    } else {
      seteditingCategory(null);
      form.resetFields();
    }
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {

    axios.post(`${REACT_APP_BASE_URL}CategoriesController/${id}DeleteCategory`)
      .then((response) => {
        const updatedRecords = categoryData.filter((record: { id: any; }) => record.id !== id);
        setCategoryData(updatedRecords);
        notification.success({ message: response.data.message || 'Category deleted successfully' });
      })
      .catch(err => {
        notification.error({ message: 'Failed to delete category', description: err.message });
      });

  }


  const columns = [
    {
      title: 'CategoryName',
      dataIndex: 'categoryName',
      key: 'categoryName',
      render: (text: any, categoryName: any) => (
        <span className='d-flex flex-row'>
          <span style={{ fontWeight: '500' }} >
            {categoryName.categoryName}
          </span>
        </span>
      ),
    },
    {
      title: 'CategoryType',
      dataIndex: 'categoryType',
      key: 'categoryType',
      render: (text: any, record: any) => <span> {getCategoryTypeName(record.categoryType)}</span>
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text: any, record: any) => (

        <Dropdown
          menu={{
            items: [
              {
                className: 'px-3',
                label: <span onClick={() => handleOpenModal(record)} > <EditOutlined size={15} /> Edit</span>,
                key: '0',
              },
              {
                label: <Popconfirm title="Are you sure?" onConfirm={() => handleDelete(record.id)}><span><DeleteOutlined size={15} /> Delete</span> </Popconfirm>,
                key: '1',
              },

            ],
          }}

          trigger={['click']}
        >
          <a className="text-dark fw-bold" onClick={(e) => e.preventDefault()}>
            <Space>
              <MoreOutlined size={20} />
            </Space>
          </a>
        </Dropdown >

        // </>    
      ),
    },
  ];

  return (
    <div>
      <Content style={{ backgroundColor: '#fff', height: '71vh' }}>

        <Row gutter={24}>

          {/* <Text strong>Add a new account</Text> */}
          {/* <Space.Compact className='w-25 mt-2'>  
        <Input placeholder='Account Name' onChange={(e) => setBankNameInput(e.target.value)} /> */}


          <Col span={5}>
            <Button type="primary" size='middle' className='m-0 px-2 py-3' onClick={showModal} > <Plus size={19} />Add Category</Button>
          </Col>

          {/* </Space.Compact> */}

        </Row>
        <Divider />


        <h6> Your Category</h6>
        <Spin spinning={loader} size="large" />
        <Table
          columns={columns}
          dataSource={categoryData}
          pagination={false}
          style={{ marginTop: '16px' }}
          scroll={{ y: 360 }}
          size='small'
          rowKey="key"
        />
      </Content>


      <Modal
        title={editingCategory ? "Edit Category" : "Add Category"}
        open={isModalOpen}
        onCancel={handleCancel}
        footer={''}
      >
        <Form
          requiredMark={false}
          form={form}
          layout="vertical"
          onFinish={onFinish}
          style={{ maxWidth: '600px', margin: 'auto', padding: '20px 20px 0px 20px', borderRadius: '10px', }}
          initialValues={{ categoryType: 2, }}
        >

          <Form.Item
            label="Category Type"
            name="categoryType"
            rules={[{ required: true, message: 'Please select a categoryType!' }]}


          >

            <Segmented size='middle' type='primary' options={[
              { label: 'Income', value: 1, },
              { label: 'Expense', value: 2, },
            ]}
              // onChange={handleTypeChange}
              // value={formData.transactionType}
              style={{ width: '100%', backgroundColor: '#F3F4FA', border: '1px solid lightgrey' }}
              block
            />

          </Form.Item>
          <Form.Item
            name="categoryName"
            label="Category Name"
            rules={[{
              required: true,
              message: 'Please enter the category name!',

            }]}>
            <Input
              type='primary'
              onInput={(e: any) => e.target.value = e.target.value.length > 1 ? e.target.value : e.target.value.toUpperCase()}
              placeholder="Enter a category name"
            />
          </Form.Item>

          <Form.Item className='w-100'>
            <Button
              type="primary"
              htmlType="submit"
              style={{ width: '33%', marginBottom: '-20px' }}
              className=' text-center float-end '
            >
              {editingCategory ? <RotateCcw size={16} /> : <SaveOutlined size={16} />}  {editingCategory ? 'Update Category' : 'Save Category'}
            </Button>
          </Form.Item>


        </Form>
      </Modal>
    </div>
  );
}

export default CategoriesCompo;
