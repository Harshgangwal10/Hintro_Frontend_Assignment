import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  login,
  logout,
  selectIsAuthenticated,
  selectRememberMe,
  restoreSession,
} from "../store/authSlice";
import { Eye, EyeOff, LogIn, AlertCircle } from "lucide-react";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const rememberMe = useSelector(selectRememberMe);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [localRememberMe, setLocalRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Hardcoded credentials
  const VALID_EMAIL = "intern@demo.com";
  const VALID_PASSWORD = "intern123";

  useEffect(() => {
    // Check if user is already authenticated
    if (isAuthenticated) {
      navigate("/board");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    // Restore session if remember me was enabled
    const savedAuth = localStorage.getItem("taskboard_auth");
    if (savedAuth) {
      try {
        const parsed = JSON.parse(savedAuth);
        if (parsed.rememberMe && parsed.isAuthenticated) {
          dispatch(restoreSession(parsed));
          navigate("/board");
        }
      } catch (e) {
        console.error("Error restoring session:", e);
      }
    }
  }, [dispatch, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 500));

    if (email === VALID_EMAIL && password === VALID_PASSWORD) {
      dispatch(
        login({
          user: { email },
          rememberMe: localRememberMe,
        }),
      );

      // Save to localStorage if remember me is checked
      if (localRememberMe) {
        localStorage.setItem(
          "taskboard_auth",
          JSON.stringify({
            isAuthenticated: true,
            user: { email },
            rememberMe: true,
          }),
        );
      }

      navigate("/board");
    } else {
      setError("Invalid email or password. Please try again.");
    }

    setIsLoading(false);
  };

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("taskboard_auth");
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 w-full max-w-md border border-white/20">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-500/30 rounded-full mb-4">
            <LogIn className="w-8 h-8 text-purple-300" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Task Board</h1>
          <p className="text-gray-400">Sign in to manage your tasks</p>
        </div>

        {isAuthenticated ? (
          <div className="text-center">
            <p className="text-green-400 mb-4">You are already logged in!</p>
            <button
              onClick={handleLogout}
              className="w-full py-3 px-4 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-xl transition-all duration-200 font-medium"
            >
              Logout
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="flex items-center gap-2 p-4 bg-red-500/20 border border-red-500/30 rounded-xl text-red-300">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                placeholder="intern@demo.com"
                required
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all pr-12"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="rememberMe"
                checked={localRememberMe}
                onChange={(e) => setLocalRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-gray-600 bg-white/5 text-purple-500 focus:ring-purple-500 focus:ring-offset-0"
              />
              <label
                htmlFor="rememberMe"
                className="ml-2 text-sm text-gray-300"
              >
                Remember me
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-linear-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl font-medium transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Signing in...
                </span>
              ) : (
                "Sign In"
              )}
            </button>

            <div className="text-center text-sm text-gray-500">
              <p>Demo credentials:</p>
              <p className="font-mono text-gray-400">Email: intern@demo.com</p>
              <p className="font-mono text-gray-400">Password: intern123</p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;
