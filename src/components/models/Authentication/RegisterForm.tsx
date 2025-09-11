import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Link, useNavigate } from "react-router"
import { useForm } from "react-hook-form"
import { FaGithub } from "react-icons/fa";
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import Password from "@/components/ui/password";
import { useRegisterMutation } from "@/redux/feature/auth/authApi";
import { toast } from "sonner"

// Zod Validation


const registerSchema = z
  .object({
    name: z.string().min(2, {
      message: "Username must be at least 2 characters.",
    }),
    address: z.string().min(2, {
      message: "Address must be at least 2 characters.",
    }),
    phone: z.string()
      .regex(/^[0-9]{10,15}$/, {
        message: "Phone number must be 10–15 digits.",
      }),
    email: z.email({
      message: "Invalid email address.",
    }),
    password: z.string().min(6, {
      message: "Password must be at least 6 characters.",
    }),
    confirmpassword: z.string().min(6, {
      message: "Confirm password must be at least 6 characters.",
    }),
  })
  .refine((data) => data.password === data.confirmpassword, {
    path: ["confirmpassword"],
    message: "Passwords do not match.",
  });





export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  // React.ComponentProps<"form">
  const [registerInfo] = useRegisterMutation();  //redux
  const navigate = useNavigate()
  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      address: "",
      phone: "",
      password: "",
      confirmpassword: ""
    }
  })

  const onSubmit = async (data: z.infer<typeof registerSchema>) => {
    const userInfo = {
      name: data.name,
      email: data.email,
      address: data.address,
      phone: data.phone,
      password: data.password
    }
    try {
      const register = await registerInfo(userInfo)
      console.log(register)
      toast("User Created Sucessfully")
      navigate("/verify")
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.log(error.message)
    }
  }



  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className={cn("flex flex-col gap-6", className)}
      {...props}>
      {/* Heading */}
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Register your account</h1>
        <p className="text-sm text-muted-foreground">
          Enter your details to create an account
        </p>
      </div>

      {/* Form Fields */}
      <div className="grid gap-6">
        <Form {...form}>
          {/* name */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>UserName</FormLabel>
                <FormControl>
                  <Input placeholder="john" {...field} />
                </FormControl>
                <FormDescription className="sr-only">
                  This is your public display name.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="johncompany@gmail.com" type="email" {...field} />
                </FormControl>
                <FormDescription className="sr-only">
                  This is your public email.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Address Field */}
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Input placeholder="123, Dhaka, Bangladesh" {...field} />
                </FormControl>
                <FormDescription className="sr-only">
                  This is your address.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Phone Field */}
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input placeholder="+8801XXXXXXXXX" {...field} />
                </FormControl>
                <FormDescription className="sr-only">
                  Enter your phone number including country code.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Password */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Password {...field} />
                </FormControl>
                <FormDescription className="sr-only">
                  This is your Password Field.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Confirm Password */}
          <FormField
            control={form.control}
            name="confirmpassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirmpassword</FormLabel>
                <FormControl>
                  <Password {...field} />
                </FormControl>
                <FormDescription className="sr-only">
                  This is your confirmpassword Field.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Submit Button */}
          <Button type="submit" className="w-full">
            Register
          </Button>

        </Form>




        {/* Or Continue With */}
        <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
          <span className="bg-background text-muted-foreground relative z-10 px-2">
            Or continue with
          </span>
        </div>

        {/* GitHub Login */}
        <Button variant="outline" className="w-full">
          <FaGithub />
          Login with GitHub
        </Button>
      </div>

      {/* Footer */}
      <div className="text-center text-sm">
        Already have an account?{" "}
        <Link to={"/login"}>Login</Link>
      </div>
    </form>
  )
}
