import { X, LogIn, UserPlus } from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginWithGoogle, signupWithEmail, loginWithEmail } from '../../lib/firebase';

type LoginMode = 'ask' | 'login' | 'signup';

export function AppLogin() {
  const [mode, setMode] = useState<LoginMode>('ask');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');

  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (!id || !password) {
        throw new Error('아이디와 비밀번호를 입력해주세요.');
      }
      await loginWithEmail(id, password);
      // Auth change listener will handle navigation
    } catch (err: any) {
      setError(err.message || '로그인 중 오류가 발생했습니다.');
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (!id || !password) {
        throw new Error('아이디와 비밀번호를 입력해주세요.');
      }
      if (password !== passwordConfirm) {
        throw new Error('비밀번호가 일치하지 않습니다.');
      }
      await signupWithEmail(id, password);
      // Auth change listener will handle navigation
    } catch (err: any) {
      setError(err.message || '회원가입 중 오류가 발생했습니다.');
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      await loginWithGoogle();
    } catch (err: any) {
      setError(err.message || '로그인 중 오류가 발생했습니다.');
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-black text-white px-6 font-sans relative overflow-y-auto">
      <button 
        onClick={() => {
          if (mode === 'ask') navigate('/');
          else setMode('ask');
        }}
        className="absolute top-6 right-6 p-2 bg-zinc-900 rounded-full hover:bg-zinc-800 transition-colors z-50"
      >
        <X className="w-5 h-5 text-zinc-400" />
      </button>

      <div className="flex-1 flex flex-col items-center justify-center py-20">
        <div className="mb-12 relative">
          <div className="w-32 h-32 bg-cyan-400/20 rounded-full blur-[40px] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
          <h1 className="text-6xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-br from-cyan-400 to-blue-500 relative z-10 text-center leading-tight">
            403<br/>BY<br/>PASS
          </h1>
        </div>
        
        {mode === 'ask' && (
          <div className="w-full flex flex-col justify-center max-w-sm mx-auto">
            <h2 className="text-xl font-bold text-center mb-8">403 BYPASS 계정이 있으신가요?</h2>
            <div className="space-y-4">
              <button 
                onClick={() => setMode('login')}
                className="w-full bg-white text-black font-black py-4 rounded-xl flex justify-center items-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <LogIn className="w-5 h-5" />
                네, 계정이 있습니다
              </button>
              <button 
                onClick={() => setMode('signup')}
                className="w-full bg-zinc-800 text-white font-black py-4 rounded-xl flex justify-center items-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <UserPlus className="w-5 h-5" />
                아니요, 새로 만들게요
              </button>
              
              <div className="flex items-center gap-4 py-2">
                <div className="flex-1 h-px bg-zinc-800"></div>
                <span className="text-[10px] text-zinc-600 font-bold uppercase tracking-wider">또는</span>
                <div className="flex-1 h-px bg-zinc-800"></div>
              </div>

              <button 
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full bg-zinc-900 text-white font-bold py-4 rounded-xl flex justify-center items-center gap-3 hover:bg-zinc-800 transition-all disabled:opacity-50"
              >
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
                구글 계정으로 로그인
              </button>
            </div>
          </div>
        )}

        {mode === 'login' && (
          <form onSubmit={handleLogin} className="w-full max-w-sm mx-auto flex flex-col gap-4">
             <h2 className="text-xl font-bold text-center mb-4">로그인</h2>
             {error && (
               <div className="p-3 bg-red-900/40 border border-red-500/50 text-red-300 rounded-xl text-[10px] font-medium w-full text-center">
                 {error}
               </div>
             )}
             <input 
                type="text" 
                placeholder="아이디" 
                value={id}
                onChange={e => setId(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors"
                autoFocus
              />
              <input 
                type="password" 
                placeholder="비밀번호" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors"
              />
              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-cyan-500 text-black font-black py-4 rounded-xl mt-4 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
              >
                {loading ? '로그인 중...' : '로그인'}
              </button>
          </form>
        )}

        {mode === 'signup' && (
          <form onSubmit={handleSignup} className="w-full max-w-sm mx-auto flex flex-col gap-4">
             <h2 className="text-xl font-bold text-center mb-4">회원가입</h2>
             {error && (
               <div className="p-3 bg-red-900/40 border border-red-500/50 text-red-300 rounded-xl text-[10px] font-medium w-full text-center">
                 {error}
               </div>
             )}
             <input 
                type="text" 
                placeholder="새 아이디" 
                value={id}
                onChange={e => setId(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors"
                autoFocus
              />
              <input 
                type="password" 
                placeholder="비밀번호" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors"
              />
              <input 
                type="password" 
                placeholder="비밀번호 확인" 
                value={passwordConfirm}
                onChange={e => setPasswordConfirm(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors"
              />
              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-cyan-500 text-black font-black py-4 rounded-xl mt-4 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
              >
                {loading ? '만들기...' : '계정 만들기'}
              </button>
          </form>
        )}
      </div>

      <div className="py-8 text-center text-[10px] text-zinc-600 font-medium">
        계정 생성 및 로그인 시 서비스 이용약관 및 개인정보처리방침에 동의하게 됩니다.
      </div>
    </div>
  );
}

