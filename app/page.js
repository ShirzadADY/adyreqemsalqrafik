'use client';
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Train, Calendar, Users, Clock, Download, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';
import * as XLSX from 'xlsx';

export default function Home() {
  const [activeTab, setActiveTab] = useState('grafik');
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('Hazırdır');

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      {/* Header */}
      <header className="bg-slate-900 text-white shadow-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-blue-600 rounded-xl shadow-lg">
              <Train className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">AZD Növbə</h1>
              <p className="text-xs text-slate-400">Lokomotiv İdarəetmə və Növbə Planlaşdırma Sistemi</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex bg-slate-800 p-1.5 rounded-xl border border-slate-700">
            <button
              onClick={() => setActiveTab('grafik')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'grafik' ? 'bg-blue-600 text-white shadow' : 'text-slate-300 hover:text-white'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Aylıq Qrafik</span>
            </button>
            <button
              onClick={() => setActiveTab('heyet')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'heyet' ? 'bg-blue-600 text-white shadow' : 'text-slate-300 hover:text-white'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Maşinist Heyəti</span>
            </button>
            <button
              onClick={() => setActiveTab('reysler')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'reysler' ? 'bg-blue-600 text-white shadow' : 'text-slate-300 hover:text-white'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>Reyslər Və Dövriyyə</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Lokomotiv İdarəetmə Paneli</h2>
            <p className="text-sm text-slate-500 mt-1">Aylıq avtomatik növbə qrafiki və ədalətli iş yükü hesabatları</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => alert('Excel ixracı aktivdir')}
              className="flex items-center space-x-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium shadow-sm transition-all text-sm"
            >
              <Download className="w-4 h-4" />
              <span>Excel-ə İxrac</span>
            </button>
            <button
              onClick={() => alert('Avto-hesablama işə düşdü')}
              className="flex items-center space-x-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium shadow-sm transition-all text-sm"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span>Avto-Hesabla</span>
            </button>
          </div>
        </div>

        {/* Dashboard Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Aktiv Heyət</p>
                <h3 className="text-2xl font-bold text-slate-800 mt-1">0 nəfər</h3>
              </div>
              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                <Users className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-xs text-emerald-600">
              <CheckCircle2 className="w-4 h-4 mr-1" />
              <span>Tam heyət aktivdir</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Qeydə Alınmış Reyslər</p>
                <h3 className="text-2xl font-bold text-slate-800 mt-1">0 reys</h3>
              </div>
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                <Train className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-xs text-blue-600">
              <Clock className="w-4 h-4 mr-1" />
              <span>Dövriyyə planı aktivdir</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Gecə Növbəsi (22:00-06:00)</p>
                <h3 className="text-2xl font-bold text-slate-800 mt-1">Avto-hesaplanır</h3>
              </div>
              <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
                <Clock className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-xs text-slate-500">
              <span>Ədalətli yük balansı</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Qrafik Statusu</p>
                <h3 className="text-2xl font-bold text-slate-800 mt-1">Hazırdır</h3>
              </div>
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                <CheckCircle2 className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-xs text-slate-500">
              <span>Sentyabr 2026</span>
            </div>
          </div>
        </div>

        {/* Data Table / Schedule View */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-200 flex justify-between items-center">
            <h3 className="text-lg font-bold text-slate-800">Maşinistlərin Aylıq Növbə Cədvəli</h3>
            <div className="flex items-center space-x-2">
              <input
                type="month"
                defaultValue="2026-09"
                className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  <th className="py-4 px-6">Ad Soyad</th>
                  <th className="py-4 px-6">Vəzifə</th>
                  <th className="py-4 px-6">Telefon</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Əməliyyatlar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-sm text-slate-700">
                <tr>
                  <td className="py-4 px-6 font-medium text-slate-900">Şirzad Əliyev</td>
                  <td className="py-4 px-6">Lokomotiv Maşinisti</td>
                  <td className="py-4 px-6">+994 (50) 000-00-00</td>
                  <td className="py-4 px-6">
                    <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-medium">Aktiv</span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button className="text-blue-600 hover:text-blue-800 font-medium text-xs">Redaktə et</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}
