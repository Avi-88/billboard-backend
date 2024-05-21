import React, { useState, useEffect } from "react";
import { FaAirbnb } from "react-icons/fa";
import "../styles/Home.css";
import "react-alice-carousel/lib/alice-carousel.css";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import { AiOutlineSearch } from "react-icons/ai";
import { Link } from "react-router-dom";
import CalendarNavBar from "./CalendarNavBar";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { counterActions } from "../redux/State";
import { GiTwoCoins } from "react-icons/gi";
import axios from "axios";

const Home = ({ toggle, setToggle }) => {
  const [inputValue, setInputeValue] = useState("");
  const [tabData, setTabData] = useState([]);

  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    const apiUrl = `http://localhost:5000/api/post/allPosts?searchTerm=${inputValue}`;

    axios
      .get(apiUrl)
      .then((response) => {
        setTabData(response.data.payload);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [inputValue]);


  const inputValueHandler = (e) => {
    setInputeValue(e.target.value);
  };



  return (
    <div>
      <nav className=" bg-white w-full navBar flex relative justify-between items-center mx-auto px-8 h-20">
        {/* logo */}
        <div className="inline-flex">
          <Link className="_o6689fn font-bold" to={"/home"}>
            BillboardHub
          </Link>
        </div>

        <div className="hidden sm:block flex-shrink flex-grow-0 justify-start px-2">
          <div className="inline-block">
            <div className="inline-flex items-center max-w-full">
              <label
                htmlFor="my-modal-4"
                className="navbarAnyHold flex inpWidth2 cursor-pointer"
              >
                <p className=" text-gray-400 whitespace-nowrap ">
                  What are you looking for ?{" "}
                  <AiOutlineSearch className=" whitespace-nowrap inline-block" />{" "}
                </p>
              </label>

              <input type="checkbox" id="my-modal-4" className="modal-toggle" />
              <label htmlFor="my-modal-4" className="modal cursor-pointer">
                <label className="modal-box relative" htmlFor="">
                  <input
                    placeholder="Search For Your Destanation"
                    onChange={inputValueHandler}
                    onClick={() => setToggle(!toggle)}
                    value={inputValue}
                    type="text"
                    className="flex outline-none items-center flex-grow-0 flex-shrink pl-2 relative inputBox  border  px-1  py-1"
                  />

                  {tabData?.map((item, index) => {
                    return (
                      <Link className="w-full " key={index} to={`/${item.id}`}>
                        <div class="relative flex flex-col md:flex-row md:space-x-5 space-y-3 md:space-y-0 rounded-xl shadow-lg p-3 max-w-xs md:max-w-3xl mx-auto border border-white bg-white">
                          <div class="w-full md:w-1/3 bg-white grid place-items-center">
                            <img
                              src={item.img_url}
                              alt="http://www.aceadvertisingsigns.com/wp-content/uploads/2017/12/The-Advantages-Of-Billboards-For-Advertising.jpg"
                              class="rounded-xl"
                            />
                          </div>
                          <div class="w-full md:w-2/3 bg-white flex flex-col space-y-2 p-3">
                            <div class="flex justify-between item-center">
                              <p class="text-gray-500 font-medium hidden md:block">
                                {item.category}
                              </p>
                              <div class="flex items-center">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  class="h-5 w-5 text-yellow-500"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                                <p class="text-gray-600 font-bold text-sm ml-1">
                                  {item.rating}
                                </p>
                              </div>
                            </div>
                            <h3 class="font-black text-gray-800 md:text-3xl text-xl">
                              {item.title}
                            </h3>
                            <p class="md:text-lg text-gray-500 text-base truncate ...">
                              {item.description}
                            </p>
                            <p class="text-xl font-black text-gray-800">
                              Rs {item.price_per_day}
                              <span class="font-normal text-gray-600 text-base">
                                /night
                              </span>
                            </p>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </label>
              </label>
            </div>
          </div>
        </div>
        {/* end search bar */}
        {/* login */}
        <div className="flex-initial">
          <div className="flex justify-end items-center relative">
            {user?.role === "seller" && (
              <div className="flex mr-4 items-center">
                <Link to={"/addPost"}>
                  <div
                    className="inline-block py-2 px-3 hover:bg-red-500  bg-gray-300 rounded-full"
                    href="#"
                  >
                    <div className="flex items-center relative cursor-pointer whitespace-nowrap">
                      Add a Listing
                    </div>
                  </div>
                </Link>
              </div>
            )}

            <div className="block">
              <div className="inline relative">
                {
                  <button
                    type="button"
                    className="inline-flex items-center justify-between relative px-2 border rounded-full hover:shadow-lg"
                  >
                    <div className="pl-1 flex justify-between items-center w-1/2">
                      <GiTwoCoins />
                      <p>{user?.credits}</p>
                    </div>
                    <div className="block flex-grow-0 flex-shrink-0 h-10 w-1/2 pl-5">
                      <svg
                        viewBox="0 0 32 32"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                        role="presentation"
                        focusable="false"
                        style={{
                          display: "block",
                          height: "100%",
                          width: "80%",
                          fill: "currentcolor",
                        }}
                      >
                        <path d="m16 .7c-8.437 0-15.3 6.863-15.3 15.3s6.863 15.3 15.3 15.3 15.3-6.863 15.3-15.3-6.863-15.3-15.3-15.3zm0 28c-4.021 0-7.605-1.884-9.933-4.81a12.425 12.425 0 0 1 6.451-4.4 6.507 6.507 0 0 1 -3.018-5.49c0-3.584 2.916-6.5 6.5-6.5s6.5 2.916 6.5 6.5a6.513 6.513 0 0 1 -3.019 5.491 12.42 12.42 0 0 1 6.452 4.4c-2.328 2.925-5.912 4.809-9.933 4.809z" />
                      </svg>
                    </div>
                  </button>
                }
              </div>
            </div>
          </div>
        </div>
        {/* end login */}
      </nav>
    </div>
  );
};

export default Home;
