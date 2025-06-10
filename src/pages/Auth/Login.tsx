import { LoginForm } from "./components/login-form";
import { Link } from "react-router-dom";
import authImg from "../../assets/img/5c879d43-15bc-40d9-97d3-5bef9f59eda7 1.png";
import Logo from "../../assets/img/logo.png";

const Login = () => {
  return (
    <div className="w-full h-screen flex">
      <div className="flex-1 hidden lg:flex items-center justify-center h-full bg-gradient-to-r from-[#CEBDFF] to-[#7B7199] bg-cover bg-center bg-no-repeat relative">
        <Link
          to={"/"}
          className="absolute top-8 left-8 flex gap-1 text-black text-2xl font-bold"
        >
          <img className="h-8 w-auto" src={Logo} alt="AI-Teacha Logo" />
          <span>AiTeacha</span>
        </Link>

        <div className="relative z-10 flex flex-col items-center justify-center text-center mt-16 space-y-6">
          <img
            className="w-3/4 h-auto max-w-xs"
            src={authImg}
            alt="Auth Illustration"
          />
          <h3 className="text-white text-4xl font-medium leading-tight">
            Explore the most advanced AI tools
          </h3>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center h-full overflow-y-auto bg-white py-8">
        <div className="w-full max-w-md space-y-4 px-4 text-gray-800 sm:px-0">
          <div className="lg:hidden flex items-center justify-center gap-1 text-black text-2xl font-bold mb-0 mt-4">
            <Link
              to="/"
              className="flex items-center gap-1 text-black text-2xl font-bold"
            >
              <img className="h-8 w-auto" src={Logo} alt="AI-Teacha Logo" />
              <span className="text-sm">AiTeacha</span>
            </Link>
          </div>

          <div className="overflow-y-auto px-1 max-h-screen">
            <h1 className="text-center text-2xl font-semibold text-gray-800 mb-0">
              Welcome Back!
            </h1>
            <p className="text-center text-gray-600 mb-8">
              Enter your details to continue
            </p>
            <LoginForm />
            <div className="w-full bg-white p-6 py-0 rounded-lg ">
              <p className="text-center text-gray-900 mt-4">
                Don’t have an account?{" "}
                <Link
                  to="/auth/onboarding"
                  className="text-primary hover:underline"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
