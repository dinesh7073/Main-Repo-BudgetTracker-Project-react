// import React, { useState } from 'react';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import { BiCoin } from "react-icons/bi";
// import { GoGoal } from "react-icons/go";
// import { Dropdown, MenuProps } from 'antd';
// import { IoIosNotificationsOutline } from "react-icons/io";
// import { Button, Layout, Menu, theme } from 'antd';
// import {
//     ArrowRightLeft, ChevronLeft, ChevronRight, CircleHelp,
//     CircleUserRound, LayoutDashboard, LogOut, Settings, UserRound, WalletCards
// } from 'lucide-react';
// import Search from 'antd/es/input/Search';
// import Dashboard from './Components/Dashboard';
// import Budget from './Components/Budget';
// import Transaction from './Components/Transactions';
// import { Link, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
// import Goal from './Components/Goal';

// interface Expense {
//     date: string;
//     category: string;
//     amount: number;
//     type: string;
// }

// const { Header, Sider, Content } = Layout;

// const App: React.FC = () => {
//     const [collapsed, setCollapsed] = useState(false);
//     const {
//         token: { colorBgContainer, borderRadiusLG },
//     } = theme.useToken();

//     const location = useLocation();
//     const selectedKey = location.pathname;

//     const items: MenuProps['items'] = [
//         {
//             label: 'Account',
//             icon: <UserRound />,
//             key: '1',
//         },
//         {
//             label: 'Settings',
//             icon: <Settings />,
//             key: '2',
//         },
//         {
//             label: 'Logout',
//             icon: <LogOut />,
//             key: '3',
//         },
//     ];
//     const [expenses, setExpenses] = useState<Expense[]>([]);
//     const [budgets, setBudgets] = useState<Budget[]>([
//         { date: "", category: "Housing", amount: 0, spent: 0, type: "Cash" },
//         { date: "", category: "Food & Beverages", amount: 0, spent: 0, type: "Cash" },
//         { date: "", category: "Shopping", amount: 0, spent: 0, type: "Cash" },
//         { date: "", category: "Income", amount: 0, spent: 0, type: "Cash" },
//         { date: "", category: "Life & Entertainment", amount: 0, spent: 0, type: "Cash" },
//         { date: "", category: "Communication & PC", amount: 0, spent: 0, type: "Cash" },
//         { date: "", category: "Vehicle & Transportation", amount: 0, spent: 0, type: "Cash" },
//         { date: "", category: "Other", amount: 0, spent: 0, type: "Cash" },

//     ]);

//     const handleExpenseAdd = (expense: Expense) => {

//         setExpenses([...expenses, expense]);

//         setBudgets(prevBudgets =>
//             prevBudgets.map(budget =>
//                 budget.category === expense.category
//                     ? { ...budget, spent: budget.spent + expense.amount }
//                     : budget
//             )
//         );
//     };
//     const handleExpenseDelete = (expenseToDelete: Expense) => {
//         setExpenses(expenses.filter(expense => expense !== expenseToDelete));
//     };

//     var navigate = useNavigate();

//     return (

//         <Layout style={{ height: '100vh' }}>
//             {/* Sidebar */}
//             <Sider
//                 trigger={null}
//                 collapsible
//                 collapsed={collapsed}
//                 style={{
//                     overflow: 'auto',
//                     height: '100vh',
//                     position: 'fixed',
//                     left: 0,
//                     top: 0,
//                     bottom: 0,
//                     background: "#ffffff",
//                     borderRight: '#D2D6D9'
//                 }}
//             >
//                 <div className="demo-logo-vertical" />

//                 <h5 className='pt-3 text-center'><img src="Logo.png" /></h5>
//                 {collapsed ? "" : <hr style={{ color: "gray" }} />}

//                 <Menu
//                     selectedKeys={[selectedKey]}
//                     mode="inline"
//                     defaultSelectedKeys={['1']}
//                     style={{ background: "#ffffff" }}
//                     items={[
//                         {
//                             key: "2",
//                             label: collapsed ? <hr /> : "Menu",
//                         },
//                         {


//                             key: "/",
//                             icon: <Link to="/"><LayoutDashboard /></Link>,
//                             label: "Dashboard",
//                         },
//                         {
//                             key: "/budget",
//                             icon: <Link to="/budget"><BiCoin className='fs-4' /></Link>,
//                             label: "Budget",
//                         },
//                         {
//                             key: "/goal",
//                             icon: <Link to="/goal" ><GoGoal className='fs-4' /></Link>,
//                             label: "Goal",
//                         },
//                         {
//                             key: "/transaction",
//                             icon: <Link to="/transaction" > <ArrowRightLeft /></Link>,
//                             label: "Transaction",
//                         },
//                         {
//                             key: "3",
//                             label: collapsed ? <hr /> : "Account"
//                         },
//                         {
//                             key: "/account",
//                             icon: <Link to="/account"> <UserRound /></Link>,
//                             label: "Account",
//                         },
//                         {
//                             key: "/settings",
//                             icon: <Link to="/settings"><Settings /></Link>,
//                             label: "Settings",
//                         },
//                         {
//                             key: "/help",
//                             icon: <Link to="/help"><CircleHelp /></Link>,
//                             label: "Help",
//                         },
//                         {
//                             key: "4",
//                             label: collapsed ? <hr /> : "Other",
//                         },
//                         {
//                             key: "/logout",
//                             icon: <Link to="/logout"> <LogOut /></Link>,
//                             label: "Logout",
//                         },
//                     ]}
//                 />

//                 <Button
//                     type="text"
//                     icon={collapsed ? <ChevronRight /> : <ChevronLeft />}
//                     onClick={() => setCollapsed(!collapsed)}
//                     style={{
//                         fontSize: '16px',
//                         width: 64,
//                         height: 64,
//                         float: 'right',
//                         marginTop: '50px',
//                     }}
//                 />
//             </Sider>

//             {/* Main Layout */}
//             <Layout style={{ marginLeft: collapsed ? 80 : 200, height: '100vh', overflow: 'auto' }}>
//                 {/* Header */}
//                 <Header
//                     style={{
//                         padding: 0,
//                         background: colorBgContainer,
//                         backgroundColor: "#ffffff",
//                         display: 'flex',
//                         justifyContent: 'space-between',
//                         height: "55px",
//                         position: 'sticky',
//                         top: 0,
//                         zIndex: 10,
//                         boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
//                     }}
//                 >
//                     <h5 className='align-self-center ps-4 my-1'>Hello, Nikita!</h5>
//                     <div className='d-flex flex-row justify-content-between'>
//                         <Search
//                             style={{ width: "300px" }}
//                             placeholder="Search"
//                             className='align-self-center px-3 py-0'
//                         />
//                         <IoIosNotificationsOutline className='fs-2 align-self-center pe-2' />

//                         <Dropdown menu={{ items }} placement="bottom" arrow>
//                             <div className='d-flex flex-row pe-3'>
//                                 <CircleUserRound
//                                     style={{
//                                         alignSelf: 'center',
//                                     }}
//                                 />
//                             </div>
//                         </Dropdown>
//                     </div>
//                 </Header>

//                 {/* Content Area */}
//                 <Content
//                     style={{
//                         margin: '18px 16px',
//                         padding: 12,
//                         background: colorBgContainer,
//                         borderRadius: borderRadiusLG,
//                         overflowY: 'auto',
//                         height: 'calc(100vh - 55px)', // Adjust to match the height minus the header
//                     }}
//                 >
//                     <Routes>
//                         <Route path="/" element={<Dashboard />} />
//                         <Route path="/budget" element={<Budget budgets={budgets} setBudgets={setBudgets} expenses={expenses} onBudgetDelete={function (budget: Budget): void {
//                             throw new Error('Function not implemented.');
//                         } } onAddBudget={function (budget: Budget): void {
//                             throw new Error('Function not implemented.');
//                         } } />} />
//                         <Route path="/goal" element={<Goal />} />
//                         <Route path="/transaction" element={<Transaction onExpenseAdd={handleExpenseAdd} expenses={expenses} onExpenseDelete={handleExpenseDelete}  />} />
//                     </Routes>
//                 </Content>
//             </Layout>
//         </Layout>
//     );
// };

// export default App;
