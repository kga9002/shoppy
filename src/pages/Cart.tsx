import React, { useEffect, useState } from "react";
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";
import { useCartContext } from "../context/cartContext";
import { BsFillTrashFill } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { getDatabase, ref, remove, set, update } from "firebase/database";
import { useUserContext } from "../context/authContext";
import Swal from "sweetalert2";

export default function Cart() {
  const cart = useCartContext();
  const navigate = useNavigate();
  const userData = useUserContext();
  const db = getDatabase();

  // 장바구니 비우기 로직
  const emptyProducts = () => {
    remove(ref(db, "cart/" + userData?.uid + ""));
  };

  // 장바구니 비우기 버튼 눌렀을때 비우는 로직
  const emptyCart = () => {
    if (cart) {
      Swal.fire({
        title: "장바구니에 담긴 물품을\n모두 삭제하시겠습니까?",
        showDenyButton: true,
        confirmButtonText: "삭제하기",
        denyButtonText: `뒤로가기`,
      }).then((result) => {
        if (result.isConfirmed) {
          emptyProducts();
        } else if (result.isDenied) {
          return;
        }
      });
    } else {
      Swal.fire("장바구니에 상품이 없습니다.");
    }
  };

  // 주문하기 눌렀을때 주문하고 장바구니 비우기
  const orderCart = () => {
    if (cart) {
      Swal.fire({
        title: "주문하시겠습니까?",
        showDenyButton: true,
        confirmButtonText: "주문하기",
        denyButtonText: `뒤로가기`,
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire(
            `주문해주셔서 감사합니다.\n주문금액 : ₩ ${Object.entries(cart!)
              .reduce((acc, cur) => acc + cur[1].price, 0)
              .toLocaleString()}`,
          );
          emptyProducts();
        } else if (result.isDenied) {
          return;
        }
      });
    } else {
      Swal.fire("주문할 상품이 없습니다.");
    }
  };

  // 단일 상품 삭제
  const removeProduct = (id: string, option: string) => {
    remove(ref(db, "cart/" + userData?.uid + "/" + id + option));
  };

  // 플러스,마이너스 버튼 따라서 수량 변경하기(set=>amount,price)
  const handleQuantity = (id: string, amount: number, option: string, type: string) => {
    if (cart) {
      const amount = Object.entries(cart).find((o) => o[0] === id + option)![1].amount;
      const price = Object.entries(cart).find((o) => o[0] === id + option)![1].price / amount;
      if (type === "minus") {
        update(ref(db, "cart/" + userData?.uid + "/" + id + option), {
          amount: amount - 1,
          price: price * (amount - 1),
        });
      } else if (type === "plus") {
        update(ref(db, "cart/" + userData?.uid + "/" + id + option), {
          amount: amount + 1,
          price: price * (amount + 1),
        });
      }
    }
  };

  return (
    <div className='w-full flex flex-col mt-6 p-8'>
      <p className='font-bold text-xl px-4'>장바구니</p>
      <div className='w-full flex flex-col'>
        {cart ? (
          Object.entries(cart).map((o) => (
            <div className='w-full flex flex-row px-4 py-2' key={o[1].title}>
              <div className='w-[50px] h-[60px] cursor-pointer' onClick={() => navigate(`/product/${o[1].id}`)}>
                <img className='w-full h-full object-cover' src={o[1].image} alt={o[1].title} />
              </div>
              <div className='flex justify-center items-center ml-2'>
                <div>
                  <p className='font-semibold'>{o[1].title}</p>
                  <p className='text-sm'>option : {o[1].option}</p>
                </div>
              </div>
              <div className='ml-auto flex flex-row w-1/5'>
                <div className='flex flex-row mr-4 justify-center items-center'>
                  <div
                    className='cursor-pointer hover:text-sky-400'
                    onClick={() => {
                      if (o[1].amount === 1) return;
                      else handleQuantity(o[1].id, o[1].amount, o[1].option, "minus");
                    }}
                  >
                    <AiOutlineMinus />
                  </div>
                  <div className='font-semibold mx-3'>{o[1].amount}</div>
                  <div
                    className='cursor-pointer hover:text-sky-400'
                    onClick={() => {
                      if (o[1].amount === 10) return;
                      else handleQuantity(o[1].id, o[1].amount, o[1].option, "plus");
                    }}
                  >
                    <AiOutlinePlus />
                  </div>
                </div>
                <div className='flex justify-center items-center ml-auto mr-2'>
                  <span>₩ {Number(o[1].price).toLocaleString()}</span>
                </div>
              </div>
              <div
                onClick={() => removeProduct(o[1].id, o[1].option)}
                className='flex items-center justify-center ml-2 hover:text-red-400 cursor-pointer hover:scale-110 ease-out transition-transform'
              >
                <BsFillTrashFill />
              </div>
            </div>
          ))
        ) : (
          <div className='w-full flex justify-center items-center h-[120px] text-semibold text-gray-600'>
            장바구니에 담은 상품이 없습니다.
          </div>
        )}
        <div className='w-full flex flex-row px-4 py-2 bg-gray-200 rounded-lg'>
          <div>
            <span>합계</span>
          </div>
          <div className='ml-auto'>
            <span>
              ₩{" "}
              {cart
                ? Object.entries(cart)
                    .reduce((acc, cur) => acc + cur[1].price, 0)
                    .toLocaleString()
                : 0}
            </span>
          </div>
        </div>
        <div className='w-full flex flex-row py-2'>
          <div className='px-3 py-2 w-1/2'>
            <button
              className='w-full text-white bg-sky-300 font-bold rounded-md py-2 hover:bg-sky-500'
              onClick={() => emptyCart()}
            >
              Empty
            </button>
          </div>
          <div className='px-3 py-2 w-1/2'>
            <button
              className='w-full text-white bg-sky-300 font-bold rounded-md py-2 hover:bg-sky-500'
              onClick={() => orderCart()}
            >
              Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
