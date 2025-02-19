import { BrowserRouter, Routes, Route } from "react-router-dom";
import UserLayout from "./components/Layout/UserLayout";
// Import your AdminLayout if needed
// import AdminLayout from "./components/Layout/AdminLayout";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Route for User Layout */}
        <Route path="/" element={<UserLayout />} />

        {/* Route for Admin Layout (Uncomment if needed) */}
        {/* <Route path="/admin" element={<AdminLayout />} /> */}
      </Routes>
    </BrowserRouter>
  );
};

export default App;
