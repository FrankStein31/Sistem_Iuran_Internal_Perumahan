import { useState, useEffect } from 'react';
import { Home, Edit, Trash2, Search, X, UserPlus, UserMinus, Info, ChevronRight, ChevronDown } from 'lucide-react';
import api from '../api/axios';
import DataTable_ from 'react-data-table-component';
const DataTable = DataTable_.default || DataTable_;

const formatDate = (dateString) => {
    if (!dateString) return '-';
    if(dateString.includes('T') || dateString.includes('-')) {
        const d = new Date(dateString);
        if(!isNaN(d)) return new Intl.DateTimeFormat('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }).format(d);
    }
    return dateString;
};

const CustomExpandIcon = {
    collapsed: <div className="flex flex-col items-center justify-center p-1 text-gray-500 hover:text-indigo-600 transition cursor-pointer" title="Lihat Detail"><ChevronRight className="w-5 h-5 -mb-1"/><span className="text-[10px] font-bold mt-1">DETAIL</span></div>,
    expanded: <div className="flex flex-col items-center justify-center p-1 text-indigo-600 transition cursor-pointer" title="Tutup Detail"><ChevronDown className="w-5 h-5 -mb-1"/><span className="text-[10px] font-bold mt-1">TUTUP</span></div>
};

const ExpandedHouseComponent = ({ data }) => {
    const [details, setDetails] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDetails = async () => {
            setLoading(true);
            try {
                const response = await api.get(`/houses/${data.id}`);
                setDetails(response.data.data);
            } catch (error) {
                console.error("Failed to load house details", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDetails();
    }, [data.id]);

    if (loading) return <div className="p-4 pl-16 text-sm text-gray-500">Memuat detail rumah...</div>;
    if (!details) return <div className="p-4 pl-16 text-sm text-red-500">Gagal memuat detail.</div>;

    const pastResidents = details.house_residents?.filter(hr => !hr.is_active) || [];
    const payments = details.payments || [];

    return (
        <div className="p-4 bg-gray-50 border-b border-gray-100 pl-16">
            <h4 className="font-semibold text-gray-800 mb-4 flex items-center"><Home className="w-4 h-4 mr-2 text-indigo-500" /> Informasi Detail Rumah {details.nomor_rumah}</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <h5 className="text-sm font-bold text-gray-700 border-b pb-1 mb-2">Riwayat Penghuni Terdahulu</h5>
                    {pastResidents.length === 0 ? (
                        <p className="text-sm text-gray-500 italic bg-white p-2 border rounded">Belum ada riwayat penghuni terdahulu.</p>
                    ) : (
                        <ul className="text-sm space-y-2">
                            {pastResidents.map((hr, idx) => (
                                <li key={idx} className="bg-white p-3 border rounded shadow-sm">
                                    <div className="font-medium text-gray-800">{hr.resident?.nama_lengkap} <span className="text-xs font-normal text-gray-500">({hr.resident?.status_penghuni})</span></div>
                                    <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                                         <span>Masuk: {formatDate(hr.tanggal_masuk)}</span> 
                                         <span className="text-gray-300">|</span> 
                                         <span>Keluar: {formatDate(hr.tanggal_keluar)}</span>
                                    </div>
                                    {hr.catatan && <div className="text-xs italic text-gray-500 mt-2 bg-gray-50 p-1 rounded">Catatan: {hr.catatan}</div>}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                
                <div>
                    <h5 className="text-sm font-bold text-gray-700 border-b pb-1 mb-2">10 Histori Pembayaran Terakhir</h5>
                    {payments.length === 0 ? (
                        <p className="text-sm text-gray-500 italic bg-white p-2 border rounded">Belum ada data pembayaran untuk rumah ini.</p>
                    ) : (
                        <ul className="text-sm space-y-2 max-h-60 overflow-y-auto pr-1 custom-scrollbar">
                            {payments.slice(0, 10).map((p, idx) => (
                                <li key={idx} className="bg-white p-2 border rounded shadow-sm flex flex-col gap-1">
                                    <div className="flex justify-between items-center">
                                        <div className="font-semibold text-gray-800 capitalize flex items-center">
                                            {p.jenis_iuran} <span className="ml-2 font-normal text-xs text-gray-500">Bl. {p.bulan}/{p.tahun}</span>
                                        </div>
                                        <div>
                                            <span className={`px-2 py-0.5 text-[10px] uppercase tracking-wide font-bold rounded ${p.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                {p.status === 'paid' ? 'Lunas' : 'Belum Cek'}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="text-xs text-gray-500 mt-1">Pembayar: <span className="font-medium text-gray-700">{p.resident?.nama_lengkap || '-'}</span></div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
            {details.keterangan && (
                 <div className="mt-4">
                     <h5 className="text-sm font-bold text-gray-700 border-b pb-1 mb-2">Keterangan Alamat</h5>
                     <p className="text-sm text-gray-600 bg-white p-2 rounded border shadow-sm">{details.keterangan}</p>
                 </div>
            )}
        </div>
    );
};

const Houses = () => {
    const [houses, setHouses] = useState([]);
    const [residents, setResidents] = useState([]); // Will only contain unassigned.
    const [loading, setLoading] = useState(true);
    
    // Filters
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatusRumah, setFilterStatusRumah] = useState('');

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
        tanggal_keluar: '',
        catatan: ''
    });

    const fetchHouses = async () => {
        setLoading(true);
        try {
            const response = await api.get(`/houses?per_page=all`);
            setHouses(response.data.data.data);
        } catch (error) {
            console.error('Error fetching houses:', error);
        } finally {
            setLoading(false);
        }
    };

    // Filter resident unassigned
    const fetchResidentsList = async () => {
        try {
            const response = await api.get('/residents/all?unassigned=1');
            setResidents(response.data.data);
        } catch (error) {
            console.error('Error fetching residents list:', error);
        }
    };

    useEffect(() => {
        fetchHouses();
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
        fetchResidentsList(); // Refresh list to ensure we don't assign someone already assigned.
        setCurrentHouse(house);
        setAssignData({
            resident_id: '',
            tanggal_masuk: new Date().toISOString().split('T')[0],
            tanggal_keluar: '',
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
            const payload = { ...assignData };
            // Optional cleanup if status is not kontrak but field is filled
            if (selectedResidentObj?.status_penghuni !== 'kontrak') {
                delete payload.tanggal_keluar;
            } else if (!payload.tanggal_keluar) {
                 alert('Tanggal Selesai harus diisi untuk penghuni Kontrak/Sewa!');
                 return;
            }

            await api.post(`/houses/${currentHouse.id}/assign-resident`, payload);
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

    const columns = [
        {
            name: 'No Rumah',
            selector: row => row.nomor_rumah,
            sortable: true,
            width: '120px',
            cell: row => <span className="font-bold text-gray-900">{row.nomor_rumah}</span>
        },
        {
            name: 'Alamat',
            selector: row => row.alamat,
            sortable: true,
            wrap: true
        },
        {
            name: 'Penghuni Saat Ini',
            selector: row => row.current_resident?.nama_lengkap || '',
            sortable: true,
            cell: row => (
                <div className="font-medium text-gray-900">
                    {row.current_resident?.nama_lengkap || <span className="text-gray-400 italic">Kosong</span>}
                </div>
            )
        },
        {
            name: 'Status',
            selector: row => row.status_hunian,
            sortable: true,
            width: '130px',
            cell: row => (
                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${row.status_hunian === 'dihuni' ? 'bg-indigo-100 text-indigo-800' : 'bg-gray-100 text-gray-800'}`}>
                    {row.status_hunian === 'dihuni' ? 'Dihuni' : 'Kosong'}
                </span>
            )
        },
        {
            name: 'Aksi',
            cell: row => (
                <div className="flex space-x-2">
                    {row.status_hunian === 'tidak_dihuni' ? (
                        <button onClick={() => openAssignModal(row)} className="text-green-600 hover:text-green-900" title="Masukkan Penghuni">
                            <UserPlus className="h-4 w-4" />
                        </button>
                    ) : (
                        <button onClick={() => handleRemoveResident(row.id)} className="text-orange-500 hover:text-orange-700" title="Pindahkan Penghuni">
                            <UserMinus className="h-4 w-4" />
                        </button>
                    )}
                    <button onClick={() => openHouseModal(row)} className="text-indigo-600 hover:text-indigo-900" title="Edit Rumah">
                        <Edit className="h-4 w-4" />
                    </button>
                    <button onClick={() => handleDeleteHouse(row.id)} className="text-red-600 hover:text-red-900" title="Hapus Rumah">
                        <Trash2 className="h-4 w-4" />
                    </button>
                </div>
            ),
            ignoreRowClick: true,
            width: '130px'
        }
    ];

    const filteredHouses = houses.filter(h => {
        const matchSearch = h.nomor_rumah.toLowerCase().includes(searchTerm.toLowerCase()) || h.alamat.toLowerCase().includes(searchTerm.toLowerCase());
        const matchStatus = filterStatusRumah === '' || h.status_hunian === filterStatusRumah;
        return matchSearch && matchStatus;
    });

    const selectedResidentObj = residents.find(r => r.id.toString() === assignData.resident_id.toString());

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

            <div className="bg-white rounded-lg shadow overflow-hidden p-4">
                <div className="mb-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-xl">
                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">Pencarian</label>
                            <div className="relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Search className="h-4 w-4 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2 border bg-white"
                                    placeholder="Cari nomor atau alamat rumah..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">Status Rumah</label>
                            <select className="block w-full border-gray-300 rounded-md sm:text-sm border py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 bg-white" 
                                value={filterStatusRumah} onChange={(e) => setFilterStatusRumah(e.target.value)}>
                                <option value="">Semua Status</option>
                                <option value="dihuni">Sedang Dihuni</option>
                                <option value="tidak_dihuni">Kosong (Tidak Dihuni)</option>
                            </select>
                        </div>
                    </div>
                </div>
                
                <DataTable
                    columns={columns}
                    data={filteredHouses}
                    pagination
                    progressPending={loading}
                    expandableRows
                    expandableIcon={CustomExpandIcon}
                    expandableRowsComponent={ExpandedHouseComponent}
                    highlightOnHover
                    responsive
                    noDataComponent={<div className="p-4 text-center text-gray-500">Tidak ada data rumah</div>}
                    customStyles={{
                        headRow: {
                            style: {
                                backgroundColor: '#f9fafb',
                                fontWeight: '600',
                                color: '#4b5563'
                            }
                        }
                    }}
                />
            </div>

            {/* Modal Form */}
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
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Keterangan Tambahan</label>
                                        <textarea value={formData.keterangan} onChange={(e) => setFormData({...formData, keterangan: e.target.value})} rows="2" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"></textarea>
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
                                <div className="mb-4 bg-indigo-50 p-3 rounded-md flex">
                                    <Info className="h-5 w-5 text-indigo-400 mr-2" />
                                    <span className="text-sm text-indigo-700">Rumah: <span className="font-bold">{currentHouse?.nomor_rumah}</span> - {currentHouse?.alamat}</span>
                                </div>
                                <form onSubmit={handleAssignResident} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Pilih Penghuni yang Belum Menempati Rumah Manapun</label>
                                        <select required value={assignData.resident_id} onChange={(e) => setAssignData({...assignData, resident_id: e.target.value})} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                                            <option value="">-- Pilih Penghuni --</option>
                                            {residents.map(r => (
                                                <option key={r.id} value={r.id}>{r.nama_lengkap} (Status: {r.status_penghuni})</option>
                                            ))}
                                        </select>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Tanggal Masuk</label>
                                            <input type="date" required value={assignData.tanggal_masuk} onChange={(e) => setAssignData({...assignData, tanggal_masuk: e.target.value})} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                                        </div>
                                        
                                        {selectedResidentObj?.status_penghuni === 'kontrak' && (
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Tanggal Selesai (Kontrak)</label>
                                                <input type="date" required={selectedResidentObj?.status_penghuni === 'kontrak'} value={assignData.tanggal_keluar} onChange={(e) => setAssignData({...assignData, tanggal_keluar: e.target.value})} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                                            </div>
                                        )}
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Catatan</label>
                                        <textarea value={assignData.catatan} onChange={(e) => setAssignData({...assignData, catatan: e.target.value})} rows="2" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"></textarea>
                                    </div>
                                    <div className="mt-5 sm:mt-6 sm:flex sm:flex-row-reverse pb-2">
                                        <button type="submit" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm">Simpan Alokasi</button>
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
