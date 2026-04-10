import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Receipt } from 'lucide-react';
import api from '../api/axios';

const Expenses = () => {
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        tanggal: new Date().toISOString().split('T')[0],
        deskripsi: '',
        jumlah: '',
        kategori: 'umum'
    });

    const fetchExpenses = async () => {
        setLoading(true);
        try {
            const response = await api.get('/expenses');
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/expenses', formData);
            setIsModalOpen(false);
            fetchExpenses();
        } catch (error) {
            alert('Gagal menyimpan pengeluaran');
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

    const formatRupiah = (number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(number);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm">
                <div>
                    <h1 className="text-xl font-bold text-gray-900">Pengeluaran RT</h1>
                    <p className="text-sm text-gray-500">Pencatatan uang keluar</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
                >
                    <Plus className="h-5 w-5 mr-2" />
                    Tambah Pengeluaran
                </button>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deskripsi</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kategori</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jumlah (Rp)</th>
                                <th className="relative px-6 py-3"><span className="sr-only">Aksi</span></th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {loading ? (
                                <tr><td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">Memuat data...</td></tr>
                            ) : expenses.length === 0 ? (
                                <tr><td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">Belum ada pengeluaran.</td></tr>
                            ) : (
                                expenses.map((expense) => (
                                    <tr key={expense.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{expense.tanggal}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{expense.deskripsi}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{expense.kategori.replace('_', ' ')}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-red-600">{formatRupiah(expense.jumlah)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button onClick={() => handleDelete(expense.id)} className="text-red-600 hover:text-red-900"><Trash2 className="h-5 w-5" /></button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
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
                                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-5">Tambah Pengeluaran</h3>
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div><label className="block text-sm font-medium">Tanggal</label><input type="date" name="tanggal" required value={formData.tanggal} onChange={handleChange} className="mt-1 w-full border py-2 px-3 rounded-md" /></div>
                                    <div><label className="block text-sm font-medium">Deskripsi</label><input type="text" name="deskripsi" required value={formData.deskripsi} onChange={handleChange} className="mt-1 w-full border py-2 px-3 rounded-md" /></div>
                                    <div>
                                        <label className="block text-sm font-medium">Kategori</label>
                                        <select name="kategori" required value={formData.kategori} onChange={handleChange} className="mt-1 w-full border py-2 px-3 rounded-md">
                                            <option value="listrik">Listrik & Air</option>
                                            <option value="gaji_satpam">Gaji Keamanan & Kebersihan</option>
                                            <option value="perbaikan_jalan">Perbaikan Fasilitas</option>
                                            <option value="umum">Lainnya / Umum</option>
                                        </select>
                                    </div>
                                    <div><label className="block text-sm font-medium">Jumlah Tagihan (Rp)</label><input type="number" name="jumlah" required value={formData.jumlah} onChange={handleChange} className="mt-1 w-full border py-2 px-3 rounded-md" /></div>
                                    <div className="mt-5 flex flex-row-reverse pb-2">
                                        <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md sm:ml-3">Simpan</button>
                                        <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border rounded-md">Batal</button>
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
