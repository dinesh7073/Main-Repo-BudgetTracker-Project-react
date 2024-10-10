import React from 'react';

import type { CollapseProps } from 'antd';
import { Card, Collapse } from 'antd';
import { BadgeDollarSign, Navigation, Pencil, Settings, History, HeartHandshake, Goal, CircleHelp } from 'lucide-react';


const App: React.FC = () => {
  const onChange = (key: string | string[]) => {
    console.log(key);
  };

  return <Card style={{ height: '100vh', fontFamily: 'open Snas' }}>

    {/* <h2 className='text-center' style={{ backgroundColor: ' rgb(236, 236, 236) ', fontFamily: 'Open Sans' }}><CircleHelp size={37} /> Welcome to the Budget Tracker Help Center</h2>
    <div className='text-center '><h6> Here, you’ll find all the information you need to make the most
    </h6>
            <h6> out of our app. Whether you’re new to budgeting or just need a</h6>
            
            <h6>refresher, this guide will walk you through each feature of the app,{" "}</h6>
           
           <h6>  from setting up your account to tracking your financial goals.</h6></div> */}
    <Collapse items={items} className='pt-4' defaultActiveKey={['1']} onChange={onChange} />
  </Card>
};

const text = ` The dashboard is your central hub for viewing your financial status.   It provides a quick summary of  your budgets,transactions, and goals. Access different sections such.`;
const text1 = `  Navigate to the "Budgets" section from the   dashboard.Click on "Add Budget" to create a new budget.  Select a category (e.g., Shopping, Food & Drinks, Entertainment).  Enter the budgeted amount .Save your budget to start tracking your  expenses. `;
const text2 = `To make changes, click on the budget card and select "Edit."Adjust the amount, category, or time period   as needed.`;
const text3 = ` Go to the "Transactions" section. Click "Add Transaction" to log a new income or expense. Enter the amount, select the category, and  add a description if needed. Save the transaction to update your        budget and reports`;
const text4 = `    Your transactions are listed by date, with filters available for easy searching. You can filter by category, date range, or transaction type (income/expense).`;
const text5 = ` Navigate to the "Goals" section. Click on "Add Goal" to set up a   new financial goal. Enter the goal name, target amount, and the            deadline.`;

const items: CollapseProps['items'] = [
  {
    key: '1',
  
    label: <h6  style={{ color: 'rgb(105, 114, 122)' }}     ><Navigation size={15} className='ms-3'   />   Navigating the Dashboard</h6>,
    children: <p>{text}</p>,

  },
  {
    key: '2',
    label: <h6   style={{ color: 'rgb(105, 114, 122)' }}  >  <Settings size={15} className='ms-3' />    Creating and Managing Budgets Setting Up a Budget</h6>,
    children: <p>{text1}</p>,
  },
  {
    key: '3',
    label: <h6  style={{ color: 'rgb(105, 114, 122)' }}  > <Pencil size={15} className='ms-3' />    Editing a Budget</h6>,
    children: <p>{text2}</p>,
  },

  {
    key: '4',
    label: <h6  style={{ color: 'rgb(105, 114, 122)' }}  ><BadgeDollarSign size={15} className='ms-3' />    Tracking Transactions Adding Transactions</h6>,
    children: <p>{text3}</p>,
  },
  {
    key: '5',
    label: <h6  style={{ color: 'rgb(105, 114, 122)' }}  ><History size={15} className='ms-3' />    Viewing Transaction History</h6>,
    children: <p>{text4}</p>,
  },

  {
    key: '6',
    label: <h6  style={{ color: 'rgb(105, 114, 122)' }}  > <Goal size={15} className='ms-3' />  Setting Financial Goals Creating a Goal</h6>,
    children: <p>{text5}</p>,
  },
];



export default App;

