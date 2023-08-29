import React from "react";
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";

export default function Cart() {
  return (
    <div className='w-full flex flex-col mt-6 p-8'>
      <p className='font-bold text-xl px-4'>장바구니</p>
      <div className='w-full flex flex-col'>
        {
          <div className='w-full flex flex-row px-4'>
            <div>
              <img src='' alt='' />
            </div>
            <div>
              <p>name</p>
            </div>
            <div className='flex flex-row'>
              <div>
                <AiOutlineMinus />
              </div>
              <div>{0}</div>
              <div>
                <AiOutlinePlus />
              </div>
            </div>
          </div>
        }
        <div className='w-full flex flex-row px-4'>
          <div>
            <span>합계</span>
          </div>
          <div className='ml-auto'>
            <span>₩{}</span>
          </div>
        </div>
        <div className='w-full flex flex-row py-2'>
          <div className='px-3 py-2 w-1/2'>
            <button className='w-full text-white bg-sky-300 font-bold rounded-md py-2'>Empty</button>
          </div>
          <div className='px-3 py-2 w-1/2'>
            <button className='w-full text-white bg-sky-300 font-bold rounded-md py-2'>Order</button>
          </div>
        </div>
      </div>
    </div>
  );
}
