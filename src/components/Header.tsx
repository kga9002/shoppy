import React, { useEffect } from "react";
import { AiOutlineShopping } from "react-icons/ai";
import { FiShoppingCart } from "react-icons/fi";
import { MdModeEdit } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { logOut, signIn } from "../auth/auth";
import { useUserContext } from "../context/authContext";
import blankImg from "../assets/blank.png";
import { useCartContext } from "../context/cartContext";
import Swal from "sweetalert2";

export default function Header() {
  const navigate = useNavigate();
  const userData = useUserContext();
  const cart = useCartContext();

  const handleImageError = (e: any) => {
    e.target.src = blankImg;
  };

  return (
    <header className='w-full p-4 flex border-b-2'>
      <Link to='/' className='flex items-center mr-auto'>
        <AiOutlineShopping className='text-5xl text-sky-400' />
        <h1 className='font-semibold ml-1 text-3xl text-sky-400'>Shoppy</h1>
      </Link>
      <div className='flex flex-row p-4 relative'>
        <FiShoppingCart
          onClick={() => {
            if (userData) navigate("/cart");
            else Swal.fire("로그인이 필요합니다.");
          }}
          className='text-4xl cursor-pointer hover:text-sky-400 hover:scale-110 ease-out transition-transform mx-2'
        />
        {cart && (
          <div className='absolute left-12 bg-red-500 text-white text-sm rounded-full w-5 h-5 flex justify-center items-center font-bold'>
            {cart ? Object.entries(cart).length : 0}
          </div>
        )}
        {/* admin 처리 */}
        {userData && (
          <MdModeEdit
            onClick={() => navigate("/edit")}
            className='text-4xl mx-2 cursor-pointer hover:text-sky-400 hover:scale-110 ease-out transition-transform'
          />
        )}
        {userData && (
          <div className='mx-2 flex flex-row'>
            <img
              src={userData.photoURL as string}
              alt={userData.email as string}
              onError={handleImageError}
              className='h-9 w-9 rounded-full mr-2'
            />
            <span className='leading-9'>{userData.displayName}</span>
          </div>
        )}
        <button
          onClick={() => {
            if (userData) logOut();
            else signIn();
          }}
          className='h-9 bg-sky-300 px-3 font-bold text-white rounded-md hover:scale-110 ease-out transition-transform mx-2'
        >
          {userData ? "LogOut" : "Login"}
        </button>
      </div>
    </header>
  );
}
