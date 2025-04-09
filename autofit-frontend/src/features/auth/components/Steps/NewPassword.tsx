import React from 'react'
import FormInput from '@/components/shared/FormInput'
import { useForm } from 'react-hook-form'
import { CardHeader,CardTitle,CardDescription } from '@/components/ui/card';




interface Password {
    password : string,
    confirmPassword : string
}

const NewPassword = () => {

  const {register,handleSubmit,formState:{errors}} = useForm<Password>()

  const submit = (data : Password) =>{
    console.log(data);
    
  }


  return (

    <div className="flex flex-col gap-4">

      <CardHeader className='p-0 pt-5'>
        <CardTitle>Enter New Password</CardTitle>
      </CardHeader>

        <FormInput
          id="password"
          label="Password"
          type="password"
          placeholder="Password"
          error={errors.password}
          register={register}
          name='password'
          validationRule={{
            required: 'Password is required',
            minLength: {
              value: 6,
              message: 'Password must be at least 6 characters'
            },
            validate:{
                notOnlyWhitespace: (value :any) =>
                value.trim().length > 0 || 'Password cannot be empty or whitespace ',

                minTrimmedLength: (value: string) =>{
                    return  value.trim().length >= 3 || 'password must be at least 6 characters'
                }
            }
          }}
        />

        <FormInput 
          id="confirmPassword"
          label="Confirm Password"
          type="password"
          placeholder="Confirm Password"
          error={errors.confirmPassword}
          register={register}
          name='confirmPassword'
          validationRule={{
            required: 'Password is required',
            minLength: {
              value: 6,
              message: 'Password must be at least 6 characters'
            },
            validate:{
                notOnlyWhitespace: (value :any) =>
                value.trim().length > 0 || 'Password cannot be empty or whitespace ',

                minTrimmedLength: (value: string) =>{
                    return  value.trim().length >= 3 || 'password must be at least 6 characters'
                }
            }
          }}
        />

      <div className="flex justify-end">
          <button onClick={handleSubmit(submit)}  type="button" className="bg-black text-white px-4 py-2 rounded-md" > Verify </button>
      </div>


    </div>
  )
}

export default NewPassword