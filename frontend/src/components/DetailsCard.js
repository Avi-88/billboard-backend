import React from "react";
import { Link } from "react-router-dom";
import { IoIosStar } from "react-icons/io";

function DetailsCard({ item }) {
  return (
    <div className="card boxsh w-[400px]"  key={item.id}>
      <Link to={`/${item.id}`}>
        <img src={item.img_url} alt="http://www.aceadvertisingsigns.com/wp-content/uploads/2017/12/The-Advantages-Of-Billboards-For-Advertising.jpg" className="cardImg rounded-2xl" />

        <div className="flex gap-0 px-3 py-2 justify-between">
          <div className="flex">
            <p className=" text-violet-600 font-semibold mr-1 text-2xl">
              {" "}
              Rs {item.price_per_day}
            </p>
            <p className="text-gray-400 text-sm pt-2"> /Day </p>
          </div>

          <div className="bg-green-300 rounded-md px-2 flex justify-between items-center"><IoIosStar className="mr-1"/>{item.rating}</div>
        </div>

        <p className="text-2xl pl-3"> {item.title} </p>

        <p className="text-gray-400 text-sm px-3 mb-3 mt-2 truncate ...">
          {item.description}
        </p>
        <hr className="mb-4" />

        {/* <div className="flex justify-center pl-2 gap-4 md:gap-3">
          <span className="flex items-center">
            {" "}
            <IoBedOutline className=" md:text-2xl text-xl mr-2" />{" "}
            <p className="text-sm text-gray-400 w-16">
              {Math.floor(Math.random() * 5) + 2} beds{" "}
            </p>
          </span>
          <span className="flex items-center">
            {" "}
            <GiBathtub className=" md:text-2xl text-xl mr-2" />{" "}
            <p className="text-sm text-gray-400 w-16">
              {Math.floor(Math.random() * 5) + 2} bath{" "}
            </p>{" "}
          </span>
          <span className="flex items-center">
            {" "}
            <BiBuildingHouse className=" md:text-2xl text-xl mr-2" />{" "}
            <p className="text-sm text-gray-400 w-16">
              {" "}
              {Math.floor(Math.random() * 2) + 2} floors{" "}
            </p>
          </span>
        </div> */}
      </Link>
    </div>
  );
}

export default DetailsCard;
