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
        Initial State (show = false): Menu hidden hota hai, sirf hamburger icon dikhai deta hai.
        After Click (show = true): Menu dikhai dene lagta hai, aur hamburger icon menu ko close karne ke liye ready rehta hai.
        Hamburger menu ka purpose yahi hota hai ki chhoti screens par menu ko space bachane ke liye initially hide rakha jaye, aur user ke interaction par usko dikhaya jaye.
    
        Jab user kisi Link par click karta hai, to onClick={() => setShow(false)} trigger hota hai.
        setShow(false) function execute hota hai aur show state false set kar diya jata hai.

        Initial State (show = true): Jab show true hota hai, to ul tag ke className me "show-menu menu" classes hoti hain. "show-menu" class menu ko visible banati hai.
        State Change (show = false): Jab show false ho jata hai, to "show-menu" class remove ho jati hai aur sirf "menu" class reh jati hai.
        "show-menu" class CSS ke through menu ko visible rakhti hai. Jab ye class remove hoti hai, to menu phir se hidden ya collapse ho jata hai.
    */
  );
};

export default Navbar;