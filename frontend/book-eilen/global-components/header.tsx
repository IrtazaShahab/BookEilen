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
import Image from 'next/image';

const callsToAction = [
    { name: 'Watch demo', href: '#', icon: PlayCircleIcon },
    { name: 'Contact sales', href: '#', icon: PhoneIcon },
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
                <div className="be-navbar-content">
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
                <PopoverGroup className="be-nav-content">
                    <Popover className="be-dropdown">
                        <PopoverButton className="be-link">
                            Browse
                            <ChevronDownIcon aria-hidden="true" className="" />
                        </PopoverButton>

                        <PopoverPanel
                            transition
                            className="be-dropdown-list">
                            <div className="p-4 be-list-item">
                            </div>

                            <div className="call-to-action">
                                {callsToAction.map((item) => (
                                    <a
                                        key={item.name}
                                        href={item.href}
                                        className="be-link"
                                    >
                                        <item.icon aria-hidden="true" className="" />
                                        {item.name}
                                    </a>
                                ))}
                            </div>
                        </PopoverPanel>
                    </Popover>

                    <button href="#" className="be-link">
                        Features
                    </button>

                </PopoverGroup>
                </div>
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
                <div className="be-right-content">
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

                    <a href="#" className="be-login-btn be-link">
                        Log in <span aria-hidden="true">&rarr;</span>
                    </a>
                </div>
            </nav>
        </header>
    );
}
