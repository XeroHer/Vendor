export interface Product {
  _id: string;
  title: string;
  description: string;
  subcategory: string; // 👈 add this
  price: number;
  stock: number;
  image?: File | string;
  category: string; // 👈 add this
}

export interface Order {
  _id: string;
  totalPrice: number;
  date: string;
  status: "pending" | "shipped" | "delivered";
}
