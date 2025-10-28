import { MailOutlined, PhoneOutlined } from '@ant-design/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faTiktok, faXTwitter } from '@fortawesome/free-brands-svg-icons';
import iconBot from "/src/assets/iconbot.png";

function TradingBotFooter() {
  return (
    <footer className="bg-blue-900 text-white text-sm px-6 py-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6">

        {/* Cột 1: Liên hệ */}
        <div>
          <h3 className="font-bold mb-2">LIÊN HỆ</h3>
          <p>Lý Đức Minh</p>
          <p className="flex items-center gap-2">
            <PhoneOutlined /> 0936793913
          </p>
          <p className="flex items-center gap-2">
            <MailOutlined /> ducminh200692@gmail.com
          </p>
          <p>Hỗ trợ: Thứ 2 - Thứ 7 (8:00 - 19:30)</p>
        </div>

        {/* Cột 2: Về chúng tôi */}
        <div>
          <h3 className="font-bold mb-2">VỀ CHÚNG TÔI</h3>
          <ul className="space-y-1">
            <li>Giới Thiệu</li>
            <li>Hướng Dẫn</li>
            <li>Chính sách bảo mật</li>
          </ul>
        </div>

        {/* Cột 3: Thông tin thêm */}
        <div>
          <h3 className="font-bold mb-2">THÔNG TIN THÊM</h3>
          <div className="flex space-x-4 text-xl">
            <FontAwesomeIcon icon={faXTwitter} />
            <FontAwesomeIcon icon={faFacebook} />
            <FontAwesomeIcon icon={faTiktok} />
          </div>
        </div>

        {/* Cột 4: Logo */}
        <div className="flex flex-col items-center justify-center">
          <img src={iconBot} className="h-14 mb-2" />
          <span className="text-lg font-semibold">TradingBot</span>
        </div>
      </div>

      {/* Dòng bản quyền */}
      <div className="mt-6 text-center text-xs border-t border-white pt-2">
        © 2025 TradingBot. All Right Service
      </div>
    </footer>
  );
}

export default TradingBotFooter;
