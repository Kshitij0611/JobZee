import React, { useContext, useEffect } from "react";
import "./App.css";
import { Context } from "./main";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import { Toaster } from "react-hot-toast";
import axios from "axios";
import Navbar from "./components/Layout/Navbar";
import Footer from "./components/Layout/Footer";
import Home from "./components/Home/Home";
import Jobs from "./components/Job/Jobs";
import JobDetails from "./components/Job/JobDetails";
import Application from "./components/Application/Application";
import MyApplications from "./components/Application/MyApplications";
import PostJob from "./components/Job/PostJob";
import NotFound from "./components/NotFound/NotFound";
import MyJobs from "./components/Job/MyJobs";

const App = () => {
  /*
    Yahaan par useContext hook ka use karke, hum Context se isAuthorized, setIsAuthorized, 
    aur setUser ko access kar rahe hain. Context global state ko share karne ke liye use hota hai.
  */
  const { isAuthorized, setIsAuthorized, setUser } = useContext(Context);
  
  useEffect(() => { // useEffect ek React hook hai jo side effects handle karne ke liye use hota hai, jaise ki data fetching, subscriptions, ya manually DOM updates
    const fetchUser = async () => {  // fetchUser ek asynchronous function hai jo user data ko backend se fetch karne ke liye use hota hai.
      /*
          axios.get request backend endpoint http://localhost:4000/api/v1/user/getuser par bheja jaata hai.
          withCredentials: true ka matlab hai ki cookies bhi request ke saath send ki jaayengi.
          Agar request successful hoti hai, to response.data.user ko setUser se set kar dete hain.
          setIsAuthorized(true) ko call karke user ko authorized mark karte hain.
      */
      try {
        const response = await axios.get(
          "http://localhost:4000/api/v1/user/getuser",
          {
            withCredentials: true,
          }
        );
        setUser(response.data.user);  // response.data: This is the actual data payload that the server sent back, 
        setIsAuthorized(true);        // which usually contains the main content of the response. In this case, response.data 
      } catch (error) {               // is an object that includes your user object and any other relevant data.
        setIsAuthorized(false);
      }
    };
    fetchUser(); // fetchUser function ko useEffect ke andar call kiya jaata hai taaki component mount hone par yeh execute ho.

  }, [isAuthorized]);  // useEffect ka dependency array [isAuthorized] hai, jo ensure karta hai ki fetchUser tab execute ho jab isAuthorized state change hoti hai.

  /*
    Initial render mein isAuthorized false hai, to useEffect run hoga.
    Jab isAuthorized ki value change hoti hai (false to true ya true to false), to useEffect fir se run hoga.

    Agar isAuthorized false se true ho jaata hai (successful fetch ke baad), to useEffect fir se execute ho sakta hai, 
    lekin is particular code mein uska immediate effect nahi hoga kyunki fetchUser ko dobara call karna zaroori nahi hoga.
  */

  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Home />} />
          <Route path="/job/getall" element={<Jobs />} />
          <Route path="/job/:id" element={<JobDetails />} />
          <Route path="/application/:id" element={<Application />} />
          <Route path="/applications/me" element={<MyApplications />} />
          <Route path="/job/post" element={<PostJob />} />
          <Route path="/job/me" element={<MyJobs />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
        <Toaster />
      </BrowserRouter>
    </>
  );
};

export default App;
