import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import { registerUserOrSeller } from "../services/SignUpService";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [agree, setAgree] = useState(false); 
  const navigate = useNavigate(); 

  const handleData = async (e) => {
    e.preventDefault();
    if (!agree) {
      alert("You must agree to the terms and conditions.");
      return;
    }
    const userOrSeller = { name, email, password, role };
    console.log(userOrSeller);
    
    let isRegistered = await registerUserOrSeller(userOrSeller); 

    if (isRegistered) {
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-black to-violet-900 px-4">
      <div className="bg-[#141414] rounded-lg shadow-lg p-8 w-full max-w-md border border-[#2c2c2c]">
        <h2 className="text-3xl font-bold text-white text-center mb-2">Create Your Account</h2>
        <p className="text-[#b3b3b3] text-center mb-6">Sign up to get started</p>
        <form onSubmit={handleData}>
          <div className="mb-4">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your Name"
              className="w-full px-4 py-2 bg-[#1f1f1f] text-white border border-[#333] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your Email"
              className="w-full px-4 py-2 bg-[#1f1f1f] text-white border border-[#333] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Your Password"
              className="w-full px-4 py-2 bg-[#1f1f1f] text-white border border-[#333] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <span className="text-[#b3b3b3]">Role</span>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-2 bg-[#1f1f1f] text-white border border-[#333] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="user">User</option>
              <option value="seller">Seller</option>
            </select>
          </div>
          <div className="mb-4 flex items-center">
            <input
              type="checkbox"
              id="agree"
              checked={agree}
              onChange={() => setAgree(!agree)}
              className="w-4 h-4 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="agree" className="ml-2 text-[#b3b3b3] text-sm">
              I agree to the{" "}
              <button onClick={()=> navigate('/termsAndConditions')}
              className="text-violet-500 hover:underline cursor-pointer">
                Terms and Conditions
              </button>
            </label>
          </div>
          <button
            type="submit"
            className="w-full bg-violet-700 hover:bg-violet-600 text-white py-3 px-8 rounded-lg shadow-lg transition-all duration-300"
          >
            Sign Up
          </button>
        </form>
        <p className="text-center text-[#b3b3b3] mt-4">
          Already have an account?{" "}
          <button
            className="text-violet-500 font-semibold hover:underline"
            onClick={() => navigate('/login')}
          >
            Log In
          </button>
        </p>
      </div>
    </div>
  );
}

export default Signup;
