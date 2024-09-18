import React, { useContext } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Nav from "react-bootstrap/Nav";
import "../CSS/Home.css";
import { useNavigate } from "react-router-dom";

import UserContext from "../UserContext";
import '../CSS/ThemeColors.css'
function Home() {
  const navigate = useNavigate();
  const { setIsSignUp } = useContext(UserContext);
  const handleSignUp = () => {
    navigate("/signup");
    setIsSignUp(true);
  };
  const handleLogin = () => {
    navigate("/login");
    setIsSignUp(false);
  };

  return (
    <div style={{ backgroundColor: "#EBF4F6" }}>
      <div className="Svd` ">
        <div className="top-n">
          <div>
            <img alt=""
              className="IMG"
              src="https://cdn.pixabay.com/photo/2016/04/15/18/05/computer-1331579_640.png "
            
            />
          </div>
          <div>
            <Nav>
              <Nav.Item>
                <Nav.Link className="Nav">Home</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link className="Nav">Transactions</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link className="Nav">Goals</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link className="Nav"> Settings</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link className="Nav"> Help</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link className="Nav"> Contact</Nav.Link>
              </Nav.Item>
              <button
                className="bt"
                style={{
                  height: "40px",
                  marginRight: "7px",
                  width: "110px",
                  border: "none",
                  borderRadius: "11px",
                }}
                onClick={handleLogin}
              >
                Login
              </button>
              <button
                className="bt"
                style={{
                  height: "40px",
                  marginRight: "1px",
                  width: "110px",
                  border: "none",
                  borderRadius: "11px",
                }}
                onClick={handleSignUp}
              >
                Sign Up
              </button>
            </Nav>
          </div>
        </div>
      </div>
      <div className="H1">
        <h1>
          {" "}
          Simple Way <br></br>to manage personal Finances
        </h1>
        <button
          className="bt2"
          style={{
            height: "40px",
            marginRight: "7px",
            width: "110px",
            border: "none",
            borderRadius: "11px",
          }}
          onClick={handleLogin}
        >
          Login
        </button>
        <button
          className="bt2"
          style={{
            height: "40px",
            marginRight: "7px",
            width: "110px",
            border: "none",
            borderRadius: "11px",
          }}
          onClick={handleSignUp}
        >
          Sign Up
        </button>
      </div>
      <div className="CR123 container">
        <div className="CR1">
          <div>
            <img alt=""
              src="https://moneylover.me/img/details/Transaction@4x.png"
              style={{ height: "230px", boxShadow: "0px 3px 50px 0px  " }}
            ></img>
          </div>
          <div style={{ padding: "27px", fontFamily: "sans-serif" }}>
            <h5>
              <span style={{ fontSize: "40px" }}>Simple money tracker</span>
              <br></br>
              It takes seconds to record daily transactions. Put <br></br>them
              into clear and visualized categories such as<br></br> Expense:
              Food, Shopping or Income: Salary, Gift.
            </h5>
          </div>
        </div>
        <div className="CR2">
          <div style={{ padding: "27px", fontFamily: "sans-serif" }}>
            <h5>
              <span style={{ fontSize: "40px" }}>Painless budgeting</span>
              <br></br>
              It takes seconds to record daily transactions. Put<br></br> them
              into clear and visualized categories such as <br></br>Expense:
              Food, Shopping or Income: Salary, Gift.
            </h5>
          </div>
          <div>
            <img alt=""
              src="https://moneylover.me/img/details/budget@4x.png"
              style={{ height: "230px", boxShadow: "0px 3px 50px 0px   " }}
            ></img>
          </div>
        </div>
        <div className="CR3">
          <div>
            <img alt=""
              src="https://moneylover.me/img/details/REPORT@4x.png"
              style={{ height: "230px", boxShadow: "0px 3px 50px 0px  " }}
            ></img>
          </div>
          <div style={{ padding: "27px", fontFamily: "sans-serif" }}>
            <h5>
              <span style={{ fontSize: "40px" }}>
                The whole picture in one <br></br>place
              </span>
              <br></br>One report to give a clear view on your spending<br></br>{" "}
              patterns. Understand where your money comes and <br></br>goes with
              easy-to-read graphs.
            </h5>
          </div>
        </div>
      </div>
      <div style={{ textAlign: "center", padding: "80px" }}>
        <h2>Features our users love</h2>
      </div>
      <div className="Title12 container">
        <div className="Title1">
          <div>
            <h6>
              <span style={{ fontSize: "26px" }}>Title</span>
              <br></br>Get notified of recurring bills <br></br> and
              transactions before due <br></br> date.Manage your debts, loans
              <br></br> and payment process in one place.
            </h6>
          </div>
          <div>
            <h6>
              <span style={{ fontSize: "26px" }}>Title</span>
              <br></br>Get notified of recurring bills <br></br> and
              transactions before due <br></br> date.Manage your debts, loans
              <br></br> and payment process in one place.
            </h6>
          </div>
          <div>
            <h6>
              <span style={{ fontSize: "26px" }}>Title</span>
              <br></br>Get notified of recurring bills <br></br> and
              transactions before due <br></br> date.Manage your debts, loans
              <br></br> and payment process in one place.
            </h6>
          </div>
        </div>

        <div className="Title2 ">
          <div>
            <h6>
              <span style={{ fontSize: "26px" }}>Title</span>
              <br></br>Get notified of recurring bills <br></br> and
              transactions before due <br></br> date.Manage your debts, loans
              <br></br> and payment process in one place.
            </h6>
          </div>

          <div>
            <h6>
              <span style={{ fontSize: "26px" }}>Title</span>
              <br></br>Get notified of recurring bills <br></br> and
              transactions before due <br></br> date.Manage your debts, loans
              <br></br> and payment process in one place.
            </h6>
          </div>

          <div>
            <h6>
              <span style={{ fontSize: "26px" }}>Title</span>
              <br></br>Get notified of recurring bills <br></br> and
              transactions before due <br></br> date.Manage your debts, loans
              <br></br> and payment process in one place.
            </h6>
          </div>
        </div>
      </div>
      <div style={{ backgroundColor: "white" }}>
        <div className="PT  container">
          <div>
            <img alt=""
              src="https://www.pngmart.com/files/21/Linkedin-In-Logo-PNG-HD.png"
              style={{ height: "45px", width: "45px" }}
            ></img>
            <img alt=""
              src="https://www.logo.wine/a/logo/YouTube/YouTube-Icon-Almost-Black-Logo.wine.svg"
              style={{ height: "45px", width: "45px" }}
            ></img>
            <img alt=""
              src="https://w7.pngwing.com/pngs/730/864/png-transparent-instagram-logo-computer-icons-insta-logo-text-computer-icons-circle-thumbnail.png"
              style={{ height: "35px", width: "35px" }}
            ></img>
            <img alt=""
              src="https://w7.pngwing.com/pngs/515/1/png-transparent-twitter-logo-computer-icons-logo-twitter-icon-computer-wallpaper-monochrome-bird-thumbnail.png"
              style={{ height: "35px", width: "35px" }}
            ></img>
          </div>
          <div>
            <h6>Use cases</h6>
            <p>UI design</p>
            <p>UX design</p>
            <p>Wireframing</p>
            <p>Diagraming</p>
            <p>Brainstorming</p>
            <p>Online whiteboard</p>
            <p>Team collaboration</p>
          </div>
          <div>
            <h6>Explore</h6>
            <p>Desing</p>c'
            <p>Prototyping</p>
            <p>Developent features</p>
            <p>Desing Systems</p>
            <p>Collaboration features</p>
            <p>Desing process</p>
            <p>FigJam</p>
          </div>
          <div>
            <h6>Resources</h6>
            <p>Blog</p>
            <p>Best practices</p>
            <p>Colors</p>
            <p>Color wheel</p>
            <p>Support</p>
            <p>Developers</p>
            <p>Resourcs Library</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
