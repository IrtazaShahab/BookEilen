'use client';

import { useState } from 'react';
import {

    Popover,
    PopoverButton,
    PopoverGroup,
    PopoverPanel,
} from '@headlessui/react';
import {
    ArrowPathIcon,
    Bars3Icon,
    ChartPieIcon,
    CursorArrowRaysIcon,
    FingerPrintIcon,
    SquaresPlusIcon,

} from '@heroicons/react/24/outline';
import { ChevronDownIcon, PhoneIcon, PlayCircleIcon } from '@heroicons/react/20/solid';
import LogoImage from 'images/logo.svg';
import SearchIcon from "images/search-icon.svg";
import DropdownIcon from "images/dropdown-icon.svg";
import LogoutIcon from "images/log-out.svg";
import SettingsIcon from "images/settings-icon.svg";
import ReadListIcon from "images/read-list.svg";
import MyBooksIcon from "images/open-book.svg";
import PersonIcon from "images/person.svg";
import Image from 'next/image';

const callsToAction = [
    { name: 'Watch demo', href: '#', icon: PlayCircleIcon },
    { name: 'Contact sales', href: '#', icon: PhoneIcon },
];

const items: MenuProps['items'] = [
    {
      label: (
        <a href="https://www.antgroup.com" target="_blank" rel="noopener noreferrer">
          1st menu item
        </a>
      ),
      key: '0',
    },
    {
      label: (
        <a href="https://www.aliyun.com" target="_blank" rel="noopener noreferrer">
          2nd menu item
        </a>
      ),
      key: '1',
    },
    {
      type: 'divider',
    },
    {
      label: '3rd menu item',
      key: '3',
    },
];

export default function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    console.log("Searching for:", e.target.value); // You can handle search logic here
  };

    return (
        <header className="be-header">
            <nav aria-label="Global" className="be-nav">
                {/* navbar-left-content */}
                <div className="be-navbar-content">
                {/* brand-logo */}
                <div className="be-logo">
                    <a href="#" className="be-link">
                        <span className="sr-only">Your Company</span>
                        <Image
                            alt="Logo-Image"
                            src={LogoImage} width="158" height="38"
                            className=""
                        />
                    </a>
                </div>
                {/* nav-list-dropdown */}
                <PopoverGroup className="be-nav-content">
                    <Popover className="be-dropdown">
                        <PopoverButton className="be-link">
                            Browse
                            <ChevronDownIcon aria-hidden="true" className="" />
                        </PopoverButton>
                {/* dropdown-content */}
                        <PopoverPanel
                            transition
                            className="be-dropdown-content">
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

                    <button href="#" className="be-link">
                        Features
                    </button>

                </PopoverGroup>
                </div>
                {/* navbar toggler */}
                <div className="be-navbar-toggle">
                    <button
                        type="button"
                        onClick={() => setMobileMenuOpen(true)}
                        className="be-navbar-toggle-icon"
                    >
                        <span className="sr-only">Open main menu</span>
                        <Bars3Icon aria-hidden="true" className="size-6" />
                    </button>
                </div>
                {/* navbar left content */}
                <div className="be-right-content">
                 {/* nlt-search-input */}
                 <div className="be-input">
                    <input
                      type="text"
                      placeholder="Search here"
                      value={searchTerm}
                      onChange={handleSearchChange}
                      className="be-search-input"
                    />
                    <Image className='search-icon' src={SearchIcon} alt="search-icon" />
                 </div>
                 {/* nlt-login-btn */}
                    <a href="#" className="be-login-btn be-link">
                        Log in <span aria-hidden="true">&rarr;</span>
                    </a>

  <PopoverGroup className="be-profile-dropdown">
                    <Popover className="be-dropdown">
                        <PopoverButton className="be-link">
                        <Image alt="dropdown-logo"  src={DropdownIcon} width="36" height="36" className="profile-img"/>
                        <ChevronDownIcon aria-hidden="true" className="" />
                        </PopoverButton>
                {/* dropdown-content */}
                        <PopoverPanel
                            transition
                            className="be-dropdown-content">
                            <div className="p-4 be-list-content">
                                <h5><Image alt="person-icon"  src={PersonIcon} width="26" height="26" className="person-icon"/> My Profile</h5>
                                <div className="be-list">
                                <ul>
                                    <li><a href="#"><Image alt="My-Books-icon"  src={MyBooksIcon} width="22" height="22" className="My-Books-icon"/>
                                            My Books</a></li>
                                    <li><a href="#"><Image alt="read-list-icon"  src={ReadListIcon} width="24" height="24" className="read-list-icon"/>
                                        Read List</a></li>
                                    <li><a href="#"><Image alt="settings-icon"  src={SettingsIcon} width="24" height="24" className="settings-icon"/>
                                        Settings</a></li>
                                 <li><a href="#"><Image alt="logout-icon"  src={LogoutIcon} width="24" height="24" className="logout-icon"/>
                                        Log Out</a></li>
                                </ul>
                                </div>
                            </div>
                        </PopoverPanel>
                    </Popover>
                </PopoverGroup>
                </div>
            </nav>
        </header>
    );
}
