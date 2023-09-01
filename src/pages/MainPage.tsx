import React, { useEffect, useState } from "react";
import { useProductContext } from "../context/productContext";
import thumbnail from "../assets/thumbnail.jpg";
import { categoryOptions } from "./AdminAdd";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { Hearts } from "react-loader-spinner";
import { useNavigate } from "react-router-dom";

export default function MainPage() {
  const products = useProductContext();
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState<string>("All");

  const handleChange = (event: SelectChangeEvent) => {
    setSelectedOption(event.target.value);
  };

  return (
    <>
      {products ? (
        <div className='flex flex-col'>
          <div className='w-full mt-4 relative'>
            <img src={thumbnail} alt='thumbnail' className='w-full h-[350px] object-cover rounded-md' />
            <span className='absolute z-10 top-2/4 left-2/4 -translate-x-1/2 -translate-y-1/2 text-white text-5xl'>
              Shop With Us
            </span>
          </div>
          <div className='w-1/4 my-2'>
            <FormControl fullWidth>
              <InputLabel id='category'>Category</InputLabel>
              <Select labelId='category' id='category' value={selectedOption} label='Category' onChange={handleChange}>
                <MenuItem value='All'>전체</MenuItem>
                {categoryOptions.map((o) => (
                  <MenuItem value={o.value} key={o.value}>
                    {o.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          <ul className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 gap-y-4'>
            {products &&
              Object.entries(products)
                .filter((o) => {
                  if (selectedOption && selectedOption !== "All") return o[1].category === selectedOption;
                  else return o;
                })
                .map((o) => (
                  <li key={o[1].id} className='cursor-pointer' onClick={() => navigate(`product/${o[1].id}`)}>
                    <div className='w-full h-full'>
                      <div className='rounded-t-lg w-full h-5/6 overflow-hidden'>
                        <img src={o[1].image} alt={o[1].title} className='w-full h-full object-cover' />
                      </div>
                      <div className='flex flex-row px-2 py-3 bg-gray-100 rounded-b-lg'>
                        <div className='w-1/2 text-center'>
                          <span className='w-full block font-semibold whitespace-nowrap overflow-hidden text-ellipsis'>
                            {o[1].title}
                          </span>
                        </div>
                        <div className='w-1/2 text-center'>
                          <span className='inline font-semibold'>￦{Number(o[1].price).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
          </ul>
        </div>
      ) : (
        <div className='fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>
          <Hearts
            height='80'
            width='80'
            color='#4bcffa'
            ariaLabel='hearts-loading'
            wrapperStyle={{}}
            wrapperClass=''
            visible={true}
          />
        </div>
      )}
    </>
  );
}
