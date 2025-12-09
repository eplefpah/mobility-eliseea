import React, { useEffect, useState } from 'react';
import { JournalEntry, User, UserRole } from '../types';
import { getJournalEntries, addJournalEntry, getMobility } from '../services/mockData';
import { Book, Plus, Smile, Frown, Meh, Image as ImageIcon, Calendar } from 'lucide-react';

interface Props {
  user: User;
}

const Journal: React.FC<Props> = ({ user }) => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [mobilityId, setMobilityId] = useState<string | null>(null);

  // Form State
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [content, setContent] = useState('');
  const [activities, setActivities] = useState('');
  const [skills, setSkills] = useState('');
  const [mood, setMood] = useState(3);

  useEffect(() => {
    const init = async () => {
      const mob = await getMobility(user.id);
      if (mob) {
        setMobilityId(mob.id);
        const journal = await getJournalEntries(mob.id);
        setEntries(journal);
      }
    };
    init();
  }, [user.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mobilityId) return;

    const newEntry = await addJournalEntry({
      mobilityId,
      date,
      content,
      activities,
      skills,
      mood,
      photos: []
    });

    setEntries([newEntry, ...entries]);
    setIsFormOpen(false);
    // Reset form
    setContent('');
    setActivities('');
    setSkills('');
    setMood(3);
  };

  const MoodIcon = ({ level, active }: { level: number; active: boolean }) => {
     const size = 28;
     const color = active ? (level >= 4 ? 'text-emerald-500' : level === 3 ? 'text-amber-500' : 'text-red-500') : 'text-slate-300';
     
     if (level >= 4) return <Smile size={size} className={color} />;
     if (level === 3) return <Meh size={size} className={color} />;
     return <Frown size={size} className={color} />;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
           <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
             <Book className="text-indigo-600" /> Journal de bord
           </h1>
           <p className="text-slate-500 text-sm mt-1">Documentez votre expérience jour après jour.</p>
        </div>
        {user.role === UserRole.STUDENT && (
          <button 
            onClick={() => setIsFormOpen(!isFormOpen)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
          >
            {isFormOpen ? 'Annuler' : <><Plus size={18} /> Nouvelle entrée</>}
          </button>
        )}
      </div>

      {/* Entry Form */}
      {isFormOpen && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-lg border border-indigo-100 animate-fade-in-down">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
             <div>
               <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
               <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" required />
             </div>
             <div>
               <label className="block text-sm font-medium text-slate-700 mb-1">Humeur du jour</label>
               <div className="flex gap-4 items-center h-10">
                 {[1, 2, 3, 4, 5].map(m => (
                   <button key={m} type="button" onClick={() => setMood(m)} className="transition-transform hover:scale-110">
                     <MoodIcon level={m} active={mood === m} />
                   </button>
                 ))}
               </div>
             </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700 mb-1">Activités réalisées</label>
            <input 
              type="text" 
              placeholder="Ex: Réunion d'équipe, taille des rosiers..." 
              value={activities} 
              onChange={e => setActivities(e.target.value)} 
              className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

           <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700 mb-1">Compétences développées (Savoir-faire / Savoir-être)</label>
            <input 
              type="text" 
              placeholder="Ex: Autonomie, vocabulaire technique..." 
              value={skills} 
              onChange={e => setSkills(e.target.value)} 
              className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="mb-4">
             <label className="block text-sm font-medium text-slate-700 mb-1">Récit de la journée / Observations</label>
             <textarea 
               value={content}
               onChange={e => setContent(e.target.value)}
               className="w-full border border-slate-300 rounded-lg p-3 h-32 focus:ring-2 focus:ring-indigo-500"
               placeholder="Racontez votre journée..."
               required
             ></textarea>
          </div>

          <div className="flex justify-end pt-2">
             <button type="submit" className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-indigo-700 transition-colors">
               Enregistrer
             </button>
          </div>
        </form>
      )}

      {/* Timeline List */}
      <div className="relative border-l-2 border-slate-200 ml-4 md:ml-6 space-y-8 pb-8">
        {entries.map((entry) => (
          <div key={entry.id} className="relative pl-8 md:pl-10">
             {/* Timeline dot */}
             <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-indigo-600 border-4 border-slate-50 shadow-sm"></div>
             
             <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
               <div className="flex flex-col md:flex-row justify-between md:items-center mb-3">
                 <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
                   <Calendar size={16} />
                   {new Date(entry.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                 </div>
                 <div className="flex items-center gap-2 mt-2 md:mt-0">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Humeur</span>
                    <MoodIcon level={entry.mood} active={true} />
                 </div>
               </div>

               <p className="text-slate-800 whitespace-pre-line mb-4 leading-relaxed">
                 {entry.content}
               </p>

               <div className="flex flex-wrap gap-3 mt-4">
                  {entry.activities && (
                    <div className="bg-indigo-50 text-indigo-800 text-xs px-2 py-1 rounded font-medium border border-indigo-100">
                      🛠 {entry.activities}
                    </div>
                  )}
                  {entry.skills && (
                    <div className="bg-emerald-50 text-emerald-800 text-xs px-2 py-1 rounded font-medium border border-emerald-100">
                      🧠 {entry.skills}
                    </div>
                  )}
               </div>

               {entry.photos && entry.photos.length > 0 && (
                 <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
                   {entry.photos.map((photo, idx) => (
                     <img key={idx} src={photo} alt="Journal" className="h-24 w-32 object-cover rounded-lg border border-slate-200" />
                   ))}
                 </div>
               )}
             </div>
          </div>
        ))}

        {entries.length === 0 && (
          <div className="pl-10 py-8 text-slate-500 italic">
            Aucune entrée pour le moment. Commencez votre journal !
          </div>
        )}
      </div>
    </div>
  );
};

export default Journal;