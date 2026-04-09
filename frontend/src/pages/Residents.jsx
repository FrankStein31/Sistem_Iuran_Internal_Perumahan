import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, X } from 'lucide-react';
import api from '../api/axios';

const Residents = () => {
    const [residents, setResidents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentResident, setCurrentResident] = useState(null);
    const [formData, setFormData] = useState({
        nama_lengkap: '',
        no_ktp: '',
        status_penghuni: 'tetap',
        no_hp: '',
        status_nikah: 'belum_menikah',
        catatan: ''
    });

    const fetchResidents = async () => {
        setLoading(true);
        try {
            const response = await api.get(`/residents?search=${searchTerm}`);
            setResidents(response.data.data.data); // data.data.data because of pagination
        } catch (error) {
            console.error('Error fetching residents:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchResidents();
    }, [searchTerm]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const openModal = (resident = null) => {
        if (resident) {
            setCurrentResident(resident);
            setFormData({
                nama_lengkap: resident.nama_lengkap,
                no_ktp: resident.no_ktp,
                status_penghuni: resident.status_penghuni,
                no_hp: resident.no_hp,
                status_nikah: resident.status_nikah,
                catatan: resident.catatan || ''
            });
        } else {
            setCurrentResident(null);
            setFormData({
                nama_lengkap: '',
                no_ktp: '',
                status_penghuni: 'tetap',
                no_hp: '',
                status_nikah: 'belum_menikah',
                catatan: ''
            });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (currentResident) {
                await api.put(`/residents/${currentResident.id}`, formData);
            } else {
                await api.post('/residents', formData);
            }
            setIsModalOpen(false);
            fetchResidents();
        } catch (error) {
            console.error('Error saving resident:', error);
            alert(error.response?.data?.message || 'Gagal menyimpan data');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Apakah Anda yakin ingin menghapus penghuni ini?')) {
            try {
                await api.delete(`/residents/${id}`);
                fetchResidents();
            } catch (error) {
                alert(error.response?.data?.message || 'Gagal menghapus data');
            }
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm">
                <div>
                    <h1 className="text-xl font-bold text-gray-900">Data Penghuni</h1>
                    <p className="text-sm text-gray-500">Kelola data warga RT perumahan</p>
                </div>
                <button
                    onClick={() => openModal()}
                    className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
                >
                    <Plus className="h-5 w-5 mr-2" />
                    Tambah Penghuni
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
                            placeholder="Cari nama, KTP, atau No HP..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Lengkap / KTP</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kontak</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status Hunian</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status Nikah</th>
                                <th scope="col" className="relative px-6 py-3"><span className="sr-only">Aksi</span></th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">Memuat data...</td>
                                </tr>
                            ) : residents.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">Tidak ada data penghuni</td>
                                </tr>
                            ) : (
                                residents.map((resident) => (
                                    <tr key={resident.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">{resident.nama_lengkap}</div>
                                                    <div className="text-sm text-gray-500">{resident.no_ktp}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {resident.no_hp}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${resident.status_penghuni === 'tetap' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                {resident.status_penghuni === 'tetap' ? 'Tetap' : 'Kontrak'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {resident.status_nikah === 'menikah' ? 'Menikah' : 'Belum Menikah'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                            <button onClick={() => openModal(resident)} className="text-indigo-600 hover:text-indigo-900 inline-flex">
                                                <Edit className="h-5 w-5" />
                                            </button>
                                            <button onClick={() => handleDelete(resident.id)} className="text-red-600 hover:text-red-900 inline-flex">
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

            {/* Modal Form */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 transition-opacity" aria-hidden="true" onClick={() => setIsModalOpen(false)}>
                            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                        </div>

                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="flex justify-between items-center mb-5">
                                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                                        {currentResident ? 'Edit Penghuni' : 'Tambah Penghuni Baru'}
                                    </h3>
                                    <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-500">
                                        <X className="h-6 w-6" />
                                    </button>
                                </div>
                                
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Nama Lengkap</label>
                                        <input type="text" name="nama_lengkap" required value={formData.nama_lengkap} onChange={handleInputChange} className="mt-1 flex-1 block w-full rounded-md sm:text-sm border-gray-300 border py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500" />
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Nomor KTP (16 Digit)</label>
                                        <input type="text" name="no_ktp" required maxLength={16} minLength={16} value={formData.no_ktp} onChange={handleInputChange} className="mt-1 flex-1 block w-full rounded-md sm:text-sm border-gray-300 border py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500" />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Status Penghuni</label>
                                            <select name="status_penghuni" value={formData.status_penghuni} onChange={handleInputChange} className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                                                <option value="tetap">Warga Tetap</option>
                                                <option value="kontrak">Kontrak/Sewa</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Status Nikah</label>
                                            <select name="status_nikah" value={formData.status_nikah} onChange={handleInputChange} className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                                                <option value="menikah">Menikah</option>
                                                <option value="belum_menikah">Belum Menikah</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Nomor HP</label>
                                        <input type="text" name="no_hp" required value={formData.no_hp} onChange={handleInputChange} className="mt-1 flex-1 block w-full rounded-md sm:text-sm border-gray-300 border py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500" />
                                    </div>

                                    <div className="mt-5 sm:mt-6 sm:flex sm:flex-row-reverse pb-2">
                                        <button type="submit" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm">
                                            Simpan
                                        </button>
                                        <button type="button" onClick={() => setIsModalOpen(false)} className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:w-auto sm:text-sm">
                                            Batal
                                        </button>
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

export default Residents;
