import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Account from '../Account'
import Budget from '../Budget'
import Dashboard from '../Dashboard';
import HelpCompo from '../HelpCompo'
import Transactions from '../Transactions'
import Goal from '../Goal'
import SettingsCompo from '../SettingsCompo'
import ErrorPage from '../ErrorPage'
import Home from '../Home'
import Welcome from '../../Login-Section/Welcome';

const PageRoutes = () => {
    return (
        <div>
            <Routes>
                
                <Route path='/' element={<Dashboard/>}/>
               
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/goal" element={<Goal />} />
                <Route path="/transaction" element={<Transactions />} />
                <Route path="/budget" element={<Budget />} />
                <Route path="/profile" element={<Account />} />
                <Route path="/settings/*" element={<SettingsCompo />} />
                <Route path="/help" element={<HelpCompo />} />
                <Route path="/addBalance" element={<Welcome />} />
                <Route path="*" element={<ErrorPage />} />
            </Routes>
        </div>
    )
}

export default PageRoutes