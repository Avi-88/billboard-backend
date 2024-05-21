import React, { useState, useEffect } from "react";
import DetailsCard from "./DetailsCard";
import axios from "axios";

//TAB 1 = TROPICAL

const Tab1 = ({ pushDown }) => {
  const [tabData, setTabData] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    const apiUrl = `http://localhost:5000/api/post/userPosts?userId=${user?.id}&role=${user?.role}`;

    axios
      .get(apiUrl)
      .then((response) => {
        setTabData(response.data.payload);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [user?.id, user?.role]);

  return (
    <div>
      <div className="tab1-hold flex justify-center md:mb-48 mb-28 items-center sm:gap-12 gap-0 -mt-16 flex-wrap w-full">
        {tabData?.map((item, index) => {
          return <DetailsCard item={item} key={index} />;
        })}
      </div>
    </div>
  );
};

export default Tab1;
//
