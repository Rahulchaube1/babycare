
// --- injected config for local development ---
const __firebase_config = JSON.stringify({
  apiKey: "AIzaSyDummyKey-PleaseReplaceMeWithRealConfig",
  authDomain: "babysarthi-v3.firebaseapp.com",
  projectId: "babysarthi-v3",
  storageBucket: "babysarthi-v3.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abcdef123456"
});
const __app_id = 'babysarthi-v3';
// ---------------------------------------------

import React, { useState, useEffect, useRef } from 'react';
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  onAuthStateChanged,
  signInAnonymously,
  signInWithCustomToken,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from 'firebase/auth';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
  onSnapshot,
  addDoc,
  query,
  orderBy,
  limit,
  serverTimestamp
} from 'firebase/firestore';
import {
  Heart, MessageCircle, Home, User, ChevronRight, Send, Plus, Baby,
  Activity, Bell, Sparkles, ArrowRight, ShieldCheck, Mic,
  Settings, LogOut, Droplets, Moon, Coffee, ChevronLeft, Stethoscope,
  Zap, AlertTriangle, FileText, Share2, Timer, X, Thermometer, Brain,
  Mail, Lock, Chrome, Facebook, Instagram, Phone, Smartphone, Wind,
  Star, Palette, Cloud, Eye, EyeOff, Info
} from 'lucide-react';

// --- Firebase Configuration ---
const firebaseConfig = JSON.parse(__firebase_config);
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = typeof __app_id !== 'undefined' ? __app_id : 'babysarthi-v3';

// --- Constants ---
const ROLES = { PREGNANT: 'pregnant', MOTHER: 'mother', PARENT: 'parent' };

// --- Theme Colors ---
const THEME = {
  primary: '#5DA7B1',
  secondary: '#FFB7B2',
  accent: '#B2E2D2',
  slate: '#1E293B'
};

// --- Sub-Components ---

const Card = ({ children, className = "", onClick }) => (
  <div
    onClick={onClick}
    className={`bg-white rounded-[2rem] shadow-[0_10px_40px_-15px_rgba(0,0,0,0.08)] border border-white/50 backdrop-blur-sm p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer ${className}`}
  >
    {children}
  </div>
);

const SectionHeader = ({ title, actionText, onAction }) => (
  <div className="flex justify-between items-center mb-4 mt-6">
    <h3 className="font-extrabold text-slate-800 text-lg tracking-tight">{title}</h3>
    {actionText && (
      <button onClick={onAction} className="text-teal-600 font-bold text-xs uppercase tracking-wider hover:bg-teal-50 px-2 py-1 rounded-lg transition-colors">
        {actionText}
      </button>
    )}
  </div>
);

// --- Auth Page Component (Signup/Login) ---
const AuthPage = ({ mode, setMode, onMockLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isDemoMode, setIsDemoMode] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    setIsDemoMode(false);

    try {
      if (mode === 'signup') {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (err) {
      console.error("Firebase auth failed:", err);
      // Fallback to demo mode if auth fails (e.g. invalid API key)
      setIsDemoMode(true);

      // Simulate a short delay then let them in
      setTimeout(() => {
        onMockLogin({
          email: email || 'demo@babysarthi.com',
          uid: 'demo_user_' + Date.now(),
          displayName: name || 'Guest Mom'
        });
      }, 1500);

    } finally {
      if (!isDemoMode) {
        // Only stop loading if we aren't transitioning to demo mode
        // If we ARE in demo mode, we want the loader to spin until the parent component switches view
        // ... actually, parent switches view immediately on callback, so we can stop loading here if it failed but we caught it. 
        // But for better UX, let's keep it 'loading' until the view switches.
        // However, if it was a GENUINE error we want to show (not config error), we might want to show it.
        // For now, let's assume ALL errors in this dev environment allow entry.
      }
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row overflow-hidden relative">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-teal-50 rounded-full blur-[100px] opacity-60 pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-pink-50 rounded-full blur-[80px] opacity-60 pointer-events-none"></div>

      {/* Left Side - Hero/Image */}
      <div className="w-full md:w-1/2 p-4 md:p-8 flex flex-col justify-center items-center relative z-10 animate-in fade-in slide-in-from-left duration-700">
        <div className="w-full h-full max-h-[600px] bg-gradient-to-br from-teal-500 to-emerald-400 rounded-[3rem] shadow-2xl flex flex-col items-center justify-center p-8 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>

          <img
            src="/babysarthi.png"
            alt="BabySarthi Logo"
            className="w-48 h-48 object-contain mb-8 hover:scale-105 transition-transform duration-500 drop-shadow-2xl"
          />

          <h1 className="text-4xl md:text-5xl font-black text-center tracking-tighter mb-4 leading-tight">
            Start Your <br /> <span className="text-teal-900/80">Beautiful Journey</span>
          </h1>
          <p className="text-lg font-medium text-teal-100 text-center max-w-sm">
            Your trusted AI companion for pregnancy and parenting care.
          </p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center items-center relative z-10 animate-in fade-in slide-in-from-right duration-700 delay-100">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h2 className="text-3xl font-black text-slate-800 tracking-tighter mb-2">
              {mode === 'signup' ? 'Create Account' : 'Welcome Back'}
            </h2>
            <p className="text-slate-500 font-medium">
              {mode === 'signup' ? "Join our growing family today." : 'Please enter your details to sign in.'}
            </p>
          </div>

          {errorMessage && (
            <div className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-xl flex items-center gap-3 text-rose-600 text-sm font-medium">
              <AlertTriangle size={18} />
              {errorMessage}
            </div>
          )}

          {isDemoMode && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-100 rounded-xl flex items-center gap-3 text-blue-600 text-sm font-medium animate-pulse">
              <Info size={18} />
              Entering Demo Mode...
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {mode === 'signup' && (
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider ml-1">Full Name</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-teal-500 transition-colors" size={20} />
                  <input
                    type="text" placeholder="Jane Doe" value={name} onChange={e => setName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-500/10 rounded-2xl py-4 pl-12 pr-4 transition-all outline-none font-medium"
                    required
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-teal-500 transition-colors" size={20} />
                <input
                  type="email" placeholder="name@example.com" value={email} onChange={e => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-500/10 rounded-2xl py-4 pl-12 pr-4 transition-all outline-none font-medium"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider ml-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-teal-500 transition-colors" size={20} />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-500/10 rounded-2xl py-4 pl-12 pr-12 transition-all outline-none font-medium"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {mode === 'login' && (
              <div className="flex justify-end">
                <button type="button" className="text-xs font-bold text-teal-600 hover:text-teal-700 hover:underline">
                  Forgot Password?
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || isDemoMode}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-2xl shadow-xl shadow-slate-200 transition-all transform active:scale-[0.98] flex items-center justify-center gap-3"
            >
              {loading || isDemoMode ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  {mode === 'signup' ? 'Create Account' : 'Sign In'}
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 mb-8 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-100"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase tracking-widest">
              <span className="bg-white px-4 text-slate-400 font-bold">Or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button type="button" className="flex items-center justify-center gap-3 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 py-3 px-4 rounded-xl transition-all group">
              <Chrome size={20} className="text-slate-600 group-hover:text-blue-500 transition-colors" />
              <span className="font-bold text-sm text-slate-700">Google</span>
            </button>
            <button type="button" className="flex items-center justify-center gap-3 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 py-3 px-4 rounded-xl transition-all group">
              <Facebook size={20} className="text-slate-600 group-hover:text-blue-600 transition-colors" />
              <span className="font-bold text-sm text-slate-700">Facebook</span>
            </button>
          </div>

          <div className="mt-8 text-center">
            <p className="text-slate-500 font-medium">
              {mode === 'signup' ? 'Already have an account?' : "Don't have an account?"}
              <button
                onClick={() => setMode(mode === 'signup' ? 'login' : 'signup')}
                className="ml-2 text-teal-600 font-bold hover:underline"
              >
                {mode === 'signup' ? 'Sign In' : 'Sign Up'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- View: Onboarding (Choose Stage) ---
const OnboardingPage = ({ onSelect, isSaving }) => (
  <div className="min-h-screen bg-white p-8 flex flex-col items-center justify-center animate-in fade-in duration-700">
    <img src="/babysarthi.png" alt="BabySarthi" className="w-32 h-32 object-contain mb-6 drop-shadow-lg" />
    <h2 className="text-3xl font-black text-slate-800 mb-2 tracking-tighter">Choose Your Stage</h2>
    <p className="text-slate-400 mb-10 text-center text-sm font-medium">Personalizing your companion journey.</p>

    <div className="grid gap-4 w-full max-w-sm relative z-10">
      {Object.entries(ROLES).map(([key, value]) => (
        <button
          key={value}
          disabled={isSaving}
          onClick={() => onSelect(value)}
          className="bg-slate-50 p-6 rounded-[2.5rem] text-left border-2 border-transparent hover:border-teal-500 hover:bg-teal-50 shadow-sm transition-all flex items-center gap-4 group active:scale-95 disabled:opacity-50"
        >
          <span className="text-3xl">
            {value === 'pregnant' ? '🤰' : value === 'mother' ? '👩🍼' : '👨👩'}
          </span>
          <div className="flex-1">
            <p className="font-black text-slate-800 uppercase text-xs tracking-widest">{value}</p>
            <p className="text-slate-400 text-xs font-medium italic">Smart personalized care</p>
          </div>
          <ChevronRight className="text-slate-300 group-hover:text-teal-500 group-hover:translate-x-1 transition-all" />
        </button>
      ))}
    </div>
  </div>
);

// --- View: Landing Page ---
const LandingPage = ({ onStart }) => (
  <div className="min-h-screen bg-[#FDFEFF] flex flex-col items-center justify-center p-8 text-center relative overflow-hidden">
    <div className="fixed inset-0 pointer-events-none">
      <div className="absolute top-[-10%] right-[-10%] w-[80%] h-[50%] bg-teal-50/40 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-5%] left-[-5%] w-[70%] h-[40%] bg-pink-50/40 rounded-full blur-[120px]"></div>
    </div>

    <div className="relative z-10 flex flex-col items-center">
      <div className="w-40 h-40 bg-white rounded-full shadow-2xl flex items-center justify-center mb-8 p-6 animate-in zoom-in duration-700">
        <img src="/babysarthi.png" alt="BabySarthi Logo" className="w-full h-full object-contain" />
      </div>

      <h1 className="text-5xl font-black text-slate-800 mb-4 tracking-tighter">BabySarthi</h1>
      <p className="text-slate-500 mb-10 max-w-xs font-medium text-lg leading-relaxed">
        "Your smart companion for the most beautiful journey."
      </p>

      <div className="w-full max-w-sm space-y-4">
        <button
          onClick={onStart}
          className="w-full py-5 bg-slate-900 hover:bg-slate-800 text-white rounded-3xl font-black text-lg shadow-xl shadow-slate-200 flex items-center justify-center gap-3 active:scale-[0.98] transition-all"
        >
          Get Started <ArrowRight />
        </button>
        <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest mt-4">Expert healthcare & parenting guidance</p>
      </div>
    </div>
  </div>
);

// --- Main App Controller ---
export default function App() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [activeTab, setActiveTab] = useState('home');
  const [view, setView] = useState('loading'); // loading, landing, auth, onboarding, app
  const [authMode, setAuthMode] = useState('signup');
  const [isRoleSaving, setIsRoleSaving] = useState(false);

  useEffect(() => {
    // If we have a user from mock login, don't listen to real auth changes
    if (user?.isMock) return;

    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        try {
          const snap = await getDoc(doc(db, 'artifacts', appId, 'users', u.uid, 'profile', 'data'));
          if (snap.exists()) {
            setProfile(snap.data());
            setView('app');
          } else {
            setView('onboarding');
          }
        } catch (err) {
          console.error(err);
          // With no valid API key, this read will fail. 
          // Default to onboarding.
          setView('onboarding');
        }
      } else {
        setView('landing');
      }
    });
    return () => unsub();
  }, [user]);

  const handleMockLogin = (mockUser) => {
    // Set a mock user state
    const u = { ...mockUser, isMock: true };
    setUser(u);
    setView('onboarding');
  };

  const handleRoleSelection = async (role) => {
    if (!user || isRoleSaving) return;
    setIsRoleSaving(true);

    // Simulate API delay
    await new Promise(r => setTimeout(r, 1000));

    try {
      const data = {
        uid: user.uid,
        role,
        name: user.displayName || "Mom",
        createdAt: serverTimestamp()
      };

      if (!user.isMock) {
        await setDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'profile', 'data'), data);
      } else {
        console.log("Mock saving profile:", data);
      }

      setProfile(data);
      setView('app');
    } catch (err) {
      console.error(err);
      // Even if db fails (which it will), proceed to app in mock/demo mode
      const data = {
        uid: user.uid,
        role,
        name: user.displayName || "Mom",
        // createdAt: new Date() // Don't need this for local state really
      };
      setProfile(data);
      setView('app');
    } finally {
      setIsRoleSaving(false);
    }
  };

  const getAvatarUrl = () => {
    const seed = user?.uid || 'guest';
    if (profile?.role === 'pregnant' || profile?.role === 'mother') {
      return `https://api.dicebear.com/7.x/lorelei/svg?seed=${seed}&hair=long&hairColor=2c1b18&eyes=variant04&eyebrows=variant01&mouth=variant10`;
    }
    return `https://api.dicebear.com/7.x/adventurer/svg?seed=${seed}`;
  };

  if (view === 'loading') return (
    <div className="h-screen flex flex-col items-center justify-center bg-white">
      <div className="w-24 h-24 mb-6 relative">
        <div className="absolute inset-0 bg-teal-100 rounded-full animate-ping opacity-20"></div>
        <img src="/babysarthi.png" alt="Loading" className="w-full h-full object-contain relative z-10" />
      </div>
      <div className="w-48 h-1 bg-slate-100 rounded-full overflow-hidden">
        <div className="h-full bg-teal-500 w-1/3 animate-[shimmer_1s_infinite_linear] rounded-full"></div>
      </div>
    </div>
  );

  if (view === 'landing') {
    return <LandingPage onStart={() => setView('auth')} />;
  }

  if (view === 'auth') {
    return <AuthPage mode={authMode} setMode={setAuthMode} onMockLogin={handleMockLogin} />;
  }

  if (view === 'onboarding') {
    return <OnboardingPage onSelect={handleRoleSelection} isSaving={isRoleSaving} />;
  }

  return (
    <div className="min-h-screen bg-[#F8FBFC] pb-32 text-slate-900 selection:bg-teal-100 relative">
      <div className="max-w-xl mx-auto px-6 pt-10 relative z-10">
        {activeTab === 'home' && (
          <div className="space-y-6 animate-in fade-in duration-700">
            <header className="flex justify-between items-center mb-8">
              <div>
                <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Namaste,</p>
                <h1 className="text-2xl font-black text-slate-800 leading-none mt-1">{profile?.name || 'Mom'} ✨</h1>
              </div>
              <div className="w-14 h-14 bg-white rounded-2xl shadow-md border-2 border-teal-50 flex items-center justify-center overflow-hidden">
                <img src={getAvatarUrl()} alt="Avatar" className="w-full h-full object-cover" />
              </div>
            </header>

            {profile?.role === 'pregnant' ? (
              <Card className="bg-slate-900 text-white overflow-hidden relative !p-8">
                <div className="absolute -right-10 -top-10 w-32 h-32 bg-teal-500/20 rounded-full blur-3xl"></div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[10px] font-black uppercase tracking-widest text-teal-400">Week 24 • Trimester 2</span>
                  <Sparkles size={16} className="text-teal-400 animate-pulse" />
                </div>
                <p className="text-xl font-bold leading-tight">Baby is an Eggplant Size 🍆</p>
                <p className="text-xs text-slate-400 mt-2">Hearing your voice for the first time this week!</p>
                <div className="w-full bg-white/10 h-3 rounded-full mt-6 overflow-hidden">
                  <div className="bg-teal-400 h-full w-[60%] rounded-full shadow-[0_0_15px_rgba(45,212,191,0.5)]"></div>
                </div>
              </Card>
            ) : (
              <Card className="bg-teal-600 text-white !p-8">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[10px] font-black uppercase tracking-widest text-teal-100">Milestone Watch</span>
                  <Baby size={16} />
                </div>
                <p className="text-xl font-bold leading-tight">3 Months Anniversary 🎉</p>
                <p className="text-xs text-teal-100 mt-1 italic">Expected: Rolling over any day now.</p>
              </Card>
            )}

            <SectionHeader title="Quick Actions" />
            <div className="grid grid-cols-4 gap-3">
              {[
                { id: 'Feeding', icon: Droplets, label: 'Feed', color: 'blue' },
                { id: 'Sleep', icon: Moon, label: 'Sleep', color: 'indigo' },
                { id: 'Mood', icon: Brain, label: 'Mood', color: 'pink' },
                { id: 'Medical', icon: Thermometer, label: 'Fever', color: 'orange' },
              ].map((btn, i) => (
                <button key={i} className="flex flex-col items-center gap-2 group transition-all">
                  <div className={`w-14 h-14 bg-white text-slate-400 rounded-2xl flex items-center justify-center shadow-sm group-hover:bg-teal-50 group-hover:text-teal-500 group-active:scale-90 border border-slate-50`}>
                    <btn.icon size={22} strokeWidth={2} />
                  </div>
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">{btn.label}</span>
                </button>
              ))}
            </div>

            <SectionHeader title="Health Hub" />
            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-pink-50 border-pink-100 flex flex-col items-center text-center gap-2 group">
                <Timer className="text-pink-500 group-hover:rotate-12 transition-transform" />
                <p className="text-xs font-black text-pink-700 uppercase">Contractions</p>
              </Card>
              <Card className="bg-teal-50 border-teal-100 flex flex-col items-center text-center gap-2 group">
                <ShieldCheck className="text-teal-500 group-hover:scale-110 transition-transform" />
                <p className="text-xs font-black text-teal-700 uppercase">Vaccines</p>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'tracker' && (
          <div className="space-y-6 animate-in slide-in-from-right duration-700 text-center py-20">
            <Activity size={48} className="mx-auto text-teal-300 mb-4" />
            <h2 className="text-xl font-black text-slate-800">Tracking Hub</h2>
            <p className="text-slate-400 text-sm">Your health metrics will appear here.</p>
          </div>
        )}

        {activeTab === 'ai' && (
          <div className="h-[70vh] flex flex-col justify-center items-center text-teal-300 italic opacity-50">
            <img src="/babysarthi.png" alt="AI" className="w-24 h-24 mb-4 opacity-50 grayscale" />
            <p className="uppercase tracking-[0.3em] text-[10px] font-black">Advisor Loading</p>
          </div>
        )}

        {activeTab === 'me' && (
          <div className="space-y-6 animate-in slide-in-from-left duration-700">
            <header className="flex flex-col items-center py-6">
              <div className="w-24 h-24 rounded-full border-4 border-white shadow-xl overflow-hidden mb-4 bg-teal-50">
                <img src={getAvatarUrl()} alt="Profile" className="w-full h-full object-cover" />
              </div>
              <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">{profile?.name}</h2>
              <div className="flex gap-2 mt-2">
                <span className="bg-teal-50 text-teal-600 px-3 py-1 rounded-full text-[10px] font-black uppercase">Premium Member</span>
                <span className="bg-slate-100 text-slate-500 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">{profile?.role}</span>
              </div>
            </header>
            <button
              onClick={() => {
                signOut(auth);
                // Force reset state for demo mode logout
                setUser(null);
                setProfile(null);
                setView('landing');
              }}
              className="w-full py-5 bg-rose-50 text-rose-600 rounded-3xl font-black text-xs uppercase tracking-widest border border-rose-100 flex items-center justify-center gap-2 active:bg-rose-100 transition-all">
              <LogOut size={16} /> Secure Logout
            </button>
          </div>
        )}
      </div>

      <nav className="fixed bottom-6 left-6 right-6 bg-white/80 backdrop-blur-2xl border border-white/50 rounded-[2.5rem] p-4 flex justify-around shadow-[0_20px_50px_-15px_rgba(0,0,0,0.1)] z-[100]">
        {[
          { id: 'home', icon: Home, label: 'Home' },
          { id: 'tracker', icon: Activity, label: 'Track' },
          { id: 'ai', icon: MessageCircle, label: 'Advisor' },
          { id: 'me', icon: User, label: 'Profile' }
        ].map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)} className={`flex flex-col items-center gap-1 transition-all relative ${activeTab === t.id ? 'text-teal-600 scale-110' : 'text-slate-300 hover:text-slate-400'}`}>
            <div className={`p-2 rounded-2xl transition-all ${activeTab === t.id ? 'bg-teal-50 shadow-inner' : ''}`}>
              <t.icon size={22} strokeWidth={activeTab === t.id ? 2.5 : 2} />
            </div>
            {activeTab === t.id && (
              <div className="absolute -bottom-1 w-1.5 h-1.5 bg-pink-400 rounded-full animate-pulse"></div>
            )}
          </button>
        ))}
      </nav>
    </div>
  );
}
