import React, { useEffect, useMemo } from "react";
import { X, Loader2 } from "lucide-react";
import type { Product } from "../../Type/types";
import { categories, subcategories } from "../../Type/types";

interface Props {
  isOpen: boolean;
  loading: boolean;
  product: Product;
  errors: { [key: string]: string };
  imagePreview: string | null;
  titleRef: React.RefObject<HTMLInputElement>;
  handleSubmit: (e: React.FormEvent) => void;
  handleChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleCheckboxChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  toggleModal: () => void;
}

const ErrorText = ({ msg }: { msg?: string }) =>
  msg ? <p className="text-red-500 text-xs mt-1">{msg}</p> : null;

const AddProductModal: React.FC<Props> = ({
  isOpen,
  loading,
  product,
  errors,
  imagePreview,
  titleRef,
  handleSubmit,
  handleChange,
  handleImageChange,
  handleCheckboxChange,
  toggleModal,
}) => {
  useEffect(() => {
    if (isOpen && titleRef.current) titleRef.current.focus();

    const esc = (e: KeyboardEvent) => e.key === "Escape" && toggleModal();
    if (isOpen) window.addEventListener("keydown", esc);

    return () => window.removeEventListener("keydown", esc);
  }, [isOpen]);

  const price = Number(product.price) || 0;
  const discount = Number(product.discount) || 0;

  const finalPrice = useMemo(() => {
    return discount > 0
      ? price - (price * discount) / 100
      : price;
  }, [price, discount]);

  if (!isOpen) return null;

  return (
    <div
      onClick={toggleModal}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden flex"
      >
        {/* LEFT: FORM */}
        <div className="w-2/3 p-6 space-y-4">
          {/* Header */}
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Add Product</h2>
            <button onClick={toggleModal}>
              <X className="text-gray-500 hover:text-red-500" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title */}
            <div>
              <input
                ref={titleRef}
                name="title"
                value={product.title}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 outline-none"
                placeholder="Product title"
              />
              <ErrorText msg={errors.title} />
            </div>

            {/* Description */}
            <div>
              <textarea
                name="description"
                value={product.description}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 outline-none"
                placeholder="Description"
              />
            </div>

            {/* Category Row */}
            <div className="grid grid-cols-2 gap-3">
              <select
                name="category"
                value={product.category}
                onChange={handleChange}
                className="border rounded-lg px-3 py-2"
              >
                <option value="">Category</option>
                {categories.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>

              <select
                name="subcategory"
                value={product.subcategory}
                onChange={handleChange}
                className="border rounded-lg px-3 py-2"
              >
                <option value="">Subcategory</option>
                {subcategories.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Price + Stock */}
            <div className="grid grid-cols-2 gap-3">
              <input
                type="number"
                name="price"
                value={product.price}
                onChange={handleChange}
                className="border rounded-lg px-3 py-2"
                placeholder="Price"
              />

              <input
                type="number"
                name="stock"
                value={product.stock}
                onChange={handleChange}
                className="border rounded-lg px-3 py-2"
                placeholder="Stock"
              />
            </div>

            {/* Discount (Slider UX) */}
            <div>
              <label className="text-sm font-medium">
                Discount: {discount}%
              </label>

              <input
                type="range"
                min={0}
                max={100}
                name="discount"
                value={discount}
                onChange={handleChange}
                className="w-full accent-green-600"
              />

              <input
                type="number"
                name="discount"
                value={product.discount}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2 mt-2"
                placeholder="Discount %"
              />
            </div>

            {/* Offer */}
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                name="isOffer"
                checked={product.isOffer}
                onChange={handleCheckboxChange}
              />
              Mark as Offer Product
            </label>

            {/* Image */}
            <input type="file" accept="image/*" onChange={handleImageChange} />

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white py-2 rounded-lg flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" /> : "Save Product"}
            </button>
          </form>
        </div>

        {/* RIGHT: LIVE PREVIEW */}
        <div className="w-1/3 bg-gray-50 p-6 border-l">
          <h3 className="text-sm font-semibold text-gray-500 mb-4">
            Live Preview
          </h3>

          {/* Image */}
          {imagePreview && (
            <img
              src={imagePreview}
              className="w-full h-40 object-cover rounded-xl mb-4"
            />
          )}

          {/* Price Card */}
          <div className="bg-white rounded-xl p-4 shadow-sm space-y-2">
            <p className="text-gray-500 text-sm">Original Price</p>
            <p className="line-through text-red-500">
              £{price.toFixed(2)}
            </p>

            <p className="text-gray-500 text-sm mt-2">Final Price</p>
            <p className="text-2xl font-bold text-green-600">
              £{finalPrice.toFixed(2)}
            </p>

            {discount > 0 && (
              <p className="text-xs text-green-600">
                You save {discount}% 🎉
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProductModal;