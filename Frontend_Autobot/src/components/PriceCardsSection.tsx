// PriceCardsSection.tsx

import iconBot from "/src/assets/iconbot.png"; 
import iconBot2 from "/src/assets/iconbothi.jpg"; 
import { useEffect, useState } from 'react';
import { priceBotService, type PriceBot } from '../services/priceBotService';
import { botTradingService } from '../services/botService';
import { paymentService } from '../services/paymentService';
import { authService } from '../services/authService';
import { Button, message, Card } from 'antd'; 

// Thêm hook useNavigate
import { useNavigate } from 'react-router-dom';

// Định nghĩa props để component có thể tái sử dụng
export interface PriceCardsSectionProps {
  // homeMode: true sẽ hiển thị chỉ 4 gói đầu tiên cho trang chủ
  homeMode?: boolean; 
  
  // THÊM HAI PROPS MÀU SẮC BỊ THIẾU
  accentColor: string; 
  primaryColor: string;
}

// Bắt đầu component chính
const PriceCardsSection: React.FC<PriceCardsSectionProps> = ({ 
    homeMode = false,
    // Cập nhật để nhận props mới
    accentColor, 
    primaryColor, 
}) => {
  const navigate = useNavigate(); // Khai báo navigate
  const [groupedPriceBots, setGroupedPriceBots] = useState<{
    [botId: number]: PriceBot[];
  }>({});
  const [botNames, setBotNames] = useState<{
    [botId: number]: string;
  }>({});
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // Logic Buy Now (Đã Cập Nhật để chuyển hướng nếu chưa đăng nhập)
  const handleBuyNow = async (month: number, botTradingId: number) => {
    try {
      const user = authService.getCurrentUser();
      if (!user) {
        message.warning("Vui lòng đăng nhập hoặc đăng ký để tiếp tục.");
        // CHUYỂN HƯỚNG ĐẾN TRANG ĐĂNG NHẬP
        navigate('/login'); 
        return;
      }
      const request = {
        userId: user.userId,
        month: month,
        botTradingId: botTradingId,
        returnUrl: `${window.location.origin}/success`,
        cancelUrl: `${window.location.origin}/cancel`,
      };
      const response = await paymentService.createPaymentLink(request);
      if (response) {
        window.open(response.data, "_blank");
      } else {
        message.error("Không nhận được liên kết thanh toán từ máy chủ.");
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Đã xảy ra lỗi khi tạo liên kết thanh toán.';
      message.error(errorMessage);
      console.error('Lỗi khi thanh toán:', error);
    }
  };


  useEffect(() => {
    const user = authService.getCurrentUser();
    setIsLoggedIn(!!user);

    const fetchData = async () => {
      setLoading(true);
      try {
        let priceBotsData = await priceBotService.getAllPriceBots();
        const botTradingsData = await botTradingService.getAllBotTradings();

        // Trong Home Mode, chỉ lấy 4 gói đầu tiên.
        if (homeMode) {
            priceBotsData = priceBotsData.slice(0, 4);
        }

        // Group price bots by botTradingId
        const grouped = priceBotsData.reduce((acc, priceBot) => {
          if (!acc[priceBot.botTradingId]) {
            acc[priceBot.botTradingId] = [];
          }
          acc[priceBot.botTradingId].push(priceBot);
          return acc;
        }, {} as { [botId: number]: PriceBot[] });

        setGroupedPriceBots(grouped);

        // Create a map of bot IDs to names
        const namesMap = botTradingsData.reduce((acc, bot) => {
          acc[bot.id] = bot.name;
          return acc;
        }, {} as { [botId: number]: string });

        setBotNames(namesMap);

      } catch (error) {
        console.error("Error fetching bot price data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [homeMode]); 


  if (loading) {
    // Cập nhật style loading cho Dark Mode
    return <p className="text-center text-gray-400">Đang tải dữ liệu giá bot...</p>;
  }

  if (Object.keys(groupedPriceBots).length === 0) {
    // Cập nhật style thông báo cho Dark Mode
    return <p className="text-center text-gray-400">Không có dữ liệu giá bot.</p>;
  }
  
  // Render cho chế độ Home (hiển thị Card Ant Design)
  if (homeMode) {
    // ... (Code Home Mode cũ, bạn có thể áp dụng primaryColor và accentColor vào đây)
    const singlePriceBots = Object.values(groupedPriceBots).flat(); 
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 justify-items-center">
        {singlePriceBots.map((pkg, idx) => (
          <Card 
            key={idx} 
            className="rounded-2xl shadow-lg w-full max-w-xs transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 border-none"
            style={{ backgroundColor: primaryColor }} // Áp dụng primaryColor
          > 
            <div className="text-center p-4 text-white"> {/* Thêm text-white */}

              {pkg.discount > 0 && (
                <div className="relative w-14 h-14 ml-auto">
                  <div className="absolute inset-0 bg-red-600 rounded-full border-4 border-white border-dashed flex items-center justify-center">
                    <div className="text-right text-white">
                      <p className="text-xs font-bold">Giảm</p>
                      <p className="text-sm font-bold">{`${pkg.discount}%`}</p>
                    </div>
                  </div>
                </div>
              )}

              <img src={iconBot} alt="bot" className="w-32 h-32 mx-auto mb-4" />

              <h3 className="text-xl font-semibold mb-2" style={{ color: accentColor }}>{`${pkg.month} Tháng`}</h3> {/* Áp dụng accentColor */}

              <div className="flex items-center justify-center gap-2 mb-4">
                {pkg.discount > 0 ? (
                  <>
                    <span className="text-sm font-semibold text-gray-400 line-through" style={{textDecorationThickness: '1.5px'}}>
                      {pkg.price.toLocaleString('vi-VN')}&nbsp;VND
                    </span>
                    <span className="text-lg font-semibold text-green-400">
                      {(pkg.price * (1 - pkg.discount/100)).toLocaleString('vi-VN')}
                      <span className="text-sm ml-1">VND</span>
                    </span>
                  </>
                ) : (
                  <span className="text-lg font-semibold text-green-400">
                    {pkg.price.toLocaleString('vi-VN')}
                    <span className="text-sm ml-1">VND</span>
                  </span>
                )}
              </div>

              {pkg.description && (
                <p className="text-sm text-gray-300 mb-4">{pkg.description}</p>
              )}

              <Button 
                type="primary" 
                style={{ backgroundColor: accentColor, borderColor: accentColor }} // Áp dụng accentColor
                onClick={() => handleBuyNow(pkg.month, pkg.botTradingId)}
              >
                Mua ngay
              </Button>

            </div>
          </Card>
        ))}
      </div>
      );
  }

  // Render cho chế độ Services_Rates (hiển thị chi tiết theo từng bot) - Cần cập nhật style cho Dark Mode
  return (
    <div className="space-y-10">
      {Object.keys(groupedPriceBots).map((botId) => {
        const botPrices = groupedPriceBots[parseInt(botId)];
        const botName = botNames[parseInt(botId)] || `Bot ID ${botId}`;
        const CARD_BG_SLIGHTLY_DARKER = '#1f2937'; // slate-800

        return (
          <div key={botId} className="relative pt-6">
            {/* Khung viền và nội dung */}
            <div 
                className="p-8 rounded-2xl border-2 transition-all duration-500"
                style={{ 
                    backgroundColor: primaryColor, // Áp dụng primaryColor
                    borderColor: `${accentColor}40`, // Viền nhẹ với accentColor
                    boxShadow: `0 0 15px 5px ${accentColor}1A` 
                }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4  gap-10 justify-items-center">
                {botPrices.map((priceBot, index) => (
                  <div
                    key={index}
                    className="group relative rounded-2xl shadow-xl text-center hover:scale-[1.03] transition-transform flex flex-col overflow-hidden w-full max-w-sm"
                    style={{ backgroundColor: CARD_BG_SLIGHTLY_DARKER }} // Card package nền tối
                  >
                    <div className="p-6 flex-1 text-white"> {/* Thêm text-white */}
                      {priceBot.discount > 0 && (
                         <div className="absolute top-0 right-0 p-1 px-3 rounded-bl-lg text-sm font-bold text-white" style={{ backgroundColor: accentColor }}>
                           -{`${priceBot.discount}%`}
                        </div>
                      )}

                      {/* Icon display */}
                      <img
                        src={iconBot} 
                        alt="Bot Icon"
                        className="mx-auto w-16 h-16 mb-2 transition duration-300 group-hover:opacity-0 absolute inset-x-0 top-10"
                      />
                      <img
                        src={iconBot2} 
                        alt="Bot Icon Hover"
                        className="mx-auto w-16 h-16 mb-2 transition duration-300 opacity-0 group-hover:opacity-100"
                      />

                      {/* Title and Price */}
                      <h3 className="text-3xl font-extrabold mt-4" style={{ color: accentColor }}>{`${priceBot.month} THÁNG`}</h3> {/* Áp dụng accentColor */}
                      
                      <div className="flex flex-col items-center justify-center gap-1 mt-2">
                        {priceBot.discount > 0 ? (
                          <>
                            <span className="text-base font-semibold text-gray-500 line-through" style={{textDecorationThickness: '1.5px'}}>
                              {priceBot.price.toLocaleString('vi-VN')}&nbsp;VND
                            </span>
                            <span className="text-2xl font-bold text-green-400">
                              {(priceBot.price * (1 - priceBot.discount/100)).toLocaleString('vi-VN')}
                              <span className="text-base ml-1">VND</span>
                            </span>
                          </>
                        ) : (
                          <span className="text-2xl font-bold text-green-400">
                            {priceBot.price.toLocaleString('vi-VN')}
                            <span className="text-base ml-1">VND</span>
                          </span>
                        )}
                      </div>
                      
                      {/* Description if available */}
                      {priceBot.description && (
                          <p className="text-sm text-gray-300 mt-4 h-10 overflow-hidden">{priceBot.description}</p>
                      )}

                    </div>
                    <Button 
                      type="primary" 
                      className="w-full text-lg font-bold py-4 transition-colors rounded-t-none"
                      style={{ backgroundColor: accentColor, borderColor: accentColor }} // Áp dụng accentColor
                      onClick={() => handleBuyNow(priceBot.month, priceBot.botTradingId)}
                    >
                      Đăng ký
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Phần tiêu đề 'Giá dịch vụ' */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-900 border-2 px-6 py-2 rounded-full z-10"
                style={{ 
                    borderColor: accentColor, // Áp dụng accentColor
                    boxShadow: `0 0 10px ${accentColor}AA`
                }}
            >
              <h3 className="text-xl font-bold uppercase" style={{ fontFamily: 'Saira, sans-serif', color: 'white' }}>
                {`BOT: ${botName}`}
              </h3>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PriceCardsSection;