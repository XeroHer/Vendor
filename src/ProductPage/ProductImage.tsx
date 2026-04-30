export default function ProductImage({ product }: any) {
  return (
    <div className="flex items-center justify-center bg-gray-50 rounded-xl overflow-hidden">
      <img
        src={product.image || "https://via.placeholder.com/400"}
        alt={product.title}
        className="w-full h-[420px] object-cover"
      />
    </div>
  );
}