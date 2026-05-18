import { Search, MapPin, Eye, AudioLines, Subtitles, ChevronRight, Bookmark, Volume2, VolumeX, HelpCircle, Navigation, Mic, MicOff } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { cn } from '../../lib/utils';
import { BottomSheet } from '../../components/ui/BottomSheet';
import { useProfile } from '../../lib/profile-context';

import { SHOWS } from '../../lib/show-data';

export function AppHome() {
  const navigate = useNavigate();
  const { profile } = useProfile();
  
  const [activeTag, setActiveTag] = useState('전체');
  
  // Set initial filters
  const [filterMapPin, setFilterMapPin] = useState(false);
  const [filterSubtitles, setFilterSubtitles] = useState(false);
  const [filterAudio, setFilterAudio] = useState(false);
  const [filterSignLanguage, setFilterSignLanguage] = useState(false);

  const [filterVR, setFilterVR] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOverlayOpen, setIsSearchOverlayOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [recentSearches, setRecentSearches] = useState(['오페라', '지킬앤하이드', '뮤지컬']);
  const [helpOpen, setHelpOpen] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(false);
  
  const [currentLocation, setCurrentLocation] = useState('강원도 춘천시 한림대학길 1');
  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const [locationSearchKeyword, setLocationSearchKeyword] = useState('');

  useEffect(() => {
    // Simulate location fetch if no override
    if (currentLocation === '강원도 춘천시 한림대학길 1' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
           // Provide a realistic sounding mockup for the prototype
           setTimeout(() => setCurrentLocation('서울특별시 강남구 테헤란로'), 1500);
        },
        (err) => {}, // Keep default
        { enableHighAccuracy: true }
      );
    }
  }, []);

  const handleLocationSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (locationSearchKeyword.trim()) {
      setCurrentLocation(locationSearchKeyword.trim());
      setLocationModalOpen(false);
      speak(`${locationSearchKeyword}로 위치를 변경했습니다.`);
    }
  };

  const recommendedShows = useMemo(() => {
    if (!profile?.preferences) return [];
    
    const userGenres = profile.preferences.genres || [];
    const userAcc = profile.preferences.accessibility || [];
    
    return SHOWS.map(show => {
      let score = 0;
      // Bonus for genre match
      if (userGenres.includes(show.type)) score += 2;
      
      // Bonus for accessibility matches
      const hasWheelchair = show.badges.includes('휠체어') && userAcc.includes('휠체어 접근성');
      const hasSubtitles = show.badges.includes('자막') && userAcc.includes('자막 제공');
      const hasSign = show.badges.includes('수어') && userAcc.includes('수어 통역');
      const hasAudio = show.badges.includes('음성해설') && userAcc.includes('음성 해설');
      
      if (hasWheelchair) score += 3;
      if (hasSubtitles) score += 3;
      if (hasSign) score += 3;
      if (hasAudio) score += 3;
      
      // Default score for some popular ones if no matches
      if (score === 0 && show.id <= 4) score = 1;
      
      return { ...show, score };
    })
    .filter(show => show.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);
  }, [profile]);

  const speak = (text: string) => {
    if (!ttsEnabled || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ko-KR';
    utterance.rate = 1.1;
    window.speechSynthesis.speak(utterance);
  };

  const toggleTTS = () => {
    const nextState = !ttsEnabled;
    setTtsEnabled(nextState);
    if (nextState && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance("음성 읽어주기 모드가 켜졌습니다. 화면의 주요 내용을 소리 내어 읽어줍니다.");
      utterance.lang = 'ko-KR';
      window.speechSynthesis.speak(utterance);
    }
  };

  const recognitionRef = useRef<any>(null);

  const toggleListening = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      speak("음성 인식을 중지합니다.");
      return;
    }

    // @ts-ignore
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("이 브라우저에서는 음성 인식을 지원하지 않습니다.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.lang = 'ko-KR';
    recognition.continuous = false;
    recognition.interimResults = false;
    
    recognition.onstart = () => {
      setIsListening(true);
      speak("음성을 듣고 있습니다. 말씀해주세요.");
    };
    
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setSearchQuery(transcript);
      setIsSearchOverlayOpen(true);
      speak(`"${transcript}"으로 검색합니다.`);
    };
    
    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      if (event.error === 'not-allowed') {
        alert('마이크 권한이 거부되었습니다. 브라우저 설정 혹은 상단의 마이크 권한을 허용해주세요. (프리뷰 환경에서는 새 탭에서 열어주세요)');
        speak("마이크 권한이 차단되어 음성 인식을 사용할 수 없습니다.");
      } else if (event.error === 'aborted') {
        // manually stopped or aborted, do not throw error or speak
      } else {
        speak("음성 인식에 실패했습니다. 다시 시도해주세요.");
      }
    };
    
    recognition.onend = () => {
      setIsListening(false);
    };
    
    recognition.start();
  };

  const isFiltering = activeTag !== '전체' || filterMapPin || filterSubtitles || filterAudio || filterSignLanguage || filterVR || searchQuery.trim() !== '';

  const filteredShows = useMemo(() => {
    return SHOWS.filter(show => {
      if (activeTag !== '전체' && show.type !== activeTag) return false;
      if (filterMapPin && !show.badges.includes('휠체어')) return false;
      if (filterSubtitles && !show.badges.includes('자막')) return false;
      if (filterAudio && !show.badges.includes('음성해설')) return false;
      if (filterSignLanguage && !show.badges.includes('수어')) return false;
      if (filterVR && !show.badges.includes('VR시야')) return false;
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        if (!show.title.toLowerCase().includes(query) && 
            !show.venue.toLowerCase().includes(query) &&
            !show.type.toLowerCase().includes(query)) {
          return false;
        }
      }
      return true;
    });
  }, [activeTag, filterMapPin, filterSubtitles, filterAudio, filterSignLanguage, filterVR, searchQuery]);

  // Handle empty state resets
  const resetFilters = () => {
    setSearchQuery('');
    setIsSearchOverlayOpen(false);
    setActiveTag('전체');
    setFilterMapPin(false);
    setFilterSubtitles(false);
    setFilterAudio(false);
    setFilterSignLanguage(false);
    setFilterVR(false);
    speak("모든 필터를 초기화했습니다.");
  };

  return (
    <div className="flex flex-col min-h-full bg-black">
      {/* Top Header */}
      <header className="px-5 pt-8 pb-3 sticky top-0 bg-black/95 backdrop-blur-sm z-40 border-b border-zinc-900 flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => speak("403 바이패스 앱입니다.")}>
            <div className="w-10 h-10 bg-zinc-900 border border-cyan-400/30 rounded-lg flex items-center justify-center overflow-hidden shadow-[0_0_15px_rgba(34,211,238,0.2)]">
              <img src="/logo.png" alt="BYPASS Logo" className="w-8 h-8 object-contain" onError={(e) => {
                // Fallback to text logo if image fails
                (e.currentTarget as HTMLImageElement).style.display = 'none';
                const parent = e.currentTarget.parentElement;
                if (parent) parent.innerHTML = '<span class="text-[10px] font-black text-cyan-400">BY</span>';
              }} />
            </div>
            <h1 className="text-xl tracking-tighter flex flex-col -gap-1">
              <span className="text-[10px] font-black text-cyan-400 leading-none">EVERYTAIN</span>
              <span className="font-black text-white leading-tight">403 BYPASS</span>
            </h1>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={toggleTTS} 
              className={cn("w-8 h-8 rounded-full flex justify-center items-center transition-colors", ttsEnabled ? "bg-cyan-400 text-black" : "bg-zinc-800 text-white hover:bg-zinc-700")}
              aria-label="음성 읽어주기 토글"
            >
              {ttsEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
            <button 
              onClick={() => { setHelpOpen(true); speak("이용 안내 모달을 엽니다."); }} 
              className="w-8 h-8 bg-zinc-800 text-white rounded-full flex justify-center items-center transition-colors hover:bg-zinc-700"
              aria-label="도움말 보기"
            >
              <HelpCircle className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        {/* Location Display */}
        <div 
          className="flex items-center gap-1.5 text-xs font-medium text-zinc-400 cursor-pointer w-max hover:text-cyan-400 transition-colors" 
          onClick={() => {
            speak(`현재 위치는 ${currentLocation} 입니다. 위치 변경을 원하시면 탭하세요.`);
            setLocationModalOpen(true);
          }}
        >
          <Navigation className="w-3.5 h-3.5 text-cyan-400" />
          <span>{currentLocation}</span>
          <ChevronRight className="w-3 h-3 opacity-50" />
        </div>
      </header>

      {/* Main Search & Category Box */}
      <section className="px-5 py-4">
        <div className="bg-zinc-900/80 border border-zinc-800 rounded-[2rem] p-4 shadow-[0_0_30px_rgba(34,211,238,0.05)] backdrop-blur-md">
          {/* Search Trigger */}
          <div 
            onClick={() => {
              setIsSearchOverlayOpen(true);
              speak("검색 창을 엽니다. 어떤 공연을 찾으시나요?");
            }}
            className="relative mb-4 group cursor-pointer"
          >
            <div className="w-full bg-black/60 border border-zinc-700 rounded-2xl py-3.5 pl-11 pr-12 text-zinc-400 font-medium group-hover:border-cyan-400/50 group-hover:shadow-[0_0_15px_rgba(34,211,238,0.1)] transition-all">
              {searchQuery || "어떤 공연을 찾으시나요?"}
            </div>
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-400" />
            <button 
              onClick={toggleListening}
              className={cn(
                "absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg transition-colors border",
                isListening ? "bg-cyan-400 border-cyan-400 text-black animate-pulse" : "bg-zinc-800 text-cyan-400 hover:bg-zinc-700 border-zinc-700"
              )}
              aria-label="음성 검색"
            >
              {isListening ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
            </button>
            
            {/* Pulsing indicator for active filter */}
            {searchQuery && (
               <div className="absolute -top-1 -right-1 w-3 h-3 bg-cyan-400 rounded-full border-2 border-black animate-pulse" />
            )}
          </div>

          {/* Tags / Filtering */}
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {['전체', '뮤지컬', '연극', '콘서트', '클래식'].map((tag) => (
              <button 
                key={tag} 
                onClick={() => { setActiveTag(tag); speak(`${tag} 카테고리를 선택했습니다.`); }}
                className={cn(
                  "whitespace-nowrap px-5 py-2 rounded-xl font-bold text-sm transition-all border",
                  activeTag === tag ? "bg-cyan-400 text-black border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.3)]" : "bg-zinc-950 text-zinc-400 border-zinc-800 hover:border-zinc-700"
                )}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
        
        {/* Amenity Quick Filters - Separated slightly */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pt-4">
           <button 
             onClick={() => { setFilterMapPin(!filterMapPin); speak("휠체어 접근 가능 공연만 필터링합니다."); }}
             className={cn("flex items-center gap-1.5 whitespace-nowrap px-3 py-1.5 rounded-lg border text-xs font-bold transition-all", filterMapPin ? "bg-cyan-400/10 border-cyan-400 text-cyan-400 scale-105" : "bg-zinc-900 border-zinc-800 text-zinc-300")}
           >
             <MapPin className="w-3 h-3 text-cyan-400" /> 휠체어 접근
           </button>
           <button 
             onClick={() => { setFilterSubtitles(!filterSubtitles); speak("자막 제공 공연만 필터링합니다."); }}
             className={cn("flex items-center gap-1.5 whitespace-nowrap px-3 py-1.5 rounded-lg border text-xs font-bold transition-all", filterSubtitles ? "bg-cyan-400/10 border-cyan-400 text-cyan-400 scale-105" : "bg-zinc-900 border-zinc-800 text-zinc-300")}
           >
             <Subtitles className="w-3 h-3 text-cyan-400" /> 자막 제공
           </button>
           <button 
             onClick={() => { setFilterAudio(!filterAudio); speak("음성 해설 공연만 필터링합니다."); }}
             className={cn("flex items-center gap-1.5 whitespace-nowrap px-3 py-1.5 rounded-lg border text-xs font-bold transition-all", filterAudio ? "bg-cyan-400/10 border-cyan-400 text-cyan-400 scale-105" : "bg-zinc-900 border-zinc-800 text-zinc-300")}
           >
             <AudioLines className="w-3 h-3 text-cyan-400" /> 음성 해설
           </button>
           <button 
             onClick={() => { setFilterSignLanguage(!filterSignLanguage); speak("수어 통역 제공 공연만 필터링합니다."); }}
             className={cn("flex items-center gap-1.5 whitespace-nowrap px-3 py-1.5 rounded-lg border text-xs font-bold transition-all", filterSignLanguage ? "bg-cyan-400/10 border-cyan-400 text-cyan-400 scale-105" : "bg-zinc-900 border-zinc-800 text-zinc-300")}
           >
             <Eye className="w-3 h-3 text-cyan-400" /> 수어 통역
           </button>
           <button 
             onClick={() => { setFilterVR(!filterVR); speak("VR 시야 제공 공연만 필터링합니다."); }}
             className={cn("flex items-center gap-1.5 whitespace-nowrap px-3 py-1.5 rounded-lg border text-xs font-bold transition-all", filterVR ? "bg-cyan-400/10 border-cyan-400 text-cyan-400 scale-105" : "bg-zinc-900 border-zinc-800 text-zinc-300")}
           >
             <Navigation className="w-3 h-3 text-cyan-400" /> VR 시야
           </button>
        </div>
      </section>

      {/* Promotional Banners - Hide when filtering */}
      {!isFiltering && (
        <section className="px-5 py-2">
          <div className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide gap-4">
            
            <div 
              className="snap-center shrink-0 w-full bg-cyan-400 text-black rounded-2xl p-6 relative overflow-hidden"
              onClick={() => speak("공식 홍보대사 403 서포터즈 1기 대모집. 접근성을 리뷰하고 리워드를 받으세요.")}
            >
              <div className="relative z-10 w-[70%]">
                <span className="text-xs font-black bg-black text-cyan-400 px-2 py-0.5 rounded-sm inline-block mb-2">공식 홍보대사</span>
                <h3 className="text-xl font-black leading-tight mb-2">403 서포터즈<br/>1기 대모집!</h3>
                <p className="text-xs font-bold opacity-80 mb-4">접근성 리뷰하고 리워드 받자</p>
                <button 
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    navigate('/app/supporters');
                  }}
                  className="text-xs font-black border-2 border-black rounded-full px-4 py-1.5 transition-colors flex items-center w-max gap-1 hover:bg-black hover:text-cyan-400"
                >
                  지원하기
                </button>
              </div>
              <div className="absolute -right-4 -bottom-4 opacity-20 pointer-events-none">
                <Eye className="w-40 h-40" />
              </div>
            </div>

            <div 
              className="snap-center shrink-0 w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-6 relative overflow-hidden"
              onClick={() => speak("단독 제휴 프로모션. 또타지하철과 코레일 콜라보. 집에서 공연장 좌석까지 끊김없이 이어집니다.")}
            >
              <div className="relative z-10 w-[75%]">
                <span className="text-xs font-black bg-white text-black px-2 py-0.5 rounded-sm inline-block mb-2">단독 제휴</span>
                <h3 className="text-xl font-bold leading-tight mb-2 text-white">또타지하철 <span className="text-cyan-400 font-black">X</span> KORAIL</h3>
                <p className="text-xs font-medium text-zinc-400 mb-4">집에서 공연장 좌석까지 끊김없이</p>
                <Link to="/map" className="inline-flex items-center gap-1 text-xs font-bold text-cyan-400" onClick={(e) => e.stopPropagation()}>
                  길찾기 연동 안내 <ChevronRight className="w-3 h-3" />
                </Link>
              </div>
            </div>

          </div>
        </section>
      )}

      {/* Main Content Area */}
      <div className="flex flex-col">
        {isFiltering ? (
          <section className="px-5 py-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-black text-white">검색 결과</h2>
                <p className="text-sm text-cyan-400 font-bold">{filteredShows.length}개의 공연을 찾았습니다</p>
              </div>
              <button 
                onClick={resetFilters}
                className="text-xs font-bold text-zinc-500 hover:text-white underline underline-offset-4"
              >
                필터 초기화
              </button>
            </div>
            
            <div className="space-y-6">
              {filteredShows.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 px-10 text-center bg-zinc-900/30 rounded-3xl border border-dashed border-zinc-800">
                  <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mb-4">
                    <Search className="w-8 h-8 text-zinc-600" />
                  </div>
                  <h3 className="text-lg font-black text-white mb-2">조건에 맞는 공연이 없어요</h3>
                  <p className="text-xs text-zinc-500 font-medium leading-relaxed mb-6">
                    다른 키워드로 검색하거나<br/>접근성 필터를 조정해보세요.
                  </p>
                  <button 
                    onClick={resetFilters}
                    className="bg-cyan-400 text-black font-black px-6 py-3 rounded-xl text-sm shadow-xl active:scale-95 transition-all"
                  >
                    모든 필터 해제하기
                  </button>
                </div>
              ) : (
                filteredShows.map((show) => (
                  <Link 
                    key={show.id} 
                    to={`/app/show/${show.id}`}
                    onClick={() => speak(`${show.title}. ${show.venue}.`)}
                    className="flex gap-4 group"
                  >
                    <div className="w-28 h-36 rounded-2xl overflow-hidden shrink-0 relative bg-zinc-900 border border-zinc-800">
                      <img 
                        src={show.image} 
                        alt="" 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                        onError={(e) => {
                          e.currentTarget.src = "https://images.unsplash.com/photo-1460723237483-7a6dc9d0b212?auto=format&fit=crop&q=80&w=400";
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    </div>
                    <div className="flex flex-col justify-center py-1">
                      <span className="text-[10px] font-black text-cyan-400 mb-1">{show.type}</span>
                      <h3 className="text-lg font-black text-white mb-1 group-hover:text-cyan-400 transition-colors leading-tight">{show.title}</h3>
                      <p className="text-xs text-zinc-400 font-medium mb-3 flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {show.venue} · {show.distance}
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {show.badges.map(badge => (
                          <span key={badge} className="text-[9px] font-black px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
                            {badge}
                          </span>
                        ))}
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </section>
        ) : (
          <>
            {/* Recommended Shows - Restored */}
            {recommendedShows.length > 0 && (
              <section className="px-5 py-6 bg-gradient-to-b from-zinc-900/50 to-transparent">
                <div className="flex justify-between items-end mb-4">
                  <div>
                    <h2 className="text-xl font-black mb-1" onClick={() => speak("유저님의 선호 장르와 필요 서비스를 반영한 맞춤 공연입니다.")}>
                      ✨ 나를 위한 맞춤 추천 공연
                    </h2>
                    <p className="text-xs text-zinc-400 font-medium tracking-tight">선호 장르와 필요 서비스가 반영되었어요.</p>
                  </div>
                </div>
                <div className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide gap-4 pb-4">
                  {recommendedShows.map((show) => (
                    <Link
                      key={show.id}
                      to={`/app/show/${show.id}`}
                      onClick={() => speak(`${show.title}. ${show.venue}. 추천 공연입니다.`)}
                      className="snap-start shrink-0 w-[240px] bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden hover:border-cyan-400/50 transition-all block group"
                    >
                      <div className={cn("w-full h-32 relative", show.imgClass)}>
                        <img 
                          src={show.image || "https://images.unsplash.com/photo-1514302240736-b1fee598926c?auto=format&fit=crop&q=80&w=400"} 
                          alt={show.title} 
                          className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700" 
                          onError={(e) => {
                            const img = e.currentTarget as HTMLImageElement;
                            img.src = "https://images.unsplash.com/photo-1514302240736-b1fee598926c?auto=format&fit=crop&q=80&w=400";
                            img.onerror = null;
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 to-transparent" />
                        <div className="absolute top-2 left-2 flex gap-1">
                          <span className="text-[10px] font-black bg-cyan-400 text-black px-2 py-0.5 rounded-full">{show.type}</span>
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-black text-lg text-white mb-1 leading-tight truncate">{show.title}</h3>
                        <p className="text-xs font-medium text-zinc-400 mb-3">{show.venue} · {show.distance}</p>
                        
                        <div className="flex flex-wrap gap-1.5">
                          {show.badges.map(badge => {
                            const userAcc = profile?.preferences?.accessibility || [];
                            let isPreferred = false;
                            if (badge === '휠체어' && userAcc.includes('휠체어 접근성')) isPreferred = true;
                            if (badge === '자막' && userAcc.includes('자막 제공')) isPreferred = true;
                            if (badge === '음성해설' && userAcc.includes('음성 해설')) isPreferred = true;
                            if (badge === '수어' && userAcc.includes('수어 통역')) isPreferred = true;

                            return (
                              <span key={badge} className={cn("text-[9px] font-black px-1.5 py-0.5 rounded border", isPreferred ? "bg-cyan-400/10 text-cyan-400 border-cyan-400/30" : "bg-zinc-800/50 text-zinc-400 border-zinc-700")}>
                                {badge}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Popular Shows */}
            <section className="px-5 pb-6">
              <div className="flex justify-between items-end mb-4">
                <h2 className="text-xl font-black" onClick={() => speak("요즘 인기 있는 공연들입니다.")}>🔥 요즘 인기 있는 공연들</h2>
                <span className="text-xs font-bold text-cyan-400 cursor-pointer" onClick={() => speak("전체보기")}>전체보기</span>
              </div>
              <div className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide gap-4 pb-4">
                {[...SHOWS].reverse().slice(0, 8).map((show) => (
                  <Link
                    key={show.id}
                    to={`/app/show/${show.id}`}
                    onClick={() => speak(`${show.title}. ${show.venue}.`)}
                    className="snap-start shrink-0 w-[180px] bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden hover:border-cyan-400/50 transition-colors block group"
                  >
                    <div className={cn("w-full h-24 relative overflow-hidden", show.imgClass)}>
                      <img 
                        src={show.image} 
                        alt={show.title} 
                        className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:scale-110 transition-transform duration-500" 
                        onError={(e) => {
                          e.currentTarget.src = "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?auto=format&fit=crop&q=80&w=400";
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 to-transparent" />
                      <div className="absolute top-2 left-2 flex gap-1">
                        <span className="text-[9px] font-black bg-white/10 text-white backdrop-blur-md px-1.5 py-0.5 rounded-full">{show.type}</span>
                      </div>
                    </div>
                    <div className="p-3">
                      <h3 className="font-bold text-base text-white mb-0.5 truncate">{show.title}</h3>
                      <p className="text-[10px] font-medium text-zinc-400">{show.venue}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>

            {/* Nearby Shows */}
            <section className="px-5 py-6 pt-0">
              <div className="flex justify-between items-end mb-4">
                <h2 className="text-xl font-black" onClick={() => speak("내 주변 예매 가능한 공연 리스트입니다.")}>내 주변 예매 가능한 공연</h2>
                <span className="text-xs font-bold text-cyan-400 cursor-pointer" onClick={() => speak("전체보기")}>전체보기</span>
              </div>

              <div className="space-y-4">
                {SHOWS.slice(0, 15).map((show) => (
                  <Link 
                    key={show.id} 
                    to={`/app/show/${show.id}`}
                    onClick={() => speak(`${show.title}. ${show.venue}.`)}
                    className="flex gap-4 bg-zinc-900/50 p-3 rounded-2xl border border-zinc-800/50 hover:border-cyan-400/50 transition-colors"
                  >
                    <div className={cn("w-24 h-32 rounded-xl overflow-hidden shrink-0 relative bg-zinc-900", show.imgClass)}>
                      <img 
                        src={show.image} 
                        alt={show.title} 
                        className="absolute inset-0 w-full h-full object-cover opacity-70" 
                        onError={(e) => {
                          e.currentTarget.src = "https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?auto=format&fit=crop&q=80&w=400";
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/80 to-transparent" />
                    </div>
                    <div className="flex flex-col justify-center py-1 w-full">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-[10px] font-bold text-cyan-400 border border-cyan-400/30 bg-cyan-400/5 px-1.5 py-0.5 rounded-sm w-max">{show.type}</span>
                        <span className="text-[10px] font-bold text-zinc-400 bg-zinc-800 px-1.5 py-0.5 rounded flex items-center gap-1"><MapPin className="w-3 h-3" /> {show.distance}</span>
                      </div>
                      <h3 className="text-lg font-black mb-1 text-white tracking-tight leading-tight">{show.title}</h3>
                      <p className="text-xs text-zinc-400 font-medium mb-3">{show.venue}</p>
                      
                      <div className="flex flex-wrap gap-2 mt-auto">
                        {show.badges.includes('휠체어') && (
                          <div className="bg-zinc-800 px-2 py-1 rounded gap-1 flex items-center">
                            <MapPin className="w-3 h-3 text-cyan-400" />
                            <span className="text-[10px] font-bold text-zinc-300">단차 없음</span>
                          </div>
                        )}
                        {show.badges.includes('자막') && (
                          <div className="bg-zinc-800 px-2 py-1 rounded gap-1 flex items-center">
                            <Subtitles className="w-3 h-3 text-cyan-400" />
                            <span className="text-[10px] font-bold text-zinc-300">자막 대여</span>
                          </div>
                        )}
                        {show.badges.includes('음성해설') && (
                          <div className="bg-zinc-800 px-2 py-1 rounded gap-1 flex items-center">
                            <AudioLines className="w-3 h-3 text-cyan-400" />
                            <span className="text-[10px] font-bold text-zinc-300">음성 해설</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          </>
        )}
      </div>
      
      {/* Spacer for bottom nav */}
      <div className="h-10"></div>

      {/* Search Overlay - Full Screen "New Window" Experience */}
      {isSearchOverlayOpen && (
        <div className="fixed inset-0 z-[60] bg-black animate-in fade-in slide-in-from-bottom-5 duration-300 flex flex-col">
          <header className="px-5 pt-12 pb-4 border-b border-zinc-900 flex items-center gap-4">
             <button 
               onClick={() => setIsSearchOverlayOpen(false)}
               className="w-10 h-10 flex items-center justify-center bg-zinc-900 rounded-full text-white"
             >
               <ChevronRight className="w-6 h-6 rotate-180" />
             </button>
             <div className="flex-1 relative">
                <input 
                  autoFocus
                  type="text" 
                  placeholder="어떤 공연을 찾으시나요?" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent border-none text-xl font-bold text-white placeholder:text-zinc-600 focus:outline-none"
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="absolute right-0 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
                  >
                    Clear
                  </button>
                )}
             </div>
             <button 
              onClick={(e) => toggleListening(e)}
              className={cn(
                "p-2 rounded-full transition-colors",
                isListening ? "bg-cyan-400 text-black scale-110" : "bg-zinc-800 text-cyan-400"
              )}
            >
              {isListening ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
            </button>
          </header>

          <main className="flex-1 overflow-y-auto px-5 py-6">
             {searchQuery === '' ? (
               <div className="space-y-8">
                 <section>
                   <h3 className="text-sm font-black text-zinc-500 mb-4 tracking-widest uppercase">최근 검색어</h3>
                   <div className="flex flex-wrap gap-2">
                     {recentSearches.map(term => (
                       <button 
                         key={term}
                         onClick={() => { setSearchQuery(term); speak(`${term}으로 검색합니다.`); }}
                         className="px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-sm font-bold text-zinc-300 hover:border-cyan-400/50"
                       >
                         {term}
                       </button>
                     ))}
                   </div>
                 </section>

                 <section>
                   <h3 className="text-sm font-black text-zinc-500 mb-4 tracking-widest uppercase">인기 있는 태그</h3>
                   <div className="flex flex-wrap gap-3">
                     {['#내주변직관', '#수어통역제공', '#휠체어접근성', '#자막필수', '#VR시야'].map(tag => (
                       <button 
                        key={tag}
                        onClick={() => { 
                          const keyword = tag.replace('#', '');
                          setSearchQuery(keyword);
                        }}
                        className="text-white font-bold hover:text-cyan-400 transition-colors"
                       >
                         {tag}
                       </button>
                     ))}
                   </div>
                 </section>
               </div>
             ) : (
               <div className="space-y-6">
                 <div className="flex justify-between items-center bg-zinc-900/50 px-4 py-3 rounded-2xl border border-zinc-800">
                    <span className="text-xs font-bold text-zinc-400">"{searchQuery}" 검색 결과</span>
                    <span className="text-xs font-black text-cyan-400">{filteredShows.length}개 발견</span>
                 </div>

                 <div className="grid gap-4">
                    {filteredShows.slice(0, 10).map(show => (
                      <Link 
                        key={show.id} 
                        to={`/app/show/${show.id}`}
                        className="flex gap-4 p-2 bg-zinc-900/30 rounded-2xl border border-transparent active:border-cyan-400/30 transition-all"
                      >
                         <div className="w-16 h-20 bg-zinc-800 rounded-lg overflow-hidden shrink-0 relative">
                           <img 
                             src={show.image} 
                             alt="" 
                             className="w-full h-full object-cover opacity-80" 
                             onError={(e) => {
                               const img = e.currentTarget as HTMLImageElement;
                               img.src = "https://images.unsplash.com/photo-1460723237483-7a6dc9d0b212?auto=format&fit=crop&q=80&w=200";
                               img.onerror = null;
                             }}
                           />
                         </div>
                         <div className="flex flex-col justify-center">
                           <h4 className="text-lg font-black text-white leading-tight mb-1">{show.title}</h4>
                           <p className="text-xs text-zinc-400 font-medium">{show.venue} · {show.type}</p>
                         </div>
                         <ChevronRight className="ml-auto self-center w-5 h-5 text-zinc-700" />
                      </Link>
                    ))}
                    
                    {filteredShows.length > 0 && (
                      <button 
                        onClick={() => setIsSearchOverlayOpen(false)}
                        className="w-full py-4 bg-zinc-900 text-white font-black rounded-2xl hover:bg-zinc-800"
                      >
                        결과 전체 보기
                      </button>
                    )}
                 </div>
               </div>
             )}
          </main>
          
          <footer className="p-5 border-t border-zinc-900">
             <button 
               onClick={() => setIsSearchOverlayOpen(false)}
               className="w-full py-4 bg-cyan-400 text-black font-black rounded-2xl shadow-[0_0_30px_rgba(34,211,238,0.2)]"
             >
               검색 닫기
             </button>
          </footer>
        </div>
      )}

      {/* Detailed Help / Onboarding Modal */}
      <BottomSheet isOpen={helpOpen} onClose={() => setHelpOpen(false)} title="모든 기능 상세 안내">
        <div className="flex flex-col gap-6 p-1">
          <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl shadow-lg">
             <div className="flex items-center gap-3 mb-2 text-cyan-400">
               <Volume2 className="w-5 h-5"/>
               <h4 className="font-black text-sm">시각 장애인을 위한 환경 (읽어주기)</h4>
             </div>
             <p className="text-xs text-zinc-400 font-medium leading-relaxed">
               앱 우측 상단의 <strong className="text-white">스피커 아이콘</strong>을 탭하면 음성 안내 모드가 활성화됩니다.
               화면의 주요 텍스트와 기능을 터치할 때마다 스크린 리더처럼 소리내어 상황을 안내합니다. 버튼들의 의도를 정확히 파악할 수 있도록 돕습니다.
             </p>
          </div>
          
          <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl shadow-lg">
             <div className="flex items-center gap-3 mb-2 text-blue-400">
               <Eye className="w-5 h-5"/>
               <h4 className="font-black text-sm">VR 좌석 360도 시야 (예매)</h4>
             </div>
             <p className="text-xs text-zinc-400 font-medium leading-relaxed">
               공연 상세 페이지에서 <strong className="text-white">VR 시야 확인</strong> 버튼을 누르면 제공되는 실제 공연장의 360도 VR 연동 기능입니다.
               시선 방향과 단차 체감을 모바일에서 자이로스코프로 생생하게 체험한 뒤, 안전하다고 판단되는 구역의 티켓을 바로 예매할 수 있습니다.
             </p>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl shadow-lg">
             <div className="flex items-center gap-3 mb-2 text-blue-400">
               <MapPin className="w-5 h-5"/>
               <h4 className="font-black text-sm">실시간 AR 보행 내비게이션 (길찾기)</h4>
             </div>
             <p className="text-xs text-zinc-400 font-medium leading-relaxed">
               하단 <strong className="text-white">길안내 탭</strong>에서 이용할 수 있습니다. 사용자의 스마트폰 카메라를 켜고 실제 환경과 겹쳐서 진행 방향을 AR 화살표로 띄워줍니다. 
               전방의 단차나 장애물이 발견될 경우 <strong className="text-red-400">시각적 경고창과 함께 디바이스 진동, 음성 알림</strong>을 발생시켜 휠체어 탑승자나 보행 약자가 우회할 수 있도록 돕습니다.
             </p>
          </div>
        </div>
      </BottomSheet>

      {/* Location Search Modal */}
      <BottomSheet isOpen={locationModalOpen} onClose={() => setLocationModalOpen(false)} title="위치 변경">
        <div className="flex flex-col gap-4 p-1">
          <p className="text-sm font-medium text-zinc-400 mb-2">
            설정된 위치를 기준으로 휠체어 접근 가능 여부 및 거리를 계산합니다.
          </p>
          <form onSubmit={handleLocationSearch} className="relative">
            <input 
              type="text" 
              placeholder="동, 읍, 면 또는 도로명 주소를 입력하세요" 
              value={locationSearchKeyword}
              onChange={(e) => setLocationSearchKeyword(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-4 pl-4 pr-12 text-white font-medium placeholder:text-zinc-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
            />
            <button 
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-cyan-400 text-black hover:bg-white transition-colors"
            >
              <Search className="w-4 h-4" />
            </button>
          </form>
          <div className="mt-4 border-t border-zinc-800 pt-4">
             <button
               onClick={() => {
                 setCurrentLocation('현재 위치 찾는 중...');
                 if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition((pos) => {
                      setTimeout(() => {
                        setCurrentLocation('서울특별시 강남구 테헤란로'); // dummy successful
                        setLocationModalOpen(false);
                      }, 1000);
                    });
                 }
               }}
               className="flex items-center gap-3 w-full p-4 bg-zinc-900 rounded-xl hover:bg-zinc-800 transition-colors border border-zinc-800"
             >
               <div className="w-10 h-10 bg-cyan-400/20 text-cyan-400 rounded-full flex items-center justify-center shrink-0">
                 <MapPin className="w-5 h-5 pointer-events-none" />
               </div>
               <div className="flex flex-col text-left">
                  <span className="font-bold text-white">현재 위치로 설정</span>
                  <span className="text-xs text-zinc-400 mt-0.5">GPS를 사용하여 정확한 위치 찾기</span>
               </div>
             </button>
          </div>
        </div>
      </BottomSheet>
    </div>
  );
}

