import React from 'react'; 
import { TbBrandMeta } from 'react-icons/tb'; // Added Instagram and TikTok icons
import { IoLogoInstagram } from 'react-icons/io'; // Added Instagram and TikTok icons
import { RiTwitterXLine } from 'react-icons/ri'; // Added Instagram and TikTok icons

const Topbar = () => {
  return (
    <div className="bg-black text-white"> {/* Set the background to black and text to white */}
      <div className="container mx-auto flex justify-between items-center py-3">
        <div className="hidden md:flex items-center space-x-4"> {/* Added spacing between the icons */}
          <a href="#" className="hover:text-gray-300">
            <TbBrandMeta className="h-5 w-5" />
          </a>
          <a href="#" className="hover:text-gray-300">
            <IoLogoInstagram className="h-5 w-5" />
          </a>
          <a href="#" className="hover:text-gray-300">
            <RiTwitterXLine className="h-5 w-5" />
          </a>
          {/* Add more logos as needed */}
        </div>
        <div className='text-sm text-center flex-grow'>
            <span>We Ship Worldwide - Fast And Reliable Shipping</span>
        </div>
        <div className='text-sm hidden md:block'>
            <a href="tel:+1234567890" className='hover:text-gray-300'>
                Call Us: +1 234 567 890
            </a>
        </div>
      </div>
    </div>
  );
};

export default Topbar;
