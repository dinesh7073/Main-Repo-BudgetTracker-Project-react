import React from 'react'
import { Breadcrumb, Col, Row, Tabs } from 'antd'
import { HomeOutlined } from '@ant-design/icons'
import { useNavigate, useLocation, Routes, Route, Navigate } from 'react-router-dom'
import ErrorPage from './ErrorPage'
import AccountsCompo from './Settings-children\'s/AccountsCompo'
import CategoriesCompo from './Settings-children\'s/CategoriesCompo'

export default function Settings() {
    const navigate = useNavigate()
    const location = useLocation()

    const items = [
        {
            key: 'accounts',
            label: 'Accounts',
        },
        {
            key: 'categories',
            label: 'Categories',
        },
        {
            key: 'personal',
            label: 'Personal',
        },
    ]

    const activeKey = location.pathname.split('/').pop() || 'accounts'
    return (
        <div style={{ padding: '10px 16px 16px 16px', backgroundColor: 'white' }}>
            <Col span={24}>
                <Row gutter={24} className="d-flex flex-row justify-content-between mb-1">
                    <Col span={14}>
                        <Breadcrumb
                            items={[
                                {
                                    title: <HomeOutlined onClick={() => navigate('/dashboard')} />,
                                },
                                {
                                    title: 'Settings',
                                },
                            ]}
                        />
                    </Col>
                </Row>
                <Row gutter={24}>
                    <Col span={24}>
                        <Tabs
                            activeKey={activeKey}
                            items={items}
                            onChange={(key) => {
                                navigate(`/settings/${key}`)
                            }}
                        />
                        <Routes>
                            <Route index element={<Navigate to="accounts" replace />} />
                            <Route path="accounts" element={<AccountsCompo />} />
                            <Route path="categories" element={<CategoriesCompo />} />
                            <Route path="personal" element={<ErrorPage />} />
                        </Routes>
                    </Col>
                </Row>
            </Col>
        </div>
    )
}