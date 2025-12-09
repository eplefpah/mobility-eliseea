import React, { useEffect, useState } from 'react';
import { Mobility, ChecklistItem, User, ChecklistItemStatus } from '../types';
import { getMobility, getChecklist } from '../services/mockData';
import { Calendar, MapPin, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface DashboardProps {
  user: User;
}

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const [mobility, setMobility] = useState<Mobility | null>(null);
  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const mob = await getMobility(user.id);
      setMobility(mob);
      if (mob) {
        const list = await getChecklist(mob.id);
        setChecklist(list);
      }
    };
    loadData();
  }, [user.id]);

  if (!mobility) return <div className="p-8 text-center text-slate-500">Chargement...</div>;

  const completedTasks = checklist.filter(i => i.status === ChecklistItemStatus.VALIDATED || i.status === ChecklistItemStatus.DONE).length;
  const totalTasks = checklist.length;
  const progress = Math.round((completedTasks / totalTasks) * 100) || 0;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Bonjour, {user.name.split(' ')[0]} 👋</h1>
          <p className="text-slate-500 mt-1">Voici le résumé de votre projet de mobilité.</p>
        </div>
        <div className="hidden md:block bg-indigo-100 text-indigo-800 px-4 py-2 rounded-full text-sm font-semibold">
           Statut: {mobility.status}
        </div>
      </div>

      {/* Hero Card */}
      <div className="bg-gradient-to-r from-indigo-600 to-blue-600 rounded-2xl p-6 md:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <div className="flex items-center gap-2 text-indigo-100 mb-2">
              <MapPin size={18} />
              <span className="uppercase tracking-wider text-sm font-semibold">Destination</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{mobility.destination}</h2>
            <div className="flex flex-wrap gap-4 text-sm font-medium">
              <div className="flex items-center gap-2 bg-white/20 px-3 py-1.5 rounded-lg backdrop-blur-sm">
                <Calendar size={16} />
                {new Date(mobility.startDate).toLocaleDateString()} - {new Date(mobility.endDate).toLocaleDateString()}
              </div>
              <div className="flex items-center gap-2 bg-white/20 px-3 py-1.5 rounded-lg backdrop-blur-sm">
                <span>🏢 {mobility.hostOrganization}</span>
              </div>
            </div>
          </div>
          
          <div className="w-full md:w-auto">
             <Link to="/journal" className="block w-full text-center bg-yellow-400 hover:bg-yellow-300 text-indigo-900 px-6 py-3 rounded-xl font-bold transition-colors shadow-lg">
               Remplir mon journal
             </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Checklist Progress */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
              <CheckCircle2 className="text-emerald-500" />
              Checklist Pré-départ
            </h3>
            <span className="text-2xl font-bold text-indigo-600">{progress}%</span>
          </div>
          
          <div className="w-full bg-slate-100 rounded-full h-3 mb-6">
            <div className="bg-indigo-600 h-3 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
          </div>

          <div className="space-y-3">
            {checklist.slice(0, 3).map(item => (
               <div key={item.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                 <span className={`text-sm ${item.status === ChecklistItemStatus.DONE || item.status === ChecklistItemStatus.VALIDATED ? 'line-through text-slate-400' : 'text-slate-700 font-medium'}`}>
                   {item.label}
                 </span>
                 {item.status === ChecklistItemStatus.DONE || item.status === ChecklistItemStatus.VALIDATED ? (
                   <span className="text-xs font-bold text-emerald-600 bg-emerald-100 px-2 py-1 rounded">FAIT</span>
                 ) : (
                   <span className="text-xs font-bold text-amber-600 bg-amber-100 px-2 py-1 rounded">À FAIRE</span>
                 )}
               </div>
            ))}
          </div>
          
          <Link to="/mobility" className="mt-4 flex items-center text-sm text-indigo-600 font-medium hover:text-indigo-800">
            Voir toute la checklist <ArrowRight size={16} className="ml-1" />
          </Link>
        </div>

        {/* Notifications / Next Steps */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
           <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2 mb-6">
              <AlertCircle className="text-amber-500" />
              À ne pas oublier
            </h3>
            
            <div className="space-y-4">
              <div className="p-4 bg-amber-50 border-l-4 border-amber-400 rounded-r-lg">
                <p className="text-sm text-amber-900 font-medium">Bilan de mi-parcours</p>
                <p className="text-xs text-amber-700 mt-1">Vous arrivez à la moitié de votre stage. Pensez à faire un point avec votre tuteur.</p>
              </div>
               <div className="p-4 bg-blue-50 border-l-4 border-blue-400 rounded-r-lg">
                <p className="text-sm text-blue-900 font-medium">Photos pour le journal</p>
                <p className="text-xs text-blue-700 mt-1">N'oubliez pas de prendre des photos de votre lieu de travail cette semaine !</p>
              </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;