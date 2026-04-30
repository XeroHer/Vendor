import React, { useMemo } from "react";
import type { Product } from "../interface/interface";
import { categories, subcategories } from "../Type/types";

interface Props {
  product: Product;
  onChange: (field: keyof Product, value: any) => void;
  onSave: () => void;
  onCancel: () => void;
}

export default function EditProductForm({
  product,
  onChange,
  onSave,
  onCancel,
}: Props) {
  const price = Number(product.price) || 0;
  const discount = Number(product.discount) || 0;

  const finalPrice = useMemo(() => {
    return discount > 0
      ? price - (price * discount) / 100
      : price;
  }, [price, discount]);

  return (
    <div className="bg-white p-6 mt-6 rounded-2xl shadow-lg border max-w-4xl mx-auto">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Edit Product</h2>

        {/* PRICE PREVIEW BADGE */}
        <div className="text-right">
          {discount > 0 && (
            <p className="text-xs text-gray-400 line-through">
              £{price.toFixed(2)}
            </p>
          )}
          <p className="text-lg font-bold text-green-600">
            £{finalPrice.toFixed(2)}
          </p>
        </div>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSave();
        }}
        className="space-y-6"
      >
        {/* BASIC INFO */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {["title", "stock", "price"].map((field) => (
            <div
              key={field}
              className="p-4 rounded-xl border bg-gray-50"
            >
              <label className="text-sm font-medium text-gray-600">
                {field.toUpperCase()}
              </label>

              <input
                type={field === "title" ? "text" : "number"}
                value={product[field as keyof Product] as any}
                onChange={(e) =>
                  onChange(
                    field as keyof Product,
                    field === "title"
                      ? e.target.value
                      : Number(e.target.value)
                  )
                }
                className="mt-1 w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
              />
            </div>
          ))}
        </div>

        {/* PRICE INSIGHT PANEL */}
        <div className="p-4 rounded-xl border bg-gradient-to-r from-gray-50 to-white">
          <h3 className="text-sm font-semibold text-gray-600 mb-2">
            Pricing Preview
          </h3>

          <div className="flex justify-between text-sm">
            <span>Original Price:</span>
            <span className="line-through text-red-500">
              £{price.toFixed(2)}
            </span>
          </div>

          <div className="flex justify-between text-sm mt-1">
            <span>Discount:</span>
            <span>{discount}%</span>
          </div>

          <div className="flex justify-between text-base font-bold mt-2">
            <span>Final Price:</span>
            <span className="text-green-600">
              £{finalPrice.toFixed(2)}
            </span>
          </div>
        </div>

        {/* DISCOUNT + OFFER */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Discount */}
          <div className="p-4 rounded-xl border bg-gray-50">
            <label className="text-sm font-medium text-gray-600">
              Discount (%)
            </label>

            <input
              type="number"
              value={product.discount || 0}
              onChange={(e) =>
                onChange("discount", Number(e.target.value))
              }
              className="mt-1 w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 outline-none"
            />
          </div>

          {/* Offer */}
          <div className="p-4 rounded-xl border bg-gray-50 flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600">
              Offer Product
            </span>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={product.isOffer || false}
                onChange={(e) =>
                  onChange("isOffer", e.target.checked)
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-green-500 transition"></div>
              <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition peer-checked:translate-x-5"></div>
            </label>
          </div>
        </div>

        {/* CATEGORY */}
        <div className="p-4 rounded-xl border bg-gray-50">
          <label className="text-sm font-medium text-gray-600">
            Category
          </label>

          <select
            value={(product as any).category || ""}
            onChange={(e) =>
              onChange("category" as keyof Product, e.target.value)
            }
            className="mt-1 w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="">Select category</option>
            {categories.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        {/* SUBCATEGORY */}
        <div className="p-4 rounded-xl border bg-gray-50">
          <label className="text-sm font-medium text-gray-600">
            Subcategory
          </label>

          <select
            value={(product as any).subcategory || ""}
            onChange={(e) =>
              onChange("subcategory" as keyof Product, e.target.value)
            }
            className="mt-1 w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="">Select subcategory</option>
            {subcategories.map((sub) => (
              <option key={sub.value} value={sub.value}>
                {sub.label}
              </option>
            ))}
          </select>
        </div>

        {/* DESCRIPTION */}
        <div className="p-4 rounded-xl border bg-gray-50">
          <label className="text-sm font-medium text-gray-600">
            Description
          </label>

          <textarea
            value={product.description}
            onChange={(e) =>
              onChange("description", e.target.value)
            }
            className="mt-1 w-full border rounded-lg px-3 py-2 h-28 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        {/* IMAGE */}
        <div className="p-4 rounded-xl border bg-gray-50">
          <label className="text-sm font-medium text-gray-600">
            Image
          </label>

          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              onChange(
                "image",
                e.target.files ? e.target.files[0] : null
              )
            }
            className="mt-2 w-full"
          />
        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            Update Product
          </button>
        </div>
      </form>
    </div>
  );
}