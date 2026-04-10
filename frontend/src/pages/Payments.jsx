import { useState, useEffect, useMemo } from 'react';
import { CreditCard, CheckCircle, Search, FileText, Download, Check, AlertCircle } from 'lucide-react';
import api from '../api/axios';
import DataTable_ from 'react-data-table-component';
const DataTable = DataTable_.default || DataTable_;
import * as XLSX from 'xlsx';

const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(number);
};

const ExpandedPaymentComponent = ({ data }) => {
    const { satpam, kebersihan, house, resident, bulan, tahun } = data;
    
    return (
        <div className="p-4 bg-gray-50 border-b border-gray-100 pl-16">
            <h4 className="font-semibold text-gray-800 mb-4 flex items-center"><CreditCard className="w-4 h-4 mr-2 text-indigo-500" /> Rincian Tagihan Bulan {bulan}/{tahun}</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                     <h5 className="text-sm font-bold text-gray-700 border-b pb-1 mb-2">Iuran Keamanan (Satpam)</h5>
                     {satpam ? (
                         <div className="bg-white p-3 rounded border shadow-sm text-sm">
                             <div className="flex justify-between mb-2">
                                 <span className="text-gray-500">Nominal:</span>
                                 <span className="font-bold text-gray-900">{formatRupiah(satpam.jumlah)}</span>
                             </div>
                             <div className="flex justify-between mb-2">
                                 <span className="text-gray-500">Status:</span>
                                 <span className={`px-2 py-0.5 rounded text-xs font-bold ${satpam.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                     {satpam.status === 'paid' ? 'LUNAS' : 'BELUM BAYAR'}
                                 </span>
                             </div>
                             {satpam.tanggal_bayar && (
                                 <div className="flex justify-between">
                                     <span className="text-gray-500">Tgl Bayar:</span>
                                     <span className="text-gray-900">{satpam.tanggal_bayar}</span>
                                 </div>
                             )}
                         </div>
                     ) : <p className="text-xs text-gray-400 italic">Tidak ada tagihan satpam.</p>}
                </div>

                <div>
                     <h5 className="text-sm font-bold text-gray-700 border-b pb-1 mb-2">Iuran Kebersihan (Sampah)</h5>
                     {kebersihan ? (
                         <div className="bg-white p-3 rounded border shadow-sm text-sm">
                             <div className="flex justify-between mb-2">
                                 <span className="text-gray-500">Nominal:</span>
                                 <span className="font-bold text-gray-900">{formatRupiah(kebersihan.jumlah)}</span>
                             </div>
                             <div className="flex justify-between mb-2">
                                 <span className="text-gray-500">Status:</span>
                                 <span className={`px-2 py-0.5 rounded text-xs font-bold ${kebersihan.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                     {kebersihan.status === 'paid' ? 'LUNAS' : 'BELUM BAYAR'}
                                 </span>
                             </div>
                             {kebersihan.tanggal_bayar && (
                                 <div className="flex justify-between">
                                     <span className="text-gray-500">Tgl Bayar:</span>
                                     <span className="text-gray-900">{kebersihan.tanggal_bayar}</span>
                                 </div>
                             )}
                         </div>
                     ) : <p className="text-xs text-gray-400 italic">Tidak ada tagihan kebersihan.</p>}
                </div>
            </div>

            <div className="mt-4 pt-4 border-t">
                <h5 className="text-sm font-bold text-gray-700 border-b pb-1 mb-2">Informasi Hunian</h5>
                <div className="bg-white p-3 rounded border shadow-sm text-sm grid grid-cols-2 gap-4">
                    <div>
                        <span className="block text-gray-500 text-xs">Nomor Rumah</span>
                        <span className="font-semibold text-gray-900">{house?.nomor_rumah}</span>
                    </div>
                    <div>
                        <span className="block text-gray-500 text-xs">Penghuni Tertagih</span>
                        <span className="font-semibold text-gray-900">{resident?.nama_lengkap || 'Kosong'}</span>
                    </div>
                    <div className="col-span-2">
                        <span className="block text-gray-500 text-xs">Alamat</span>
                        <span className="text-gray-900">{house?.alamat}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

const Payments = () => {
    const [payments, setPayments] = useState([]);
    const [groupedPayments, setGroupedPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        bulan: new Date().getMonth() + 1,
        tahun: new Date().getFullYear(),
        status: ''
    });

    const fetchPayments = async () => {
        setLoading(true);
        try {
            const query = new URLSearchParams(filters).toString();
            const response = await api.get(`/payments?${query}&per_page=all`);
            const rawData = response.data.data.data;
            setPayments(rawData);
            
            // Group by bulan-tahun-house_id
            const grouped = {};
            rawData.forEach(p => {
                const key = `${p.bulan}-${p.tahun}-${p.house_id}`;
                if (!grouped[key]) {
                    grouped[key] = {
                        id: key,
                        house: p.house,
                        resident: p.resident,
                        bulan: p.bulan,
                        tahun: p.tahun,
                        satpam: null,
                        kebersihan: null,
                    };
                }
                grouped[key][p.jenis_iuran] = p;
            });
            setGroupedPayments(Object.values(grouped));

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
        if (!window.confirm(`Generate tagihan massal untuk bulan ${filters.bulan}/${filters.tahun}?`)) return;
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

    const handleMarkPaid = async (paymentId) => {
        try {
            await api.post(`/payments/${paymentId}/mark-paid`, { 
                tanggal_bayar: new Date().toISOString().split('T')[0] 
            });
            fetchPayments();
        } catch (err) {
            alert('Gagal menandai lunas');
        }
    };

    const handleExportExcel = () => {
        const dataToExport = filteredItems.map(row => ({
            'Periode Tagihan': `Bulan ${row.bulan} Tahun ${row.tahun}`,
            'No Rumah': row.house?.nomor_rumah,
            'Penghuni': row.resident?.nama_lengkap || '-',
            'Satpam Nominal': row.satpam ? row.satpam.jumlah : 0,
            'Satpam Status': row.satpam ? (row.satpam.status === 'paid' ? 'LUNAS' : 'BELUM LUNAS') : '-',
            'Kebersihan Nominal': row.kebersihan ? row.kebersihan.jumlah : 0,
            'Kebersihan Status': row.kebersihan ? (row.kebersihan.status === 'paid' ? 'LUNAS' : 'BELUM LUNAS') : '-',
        }));

        const ws = XLSX.utils.json_to_sheet(dataToExport);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Data Iuran");
        XLSX.writeFile(wb, `Laporan_Iuran_${filters.bulan}_${filters.tahun}.xlsx`);
    };

    const renderPaymentCell = (payment) => {
        if (!payment) return <span className="text-gray-400 italic text-xs">Kosong</span>;
        const isPaid = payment.status === 'paid';
        return (
            <div className="flex flex-col items-start min-w-[120px]">
                <div className="font-semibold text-gray-900">{formatRupiah(payment.jumlah)}</div>
                <div className={`mt-1 flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${isPaid ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {isPaid ? <Check className="w-3 h-3 mr-1" /> : <AlertCircle className="w-3 h-3 mr-1" />}
                    {isPaid ? 'Lunas' : 'Belum'}
                </div>
            </div>
        );
    };

    const columns = [
        {
            name: 'Rumah',
            selector: row => row.house?.nomor_rumah,
            sortable: true,
            width: '100px',
            cell: row => <div className="font-bold text-gray-900">{row.house?.nomor_rumah}</div>
        },
        {
            name: 'Penghuni',
            selector: row => row.resident?.nama_lengkap || '',
            sortable: true,
            cell: row => <div className="text-sm">{row.resident?.nama_lengkap || '-'}</div>
        },
        {
            name: 'Periode',
            selector: row => row.bulan,
            sortable: true,
            width: '120px',
            cell: row => <div className="text-sm font-medium text-gray-500">Bl. {row.bulan}/{row.tahun}</div>
        },
        {
            name: 'Satpam',
            cell: row => renderPaymentCell(row.satpam),
            sortable: true,
            sortFunction: (a, b) => (a.satpam?.status === 'paid' ? 1 : 0) - (b.satpam?.status === 'paid' ? 1 : 0)
        },
        {
            name: 'Kebersihan',
            cell: row => renderPaymentCell(row.kebersihan),
            sortable: true,
            sortFunction: (a, b) => (a.kebersihan?.status === 'paid' ? 1 : 0) - (b.kebersihan?.status === 'paid' ? 1 : 0)
        },
        {
            name: 'Aksi Bayar',
            cell: row => (
                <div className="flex space-x-2">
                    {row.satpam && row.satpam.status === 'unpaid' && (
                        <button onClick={() => handleMarkPaid(row.satpam.id)} className="bg-indigo-50 border border-indigo-200 text-indigo-700 px-2 py-1 rounded text-xs hover:bg-indigo-100 flex items-center transition" title="Lunas Satpam">
                            <CheckCircle className="w-3 h-3 mr-1" /> Satpam
                        </button>
                    )}
                    {row.kebersihan && row.kebersihan.status === 'unpaid' && (
                        <button onClick={() => handleMarkPaid(row.kebersihan.id)} className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-2 py-1 rounded text-xs hover:bg-emerald-100 flex items-center transition" title="Lunas Kebersihan">
                            <CheckCircle className="w-3 h-3 mr-1" /> Sampah
                        </button>
                    )}
                </div>
            ),
            ignoreRowClick: true,
            width: '200px'
        }
    ];

    const filteredItems = groupedPayments.filter(
        item => item.house?.nomor_rumah.toLowerCase().includes(searchTerm.toLowerCase()) || 
                (item.resident?.nama_lengkap || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm">
                <div>
                    <h1 className="text-xl font-bold text-gray-900">Manajemen Iuran</h1>
                    <p className="text-sm text-gray-500">Tagihan Satpam & Kebersihan</p>
                </div>
                <div className="flex space-x-3">
                    <button
                        onClick={handleExportExcel}
                        className="flex items-center px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition shadow-sm"
                    >
                        <Download className="h-5 w-5 mr-2" />
                        Export Excel
                    </button>
                    <button
                        onClick={handleGenerate}
                        className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition shadow-sm"
                    >
                        <FileText className="h-5 w-5 mr-2" />
                        Generate Tagihan Bulan Ini
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="p-4 border-b border-gray-200 bg-gray-50">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">Cari Rumah / Penghuni</label>
                            <div className="relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Search className="h-4 w-4 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2 border bg-white"
                                    placeholder="Nomor rumah atau nama..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">Bulan Tagihan</label>
                            <select className="block w-full border-gray-300 rounded-md sm:text-sm border py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 bg-white" value={filters.bulan} onChange={(e) => setFilters({...filters, bulan: e.target.value})}>
                                {[...Array(12)].map((_, i) => <option key={i} value={i+1}>{new Date(0, i).toLocaleString('id-ID', { month: 'long' })}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">Tahun Tagihan</label>
                            <input type="number" className="block w-full border-gray-300 rounded-md sm:text-sm border py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 bg-white" value={filters.tahun} onChange={(e) => setFilters({...filters, tahun: e.target.value})} />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">Status Pembayaran</label>
                            <select className="block w-full border-gray-300 rounded-md sm:text-sm border py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 bg-white" value={filters.status} onChange={(e) => setFilters({...filters, status: e.target.value})}>
                                <option value="">Semua Tagihan</option>
                                <option value="paid">Hanya Lunas</option>
                                <option value="unpaid">Hanya Belum Lunas</option>
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
                    expandableRowsComponent={ExpandedPaymentComponent}
                    highlightOnHover
                    responsive
                    noDataComponent={<div className="p-8 text-center text-gray-500 italic">Tidak ada data tagihan ditemukan untuk periode ini.</div>}
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
        </div>
    );
};

export default Payments;
