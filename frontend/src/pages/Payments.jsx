import { useState, useEffect } from 'react';
import { CreditCard, CheckCircle, Search, FileText } from 'lucide-react';
import api from '../api/axios';

const Payments = () => {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        bulan: new Date().getMonth() + 1,
        tahun: new Date().getFullYear(),
        status: ''
    });

    const fetchPayments = async () => {
        setLoading(true);
        try {
            const query = new URLSearchParams(filters).toString();
            const response = await api.get(`/payments?${query}&per_page=50`);
            setPayments(response.data.data.data);
        } catch (error) {
            console.error('Error fetching payments:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPayments();
    }, [filters]);

    const handleGenerate = async () => {
        if (!window.confirm('Generate tagihan massal untuk bulan ini?')) return;
        try {
            const response = await api.post('/payments/generate-bulk', {
                bulan: filters.bulan,
                tahun: filters.tahun
            });
            alert(response.data.message);
            fetchPayments();
        } catch (err) {
            alert('Gagal generate tagihan');
        }
    };

    const handleMarkPaid = async (id) => {
        try {
            await api.post(`/payments/${id}/mark-paid`, { 
                tanggal_bayar: new Date().toISOString().split('T')[0] 
            });
            fetchPayments();
        } catch (err) {
            alert('Gagal menandai lunas');
        }
    };

    const formatRupiah = (number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(number);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm">
                <div>
                    <h1 className="text-xl font-bold text-gray-900">Manajemen Iuran</h1>
                    <p className="text-sm text-gray-500">Tagihan Satpam & Kebersihan</p>
                </div>
                <button
                    onClick={handleGenerate}
                    className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
                >
                    <FileText className="h-5 w-5 mr-2" />
                    Generate Tagihan Bulanan (Massal)
                </button>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="p-4 border-b border-gray-200 flex space-x-4">
                    <div className="w-1/4">
                        <label className="block text-xs font-medium text-gray-500 mb-1">Bulan</label>
                        <select className="block w-full border-gray-300 rounded-md sm:text-sm border py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500" value={filters.bulan} onChange={(e) => setFilters({...filters, bulan: e.target.value})}>
                            {[...Array(12)].map((_, i) => <option key={i} value={i+1}>{new Date(0, i).toLocaleString('id-ID', { month: 'long' })}</option>)}
                        </select>
                    </div>
                    <div className="w-1/4">
                        <label className="block text-xs font-medium text-gray-500 mb-1">Tahun</label>
                        <input type="number" className="block w-full border-gray-300 rounded-md sm:text-sm border py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500" value={filters.tahun} onChange={(e) => setFilters({...filters, tahun: e.target.value})} />
                    </div>
                    <div className="w-1/4">
                        <label className="block text-xs font-medium text-gray-500 mb-1">Status</label>
                        <select className="block w-full border-gray-300 rounded-md sm:text-sm border py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500" value={filters.status} onChange={(e) => setFilters({...filters, status: e.target.value})}>
                            <option value="">Semua Status</option>
                            <option value="paid">Lunas</option>
                            <option value="unpaid">Belum Bayar</option>
                        </select>
                    </div>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rumah</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Penghuni</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jenis Iuran</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jumlah</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th scope="col" className="relative px-6 py-3"><span className="sr-only">Aksi</span></th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">Memuat data...</td>
                                </tr>
                            ) : payments.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">Belum ada tagihan. Klik Generate.</td>
                                </tr>
                            ) : (
                                payments.map((payment) => (
                                    <tr key={payment.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                                            {payment.house?.nomor_rumah}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {payment.resident?.nama_lengkap || '-'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {payment.jenis_iuran.toUpperCase()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                                            {formatRupiah(payment.jumlah)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${payment.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                {payment.status === 'paid' ? 'Lunas' : 'Belum Lunas'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            {payment.status === 'unpaid' && (
                                                <button onClick={() => handleMarkPaid(payment.id)} className="text-green-600 hover:text-green-900 inline-flex" title="Tandai Lunas">
                                                    <CheckCircle className="h-5 w-5" />
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Payments;
