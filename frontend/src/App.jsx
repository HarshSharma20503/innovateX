import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import "./App.css";

import Login from "./pages/Auth/Login";
import SignUp from "./pages/Auth/SignUp";
import PrivateRoutes from "./utils/PrivateRoutes";
import Navbar from "./components/Navbar/Navbar";
import ScrollToTop from "./components/ScrollToTop/ScrollToTop";
import ItemDetails from "./pages/ItemDetails/ItemDetails";
import Home_Seller from "./pages/Home/Home_Seller";
import Home_Middleman from "./pages/Home/Home_Middleman";
import Home_Buyer from "./pages/Home/Home_Buyer";

const App = () => {
  return (
    <>
      {/* Container for displaying toast notifications */}
      <ToastContainer />

      {/* Scroll to top on route change */}
      <ScrollToTop />

      {/* Navigation bar */}
      <Navbar />

      {/* Define application routes */}
      <Routes>
        {/* Private routes */}
        <Route element={<PrivateRoutes />}>
          <Route path="/home-seller" element={<Home_Seller />} />
          <Route path="/home-middleman" element={<Home_Middleman />} />
          <Route path="/home-buyer" element={<Home_Buyer />} />
          <Route path="/itemDetails/:id" element={<ItemDetails />} />
        </Route>

        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signUp" element={<SignUp />} />
      </Routes>
    </>
  );
};

export default App;
