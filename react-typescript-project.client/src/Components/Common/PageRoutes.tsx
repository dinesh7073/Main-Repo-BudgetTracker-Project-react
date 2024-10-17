import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Account from '../Account'
import Budget from '../Budget'
import Dashboard from '../Dashboard'
import HelpCompo from '../HelpCompo'
import Transactions from '../Transactions'
import Goal from '../Goal'
import SettingsCompo from '../SettingsCompo'
import ErrorPage from '../ErrorPage'
import Home from '../Home'

const PageRoutes = () => {
    return (
        <div>
            <Routes>
                {/* <Route path='/'element={<Home/>}/> */}
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/goal" element={<Goal />} />
                <Route path="/transaction" element={<Transactions />} />
                <Route path="/budget" element={<Budget />} />
                <Route path="/profile" element={<Account />} />
                <Route path="/settings/account" element={<SettingsCompo />} />
                <Route path="/help" element={<HelpCompo />} />
                <Route path="*" element={<ErrorPage />} />
            </Routes>
        </div>
    )
}

export default PageRoutes