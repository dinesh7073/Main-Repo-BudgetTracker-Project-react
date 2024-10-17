import { useEffect, useState } from "react";
import "./App.css";
import Sidebar from "../../Main-Compos/Sidebar";
import UserContext from "../../UserContext";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import SignUpSection from "../../Login-Section/SignUpSection";
import { Dayjs } from "dayjs";
import '../../CSS/Dashboard.css'
import { notification } from "antd";
import LoginCompo from "../../Login-Section/LoginCompo";
import ForgotpassCompo from "../../Login-Section/ForgotpassCompo";
import { REACT_APP_BASE_URL } from "./Url";
import axios from "axios";
import Welcome from "../../Login-Section/Welcome";


export interface TransactionType {  // the final fileds for frontend and backend 
  id: string;
  userId: string;
  transactionType: number;
  accountType: number | null;
  categoryType: number | null;
  label: string;
  amount: number;
  date: Dayjs | null;
  time: Dayjs | null;
  currency?: string;
}
interface ExpenseLimitTypes {
  id: string;
  userId: string;
  amount: number | 0;
}interface AccountTypes {
  id: string;
  userId: string;
  bankName: string;
  accountType: number;
  amount: number;
}

function App() {
  const [isLogin, setIsLogin] = useState<boolean>(false);
  const [isSignUp, setIsSignUp] = useState<boolean>(false);


  // console.log(import.meta.env.VITE_SOME_KEY) // 123
  // console.log(import.meta.env.VITE_REACT_APP_BASE_URL,'base url') // 123


  const [userWallet, setUserWallet] = useState<number>()
  const [expensesLimit, setexpensesLimit] = useState<ExpenseLimitTypes[]>([])

  const [UserId, setUserId] = useState<string>('');
  const navigate = useNavigate();
  const location = useLocation();
  // const [userdata, setUserdata] = useState({});
  const [userDetails, setUserDetails] = useState<any>({});
  const [loader, setLoader] = useState(false);
  const [transactionData, setTransactionData] = useState<TransactionType[]>([]); //

  useEffect(() => {
    const storedUser = localStorage.getItem('isUser');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        // const parsedUserId = parsedUser.UserId;
        if (parsedUser.UserId) {

          // setUserdata(parsedUser);

          axios.get(`${REACT_APP_BASE_URL}UsersController/${parsedUser.UserId}GetUserById`).then((res) => {

            setLoader(false)
            setUserDetails(res.data);
            setUserId(userDetails?.id);
            setIsLogin(true);
            const lastRoute = localStorage.getItem('lastRoute') || '/dashboard';
            navigate(lastRoute);

          }).catch((err) => {
            setLoader(false)
            console.log('error', err);
          })



        } else {
          setLoader(false)
          ShowError('failed to retrieve info')
        }
      } catch (error) {
        console.log(error, "something")
        alert("Failed to retrieve user information.");
      }
    } else {
      setLoader(false);
      setIsLogin(false);
      navigate('/login');
    }
    setLoader(true)

  }, [isLogin]);

  useEffect(() => {

    // const locationName = location.pathname;

    if (location.pathname !== '/login' && location.pathname !== '/welcome') {
      localStorage.setItem('lastRoute', location.pathname);  // Save the current route in localStorage
    }

  }, []);

  const ShowError = (message: string) => {
    notification.error({
      message: 'error',
      description: message
    })
  }
  // useEffect((() => {
  //   const userString = localStorage.getItem('isUser');
  //   let user = null;
  //   if (userString) {
  //     try {
  //       user = JSON.parse(userString);
  //     } catch (e) {
  //       console.error('Error parsing JSON from localStorage', e);
  //     }
  //   }
  //   if (user) {
  //     navigate('/')
  //     setIsLogin(true);
  //     setUserdata(user);

  //   } else {
  //     setIsLogin(false); 
  //     navigate('/login');
  //   }
  // }), [isLogin])

  return (
    <UserContext.Provider value={{ isLogin, setIsLogin, isSignUp, setIsSignUp, userDetails, transactionData, setTransactionData, setUserDetails, UserId, userWallet, setUserWallet, expensesLimit, setexpensesLimit, loader, setLoader }}>
      <div>
        {isLogin && <Sidebar />}


        <Routes>
          {/* <Route path='/home' element={<Home />}/> */}
          <Route path='/login' element={<LoginCompo />} />
          <Route path='/signup' element={<SignUpSection />} />
          <Route path='/forgotPassword' element={<ForgotpassCompo />} />
          <Route path='/welcome' element={<Welcome />} />


        </Routes>
      </div>
    </UserContext.Provider>
  );
}

export default App;
