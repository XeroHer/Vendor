export default function RelatedProducts({ related }: any) {
  if (!related.length) return null;

  return (
    <div className="max-w-6xl mx-auto mt-10">
      <h2 className="text-xl font-semibold mb-4">
        Related Products
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {related.map((item: any) => (
          <div key={item._id} className="bg-white p-3 shadow rounded">
            <img
              src={item.image}
              className="h-32 w-full object-cover"
            />
            <p className="text-sm mt-2">{item.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
}