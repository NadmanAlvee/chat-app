import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import {
	Eye,
	EyeOff,
	Loader2,
	Lock,
	Mail,
	MessageSquare,
	User,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import ErrorDisplay from "../components/ErrorDisplay";

function SignUpPage() {
	const [showPassword, setShowPassword] = useState(false);
	const { signup, isSigningUp } = useAuthStore();

	const {
		register,
		handleSubmit, // validation function
		formState: { errors },
	} = useForm();
	const onSubmit = (data) => {
		const trimmedData = {
			fullname: data.name.trim(),
			email: data.email.trim(),
			password: data.password.trim(),
		};
		signup(trimmedData);
	};

	return (
		<div className="h-screen flex items-center justify-center relative z-10">
			{/* Sign up */}
			<div className="flex flex-col rounded-3xl justify-center items-center p-6 sm:p-10 sm:bg-black/5">
				<div className="w-full max-w-md space-y-8 sm:w-80">
					{/* Logo */}
					<div className="text-center mb-8">
						<div className="flex flex-col items-center gap-2 group">
							<div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
								<MessageSquare className="size-6 text-primary" />
							</div>
							<h1 className="text-2xl font-bold mt-2">Create Account</h1>
							<p className="text-base-content/60">
								Get started with your free account
							</p>
						</div>
					</div>

					<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
						<div className="form-control">
							<label className="label" htmlFor="name">
								<span className="label-text font-medium">Full Name</span>
							</label>
							<div className="relative">
								<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
									<User className="size-5 text-base-content/40 z-10" />
								</div>
								<input
									id="name"
									className={`input input-bordered w-full pl-10 `}
									type="text"
									placeholder="John Doe"
									style={{ background: "none" }}
									{...register("name", {
										required: { value: true, message: "Name is required!" },
										minLength: { value: 3, message: "Minimum length 3!" },
										maxLength: { value: 20, message: "Maximum length 20!" },
										pattern: {
											value: /^[A-Za-z\s]+$/,
											message: "Name can only contain letters and spaces!",
										},
									})}
								/>
							</div>
							<ErrorDisplay error={errors.name} />
						</div>

						<div className="form-control">
							<label className="label" htmlFor="email">
								<span className="label-text font-medium">Email</span>
							</label>
							<div className="relative">
								<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
									<Mail className="size-5 text-base-content/40 z-10" />
								</div>
								<input
									id="email"
									type="email"
									className={`input input-bordered w-full pl-10 `}
									placeholder="you@example.com"
									style={{ background: "none" }}
									{...register("email", {
										required: { value: true, message: "Email is required!" },
										pattern: {
											value: /\S+@\S+\.\S+/,
											message: "Invalid email format",
										},
									})}
								/>
							</div>
							<ErrorDisplay error={errors.email} />
						</div>

						<div className="form-control">
							<label className="label" htmlFor="password">
								<span className="label-text font-medium">Password</span>
							</label>
							<div className="relative">
								<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
									<Lock className="size-5 text-base-content/40 z-10" />
								</div>
								<input
									id="password"
									type={showPassword ? "text" : "password"}
									className={`input input-bordered w-full pl-10 `}
									placeholder="••••••••"
									style={{ background: "none" }}
									{...register("password", {
										required: {
											value: true,
											message: "Password is required!",
										},
										minLength: {
											value: 6,
											message: "Password must be at least 6 characters",
										},
									})}
								/>

								<button
									type="button"
									className="absolute inset-y-0 right-0 pr-3 flex items-center z-20 cursor-pointer"
									onClick={() => setShowPassword(!showPassword)}
								>
									{showPassword ? (
										<EyeOff className="size-5 text-base-content/40" />
									) : (
										<Eye className="size-5 text-base-content/40" />
									)}
								</button>
							</div>
							<ErrorDisplay error={errors.password} />
						</div>

						<button
							type="submit"
							className="btn btn-primary w-full"
							disabled={isSigningUp}
						>
							{isSigningUp ? (
								<>
									<Loader2 className="size-5 animate-spin" />
									Loading...
								</>
							) : (
								"Create Account"
							)}
						</button>
					</form>

					<div className="text-center">
						<p className="text-base-content/60">
							Already have an account?{" "}
							<Link to="/login" className="link link-primary">
								Sign in
							</Link>
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}

export default SignUpPage;
