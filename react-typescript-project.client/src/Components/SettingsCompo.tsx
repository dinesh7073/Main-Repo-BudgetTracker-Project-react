import { Breadcrumb, Col, Row, Tabs, TabsProps } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import ErrorPage from './ErrorPage';
import AccountsCompo from './Settings-children\'s/AccountsCompo';
import CategoriesCompo from './Settings-children\'s/CategoriesCompo';

const Settings = () => {
    const navigate = useNavigate();
    const items: TabsProps['items'] = [
        {
            key: '/account',
            label: 'Account',
            children: <AccountsCompo />,
        },
        {
            key: '/categorries',
            label: 'Categories',
            children: <CategoriesCompo />,

        },
        {
            key: '/personal',
            label: 'Personal',
            children: <ErrorPage />,
        },
    ];
    const onChange = (key: string) => {
        console.log(key);
    };
    return (
        <div style={{ padding: '10px 16px 16px 16px', backgroundColor: 'white' }}>
            <Col span={24}>
                <Row gutter={24} className='d-flex flex-row justify-content-between mb-1'>
                    <Col span={14}>
                        <Breadcrumb
                            items={[
                                {
                                    title: < HomeOutlined onClick={() => navigate('/dashboard')} />,
                                },
                                {
                                    title: 'Settings ',
                                },
                                // {
                                //     title: 'An Application',
                                // },
                            ]}
                        />
                    </Col>
                </Row>
                <Row gutter={24}>
                    <Col span={24}>
                        <Tabs defaultActiveKey="/account" items={items} onChange={onChange} />
                    </Col>
                </Row>
            </Col>
        </div>
    );
};

export default Settings;
