import React from 'react';
import { DatePicker, Button, Table, Empty } from 'antd';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;

const Backtest: React.FC = () => {
  const columns = [
    { title: 'Thời gian', dataIndex: 'time', key: 'time' },
    { title: 'Loại lệnh', dataIndex: 'type', key: 'type' },
    { title: 'Giá chốt', dataIndex: 'close', key: 'close' },
    { title: 'SL', dataIndex: 'sl', key: 'sl' },
    { title: 'Số hợp đồng', dataIndex: 'contract', key: 'contract' },
    { title: 'Giá khớp', dataIndex: 'match', key: 'match' },
    { title: 'Lợi nhuận', dataIndex: 'profit', key: 'profit' },
  ];

  return (
    <div className="min-h-screen px-10 py-10 bg-white">
      <h1 className="text-3xl font-bold text-center text-cyan-600 mb-10">
        Tính năng bot
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {/* Thông tin bot */}
        <div className="border rounded-lg p-6 shadow-sm bg-white">
          <h2 className="text-center text-cyan-600 font-semibold mb-3">THÔNG TIN BOT</h2>
          <p><strong>Tên bot:</strong> BOT VIP</p>
          <p className="text-gray-500 text-sm mt-1">
            Khung TG 5 phút | Giá khớp lệnh: Giá mở cửa sau nến tín hiệu
          </p>
          <p className="text-gray-500 text-sm mt-2">
            <strong>Thời gian Backtest:</strong> -
          </p>
        </div>

        {/* Bộ lọc thời gian */}
        <div className="border rounded-lg p-6 shadow-sm bg-white">
          <h2 className="text-center text-cyan-600 font-semibold mb-3">THÔNG TIN CHI TIẾT</h2>
          <div className="flex flex-col gap-4 items-center">
            <RangePicker style={{ width: '100%' }} />
            <Button type="primary">Backtest</Button>
          </div>
        </div>

        {/* Tỉ lệ thắng */}
        <div className="border rounded-lg p-6 shadow-sm flex items-center justify-center flex-col bg-white">
          <h2 className="text-cyan-600 font-semibold mb-4">TỈ LỆ THẮNG</h2>
          <div
            className="rounded-full w-36 h-36 flex items-center justify-center"
            style={{
              background: 'conic-gradient(#86efac 0% 95%, #f5f5f5 95% 100%)',
              fontSize: '28px',
              fontWeight: 'bold',
              color: '#000',
            }}
          >
            95%
          </div>
        </div>
      </div>

      {/* Bảng giao dịch */}
      <h2 className="text-2xl font-bold text-center text-cyan-600 mb-6">
        Danh sách giao dịch
      </h2>

      <Table
        columns={columns}
        dataSource={[]} // bạn có thể thay thế bằng dữ liệu thật sau
        locale={{
          emptyText: (
            <Empty
              description="No Data"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          ),
        }}
        bordered
      />
    </div>
  );
};

export default Backtest;
