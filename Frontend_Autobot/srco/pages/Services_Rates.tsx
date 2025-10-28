import iconBot from "/src/assets/iconbotnew.png";
import iconBot2 from "/src/assets/iconbothi.jpg";
import { useEffect, useState } from 'react';
import { priceBotService, type PriceBot } from '../services/priceBotService';
import { botTradingService } from '../services/botService';
import { paymentService } from '../services/paymentService';
import { authService } from '../services/authService';
import { Button, message } from 'antd';

function ServiceRates() {
  const [groupedPriceBots, setGroupedPriceBots] = useState<{
    [botId: number]: PriceBot[];
  }>({});
  const [botNames, setBotNames] = useState<{
    [botId: number]: string;
  }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const priceBotsData = await priceBotService.getAllPriceBots();
        const botTradingsData = await botTradingService.getAllBotTradings();

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
  }, []);

//button buy--------------------------------------------------------------------

    const handleBuyNow = async (month: number, botTradingId: number) => {
  try {
    console.log("re..... handle Buy Now !!!!!!!!!!!!!!!!!");
    // 1. Kiểm tra xem người dùng đã đăng nhập chưa
    const user = authService.getCurrentUser();
    if (!user) {
      message.warning("Vui lòng đăng nhập để tiếp tục thanh toán.");
      return;
    }

    // 2. Chuẩn bị dữ liệu yêu cầu để tạo link thanh toán
    const request = {
      userId: user.userId,
      month: month,
      botTradingId: botTradingId,
      returnUrl: `${window.location.origin}/success`, // URL khi thanh toán thành công
      cancelUrl: `${window.location.origin}/cancel`,   // URL khi hủy thanh toán
    };

    console.log("re.....", request);
    // 3. Gọi API để tạo link thanh toáns
    // const response = await paymentService.createPaymentLink(request);
    const response = await paymentService.addUserBot(request);
    console.log(response); 
    // 4. Chuyển hướng người dùng đếns trang thanh toán
    // if (response) {
    //   // Mở link thanh toán trong một tab mới
    //   window.open(response.data, "_blank");
    // } else {
    //   message.error("Không nhận được liên kết thanh toán từ máy chủ.");
    // }
  } catch (error: any) {
    // 5. Xử lý lỗi nếu có
    const errorMessage = error.response?.data?.message || error.message || 'Đã xảy ra lỗi khi tạo liên kết thanh toán.';
    message.error(errorMessage);
    console.error('Lỗi khi thanh toán:', error);
  }
};

  const [isLoggedIn, setIsLoggedIn] = useState(false);

      useEffect(() => {
      const user = authService.getCurrentUser();
      setIsLoggedIn(!!user);
        }, []);


  return (
    <section
      className="py-16 bg-cover bg-center text-white min-h-screen"
      // style={{ backgroundImage: "url('/src/assets/service_rates_background2.jpg')" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-14" style={{ color: '#173D8D', textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>GÓI DỊCH VỤ</h2>

        {loading ? (
          <p className="text-center text-black">Đang tải dữ liệu giá bot...</p>
        ) : Object.keys(groupedPriceBots).length === 0 ? (
          <p className="text-center text-black">Không có dữ liệu giá bot.</p>
        ) : (
          // Render bot prices grouped by bot
          Object.keys(groupedPriceBots).map((botId) => {
            const botPrices = groupedPriceBots[parseInt(botId)];
            const botName = botNames[parseInt(botId)] || `Bot ID ${botId}`;

            return (
              <div key={botId} className="mb-10 relative">
                {/* Khung viền và nội dung */}
                <div className="p-6 border-2 border-black rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4  gap-10">
                    {botPrices.map((priceBot, index) => (
                      <div
                        key={index}
                        className="group relative text-gray-900 rounded-2xl shadow-xl text-center hover:scale-[1.03] transition-transform flex flex-col overflow-hidden w-[280px]"
                        style={{ backgroundColor: '#e0f2ff' }}
                      >
                        <div className="p-6 flex-1">
                          {priceBot.discount > 0 && (
                            <div className="relative w-14 h-14 ml-auto">
                              <div className="absolute inset-0 bg-red-600 rounded-full border-4 border-white border-dashed flex items-center justify-center">
                                <div className="text-right text-white">
                                  <p className="text-xs font-bold">Giảm</p>
                                  <p className="text-sm font-bold">{`${priceBot.discount}%`}</p>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Icon display - can be dynamic if bots have different icons */}
                          <img
                            src={iconBot} //ed on botId/name
                            alt="Bot Icon"
                            className="mx-auto mb-4 transition duration-300 group-hover:hidden"
                          />
                          <img
                            src={iconBot2} // Or a dynamic icon based on botId/name
                            alt="Bot Icon Hover"
                            className="mx-auto mb-4 transition duration-300 hidden group-hover:block"
                          />

                          {/* Title and Price */}
                          <h3 className="text-2xl font-bold">{`${priceBot.month} Tháng`}</h3>
                          <div className="flex items-center justify-center gap-2 mt-2">
                            {priceBot.discount > 0 ? (
                              <>
                                <span className="text-sm font-semibold text-gray-400 line-through" style={{textDecorationThickness: '1.5px'}}>
                                  {priceBot.price.toLocaleString('vi-VN')}&nbsp;VND
                                </span>
                                <span className="text-lg font-semibold text-green-600">
                                  {(priceBot.price * (1 - priceBot.discount/100)).toLocaleString('vi-VN')}
                                  <span className="text-sm ml-1">VND</span>
                                </span>
                              </>
                            ) : (
                              <span className="text-lg font-semibold text-green-600">
                                {priceBot.price.toLocaleString('vi-VN')}
                                <span className="text-sm ml-1">VND</span>
                              </span>
                            )}
                          </div>
                          
                          {/* Description if available */}
                          {priceBot.description && (
                              <p className="text-sm text-gray-600 mt-2">{priceBot.description}</p>
                          )}

                        </div>
                          {isLoggedIn && (
                          <Button 
                            className="w-full bg-black text-white py-3 text-sm font-semibold hover:bg-gray-800 transition-colors"
                            onClick={
                              () => handleBuyNow(priceBot.month, priceBot.botTradingId)
                              
                            }
                          >
                            Mua ngay services rate
                          </Button>
                          )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Phần tiêu đề 'Giá dịch vụ' */}
                <div className="absolute top-0 left-2 transform -translate-y-1/2 bg-white px-2">
                  <h3 className="text-xl font-bold" style={{ fontFamily: 'Orbitron, sans-serif', color: 'black' }}>
                    {`Giá dịch vụ: ${botName}`}
                  </h3>
                </div>
              </div>
            );
          })
        )}

      </div>
    </section>
  );
}

export default ServiceRates;
  