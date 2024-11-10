import React, { useState } from "react";
import logo from "../../assets/logo.jpeg";
import { FaKey } from 'react-icons/fa';

export default function NewPassword() {
  return (
    <div className="flex-grow w-1/2 h-screen  bg-white">
      <form action="">
        <img src={logo} alt="Logo" className="w-20 h-auto mx-auto mt-20" />
        <div class="flex items-center justify-center w-20 h-20 rounded-full bg-gray-200 text-gray-600 mx-auto mt-2">
          <FaKey class="w-10 h-10 text-xl font-bold stroke-width-4 stroke-red" />
        </div>
        <div className="mb-4  m-2">
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700  pl-40 mt-10"
        >
          New Password
        </label>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="Enter new password"
          className="mx-auto mt-1 block w-1/2 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>
      <div className="mb-4  m-2">
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700  pl-40 mt-5"
        >
          Confirm Password
        </label>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="Enter new password"
          className="mx-auto mt-1 block w-1/2 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>
      <button
          type="submit"
          className="w-200 block mx-auto bg-[#20B2AA] text-white py-2 px-4 rounded-md hover:bg-indigo-600 focus:outline-none focus:bg-indigo-600 mb-4"
        >
         Submit
        </button>
      </form>
    </div>
  );
}
