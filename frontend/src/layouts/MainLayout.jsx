import { useState } from 'react';
import { Outlet, Navigate, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Home, CreditCard, Receipt, LogOut, Menu, X, Settings } from 'lucide-react';
import api from '../api/axios';

const MainLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const location = useLocation();
    const user = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');
    
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const [profileForm, setProfileForm] = useState({ 
        name: user?.name || '', 
        email: user?.email || '', 
        password: '', 
        password_confirmation: '' 
    });

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    const navigation = [
        { name: 'Dashboard', href: '/', icon: LayoutDashboard },
        { name: 'Penghuni', href: '/residents', icon: Users },
        { name: 'Rumah', href: '/houses', icon: Home },
        { name: 'Iuran', href: '/payments', icon: CreditCard },
        { name: 'Pengeluaran', href: '/expenses', icon: Receipt },
    ];

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        if (profileForm.password && profileForm.password !== profileForm.password_confirmation) {
            alert('Konfirmasi password tidak cocok!');
            return;
        }
        try {
            const res = await api.put('/profile', profileForm);
            localStorage.setItem('user', JSON.stringify(res.data.data));
            alert('Profil berhasil diperbarui');
            setIsProfileModalOpen(false);
            window.location.reload();
        } catch (error) {
            alert(error.response?.data?.message || 'Gagal memperbarui profil');
        }
    };

    const handleLogout = async () => {
        try {
            await api.post('/logout');
        } catch (error) {
            console.error('Logout failed:', error);
        } finally {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
    };

    return (
        <div className="flex h-screen bg-gray-50 text-gray-900 font-sans">
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 z-20 bg-black/50 md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-xl transform transition-transform duration-300 md:relative md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="flex items-center justify-between h-16 px-6 bg-indigo-600 text-white">
                    <span className="text-xl font-bold tracking-wider">RT Admin</span>
                    <button className="md:hidden text-white" onClick={() => setIsSidebarOpen(false)}>
                        <X size={24} />
                    </button>
                </div>
                
                <div className="flex flex-col h-[calc(100vh-4rem)] justify-between overflow-y-auto">
                    <nav className="px-4 mt-6 space-y-1">
                        {navigation.map((item) => {
                            const isActive = location.pathname === item.href || 
                                          (item.href !== '/' && location.pathname.startsWith(item.href));
                            return (
                                <Link
                                    key={item.name}
                                    to={item.href}
                                    className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                                        isActive 
                                        ? 'bg-indigo-50 text-indigo-600' 
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                    }`}
                                >
                                    <item.icon className={`mr-3 h-5 w-5 ${isActive ? 'text-indigo-600' : 'text-gray-400'}`} />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="p-4 border-t">
                        <div className="flex items-center px-4 mb-4 text-sm font-medium text-gray-700 truncate">
                            {user?.name || 'Admin'}
                        </div>
                        <button
                            onClick={() => setIsProfileModalOpen(true)}
                            className="flex items-center w-full px-4 py-2 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-50 transition-colors mb-1"
                        >
                            <Settings className="mr-3 h-5 w-5 text-gray-500" />
                            Profil Admin
                        </button>
                        <button
                            onClick={handleLogout}
                            className="flex items-center w-full px-4 py-2 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                        >
                            <LogOut className="mr-3 h-5 w-5 text-red-500" />
                            Logout
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="flex items-center justify-between h-16 px-6 bg-white border-b md:hidden">
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="text-gray-500 hover:text-gray-700 focus:outline-none"
                    >
                        <Menu size={24} />
                    </button>
                    <span className="text-xl font-bold text-indigo-600 tracking-wider">RT Admin</span>
                </header>
                
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
                    <Outlet />
                </main>
            </div>

            {/* Modal Profil */}
            {isProfileModalOpen && (
                <div className="fixed inset-0 z-[60] overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 transition-opacity" onClick={() => setIsProfileModalOpen(false)}>
                            <div className="absolute inset-0 bg-gray-900 opacity-50"></div>
                        </div>
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
                        <div className="relative z-10 inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md sm:w-full">
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="flex justify-between items-center mb-5">
                                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                                        Edit Profil Admin
                                    </h3>
                                    <button onClick={() => setIsProfileModalOpen(false)} className="text-gray-400 hover:text-gray-500">
                                        <X className="h-6 w-6" />
                                    </button>
                                </div>
                                <form onSubmit={handleUpdateProfile} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Nama</label>
                                        <input type="text" value={profileForm.name} onChange={(e) => setProfileForm({...profileForm, name: e.target.value})} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 sm:text-sm focus:ring-indigo-500 focus:border-indigo-500" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Email Login</label>
                                        <input type="email" value={profileForm.email} onChange={(e) => setProfileForm({...profileForm, email: e.target.value})} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 sm:text-sm focus:ring-indigo-500 focus:border-indigo-500" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Password Baru</label>
                                        <input type="password" value={profileForm.password} onChange={(e) => setProfileForm({...profileForm, password: e.target.value})} placeholder="Biarkan kosong jika tidak diubah" minLength={8} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 sm:text-sm focus:ring-indigo-500 focus:border-indigo-500" />
                                    </div>
                                    {profileForm.password && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Konfirmasi Password Baru</label>
                                        <input type="password" value={profileForm.password_confirmation} onChange={(e) => setProfileForm({...profileForm, password_confirmation: e.target.value})} required={!!profileForm.password} minLength={8} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 sm:text-sm focus:ring-indigo-500 focus:border-indigo-500" />
                                    </div>
                                    )}
                                    <div className="mt-5 sm:mt-6 sm:flex sm:flex-row-reverse pb-2">
                                        <button type="submit" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 sm:ml-3 sm:w-auto sm:text-sm">Simpan</button>
                                        <button type="button" onClick={() => setIsProfileModalOpen(false)} className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 sm:mt-0 sm:w-auto sm:text-sm">Batal</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MainLayout;
