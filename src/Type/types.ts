// types.ts

export interface Product {
  title: string;
  description: string;
  subcategory: string; // 👈 add this
  price: number;
  stock: number;
  image?: File | string;
  category: string; // 👈 add this
  discount:string;
  isOffer:boolean;
}

export interface AddProductButtonProps {
  onAddProduct: (product: Product) => void;
}


export const categories = [
  { label: "Clothes", value: "clothes", icon: "👕" },
  { label: "Footwear", value: "footwear", icon: "👟" },
  { label: "Jewellery", value: "jewellery", icon: "💎" },
  { label: "Cosmetics", value: "cosmetics", icon: "💄" },
  { label: "Bags", value: "bags", icon: "👜" },
  { label: "Glasses", value: "glasses", icon: "🕶️" },
  { label: "Perfumes", value: "perfumes", icon: "🌸" },
  
];
export const subcategories = [
  { value: "mens", label: "Mens" },
  { value: "womens", label: "Womens" },
  { value: "tech", label: "Tech" },
  { value: "house", label: "House" },
  { value: "others", label: "Others" },
];

export const supportCenter = [
  { label: "Chat with Shark", value: "chat", icon: "💬" },
  { label: "Support Center & FAQs", value: "support_faqs", icon: "🧑‍💻❓" },
  { label: "Privacy Policy", value: "privacy", icon: "🔒" },
  { label: "Terms of Use", value: "terms", icon: "📜" },
];