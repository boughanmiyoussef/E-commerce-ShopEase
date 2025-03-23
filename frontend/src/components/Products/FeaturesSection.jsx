import { React, useEffect } from "react";
import { HiOutlineCreditCard, HiShoppingBag, HiRefresh } from "react-icons/hi"; // Changed HiArrowPath to HiRefresh

const FeaturesSection = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" }); // Scroll to top when component mounts
  }, []);

  return (
    <section className="py-16 px-4 bg-white">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
        {/* Feature 1 */}
        <div className="flex flex-col items-center">
          <div className="p-4 rounded-full mb-4">
            <HiShoppingBag className="text-xl" />
          </div>
          <h4 className="tracking-tighter mb-2">Free International Shipping</h4>
          <p className="text-gray-600 text-sm tracking-tighter">
            On All Orders Over $100.00
          </p>
        </div>
        {/* Feature 2 */}
        <div className="flex flex-col items-center">
          <div className="p-4 rounded-full mb-4">
            <HiRefresh className="text-xl" />{" "}
            {/* Replaced HiArrowPath with HiRefresh */}
          </div>
          <h4 className="tracking-tighter mb-2">45 Days Return</h4>
          <p className="text-gray-600 text-sm tracking-tighter">
            Money Back Guarantee
          </p>
        </div>
        {/* Feature 3 */}
        <div className="flex flex-col items-center">
          <div className="p-4 rounded-full mb-4">
            <HiOutlineCreditCard className="text-xl" />
          </div>
          <h4 className="tracking-tighter mb-2">Secure Checkout</h4>
          <p className="text-gray-600 text-sm tracking-tighter">
            100% Secured Checkout Process
          </p>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
