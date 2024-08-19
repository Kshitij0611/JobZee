import React, { useContext, useState } from "react";
import { FaRegUser } from "react-icons/fa";
import { MdOutlineMailOutline } from "react-icons/md";
import { RiLock2Fill } from "react-icons/ri";
import { FaPencilAlt } from "react-icons/fa";
import { FaPhoneFlip } from "react-icons/fa6";
import { Link, Navigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { Context } from "../../main";

const Register = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");

  const { isAuthorized, setIsAuthorized, user, setUser} = useContext(Context);

  const handleRegister = async (e) => {
    e.preventDefault(); // Iska use kiya jaata hai taaki form ke default submit action ko prevent kiya ja sake aur page reload na ho.
    try {
      const { data } = await axios.post(
        "http://localhost:4000/api/v1/user/register",
        { name, phone, email, role, password },  // Request body me user details (name, phone, email, role, password) bheji jaati hai.
        {
          headers: {
            "Content-Type": "application/json", // headers me "Content-Type": "application/json" set kiya gaya hai, jo batata hai ki request body JSON format me hai.
          },
          withCredentials: true, // withCredentials: true ka matlab hai ki request ke saath cookies bhi send ki jaayengi.
        }
      );
      toast.success(data.message);  // Agar request successful hoti hai, to data.message ko success toast ke roop me display kiya jaata hai.
      setUser(data.user);                           
      setName(""); 
      setEmail("");               // Form fields (name, email, password, phone, role) ko clear kiya jaata 
      setPassword("");            // hai (set to empty strings)
      setPhone("");
      setRole("");
      setIsAuthorized(true); 
    } catch (error) {
      toast.error(error.response.data.message);
      console.log(error);                         // Agar request me error aata hai, to error message ko error toast ke 
      }                                          // roop me display kiya jaata hai. error.response.data.message se error message fetch kiya jaata hai.                                         
  };

  // Agar isAuthorized true hai, to Navigate component ka use karke user ko home page ('/') par redirect kiya jaata hai.
  if(isAuthorized){
    return <Navigate to={'/'}/>
  }

  return (
    <>
      <section className="authPage">
        <div className="container">
          <div className="header">
            <img src="/JobZeelogo.png" alt="logo" />
            <h3>Create a new account</h3>
          </div>
          <form>
            <div className="inputTag">
              <label>Register As</label>
              <div>
                <select value={role} onChange={(e) => setRole(e.target.value)}>
                  <option value="">Select Role</option>
                  <option value="Employer">Employer</option>
                  <option value="Job Seeker">Job Seeker</option>
                </select>
                <FaRegUser />
              </div>
            </div>
            <div className="inputTag">
              <label>Name</label>
              <div>
                <input
                  type="text"
                  placeholder="Kshitij"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <FaPencilAlt />
              </div>
            </div>
            <div className="inputTag">
              <label>Email Address</label>
              <div>
                <input
                  type="email"
                  placeholder="ksh@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <MdOutlineMailOutline />
              </div>
            </div>
            <div className="inputTag">
              <label>Phone Number</label>
              <div>
                <input
                  type="number"
                  placeholder="12345678"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
                <FaPhoneFlip />
              </div>
            </div>
            <div className="inputTag">
              <label>Password</label>
              <div>
                <input
                  type="password"
                  placeholder="Your Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <RiLock2Fill />
              </div>
            </div>
            <button type="submit" onClick={handleRegister}>
              Register
            </button>
            <Link to={"/login"}>Login Now</Link>
          </form>
        </div>
        <div className="banner">
          <img src="/register.png" alt="register" />
        </div>
      </section>
    </>
  );
};

export default Register;
