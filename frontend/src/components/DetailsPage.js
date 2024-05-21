import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { IoIosStar } from "react-icons/io";
import { BiCategoryAlt } from "react-icons/bi";
import { HiLocationMarker } from "react-icons/hi";
import { IoResize } from "react-icons/io5";

import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { BsTextIndentLeft } from "react-icons/bs";

function DetailsPage() {
  const params = useParams();
  const [postData, setPostData] = useState([]);
  const [rentDays, setRentDays] = useState(1);
  const [totalCost, setTotalCost] = useState(0);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/user/userDetails?userId=${user?.id}&role=${user?.role}`).then((res)=>{
        localStorage.setItem("user", JSON.stringify(res.data.payload));
    }).catch((err)=>{
        console.log(err);
    })
  }, []);

  useEffect(() => {
    const apiUrl = `http://localhost:5000/api/post/${params.id}`;

    axios
      .get(apiUrl)
      .then((response) => {
        setPostData(response.data.payload);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [params.id]);

  const calculateTotalCost = () => {
    const pricePerDay = postData.price_per_day || 0;
    const totalPrice = pricePerDay * rentDays;
    setTotalCost(totalPrice);
  };

  const handleRentDaysChange = (e) => {
    const days = parseInt(e.target.value);
    setRentDays(days);
  };

  const handleRent = () => {
    if (user?.credits < totalCost) {
      toast({
        title: "Insufficient Credits",
        description: "You do not have enough credits to rent this billboard.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } else {
      axios
        .post(`http://localhost:5000/api/post/buyPost`, {
          userId: user?.id,
          postId: postData?.id,
          bill: totalCost,
        })
        .then((response) => {
          toast({
            title: "Rental Successful",
            description: "You have successfully rented the billboard.",
            status: "success",
            duration: 3000,
            isClosable: true,
          });
          onClose();
        })
        .catch((error) => {
          toast({
            title: "Error",
            description: "An error occurred while renting the billboard.",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
          console.error("Error renting billboard:", error);
        });
    }
  };

  useEffect(() => {
    calculateTotalCost();
  }, [rentDays, postData.price_per_day]);

  return (
    <div className="p-8 flex flex-col justify-start items-center">
      <div className="flex justify-start items-center w-11/12  py-8">
        <span className="text-4xl font-bold">{postData.title}</span>
        <span className="bg-blue-400 ml-10 px-4 flex justify-between items-center rounded-full">
          {" "}
          <BiCategoryAlt /> {postData.category}
        </span>
      </div>
      <div className="flex justify-around w-full items-center">
        <div className="w-2/5 h-full">
          <img
            src={postData.img_url}
            alt="http://www.aceadvertisingsigns.com/wp-content/uploads/2017/12/The-Advantages-Of-Billboards-For-Advertising.jpg"
            className="w-full rounded-2xl"
          />
          <div className="text-lg font-semibold py-4 h-full">
            <div className="flex justify-start items-center gap-4 mb-2">
              <BsTextIndentLeft className="text-red-500 text-4xl" />
              <p>{postData.description}</p>
            </div>
            <div className="flex justify-start items-center gap-4 mb-2">
              <HiLocationMarker className="text-red-500 text-2xl" />
              <p> {postData.location}</p>
            </div>
            <div className="flex justify-start items-center gap-4">
              <IoResize className="text-red-500 text-2xl" />
              <p> {postData.size}</p>
            </div>
          </div>
        </div>
        <div className="bg-red-50 shadow-lg rounded-lg w-2/5 h-full p-8 flex-col justify-between  items-center">
          <div className="flex justify-between items-center w-full mb-4">
            <p className="font-bold text-4xl">
              Rs {postData.price_per_day}/ day
            </p>
            <span className="bg-green-400 ml-10 px-4 flex justify-between items-center rounded-full">
              {" "}
              <IoIosStar /> {postData.rating}
            </span>
          </div>
          {user?.role !== "seller" && !postData?.renterId ? (
            <>
              <div className="flex items-center mb-4">
                <label htmlFor="rentDays" className="mr-2 font-bold">
                  Rent for (days):
                </label>
                <input
                  type="number"
                  id="rentDays"
                  value={rentDays}
                  onChange={handleRentDaysChange}
                  className="border-gray-300 border-2 p-2 rounded-md w-16"
                />
              </div>
              <p className="font-bold text-xl mb-4">
                Total Cost: Rs {totalCost}
              </p>
              <Button onClick={onOpen} className="w-full text-red-400">
                Rent
              </Button>
            </>
          ) : (
            <div>Sorry this post is already rented</div>
          )}

          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent
              className="mx-auto max-w-md"
              display="flex"
              flexDirection="column"
              alignItems="center"
            >
              <ModalHeader>Confirm Rental</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                Are you sure you want to rent this billboard for {rentDays}{" "}
                days?
              </ModalBody>
              <ModalFooter>
                <Button colorScheme="blue" mr={3} onClick={handleRent}>
                  Confirm
                </Button>
                <Button onClick={onClose}>Cancel</Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </div>
      </div>
    </div>
  );
}

export default DetailsPage;
