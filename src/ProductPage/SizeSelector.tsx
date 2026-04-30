export default function SizeSelector({
  selectedSize,
  setSelectedSize,
}: any) {
  return (
    <div>
      <p className="font-medium mb-2">Size</p>
      <div className="flex gap-2">
        {["S", "M", "L", "XL"].map((size) => (
          <button
            key={size}
            onClick={() => setSelectedSize(size)}
            className={`px-3 py-1 border rounded ${
              selectedSize === size ? "bg-black text-white" : ""
            }`}
          >
            {size}
          </button>
        ))}
      </div>
    </div>
  );
}