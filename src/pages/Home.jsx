import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import running from "../assets/running.png";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <>
      <div>
        <div className="w-10/12 mx-auto border-gray-300 p-4 shadow-md">
          <img
            src={running}
            alt="running"
            className="block mx-auto w-30 mt-15 my-15"
          />
          <h1 className="text-2xl font-bold text-center text-black">
            Welcome to MyRun
          </h1>
          <h1 className="text-sm text-center text-black mt-10">
            Your personal running record.
          </h1>
          <h1 className="text-sm text-center text-black mt-10">
            You can create and update your running record.
          </h1>
          <div className="flex justify-center">
            <Link to="/showallmyrun">
              <button className="flex justify-center items-center bg-blue-700 p-3 px-15 rounded-md mt-5 text-white hover:bg-blue-800 cursor-pointer">
                เข้าสู้หน้าจอข้อมูลการวิ่งของฉัน
              </button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
