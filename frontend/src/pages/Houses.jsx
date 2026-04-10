import { useState, useEffect } from 'react';
import { Home, Edit, Trash2, Search, X, UserPlus, UserMinus } from 'lucide-react';
import api from '../api/axios';

const Houses = () => {
    const [houses, setHouses] = useState([]);
    const [residents, setResidents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isHouseModalOpen, setIsHouseModalOpen] = useState(false);
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
    const [currentHouse, setCurrentHouse] = useState(null);
    const [formData, setFormData] = useState({
        nomor_rumah: '',
        alamat: '',
        keterangan: ''
    });
    const [assignData, setAssignData] = useState({
        resident_id: '',
        tanggal_masuk: new Date().toISOString().split('T')[0],
        catatan: ''
    });

    const fetchHouses = async () => {
        setLoading(true);
        try {
            const response = await api.get(`/houses?search=${searchTerm}`);
            setHouses(response.data.data.data);
        } catch (error) {
            console.error('Error fetching houses:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchResidentsList = async () => {
        try {
            const response = await api.get('/residents/all');
            setResidents(response.data.data);
        } catch (error) {
            console.error('Error fetching residents list:', error);
        }
    };

    useEffect(() => {
        fetchHouses();
    }, [searchTerm]);

    useEffect(() => {
        fetchResidentsList();
    }, []);

    const openHouseModal = (house = null) => {
        if (house) {
            setCurrentHouse(house);
            setFormData({
                nomor_rumah: house.nomor_rumah,
                alamat: house.alamat,
                keterangan: house.keterangan || ''
            });
        } else {
            setCurrentHouse(null);
            setFormData({
                nomor_rumah: '',
                alamat: '',
                keterangan: ''
            });
        }
        setIsHouseModalOpen(true);
    };

    const openAssignModal = (house) => {
        setCurrentHouse(house);
        setAssignData({
            resident_id: '',
            tanggal_masuk: new Date().toISOString().split('T')[0],
            catatan: ''
        });
        setIsAssignModalOpen(true);
    };

    const handleSubmitHouse = async (e) => {
        e.preventDefault();
        try {
            if (currentHouse) {
                await api.put(`/houses/${currentHouse.id}`, formData);
            } else {
                await api.post('/houses', formData);
            }
            setIsHouseModalOpen(false);
            fetchHouses();
        } catch (error) {
            alert(error.response?.data?.message || 'Gagal menyimpan data');
        }
    };

    const handleAssignResident = async (e) => {
        e.preventDefault();
        try {
            await api.post(`/houses/${currentHouse.id}/assign-resident`, assignData);
            setIsAssignModalOpen(false);
            fetchHouses();
        } catch (error) {
            alert(error.response?.data?.message || 'Gagal menetapkan penghuni');
        }
    };

    const handleRemoveResident = async (id) => {
        if (window.confirm('Keluarkan penghuni dari rumah ini? (Histori akan tersimpan)')) {
            try {
                await api.post(`/houses/${id}/remove-resident`, { 
                    tanggal_keluar: new Date().toISOString().split('T')[0] 
                });
                fetchHouses();
            } catch (error) {
                alert(error.response?.data?.message || 'Gagal mengeluarkan penghuni');
            }
        }
    };

    const handleDeleteHouse = async (id) => {
        if (window.confirm('Apakah Anda yakin ingin menghapus rumah ini?')) {
            try {
                await api.delete(`/houses/${id}`);
                fetchHouses();
            } catch (error) {
                alert(error.response?.data?.message || 'Gagal menghapus data');
            }
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm">
                <div>
                    <h1 className="text-xl font-bold text-gray-900">Data Rumah</h1>
                    <p className="text-sm text-gray-500">Kelola master data rumah dan alokasi penghuni</p>
                </div>
                <button
                    onClick={() => openHouseModal()}
                    className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
                >
                    <Home className="h-5 w-5 mr-2" />
                    Tambah Rumah
                </button>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="p-4 border-b border-gray-200">
                    <div className="relative rounded-md shadow-sm max-w-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2 border"
                            placeholder="Cari nomor atau alamat rumah..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No Rumah</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Alamat</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Penghuni Saat Ini</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th scope="col" className="relative px-6 py-3"><span className="sr-only">Aksi</span></th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">Memuat data...</td>
                                </tr>
                            ) : houses.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">Tidak ada data rumah</td>
                                </tr>
                            ) : (
                                houses.map((house) => (
                                    <tr key={house.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                                            {house.nomor_rumah}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {house.alamat}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                                            {house.current_resident?.nama_lengkap || '-'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${house.status_hunian === 'dihuni' ? 'bg-indigo-100 text-indigo-800' : 'bg-gray-100 text-gray-800'}`}>
                                                {house.status_hunian === 'dihuni' ? 'Dihuni' : 'Kosong'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                            {house.status_hunian === 'tidak_dihuni' ? (
                                                <button onClick={() => openAssignModal(house)} className="text-green-600 hover:text-green-900 inline-flex mr-2" title="Masukkan Penghuni">
                                                    <UserPlus className="h-5 w-5" />
                                                </button>
                                            ) : (
                                                <button onClick={() => handleRemoveResident(house.id)} className="text-orange-500 hover:text-orange-700 inline-flex mr-2" title="Pindahkan Penghuni">
                                                    <UserMinus className="h-5 w-5" />
                                                </button>
                                            )}
                                            <button onClick={() => openHouseModal(house)} className="text-indigo-600 hover:text-indigo-900 inline-flex mr-2">
                                                <Edit className="h-5 w-5" />
                                            </button>
                                            <button onClick={() => handleDeleteHouse(house.id)} className="text-red-600 hover:text-red-900 inline-flex">
                                                <Trash2 className="h-5 w-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal Tambah/Edit Rumah */}
            {isHouseModalOpen && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 transition-opacity" onClick={() => setIsHouseModalOpen(false)}>
                            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                        </div>
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
                        <div className="relative z-10 inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="flex justify-between items-center mb-5">
                                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                                        {currentHouse ? 'Edit Rumah' : 'Tambah Rumah Baru'}
                                    </h3>
                                    <button onClick={() => setIsHouseModalOpen(false)} className="text-gray-400 hover:text-gray-500">
                                        <X className="h-6 w-6" />
                                    </button>
                                </div>
                                <form onSubmit={handleSubmitHouse} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Nomor Rumah</label>
                                        <input type="text" value={formData.nomor_rumah} onChange={(e) => setFormData({...formData, nomor_rumah: e.target.value})} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Alamat Lengkap</label>
                                        <textarea value={formData.alamat} onChange={(e) => setFormData({...formData, alamat: e.target.value})} required rows="3" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"></textarea>
                                    </div>
                                    <div className="mt-5 sm:mt-6 sm:flex sm:flex-row-reverse pb-2">
                                        <button type="submit" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm">Simpan</button>
                                        <button type="button" onClick={() => setIsHouseModalOpen(false)} className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:w-auto sm:text-sm">Batal</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Assign Resident */}
            {isAssignModalOpen && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 transition-opacity" onClick={() => setIsAssignModalOpen(false)}>
                            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                        </div>
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
                        <div className="relative z-10 inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md sm:w-full">
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="flex justify-between items-center mb-5">
                                    <h3 className="text-lg leading-6 font-medium text-gray-900">Masukkan Penghuni</h3>
                                    <button onClick={() => setIsAssignModalOpen(false)} className="text-gray-400 hover:text-gray-500">
                                        <X className="h-6 w-6" />
                                    </button>
                                </div>
                                <p className="mb-4 text-sm text-gray-500">Rumah: <strong>{currentHouse?.nomor_rumah}</strong></p>
                                <form onSubmit={handleAssignResident} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Pilih Penghuni</label>
                                        <select required value={assignData.resident_id} onChange={(e) => setAssignData({...assignData, resident_id: e.target.value})} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                                            <option value="">-- Pilih Penghuni --</option>
                                            {residents.map(r => (
                                                <option key={r.id} value={r.id}>{r.nama_lengkap} (Status: {r.status_penghuni})</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Tanggal Masuk</label>
                                        <input type="date" required value={assignData.tanggal_masuk} onChange={(e) => setAssignData({...assignData, tanggal_masuk: e.target.value})} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                                    </div>
                                    <div className="mt-5 sm:mt-6 sm:flex sm:flex-row-reverse pb-2">
                                        <button type="submit" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm">Simpan</button>
                                        <button type="button" onClick={() => setIsAssignModalOpen(false)} className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:w-auto sm:text-sm">Batal</button>
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

export default Houses;
