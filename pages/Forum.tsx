import React, { useEffect, useState } from 'react';
import { ForumPost } from '../types';
import { getForumPosts } from '../services/mockData';
import { MessageSquare, ThumbsUp, MessageCircle, Search } from 'lucide-react';

const Forum: React.FC = () => {
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    getForumPosts().then(setPosts);
  }, []);

  const filteredPosts = posts.filter(p => 
    p.title.toLowerCase().includes(filter.toLowerCase()) || 
    p.category.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Forum Communautaire</h1>
          <p className="text-slate-500">Posez vos questions aux anciens et partagez vos bons plans.</p>
        </div>
        <div className="relative w-full md:w-64">
           <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
           <input 
             type="text" 
             placeholder="Rechercher..." 
             className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
             value={filter}
             onChange={e => setFilter(e.target.value)}
           />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredPosts.map(post => (
          <div key={post.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:border-indigo-200 transition-colors cursor-pointer group">
             <div className="flex justify-between items-start">
               <div>
                  <div className="flex items-center gap-2 mb-2">
                     <span className="bg-indigo-50 text-indigo-700 text-xs px-2 py-1 rounded font-bold uppercase tracking-wide">
                        {post.category}
                     </span>
                     <span className="text-xs text-slate-400">Posté le {new Date(post.date).toLocaleDateString()}</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">{post.title}</h3>
                  <p className="text-slate-600 mt-2 line-clamp-2">{post.content}</p>
               </div>
               <div className="flex flex-col items-center gap-2 text-slate-400">
                  <div className="flex flex-col items-center p-2 bg-slate-50 rounded-lg min-w-[60px]">
                     <ThumbsUp size={18} className="mb-1" />
                     <span className="font-bold text-sm">{post.likes}</span>
                  </div>
               </div>
             </div>
             
             <div className="mt-4 pt-4 border-t border-slate-50 flex justify-between items-center">
                <div className="flex items-center gap-2">
                   <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-yellow-400 to-orange-500 text-white text-xs flex items-center justify-center font-bold">
                      {post.authorName.charAt(0)}
                   </div>
                   <span className="text-sm font-medium text-slate-700">{post.authorName}</span>
                </div>
                <div className="flex items-center gap-1 text-slate-500 text-sm">
                   <MessageCircle size={16} />
                   {post.replies} réponses
                </div>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Forum;