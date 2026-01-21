import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { supabase } from "@/lib/supabase"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState } from "react"

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6)
})

type LoginFormData = z.infer<typeof loginSchema>

export default function Login() {
    const [errorMsg, setErrorMsg] = useState("")
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting},
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    })

    const onSubmit = async (data: LoginFormData) => {
        setErrorMsg("")
        const { error } = await supabase.auth.signInWithPassword({
            email: data.email,
            password: data.password,
        })
        if (error) setErrorMsg(error.message)
        else alert("Login Successful, you can now access the dashboard")
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
            <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-white p-6 rounded-lg shadow-md w-full max-w-md space-y-4">
                <h2 className="text-2xl font-bold">Vendor Login</h2>

                <div>
                    <Input placeholder="Email" {...register("email")} />
                    {errors.email && (
                        <p className="text-red-500 text-sm">{errors.email.message}</p>
                    )}
                </div>

                <div>
                    <Input
                    type="password"
                    placeholder="Password"
                    {...register("password")} />
                    {errors.password && (
                        <p className="text-red-500 text-sm">{errors.password.message}</p>
                    )}
                </div>

                {errorMsg && <p className="text-red-500">{errorMsg}</p>}
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Logging in..." : "Login"}
                </Button>
            </form>
        </div>
    )
}