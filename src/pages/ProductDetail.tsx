import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getDatabase, ref, onValue, set } from "firebase/database";
import { database } from "../auth/auth";
import { Product } from "../context/productContext";
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";
import { useUserContext } from "../context/authContext";
import Swal from "sweetalert2";
import { useCartContext } from "../context/cartContext";

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedOption, setSelectedOption] = useState("");
  const [amount, setAmount] = useState<number>(0);
  const options = product?.options.split(",");
  const userData = useUserContext();
  const navigate = useNavigate();
  const cart = useCartContext();

  useEffect(() => {
    const getDataRef = ref(database, "products/" + id);
    onValue(getDataRef, (snapshot) => {
      const data = snapshot.val();
      setProduct(data);
    });
  }, []);

  useEffect(() => {
    if (cart) console.log();
  });

  const addCart = () => {
    if (userData === null) Swal.fire("로그인이 필요합니다.");
    else {
      if (selectedOption === "" || amount === 0) Swal.fire("옵션과 수량을 선택해주세요.");
      else {
        // 이미 담은 상품을 또 담는다면, 갯수만 증가
        if (cart && Object.entries(cart).find((o) => o[1].id === product?.id && o[1].option === selectedOption)) {
          set(ref(database, "cart/" + userData.uid + "/" + product?.id + selectedOption + "/"), {
            option: selectedOption,
            amount: Number(Object.entries(cart!).find((o) => o[1].id === product?.id)![1].amount) + amount,
            title: product?.title,
            image: product?.image,
            price: product?.price! * amount,
            id: product?.id,
          });
        } else {
          set(ref(database, "cart/" + userData.uid + "/" + product?.id + selectedOption + "/"), {
            option: selectedOption,
            amount,
            title: product?.title,
            image: product?.image,
            price: product?.price! * amount,
            id: product?.id,
          });
        }

        Swal.fire({
          title: "장바구니에 추가되었습니다.",
          showDenyButton: true,
          confirmButtonText: "쇼핑 계속하기",
          denyButtonText: `장바구니로 가기`,
        }).then((result) => {
          if (result.isConfirmed) {
            return;
          } else if (result.isDenied) {
            navigate("/cart");
          }
        });
      }
    }
  };

  return (
    <>
      {product && (
        <div className='w-full flex flex-row mt-6'>
          <img src={product.image} alt={product.title} className='w-1/2 rounded-lg' />
          <div className='p-6 w-full'>
            <p className='text-4xl font-bold mb-3'>{product.title}</p>
            <p className='text-gray-400 text-lg mb-3'>{product.description}</p>
            <p className='text-2xl mb-2'>￦{product.price}</p>
            <div className='mb-4'>
              <label htmlFor='options'>옵션 : </label>
              <select
                name='options'
                id='options'
                value={selectedOption}
                onChange={(e) => setSelectedOption(e.target.value)}
              >
                <option value='' disabled hidden>
                  선택
                </option>
                {options?.map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
            </div>
            <div className='w-full flex flex-row justify-center items-center mb-2'>
              <span
                className='w-1/3 cursor-pointer text-lg hover:text-sky-400 flex justify-center items-center'
                onClick={() => {
                  if (amount - 1 < 0) setAmount(0);
                  else setAmount((prev) => prev - 1);
                }}
              >
                <AiOutlineMinus />
              </span>
              <span className='w-1/3 text-lg text-center'>{amount}</span>
              <span
                className='w-1/3 cursor-pointer text-lg hover:text-sky-400 flex justify-center items-center'
                onClick={() => {
                  if (amount + 1 > 10) {
                    alert("최대 10개까지 구매 가능합니다.");
                    setAmount(10);
                  } else setAmount((prev) => prev + 1);
                }}
              >
                <AiOutlinePlus />
              </span>
            </div>
            <button onClick={() => addCart()} className='w-full rounded-lg bg-sky-300 text-white h-10'>
              장바구니에 추가
            </button>
          </div>
        </div>
      )}
    </>
  );
}
