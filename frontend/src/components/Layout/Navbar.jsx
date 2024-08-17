import React, { useContext, useState } from "react";
import { Context } from "../../main";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { GiHamburgerMenu } from "react-icons/gi";

const Navbar = () => {
  const [show, setShow] = useState(false); // show state menu toggle karne ke liye use hoti hai.
  const { isAuthorized, setIsAuthorized, user } = useContext(Context); // useContext se isAuthorized, setIsAuthorized, aur user ko Context se access kiya ja raha hai.
  const navigateTo = useNavigate();  // useNavigate hook ko navigation ke liye use kiya ja raha hai.

  const handleLogout = async () => {
    try {
      const response = await axios.get(
        "http://localhost:4000/api/v1/user/logout",  // axios.get se logout request backend ko bheji jaati hai.
        {
          withCredentials: true,
        }
      );
      toast.success(response.data.message); // Agar request successful hoti hai, to success message display hota hai,
      setIsAuthorized(false); // setIsAuthorized(false) call hota hai,
      navigateTo("/login");   // aur user ko /login route par navigate kar diya jaata hai.
    } catch (error) {
      toast.error(error.response.data.message);
      setIsAuthorized(true); // Agar request mein error aata hai, to error message display hota hai aur setIsAuthorized(true) call hota hai.
    }
  };

  /*
      When you call toast.success or toast.error, a notification message appears on the screen, 
      typically as a small popup or banner.

      Success Message: When the logout request is successful, toast.success(response.data.message) will display 
      a green or positive-themed toast with the success message received from the server.
      
      Error Message: If there's an error during the logout request, toast.error(error.response.data.message) 
      will display a red or negative-themed toast with the error message received from the server.

  */

 return (
    <nav className={isAuthorized ? "navbarShow" : "navbarHide"}> 
      <div className="container">
        <div className="logo">
          <img src="/JobZee-logos__white.png" alt="logo" />
        </div>
        <ul className={!show ? "menu" : "show-menu menu"}>
          <li>
            <Link to={"/"} onClick={() => setShow(false)}>
              HOME
            </Link>
          </li>
          <li>
            <Link to={"/job/getall"} onClick={() => setShow(false)}>
              ALL JOBS
            </Link>
          </li>
          <li>
            <Link to={"/applications/me"} onClick={() => setShow(false)}>
              {user && user.role === "Employer"
                ? "APPLICANT'S APPLICATIONS"
                : "MY APPLICATIONS"}
            </Link>
          </li>
          {user && user.role === "Employer" ? (
            <>
              <li>
                <Link to={"/job/post"} onClick={() => setShow(false)}>
                  POST NEW JOB
                </Link>
              </li>
              <li>
                <Link to={"/job/me"} onClick={() => setShow(false)}>
                  VIEW YOUR JOBS
                </Link>
              </li>
            </>
          ) : (
            <></>
          )}
         
        <button onClick={handleLogout}>LOGOUT</button>
         </ul>
         <div className="hamburger">
          <GiHamburgerMenu onClick={() => setShow(!show)} />
         </div>
      </div>
    </nav>

        /* 
           *nav tag isAuthorized ke basis par navbarShow ya navbarHide class ko apply karta hai.
           *div.container ke andar logo aur navigation menu (ul.menu) hai.
           *ul.menu me Link components hain jo different routes par navigate karte hain aur setShow(false) ko call karte hain jab link click hota hai.
           *Agar user.role "Employer" hai, to additional menu items "POST NEW JOB" aur "VIEW YOUR JOBS" dikhte hain.
           *Logout button handleLogout function ko call karta hai.
           *div.hamburger me GiHamburgerMenu icon hai jo show state ko toggle karta hai.
        */
  );
};

export default Navbar;