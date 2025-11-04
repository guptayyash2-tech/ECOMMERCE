import { useState } from "react";
import { sendAdminOtp, verifyAdminOtp } from "./Adminapi";

const Register = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    otp: "",
  });
  const [message, setMessage] = useState("");
  const [emailForOtp, setEmailForOtp] = useState("");

  // ✅ Automatically format phone number with +91 if not included
  const handleChange = (e) => {
    let { name, value } = e.target;

    if (name === "phone") {
      // Remove spaces or dashes
      value = value.replace(/\s|-/g, "");

      // If not starting with +, add +91
      if (!value.startsWith("+")) {
        if (value.startsWith("91")) {
          value = "+" + value; // already has country code
        } else {
          value = "+91" + value; // add India prefix
        }
      }
    }

    setForm({ ...form, [name]: value });
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!form.name || !form.email || !form.phone || !form.password) {
      setMessage("All fields are required.");
      return;
    }

    try {
      setLoading(true);
      const data = await sendAdminOtp(form);
      setMessage(data.message || "OTP sent successfully!");
      setEmailForOtp(data.email);
      setStep(2);
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to send OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!form.otp) {
      setMessage("Please enter the OTP.");
      return;
    }

    try {
      setLoading(true);
      const data = await verifyAdminOtp({
        email: emailForOtp,
        otp: form.otp,
      });
      setMessage("Admin registered successfully!");
      localStorage.setItem("adminToken", data.token);
      setTimeout(() => {
        window.location.href = "/otp/dashboard";
      }, 1500);
    } catch (error) {
      setMessage(error.response?.data?.message || "Invalid OTP or verification failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-md rounded-2xl p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
          {step === 1 ? "Admin Registration" : "Verify OTP"}
        </h1>

        {message && (
          <p
            className={`text-center mb-4 text-sm ${
              message.includes("successfully") ? "text-green-600" : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}

        {step === 1 ? (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <label className="block mb-1 font-medium">Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full border rounded-lg p-2 focus:ring focus:ring-blue-200"
                placeholder="Admin Name"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full border rounded-lg p-2 focus:ring focus:ring-blue-200"
                placeholder="admin@example.com"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Phone</label>
              <input
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="w-full border rounded-lg p-2 focus:ring focus:ring-blue-200"
                placeholder="e.g. 9876543210"
              />
              <small className="text-gray-500 text-xs">India numbers auto-prefix with +91</small>
            </div>

            <div>
              <label className="block mb-1 font-medium">Password</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                className="w-full border rounded-lg p-2 focus:ring focus:ring-blue-200"
                placeholder="********"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition disabled:opacity-60"
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div>
              <label className="block mb-1 font-medium">Enter OTP</label>
              <input
                type="text"
                name="otp"
                value={form.otp}
                onChange={handleChange}
                className="w-full border rounded-lg p-2 focus:ring focus:ring-green-200"
                placeholder="6-digit OTP"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg transition disabled:opacity-60"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>

            <button
              type="button"
              onClick={() => setStep(1)}
              className="w-full text-blue-600 mt-2 underline"
            >
              Go Back
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Register;
