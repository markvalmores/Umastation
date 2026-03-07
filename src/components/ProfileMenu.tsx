import React, { useState, useRef } from 'react';
import { User, LogIn, UserPlus, Camera, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ProfileMenuProps {
  isLoggedIn: boolean;
  username: string;
  profilePicture: string;
  onLogin: (username: string) => void;
  onRegister: (username: string) => void;
  onLogout: () => void;
  onUpdatePicture: (picture: string) => void;
}

export const ProfileMenu: React.FC<ProfileMenuProps> = ({
  isLoggedIn,
  username,
  profilePicture,
  onLogin,
  onRegister,
  onLogout,
  onUpdatePicture,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [inputUsername, setInputUsername] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpdatePicture(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12 rounded-full border-2 border-emerald-500/30 p-1 overflow-hidden hover:border-emerald-500 transition-colors"
      >
        {isLoggedIn ? (
          <img src={profilePicture} className="w-full h-full rounded-full object-cover" referrerPolicy="no-referrer" />
        ) : (
          <div className="w-full h-full rounded-full bg-white/10 flex items-center justify-center">
            <User size={20} className="text-white/50" />
          </div>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute right-0 top-16 w-80 bg-black/90 border border-white/10 rounded-2xl p-6 shadow-2xl z-50 backdrop-blur-xl"
          >
            {isLoggedIn ? (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img src={profilePicture} className="w-16 h-16 rounded-full object-cover" referrerPolicy="no-referrer" />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute bottom-0 right-0 p-1.5 bg-emerald-500 rounded-full text-black hover:bg-emerald-400 transition-colors"
                    >
                      <Camera size={14} />
                    </button>
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/png, image/jpeg, image/gif" className="hidden" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">{username}</h4>
                    <p className="text-xs text-white/50">Trainer</p>
                  </div>
                </div>
                <button
                  onClick={() => { onLogout(); setIsOpen(false); }}
                  className="w-full py-2 rounded-lg bg-white/5 hover:bg-red-500/20 text-white hover:text-red-400 transition-colors text-sm font-bold"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex gap-2 mb-6">
                  <button
                    onClick={() => setActiveTab('login')}
                    className={`flex-1 py-2 rounded-lg text-sm font-bold transition-colors ${activeTab === 'login' ? 'bg-emerald-500 text-black' : 'bg-white/5 text-white/50'}`}
                  >
                    Login
                  </button>
                  <button
                    onClick={() => setActiveTab('register')}
                    className={`flex-1 py-2 rounded-lg text-sm font-bold transition-colors ${activeTab === 'register' ? 'bg-emerald-500 text-black' : 'bg-white/5 text-white/50'}`}
                  >
                    Register
                  </button>
                </div>
                <input
                  type="text"
                  placeholder="Username"
                  value={inputUsername}
                  onChange={(e) => setInputUsername(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-4 text-white focus:outline-none focus:border-emerald-500"
                />
                <button
                  onClick={() => {
                    if (activeTab === 'login') onLogin(inputUsername);
                    else onRegister(inputUsername);
                    setIsOpen(false);
                  }}
                  className="w-full py-2 rounded-lg bg-emerald-500 text-black font-bold hover:bg-emerald-400 transition-colors"
                >
                  {activeTab === 'login' ? 'Login' : 'Register'}
                </button>
              </div>
            )}
            <button onClick={() => setIsOpen(false)} className="absolute top-4 right-4 text-white/30 hover:text-white">
              <X size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
