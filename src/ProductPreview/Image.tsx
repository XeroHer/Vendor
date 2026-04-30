import React, { useEffect, useState } from "react";

const ProductImagePreview = ({
  image,
}: {
  image: File | string | null;
}) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!image) return setPreviewUrl(null);

    if (typeof image === "string") {
      setPreviewUrl(image); // Cloudinary URL or local path
    } else if (image instanceof File) {
      const url = URL.createObjectURL(image);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [image]);

  if (!previewUrl) return <>-</>;
  return (
    <img
      src={previewUrl}
      alt="Product"
      className="w-16 h-16 object-cover rounded"
    />
  );
};

export default ProductImagePreview;