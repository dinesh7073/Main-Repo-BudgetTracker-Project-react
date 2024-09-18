import React from "react";
import {
  BadgeDollarSign,
  Navigation,
  Pencil,
  Settings,
  UserPlus,
  History,
  Goal,
} from "lucide-react";
import "../CSS/HelpCompo.css";
import '../CSS/ThemeColors.css'
const HelpCompo = () => {
  return (
    <div style={{ backgroundColor: "#EBF4F6" }}>
      <div>
        <div className="Main" style={{ padding: '20px', marginBottom: '10px' }} >
          {" "}
          <h1>Help </h1>
          <h2> Welcome to the Budget Tracker Help Center</h2>
          <p className="fs-6">
            Here, you’ll find all the information you need to make the most
            <br></br>
            out of our app. Whether you’re new to budgeting or just need a
            <br></br>
            refresher, this guide will walk you through each feature of the app,{" "}
            <br></br>
            from setting up your account to tracking your financial goals.
          </p>
        </div>



        <div className="Trip" style={{ padding: '20px' }}>
          <h2>
            Use a secure password that combines letters, numbers, and symbols.
          </h2>
        </div>

        <div className="Box2 container">
          <div
            style={{

              width: "250px",
              height: "345px",
              textAlign: "center",
              alignItems: "center",
              background: "white",
              borderRadius: "12px",
              padding: '10px',
            }}
          >
            <UserPlus />
            <h3> Creating Your Account</h3>
            <h6>
              Open the Budget Tracker app.
              Click on the "Sign Up" button.
              Enter your email address and create a password.
            </h6>
          </div>
          <div
            style={{
              width: "250px",
              height: "345px",
              textAlign: "center",
              alignItems: "center",
              background: "white",
              borderRadius: "12px",
              padding: '10px',
            }}
          >
            <Navigation /> <h4>Navigating the Dashboard</h4>
            <h6>
              The dashboard is your central hub
              for viewing your financial status.
              It provides a quick summary of <br></br> your budgets,
              transactions, and goals. Access different sections <br></br>such
              as Budget, Transactions, Goals, and Settings from the sidebar.
            </h6>
          </div>
          <div
            style={{
              width: "250px",
              height: "345px",
              textAlign: "center",
              alignItems: "center",
              background: "white",
              borderRadius: "12px",
              padding: '10px',
            }}
          >
            <Settings />
            <h4>Creating and Managing Budgets Setting Up a Budget</h4>
            <h6>
              Navigate to the "Budgets" section<br></br> from the
              dashboard.Click on "Add Budget" to create a new budget.<br></br>
              Select a category (e.g., Shopping, Food & Drinks, Entertainment).
              <br></br>
              Enter the budgeted amount .Save your budget to start tracking your
              expenses.
            </h6>
          </div>
          <div
            style={{
              width: "250px",
              height: "345px",
              textAlign: "center",
              alignItems: "center",
              background: "white",
              borderRadius: "12px",
              padding: '10px',
            }}
          >
            <Pencil /> <h4>Editing a Budget</h4>
            <h6>
              To make changes, click on the budget card and <br></br>
              select "Edit."Adjust the amount, category, or time<br></br> period
              as needed.
            </h6>
          </div>
        </div>



        <div style={{width:'80%' }} className="Box3">
          <div
            style={{
              width: "250px",
              height: "300px",
              textAlign: "center",
              alignItems: "center",
              background: "white",
              borderRadius: "12px",
              padding: '10px',
            }}
          >
            <BadgeDollarSign />
            <h5>Tracking Transactions Adding Transactions</h5>
            <h6>
              Go to the "Transactions" section. Click "Add Transaction" to log a
              new income or expense. Enter the amount, select the category, and
              add a description if needed. Save the transaction to update your
              budget and reports
            </h6>
          </div>
          <div
            style={{
              width: "250px",
              height: "300px",
              textAlign: "center",
              alignItems: "center",
              background: "white",
              borderRadius: "12px",
              padding: '10px',
            }}
          >
            <History /> <h5>Viewing Transaction History</h5>
            <h6>
              Your transactions are listed by date, with filters available for
              easy searching. You can filter by category, date range, or
              transaction type (income/expense).
            </h6>
          </div>
          <div
            style={{
              width: "250px",
              height: "300px",
              textAlign: "center",
              alignItems: "center",
              background: "white",
              borderRadius: "12px",
              padding: '10px',
            }}
          >
            <Goal />
            <h5>Setting Financial Goals Creating a Goal</h5>
            <h6>
              Navigate to the "Goals" section. Click on "Add Goal" to set up a
              new financial goal. Enter the goal name, target amount, and the
              deadline.
            </h6>
          </div>
        </div>

      </div>

      <div style={{ width: '100%' }}>

        <div className="Gols container">
          <h1>Common Issues (FAQs)</h1>
        </div>
        <div style={{ marginLeft: "", padding: '20px 40px' }}>
          <div className="FA ">
            <h4>1.Why am i unable to log in ? </h4>
          </div>
          <h5>
            Solution: Ensure your using the correect email and password.
            <br></br>
            If you forgotten your password, use the "Forgot password" feature to
            reset it.
          </h5>
          <div className="FA ">
            <h4>2.why are my budget not updating? </h4>
          </div>
          <h4>
            Refresh the Budgets page .Make sure all transactions are correctly
            logged
          </h4>
          <div className="FA ">
            <h4>3.How can I track my progress towards a financial goal? </h4>
          </div>
          <h5>
            In the "Goals" section, each goal has a progress bar showing how
            close <br></br>you are to reaching it. Update your contributions
            regularly to <br></br>see real-time progress
          </h5>
        </div>
      </div>


    </div>
  );
};

export default HelpCompo;
