'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Popover,
  PopoverButton,
  PopoverGroup,
  PopoverPanel,
} from '@headlessui/react';
import {
  ChevronDownIcon,
  Bars3Icon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

import Link from "next/link";
import { useRouter } from 'next/navigation';
import LogoImage from 'images/logo.svg';
import SearchIcon from 'images/search-icon.svg';
import DropdownIcon from 'images/dropdown-icon.svg';
import LogoutIcon from 'images/log-out.svg';
import SettingsIcon from 'images/settings-icon.svg';
import ReadListIcon from 'images/read-list.svg';
import MyBooksIcon from 'images/open-book.svg';
import PersonIcon from 'images/person.svg';
import Image from 'next/image';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const searchRef = useRef(null);
  const buttonRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();



  // Close if clicking outside input and outside button
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setMobileSearchOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);

  }, []);

   // Detect screen size
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 992); // adjust breakpoint if needed
    };

    handleResize(); // check on mount
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);


  return (
    <header className="be-header">
      <div>
      <nav aria-label="Global" className="be-nav">
        {/* Left Content */}
        <div className="be-navbar-content">
          {/* Logo */}
          <div className="be-logo">
            <Link href="/" className="be-link">
              <Image
                alt="Logo-Image"
                src={LogoImage}
                width="158"
                height="38"
              />
            </Link>
          </div>

          {/* Nav Dropdown */}
          <PopoverGroup className="be-nav-content">
            <Popover className="be-dropdown">
              <PopoverButton className="be-link">
                <Link href= "/pages/dashboard">
                Browse
                </Link>
                <ChevronDownIcon aria-hidden="true" width={20} height={20}/>
              </PopoverButton>
              <PopoverPanel transition className="be-dropdown-content">
                <div className="p-4 be-list-content">
                  <h5>Browse</h5>
                  <div className="be-list">
                    <ul>
                      <li><a href="#">Romance</a></li>
                      <li><a href="#">Fan-Fiction</a></li>
                      <li><a href="#">Fantasy</a></li>
                      <li><a href="#">Historical Fic</a></li>
                      <li><a href="#">Humor</a></li>
                      <li><a href="#">Sci-Fi</a></li>
                    </ul>
                    <ul>
                      <li><a href="#">Paranormal</a></li>
                      <li><a href="#">Mystry</a></li>
                      <li><a href="#">Poetry</a></li>
                      <li><a href="#">Adventure</a></li>
                      <li><a href="#">Thriller</a></li>
                      <li><a href="#">Teen Fiction</a></li>
                    </ul>
                    <ul>
                      <li><a href="#">Diverse Lit</a></li>
                      <li><a href="#">Editors Picks</a></li>
                      <li><a href="#">Non-Fiction</a></li>
                      <li><a href="#">Short Fiction</a></li>
                    </ul>
                  </div>
                </div>
              </PopoverPanel>
            </Popover>
            <Link href="#" className="be-link">Features</Link>
          </PopoverGroup>
        </div>

        {/* Right Content */}
        <div className="be-right-content">
          {(isMobile ? mobileSearchOpen : true) && (
        <div className="be-input" ref={searchRef}>
          <input
            type="text"
            placeholder="Search here"
            value={searchTerm}
            onChange={handleSearchChange}
            className="be-search-input"
          />
          <Image className="search-icon" src={SearchIcon} alt="search-icon" />
        </div>
          )}

         {isMobile && (
        <button
          type="button"
          onClick={() => setMobileSearchOpen(true)}
          ref={buttonRef}
          className="search-toggle-btn"
        >
          <Image
            className="search-icon-outside"
            src={SearchIcon}
            width={25}
            height={25}
            alt="search-icon"
          />
        </button>
         )}


          <a href="#" className="be-login-btn be-link">
            Log in
          </a>
{/*
         <button>
          <a href="#" className="be-login-btn be-link">
            Sign up
          </a>
          </button> */}

          <PopoverGroup className="be-profile-dropdown">
            <Popover className="be-dropdown">
              <PopoverButton className="be-link">
                <Image src={DropdownIcon} width="36" height="36" alt="dropdown" className="profile-img" />
                <h6 className="dropdown-username">Muaz Rehan</h6>
                <ChevronDownIcon aria-hidden="true" />
              </PopoverButton>
              <PopoverPanel className="be-dropdown-content">
                <div className="p-4 be-list-content">
                  <h5>
                    <Image src={PersonIcon} width="26" height="26" alt="person-icon" /> My Profile
                  </h5>
                  <div className="be-list">
                    <ul>
                      <li><a href="#"><Image src={MyBooksIcon} width="22" height="22" alt="" />My Books</a></li>
                      <li><a href="#"><Image src={ReadListIcon} width="24" height="24" alt="" />Read List</a></li>
                      <li><a href="#"><Image src={SettingsIcon} width="24" height="24" alt="" />Settings</a></li>
                      <li><a href="#"><Image src={LogoutIcon} width="24" height="24" alt="" />Log Out</a></li>
                    </ul>
                  </div>
                </div>
              </PopoverPanel>
            </Popover>
          </PopoverGroup>

          {/* Toggler button (Mobile only) */}
         <div className="be-navbar-toggle d-block d-lg-none">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="be-navbar-toggle-icon"
          >
            <Bars3Icon className="size-6" />
          </button>
        </div>
        </div>
      </nav>
      </div>

      {/* Mobile Menu */}
      <div className={`be-navbar-mobile d-lg-none ${mobileMenuOpen ? 'show' : 'hide'}`}>
        <div className="be-mobile-header">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(false)}
            className="mobile-close"
          >
            <XMarkIcon className="size-6" />
          </button>
        </div>

        <div className="be-navbar-content">
          {/* Reuse or adjust for mobile */}
{/* Nav Dropdown */}
<PopoverGroup className="be-nav-content">
            <Popover className="be-dropdown">
              <PopoverButton className="be-link">
                Browse
                <ChevronDownIcon aria-hidden="true" width={20} height={20}/>
              </PopoverButton>
              <PopoverPanel transition className="be-dropdown-content">
                <div className="p-4 be-list-content">
                  <div className="be-list">
                    <ul>
                      <li><a href="#">Romance</a></li>
                      <li><a href="#">Fan-Fiction</a></li>
                      <li><a href="#">Fantasy</a></li>
                      <li><a href="#">Historical Fic</a></li>
                      <li><a href="#">Humor</a></li>
                      <li><a href="#">Sci-Fi</a></li>
                    </ul>
                    <ul>
                      <li><a href="#">Paranormal</a></li>
                      <li><a href="#">Mystry</a></li>
                      <li><a href="#">Poetry</a></li>
                      <li><a href="#">Adventure</a></li>
                      <li><a href="#">Thriller</a></li>
                      <li><a href="#">Teen Fiction</a></li>
                    </ul>
                    <ul>
                      <li><a href="#">Diverse Lit</a></li>
                      <li><a href="#">Editors Picks</a></li>
                      <li><a href="#">Non-Fiction</a></li>
                      <li><a href="#">Short Fiction</a></li>
                    </ul>
                  </div>
                </div>
              </PopoverPanel>
            </Popover>
            <button href="#" className="be-link">Features</button>
          </PopoverGroup>
        </div>
      </div>
    </header>
  );
}
