import React from 'react';
import PriceCardsSection from '../components/PriceCardsSection'; // Import component chung

// Màu sắc và Style nhất quán với About.tsx
const ACCENT_COLOR = '#ec4899'; // pink-500 (Màu điểm nhấn Neon)
const PRIMARY_CARD_BG = '#1e293b'; // slate-800 (Màu nền các Card lớn)
const BACKGROUND_COLOR = '#0f172a'; // slate-900 (Màu nền trang)

function ServiceRates() {

  return (
    <section
      className="py-20 min-h-screen relative overflow-hidden" 
      style={{
        backgroundColor: BACKGROUND_COLOR, // Áp dụng nền tối
        fontFamily: "'Roboto', sans-serif",
        // Thêm hiệu ứng lưới/noise background cho cảm giác tech/AI
        backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25' viewBox='0 0 100 100'%3E%3Cdefs%3E%3Cpattern id='p' width='20' height='20' patternUnits='userSpaceOnUse'%3E%3Cpath fill='%231f2937' d='M5 10a5 5 0 1 1 0-10 5 5 0 0 1 0 10z'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='%230f172a'/%3E%3Crect width='100%25' height='100%25' fill='url(%23p)' opacity='0.08'/%3E%3C/svg%3E\")",
      }}
    >
      
      {/* HIỆU ỨNG BACKGROUND MỜ */}
      {/* Blur màu pink - Nổi bật phía trên và có hiệu ứng chớp nhẹ */}
      <div 
        className="absolute top-0 left-1/2 w-96 h-96 -translate-x-1/2 rounded-full opacity-40 blur-[150px] animate-pulse-slow" 
        style={{ background: ACCENT_COLOR, zIndex: 0 }}
      ></div>
      {/* Blur màu Blue - Phía dưới */}
      <div 
        className="absolute bottom-[-100px] right-0 w-80 h-80 rounded-full opacity-20 blur-[150px] " 
        style={{ background: '#3b82f6', zIndex: 0 }}
      ></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* TIÊU ĐỀ CHÍNH - Tinh chỉnh thêm Subtitle và Separator */}
        <div className="text-center mb-16">
            <h2 
              className="text-4xl md:text-5xl lg:text-6xl font-extrabold uppercase tracking-wider transition-all duration-300 mb-4"
              style={{ 
                color: 'white', 
                fontFamily: 'Saira, sans-serif', 
                // Hiệu ứng phát sáng Neon
                textShadow: `0 0 5px ${ACCENT_COLOR}, 0 0 10px ${ACCENT_COLOR}99, 0 0 20px ${ACCENT_COLOR}66`
              }}
            >
              <span style={{ color: ACCENT_COLOR }}>BẢNG</span> GIÁ DỊCH VỤ BOT <span style={{ color: ACCENT_COLOR }}>AI</span>
            </h2>
            
            <p className="text-xl text-gray-400 font-light max-w-3xl mx-auto mb-6">
                Lựa chọn gói dịch vụ tối ưu để bot AI của chúng tôi bắt đầu gia tăng lợi nhuận cho bạn. Cam kết lợi nhuận, minh bạch chi phí.
            </p>

            {/* Separator theo phong cách công nghệ */}
            <div className="flex justify-center items-center">
                <div className="w-16 h-1 rounded-full" style={{ backgroundColor: ACCENT_COLOR, boxShadow: `0 0 8px ${ACCENT_COLOR}` }}></div>
                <div className="mx-4 w-2 h-2 rounded-full" style={{ backgroundColor: ACCENT_COLOR }}></div>
                <div className="w-16 h-1 rounded-full" style={{ backgroundColor: ACCENT_COLOR, boxShadow: `0 0 8px ${ACCENT_COLOR}` }}></div>
            </div>
        </div>


        {/* SỬ DỤNG COMPONENT CHUNG */}
        <PriceCardsSection 
          homeMode={false} 
          // Truyền các props màu sắc đã được định nghĩa
          accentColor={ACCENT_COLOR} 
          primaryColor={PRIMARY_CARD_BG}
        /> 
        
      </div>

      {/* CSS cho hiệu ứng động */}
      <style>{`
        @keyframes pulse-slow {
          0%, 100% {
            opacity: 0.4;
          }
          50% {
            opacity: 0.55;
          }
        }
        .animate-pulse-slow {
          animation: pulse-slow 6s infinite ease-in-out;
        }
      `}</style>
    </section>
  );
}

export default ServiceRates;