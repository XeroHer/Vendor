import React, { useState, useRef } from "react";
import { PlusCircle } from "lucide-react";
import type { Product, AddProductButtonProps } from "../../Type/types";
import AddProductModal from "./AddProductModal";

const getInitialProduct = (): Product => ({
  title: "",
  stock: 0,
  price: 0,
  subcategory: "",
  image: null,
  description: "",
  category: "",
  discount: 0,
  isOffer: false,
});

const AddProductButton: React.FC<AddProductButtonProps> = ({
  onAddProduct,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const titleRef = useRef<HTMLInputElement | null>(null);
  const [product, setProduct] = useState<Product>(getInitialProduct());

  const toggleModal = () => {
    if (isOpen) {
      const hasData =
        product.title.trim() ||
        product.description.trim() ||
        product.category ||
        product.subcategory ||
        product.price > 0 ||
        product.stock > 0 ||
        product.image;

      if (hasData) {
        const confirmClose = window.confirm("Discard changes?");
        if (!confirmClose) return;
      }
    }

    setIsOpen(!isOpen);
    setErrors({});
    setImagePreview(null);
    setProduct(getInitialProduct());
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setProduct((prev) => ({
      ...prev,
      [name]:
        name === "stock" || name === "price" || name === "discount"
          ? Number(value)
          : value,
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;

    setProduct((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;

    const file = e.target.files[0];

    if (!file.type.startsWith("image/")) {
      setErrors((prev) => ({ ...prev, image: "Only image files allowed." }));
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, image: "Image must be under 5MB." }));
      return;
    }

    setErrors((prev) => {
      const { image, ...rest } = prev;
      return rest;
    });

    setProduct((prev) => ({ ...prev, image: file }));

    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const validate = (): boolean => {
    const errs: { [key: string]: string } = {};

    if (!product.title.trim()) errs.title = "Title is required.";
    if (!product.description.trim()) errs.description = "Description is required.";
    if (!product.category) errs.category = "Category is required.";
    if (!product.subcategory) errs.subcategory = "Subcategory is required.";
    if (product.stock <= 0) errs.stock = "Stock must be greater than 0.";
    if (product.price <= 0) errs.price = "Price must be greater than 0.";
    if (!product.image) errs.image = "Product image is required.";

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);

    try {
      const formData = new FormData();

      formData.append("title", product.title);
      formData.append("stock", String(product.stock));
      formData.append("price", String(product.price));
      formData.append("description", product.description);
      formData.append("category", product.category);
      formData.append("subcategory", product.subcategory);
      formData.append("discount", String(product.discount));
      formData.append("isOffer", String(product.isOffer));

      if (product.image) {
        formData.append("image", product.image);
      }

      await onAddProduct(formData);

      setProduct(getInitialProduct());
      setImagePreview(null);
      setIsOpen(false);
    } catch (err) {
      console.error("Add product failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
      >
        <PlusCircle size={20} />
        Add New Product
      </button>

      <AddProductModal
        isOpen={isOpen}
        loading={loading}
        product={product}
        errors={errors}
        imagePreview={imagePreview}
        titleRef={titleRef}
        handleSubmit={handleSubmit}
        handleChange={handleChange}
        handleImageChange={handleImageChange}
        handleCheckboxChange={handleCheckboxChange}
        toggleModal={toggleModal}
      />
    </>
  );
};

export default AddProductButton;