import React, { useEffect, useState } from "react";
import { getcompanyprofile } from "./Adminapi"; // ✅ Adjust path to your API file

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
      <div className="flex justify-center items-center min-h-screen text-lg text-gray-600">
        Loading company profiles...
      </div>
    );

  if (error)
    return (
      <div className="text-center text-red-500 mt-8 text-lg">
        ⚠️ {error}
      </div>
    );

  if (companies.length === 0)
    return (
      <div className="text-center text-gray-500 mt-10 text-lg">
        No company profiles found.
      </div>
    );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">
        🏢 Company Profiles
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {companies.map((company) => (
          <div
            key={company._id}
            className="bg-white shadow-md rounded-2xl p-4 border border-gray-200 hover:shadow-lg transition-all"
          >
            {/* Image */}
            <div className="flex justify-center">
              {company.image ? (
                <img
                  src={
                    company.image.startsWith("data:image")
                      ? company.image
                      : `data:image/png;base64,${company.image}`
                  }
                  alt={company.companyName}
                  className="rounded-xl w-full h-48 object-cover"
                />
              ) : (
                <div className="bg-gray-100 text-gray-400 flex items-center justify-center w-full h-48 rounded-xl">
                  No Image
                </div>
              )}
            </div>

            {/* Details */}
            <div className="mt-4 space-y-2">
              <h2 className="text-lg font-semibold text-gray-700">
                {company.companyName}
              </h2>
              <p className="text-sm text-gray-600">
                <strong>Type:</strong> {company.type || "N/A"}
              </p>
              <p className="text-sm text-gray-600">
                <strong>City:</strong> {company.location?.city || "Unknown"}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Country:</strong> {company.location?.country || "India"}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Listed: {new Date(company.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminCompanyList;
