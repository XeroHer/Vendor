

// import './App.css';

// import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';

// import SignUpForm from './Home/Register';
// import SignInForm from './Home/Login';
// import ProductPage from './Vendor/ProductPage';
// import OrdersPage from './Vendor/OrderPage';
// import VendorProfile from './Vendor/VendorProfile';
// import { CartProvider } from './MutipleCheckout/CartContext';
// import CartPage from './MutipleCheckout/CartPage';
// import CheckoutPage from './MutipleCheckout/CheckoutPage';
// import { Elements } from '@stripe/react-stripe-js';
// import { loadStripe } from '@stripe/stripe-js';
// import Homepage from './Home/HomePage';
// import VendorDashboard1 from './Vendor/VendorDashboard';
// import TrendingPage from './ProductPage/trending';
// import ProductViewPage1 from './ProductPage/ProductViewPage';
// import { Toaster } from "react-hot-toast";
// import TrackOrderPage from './order/TrackOrderPage';
// import OrdersPage1 from './order/oder';
// import SearchPage from './Home/searchpage';

// import MainLayout from './MainLayout';
// import CategoryPage from './category/category';
// import MenPage from './category/mens';
// import WomenPage from './category/women';
// import HotOffers from './category/HotOffers';
// import NewArrivals from './category/NewProduct';
// import VerifyOtp from './Home/VerifyOtp';
// import ResetPasswordPage from './Home/Reset';
// import ForgotPassword from './Home/fogot';
// import { AuthProvider } from './category/AuthContext';



// const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);


// function App() {
  
//   return (
//     <Router>
//        <AuthProvider>
//       <CartProvider>
//         <Toaster position="top-right" />

//         <Routes>

//   {/* 🔥 WITH HEADER + FOOTER */}
//   <Route element={<MainLayout />}>
//     <Route path="/" element={<Homepage />} />
//     <Route path="/search" element={<SearchPage />} />
//     <Route path="/trending" element={<TrendingPage />} />
//     <Route path="/view/:id" element={<ProductViewPage1 />} />
//     <Route path="/cart" element={<CartPage />} />
//     <Route path="/checkout" element={
//       <Elements stripe={stripePromise}>
//         <CheckoutPage />
//       </Elements>
//     } />
//     <Route path="/track/:orderId" element={<TrackOrderPage />} />
//     <Route path="/oderpage" element={<OrdersPage1 />} />

//     {/* 🔥 ADD THESE HERE TOO */}
//     <Route path="/category/:slug" element={<CategoryPage />} />
//     <Route path="/mens" element={<MenPage />} />
//     <Route path="/womens" element={<WomenPage />} />
//     <Route path="/offers" element={<HotOffers />} />
//     <Route path="/new" element={<NewArrivals />} />
//   </Route>

//   {/* ❌ NO HEADER (auth pages) */}
//   <Route path="/login" element={<SignInForm />} />
//   <Route path="/register" element={<SignUpForm />} />
//   <Route path="/verify-otp" element={<VerifyOtp />} />
//   <Route path="/forgot-password" element={<ForgotPassword />} />
//   <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

//   {/* vendor pages (optional: you can also wrap these) */}
//   <Route path="/Vendor" element={<VendorDashboard1 />} />
//   <Route path="/products" element={<ProductPage />} />
//   <Route path="/Orders" element={<OrdersPage />} />
//   <Route path="/Profile" element={<VendorProfile />} />
  

// </Routes>
//       </CartProvider>
//       </AuthProvider>
//     </Router>
//   );
// }

// export default App;


import './App.css';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';

import SignUpForm from './Home/Register';
import SignInForm from './Home/Login';
import ProductPage from './Vendor/ProductPage';
import OrdersPage from './Vendor/OrderPage';
import VendorProfile from './Vendor/VendorProfile';
import { CartProvider } from './MutipleCheckout/CartContext';
import CartPage from './MutipleCheckout/CartPage';
import CheckoutPage from './MutipleCheckout/CheckoutPage';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import Homepage from './Home/HomePage';
import VendorDashboard1 from './Vendor/VendorDashboard';
import TrendingPage from './ProductPage/trending';
import ProductViewPage1 from './ProductPage/ProductViewPage';
import { Toaster } from "react-hot-toast";
import TrackOrderPage from './order/TrackOrderPage';
import OrdersPage1 from './order/oder';
import SearchPage from './Home/searchpage';

import MainLayout from './MainLayout';
import CategoryPage from './category/category';
import MenPage from './category/mens';
import WomenPage from './category/women';
import HotOffers from './category/HotOffers';
import NewArrivals from './category/NewProduct';
import VerifyOtp from './Home/VerifyOtp';
import ResetPasswordPage from './Home/Reset';
import ForgotPassword from './Home/fogot';
import { AuthProvider } from './category/AuthContext';

import ProtectedRoute from './category/ProtectedRoute';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <Toaster position="top-right" />

          <Routes>

            {/* 🔓 PUBLIC ROUTES WITH LAYOUT */}
            <Route element={<MainLayout />}>
              <Route path="/" element={<Homepage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/trending" element={<TrendingPage />} />
              <Route path="/view/:id" element={<ProductViewPage1 />} />

              <Route path="/category/:slug" element={<CategoryPage />} />
              <Route path="/mens" element={<MenPage />} />
              <Route path="/womens" element={<WomenPage />} />
              <Route path="/offers" element={<HotOffers />} />
              <Route path="/new" element={<NewArrivals />} />

              {/* 🔐 USER PROTECTED */}
              <Route
                path="/cart"
                element={
                  <ProtectedRoute>
                    <CartPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/checkout"
                element={
                  <ProtectedRoute>
                    <Elements stripe={stripePromise}>
                      <CheckoutPage />
                    </Elements>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/track/:orderId"
                element={
                  <ProtectedRoute>
                    <TrackOrderPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/oderpage"
                element={
                  <ProtectedRoute>
                    <OrdersPage1 />
                  </ProtectedRoute>
                }
              />
            </Route>

            {/* ❌ AUTH ROUTES (NO LAYOUT) */}
            <Route path="/login" element={<SignInForm />} />
            <Route path="/register" element={<SignUpForm />} />
            <Route path="/verify-otp" element={<VerifyOtp />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

            {/* 🧑‍💼 VENDOR PROTECTED */}
            <Route
              path="/Vendor"
              element={
                <ProtectedRoute role="vendor">
                  <VendorDashboard1 />
                </ProtectedRoute>
              }
            />

            <Route
              path="/products"
              element={
                <ProtectedRoute role="vendor">
                  <ProductPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/Orders"
              element={
                <ProtectedRoute role="vendor">
                  <OrdersPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/Profile"
              element={
                <ProtectedRoute role="vendor">
                  <VendorProfile />
                </ProtectedRoute>
              }
            />

          </Routes>

        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;