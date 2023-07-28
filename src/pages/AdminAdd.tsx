import React, { useRef, useState } from "react";
import axios from "axios";
import { Autocomplete, InputAdornment, TextField } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { ref, set } from "firebase/database";
import { database } from "../auth/auth";
import uuid from "react-uuid";
import toast, { Toaster } from "react-hot-toast";

export const categoryOptions = [
  {
    label: "상의",
    value: "tops",
  },
  { label: "하의", value: "bottoms" },
  { label: "드레스", value: "dresses" },
];

type FormValues = {
  image: string;
  title: string;
  price: number | string;
  category: string;
  description: string;
  options: string;
};

export default function AdminAdd() {
  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<FormValues>();
  const [imgForShow, setImgForShow] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>();
  const categoryRef = useRef<any>();

  const submitPhoto = async (imgFile: any) => {
    let formData = new FormData();
    formData.append("api_key", `${process.env.REACT_APP_CLOUDINARY_KEY}`);
    formData.append("upload_preset", `${process.env.REACT_APP_UPLOAD_PRESET}`);
    formData.append(`file`, imgFile);

    const config = {
      headers: { "Content-Type": "multipart/form-data" },
    };

    return await axios
      .post(`https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_NAME}/image/upload`, formData, config)
      .then((res) => {
        return res.data.url;
      });
  };

  const onSubmit = (data: any) => {
    const id = uuid();
    try {
      set(ref(database, "products/" + id), { id, ...data });
      toast("저장이 완료 되었습니다.");
      reset();
      setImgForShow(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      const btn = categoryRef.current.getElementsByClassName("MuiAutocomplete-clearIndicator")[0];
      if (btn) btn.click();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className='flex flex-col w-full justify-center'>
      <Toaster />
      <form onSubmit={handleSubmit(onSubmit)}>
        {imgForShow ? (
          <div className='w-80 mx-auto my-4'>
            <img className='w-full' src={URL.createObjectURL(imgForShow)} alt='preview-img' />
          </div>
        ) : (
          <div
            onClick={() => document.getElementById("file")?.click()}
            className='w-80 h-96 border-2 border-dashed border-gray-500 mx-auto flex justify-center items-center text-gray-500 text-lg my-4 cursor-pointer'
          >
            사진이 없습니다
          </div>
        )}

        <div className='mb-4'>
          <Controller
            name='image'
            control={control}
            defaultValue=''
            rules={{ validate: (value) => (value === "" ? "" : true) }}
            render={({ field: { onChange } }) => (
              <TextField
                className='w-full'
                type='file'
                id='file'
                variant='outlined'
                inputRef={fileInputRef}
                error={!!errors.image}
                onChange={async (e: React.ChangeEvent<HTMLInputElement>) => {
                  if (e.target.files && e.target.files.length > 0) {
                    setImgForShow(e.target.files[0]);
                    const result = await submitPhoto(e.target.files[0]);
                    onChange(result);
                  }
                }}
              />
            )}
          />
          {errors.image && <span className='text-xs text-red-500'>사진을 업로드해주세요</span>}
        </div>

        <div className='mb-4'>
          <Controller
            name='title'
            control={control}
            defaultValue=''
            rules={{ validate: (value) => (value === "" ? "" : true) }}
            render={({ field }) => (
              <TextField {...field} label='제품명' variant='outlined' className='w-full' error={!!errors.title} />
            )}
          />
          {errors.title && <span className='text-xs text-red-500'>제품명을 입력해주세요</span>}
        </div>

        <div className='mb-4'>
          <Controller
            name='price'
            control={control}
            defaultValue=''
            rules={{ validate: (value) => (value === "" || value === 0 ? "" : true) }}
            render={({ field }) => (
              <TextField
                {...field}
                label='가격'
                type='number'
                variant='outlined'
                className='w-full'
                error={!!errors.price}
                onKeyDown={(e) => {
                  if (e.key === "-") e.preventDefault();
                }}
                InputProps={{
                  inputProps: {
                    min: 0,
                    max: 1000000,
                    step: 10,
                  },
                  startAdornment: <InputAdornment position='start'>￦</InputAdornment>,
                }}
              />
            )}
          />
          {errors.price && <span className='text-xs text-red-500'>가격을 입력해주세요</span>}
        </div>

        <div className='mb-4'>
          <Controller
            name='category'
            control={control}
            rules={{ validate: (value) => (value === "" ? "" : true) }}
            render={({ field }) => (
              <Autocomplete
                ref={categoryRef}
                onChange={(event, value) => field.onChange(value?.value)}
                options={categoryOptions}
                getOptionLabel={(option) => option.label}
                renderInput={(params) => (
                  <TextField {...field} {...params} label='카테고리' error={!!errors.category} />
                )}
              />
            )}
          />
          {errors.category && <span className='text-xs text-red-500'>카테고리를 입력해주세요</span>}
        </div>

        <div className='mb-4'>
          <Controller
            name='description'
            control={control}
            defaultValue=''
            rules={{ validate: (value) => (value === "" ? "" : true) }}
            render={({ field }) => (
              <TextField
                {...field}
                label='제품설명'
                variant='outlined'
                className='w-full'
                error={!!errors.description}
              />
            )}
          />
          {errors.description && <span className='text-xs text-red-500'>상세설명을 입력해주세요</span>}
        </div>

        <div className='mb-4'>
          <Controller
            name='options'
            control={control}
            defaultValue=''
            rules={{ validate: (value) => (value === "" ? "" : true) }}
            render={({ field }) => (
              <TextField
                {...field}
                label='옵션(콤마(,)로 구분)'
                variant='outlined'
                className='w-full'
                error={!!errors.options}
              />
            )}
          />
          {errors.options && <span className='text-xs text-red-500'>옵션을 입력해주세요</span>}
        </div>
        <button className='w-full rounded-md bg-sky-400 p-2 text-lg font-semibold text-white' type='submit'>
          저장
        </button>
      </form>
    </div>
  );
}
