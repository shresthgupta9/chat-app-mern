import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Signup() {
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [otp, setOtp] = useState("");

    const handleOTP = async (e) => {
        e.preventDefault();

        try {
            const req = { email };
            const res = await axios.post(
                `${import.meta.env.VITE_BACKEND}/otp/generate`,
                req
            );
            const token = res.data.data.token;
            localStorage.setItem("token", token);
        } catch (error) {
            console.log(error);
        }
    };

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            let token = localStorage.getItem("token");
            const req = { name, otp, password, email1: email };
            const headers = {
                "Content-Type": "application/json",
                Authorization: `JWT ${token}`,
            };

            const res = await axios.post(
                `${import.meta.env.VITE_BACKEND}/user/register`,
                req,
                { headers }
            );

            token = res.data.data.token;
            localStorage.setItem("token", token);
            return navigate("/app");
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="bg-blue-50 h-screen flex items-center">
            <form className="w-64 mx-auto mb-12">
                <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    type="text"
                    placeholder="Name"
                    className="block w-full rounded-sm p-2 mb-2 border"
                />
                <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="text"
                    placeholder="Email"
                    className="block w-full rounded-sm p-2 mb-2 border"
                />
                <button
                    className="bg-blue-500 text-white block w-full rounded-sm p-2"
                    onClick={handleOTP}
                >
                    Send OTP
                </button>
                <input
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    type="text"
                    placeholder="OTP"
                    className="block w-full rounded-sm p-2 mb-2 border"
                />
                <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                    placeholder="Password"
                    className="block w-full rounded-sm p-2 mb-2 border"
                />
                <button
                    className="bg-blue-500 text-white block w-full rounded-sm p-2"
                    onClick={handleSubmit}
                >
                    Register
                </button>
                <div className="text-center mt-2">
                    <Link to="/">Already a member?</Link>
                </div>
            </form>
        </div>
    );
}
