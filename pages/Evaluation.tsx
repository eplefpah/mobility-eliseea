import React, { useState } from 'react';
import { User, Evaluation as EvaluationType, JournalEntry } from '../types';
import { getJournalEntries, getMobility, saveTestimonial } from '../services/mockData';
import { generateTestimonial } from '../services/geminiService';
import { Sparkles, Send, Edit3, Share2, Loader2 } from 'lucide-react';

interface Props {
  user: User;
}

const Evaluation: React.FC<Props> = ({ user }) => {
  const [step, setStep] = useState<'FORM' | 'LOADING' | 'REVIEW' | 'PUBLISHED'>('FORM');
  const [evalData, setEvalData] = useState<EvaluationType>({
    logistics: 4,
    reception: 4,
    skills: 4,
    content: '',
    highlights: ''
  });
  
  const [generatedResult, setGeneratedResult] = useState<{ title: string; content: string } | null>(null);
  const [editedContent, setEditedContent] = useState('');

  const handleGenerate = async () => {
    setStep('LOADING');
    try {
      const mobility = await getMobility(user.id);
      if (!mobility) throw new Error("Mobility not found");
      
      const journal = await getJournalEntries(mobility.id);
      
      const result = await generateTestimonial(journal, evalData, user.name, mobility.destination);
      
      setGeneratedResult(result);
      setEditedContent(result.content);
      setStep('REVIEW');
    } catch (e) {
      console.error(e);
      alert("Erreur lors de la génération. Vérifiez la console.");
      setStep('FORM');
    }
  };

  const handlePublish = async () => {
      if(!generatedResult) return;
      const mobility = await getMobility(user.id);
      if(!mobility) return;

      await saveTestimonial({
          id: `t-${Date.now()}`,
          mobilityId: mobility.id,
          authorName: user.name,
          content: editedContent,
          generatedTitle: generatedResult.title,
          status: 'PUBLISHED'
      });
      setStep('PUBLISHED');
  };

  if (step === 'PUBLISHED') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-8 bg-white rounded-2xl shadow-sm border border-emerald-100">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4">
          <Share2 size={32} />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Merci pour votre partage !</h2>
        <p className="text-slate-500 max-w-md">Votre témoignage a été transmis aux coordinateurs. Il inspirera les futurs participants du consortium ELISEEA.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-slate-900 flex items-center justify-center gap-3">
           <Sparkles className="text-yellow-500" /> Bilan & Valorisation
        </h1>
        <p className="text-slate-500 mt-2">Répondez à quelques questions et laissez notre IA rédiger une ébauche de votre témoignage.</p>
      </div>

      {step === 'FORM' && (
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100">
           <h2 className="text-xl font-bold mb-6 text-slate-800 border-b pb-2">1. Votre Évaluation</h2>
           
           <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Logistique & Préparation</label>
                    <input type="range" min="1" max="5" value={evalData.logistics} onChange={e => setEvalData({...evalData, logistics: parseInt(e.target.value)})} className="w-full accent-indigo-600" />
                    <div className="flex justify-between text-xs text-slate-400 mt-1"><span>Mauvais</span><span>Excellent ({evalData.logistics})</span></div>
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Accueil sur place</label>
                    <input type="range" min="1" max="5" value={evalData.reception} onChange={e => setEvalData({...evalData, reception: parseInt(e.target.value)})} className="w-full accent-indigo-600" />
                    <div className="flex justify-between text-xs text-slate-400 mt-1"><span>Mauvais</span><span>Excellent ({evalData.reception})</span></div>
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Compétences acquises</label>
                    <input type="range" min="1" max="5" value={evalData.skills} onChange={e => setEvalData({...evalData, skills: parseInt(e.target.value)})} className="w-full accent-indigo-600" />
                    <div className="flex justify-between text-xs text-slate-400 mt-1"><span>Faible</span><span>Forte ({evalData.skills})</span></div>
                 </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Qu'avez-vous fait principalement ? (En une phrase)</label>
                <input 
                  type="text" 
                  className="w-full border border-slate-300 rounded-lg p-3"
                  value={evalData.content}
                  onChange={e => setEvalData({...evalData, content: e.target.value})}
                  placeholder="J'ai travaillé dans une serre et appris à gérer l'irrigation..."
                />
              </div>

               <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Vos moments forts ou points positifs majeurs</label>
                <textarea 
                  className="w-full border border-slate-300 rounded-lg p-3 h-24"
                  value={evalData.highlights}
                  onChange={e => setEvalData({...evalData, highlights: e.target.value})}
                  placeholder="La rencontre avec l'équipe, la découverte de la ville..."
                />
              </div>

              <div className="pt-4 text-center">
                 <button 
                  onClick={handleGenerate}
                  disabled={!evalData.content}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-3 rounded-full font-bold shadow-lg flex items-center gap-2 mx-auto disabled:opacity-50 transition-all transform hover:scale-105"
                 >
                   <Sparkles size={20} /> Générer mon témoignage avec l'IA
                 </button>
                 <p className="text-xs text-slate-400 mt-2">Nous utilisons Gemini AI pour rédiger un projet basé sur votre journal et ces réponses.</p>
              </div>
           </div>
        </div>
      )}

      {step === 'LOADING' && (
        <div className="flex flex-col items-center justify-center h-64">
           <Loader2 className="animate-spin text-indigo-600 mb-4" size={48} />
           <p className="text-slate-600 font-medium animate-pulse">L'IA analyse votre journal de bord et rédige votre histoire...</p>
        </div>
      )}

      {step === 'REVIEW' && generatedResult && (
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-purple-100">
           <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-slate-800">2. Relecture & Validation</h2>
              <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-bold border border-purple-200">Généré par IA</span>
           </div>

           <div className="mb-6">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Titre suggéré</label>
              <div className="text-lg font-serif font-semibold text-indigo-900 bg-slate-50 p-3 rounded border border-slate-200">
                {generatedResult.title}
              </div>
           </div>

           <div className="mb-6">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Votre témoignage</label>
              <div className="relative">
                 <textarea 
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                    className="w-full min-h-[200px] p-4 bg-slate-50 border-2 border-slate-200 rounded-lg text-slate-700 font-medium leading-relaxed focus:border-indigo-500 focus:bg-white transition-colors"
                 />
                 <Edit3 className="absolute top-4 right-4 text-slate-400 pointer-events-none" size={16} />
              </div>
              <p className="text-xs text-slate-500 mt-2 text-right">Vous pouvez modifier le texte librement avant de l'envoyer.</p>
           </div>

           <div className="flex gap-4 justify-end">
              <button 
                onClick={() => setStep('FORM')}
                className="text-slate-500 hover:text-slate-800 font-medium px-4 py-2"
              >
                Retour
              </button>
              <button 
                onClick={handlePublish}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-bold flex items-center gap-2 shadow-md transition-colors"
              >
                <Send size={18} /> Valider et Envoyer
              </button>
           </div>
        </div>
      )}
    </div>
  );
};

export default Evaluation;