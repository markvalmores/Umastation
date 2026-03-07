import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Music, 
  Newspaper, 
  Calendar, 
  ExternalLink,
  Play,
  Pause,
  Square,
  SkipForward,
  SkipBack,
  Volume2,
  Search,
  Menu,
  X,
  ChevronRight,
  Sparkles,
  Video
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Character, GachaBanner, BirthdayData, NewsItem, Album, Track } from './types';
import { ProfileMenu } from './components/ProfileMenu';
import { BIRTHDAY_MAP } from './data/birthdays';

// --- Components ---

const GlassCard = ({ children, className = "", title = "" }: { children: React.ReactNode, className?: string, title?: string }) => (
  <div className={`relative overflow-hidden rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl shadow-2xl ${className}`}>
    {title && (
      <div className="border-b border-white/5 px-6 py-4 flex items-center justify-between">
        <h3 className="text-sm font-bold uppercase tracking-widest text-white/50">{title}</h3>
        <div className="flex gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/50" />
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/20" />
        </div>
      </div>
    )}
    <div className="p-6">
      {children}
    </div>
  </div>
);

const NavItem = ({ icon: Icon, label, active, onClick }: { icon: any, label: string, active: boolean, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className={`flex items-center gap-4 px-6 py-4 w-full transition-all duration-300 group relative ${
      active ? 'text-emerald-400' : 'text-white/40 hover:text-white/70'
    }`}
  >
    {active && (
      <motion.div 
        layoutId="nav-active"
        className="absolute left-0 w-1 h-8 bg-emerald-500 rounded-r-full shadow-[0_0_15px_rgba(16,185,129,0.5)]"
      />
    )}
    <Icon size={20} className={active ? 'drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]' : ''} />
    <span className="font-medium tracking-wide">{label}</span>
  </button>
);

// --- Main App ---

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [gacha, setGacha] = useState<GachaBanner[]>([]);
  const [birthdays, setBirthdays] = useState<BirthdayData | null>(null);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('Trainer');
  const [profilePicture, setProfilePicture] = useState('https://picsum.photos/seed/trainer/100/100');
  const [showBirthdayCalendar, setShowBirthdayCalendar] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('uma_user');
    if (savedUser) {
      const { username, profilePicture } = JSON.parse(savedUser);
      setUsername(username);
      setProfilePicture(profilePicture);
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = (name: string) => {
    setUsername(name);
    setIsLoggedIn(true);
    localStorage.setItem('uma_user', JSON.stringify({ username: name, profilePicture }));
  };

  const handleRegister = (name: string) => {
    setUsername(name);
    setIsLoggedIn(true);
    localStorage.setItem('uma_user', JSON.stringify({ username: name, profilePicture }));
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('uma_user');
  };

  const handleUpdatePicture = (picture: string) => {
    setProfilePicture(picture);
    localStorage.setItem('uma_user', JSON.stringify({ username, profilePicture: picture }));
  };

  // Audio Player State
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const audioRef = React.useRef<HTMLAudioElement | null>(null);

  const playAlbum = async (albumId: number) => {
    try {
      const res = await fetch(`/api/proxy/music/album/${albumId}`);
      const data = await res.json();
      const tracks = data._tracks || [];
      const playableTrack = tracks.find((t: any) => t.track.preview_url);
      if (playableTrack) {
        setCurrentTrack(playableTrack.track);
        setIsPlaying(true);
      } else {
        alert("No preview available for this album.");
      }
    } catch (error) {
      console.error("Failed to load album tracks", error);
    }
  };

  const togglePlay = () => {
    if (currentTrack) {
      setIsPlaying(!isPlaying);
    }
  };

  const stopMusic = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
      setCurrentTrack(null);
    }
  };

  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const query = searchQuery.trim().toLowerCase();
      if (!query) return;
      
      const match = characters.find(c => 
        c.name_en?.toLowerCase().includes(query) || 
        c.name_jp?.toLowerCase().includes(query) ||
        c.id?.toString().toLowerCase().includes(query)
      );
      
      if (match) {
        window.open(`https://umapyoi.net/character/${match.preferred_url || match.id}`, '_blank');
      } else {
        // Fallback if not found exactly, try to construct URL
        const formattedQuery = query.replace(/\s+/g, '-');
        window.open(`https://umapyoi.net/character/${formattedQuery}`, '_blank');
      }
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const progress = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setAudioProgress(progress || 0);
    }
  };

  useEffect(() => {
    if (audioRef.current && currentTrack) {
      const currentSrc = audioRef.current.getAttribute('src');
      if (currentSrc !== currentTrack.preview_url) {
        audioRef.current.src = currentTrack.preview_url || '';
        audioRef.current.load();
      }
      
      if (isPlaying) {
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(error => {
            if (error.name !== 'AbortError') {
              console.error("Audio play failed", error);
              setIsPlaying(false);
            }
          });
        }
      } else {
        audioRef.current.pause();
      }
    }
  }, [currentTrack, isPlaying]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchOptions = { cache: 'no-store' as RequestCache };
        const [gachaRes, bdayRes, newsRes, charaRes, musicRes, videosRes] = await Promise.all([
          fetch('/api/proxy/gacha', fetchOptions),
          fetch('/api/proxy/birthdays', fetchOptions),
          fetch('/api/proxy/news', fetchOptions),
          fetch('/api/proxy/characters', fetchOptions),
          fetch('/api/proxy/music', fetchOptions),
          fetch('/api/proxy/videos', fetchOptions)
        ]);
        
        const gachaData = await gachaRes.json();
        const bdayData = await bdayRes.json();
        const newsData = await newsRes.json();
        const charaData = await charaRes.json();
        const charactersArray = Array.isArray(charaData) ? charaData : (charaData.characters || []);
        
        const enrichedCharacters = charactersArray.map((chara: Character) => {
          const birthday = BIRTHDAY_MAP[chara.name_en];
          return {
            ...chara,
            birth_month: chara.birth_month || birthday?.month,
            birth_day: chara.birth_day || birthday?.day
          };
        });
        
        console.log("Character data:", enrichedCharacters);
        const musicData = await musicRes.json();
        const videosData = await videosRes.json();

        setGacha(Array.isArray(gachaData) ? gachaData : []);
        setBirthdays(bdayData);
        setNews(Array.isArray(newsData) ? newsData : []);
        setCharacters(enrichedCharacters);
        setAlbums(Array.isArray(musicData) ? musicData : (musicData.albums || []));
        setVideos(Array.isArray(videosData) ? videosData : []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    
    // Auto-update every 60 seconds
    const intervalId = setInterval(fetchData, 60000);
    
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-emerald-500/30">
      <audio 
        ref={audioRef} 
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => setIsPlaying(false)}
      />
      {/* Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03]" />
      </div>

      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 h-full bg-black/60 backdrop-blur-2xl border-r border-white/5 transition-all duration-500 z-50 ${isSidebarOpen ? 'w-72' : 'w-20'}`}>
        <div className="p-8 flex items-center gap-4 mb-8">
          <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.3)]">
            <Sparkles className="text-black" size={24} />
          </div>
          {isSidebarOpen && (
            <motion.h1 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xl font-black tracking-tighter uppercase italic"
            >
              UmaStation
            </motion.h1>
          )}
        </div>

        <nav className="space-y-2">
          <NavItem icon={LayoutDashboard} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
          <NavItem icon={Users} label="Characters" active={activeTab === 'characters'} onClick={() => setActiveTab('characters')} />
          <NavItem icon={Video} label="Videos" active={activeTab === 'videos'} onClick={() => setActiveTab('videos')} />
          <NavItem icon={Music} label="Music Library" active={activeTab === 'music'} onClick={() => setActiveTab('music')} />
          <NavItem icon={Newspaper} label="News Feed" active={activeTab === 'news'} onClick={() => setActiveTab('news')} />
        </nav>

        <div className="absolute bottom-8 left-0 w-full px-6">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="w-full py-3 rounded-xl border border-white/5 hover:bg-white/5 transition-colors flex items-center justify-center gap-2 text-white/40"
          >
            {isSidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`transition-all duration-500 pt-8 px-8 pb-24 ${isSidebarOpen ? 'ml-72' : 'ml-20'}`}>
        {/* Header */}
        <header className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl font-bold tracking-tight mb-2">
              Welcome back, <span className="text-emerald-400 italic">Trainer</span>
            </h2>
            <p className="text-white/40 text-sm font-medium uppercase tracking-widest">System Online • March 7, 2026</p>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-emerald-400 transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Search database..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearch}
                className="bg-white/5 border border-white/10 rounded-full py-3 pl-12 pr-6 w-64 focus:outline-none focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/10 transition-all text-white placeholder:text-white/30"
              />
            </div>
            <ProfileMenu
              isLoggedIn={isLoggedIn}
              username={username}
              profilePicture={profilePicture}
              onLogin={handleLogin}
              onRegister={handleRegister}
              onLogout={handleLogout}
              onUpdatePicture={handleUpdatePicture}
            />
          </div>
        </header>

        {/* Dashboard View */}
        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-12 gap-8">
            {/* Gacha Banners */}
            <div className="col-span-12 lg:col-span-8 space-y-8">
              <h3 className="text-lg font-bold uppercase tracking-widest text-white/30 mb-4 flex items-center gap-3">
                <Sparkles size={18} className="text-emerald-400" />
                Active Gacha Events
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {loading ? (
                  [1, 2].map(i => <div key={`gacha-skeleton-${i}`} className="h-64 bg-white/5 rounded-2xl animate-pulse" />)
                ) : (
                  gacha.map((banner, idx) => (
                    <motion.div 
                      key={`banner-${banner.id || 'new'}-${idx}`}
                      whileHover={{ y: -5 }}
                      className="group relative overflow-hidden rounded-2xl border border-white/10 bg-black/40 cursor-pointer"
                      onClick={() => window.open(`https://umapyoi.net/`, '_blank')}
                    >
                      <img 
                        src={banner.image_url?.startsWith('http') ? banner.image_url : `https://umapyoi.net${banner.image_url || ''}`} 
                        className="w-full h-48 object-cover transition-transform duration-700 group-hover:scale-110" 
                        referrerPolicy="no-referrer" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                      <div className="absolute bottom-0 left-0 p-6 w-full">
                        <div className="flex items-center justify-between mb-2">
                          <span className="px-3 py-1 rounded-full bg-emerald-500 text-black text-[10px] font-black uppercase tracking-tighter">
                            {banner.card_type}
                          </span>
                          <span className="text-[10px] text-white/50 font-mono uppercase">
                            Ends: {new Date(banner.end_date * 1000).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                          {banner.pickups.map((pickup, pIdx) => (
                            <div key={`pickup-${pickup.id || 'new'}-${pIdx}`} className="flex-shrink-0 w-12 h-12 rounded-lg border border-white/10 bg-black/60 p-1">
                              <img 
                                src={`https://gametora.com/images/umamusume/${banner.card_type === 'Outfit' ? 'characters/chara_stand' : 'supports/support_card_s'}_${pickup.chara_id || pickup.id}_${pickup.id}.png`} 
                                className="w-full h-full object-cover rounded"
                                onError={(e) => (e.currentTarget.src = 'https://picsum.photos/seed/uma/64/64')}
                                referrerPolicy="no-referrer"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>

              {/* News Section */}
              <GlassCard title="Latest Intelligence">
                <div className="space-y-6">
                  {news.slice(0, 3).map((item, nIdx) => (
                    <div 
                      key={`news-${item.announce_id || 'new'}-${nIdx}`} 
                      className="flex items-start gap-6 group cursor-pointer"
                      onClick={() => window.open(`https://umapyoi.net/news/${item.announce_id}`, '_blank')}
                    >
                      <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors">
                        <Newspaper size={20} className="text-white/30 group-hover:text-emerald-400" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-white/80 group-hover:text-white transition-colors mb-1">{item.title_english || item.title}</h4>
                        <p className="text-xs text-white/30 font-mono uppercase tracking-widest">
                          {new Date(item.post_at * 1000).toLocaleDateString()}
                        </p>
                      </div>
                      <ChevronRight size={18} className="text-white/10 group-hover:text-emerald-400 transition-all group-hover:translate-x-1" />
                    </div>
                  ))}
                </div>
              </GlassCard>
            </div>

            {/* Sidebar Widgets */}
            <div className="col-span-12 lg:col-span-4 space-y-8">
              {/* Birthdays */}
              <GlassCard title="Birthday Protocol">
                {loading ? (
                  <div className="h-20 bg-white/5 rounded-xl animate-pulse" />
                ) : birthdays?.current_birthdays.length ? (
                  <div className="space-y-4">
                    {birthdays.current_birthdays.map((uma, uIdx) => (
                      <div 
                        key={`bday-${uma.id || 'new'}-${uIdx}`} 
                        className="flex items-center gap-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 cursor-pointer hover:bg-emerald-500/20 transition-colors"
                        onClick={() => window.open(`https://umapyoi.net/character/${uma.preferred_url || uma.id}`, '_blank')}
                      >
                        <img src={uma.sns_icon?.startsWith('http') ? uma.sns_icon : `https://umapyoi.net${uma.sns_icon || ''}`} className="w-12 h-12 rounded-lg object-cover" referrerPolicy="no-referrer" />
                        <div>
                          <h4 className="font-bold text-emerald-400">{uma.name_en}</h4>
                          <p className="text-[10px] text-emerald-500/60 uppercase font-black tracking-widest">Celebrating Today!</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-white/20 text-xs italic">No birthdays detected today.</p>
                  </div>
                )}
              </GlassCard>

              {/* Resets */}
              <GlassCard title="Temporal Sync">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                    <p className="text-[10px] text-white/30 uppercase font-black tracking-widest mb-2">Login Reset</p>
                    <p className="text-2xl font-mono text-emerald-400">05:00</p>
                    <p className="text-[8px] text-white/20 uppercase">JST (GMT+9)</p>
                  </div>
                  <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                    <p className="text-[10px] text-white/30 uppercase font-black tracking-widest mb-2">Content Reset</p>
                    <p className="text-2xl font-mono text-blue-400">12:00</p>
                    <p className="text-[8px] text-white/20 uppercase">JST (GMT+9)</p>
                  </div>
                </div>
              </GlassCard>

              {/* Mini Music Player */}
              <GlassCard title="Audio Stream">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-xl bg-emerald-500/20 flex items-center justify-center relative group">
                    <Music className={`text-emerald-400 transition-transform ${isPlaying ? 'animate-pulse' : ''}`} size={32} />
                    {isPlaying && <div className="absolute inset-0 border-2 border-emerald-500/30 rounded-xl animate-ping opacity-20" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold truncate">{currentTrack ? currentTrack.name_en : 'No Track Selected'}</h4>
                    <p className="text-xs text-white/40 truncate italic">
                      {currentTrack?._singers?.map(s => s.chara_name_en).join(', ') || 'Select an album to play'}
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                      initial={{ width: 0 }}
                      animate={{ width: `${audioProgress}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-white/30">
                      {audioRef.current ? `${Math.floor(audioRef.current.currentTime / 60)}:${Math.floor(audioRef.current.currentTime % 60).toString().padStart(2, '0')}` : '0:00'}
                    </span>
                    <div className="flex items-center gap-4">
                      <SkipBack size={18} className="text-white/40 hover:text-white cursor-pointer" />
                      <div 
                        className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center hover:scale-110 transition-transform cursor-pointer"
                        onClick={togglePlay}
                      >
                        {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-1" />}
                      </div>
                      <SkipForward size={18} className="text-white/40 hover:text-white cursor-pointer" />
                    </div>
                    <span className="text-[10px] font-mono text-white/30">
                      {audioRef.current && audioRef.current.duration ? `${Math.floor(audioRef.current.duration / 60)}:${Math.floor(audioRef.current.duration % 60).toString().padStart(2, '0')}` : '0:00'}
                    </span>
                  </div>
                </div>
              </GlassCard>
            </div>
          </div>
        )}

        {/* Characters View */}
        {activeTab === 'characters' && (
          <div className="space-y-8">
             <div className="flex items-center justify-between mb-8">
               <h3 className="text-lg font-bold uppercase tracking-widest text-white/30 flex items-center gap-3">
                  <Users size={18} className="text-emerald-400" />
                  Character Database
                </h3>
                <div className="flex gap-2">
                  <button 
                    onClick={() => window.open('https://umapyoi.net/characters', '_blank')}
                    className="px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-emerald-500/20 hover:border-emerald-500/50 transition-all text-xs font-bold flex items-center gap-2"
                  >
                    <ExternalLink size={12} />
                    Umapyoi Characters
                  </button>
                  <button 
                    onClick={() => setShowBirthdayCalendar(true)}
                    className="px-4 py-2 rounded-full bg-emerald-500/20 border border-emerald-500/50 hover:bg-emerald-500/30 transition-all text-xs font-bold flex items-center gap-2"
                  >
                    <Calendar size={12} />
                    Birthday Calendar
                  </button>
                </div>
             </div>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-6">
                {loading ? (
                  [1,2,3,4,5,6,7,8].map(i => <div key={`chara-skeleton-${i}`} className="aspect-[3/4] bg-white/5 rounded-2xl animate-pulse" />)
                ) : (
                  characters.map((uma, cIdx) => (
                    <motion.div 
                      key={`chara-${uma.id || 'new'}-${cIdx}`}
                      whileHover={{ scale: 1.1, y: -5, zIndex: 10 }}
                      className="group relative cursor-pointer"
                      onClick={() => window.open(`https://umapyoi.net/character/${uma.preferred_url || uma.id}`, '_blank')}
                    >
                      {/* Tooltip */}
                      <div className="absolute -top-24 left-1/2 -translate-x-1/2 bg-black/95 text-white px-4 py-3 rounded-xl text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 border border-white/10 shadow-2xl flex flex-col gap-1.5 min-w-[160px]">
                        <div className="font-bold text-sm text-emerald-400 border-b border-white/10 pb-1.5 mb-0.5">{uma.name_jp}</div>
                        <div className="flex justify-between gap-4">
                          <span className="text-white/50">Birthday:</span>
                          <span className="font-mono">{uma.birth_month ? `${uma.birth_month}/${uma.birth_day}` : 'Unknown'}</span>
                        </div>
                        <div className="flex justify-between gap-4">
                          <span className="text-white/50">Status:</span>
                          <span className="font-mono text-emerald-400">Alive</span>
                        </div>
                        <div className="flex justify-between gap-4">
                          <span className="text-white/50">Trainer:</span>
                          <span className="font-mono text-blue-400">Official Trainer</span>
                        </div>
                      </div>
                      
                      {/* Card Content */}
                      <div className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-white/10 bg-black/40">
                        <img 
                          src={uma.thumb_img || (uma.sns_icon?.startsWith('http') ? uma.sns_icon : `https://umapyoi.net${uma.sns_icon || ''}`)} 
                          className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-500"
                          onError={(e) => (e.currentTarget.src = `https://picsum.photos/seed/${uma.name_en}/400/600`)}
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                        <div className="absolute bottom-0 left-0 p-4 w-full">
                          {uma.birth_month && uma.birth_day && (
                            <p className="text-[10px] text-emerald-400 font-black uppercase tracking-tighter mb-1">
                              {uma.birth_month}/{uma.birth_day}
                            </p>
                          )}
                          <h4 className="font-bold text-sm tracking-tight truncate">{uma.name_en}</h4>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
          </div>
        )}

        {/* Videos View */}
        {activeTab === 'videos' && (
          <div className="space-y-8">
             <div className="flex items-center justify-between mb-8">
               <h3 className="text-lg font-bold uppercase tracking-widest text-white/30 flex items-center gap-3">
                  <Video size={18} className="text-emerald-400" />
                  Video Archives
                </h3>
                <button 
                  onClick={() => window.open('https://umapyoi.net/videos', '_blank')}
                  className="px-6 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-emerald-500/20 hover:border-emerald-500/50 transition-all text-sm font-bold flex items-center gap-2"
                >
                  <ExternalLink size={14} />
                  Visit Umapyoi Videos
                </button>
             </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {videos.map((video, vIdx) => (
                  <motion.div 
                    key={`video-${vIdx}`}
                    whileHover={{ y: -5 }}
                    className="group relative overflow-hidden rounded-2xl border border-white/10 bg-black/40 flex flex-col"
                  >
                    <div className="aspect-video w-full bg-black relative">
                      <iframe 
                        className="w-full h-full" 
                        src={`https://www.youtube.com/embed/${video.id}`} 
                        title={video.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowFullScreen
                      ></iframe>
                    </div>
                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        <p className="text-[10px] text-emerald-400 font-black uppercase tracking-tighter mb-1">
                          {video.category}
                        </p>
                        <h4 
                          className="font-bold text-sm tracking-tight line-clamp-2 cursor-pointer hover:underline hover:text-emerald-400 transition-colors"
                          onClick={() => window.open(`https://www.youtube.com/watch?v=${video.id}`, '_blank')}
                        >
                          {video.title}
                        </h4>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
          </div>
        )}

        {/* Music View */}
        {activeTab === 'music' && (
          <div className="space-y-8">
             <div className="flex items-center justify-between mb-8">
               <h3 className="text-lg font-bold uppercase tracking-widest text-white/30 flex items-center gap-3">
                  <Music size={18} className="text-emerald-400" />
                  Music Library
                </h3>
                {currentTrack && (
                  <div className="flex items-center gap-4 bg-white/5 px-4 py-2 rounded-full border border-white/10">
                    <span className="text-xs text-emerald-400 font-bold truncate max-w-[200px]" title={currentTrack.name_en}>{currentTrack.name_en}</span>
                    <button onClick={(e) => { e.stopPropagation(); togglePlay(); }} className="text-white hover:text-emerald-400 transition-colors">
                      {isPlaying ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" />}
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); stopMusic(); }} className="text-white hover:text-red-400 transition-colors">
                      <Square size={16} fill="currentColor" />
                    </button>
                  </div>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {loading ? (
                  [1,2,3,4,5,6,7,8].map(i => <div key={`music-skeleton-${i}`} className="h-48 bg-white/5 rounded-2xl animate-pulse" />)
                ) : (
                  albums.map((album, aIdx) => (
                    <motion.div 
                      key={`album-${album.id || 'new'}-${aIdx}`}
                      whileHover={{ y: -5 }}
                      className="group relative overflow-hidden rounded-2xl border border-white/10 bg-black/40 p-4 flex gap-4 cursor-pointer"
                      onClick={() => playAlbum(album.id)}
                    >
                      <div className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden border border-white/10 bg-black/60">
                        <img 
                          src={album.album_art || "https://picsum.photos/seed/headphones/200/200"} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          alt="Music Thumbnail"
                          onError={(e) => (e.currentTarget.src = 'https://picsum.photos/seed/headphones/200/200')}
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="flex-1 min-w-0 flex flex-col justify-center">
                        <h4 className="font-bold text-white/80 group-hover:text-emerald-400 transition-colors truncate" title={album.name_en}>{album.name_en}</h4>
                        <p className="text-xs text-white/30 truncate mb-2" title={album.name_jp}>{album.name_jp}</p>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-white/20 font-mono uppercase tracking-widest">{album.release_date}</span>
                        </div>
                      </div>
                      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Play size={16} className="text-emerald-400" fill="currentColor" />
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
          </div>
        )}

        {/* News View */}
        {activeTab === 'news' && (
          <div className="space-y-8">
             <h3 className="text-lg font-bold uppercase tracking-widest text-white/30 mb-8 flex items-center gap-3">
                <Newspaper size={18} className="text-emerald-400" />
                Intelligence Feed
              </h3>
              <div className="grid grid-cols-1 gap-4">
                {loading ? (
                  [1,2,3,4,5].map(i => <div key={`news-skeleton-${i}`} className="h-24 bg-white/5 rounded-2xl animate-pulse" />)
                ) : (
                  news.map((item, nIdx) => (
                    <motion.div 
                      key={`news-tab-${item.announce_id || 'new'}-${nIdx}`}
                      whileHover={{ x: 10 }}
                      className="p-6 rounded-2xl border border-white/10 bg-black/40 flex items-center justify-between group cursor-pointer"
                      onClick={() => window.open(`https://umapyoi.net/news/${item.announce_id}`, '_blank')}
                    >
                      <div className="flex items-center gap-6">
                        <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors">
                          <Newspaper size={20} className="text-white/30 group-hover:text-emerald-400" />
                        </div>
                        <div>
                          <h4 className="font-bold text-lg text-white/80 group-hover:text-white transition-colors">{item.title_english || item.title}</h4>
                          <p className="text-xs text-white/30 font-mono uppercase tracking-widest">
                            {new Date(item.post_at * 1000).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <ExternalLink size={20} className="text-white/10 group-hover:text-emerald-400 transition-colors" />
                    </motion.div>
                  ))
                )}
              </div>
          </div>
        )}

        {/* Placeholder for other tabs */}
        {(activeTab === 'other') && (
          <div className="flex flex-col items-center justify-center py-32 space-y-6">
            <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
              <Sparkles className="text-emerald-500/50 animate-pulse" size={48} />
            </div>
            <h3 className="text-2xl font-bold italic tracking-tight">Section Under Maintenance</h3>
            <p className="text-white/40 text-sm max-w-md text-center">
              Our engineers are currently synchronizing the data streams for this sector. Please check back later, Trainer.
            </p>
            <button 
              onClick={() => setActiveTab('dashboard')}
              className="px-8 py-3 rounded-full bg-emerald-500 text-black font-bold hover:scale-105 transition-transform"
            >
              Return to Dashboard
            </button>
          </div>
        )}
      </main>

      {/* Bottom Status Bar */}
      <footer className="fixed bottom-0 left-0 w-full h-12 bg-black/80 backdrop-blur-md border-t border-white/5 z-40 flex items-center justify-between px-8 text-[10px] font-mono text-white/30 uppercase tracking-widest">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Server: JP-EAST-01</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            <span>API: v1.2.4-stable</span>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <span>Latency: 24ms</span>
          <span>Uptime: 99.9%</span>
          <span className="text-emerald-500/50">© 2026 UmaStation Intelligence</span>
        </div>
      </footer>
        {/* Birthday Calendar Modal */}
        <AnimatePresence>
          {showBirthdayCalendar && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
              onClick={() => setShowBirthdayCalendar(false)}
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                className="w-full max-w-2xl max-h-[80vh] overflow-y-auto bg-black/90 border border-white/10 rounded-2xl p-8"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-emerald-400 flex items-center gap-3">
                    <Calendar /> Birthday Calendar
                  </h2>
                  <button onClick={() => setShowBirthdayCalendar(false)} className="text-white/50 hover:text-white">
                    <X />
                  </button>
                </div>
                <div className="space-y-6">
                  {characters.length === 0 && <p className="text-white/30 text-center">Loading character data...</p>}
                  {characters.length > 0 && !characters.some(c => c.birth_month) && <p className="text-white/30 text-center">No birthday data available in loaded characters.</p>}
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => {
                    const monthCharacters = characters
                      .filter(c => c.birth_month === month && c.birth_day)
                      .sort((a, b) => a.birth_day! - b.birth_day!);
                    
                    if (monthCharacters.length === 0) return null;

                    return (
                      <div key={month}>
                        <h3 className="text-sm font-bold text-white/50 uppercase tracking-widest mb-3">
                          {new Date(0, month - 1).toLocaleString('default', { month: 'long' })}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                          {monthCharacters.map((uma) => (
                            <div 
                              key={uma.id} 
                              className="p-2 rounded-lg bg-white/5 border border-white/10 flex items-center gap-3 cursor-help hover:bg-emerald-900/20 transition-colors"
                              title={`Official Birthday: ${uma.birth_month}/${uma.birth_day}`}
                            >
                              <div className="text-xs font-mono text-emerald-400 w-8 text-center font-bold bg-black/40 rounded px-1">
                                {uma.birth_day}
                              </div>
                              <div className="text-xs truncate">{uma.name_en}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
    </div>
  );
}
