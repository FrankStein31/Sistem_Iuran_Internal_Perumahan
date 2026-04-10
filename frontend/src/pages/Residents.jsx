import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, X, Home, ChevronRight, ChevronDown } from 'lucide-react';
import api from '../api/axios';
import DataTable_ from 'react-data-table-component';
const DataTable = DataTable_.default || DataTable_;

const CustomExpandIcon = {
    collapsed: <div className="flex flex-col items-center justify-center p-1 text-gray-500 hover:text-indigo-600 transition cursor-pointer" title="Lihat Detail"><ChevronRight className="w-5 h-5 -mb-1"/><span className="text-[10px] font-bold mt-1">DETAIL</span></div>,
    expanded: <div className="flex flex-col items-center justify-center p-1 text-indigo-600 transition cursor-pointer" title="Tutup Detail"><ChevronDown className="w-5 h-5 -mb-1"/><span className="text-[10px] font-bold mt-1">TUTUP</span></div>
};

const formatDate = (dateString) => {
    if (!dateString) return '-';
    if(dateString.includes('T')) {
        const d = new Date(dateString);
        return new Intl.DateTimeFormat('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }).format(d);
    }
    return dateString;
};

const ExpandedComponent = ({ data }) => {
    // Current house resident
    const currentHouse = data.current_house_resident?.house;
    
    // Previous houses
    const pastHouses = data.house_residents?.filter(hr => !hr.is_active) || [];

    return (
        <div className="p-4 bg-gray-50 border-b border-gray-100 pl-16">
            <h4 className="font-semibold text-gray-800 mb-2 flex items-center"><Home className="w-4 h-4 mr-2 text-indigo-500" /> Detail Info Penghuni</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <h5 className="text-sm font-medium text-gray-600 mb-1">Rumah Saat Ini:</h5>
                    {currentHouse ? (
                        <p className="text-sm text-gray-900 font-medium bg-white p-2 border rounded">{currentHouse.nomor_rumah} - {currentHouse.alamat}</p>
                    ) : (
                        <p className="text-sm text-gray-500 italic bg-white p-2 border rounded">Tidak menempati rumah</p>
                    )}
                </div>
                {data.foto_ktp && (
                    <div>
                        <h5 className="text-sm font-medium text-gray-600 mb-1">Preview KTP:</h5>
                        <img src={`/storage/${data.foto_ktp}`} onError={(e) => { e.target.onerror = null; e.target.src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='200' viewBox='0 0 300 200'%3E%3Crect width='300' height='200' fill='%23f3f4f6'/%3E%3Ctext x='150' y='100' font-family='sans-serif' font-size='14' text-anchor='middle' dominant-baseline='middle' fill='%239ca3af'%3EGambar Tidak Ditemukan%3C/text%3E%3C/svg%3E"; }} alt="KTP" className="mt-1 h-32 w-auto object-cover rounded shadow-sm border border-gray-200" />
                    </div>
                )}
            </div>
            
            {pastHouses.length > 0 && (
                <div className="mt-4">
                    <h5 className="text-sm font-medium text-gray-600 mb-2">Riwayat Menempati Rumah:</h5>
                    <ul className="list-inside list-disc text-sm text-gray-700 bg-white p-3 border rounded">
                        {pastHouses.map((hr, idx) => (
                            <li key={idx}>
                                <span className="font-medium">{hr.house?.nomor_rumah}</span> 
                                <span className="text-gray-500 text-xs ml-2">(Masuk: {formatDate(hr.tanggal_masuk)} - Keluar: {formatDate(hr.tanggal_keluar)})</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

const Residents = () => {
    const [residents, setResidents] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Filters
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatusPenghuni, setFilterStatusPenghuni] = useState('');
    const [filterStatusRumah, setFilterStatusRumah] = useState('');
    const [filterStatusNikah, setFilterStatusNikah] = useState('');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentResident, setCurrentResident] = useState(null);
    const [formData, setFormData] = useState({
        nama_lengkap: '',
        no_ktp: '',
        status_penghuni: 'tetap',
        no_hp: '',
        status_nikah: 'belum_menikah',
        catatan: '',
        foto_ktp: null
    });

    const fetchResidents = async () => {
        setLoading(true);
        try {
            const response = await api.get(`/residents?per_page=all`);
            setResidents(response.data.data.data); 
        } catch (error) {
            console.error('Error fetching residents:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchResidents();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, foto_ktp: e.target.files[0] });
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
                catatan: resident.catatan || '',
                foto_ktp: null
            });
        } else {
            setCurrentResident(null);
            setFormData({
                nama_lengkap: '',
                no_ktp: '',
                status_penghuni: 'tetap',
                no_hp: '',
                status_nikah: 'belum_menikah',
                catatan: '',
                foto_ktp: null
            });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = new FormData();
            data.append('nama_lengkap', formData.nama_lengkap);
            data.append('no_ktp', formData.no_ktp);
            data.append('status_penghuni', formData.status_penghuni);
            data.append('no_hp', formData.no_hp);
            data.append('status_nikah', formData.status_nikah);
            if (formData.catatan) data.append('catatan', formData.catatan);
            if (formData.foto_ktp instanceof File) {
                data.append('foto_ktp', formData.foto_ktp);
            }

            if (currentResident) {
                data.append('_method', 'PUT'); 
                await api.post(`/residents/${currentResident.id}`, data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            } else {
                await api.post('/residents', data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }
            setIsModalOpen(false);
            fetchResidents();
        } catch (error) {
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

    const columns = [
        {
            name: 'Nama Lengkap & KTP',
            selector: row => row.nama_lengkap,
            sortable: true,
            width: '250px',
            cell: row => (
                <div className="flex items-center py-2">
                    {row.foto_ktp ? (
                        <div className="flex-shrink-0 h-10 w-10 mr-3">
                            <img className="h-10 w-10 rounded-full object-cover border border-gray-200" src={`/storage/${row.foto_ktp}`} onError={(e) => { e.target.onerror = null; e.target.src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23f3f4f6'/%3E%3Ctext x='50' y='50' font-family='sans-serif' font-size='24' text-anchor='middle' dominant-baseline='middle' fill='%239ca3af'%3E!%3C/text%3E%3C/svg%3E"; }} alt="KTP" />
                        </div>
                    ) : (
                        <div className="flex-shrink-0 h-10 w-10 mr-3 bg-gray-100 rounded-full flex items-center justify-center border text-gray-400 text-xs font-semibold">
                            KTP
                        </div>
                    )}
                    <div>
                        <div className="text-sm font-medium text-gray-900">{row.nama_lengkap}</div>
                        <div className="text-sm text-gray-500">{row.no_ktp}</div>
                    </div>
                </div>
            )
        },
        {
            name: 'Kontak',
            selector: row => row.no_hp,
            sortable: true,
        },
        {
            name: 'Status & Lokasi',
            selector: row => row.status_penghuni,
            sortable: true,
            width: '200px',
            cell: row => (
                <div className="flex flex-col items-start py-1">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${row.status_penghuni === 'tetap' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {row.status_penghuni === 'tetap' ? 'Tetap' : 'Kontrak'}
                    </span>
                    {row.current_house_resident && row.current_house_resident.house ? (
                        <div className="mt-1 text-xs text-indigo-600 font-medium">Berdiam: {row.current_house_resident.house.nomor_rumah}</div>
                    ) : (
                        <div className="mt-1 text-xs text-red-500 font-medium italic">Belum menempati rumah</div>
                    )}
                </div>
            )
        },
        {
            name: 'Status Nikah',
            selector: row => row.status_nikah,
            sortable: true,
            cell: row => row.status_nikah === 'menikah' ? 'Menikah' : 'Belum Menikah'
        },
        {
            name: 'Aksi',
            cell: row => (
                <div className="flex space-x-2">
                    <button onClick={() => openModal(row)} className="text-indigo-600 hover:text-indigo-900 border border-indigo-200 bg-indigo-50 px-2 py-1 rounded">
                        <Edit className="h-4 w-4" />
                    </button>
                    <button onClick={() => handleDelete(row.id)} className="text-red-600 hover:text-red-900 border border-red-200 bg-red-50 px-2 py-1 rounded">
                        <Trash2 className="h-4 w-4" />
                    </button>
                </div>
            ),
            ignoreRowClick: true,
            width: '100px'
        }
    ];

    const filteredItems = residents.filter(item => {
        const matchSearch = item.nama_lengkap.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            item.no_ktp.includes(searchTerm) || 
                            item.no_hp.includes(searchTerm);
        
        const matchHunian = filterStatusPenghuni === '' || item.status_penghuni === filterStatusPenghuni;
        const matchNikah = filterStatusNikah === '' || item.status_nikah === filterStatusNikah;
        const matchRumah = filterStatusRumah === '' || (filterStatusRumah === 'ada' ? item.current_house_resident !== null : item.current_house_resident === null);

        return matchSearch && matchHunian && matchNikah && matchRumah;
    });

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm">
                <div>
                    <h1 className="text-xl font-bold text-gray-900">Data Penghuni</h1>
                    <p className="text-sm text-gray-500">Kelola data warga RT perumahan</p>
                </div>
                <button
                    onClick={() => openModal()}
                    className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition shadow-sm"
                >
                    <Plus className="h-5 w-5 mr-2" />
                    Tambah Penghuni
                </button>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="p-4 border-b border-gray-200 bg-gray-50">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">Pencarian</label>
                            <div className="relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Search className="h-4 w-4 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2 border bg-white"
                                    placeholder="Nama, KTP, HP..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">Lokasi Rumah</label>
                            <select className="block w-full border-gray-300 rounded-md sm:text-sm border py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 bg-white" 
                                value={filterStatusRumah} onChange={(e) => setFilterStatusRumah(e.target.value)}>
                                <option value="">Semua Orang</option>
                                <option value="ada">Sudah Ada Rumah</option>
                                <option value="belum">Tdk/Belum Punya Rumah</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">Status Penghuni</label>
                            <select className="block w-full border-gray-300 rounded-md sm:text-sm border py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 bg-white" 
                                value={filterStatusPenghuni} onChange={(e) => setFilterStatusPenghuni(e.target.value)}>
                                <option value="">Semua Status</option>
                                <option value="tetap">Warga Tetap</option>
                                <option value="kontrak">Kontrak/Sewa</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">Status Nikah</label>
                            <select className="block w-full border-gray-300 rounded-md sm:text-sm border py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 bg-white" 
                                value={filterStatusNikah} onChange={(e) => setFilterStatusNikah(e.target.value)}>
                                <option value="">Semua</option>
                                <option value="menikah">Menikah</option>
                                <option value="belum_menikah">Belum Menikah</option>
                            </select>
                        </div>
                    </div>
                </div>
                
                <DataTable
                    columns={columns}
                    data={filteredItems}
                    pagination
                    progressPending={loading}
                    expandableRows
                    expandableIcon={CustomExpandIcon}
                    expandableRowsComponent={ExpandedComponent}
                    highlightOnHover
                    responsive
                    noDataComponent={<div className="p-8 text-center text-gray-500 italic">Tidak ada data penghuni</div>}
                    customStyles={{
                        headRow: {
                            style: {
                                backgroundColor: '#f9fafb',
                                fontWeight: '600',
                                color: '#4b5563',
                                fontSize: '0.75rem',
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em'
                            }
                        }
                    }}
                />
            </div>

            {/* Modal Form */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 transition-opacity" onClick={() => setIsModalOpen(false)}>
                            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                        </div>
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
                        <div className="relative z-10 inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
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
                                    {/* ... forms map directly from the old code precisely ... */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Nama Lengkap</label>
                                        <input type="text" name="nama_lengkap" required value={formData.nama_lengkap} onChange={handleInputChange} className="mt-1 flex-1 block w-full rounded-md sm:text-sm border-gray-300 border py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Nomor KTP (16 Digit)</label>
                                        <input type="text" name="no_ktp" required maxLength={16} minLength={16} value={formData.no_ktp} onChange={handleInputChange} className="mt-1 flex-1 block w-full rounded-md sm:text-sm border-gray-300 border py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Upload Foto KTP (Opsional)</label>
                                        <input type="file" name="foto_ktp" accept="image/jpeg,image/png,image/jpg" onChange={handleFileChange} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 border border-gray-300 rounded-md" />
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
                                        <button type="submit" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm">Simpan</button>
                                        <button type="button" onClick={() => setIsModalOpen(false)} className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:w-auto sm:text-sm">Batal</button>
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
