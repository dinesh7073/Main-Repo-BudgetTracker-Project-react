import React, { useContext, useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { BiCoin } from "react-icons/bi";
import { GoGoal } from "react-icons/go";
import { Avatar, Button, Dropdown, MenuProps, Popconfirm, Popover } from "antd";
import { IoIosNotificationsOutline } from "react-icons/io";
import { Layout, Menu, theme } from "antd";
import {
  ArrowRightLeft,
  CircleHelp,
  CircleUserRound,
  LayoutDashboard,
  LogOut,
  Settings,
  UserRound,
} from "lucide-react";

import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import UserContext from "../UserContext";
import logo from "../images/logo.png";
import "../CSS/Sidebar.css";
import "../CSS/ThemeColors.css";
import PageRoutes from "../Components/Common/PageRoutes";
import { UserOutlined } from "@ant-design/icons";
import axios from "axios";
import { REACT_APP_BASE_URL } from "../Components/Common/Url";

const { Header, Sider, Content } = Layout;

const Sidebar: React.FC = () => {

  const { setUserId, userDetails, setIsSignUp, setIsLogin } = useContext<any>(UserContext);
  const userLastName = userDetails.LastName;
  const userFirstName = userDetails.FirstName;
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const location = useLocation();
  const selectedKey = location.pathname;
  const navigate = useNavigate();




  const handleLogout = () => {
    window.location.reload();
    localStorage.removeItem("isUser");
    navigate("/login");
    setUserId("");
    setIsSignUp(false);
    setIsLogin(false);
  };


  const [open, setOpen] = useState(false);

  const hide = () => {
    setOpen(false);
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
  };


  const items: MenuProps["items"] = [




    // {
    //   label: (
    //     <Link
    //       className="itemsLink"
    //       to="/account"
    //       style={{ display: "flex", alignItems: "center" }}
    //     >
    //       <UserRound style={{ marginRight: "8px", fontWeight: 100 }} /> Account{" "}
    //     </Link>
    //   ),
    //   key: "1",
    // },

    //================== Srttings compo off=============
    // {
    //   label: (
    //     <Link
    //       className="itemsLink"
    //       to="/settings"
    //       style={{ display: "flex", alignItems: "center" }}
    //     >
    //       <Settings style={{ marginRight: "15px" }} /> Settings{" "}
    //     </Link>
    //   ),
    //   key: "2",
    // },
    // {
    //   label: (
    //     <Link
    //       className="itemsLink"
    //       to={"/login"}
    //       style={{ display: "flex", alignItems: "center" }}
    //       onClick={handleLogout}
    //     >
    //       <LogOut style={{ marginRight: "8px" }} /> Logout{" "}
    //     </Link>
    //   ),
    //   key: "3",
    // },
  ];


  const siderMenuItems = [
    {
      key: "/dashboard",
      icon: <LayoutDashboard className="fs-4" style={{ color: "rgb(105, 114, 122)" }} />,
      label: "Dashboard",
      onClick: () => navigate("/dashboard"),
    },
    {
      key: "/budget",
      icon: <BiCoin className="fs-4" style={{ color: 'rgb(105, 114, 122)' }} />,
      label: "Budget",
      onClick: () => navigate("/budget"),
    },
    {
      key: "/goal",
      icon: <GoGoal className="fs-4" style={{ color: 'rgb(105, 114, 122)' }} />,
      label: "Goals",
      onClick: () => navigate("/goal"),
    },
    {
      key: "/transaction",
      icon: <ArrowRightLeft style={{ color: 'rgb(105, 114, 122)' }} />,
      label: "Transactions",
      onClick: () => navigate("/transaction"),
    },
    {
      key: "/profile",
      icon: <UserRound style={{ color: 'rgb(105, 114, 122)' }} />,
      label: "Profile",
      onClick: () => navigate("/profile"),
    },
    {
      key: "/settings/account",
      icon: <Settings style={{ color: 'rgb(105, 114, 122)' }} />,
      label: "Settings",
      onClick: () => navigate("/settings/account"),
    },
    // ================== help compo on=====================
    {
      key: "/help",
      icon: <CircleHelp className="fs-4 fw-light" style={{ color: 'rgb(105, 114, 122)' }} />,
      label: "Help",
      onClick: () => navigate("/help"),
    },

  ];


  return (


    <>
      <Layout style={{ height: "100vh" }}>
        <Sider className="" collapsible collapsed={collapsed} onCollapse={(value: any) => setCollapsed(value)} style={{
          overflow: "auto", height: "100vh", scrollbarWidth: "thin", position: "fixed", left: 0, top: 0, bottom: 0, borderRight: "#D2D6D9", backgroundColor: "white",
        }}
        >
          <div className="demo-logo-vertical" />
          <img width={160} height={55} style={{
            marginLeft: "19px",
            padding: "3px 0px 0px 0px ",
          }}
            src={logo}
            alt="" />
          {/* {collapsed ? "" : <hr style={{ color: "gray", margin: "0px" }} />} */}
          <Menu
            selectedKeys={[selectedKey]}
            mode="inline"
            defaultSelectedKeys={["1"]}
            className=""
            style={{ marginTop: "10px" }}
            items={siderMenuItems} />
        </Sider>
        <Layout
          style={{ marginLeft: collapsed ? 80 : 200, height: "100vh", overflow: "auto", background: '#f3f4fa' }}>

          <Header className='headernav-background'
            style={{
              padding: 0,
              //  background: colorBgContainer,
              //   backgroundColor: "#ffffff",
              display: "flex",
              justifyContent: "space-between",
              height: "7vh",
              position: "sticky",
              top: 0,
              zIndex: 10,
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
            }}
          >
            <h5 className="align-self-center ps-4 my-1" style={{  color: 'rgb(105, 114, 122)' , fontSize: '14px', fontFamily: "Open Sans" }}>
              Hello, {userDetails.firstName}{" "}
            </h5>
            <div style={{ cursor: 'pointer' }} className="d-flex flex-row justify-content-between  align-item-center">
              <div>
                {/* <p style={{ margin: '0px' }}>My Wallet : {UserWallet}</p> */}

              </div>
              {/* <IoIosNotificationsOutline className="fs-2 align-self-center pe-2" /> */}

              {/* <Dropdown menu={{ items }} placement="bottom" arrow trigger={['click']} overlayStyle={{ width: '260px', alignItems: 'center', textAlign: 'center', }}>

                <div
                  className="d-flex flex-row pe-3"
                  style={{ alignItems: "center", marginRight: "10px", textAlign: 'center' }}
                >
                  <Avatar size={30} icon={<UserOutlined />} className="align-self-center me-2" />
                  <p style={{ margin: "0px", fontSize: '14px', fontFamily: "Open Sans" }}>{userDetails.firstName} {userDetails.lastName}</p>
                </div>
              </Dropdown> */}

              <Popover content={<div className="d-flex flex-row pe-3" style={{ alignItems: "center", marginRight: "10px", textAlign: 'center', }}>
                <div className=" ms-5" style={{ justifyContent: 'space-between', width: '190px', height: '150px', textAlign: 'center' }}>
                  <Avatar size={25} icon={<UserOutlined />} style={{ textAlign: 'center' }} />
                  <div className="mt-2 ">
                    <p style={{ margin: "0px", fontSize: '14px', fontFamily: "Open Sans" }}>{userDetails.firstName} {userDetails.lastName} </p>
                    {userDetails.email}
                  </div >

                  <div className="mt-4 ms-1">
                    <Link
                      className="itemsLink"
                      to="/profile"
                      style={{ display: "flex", alignItems: "center" }}
                    >
                      <UserRound size={15} style={{ marginRight: "8px", fontWeight: 100 }} /> Profile{" "}
                    </Link>

                  </div>

                  <div className="mt-2 ms-1">
                    <Link
                      className="itemsLink"
                      to={"/login"}
                      style={{ display: "flex", alignItems: "center" }}
                      onClick={handleLogout}
                    >
                      <LogOut size={15} style={{ marginRight: "8px" }} /> Logout{"  "}
                    </Link></div>




                </div>
              </div>


              }

                trigger="click"
                open={open}
                onOpenChange={handleOpenChange} >
                <div className="d-flex flex-row pe-1" style={{ alignItems: "center", marginRight: "10px", textAlign: 'center' }}>
                  <Avatar size={30} icon={<UserOutlined />} className="align-self-center me-2" />
                  <p style={{ margin: "0px", fontSize: '14px', fontFamily: "Open Sans" }}></p>
                </div>

              </Popover>

            </div>
          </Header>

          <Content
            className="main-background"
            style={{
              margin: "20px",
              // padding: 12,
              backgroundColor: "#f3f4fa",
              borderRadius: borderRadiusLG,
              overflowY: "auto",
              height: "calc(100vh - 10vh)",
            }}
          >
            <PageRoutes />
          </Content>
        </Layout>
      </Layout></>
  );
};

export default Sidebar;
