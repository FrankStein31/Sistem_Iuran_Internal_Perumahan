import { useState, useEffect } from 'react';
import { Home, Users, ArrowUpRight, ArrowDownRight, Activity, Wallet } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../api/axios';

const Dashboard = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const response = await api.get('/dashboard');
                setData(response.data.data);
            } catch (error) {
                console.error('Failed to fetch dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (!data) return null;

    const { summary, chart_data, recent_payments, recent_expenses, payment_status } = data;

    const formatRupiah = (number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(number);
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
                <p className="mt-1 text-sm text-gray-500">Ringkasan statistik keuangan dan data penghuni RT.</p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                <div className="bg-white overflow-hidden shadow rounded-lg p-5 border-l-4 border-indigo-500">
                    <div className="flex items-center">
                        <div className="flex-shrink-0 bg-indigo-100 rounded-md p-3">
                            <Home className="h-6 w-6 text-indigo-600" aria-hidden="true" />
                        </div>
                        <div className="ml-5 w-0 flex-1">
                            <dl>
                                <dt className="text-sm font-medium text-gray-500 truncate">Total Rumah</dt>
                                <dd className="flex items-baseline">
                                    <div className="text-2xl font-semibold text-gray-900">{summary.total_rumah}</div>
                                    <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                                        <span className="sr-only">Dihuni: </span>
                                        {summary.rumah_dihuni} dihuni
                                    </div>
                                </dd>
                            </dl>
                        </div>
                    </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg p-5 border-l-4 border-blue-500">
                    <div className="flex items-center">
                        <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
                            <Users className="h-6 w-6 text-blue-600" aria-hidden="true" />
                        </div>
                        <div className="ml-5 w-0 flex-1">
                            <dl>
                                <dt className="text-sm font-medium text-gray-500 truncate">Total Data Penghuni</dt>
                                <dd className="flex items-baseline">
                                    <div className="text-2xl font-semibold text-gray-900">{summary.total_penghuni}</div>
                                </dd>
                            </dl>
                        </div>
                    </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg p-5 border-l-4 border-green-500">
                    <div className="flex items-center">
                        <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                            <ArrowUpRight className="h-6 w-6 text-green-600" aria-hidden="true" />
                        </div>
                        <div className="ml-5 w-0 flex-1">
                            <dl>
                                <dt className="text-sm font-medium text-gray-500 truncate">Pemasukan Bulan Ini</dt>
                                <dd>
                                    <div className="text-xl font-semibold text-gray-900">{formatRupiah(summary.pemasukan_bulan_ini)}</div>
                                </dd>
                            </dl>
                        </div>
                    </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg p-5 border-l-4 border-red-500">
                    <div className="flex items-center">
                        <div className="flex-shrink-0 bg-red-100 rounded-md p-3">
                            <ArrowDownRight className="h-6 w-6 text-red-600" aria-hidden="true" />
                        </div>
                        <div className="ml-5 w-0 flex-1">
                            <dl>
                                <dt className="text-sm font-medium text-gray-500 truncate">Pengeluaran Bulan Ini</dt>
                                <dd>
                                    <div className="text-xl font-semibold text-gray-900">{formatRupiah(summary.pengeluaran_bulan_ini)}</div>
                                </dd>
                            </dl>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Chart Area */}
                <div className="lg:col-span-2 bg-white shadow rounded-lg p-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Grafik Keuangan 1 Tahun Terakhir</h3>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height={320}>
                            <AreaChart data={[...chart_data].reverse()} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorPemasukan" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                                        <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                                    </linearGradient>
                                    <linearGradient id="colorPengeluaran" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#EF4444" stopOpacity={0.8}/>
                                        <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="bulan" tick={{fontSize: 12}} />
                                <YAxis tickFormatter={(value) => `Rp ${value / 1000}k`} tick={{fontSize: 12}} />
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <Tooltip formatter={(value) => formatRupiah(value)} />
                                <Area type="monotone" dataKey="pemasukan" stroke="#10B981" fillOpacity={1} fill="url(#colorPemasukan)" name="Pemasukan" />
                                <Area type="monotone" dataKey="pengeluaran" stroke="#EF4444" fillOpacity={1} fill="url(#colorPengeluaran)" name="Pengeluaran" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Tagihan Status */}
                <div className="bg-white shadow rounded-lg p-6 flex flex-col justify-between">
                    <div>
                        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4 flex items-center">
                            <Activity className="h-5 w-5 mr-2 text-indigo-500" />
                            Status Iuran Bulan Ini
                        </h3>
                        
                        <div className="space-y-6">
                            <div>
                                <h4 className="text-sm font-medium text-gray-500 mb-2">Iuran Satpam</h4>
                                <div className="flex items-center space-x-4">
                                    <div className="flex-1">
                                        <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                                            <div 
                                                className="h-full bg-green-500 rounded-full" 
                                                style={{ width: `${(payment_status.satpam.paid / (payment_status.satpam.paid + payment_status.satpam.unpaid || 1)) * 100}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                    <div className="text-sm whitespace-nowrap">
                                        <span className="text-green-600 font-bold">{payment_status.satpam.paid}</span> / {payment_status.satpam.paid + payment_status.satpam.unpaid}
                                    </div>
                                </div>
                            </div>
                            
                            <div>
                                <h4 className="text-sm font-medium text-gray-500 mb-2">Iuran Kebersihan</h4>
                                <div className="flex items-center space-x-4">
                                    <div className="flex-1">
                                        <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                                            <div 
                                                className="h-full bg-green-500 rounded-full" 
                                                style={{ width: `${(payment_status.kebersihan.paid / (payment_status.kebersihan.paid + payment_status.kebersihan.unpaid || 1)) * 100}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                    <div className="text-sm whitespace-nowrap">
                                        <span className="text-green-600 font-bold">{payment_status.kebersihan.paid}</span> / {payment_status.kebersihan.paid + payment_status.kebersihan.unpaid}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="mt-8 pt-6 border-t border-gray-200">
                        <div className="rounded-md bg-yellow-50 p-4">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <Wallet className="h-5 w-5 text-yellow-400" aria-hidden="true" />
                                </div>
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-yellow-800">Menunggu Pembayaran</h3>
                                    <div className="mt-2 text-sm text-yellow-700">
                                        <p>Terdapat {summary.tagihan_belum_bayar} tagihan yang belum dibayar bulan ini.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white shadow rounded-lg p-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Pembayaran Terakhir</h3>
                    <div className="flow-root">
                        <ul className="-my-5 divide-y divide-gray-200">
                            {recent_payments.map((payment) => (
                                <li key={payment.id} className="py-4">
                                    <div className="flex items-center space-x-4">
                                        <div className="flex-shrink-0">
                                            <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-green-100">
                                                <ArrowUpRight className="h-5 w-5 text-green-600" />
                                            </span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900 truncate">
                                                Blok A {payment.house?.nomor_rumah} - {payment.resident?.nama_lengkap || 'Tanpa Nama'}
                                            </p>
                                            <p className="text-sm text-gray-500 truncate">
                                                Iuran {payment.jenis_iuran.charAt(0).toUpperCase() + payment.jenis_iuran.slice(1)} ({payment.bulan}/{payment.tahun})
                                            </p>
                                        </div>
                                        <div>
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                {formatRupiah(payment.jumlah)}
                                            </span>
                                        </div>
                                    </div>
                                </li>
                            ))}
                            {recent_payments.length === 0 && (
                                <li className="py-4 text-center text-sm text-gray-500">Belum ada data pembayaran</li>
                            )}
                        </ul>
                    </div>
                </div>

                <div className="bg-white shadow rounded-lg p-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Pengeluaran Terakhir</h3>
                    <div className="flow-root">
                        <ul className="-my-5 divide-y divide-gray-200">
                            {recent_expenses.map((expense) => (
                                <li key={expense.id} className="py-4">
                                    <div className="flex items-center space-x-4">
                                        <div className="flex-shrink-0">
                                            <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-red-100">
                                                <ArrowDownRight className="h-5 w-5 text-red-600" />
                                            </span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900 truncate">
                                                {expense.deskripsi}
                                            </p>
                                            <p className="text-sm text-gray-500 truncate">
                                                {new Date(expense.tanggal).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' })}
                                            </p>
                                        </div>
                                        <div>
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                {formatRupiah(expense.jumlah)}
                                            </span>
                                        </div>
                                    </div>
                                </li>
                            ))}
                            {recent_expenses.length === 0 && (
                                <li className="py-4 text-center text-sm text-gray-500">Belum ada data pengeluaran</li>
                            )}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
