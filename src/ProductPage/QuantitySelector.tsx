export default function QuantitySelector({
  quantity,
  setQuantity,
}: any) {
  return (
    <div>
      <p className="font-medium mb-2">Quantity</p>

      <div className="flex items-center gap-3">
        <button
          onClick={() => setQuantity((q: number) => Math.max(1, q - 1))}
          className="px-3 border"
        >
          -
        </button>

        <span>{quantity}</span>

        <button
          onClick={() => setQuantity((q: number) => q + 1)}
          className="px-3 border"
        >
          +
        </button>
      </div>
    </div>
  );
}