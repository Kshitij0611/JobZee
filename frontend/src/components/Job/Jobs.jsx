import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../../main";

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const { isAuthorized } = useContext(Context);
  const navigateTo = useNavigate();

  useEffect(() => {
    try {
      axios
        .get("http://localhost:4000/api/v1/job/getall", {
          withCredentials: true,
        })
        .then((res) => {
          setJobs(res.data);
        });
    } catch (error) {
      console.log(error);
    }
  }, []);

  /*
      axios.get request ek promise return karta hai. Jab request successful hoti hai, to .then block execute hota hai.
      res parameter me server se response milta hai. res.data me actual data hota hai jo server se fetch kiya gaya hai.
      setJobs(res.data) call hota hai, jo jobs state ko update karta hai fetched data ke saath.
  */

  if (!isAuthorized) {
    navigateTo("/");
  }

  return (
    <section className="jobs page">
      <div className="container">
        <h1>ALL AVAILABLE JOBS</h1>
        <div className="banner">
          {jobs.jobs &&
            jobs.jobs.map((element) => {
              return (
                <div className="card" key={element._id}>
                  <p>{element.title}</p>
                  <p>{element.category}</p>
                  <p>{element.country}</p>
                  <Link to={`/job/${element._id}`}>Job Details</Link>
                </div>
              );
            })}
        </div>
      </div>
    </section>
  );
};

export default Jobs;


/*
    Maan lijiye aapka jobs state aise initialize hua hai:
    const [jobs, setJobs] = useState({
            jobs: []
          });

    Jab aap data fetch karte hain, maan lijiye aapko backend se kuch aisa response milta hai:
      {
        "jobs": [
          {
            "_id": "1",
            "title": "Software Engineer",
            "category": "IT",
            "country": "USA"
          },
          {
            "_id": "2",
            "title": "Product Manager",
            "category": "Management",
            "country": "UK"
          }
        ]
     }

    First jobs: Yeh state ka naam hai jo aapne useState hook me define kiya hai.
    Second jobs: Yeh property ka naam hai jo backend se aayi data response me hai. 
                 Yeh ek array hai jo multiple job objects ko contain karti hai.

*/
