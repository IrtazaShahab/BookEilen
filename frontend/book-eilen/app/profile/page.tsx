'use client';

import { useState } from 'react';
import Image from 'next/image';
import profileImage from '@/assets/images/Irtaza.webp';

import { User, BookMarked, Heart, Settings, Bell, Trash2, LogOut } from 'lucide-react';

export default function ProfilePage() {
    const [activeSection, setActiveSection] = useState('profile');

    // Mock user data - replace with actual API data
    const userData = {
        username: 'Irtaza Shahab',
        userId: '@Irtaza123',
        profileImage: profileImage,
        readListCount: 24,
        wishlistCount: 15,
        followers: 156,
        bio: 'Book lover | Fantasy enthusiast | Currently reading 3 books',
        joinedDate: 'January 2024',
    };

    const sidebarItems = [
        { id: 'profile', label: 'Profile', icon: User },
        { id: 'edit', label: 'Edit Profile', icon: Settings },
        { id: 'readlist', label: 'Read List', icon: BookMarked },
        { id: 'wishlist', label: 'Wishlist', icon: Heart },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'delete', label: 'Delete Account', icon: Trash2, danger: true },
    ];

    const renderContent = () => {
        switch (activeSection) {
            case 'profile':
                return <ProfileContent userData={userData} />;
            case 'edit':
                return <EditProfile userData={userData} />;
            case 'readlist':
                return <ReadList />;
            case 'wishlist':
                return <Wishlist />;
            case 'notifications':
                return <Notifications />;
            case 'delete':
                return <DeleteAccount />;
            default:
                return <ProfileContent userData={userData} />;
        }
    };
    return (
        <div className="min-h-screen bg-[#181818] mb-[100px]">
            {/* Profile Card with Carousel Effect */}
            <div className="bg-[#E50914] h-[350px] flex justify-center items-end rounded-2xl shadow-xl overflow-hidden mb-[60px] ml-8 mr-8">
                <div className="p-8 text-white">
                    <div className="flex flex-col items-center">
                        {/* Profile Image */}
                        <div className="w-22 h-22 rounded-full border-2 border-white shadow-lg mb-[16px] overflow-hidden">
                            <Image src={userData.profileImage} alt={userData.username} className="w-full h-full object-cover" />
                        </div>

                        {/* User Info */}
                        <h2 className="text-2xl font-bold mb-1">{userData.username}</h2>
                        <p className="text-blue-100 mb-4">{userData.userId}</p>

                        {/* Stats */}
                        <div className="flex gap-8">
                            <div className="text-center">
                                <div className="text-2xl font-bold">{userData.readListCount}</div>
                                <div className="text-sm text-blue-100">Books Read</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold">{userData.wishlistCount}</div>
                                <div className="text-sm text-blue-100">Wishlist</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold">{userData.followers}</div>
                                <div className="text-sm text-blue-100">Followers</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex px-8 gap-6 ">
                {/* Sidebar */}
                <aside className="w-[330px] bg-[#282828] shadow-lg min-h-screen sticky top-0 rounded-[25px]">
                    <div className="p-6">
                        <h2 className="text-2xl font-bold !text-gray-200 mb-6">Settings</h2>
                        <nav className="space-y-2 flex flex-col gap-[10px]">
                            {sidebarItems.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveSection(item.id)}
                                    className={`w-full flex items-center gap-4 px-[16px] py-[12px] !rounded-2xl bg-transparent border-2 transition-colors duration-300 ${
                                        item.danger
                                            ? 'border-transparent text-red-600 hover:border-[#e50914] hover:text-red-600'
                                            : activeSection === item.id
                                            ? 'border-[#e50914] text-white font-medium'
                                            : 'border-transparent text-gray-300 hover:border-[#e50914] hover:text-white'
                                    }`}
                                >
                                    <item.icon size={20} />
                                    <span>{item.label}</span>
                                </button>
                            ))}
                            <button className="w-full flex items-center gap-3 px-[16px] py-[12px] rounded-2xl text-gray-300 br-transparent hover:bg-transparent hover:text-[#e50914] transition-all mt-4 border-t border-t-[#858585] pt-4">
                                <LogOut size={20} />
                                <span>Logout</span>
                            </button>
                        </nav>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 p-8">{renderContent()}</main>
            </div>
        </div>
    );
}

function ProfileContent({ userData }) {
    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Profile</h1>

            {/* Bio Section */}
            <div className="max-w-4xl bg-white rounded-xl shadow-md p-6 mb-6">
                <h3 className="text-xl font-semibold !text-[#181818] mb-3">About</h3>
                <p className="text-gray-600 mb-4">{userData.bio}</p>
                <p className="text-sm !text-gray-400">Joined {userData.joinedDate}</p>
            </div>

            {/* Quick Actions */}
            <div className="max-w-4xl grid grid-cols-2 gap-4">
                <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer">
                    <BookMarked className="text-blue-500 mb-3" size={32} />
                    <h3 className="font-semibold !text-gray-800">Read List</h3>
                    <p className="text-sm !text-gray-500">{userData.readListCount} books</p>
                </div>
                <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer">
                    <Heart className="text-red-500 mb-3" size={32} />
                    <h3 className="font-semibold !text-gray-800">Wishlist</h3>
                    <p className="text-sm !text-gray-500">{userData.wishlistCount} books</p>
                </div>
            </div>
        </div>
    );
}

function EditProfile({ userData }) {
    const [formData, setFormData] = useState({
        username: userData.username,
        bio: userData.bio,
        profileImage: userData.profileImage,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Updating profile:', formData);
    };

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Edit Profile</h1>

            <div className="bg-white rounded-xl shadow-md p-8">
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Profile Picture URL</label>
                    <input
                        type="text"
                        value={formData.profileImage}
                        onChange={(e) => setFormData({ ...formData, profileImage: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                    <input
                        type="text"
                        value={formData.username}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                    <textarea
                        value={formData.bio}
                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                        rows={4}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>

                <button
                    onClick={handleSubmit}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                    Save Changes
                </button>
            </div>
        </div>
    );
}

function ReadList() {
    const mockBooks = [
        { id: 1, title: 'The Hobbit', author: 'J.R.R. Tolkien', rating: 5, cover: 'https://covers.openlibrary.org/b/id/8228691-M.jpg' },
        { id: 2, title: 'Harry Potter', author: 'J.K. Rowling', rating: 5, cover: 'https://covers.openlibrary.org/b/id/10521270-M.jpg' },
        { id: 3, title: '1984', author: 'George Orwell', rating: 4, cover: 'https://covers.openlibrary.org/b/id/7222246-M.jpg' },
    ];

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Read List</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockBooks.map((book) => (
                    <div key={book.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                        <Image src={book.cover} alt={book.title} className="w-full h-64 object-cover" />
                        <div className="p-4">
                            <h3 className="font-semibold text-gray-800 mb-1">{book.title}</h3>
                            <p className="text-sm text-gray-600 mb-2">{book.author}</p>
                            <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                    <span key={i} className={i < book.rating ? 'text-yellow-400' : 'text-gray-300'}>
                                        ★
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function Wishlist() {
    const mockBooks = [
        { id: 1, title: 'Dune', author: 'Frank Herbert', cover: 'https://covers.openlibrary.org/b/id/8220163-M.jpg' },
        { id: 2, title: 'The Name of the Wind', author: 'Patrick Rothfuss', cover: 'https://covers.openlibrary.org/b/id/8513716-M.jpg' },
    ];

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Wishlist</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockBooks.map((book) => (
                    <div key={book.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                        <img src={book.cover} alt={book.title} className="w-full h-64 object-cover" />
                        <div className="p-4">
                            <h3 className="font-semibold text-gray-800 mb-1">{book.title}</h3>
                            <p className="text-sm text-gray-600">{book.author}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function Notifications() {
    const mockNotifications = [
        { id: 1, message: 'John followed you', time: '2 hours ago' },
        { id: 2, message: 'New book added to wishlist', time: '1 day ago' },
    ];

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Notifications</h1>

            <div className="space-y-4">
                {mockNotifications.map((notif) => (
                    <div key={notif.id} className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition-shadow">
                        <p className="text-gray-800">{notif.message}</p>
                        <p className="text-sm text-gray-500 mt-1">{notif.time}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

function DeleteAccount() {
    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Delete Account</h1>

            <div className="bg-red-50 border border-red-200 rounded-xl p-8">
                <h2 className="text-xl font-semibold text-red-800 mb-4">Warning: This action is irreversible</h2>
                <p className="text-gray-700 mb-6">
                    Deleting your account will permanently remove all your data, including your read list, wishlist, and profile
                    information.
                </p>
                <button className="bg-red-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-700 transition-colors">
                    Delete My Account
                </button>
            </div>
        </div>
    );
}
