import React, { useEffect, useState } from "react";
const API_URL = import.meta.env.VITE_API_URL;
type Product = {
  _id: string;
  name: string;
  price: number;
  imageUrl?: string;
};

type Vendor = {
  name: string;
  email: string;
  businessName: string;
  phone?: string;
  address?: string;
  description?: string;
  products: Product[];
};

const VendorProfile: React.FC = () => {
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // 🔹 Fetch vendor data
  useEffect(() => {
    const fetchVendor = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(`${API_URL}/api/vendor/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        // map backend → UI fields
        setVendor({
          name: data.name,
          email: data.email,
          businessName: data.businessName,
          phone: data.phone || "",
          address: data.address || "",
          description: data.description || "",
          products: data.products || [],
        });
      } catch (err) {
        console.error(err);
      }
    };

    fetchVendor();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file || !vendor) return;

  const imageUrl = URL.createObjectURL(file); // preview

  setVendor({
    ...vendor,
    image: imageUrl,
  });
};

  // 🔹 Save updates
  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");

      await fetch(`${API_URL}/api/vendor/me`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(vendor),
      });

      setIsEditing(false);
    } catch (err) {
      console.error(err);
    }
  };

  if (!vendor) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col md:flex-row items-center">
        
        {/* IMAGE (static for now) */}
       <label className="cursor-pointer">
  <img
    src={vendor.image || "https://via.placeholder.com/150"}
    className="w-32 h-32 rounded-full object-cover"
  />

  <input
    type="file"
    accept="image/*"
    className="hidden"
    onChange={handleImageChange}
  />
</label>

        <div className="flex-1">
          {/* BUSINESS NAME */}
          {isEditing ? (
            <input
              name="businessName"
              value={vendor.businessName}
              onChange={handleChange}
              className="text-2xl font-bold border p-2 rounded w-full"
            />
          ) : (
            <h1 className="text-2xl font-bold">
              {vendor.businessName}
            </h1>
          )}

          {/* DESCRIPTION */}
          {isEditing ? (
            <textarea
              name="description"
              value={vendor.description}
              onChange={handleChange}
              className="text-gray-600 mt-1 border p-2 rounded w-full"
            />
          ) : (
            <p className="text-gray-600 mt-1">
              {vendor.description || "No description"}
            </p>
          )}

          <div className="mt-4 text-sm text-gray-700 space-y-1">
            <p>
              <strong>Name:</strong> {vendor.name}
            </p>
            <p>
              <strong>Email:</strong> {vendor.email}
            </p>

            <p>
              <strong>Phone:</strong>{" "}
              {isEditing ? (
                <input
                  name="phone"
                  value={vendor.phone}
                  onChange={handleChange}
                  className="border p-1 rounded"
                />
              ) : (
                vendor.phone || "N/A"
              )}
            </p>

            <p>
              <strong>Address:</strong>{" "}
              {isEditing ? (
                <input
                  name="address"
                  value={vendor.address}
                  onChange={handleChange}
                  className="border p-1 rounded"
                />
              ) : (
                vendor.address || "N/A"
              )}
            </p>
          </div>

          {/* BUTTONS */}
          <div className="mt-4 flex gap-2">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
              >
                Edit Profile
              </button>
            ) : (
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700"
              >
                Save
              </button>
            )}

            <button className="px-4 py-2 border border-gray-300 rounded-xl hover:bg-gray-100">
              Contact
            </button>
          </div>
        </div>
      </div>

      {/* PRODUCTS */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Products</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {vendor.products.map((product) => (
            <div
              key={product._id}
              className="bg-white rounded-xl shadow-sm p-4 flex items-center"
            >
              <img
                src={product.imageUrl || "https://via.placeholder.com/100"}
                alt={product.name}
                className="w-16 h-16 object-cover rounded-md mr-4"
              />
              <div>
                <p className="font-medium">{product.name}</p>
                <p className="text-gray-500">${product.price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VendorProfile;