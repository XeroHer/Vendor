import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
const API_URL = import.meta.env.VITE_API_URL;
type Product = {
  _id: string;
  title?: string;
  name?: string;
  image?: string;
  price?: number;
  discount?: number;
  isOffer?: boolean;
};

export const HeroSection: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [index, setIndex] = useState(0);

  const navigate = useNavigate();

  // 🔥 FETCH PRODUCTS
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(
         ` ${API_URL}/api/special/offer`,
          { cache: "no-store" }
        );

        const data = await res.json();

        const list: Product[] = Array.isArray(data)
          ? data
          : Array.isArray(data.products)
          ? data.products
          : [];

        setProducts(list);
        setIndex(0);
      } catch (err) {
        console.log(err);
        setProducts([]);
      }
    };

    fetchProduct();
  }, []);

  const current = products[index];

  // 🔥 DISCOUNT PRICE CALCULATION
  const getFinalPrice = (price?: number, discount?: number) => {
    const p = Number(price) || 0;
    const d = Number(discount) || 0;

    return d > 0 ? p - (p * d) / 100 : p;
  };

  // 🔥 NEXT
  const next = () => {
    if (!products.length) return;
    setIndex((prev) => (prev + 1) % products.length);
  };

  // 🔥 PREVIOUS
  const prev = () => {
    if (!products.length) return;
    setIndex((prev) => (prev - 1 + products.length) % products.length);
  };

  return (
    <section className="relative overflow-hidden rounded-2xl h-[420px] mb-10 shadow-lg mt-30">

      {/* BACKGROUND */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-200 via-blue-300 to-purple-300"></div>

      {/* IMAGE */}
      {current?.image && (
        <div className="absolute inset-0">
          <img
            src={current.image}
            className="w-full h-full object-cover opacity-100"
          />
          <div className="absolute inset-0 bg-black/30 pointer-events-none"></div>
        </div>
      )}

      {/* CONTENT */}
      <div className="relative z-10 h-full flex flex-col justify-center items-start px-8 text-white">

        <h1 className="text-4xl font-bold mb-2 drop-shadow-lg">
          Discover Unique Creations
        </h1>

        <p className="text-lg font-medium mb-4">
          Support independent artisans and digital makers
        </p>

        {/* PRODUCT INFO */}
        {current && (
          <div
            onClick={() => navigate(`/view/${current._id}`)}
            className="cursor-pointer mb-3 bg-white/20 backdrop-blur-md px-4 py-3 rounded-lg border border-white/30 ml-7 "
          >
            {/* TITLE */}
            <p className="font-semibold text-lg">
              {current.title || current.name}
            </p>

            {/* PRICE + DISCOUNT */}
            <div className="flex items-center gap-3 mt-1">
              
              {/* ORIGINAL PRICE */}
              {current.discount && current.discount > 0 && (
                <p className="line-through text-gray-200 text-sm">
                  £{Number(current.price || 0).toFixed(2)}
                </p>
              )}

              {/* FINAL PRICE */}
              <p className="text-white font-bold text-lg">
                £{getFinalPrice(current.price, current.discount).toFixed(2)}
              </p>

              {/* DISCOUNT BADGE */}
              {current.discount && current.discount > 0 && (
                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  -{current.discount}% OFF
                </span>
              )}
            </div>

            {/* SPECIAL LABEL */}
            {current.isOffer && (
              <p className="text-yellow-200 text-xs mt-1 font-semibold">
                ⭐ Special Offer Available
              </p>
            )}
          </div>
        )}

        {/* SHOP BUTTON */}
        <button
          onClick={() => {
            if (current?._id) {
              navigate(`/view/${current._id}`);
            } else {
              navigate("/shop");
            }
          }}
          className="px-6 py-2 bg-white text-blue-600 rounded-full font-semibold hover:bg-blue-50 transition ml-8"
        >
          Shop Now
        </button>
      </div>

      {/* PREVIOUS */}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20
        bg-white/30 hover:bg-white/50 text-white 
        w-10 h-10 rounded-full flex items-center justify-center"
      >
        ❮
      </button>

      {/* NEXT */}
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20
        bg-white/30 hover:bg-white/50 text-white 
        w-10 h-10 rounded-full flex items-center justify-center"
      >
        ❯
      </button>

    </section>
  );
};