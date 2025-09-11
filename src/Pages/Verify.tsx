import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Dot } from "lucide-react"
import { useSendotpMutation, useVerifyotpMutation } from "@/redux/feature/auth/authApi"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

const FormSchema = z.object({
  pin: z.string().min(6, {
    message: "Your one-time password must be 6 characters.",
  }),
})

export default function Verifie() {
  const navigate = useNavigate()
  const location = useLocation()
  const [email] = useState(location.state)
  const [confirm, setConfirm] = useState(false)
  const [otpsend] = useSendotpMutation()
  const [verifyOtp] = useVerifyotpMutation()
  const [timer, setTimer] = useState(120)

  useEffect(() => {
    if (!email) {
      navigate("/")
    }
  }, [email, navigate])


  // set Timer
  useEffect(() => {
    if (!email || !confirm) {
      return
    }
    const timerId = setInterval(() => {
      setTimer(prev => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(timerId)
  }, [email, confirm])


  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      pin: "",
    },
  })

  const handleSentOTP = async () => {
    const toastid = toast.loading("Sending OTP")
    try {
      const res = await otpsend({ email: email }).unwrap()
      if (res.success) {
        toast.success("OTP sent Sucessfully", { id: toastid })
        setConfirm(true)
        setTimer(120)

      } else {
        toast.error(res.message || "Failed to send OTP", { id: toastid })
      }

    } catch (error) {
      console.log(error)
    }
  }




  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    const toastid = toast.loading("Verifying OTP")
    const Info = { email, otp: data.pin };
    try {
      const res = await verifyOtp(Info).unwrap()
      if (res.success) {
        toast.dismiss(toastid)
        toast.success("OTP Verified Successfully")
        navigate("/login")
      } else {
        toast.dismiss(toastid)
        toast.error(res.message || "OTP verification failed")
      }

    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="grid h-screen place-content-center bg-gradient-to-br ">
      {/* 🔥 Animated Border Wrapper */}
      <div className="relative p-[3px] rounded-2xl animate-border bg-[length:300%_300%] bg-gradient-to-r to-blue-500">
        {
          confirm ? (<Card className="w-[400px] rounded-2xl shadow-xl bg-white/10 backdrop-blur-xl border-none">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-center text-white">
                Verify your email address
              </CardTitle>
              <CardDescription className="text-center text-gray-300">
                Please enter the 6-digit code we sent to <br /> <span className="font-semibold text-white">{email}</span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  id="otp-submit"
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="w-full space-y-6"
                >
                  <FormField
                    control={form.control}
                    name="pin"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">One-Time Password</FormLabel>
                        <FormControl>
                          <InputOTP maxLength={6} {...field}>
                            <InputOTPGroup>
                              <InputOTPSlot index={0} />
                            </InputOTPGroup>
                            <InputOTPGroup>
                              <InputOTPSlot index={1} />
                            </InputOTPGroup>
                            <InputOTPGroup>
                              <InputOTPSlot index={2} />
                            </InputOTPGroup>
                            <Dot />
                            <InputOTPGroup>
                              <InputOTPSlot index={3} />
                            </InputOTPGroup>
                            <InputOTPGroup>
                              <InputOTPSlot index={4} />
                            </InputOTPGroup>
                            <InputOTPGroup>
                              <InputOTPSlot index={5} />
                            </InputOTPGroup>
                          </InputOTP>
                        </FormControl>
                        <FormDescription className="text-gray-400">
                          <Button
                            onClick={handleSentOTP}
                            type="button"
                            disabled={timer !== 0}
                            className={cn("p-0 m-0", {
                              "cursor-pointer": timer === 0,
                              "text-gray-500": timer !== 0
                            })}
                            variant={"link"}>Resent OTP :</Button><span className="text-yellow-300"> {timer}</span>
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </form>
              </Form>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button
                form="otp-submit"
                type="submit"
                className="w-3/5   rounded-xl shadow-lg"
              >
                Submit
              </Button>
            </CardFooter>
          </Card>) : <Card className="w-[400px] rounded-2xl shadow-xl bg-white/10 backdrop-blur-xl border-none">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-center text-white">
                Verify your email address
              </CardTitle>
              <CardDescription className="text-center text-gray-300">
                We will send you OTP at <br /> <span className="font-semibold text-white">{email}</span>
              </CardDescription>
            </CardHeader>
            <CardFooter className="flex justify-center">
              <Button onClick={handleSentOTP} form="otp-submit" className="w-3/5   rounded-xl shadow-lg"> Confirm</Button>
            </CardFooter>
          </Card>
        }
      </div>




    </div>
  )
}
