import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Receipt, Search, X } from 'lucide-react';
import api from '../api/axios';
import DataTable_ from 'react-data-table-component';
const DataTable = DataTable_.default || DataTable_;
import { format, parseISO } from 'date-fns';
import { id as localeId } from 'date-fns/locale';

const formatRupiah = (number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(number);

const Expenses = () => {
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentExpense, setCurrentExpense] = useState(null);
    const [formData, setFormData] = useState({
        tanggal: new Date().toISOString().split('T')[0],
        deskripsi: '',
        jumlah: '',
        kategori: 'umum'
    });

    const fetchExpenses = async () => {
        setLoading(true);
        try {
            const response = await api.get('/expenses?per_page=all');
            setExpenses(response.data.data.data);
        } catch (error) {
            console.error('Error fetching expenses:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchExpenses();
    }, []);

    const handleChange = (e) => setFormData({...formData, [e.target.name]: e.target.value});

    const openModal = (expense = null) => {
        if (expense) {
            setCurrentExpense(expense.id);
            // Tanggal might be YYYY-MM-DD or YYYY-MM-DD HH:MM:SS format 
            const formattedDate = expense.tanggal.includes('T') || expense.tanggal.includes(' ') 
                ? new Date(expense.tanggal).toISOString().split('T')[0] 
                : expense.tanggal;
                
            setFormData({
                tanggal: formattedDate,
                deskripsi: expense.deskripsi,
                jumlah: expense.jumlah,
                kategori: expense.kategori
            });
        } else {
            setCurrentExpense(null);
            setFormData({
                tanggal: new Date().toISOString().split('T')[0],
                deskripsi: '',
                jumlah: '',
                kategori: 'umum'
            });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (currentExpense) {
                await api.put(`/expenses/${currentExpense}`, formData);
            } else {
                await api.post('/expenses', formData);
            }
            setIsModalOpen(false);
            fetchExpenses();
        } catch (error) {
            alert(error.response?.data?.message || 'Gagal menyimpan pengeluaran');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Hapus histori pengeluaran ini?')) {
            try {
                await api.delete(`/expenses/${id}`);
                fetchExpenses();
            } catch (error) {
                alert('Gagal menghapus');
            }
        }
    };

    const formatTgl = (tglString) => {
        try {
            // Handle if tglString is just simple format
            const dateObj = typeof tglString === 'string' && !tglString.includes('T') ? new Date(tglString) : parseISO(tglString);
            return format(dateObj, 'dd MMMM yyyy', { locale: localeId });
        } catch (e) {
            return tglString;
        }
    };

    const columns = [
        {
            name: 'Tanggal',
            selector: row => row.tanggal,
            sortable: true,
            width: '180px',
            cell: row => <div className="text-gray-900 font-medium">{formatTgl(row.tanggal)}</div>
        },
        {
            name: 'Deskripsi',
            selector: row => row.deskripsi,
            sortable: true,
            wrap: true
        },
        {
            name: 'Kategori',
            selector: row => row.kategori,
            sortable: true,
            width: '200px',
            cell: row => (
                <span className="capitalize px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full font-medium tracking-wide">
                    {row.kategori.replace('_', ' ')}
                </span>
            )
        },
        {
            name: 'Jumlah (Rp)',
            selector: row => row.jumlah,
            sortable: true,
            width: '180px',
            cell: row => <div className="font-bold text-red-600">{formatRupiah(row.jumlah)}</div>
        },
        {
            name: 'Aksi',
            cell: row => (
                <div className="flex space-x-2">
                    <button onClick={() => openModal(row)} className="text-indigo-600 hover:text-indigo-900" title="Edit">
                        <Edit className="h-4 w-4" />
                    </button>
                    <button onClick={() => handleDelete(row.id)} className="text-red-600 hover:text-red-900" title="Hapus">
                        <Trash2 className="h-4 w-4" />
                    </button>
                </div>
            ),
            ignoreRowClick: true,
            width: '100px'
        }
    ];

    const filteredExpenses = expenses.filter(
        item => item.deskripsi.toLowerCase().includes(searchTerm.toLowerCase()) || 
                item.kategori.replace('_', ' ').toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm">
                <div>
                    <h1 className="text-xl font-bold text-gray-900">Pengeluaran RT</h1>
                    <p className="text-sm text-gray-500">Pencatatan uang keluar</p>
                </div>
                <button
                    onClick={() => openModal()}
                    className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
                >
                    <Plus className="h-5 w-5 mr-2" />
                    Tambah Pengeluaran
                </button>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden p-4">
                <div className="mb-4">
                    <div className="relative rounded-md shadow-sm max-w-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2 border"
                            placeholder="Cari deskripsi atau kategori..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <DataTable
                    columns={columns}
                    data={filteredExpenses}
                    pagination
                    progressPending={loading}
                    highlightOnHover
                    responsive
                    noDataComponent={<div className="p-4 text-center text-gray-500">Tidak ada data pengeluaran ditemukan</div>}
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
                                        {currentExpense ? 'Edit Pengeluaran' : 'Tambah Pengeluaran'}
                                    </h3>
                                    <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-500">
                                        <X className="h-6 w-6" />
                                    </button>
                                </div>
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Tanggal</label>
                                        <input type="date" name="tanggal" required value={formData.tanggal} onChange={handleChange} className="mt-1 block w-full border border-gray-300 py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md shadow-sm sm:text-sm" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Deskripsi</label>
                                        <input type="text" name="deskripsi" required value={formData.deskripsi} onChange={handleChange} className="mt-1 block w-full border border-gray-300 py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md shadow-sm sm:text-sm" placeholder="Misal: Beli lampu taman" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Kategori</label>
                                        <select name="kategori" required value={formData.kategori} onChange={handleChange} className="mt-1 block w-full border border-gray-300 py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md shadow-sm sm:text-sm">
                                            <option value="listrik">Listrik & Air</option>
                                            <option value="gaji_satpam">Gaji Keamanan & Kebersihan</option>
                                            <option value="perbaikan_jalan">Perbaikan Fasilitas</option>
                                            <option value="umum">Lainnya / Umum</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Jumlah Tagihan (Rp)</label>
                                        <input type="number" name="jumlah" required min="1" value={formData.jumlah} onChange={handleChange} className="mt-1 block w-full border border-gray-300 py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md shadow-sm sm:text-sm" />
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

export default Expenses;
