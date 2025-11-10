import React, { useEffect, useState } from "react";
import { getcompanyprofile } from "./Adminapi";

const AdminCompanyList = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const data = await getcompanyprofile();
        setCompanies(data.companies || []);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch companies");
      } finally {
        setLoading(false);
      }
    };
    fetchCompanies();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen text-lg text-gray-600 animate-pulse">
        Loading company profiles...
      </div>
    );

  if (error)
    return (
      <div className="text-center text-red-500 mt-12 text-xl font-semibold">
        ⚠️ {error}
      </div>
    );

  if (companies.length === 0)
    return (
      <div className="text-center text-gray-500 mt-16 text-lg">
        No company profiles found.
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight">
            🏢 Company Profiles
          </h1>
          <p className="text-gray-600 mt-2 sm:mt-0">
            {companies.length} company{companies.length > 1 ? " profiles" : " profile"} found
          </p>
        </div>

        {/* Company Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {companies.map((company) => (
            <div
              key={company._id}
              className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl overflow-hidden shadow-md hover:shadow-2xl hover:scale-[1.02] transition-transform duration-300"
            >
              {/* Image Section */}
              <div className="relative group">
                {company.image ? (
                  <img
                    src={
                      company.image.startsWith("data:image")
                        ? company.image
                        : `data:image/png;base64,${company.image}`
                    }
                    alt={company.companyName}
                    className="w-full h-52 object-cover group-hover:brightness-90 transition-all duration-300"
                  />
                ) : (
                  <div className="bg-gray-100 text-gray-400 flex items-center justify-center w-full h-52 text-sm font-medium">
                    No Image
                  </div>
                )}

                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-sm font-medium">
                  View Profile
                </div>
              </div>

              {/* Info Section */}
              <div className="p-5 space-y-2">
                <h2 className="text-xl font-bold text-gray-800">
                  {company.companyName}
                </h2>
                <p className="text-sm text-gray-600">
                  <span className="font-semibold text-gray-700">Type:</span>{" "}
                  {company.type || "N/A"}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-semibold text-gray-700">City:</span>{" "}
                  {company.location?.city || "Unknown"}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-semibold text-gray-700">Country:</span>{" "}
                  {company.location?.country || "India"}
                </p>

                <div className="pt-3 border-t border-gray-100 flex justify-between text-xs text-gray-500">
                  <span>
                    📅{" "}
                    {new Date(company.createdAt).toLocaleDateString(undefined, {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                  <span className="text-indigo-600 font-semibold cursor-pointer hover:underline">
                    Details →
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminCompanyList;
