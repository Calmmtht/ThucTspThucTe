import React, { useState } from 'react';
import { DatePicker, Button, Spin, Statistic, Card } from 'antd';
import UnifiedTable from '../components/UnifiedTable';
import { DownloadOutlined, SyncOutlined } from '@ant-design/icons';
import type { Dayjs } from 'dayjs';

const { RangePicker } = DatePicker;

// Định nghĩa kiểu dữ liệu cho giao dịch
interface TransactionData {
  key: string;
  time: string;
  type: 'LONG' | 'SHORT';
  close: number;
  sl: number;
  contract: number;
  match: number;
  profit: number;
}

const Backtest: React.FC = () => {
  const [dates, setDates] = useState<[Dayjs | null, Dayjs | null] | null>(null);
  const [loading, setLoading] = useState(false);
  const [backtestData, setBacktestData] = useState<TransactionData[]>([]);
  const [winRate, setWinRate] = useState<number | null>(null);
  // Đã loại bỏ hasRunBacktest

  const handleBacktest = () => {
    if (!dates || !dates[0] || !dates[1]) {
      alert("Vui lòng chọn khoảng thời gian để Backtest.");
      return;
    }
    setLoading(true);
    // Reset kết quả về trạng thái ban đầu
    setBacktestData([]);
    setWinRate(null);

    // Bắt đầu gọi API Backtest (thay thế setTimeout này bằng hàm fetch API thực tế)
    console.log(`Bắt đầu Backtest từ ${dates[0]?.format('YYYY-MM-DD')} đến ${dates[1]?.format('YYYY-MM-DD')}`);

    setTimeout(() => {
      setLoading(false);

      // ⚠️ Gán kết quả THẬT từ API vào đây (Ví dụ):
      const apiResponseWinRate: number | null = 78.5; // Giả sử nhận từ API
      const apiResponseData: TransactionData[] = [
        // { key: '1', time: '2024-07-20 09:15', type: 'LONG', close: 1250, sl: 1248, contract: 10, match: 1251, profit: 1000000 },
        // ... Log giao dịch THẬT từ API
      ];

      setWinRate(apiResponseWinRate);
      setBacktestData(apiResponseData);
      
      // Kịch bản: Nếu bot không vào lệnh nào, data là [], nhưng vẫn có thể có winRate (ví dụ 100% nếu 0/0)
      // Tùy theo logic backend, bạn có thể set winRate = 0 hoặc null nếu không có giao dịch.
      if (apiResponseData.length === 0) {
        setWinRate(0); // Ví dụ: Set win rate 0% nếu không có giao dịch
      }
      
    }, 2000); // 2 giây mô phỏng độ trễ của API
  };

  const onRetry = () => {
    handleBacktest();
  };

  const columns = [
    { title: 'Thời gian', dataIndex: 'time', key: 'time', width: 140 },
    {
      title: 'Loại lệnh',
      dataIndex: 'type',
      key: 'type',
      render: (type: 'LONG' | 'SHORT') => (
        <span className={`font-semibold ${type === 'LONG' ? 'text-green-600' : 'text-red-600'}`}>
          {type}
        </span>
      )
    },
    { title: 'Giá chốt', dataIndex: 'close', key: 'close' },
    { title: 'SL', dataIndex: 'sl', key: 'sl' },
    { title: 'Số HĐ', dataIndex: 'contract', key: 'contract' },
    { title: 'Giá khớp', dataIndex: 'match', key: 'match' },
    {
      title: 'Lợi nhuận (VND)',
      dataIndex: 'profit',
      key: 'profit',
      render: (profit: number) => (
        <span className={`font-bold ${profit > 0 ? 'text-green-600' : profit < 0 ? 'text-red-600' : 'text-gray-500'}`}>
          {profit.toLocaleString('vi-VN')}
        </span>
      )
    },
  ];

  // Tính Tổng lợi nhuận dựa trên backtestData (dữ liệu thật)
  const totalProfit = backtestData.reduce((sum, record) => sum + record.profit, 0);

  // --- RENDERING ---
  return (
    <div className="min-h-screen p-6 md:p-10 lg:p-16 bg-gray-50">
      <h1 className="text-4xl font-extrabold text-center text-cyan-600 mb-12 shadow-text">
        <span className="border-b-4 border-cyan-500 pb-1">TÍNH NĂNG BACKTEST BOT</span>
      </h1>

      {/* Grid: Thông tin bot, Bộ lọc, Tỉ lệ thắng */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">

        {/* THÔNG TIN BOT (Bot Info) */}
        <Card className="rounded-xl shadow-2xl transition-transform duration-300 hover:scale-[1.01] border-l-4 border-cyan-500">
          <h2 className="text-xl text-cyan-600 font-bold mb-4 flex items-center justify-center">THÔNG TIN BOT</h2>
          <p className="text-gray-800 text-lg"><strong>Tên bot:</strong> BOT VIP</p>
          <p className="text-gray-500 text-sm mt-1">
            <strong className="text-gray-700">Khung TG:</strong> 5 phút | <strong className="text-gray-700">Giá khớp:</strong> Giá mở cửa sau nến tín hiệu
          </p>
          <p className="text-gray-500 text-sm mt-3">
            <strong className="text-gray-700">Thời gian Backtest:</strong> {dates && winRate !== null ? `${dates[0]?.format('DD/MM/YYYY')} - ${dates[1]?.format('DD/MM/YYYY')}` : 'Chưa chạy'}
          </p>
        </Card>

        {/* BỘ LỌC VÀ THỰC THI (Filter and Execute) */}
        <Card className="rounded-xl shadow-2xl transition-transform duration-300 hover:scale-[1.01] border-l-4 border-blue-500">
          <h2 className="text-xl text-blue-600 font-bold mb-4 text-center">CHỌN KHOẢNG THỜI GIAN</h2>
          <div className="flex flex-col gap-4 items-center">
            <RangePicker
              style={{ width: '100%', height: '40px' }}
              onChange={setDates}
              disabled={loading}
              format="DD/MM/YYYY"
            />
            <Button
              type="primary"
              size="large"
              className="w-full font-bold transition-all duration-300 rounded-lg"
              style={{ backgroundColor: '#06b6d4', borderColor: '#06b6d4' }}
              onClick={handleBacktest}
              loading={loading}
              icon={<SyncOutlined spin={loading} />}
            >
              {loading ? 'Đang Backtest...' : 'Thực hiện Backtest'}
            </Button>
            <Button
              size="large"
              className="w-full font-semibold rounded-lg"
              icon={<DownloadOutlined />}
              disabled={backtestData.length === 0}
            >
              Tải xuống CSV
            </Button>
          </div>
        </Card>

        {/* KẾT QUẢ TỈ LỆ THẮNG (Win Rate Result) */}
        <Card className="rounded-xl shadow-2xl transition-transform duration-300 hover:scale-[1.01] border-l-4 border-green-500">
          <h2 className="text-xl text-green-600 font-bold mb-4 text-center">TỔNG KẾT</h2>
          <div className="flex flex-col items-center justify-center">
            {loading ? (
              <Spin size="large" />
            ) : (
              // winRate !== null đảm bảo đã có kết quả chạy
              winRate !== null ? (
                <>
                  {/* Vòng tròn Tỉ lệ thắng */}
                  <div
                    className="rounded-full w-36 h-36 flex items-center justify-center border-4 border-green-500 shadow-lg"
                    style={{
                      // Sử dụng winRate thật
                      background: `conic-gradient(#10b981 0% ${winRate}%, #f3f4f6 ${winRate}% 100%)`,
                      fontSize: '28px',
                      fontWeight: 'bold',
                      color: '#1f2937',
                    }}
                  >
                    {/* Giá trị Tỉ lệ thắng */}
                    {`${Math.round(winRate)}%`}
                  </div>

                  {/* Tổng Lợi Nhuận */}
                  <Statistic
                    title="Tổng Lợi Nhuận"
                    value={totalProfit} // Sử dụng totalProfit tính từ backtestData thật
                    precision={0}
                    suffix="VND"
                    className="mt-4 text-center"
                    valueStyle={{ color: totalProfit >= 0 ? '#10b981' : '#ef4444', fontWeight: 'bold' }}
                    formatter={(value) => value.toLocaleString('vi-VN')}
                  />
                </>
              ) : (
                <div className="text-center p-4">
                  <p className="text-gray-500 text-lg font-semibold">
                    Kết quả sẽ hiển thị ở đây sau khi Backtest.
                  </p>
                  <p className="text-gray-400 text-sm mt-1">
                    (Tỉ lệ thắng và Lợi nhuận)
                  </p>
                </div>
              )
            )}
          </div>
        </Card>
      </div>

      {/* Bảng giao dịch */}
      <Card
        title={<h2 className="text-2xl font-bold text-cyan-600">DANH SÁCH GIAO DỊCH (LOGS)</h2>}
        className="rounded-xl shadow-2xl"
      >
        {/* Chỉ cần truyền data, UnifiedTable sẽ xử lý Loading và Empty State */}
        <UnifiedTable
          type="backtest"
          columns={columns}
          data={backtestData} 
          loading={loading}
          error={null}
          onRetry={onRetry}
        />
      </Card>
    </div>
  );
};

export default Backtest;