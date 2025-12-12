import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Link, useNavigate } from "react-router-dom"
import { Separator } from "@/components/ui/separator"
import GoogleLoginButton from "@/features/auth/components/GoogleAuth/GoogleLoginButton"
import FormInput from "@/components/shared/formInput/FormInput"
import { useForm } from "react-hook-form"
import { useLoginMutation } from "@/services/authServices/authApi"
import { Loader2, X, Key } from "lucide-react"
import { useDispatch } from "react-redux"
import { setUser, setError } from "@/features/auth/slices/authSlice"
import type { Role } from "../Layouts/AuthLayout"
import { roleConfig } from "@/utils/roleConfig"

type FormData = { email: string; password: string }

interface LoginFormProps {
  role: Role
}

const testCredentials: Record<string, { email: string; password: string }> = {
  user: { email: "user@gmail.com", password: "123456" },
  mechanic: { email: "mech@gmail.com", password: "123456" },
}

const LoginForm: React.FC<LoginFormProps> = ({ role }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<FormData>()
  const [login, { isLoading }] = useLoginMutation()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const onValidSubmit = async (data: FormData) => {
    try {
      setErrorMessage(null)
      const res = await login({ ...data, role }).unwrap()
      if (res.status === "success") {
        dispatch(
          setUser({
            name: res.data.name,
            role: res.data.role,
            email: res.data.email,
            mobile: res.data.mobile,
            profileStatus: res.data?.profileStatus,
            avatar: res.data?.avatar,
          }),
        )
        localStorage.setItem("userRole", res.data.role)
        localStorage.setItem("isAuthenticated", "true")
        console.log("navigating to ", roleConfig[res.data.role].defaultRoute)
        navigate(roleConfig[res.data.role].defaultRoute, { replace: true })
      }
    } catch (err: any) {
      const message =
        err.data?.message || err.data?.error || "Login failed. Please check your credentials and try again."
      dispatch(setError(message))
      setErrorMessage(message)
    }
  }

  const fillTestCredentials = () => {
    const credentials = testCredentials[role]
    if (credentials) {
      setValue("email", credentials.email)
      setValue("password", credentials.password)
    }
  }

  return (
    <>
      <div className="text-xs text-end">
        {role !== "admin" && (
          <>
            <span>Not a Member?</span>{" "}
            <Link to={`/auth/${role}/signup`} className="text-blue-600 ml-1 hover:underline">
              Register Now
            </Link>
          </>
        )}
      </div>

      <div className="flex flex-col justify-center items-center mt-4 mb-6">
        <h2 className="text-xl font-semibold">Hello Again!</h2>
        <h5 className="text-xs font-medium">Welcome back, you've been missed!</h5>
      </div>

      <form onSubmit={handleSubmit(onValidSubmit)} className="grid gap-2">
        <div
          className={`transition-all duration-300 ease-in-out overflow-hidden ${
            errorMessage ? "max-h-20 opacity-100 mb-2" : "max-h-0 opacity-0 mb-0"
          }`}
        >
          <div className="flex items-center justify-between bg-red-100 text-red-800 p-3 rounded-md transform transition-transform duration-300">
            <span className="text-sm">{errorMessage}</span>
            <button
              type="button"
              onClick={() => setErrorMessage(null)}
              className="text-red-800 hover:text-red-900 transition-colors duration-200"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <FormInput
          id="email"
          label="Email"
          type="email"
          placeholder="Email"
          register={register}
          name="email"
          validationRule="email"
          error={errors.email}
        />
        <FormInput
          id="password"
          label="Password"
          type="password"
          placeholder="Password"
          register={register}
          name="password"
          validationRule="password"
          error={errors.password}
        />
        <div className="flex items-center justify-between">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input type="checkbox" className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
            <span className="text-xs text-gray-600">Remember Me</span>
          </label>
          <Link to={`/auth/${role}/forgot-password`} className="text-xs text-blue-600 hover:underline">
            Forgot Password?
          </Link>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <Button type="submit" className="bg-af_darkBlue flex-1" disabled={isLoading}>
            {isLoading ? <Loader2 className="animate-spin mr-2" /> : "Login"}
          </Button>
          {role !== "admin" && (
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={fillTestCredentials}
              className="shrink-0 bg-transparent"
              title="Fill test credentials"
            >
              <Key className="h-4 w-4" />
            </Button>
          )}
        </div>
        <div className="flex items-center gap-4 my-2">
          <Separator className="flex-1" />
          <span className="text-xs text-muted-foreground">or</span>
          <Separator className="flex-1" />
        </div>
        <GoogleLoginButton role={role} />
      </form>
    </>
  )
}

export default LoginForm
