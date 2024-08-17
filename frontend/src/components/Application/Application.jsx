import axios from "axios";
import React, { useContext, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { Context } from "../../main";

const Application = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [resume, setResume] = useState(null);

  const { isAuthorized, user } = useContext(Context);

  const navigateTo = useNavigate();

  // Function to handle file input changes
  const handleFileChange = (e) => {
    const resume = e.target.files[0];
    setResume(resume);
  };

  /* e.target.files se FileList object milta hai jo selected files ko contain karta hai.
     e.target.files[0] se pehli selected file ko access kar rahe hain.
  */

  const { id } = useParams();
  const handleApplication = async (e) => {
    e.preventDefault();  // e.preventDefault() method use kiya gaya hai taaki form submit hone par page reload na ho.
    const formData = new FormData();          // Yahan par ek FormData object banaya gaya hai. FormData browser ka built-in object hai 
    formData.append("name", name);            // jo key-value pairs ke form mein data ko hold karta hai.                            
    formData.append("email", email);          // Yeh zyadatar tab use hota hai jab humein form data ko file ke saath send karna ho (like uploading a file).
    formData.append("phone", phone);      
    formData.append("address", address);
    formData.append("coverLetter", coverLetter);
    formData.append("resume", resume);
    formData.append("jobId", id);                                         
    

    try {
      const { data } = await axios.post(
        "http://localhost:4000/api/v1/application/post",
        formData,   // formData object request ki body ke form mein bheja ja raha hai.
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",  // header set kiya gaya hai taaki server ko pata chale ki form data ke saath file bhi send ho rahi hai.
          },
        }
      ); 
      setName("");               // Agar request successful hoti hai, toh form ke saare state variables ko reset kar diya jata hai. Iska matlab hai ki form fields khali ho jati hain.
      setEmail("");
      setCoverLetter("");
      setPhone("");
      setAddress("");
      setResume("");
      toast.success(data.message);
      navigateTo("/job/getall");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  if (!isAuthorized || (user && user.role === "Employer")) {
    navigateTo("/");
  }

  return (
    <section className="application">
      <div className="container">
        <h3>Application Form</h3>
        <form onSubmit={handleApplication}>
          <input
            type="text"
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="email"
            placeholder="Your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="number"
            placeholder="Your Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <input
            type="text"
            placeholder="Your Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          <textarea
            placeholder="CoverLetter..."
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
          />
          <div>
            <label
              style={{ textAlign: "start", display: "block", fontSize: "20px" }}
            >
              Select Resume
            </label>
            <input
              type="file"
              accept=".pdf, .jpg, .png"
              onChange={handleFileChange}
              style={{ width: "100%" }}
            />
          </div>
          <button type="submit">Send Application</button>
        </form>
      </div>
    </section>
  );
};

export default Application;
