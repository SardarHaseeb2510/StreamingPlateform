import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTachometerAlt, FaUsers, FaUser, FaFilm, FaClipboardList } from 'react-icons/fa';

function AdminHeader() {
    const navigator = useNavigate();

    return (
        <header className="bg-gradient-to-b from-black to-violet-900 text-white shadow-lg">
            <div className="container  px-4 py-4 flex ">
                <div className="flex items-center space-x-4">
                  
                </div>
                <nav className="flex space-x-4 flex-wrap justify-center sm:justify-start">
                    <Button
                        onClick={() => navigator('/admin/adminDashboard')}
                        icon={<FaTachometerAlt />}
                        label="Dashboard"
                    />
                    <Button
                        onClick={() => navigator('/admin/userManagement')}
                        icon={<FaUsers />}
                        label="User Management"
                    />
                    <Button
                        onClick={() => navigator('/admin/sellerManagement')}
                        icon={<FaUser />}
                        label="Seller Management"
                    />
                    <Button
                        onClick={() => navigator('/admin/seller/approveMovies')}
                        icon={<FaFilm />}
                        label="Movies Management"
                    />
                    <Button
                        onClick={() => navigator('/admin/subscriptionManagement')}
                        icon={<FaClipboardList />}
                        label="Subscription Management"
                    />
                    <button
                        onClick={() => navigator('/logout')}
                        className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-semibold rounded-lg shadow-md transition duration-200 mt-2 sm:mt-0"
                    >
                        Logout
                    </button>
                </nav>
            </div>
        </header>
    );
}

function Button({ onClick, icon, label }) {
    return (
        <button
            onClick={onClick}
            className="px-4 py-2 bg-gradient-to-r from-violet-700 to-violet-600 hover:from-violet-600 hover:to-violet-500 text-white font-semibold rounded-lg shadow-md transition duration-300 transform hover:scale-105 mb-2 sm:mb-0"
        >
            {icon && <span className="mr-2">{icon}</span>}
            {label}
        </button>
    );
}

export default AdminHeader;
