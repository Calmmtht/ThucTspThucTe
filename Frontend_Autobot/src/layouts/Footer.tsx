import { MailOutlined, PhoneOutlined } from '@ant-design/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faTiktok, faXTwitter } from '@fortawesome/free-brands-svg-icons';
import iconBot from "/src/assets/iconbot.png";
import React from 'react';

function TradingBotFooter() {
  // Màu sắc chính: Dark Mode/Techno
  const footerBgColor = '#181825'; // Rất tối
  const accentColor = '#ec4899'; // Pink Neon

  // Utility component cho Link
  const FooterLink: React.FC<{ children: React.ReactNode, to: string }> = ({ children, to }) => (
    <a 
        href={to} 
        className="block text-gray-300 hover:text-white transition duration-300 hover:translate-x-1"
    >
        {children}
    </a>
  );

  return (
    <footer className="text-white text-base px-6 py-12 border-t border-slate-800" style={{ backgroundColor: footerBgColor }}>
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10 lg:gap-12">

        {/* Cột 1: Logo & Tên Thương Hiệu */}
        <div className="col-span-2 md:col-span-1 flex flex-col items-start md:items-start space-y-4">
          <div className="flex items-center space-x-2">
            <img src={iconBot} alt="logo" className="h-10 w-10" />
            <span 
              className="text-2xl font-bold" 
              style={{ fontFamily: 'Roboto, sans-serif' }}
            >
              Trading<span style={{ color: accentColor }}>Bot</span>
            </span>
          </div>
          <p className="text-gray-400 text-sm max-w-xs text-left">
            Nền tảng giao dịch tự động phái sinh, tối ưu hóa lợi nhuận với công nghệ Bot AI tiên tiến.
          </p>
        </div>

        {/* Cột 2: Liên hệ */}
        <div className="col-span-1">
          <h3 
            className="font-bold mb-4 text-lg uppercase"
            style={{ color: accentColor }}
          >
            Liên Hệ
          </h3>
          <p className="text-gray-300 font-semibold mb-2">Lý Đức Minh</p>
          <div className="space-y-1 text-gray-400">
              <a href="tel:0936793913" className="flex items-center gap-3 hover:text-white transition duration-300">
                <PhoneOutlined className="text-lg" /> 
                <span className="text-sm">0936793913</span>
              </a>
              <a href="mailto:ducminh200692@gmail.com" className="flex items-center gap-3 hover:text-white transition duration-300">
                <MailOutlined className="text-lg" /> 
                <span className="text-sm">ducminh200692@gmail.com</span>
              </a>
              <p className="text-xs pt-2">Hỗ trợ: Thứ 2 - Thứ 7 (8:00 - 19:30)</p>
          </div>
        </div>

        {/* Cột 3: Về chúng tôi (Sử dụng FooterLink) */}
        <div className="col-span-1">
          <h3 
            className="font-bold mb-4 text-lg uppercase"
            style={{ color: accentColor }}
          >
            Về Chúng Tôi
          </h3>
          <ul className="space-y-2 text-sm">
            <li><FooterLink to="/about">Giới Thiệu</FooterLink></li>
            <li><FooterLink to="/guide">Hướng Dẫn</FooterLink></li>
            <li><FooterLink to="/privacy">Chính sách bảo mật</FooterLink></li>
            <li><FooterLink to="/terms">Điều khoản sử dụng</FooterLink></li>
          </ul>
        </div>

        {/* Cột 4: Mạng xã hội */}
        <div className="col-span-2 md:col-span-1">
          <h3 
            className="font-bold mb-4 text-lg uppercase"
            style={{ color: accentColor }}
          >
            Theo Dõi
          </h3>
          <div className="flex space-x-6 text-2xl">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" 
               className="text-gray-400 hover:text-blue-500 transition duration-300 transform hover:scale-110">
              <FontAwesomeIcon icon={faFacebook} />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"
               className="text-gray-400 hover:text-white transition duration-300 transform hover:scale-110">
              <FontAwesomeIcon icon={faXTwitter} />
            </a>
            <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer"
               className="text-gray-400 hover:text-red-500 transition duration-300 transform hover:scale-110">
              <FontAwesomeIcon icon={faTiktok} />
            </a>
          </div>
        </div>
      </div>

      {/* Dòng bản quyền - Cải tiến border */}
      <div className="mt-10 text-center text-xs border-t border-slate-700 pt-4 text-gray-400">
        © 2025 TradingBot. All Rights Reserved.
      </div>
    </footer>
  );
}

export default TradingBotFooter;