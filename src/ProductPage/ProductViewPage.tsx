import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useCart } from "../MutipleCheckout/CartContext";
import ProductInfo from "./ProductInfo";
import ProductImage from "./ProductImage";
import RelatedProducts from "./RelatedProducts";
import ReviewsSection from "./ReviewsSection";

type Product = {
  _id: string;
  title?: string;
  name?: string;
  price: number;
  image?: string;
  description?: string;
  rating?: number;
  brand?: string;
  reviews?: any[];
};

const API_URL = import.meta.env.VITE_API_URL;

export default function ProductViewPage1() {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedSize, setSelectedSize] = useState("M");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (!id) return;

    const controller = new AbortController();

    const fetchProduct = async () => {
      try {
        setLoading(true);

        const res = await fetch(
          `${API_URL}/api/products/${id}`,
          { signal: controller.signal }
        );

        if (!res.ok) throw new Error("Failed to fetch product");

        const data = await res.json();
        const prod = data.product ?? data;

        setProduct(prod);
        setReviews(prod.reviews || []);

        if (prod.brand) fetchRelated(prod.brand);
      } catch (err) {
        if ((err as any).name === "AbortError") return;
        setError("Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    const fetchRelated = async (brand: string) => {
      const res = await fetch(
        `${API_URL}/api/products?brand=${brand}&limit=4`
      );
      const data = await res.json();
      setRelated(data.products || []);
    };

    fetchProduct();

    return () => controller.abort();
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;

    addToCart({
      _id: product._id,
      title: product.title || product.name || "Untitled",
      price: product.price,
      image: product.image,
      quantity,
      size: selectedSize,
    });
  };

  if (loading) return <p className="p-10">Loading...</p>;
  if (error) return <p className="p-10 text-red-500">{error}</p>;
  if (!product) return <p className="p-10">Not found</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-6 mt-30">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow p-6 grid md:grid-cols-2 gap-10">

        <ProductImage product={product} />
        <ProductInfo
          product={product}
          selectedSize={selectedSize}
          setSelectedSize={setSelectedSize}
          quantity={quantity}
          setQuantity={setQuantity}
          handleAddToCart={handleAddToCart}
        />
      </div>

      <RelatedProducts related={related} />

      <ReviewsSection
        productId={id!}
        reviews={reviews}
        setReviews={setReviews}
      />
    </div>
  );
}