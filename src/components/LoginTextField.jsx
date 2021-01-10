import { ErrorMessage, Field } from 'formik';
import React from 'react';

export default function LoginTextField({
  label,
  name,
  className,
  placeholder,
  errors,
  touched,
}) {
  return (
    <>
      <Field
        label={label}
        name={name}
        className={`appearance-none rounded-none relative block w-full px-3 py-2 border placeholder-gray-500 text-gray-900 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10 sm:text-sm sm:leading-5 
          ${errors && touched ? 'border-red-500' : 'border-gray-300'}
          ${className}`}
        placeholder={placeholder}
      />
      {errors && touched && (
        <ErrorMessage
          name={name}
          component="div"
          className="text-red-500 mt-1 mb-2"
        />
      )}
    </>
  );
}
