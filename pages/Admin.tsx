import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Users, FileText, Globe } from 'lucide-react';

const Admin: React.FC = () => {
  const dataMobility = [
    { name: 'Espagne', value: 24 },
    { name: 'Irlande', value: 18 },
    { name: 'Malte', value: 12 },
    { name: 'Allemagne', value: 8 },
  ];

  const dataStatus = [
    { name: 'En préparation', value: 15 },
    { name: 'En cours', value: 30 },
    { name: 'Terminé', value: 45 },
  ];

  const COLORS = ['#6366f1', '#10b981', '#f59e0b'];

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-slate-900">Administration & Statistiques</h1>
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="p-4 bg-indigo-100 text-indigo-600 rounded-lg">
               <Users size={24} />
            </div>
            <div>
               <p className="text-slate-500 text-sm">Apprenants Inscrits</p>
               <p className="text-2xl font-bold text-slate-800">142</p>
            </div>
         </div>
         <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="p-4 bg-emerald-100 text-emerald-600 rounded-lg">
               <Globe size={24} />
            </div>
            <div>
               <p className="text-slate-500 text-sm">Mobilités actives</p>
               <p className="text-2xl font-bold text-slate-800">32</p>
            </div>
         </div>
         <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="p-4 bg-amber-100 text-amber-600 rounded-lg">
               <FileText size={24} />
            </div>
            <div>
               <p className="text-slate-500 text-sm">Témoignages Validés</p>
               <p className="text-2xl font-bold text-slate-800">89</p>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 h-80">
           <h3 className="font-bold text-slate-700 mb-4">Destinations Populaires</h3>
           <ResponsiveContainer width="100%" height="100%">
             <BarChart data={dataMobility}>
                <XAxis dataKey="name" fontSize={12} stroke="#94a3b8" />
                <YAxis fontSize={12} stroke="#94a3b8" />
                <Tooltip />
                <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} />
             </BarChart>
           </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 h-80">
           <h3 className="font-bold text-slate-700 mb-4">État des Mobilités</h3>
           <ResponsiveContainer width="100%" height="100%">
             <PieChart>
                <Pie
                  data={dataStatus}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {dataStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
             </PieChart>
           </ResponsiveContainer>
           <div className="flex justify-center gap-4 text-xs">
              {dataStatus.map((entry, index) => (
                 <div key={index} className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }}></div>
                    {entry.name}
                 </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;