import React, { useEffect, useState } from "react";
import { getuserprofile } from "./Userapi";


const GetUserProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getuserprofile();
        setUser(data);
      } catch (err) {
        console.error("Error fetching user:", err);
        setError("Failed to load user profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-lg">
        Loading user profile...
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center h-screen text-red-600">
        {error}
      </div>
    );

  if (!user)
    return (
      <div className="flex justify-center items-center h-screen text-gray-500">
        No user data found.
      </div>
    );

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center mb-4">
          👤 User Profile
        </h2>

        <div className="space-y-3">
          <div>
            <span className="font-medium text-gray-600">Name:</span>{" "}
            <span className="text-gray-800">{user.name}</span>
          </div>
          <div>
            <span className="font-medium text-gray-600">Email:</span>{" "}
            <span className="text-gray-800">{user.email}</span>
          </div>
         
          {user.createdAt && (
            <div>
              <span className="font-medium text-gray-600">Joined:</span>{" "}
              <span className="text-gray-800">
                {new Date(user.createdAt).toLocaleDateString()}
              </span>
            </div>
          )}
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => {
              localStorage.removeItem("userToken");
              window.location.href = "/user/loginuser";
            }}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default GetUserProfile;
