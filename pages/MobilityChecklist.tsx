import React, { useEffect, useState } from 'react';
import { Mobility, ChecklistItem, ChecklistItemStatus, UserRole, User } from '../types';
import { getMobility, getChecklist, updateChecklistItem } from '../services/mockData';
import { CheckCircle, Circle, FileText, Upload, Clock, UserCheck } from 'lucide-react';

interface Props {
  user: User;
}

const MobilityChecklist: React.FC<Props> = ({ user }) => {
  const [mobility, setMobility] = useState<Mobility | null>(null);
  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);

  useEffect(() => {
    const load = async () => {
      const mob = await getMobility(user.id);
      setMobility(mob);
      if (mob) {
        const list = await getChecklist(mob.id);
        setChecklist(list);
      }
    };
    load();
  }, [user.id]);

  const handleStatusChange = async (itemId: string, currentStatus: ChecklistItemStatus) => {
    // Logic: If Student, can toggle TODO -> DONE.
    // If Teacher/Admin, can toggle DONE -> VALIDATED.
    
    let nextStatus = currentStatus;
    
    if (user.role === UserRole.STUDENT) {
        if (currentStatus === ChecklistItemStatus.TODO || currentStatus === ChecklistItemStatus.IN_PROGRESS) {
            nextStatus = ChecklistItemStatus.DONE;
        } else if (currentStatus === ChecklistItemStatus.DONE) {
            nextStatus = ChecklistItemStatus.IN_PROGRESS;
        }
    } else {
        // Teacher logic
        if (currentStatus === ChecklistItemStatus.DONE) {
            nextStatus = ChecklistItemStatus.VALIDATED;
        } else if (currentStatus === ChecklistItemStatus.VALIDATED) {
             nextStatus = ChecklistItemStatus.DONE; // Un-validate
        }
    }

    if (nextStatus !== currentStatus) {
        await updateChecklistItem(itemId, nextStatus);
        setChecklist(checklist.map(i => i.id === itemId ? { ...i, status: nextStatus } : i));
    }
  };

  if (!mobility) return <div>Chargement...</div>;

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
        <h1 className="text-2xl font-bold text-slate-800 mb-4">Détails de la Mobilité</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <div>
                <span className="block text-slate-500">Destination</span>
                <span className="font-semibold text-slate-900">{mobility.destination}</span>
            </div>
             <div>
                <span className="block text-slate-500">Dates</span>
                <span className="font-semibold text-slate-900">{new Date(mobility.startDate).toLocaleDateString()} - {new Date(mobility.endDate).toLocaleDateString()}</span>
            </div>
             <div>
                <span className="block text-slate-500">Structure d'accueil</span>
                <span className="font-semibold text-slate-900">{mobility.hostOrganization}</span>
            </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h2 className="text-xl font-bold text-slate-800">Checklist Pré-départ & Administrative</h2>
            <span className="text-sm bg-slate-100 text-slate-600 px-3 py-1 rounded-full">
                {checklist.filter(i => i.status === ChecklistItemStatus.VALIDATED).length} / {checklist.length} Validés
            </span>
        </div>
        
        <div className="divide-y divide-slate-100">
            {checklist.map((item) => (
                <div key={item.id} className="p-4 md:p-6 hover:bg-slate-50 transition-colors">
                    <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                        <div className="flex gap-4 items-start flex-1">
                            <button 
                                onClick={() => handleStatusChange(item.id, item.status)}
                                disabled={item.status === ChecklistItemStatus.VALIDATED && user.role === UserRole.STUDENT}
                                className={`mt-1 flex-shrink-0 transition-colors ${
                                    item.status === ChecklistItemStatus.VALIDATED ? 'text-emerald-500' : 
                                    item.status === ChecklistItemStatus.DONE ? 'text-blue-500' : 'text-slate-300 hover:text-blue-400'
                                }`}
                            >
                                {item.status === ChecklistItemStatus.VALIDATED ? <CheckCircle size={24} fill="currentColor" className="text-white" /> : 
                                 item.status === ChecklistItemStatus.DONE ? <CheckCircle size={24} /> :
                                 <Circle size={24} />}
                            </button>
                            <div>
                                <h3 className={`font-semibold ${item.status === ChecklistItemStatus.VALIDATED ? 'text-slate-500 line-through' : 'text-slate-800'}`}>
                                    {item.label}
                                </h3>
                                <p className="text-sm text-slate-500 mt-1">{item.description}</p>
                                
                                {item.requiresUpload && (
                                    <div className="mt-3 flex items-center gap-3">
                                        {item.uploadedFile ? (
                                            <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1 rounded text-xs font-medium border border-blue-100">
                                                <FileText size={14} />
                                                {item.uploadedFile}
                                            </div>
                                        ) : (
                                            <button className="flex items-center gap-2 text-xs font-medium text-slate-500 border border-dashed border-slate-300 px-3 py-1 rounded hover:bg-white hover:border-slate-400 transition-colors">
                                                <Upload size={14} /> Déposer un document
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center gap-4 w-full md:w-auto justify-end">
                            {item.deadline && (
                                <div className="flex items-center gap-1 text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded">
                                    <Clock size={12} />
                                    {new Date(item.deadline).toLocaleDateString()}
                                </div>
                            )}
                            
                            <div className="w-32 text-right">
                                {item.status === ChecklistItemStatus.VALIDATED && (
                                    <span className="flex items-center justify-end gap-1 text-xs font-bold text-emerald-600">
                                        <UserCheck size={14} /> Validé
                                    </span>
                                )}
                                {item.status === ChecklistItemStatus.DONE && (
                                    <span className="text-xs font-bold text-blue-600 bg-blue-100 px-2 py-1 rounded">
                                        EN ATTENTE
                                    </span>
                                )}
                                {item.status === ChecklistItemStatus.TODO && (
                                    <span className="text-xs font-bold text-slate-400">
                                        À FAIRE
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default MobilityChecklist;