import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { SHOWS } from '../../lib/show-data';
import { ChevronLeft, Info, MapPin, Calendar, Users, ExternalLink, Ticket, Settings as SettingsIcon, ShieldCheck, Accessibility, Star, MessageSquare, Maximize2, X } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useProfile } from '../../lib/profile-context';
import { BottomSheet } from '../../components/ui/BottomSheet';

export function AppShowDetail() {
  const { showId } = useParams();
  const navigate = useNavigate();
  const { profile } = useProfile();
  
  const [vrMode, setVrMode] = useState(false);
  const [seatModalOpen, setSeatModalOpen] = useState(false);

  // Get show details from shared data
  const showData = SHOWS.find(s => s.id.toString() === showId);
  
  if (!showData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-10 text-center">
        <X className="w-16 h-16 text-zinc-600 mb-4" />
        <h2 className="text-xl font-black mb-2">공연을 찾을 수 없습니다</h2>
        <button onClick={() => navigate('/app')} className="mt-4 bg-cyan-400 text-black px-6 py-2 rounded-xl font-bold">홈으로 돌아가기</button>
      </div>
    );
  }

  const show = {
    ...showData,
    cast: showData.id <= 4 ? (
      showData.id === 1 ? '조승우, 전동석, 김주택' :
      showData.id === 2 ? '이순재, 권해효, 박정자' :
      showData.id === 3 ? '브루노 마스, 샘 스미스 외' :
      'EVERYTAIN 서포터즈 1기'
    ) : '배우 출연진 정보 로딩 중',
    description: showData.id <= 4 ? (
      showData.id === 1 ? '웅장한 무대 장치와 아름다운 넘버가 어우러진 세계적인 명작' :
      showData.id === 2 ? '셰익스피어 4대 비극 중 가장 위대하다고 칭송받는 정통 연극' :
      showData.id === 3 ? '전 세계 최정상 아티스트를 만나는 특별한 음악적 경험' :
      '장애인들의 문화예술 접근성을 높이기 위해 기획된 혁신적인 무대'
    ) : `${showData.title}은 ${showData.venue}에서 진행되는 특별한 체험입니다.`,
    date: '2026.05.28 ~ 2026.08.15',
    rating: '8.5',
    ticketOpen: '2026.05.20 14:00',
    facilities: showData.badges.length > 0 ? showData.badges.map(b => 
      b === '휠체어' ? '휠체어 접근 가능' :
      b === '자막' ? '자막 제공' :
      b === '음성해설' ? '음성해설 제공' :
      b === '수어' ? '수어 통역 제공' :
      b === 'VR시야' ? 'VR 시야 확인 가능' : b
    ) : ['편의시설 정보 로딩 중'],
    seatingChartImage: 'https://images.unsplash.com/photo-1514464866674-40c02ec9a409?auto=format&fit=crop&q=80&w=1200',
    showReviews: [
      { id: 1, author: '연극러버', rating: 5, text: '배우들의 연기력이 미쳤어요.' },
      { id: 2, author: '관극매니아', rating: 4, text: '무대 연출이 신선하고 좋았습니다!' }
    ],
    venueReviews: [
      { id: 1, author: '휠체어이용자', rating: 5, text: '경사로가 잘 되어있어서 이동이 편리했습니다.' },
      { id: 2, author: '시각장애인', rating: 4, text: '점자 블록과 음성 안내가 잘 구비되어 있어서 헤매지 않고 입장했어요.' }
    ],
    providers: showData.id === 4 ? [
      { name: '자체 예매처', color: 'text-cyan-400 bg-cyan-400/10 border-cyan-400/30', internal: true }
    ] : [
      { name: '인터파크 티켓', color: 'text-red-400 bg-red-400/10 border-red-400/30', internal: false },
      { name: '멜론티켓', color: 'text-green-400 bg-green-400/10 border-green-400/30', internal: false }
    ]
  };

  if (vrMode) {
    return (
      <div className="fixed inset-0 z-50 bg-black overflow-hidden flex flex-col">
        {/* VR Viewer Header */}
        <div className="absolute top-0 left-0 right-0 p-5 flex justify-between items-center z-10 bg-gradient-to-b from-black/80 to-transparent">
          <button 
            onClick={() => setVrMode(false)}
            className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div className="text-center pointer-events-none">
            <span className="text-xs font-bold text-cyan-400 px-3 py-1 bg-cyan-400/20 rounded-full border border-cyan-400/30 shadow-[0_0_15px_rgba(0,255,204,0.3)]">VR 시야 모드</span>
            <p className="text-xs text-white/70 mt-1">{show.venue} 체험</p>
          </div>
          <div className="w-10" />
        </div>

        {/* VR Iframe */}
        <div className="flex-1 bg-black w-full h-full">
           <iframe 
             src="https://yoonsolcho.github.io/10318_VR/" 
             className="w-full h-full border-0"
             allow="accelerometer; gyroscope; vr"
             title="VR Viewer"
           />
        </div>
        
        {/* Helper text overlay */}
        <div className="absolute bottom-10 left-0 right-0 pointer-events-none flex justify-center z-10">
           <div className="bg-black/50 backdrop-blur-sm px-6 py-3 rounded-full border border-white/10 flex items-center gap-2 shadow-2xl">
             <ShieldCheck className="w-4 h-4 text-cyan-400" />
             <span className="text-sm font-bold text-white">단차 가림 없음 · 쾌적한 시야</span>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-black text-white font-sans pb-32">
        <div className="relative h-72 bg-zinc-900 border-b border-zinc-800 flex items-end p-5 overflow-hidden">
          <img 
            src={show.image || "https://images.unsplash.com/photo-1514302240736-b1fee598926c?auto=format&fit=crop&q=80&w=800"} 
            alt="" 
            className="absolute inset-0 w-full h-full object-cover opacity-40 blur-sm scale-110" 
            onError={(e) => {
              const img = e.currentTarget as HTMLImageElement;
              img.src = "https://images.unsplash.com/photo-1514302240736-b1fee598926c?auto=format&fit=crop&q=80&w=800";
              img.onerror = null;
            }}
          />
          <button onClick={() => navigate(-1)} className="absolute top-5 left-5 w-10 h-10 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center z-10 border border-white/10 text-white hover:bg-black/70 transition-colors">
             <ChevronLeft className="w-6 h-6" />
          </button>
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>
          <div className="relative z-10 flex gap-4 w-full items-end">
             <div className="w-28 h-40 bg-zinc-800 rounded-xl shadow-2xl border border-white/10 shrink-0 overflow-hidden relative">
                <img 
                  src={show.image || "https://images.unsplash.com/photo-1514302240736-b1fee598926c?auto=format&fit=crop&q=80&w=400"} 
                  alt={show.title} 
                  className="w-full h-full object-cover" 
                  onError={(e) => {
                    const img = e.currentTarget as HTMLImageElement;
                    img.src = "https://images.unsplash.com/photo-1514302240736-b1fee598926c?auto=format&fit=crop&q=80&w=400";
                    img.onerror = null;
                  }}
                />
             </div>
            <div className="flex-1 pb-1">
               <span className="px-2 py-0.5 rounded text-[10px] font-black bg-cyan-400 text-black mb-2 inline-block shadow-[0_0_10px_rgba(34,211,238,0.5)]">{show.type}</span>
               <h1 className="text-2xl font-black mb-1 text-white leading-tight drop-shadow-lg">{show.title}</h1>
               <p className="text-zinc-300 text-sm font-medium flex items-center gap-1 drop-shadow-md"><MapPin className="w-3 h-3 text-cyan-400"/> {show.venue}</p>
            </div>
         </div>
       </div>

       {/* Content */}
       <div className="px-5 py-6 flex flex-col gap-8">
         
         <section>
            <div className="flex gap-4 p-4 bg-zinc-900/50 rounded-2xl border border-zinc-800">
               <div className="flex-1 flex flex-col gap-3 border-r border-zinc-800">
                  <div className="flex items-center gap-2 text-zinc-400 text-xs font-bold">
                     <Calendar className="w-4 h-4" /> 관람 기간
                  </div>
                  <p className="text-sm font-medium">{show.date}</p>
               </div>
               <div className="flex-1 flex flex-col gap-3 pl-2">
                  <div className="flex items-center gap-2 text-zinc-400 text-xs font-bold">
                     <Users className="w-4 h-4" /> 출연진
                  </div>
                  <p className="text-sm font-medium truncate">{show.cast}</p>
               </div>
            </div>
         </section>

         {/* Amenities */}
         <section>
            <h2 className="text-lg font-black mb-3 flex items-center gap-2">
              <Accessibility className="w-5 h-5 text-cyan-400" />
              제공되는 편의 시설
            </h2>
            <div className="flex flex-wrap gap-2">
              {show.facilities.map((facility, index) => (
                <span key={index} className="px-3 py-1.5 bg-zinc-900 border border-zinc-800 text-zinc-300 text-sm font-bold rounded-lg hover:border-cyan-400/50 transition-colors">
                  {facility}
                </span>
              ))}
            </div>
         </section>
         
         {/* Seat Map & VR Viewer */}
         <section>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-black">좌석 배치도 및 시야 확인</h2>
              <span className="text-xs font-bold text-cyan-400 border border-cyan-400/30 bg-cyan-400/10 px-2 py-1 rounded-full animate-pulse">VR 연동됨</span>
            </div>
            
            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl flex flex-col relative overflow-hidden ring-1 ring-white/5 shadow-2xl">
               {/* Header like the image */}
               <div className="pt-8 pb-2 text-center">
                  <h3 className="text-cyan-400 font-bold text-[10px] tracking-widest leading-tight">
                    (강의실 무대)<br/>
                    (LECTURE STAGE)
                  </h3>
                  <div className="absolute top-4 right-6 text-[8px] font-bold text-cyan-400/60 text-right">
                    (앞문)<br/>
                    (FRONT DOOR)
                  </div>
               </div>

               {/* Interactive/Visual Seat Map Preview */}
               <div className="w-full px-6 py-6 overflow-hidden" onClick={() => setSeatModalOpen(true)}>
                 <div className="flex flex-col gap-1.5 w-full max-w-[340px] mx-auto border border-cyan-900/30 p-4 rounded-xl bg-black/40">
                   {/* Rows A-K */}
                   {['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K'].map((row) => (
                     <div key={row} className="flex gap-2 justify-center items-center">
                       <span className="text-[10px] font-black text-cyan-400/70 w-3">{row}</span>
                       
                       {/* Left Block 1-8 */}
                       <div className="flex gap-0.5">
                         {Array.from({ length: row === 'K' ? 4 : 8 }).map((_, i) => (
                           <div key={`L-${i}`} className="w-2.5 h-3 rounded-sm border border-cyan-500/20 bg-cyan-500/5" />
                         ))}
                       </div>

                       {/* Aisle */}
                       <div className="w-4" />

                       {/* Right Block 9-17 (skipped 13 if we follow theater logic, but image shows 9, 10, 11, 12, 14... actually image has 9-17) */}
                       <div className="flex gap-0.5">
                         {Array.from({ length: 8 }).map((_, i) => (
                           <div key={`R-${i}`} className="w-2.5 h-3 rounded-sm border border-cyan-500/20 bg-cyan-500/5" />
                         ))}
                       </div>
                     </div>
                   ))}
                   
                   {/* Footer like the image */}
                   <div className="mt-4 flex justify-between items-end">
                      <div className="text-[7px] font-bold text-cyan-400/40 text-left">
                        (뒷문)<br/>
                        (REAR DOOR)
                      </div>
                      <div className="text-[7px] font-bold text-cyan-400/40 text-right">
                        (뒷문)<br/>
                        (REAR DOOR)
                      </div>
                   </div>
                 </div>

                 <button className="mt-4 w-full flex items-center justify-center gap-2 text-[10px] font-black text-zinc-500 hover:text-white transition-colors bg-black/40 py-2 rounded-lg border border-zinc-800">
                   <Maximize2 className="w-3 h-3" /> 배치도 크게 보기
                 </button>
               </div>
               
               {/* VR Overlay - Positioned at bottom */}
               <div className="p-5 bg-gradient-to-t from-black via-black/80 to-transparent">
                  <button 
                    onClick={() => setVrMode(true)}
                    className="w-full py-4 bg-cyan-400 text-black font-black text-sm rounded-xl shadow-[0_0_30px_rgba(0,255,204,0.3)] hover:bg-white transition-all active:scale-95 flex items-center justify-center gap-2"
                  >
                    <MapPin className="w-4 h-4" /> VR/360도로 생생한 시야 확인하기
                  </button>
               </div>
            </div>
         </section>

         {/* Reviews */}
         <section className="space-y-6">
            <div>
              <h2 className="text-lg font-black mb-3 flex items-center gap-2">
                <Star className="w-5 h-5 text-rose-400" />
                공연 후기
              </h2>
              <div className="space-y-3">
                {show.showReviews.map(review => (
                  <div key={review.id} className="bg-zinc-900 p-4 rounded-xl border border-zinc-800">
                    <div className="flex justify-between items-center mb-2">
                       <span className="text-xs font-bold text-zinc-400">{review.author}</span>
                       <div className="flex gap-0.5">
                         {Array.from({length: 5}).map((_, i) => (
                           <Star key={i} className={cn("w-3 h-3", i < review.rating ? "fill-rose-400 text-rose-400" : "text-zinc-700")} />
                         ))}
                       </div>
                    </div>
                    <p className="text-sm font-medium text-white/90">{review.text}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-lg font-black mb-3 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-cyan-400" />
                극장 접근성 후기
              </h2>
              <div className="space-y-3">
                {show.venueReviews.map(review => (
                  <div key={review.id} className="bg-zinc-900 p-4 rounded-xl border border-zinc-800">
                    <div className="flex justify-between items-center mb-2">
                       <span className="text-xs font-bold text-cyan-400 bg-cyan-400/10 px-2 py-0.5 rounded">{review.author}</span>
                       <div className="flex gap-0.5">
                         {Array.from({length: 5}).map((_, i) => (
                           <Star key={i} className={cn("w-3 h-3", i < review.rating ? "fill-cyan-400 text-cyan-400" : "text-zinc-700")} />
                         ))}
                       </div>
                    </div>
                    <p className="text-sm font-medium text-white/90">{review.text}</p>
                  </div>
                ))}
              </div>
            </div>
         </section>

        {/* Booking Links */}
        <section>
          <h2 className="text-lg font-black mb-3">티켓 예매 등 바로가기</h2>
          <div className="space-y-3">
            {show.providers.map(p => {
              if (p.internal) {
                return (
                  <button 
                    key={p.name} 
                    onClick={() => {
                        alert('자체 예매 시스템으로 연결됩니다. (프로토타입)');
                        navigate('/app/tickets');
                    }}
                    className="w-full flex justify-between items-center bg-zinc-900 p-4 rounded-xl border border-cyan-400/30 hover:bg-zinc-800 transition-colors"
                  >
                    <span className={cn("text-xs font-black px-2 py-1 rounded inline-block border flex items-center gap-1.5", p.color)}>
                      <ShieldCheck className="w-3 h-3" />
                      {p.name}
                    </span>
                    <span className="flex items-center gap-1 text-xs font-bold text-cyan-400">자체 예매하기 <ChevronRight className="w-4 h-4" /></span>
                  </button>
                );
              }
              return (
                <a href="https://tickets.interpark.com" target="_blank" rel="noreferrer" key={p.name} className="flex justify-between items-center bg-zinc-900 p-4 rounded-xl border border-zinc-800 hover:border-red-400/50 transition-colors">
                  <span className={cn("text-xs font-black px-2 py-1 rounded inline-block border", p.color)}>{p.name}</span>
                  <span className="flex items-center gap-1 text-xs font-bold text-white"><ExternalLink className="w-3 h-3" /> 예매하기</span>
                </a>
              );
            })}
          </div>
        </section>

        {/* Detailed Seat Map Modal */}
        <BottomSheet isOpen={seatModalOpen} onClose={() => setSeatModalOpen(false)} title="상세 좌석 배치도">
          <div className="bg-black p-2 rounded-2xl flex flex-col items-center relative overflow-hidden border border-zinc-800">
             <div className="w-full relative aspect-[4/3] bg-zinc-900 rounded-xl overflow-hidden mb-4 group">
                <img 
                  src={show.seatingChartImage} 
                  alt="상세 좌석 배치도" 
                  className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4">
                  <p className="text-white text-xs font-bold flex items-center gap-2">
                    <Maximize2 className="w-4 h-4" /> 두 손가락으로 확대해서 볼 수 있습니다
                  </p>
                </div>
             </div>

             <div className="w-full grid grid-cols-1 gap-3 mb-6">
                <div className="p-4 bg-zinc-900/50 border border-zinc-800 rounded-xl flex items-center gap-4">
                   <div className="w-10 h-10 rounded-full bg-cyan-400/20 flex items-center justify-center">
                     <Accessibility className="w-5 h-5 text-cyan-400" />
                   </div>
                   <div>
                     <p className="text-[10px] font-black text-zinc-500 mb-0.5">접근성 정보</p>
                     <p className="text-xs font-bold text-white">휠체어 구역 6석 · 보조견 동반 가능 구역</p>
                   </div>
                </div>
                
                <div className="p-4 bg-zinc-900/50 border border-zinc-800 rounded-xl flex items-center gap-4">
                   <div className="w-10 h-10 rounded-full bg-blue-400/20 flex items-center justify-center">
                     <MapPin className="w-5 h-5 text-blue-400" />
                   </div>
                   <div>
                     <p className="text-[10px] font-black text-zinc-500 mb-0.5">추천 좌석 (VR 확인 완료)</p>
                     <p className="text-xs font-bold text-white">1층 B구역 12열 (단차 가림 없음)</p>
                   </div>
                </div>
             </div>

             <div className="flex gap-3 w-full">
               <button 
                 onClick={() => { setSeatModalOpen(false); setVrMode(true); }}
                 className="flex-1 py-4 bg-cyan-400 text-black font-black text-sm rounded-xl flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(34,211,238,0.4)]"
               >
                 <MapPin className="w-4 h-4" /> VR 시야 확인
               </button>
               <button 
                 onClick={() => setSeatModalOpen(false)}
                 className="px-8 py-4 bg-zinc-800 text-white font-black text-sm rounded-xl hover:bg-zinc-700 transition-colors"
               >
                 닫기
               </button>
             </div>
          </div>
        </BottomSheet>
       </div>
    </div>
  );
}
