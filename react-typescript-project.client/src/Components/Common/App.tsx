import { useEffect, useState } from "react";
import "./App.css";
import Sidebar from "../../Main-Compos/Sidebar";
import UserContext from "../../UserContext";
import { Route, Routes, useNavigate } from "react-router-dom";
import SignUpSection from "../../Login-Section/SignUpSection";
import { Dayjs } from "dayjs";
import '../../CSS/Dashboard.css'
import { notification } from "antd";
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

function App() {
  const [isLogin, setIsLogin] = useState<boolean>(false);
  const [isSignUp, setIsSignUp] = useState<boolean>(false);

  const [baseUrl, setBaseUrl] = useState<string>('https://localhost:7054/');

  // const [UserId, setUserId] = useState<string>('');
  const navigate = useNavigate();
  // const [userdata, setUserdata] = useState({});
  const [userDetails, setUserDetails] = useState<any>({});
  // const [UserWallet, setUserWallet] = useState<number>();
  const [transactionData, setTransactionData] = useState<TransactionType[]>([]); //

  useEffect(() => {
    const storedUser = localStorage.getItem('isUser');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        // const parsedUserId = parsedUser.UserId;
        if (parsedUser.UserId) {
          // setUserId(parsedUserId);
          // setUserdata(parsedUser);
          setUserDetails(parsedUser);
          navigate('/');
          setIsLogin(true);


        } else {

          ShowError('failed to retrieve info')
        }
      } catch (error) {
        console.log(error, "somethiing")
        alert("Failed to retrieve user information.");
      }
    } else {
      setIsLogin(false);
      navigate('/login');
    }
  }, [isLogin]);

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
    <UserContext.Provider value={{ isLogin, setIsLogin, isSignUp, setIsSignUp, userDetails, transactionData, setTransactionData, setUserDetails, baseUrl, setBaseUrl }}>
      <div>
        {isLogin && <Sidebar />}
        <Routes>
          {/* <Route path='/home' element={<Home />}/> */}
          <Route path='/login' element={<SignUpSection />} />
          <Route path='/signup' element={<SignUpSection />} />
        </Routes>
      </div>
    </UserContext.Provider>
  );
}

export default App;
