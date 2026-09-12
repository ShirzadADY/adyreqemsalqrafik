'use client';
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Train, Calendar, Users, RefreshCw, Plus, Trash2 } from 'lucide-react';

export default function Home() {
  const [activeTab, setActiveTab] = useState('heyet');
  const [mashinistler, setMashinistler] = useState([]);
  const [dbVezifeler, setDbVezifeler] = useState([]);
  const [loading, setLoading] = useState(false);

  // Form state
  const [tabelNo, setTabelNo] = useState('');
  const [adSoyad, setAdSoyad] = useState('');
  const [secilenVezifeler, setSecilenVezifeler] = useState([]);
  const [telefonState, setTelefonState] = useState('');

  // Bazadan həm maşinistləri, həm də vəzifələri çək
  const fetchData = async () => {
    setLoading(true);
    
    // Maşinistləri çək
    const { data: mData, error: mError } = await supabase.from('mashinistler').select('*');
    if (mError) console.error('Maşinist xətası:', mError.message);
    else setMashinistler(mData || []);

    // Vəzifələri bazadan çək
    const { data: vData, error: vError } = await supabase.from('vezifeler').select('*');
    if (vError) console.error('Vəzifə xətası:', vError.message);
    else setDbVezifeler(vData || []);

    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Checkbox dəyişdikdə siyahıya əlavə et və ya çıxar
  const handleCheckboxChange = (vezifeAdi) => {
    if (secilenVezifeler.includes(vezifeAdi)) {
      setSecilenVezifeler(secilenVezifeler.filter(v => v !== vezifeAdi));
    } else {
      setSecilenVezifeler([...secilenVezifeler, vezifeAdi]);
    }
  };

  // Yeni maşinist əlavə et
  const handleAddMashinist = async (e) => {
    e.preventDefault();
    if (!tabelNo || !adSoyad) {
      alert('Zəhmət olmasa Tabel nömrəsini və Ad Soyadı daxil edin!');
      return;
    }
    if (secilenVezifeler.length === 0) {
      alert('Ən azı bir vəzifə/ixtisas seçin!');
      return;
    }

    // Seçilmiş vəzifələri vergüllə birləşdirək (məs: "Elektrik Qatarı Maşinisti, Teplovoz Maşinisti")
    const finalVezife = secilenVezifeler.join(', ');

    const { error } = await supabase.from('mashinistler').insert([
      { tabel_no: tabelNo, ad_soyad: adSoyad, vezife: finalVezife, telefon: telefonState, status: 'Aktiv' }
    ]);

    if (error) {
      alert('Xəta baş verdi (Ola bilər bu Tabel № artıq mövcuddur): ' + error.message);
    } else {
      alert('Maşinist uğurla əlavə olundu!');
      setTabelNo('');
      setAdSoyad('');
      setSecilenVezifeler([]);
      setTelefonState('');
      fetchData();
    }
  };

  // Maşinist sil
  const handleDelete = async (tabel) => {
    if (confirm(`${tabel} nömrəli işçini silmək istədiyinizə əminsinizmi?`)) {
      const { error } = await supabase.from('mashinistler').delete().eq('tabel_no', tabel);
      if (error) {
        alert('Silinmə xətası: ' + error.message);
      } else {
        fetchData();
      }
    }
  };

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
              <p className="text-xs text-slate-400">Lokomotiv İdarəetmə və Tabel Sistemi</p>
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
              <span>Maşinist Heyəti (Tabel)</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        
        {activeTab === 'heyet' && (
          <div className="space-y-8">
            {/* Maşinist Əlavəetmə Formu */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Plus className="w-5 h-5 text-blue-600" />
                Yeni Maşinist / İşçi Əlavə Et
              </h3>
              <form onSubmit={handleAddMashinist} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Tabel №</label>
                    <input
                      type="text"
                      placeholder="Məs: 1045"
                      value={tabelNo}
                      onChange={(e) => setTabelNo(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Ad Soyad</label>
                    <input
                      type="text"
                      placeholder="Məs: Şirzad Əliyev"
                      value={adSoyad}
                      onChange={(e) => setAdSoyad(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Əlaqə nömrəsi</label>
                    <input
                      type="text"
                      placeholder="+994 (XX) XXX-XX-XX"
                      value={telefonState}
                      onChange={(e) => setTelefonState(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                </div>

                {/* Bazadan gələn Vəzifələr (Checkbox siyahısı) */}
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wide">
                    İxtisas / Vəzifələr (Bazadan oxunur - Bir neçəni seçə bilərsiniz):
                  </label>
                  <div className="flex flex-wrap gap-4 items-center">
                    {dbVezifeler.map((v) => (
                      <label key={v.id} className="flex items-center gap-2 cursor-pointer text-sm font-medium text-slate-800 bg-white px-3 py-2 rounded-lg border border-slate-200 shadow-xs hover:bg-slate-100 transition-all">
                        <input
                          type="checkbox"
                          checked={secilenVezifeler.includes(v.ad)}
                          onChange={() => handleCheckboxChange(v.ad)}
                          className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                        />
                        {v.ad}
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium shadow-sm transition-all text-sm"
                  >
                    Maşinisti Yadda Saxla
                  </button>
                </div>
              </form>
            </div>

            {/* Maşinistlər Cədvəli */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-200 flex justify-between items-center">
                <h3 className="text-lg font-bold text-slate-800">Maşinistlərin Tabel Siyahısı</h3>
                <button 
                  onClick={fetchData} 
                  className="flex items-center gap-1 text-xs bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg font-medium transition-all"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                  Yenilə
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      <th className="py-4 px-6">Tabel №</th>
                      <th className="py-4 px-6">Ad Soyad</th>
                      <th className="py-4 px-6">İxtisas / Vəzifə</th>
                      <th className="py-4 px-6">Telefon</th>
                      <th className="py-4 px-6">Status</th>
                      <th className="py-4 px-6 text-right">Əməliyyatlar</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-sm text-slate-700">
                    {mashinistler.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="py-8 text-center text-slate-400">
                          Hələ heç bir maşinist əlavə edilməyib. Yuxarıdakı formdan əlavə edin.
                        </td>
                      </tr>
                    ) : (
                      mashinistler.map((m) => (
                        <tr key={m.tabel_no} className="hover:bg-slate-50/50">
                          <td className="py-4 px-6 font-bold text-blue-600">{m.tabel_no}</td>
                          <td className="py-4 px-6 font-medium text-slate-900">{m.ad_soyad}</td>
                          <td className="py-4 px-6">
                            <span className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-semibold">
                              {m.vezife}
                            </span>
                          </td>
                          <td className="py-4 px-6">{m.telefon || '-'}</td>
                          <td className="py-4 px-6">
                            <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-medium">
                              {m.status || 'Aktiv'}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-right">
                            <button
                              onClick={() => handleDelete(m.tabel_no)}
                              className="p-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-all"
                              title="Sil"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'grafik' && (
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm text-center py-16">
            <Calendar className="w-12 h-12 text-blue-600 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-800">Aylıq Növbə Qrafiki</h3>
            <p className="text-sm text-slate-500 mt-1">Maşinistləri əlavə etdikdən sonra burada tabel nömrələri ilə avtomatik qrafik qurulacaq.</p>
          </div>
        )}

      </div>
    </main>
  );
}
