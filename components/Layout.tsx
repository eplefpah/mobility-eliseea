import React, { useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  CheckSquare, 
  BookOpen, 
  MessageSquare, 
  Settings, 
  Menu, 
  X,
  FileText,
  UserCircle,
  LogOut,
  GraduationCap
} from 'lucide-react';
import { User, UserRole } from '../types';

interface LayoutProps {
  user: User;
  setUser: (user: User) => void;
  availableUsers: User[];
}

const Layout: React.FC<LayoutProps> = ({ user, setUser, availableUsers }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const navItems = [
    { to: '/', icon: LayoutDashboard, label: 'Tableau de bord' },
    { to: '/mobility', icon: FileText, label: 'Ma Mobilité & Checklist' },
    { to: '/journal', icon: BookOpen, label: 'Journal de bord' },
    { to: '/forum', icon: MessageSquare, label: 'Forum' },
  ];

  if (user.role === UserRole.ADMIN) {
    navItems.push({ to: '/admin', icon: Settings, label: 'Administration' });
  }

  // Determine if we should show the "Post-Mobility" link (mock logic)
  navItems.push({ to: '/evaluation', icon: GraduationCap, label: 'Bilan & Témoignage' });


  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden bg-indigo-900 text-white p-4 flex justify-between items-center shadow-md z-20 sticky top-0">
        <div className="font-bold text-lg flex items-center gap-2">
           <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-indigo-900 font-bold">E</div>
           ELISEEA
        </div>
        <button onClick={toggleSidebar}>
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside 
        className={`
          fixed inset-y-0 left-0 z-10 w-64 bg-indigo-900 text-white transform transition-transform duration-300 ease-in-out shadow-xl
          md:relative md:translate-x-0
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="p-6 border-b border-indigo-800">
           <div className="flex items-center gap-3 mb-6">
             <div className="w-10 h-10 bg-yellow-400 rounded-lg flex items-center justify-center text-indigo-900 font-bold text-xl shadow-lg">E</div>
             <div>
               <h1 className="font-bold text-lg leading-tight">ELISEEA</h1>
               <p className="text-xs text-indigo-300">Mobilités Européennes</p>
             </div>
           </div>
           
           <div className="flex items-center gap-3 bg-indigo-800/50 p-3 rounded-lg">
             <img src={user.avatarUrl} alt="User" className="w-10 h-10 rounded-full border-2 border-yellow-400" />
             <div className="overflow-hidden">
               <p className="text-sm font-semibold truncate">{user.name}</p>
               <p className="text-xs text-indigo-300 uppercase tracking-wider">{user.role}</p>
             </div>
           </div>
        </div>

        <nav className="p-4 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setIsSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                  isActive 
                    ? 'bg-yellow-400 text-indigo-900 font-medium shadow-md' 
                    : 'text-indigo-100 hover:bg-indigo-800 hover:text-white'
                }`
              }
            >
              <item.icon size={20} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-indigo-800 bg-indigo-900">
           <p className="text-xs text-indigo-400 mb-2 font-semibold">CHANGER D'UTILISATEUR (DEMO)</p>
           <div className="space-y-2">
             {availableUsers.map(u => (
               <button 
                key={u.id}
                onClick={() => setUser(u)}
                className={`w-full text-left px-3 py-2 text-xs rounded flex items-center gap-2 ${user.id === u.id ? 'bg-indigo-700 text-white' : 'text-indigo-300 hover:bg-indigo-800'}`}
               >
                 <UserCircle size={14} />
                 {u.name} ({u.role})
               </button>
             ))}
           </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto h-[calc(100vh-64px)] md:h-screen p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          <Outlet />
        </div>
      </main>

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-0 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default Layout;