import React, { useState, useEffect } from "react";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
//border-bottom : none;

import "../src/styles/Tabs.css";
import Tab1 from "./components/Tab1";
import Tab8 from "./components/Tab8";
import { IoMdList } from "react-icons/io";
import { CgScreen } from "react-icons/cg";
import { FaLaptopHouse } from "react-icons/fa";
import { FaCloudSun } from "react-icons/fa";
import { IoIosPricetags } from "react-icons/io";
import axios from "axios";

const TabsComp = ({ toggle, setToggle }) => {
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [tabData, setTabData] = useState([]);
  const filters = ["", "Digital", "Indoor", "Outdoor"];
  
  useEffect(() => {

    const apiUrl = `http://localhost:5000/api/post/allPosts?searchTerm=${filters[activeTabIndex]}`;

    axios
      .get(apiUrl)
      .then((response) => {
     
        setTabData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [activeTabIndex]);


  const handleTabChange = (index) => {
    setActiveTabIndex(index);
  };

  return (
    <>
      <Tabs index={activeTabIndex} onChange={handleTabChange}>
        <TabList className="placeTabs-hold">
          <Tab className="tabImg md:pr-1 pr-0">
            <IoMdList className="text-4xl" />
          </Tab>

          <Tab className="tabImg md:pr-1 pr-0">
            <CgScreen className="text-4xl" />
          </Tab>

          <Tab className="tabImg md:pr-1 pr-0">
            <FaLaptopHouse className="text-4xl" />
          </Tab>
          <Tab className="tabImg md:pr-1 pr-0">
            <FaCloudSun className="text-4xl" />
          </Tab>
          <Tab className="tabImg md:pr-1 pr-0 bg-red-400 rounded-lg">
            <IoIosPricetags className="text-4xl" />
          </Tab>
        </TabList>

        <TabPanels>
          <TabPanel className="tab-content">
            {" "}
            <Tab8 data={tabData.payload} />{" "}
          </TabPanel>
          <TabPanel className="tab-content">
            {" "}
            <Tab8 data={tabData.payload} />{" "}
          </TabPanel>
          <TabPanel className="tab-content">
            {" "}
            <Tab8 data={tabData.payload} />{" "}
          </TabPanel>
          <TabPanel className="tab-content">
            {" "}
            <Tab8 data={tabData.payload} />{" "}
          </TabPanel>
          <TabPanel className="tab-content">
            {" "}
            <Tab1 />{" "}
          </TabPanel>
        </TabPanels>
      </Tabs>
    </>
  );
};

export default TabsComp;
