import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Account from '../Account'
import Budget from '../Budget'
import Dashboard from '../Dashboard'
import HelpCompo from '../HelpCompo'
import Transactions from '../Transactions'
import Goal from '../Goal'

const PageRoutes = () => {
    return (
        <div>
            <Routes>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/goal" element={<Goal />} />
                <Route path="/transaction" element={<Transactions />} />
                <Route path="/budget" element={<Budget />} />
                <Route path="/account" element={<Account />} />
                {/* <Route path="/settings" element={<SettingsCompo />} /> */}
                <Route path="/help" element={<HelpCompo />} />
            </Routes>
        </div>
    )
}

export default PageRoutes