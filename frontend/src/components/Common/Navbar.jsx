import React from 'react'
import { Link } from 'react-router-dom'
import { BsPerson, BsBag, BsList } from 'react-icons/bs'
import SearchBar from './SearchBar'

const Navbar = () => {
  return (
    <nav className='bg-white shadow-sm'>
      <div className='container mx-auto flex items-center justify-between py-4 px-6'>
        {/* Left Logo */}
        <div>
          <Link to="/" className='text-xl font-semibold text-blue-600 hover:text-blue-700 transition-colors duration-300'>
            ShopEase
          </Link>
        </div>
        
        {/* Center - Navigation Links */}
        <div className='hidden md:flex space-x-6'>
          <Link to="#" className='text-sm uppercase font-medium text-gray-700 hover:text-blue-500 transition-colors duration-300'>
            Men
          </Link>
          <Link to="#" className='text-sm uppercase font-medium text-gray-700 hover:text-blue-500 transition-colors duration-300'>
            Women
          </Link>
          <Link to="#" className='text-sm uppercase font-medium text-gray-700 hover:text-blue-500 transition-colors duration-300'>
            Topwear
          </Link>
          <Link to="#" className='text-sm uppercase font-medium text-gray-700 hover:text-blue-500 transition-colors duration-300'>
            Bottomwear
          </Link>
        </div>
        


        {/* Search and Icons */}
        <SearchBar/>

        {/* Mobile Menu Button */}
        <button className='md:hidden'>
          <BsList className='h-6 w-6 text-gray-700 hover:text-blue-500 transition-colors duration-300' />
        </button>
      </div>
    </nav>
  )
}

export default Navbar