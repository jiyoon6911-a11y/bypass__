import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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

  // Mock fetching show details
  const show = {
    id: showId,
    title: showId === '1' ? '오페라의 유령' : showId === '2' ? '햄릿' : '특별 연극',
    venue: showId === '1' ? '샤롯데씨어터' : showId === '2' ? '국립극장 해오름' : '한림대학교 10관',
    date: '2026.05.28 ~ 2026.08.15',
    type: '연극',
    rating: '8.5',
    description: '다양한 접근성을 지원하는 무대',
    cast: '홍길동, 김철수, 이영희',
    ticketOpen: '2026.05.20 14:00',
    facilities: ['점자 블록/안내문', '휠체어 접근 가능', '자막 제공', '음성해설'],
    showReviews: [
      { id: 1, author: '연극러버', rating: 5, text: '배우들의 연기력이 미쳤어요.' },
      { id: 2, author: '관극매니아', rating: 4, text: '무대 연출이 신선하고 좋았습니다!' }
    ],
    venueReviews: [
      { id: 1, author: '휠체어이용자', rating: 5, text: '경사로가 잘 되어있어서 이동이 편리했습니다.' },
      { id: 2, author: '시각장애인', rating: 4, text: '점자 블록과 음성 안내가 잘 구비되어 있어서 헤매지 않고 입장했어요.' }
    ],
    providers: [
      { name: '인터파크 티켓', color: 'text-red-400 bg-red-400/10 border-red-400/30' },
      { name: '멜론티켓', color: 'text-green-400 bg-green-400/10 border-green-400/30' }
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
       {/* Hero Cover */}
       <div className="relative h-64 bg-zinc-900 border-b border-zinc-800 flex items-end p-5">
         <button onClick={() => navigate(-1)} className="absolute top-5 left-5 w-10 h-10 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center z-10 border border-white/10 text-white hover:bg-black/70 transition-colors">
            <ChevronLeft className="w-6 h-6" />
         </button>
         <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent"></div>
         <div className="relative z-10 flex gap-4 w-full items-end">
            <div className="w-24 h-32 bg-zinc-800 rounded-xl shadow-2xl border border-zinc-700 shrink-0 overflow-hidden">
               {/* Cover Image Placeholder */}
               <div className="w-full h-full bg-gradient-to-tr from-cyan-900 to-black"></div>
            </div>
            <div className="flex-1 pb-1">
               <span className="px-2 py-0.5 rounded text-[10px] font-black bg-cyan-400 text-black mb-2 inline-block">{show.type}</span>
               <h1 className="text-2xl font-black mb-1">{show.title}</h1>
               <p className="text-zinc-400 text-sm font-medium flex items-center gap-1"><MapPin className="w-3 h-3"/> {show.venue}</p>
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

        {/* Booking Links directly on top */}
        <section>
          <h2 className="text-lg font-black mb-3">티켓 예매 등 바로가기</h2>
          <div className="space-y-3">
            {show.providers.map(p => (
              <a href="#" key={p.name} className="flex justify-between items-center bg-zinc-900 p-4 rounded-xl border border-zinc-800 hover:border-cyan-400/50 transition-colors">
                <span className={cn("text-xs font-black px-2 py-1 rounded inline-block border", p.color)}>{p.name}</span>
                <span className="flex items-center gap-1 text-xs font-bold text-white"><ExternalLink className="w-3 h-3" /> 예매하기</span>
              </a>
            ))}
          </div>
        </section>

        {/* Detailed Seat Map Modal */}
        <BottomSheet isOpen={seatModalOpen} onClose={() => setSeatModalOpen(false)} title="상세 좌석 배치도">
          <div className="bg-black p-6 rounded-2xl flex flex-col items-center relative overflow-hidden border border-zinc-800">
             {/* Header like the image */}
             <div className="w-full text-center mb-8 relative">
                <h3 className="text-cyan-400 font-bold text-sm tracking-widest leading-relaxed">
                  (강의실 무대)<br/>
                  (LECTURE STAGE)
                </h3>
                <div className="absolute top-0 right-2 text-[10px] font-bold text-cyan-400/60 text-right leading-tight">
                  (앞문)<br/>
                  (FRONT DOOR)
                </div>
             </div>

             {/* Seating Layout - More Detailed */}
             <div className="w-full flex flex-col gap-2.5 max-w-sm mx-auto border-x border-t border-cyan-800/40 p-6 bg-zinc-900/30 rounded-t-3xl">
                {['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K'].map((row) => (
                  <div key={row} className="flex gap-3 justify-center items-center">
                    <span className="text-xs font-black text-cyan-400 w-4">{row}</span>
                    
                    {/* Left Block */}
                    <div className="flex gap-1">
                      {Array.from({ length: row === 'K' ? 4 : 8 }).map((_, i) => (
                        <div key={`L-${i}`} className="w-4 h-5 rounded-md border border-cyan-400/40 bg-cyan-400/10 flex items-center justify-center">
                          <span className="text-[6px] text-cyan-400/80 font-bold">{i + 1}</span>
                        </div>
                      ))}
                    </div>

                    {/* Aisle */}
                    <div className="w-8 border-x border-cyan-900/20 bg-cyan-900/5 h-5" />

                    {/* Right Block */}
                    <div className="flex gap-1">
                      {Array.from({ length: 8 }).map((_, i) => (
                        <div key={`R-${i}`} className="w-4 h-5 rounded-md border border-cyan-400/40 bg-cyan-400/10 flex items-center justify-center">
                          <span className="text-[6px] text-cyan-400/80 font-bold">{i + 9}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                
                {/* Visual refinement for the aisle floor */}
                <div className="h-4" />
                
                {/* Doors and Bottom borders */}
                <div className="flex justify-between items-start pt-4 border-t border-cyan-800/40">
                   <div className="text-[10px] font-bold text-cyan-400/60 leading-tight">
                     (뒷문)<br/>
                     (REAR DOOR)
                   </div>
                   <div className="text-[10px] font-bold text-cyan-400/60 text-right leading-tight">
                     (뒷문)<br/>
                     (REAR DOOR)
                   </div>
                </div>
             </div>

             <div className="mt-8 grid grid-cols-2 gap-4 w-full">
                <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl">
                   <p className="text-[10px] font-black text-zinc-500 mb-1">극장 정보</p>
                   <p className="text-sm font-bold text-white">강의실 10관</p>
                </div>
                <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl">
                   <p className="text-[10px] font-black text-zinc-500 mb-1">잔여 좌석</p>
                   <p className="text-sm font-bold text-cyan-400">42석 / 180석</p>
                </div>
             </div>

             <button 
               onClick={() => setSeatModalOpen(false)}
               className="w-full mt-6 py-4 bg-zinc-800 text-white font-black text-sm rounded-xl hover:bg-zinc-700 transition-colors"
             >
               닫기
             </button>
          </div>
        </BottomSheet>

       </div>
    </div>
  );
}
