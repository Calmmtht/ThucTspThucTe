import React, { useEffect, useState } from 'react';
import { Select, DatePicker, Table, message } from 'antd';
import moment from 'moment';
import LogHistoryService from '../services/logHistoryService';
import type { LogHistory } from '../services/logHistoryService';
import { authService } from '../services/authService';

const { Option } = Select;

const LogHistory: React.FC = () => {
  const [filterType, setFilterType] = useState('all');
  const [selectedDate, setSelectedDate] = useState<moment.Moment | null>(null);
  const [logs, setLogs] = useState<any[]>([]);
  const [countSL, setCountSL] = useState<number>(0);

  const columns = [
    { title: 'THỜI GIAN', dataIndex: 'time', key: 'time' },
    { title: 'LOẠI LỆNH', dataIndex: 'type', key: 'type' },
    { title: 'GIÁ CHỐT', dataIndex: 'closePrice', key: 'closePrice' },
    { title: 'SL', dataIndex: 'sl', key: 'sl' },
    { title: 'SỐ HỢP ĐỒNG', dataIndex: 'contract', key: 'contract' },
    { title: 'GIÁ KHỚP', dataIndex: 'matchPrice', key: 'matchPrice' },
    { title: 'LỢI NHUẬN', dataIndex: 'profit', key: 'profit' },
  ];

  const mapToFrontend = (logsFromBackend: LogHistory[]): any[] => {
    return logsFromBackend.map(log => ({
      key: log.id,
      time: new Date(log.dateTime).toLocaleString(),
      type: log.signal,
      closePrice: log.profitPointTP,
      sl: log.isSL ? '✔' : '',
      contract: log.numberContract,
      matchPrice: log.priceBuy,
      profit: log.profit,
    }));
  };

  const fetchLogs = async () => {
    try {
      const user = authService.getCurrentUser();
      if (!user) {
        return message.error('Vui lòng đăng nhập lại');
      }

      let res;

      if (filterType === 'all') {
        res = await LogHistoryService.getAll();
        setLogs(mapToFrontend(res.logHistory));
      } else if (selectedDate) {
        const year = selectedDate.year();
        const month = selectedDate.month() + 1;
        const day = selectedDate.date();

        switch (filterType) {
          case 'year':
            res = await LogHistoryService.getByYear(year, user.userId);
            break;
          case 'month':
            res = await LogHistoryService.getByMonth(month, year, user.userId);
            break;
          case 'day':
            res = await LogHistoryService.getByDay(day, month, year, user.userId);
            break;
          default:
            return;
        }

        setLogs(mapToFrontend(res.logHistoryList));
      } else {
        return message.warning('Vui lòng chọn ngày/tháng/năm trước khi lọc');
      }

      setCountSL(res.countSL ?? 0);
    } catch (err) {
      message.error('Không thể tải dữ liệu lịch sử');
    }
  };

  useEffect(() => {
    if (filterType === 'all') {
      fetchLogs();
    } else if (selectedDate) {
      fetchLogs();
    } else {
      setLogs([]);
      setCountSL(0);
    }
  }, [filterType, selectedDate]);

  const handleFilterChange = (value: string) => {
    setFilterType(value);
    setSelectedDate(null);
  };

  const handleDateChange = (date: moment.Moment | null) => {
    setSelectedDate(date);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ textAlign: 'center', color: '#2941a0' }} className='text-2xl font-bold mb-2'>LỊCH SỬ GIAO DỊCH</h1>

      <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <Select defaultValue="all" style={{ width: 120 }} onChange={handleFilterChange}>
          <Option value="all">Tất cả</Option>
          <Option value="year">Theo năm</Option>
          <Option value="month">Theo tháng</Option>
          <Option value="day">Theo ngày</Option>
        </Select>

        {filterType === 'year' && (
          <DatePicker picker="year" onChange={handleDateChange} />
        )}
        {filterType === 'month' && (
          <DatePicker picker="month" onChange={handleDateChange} />
        )}
        {filterType === 'day' && (
          <DatePicker onChange={handleDateChange} />
        )}
      </div>

      <p style={{ marginBottom: '12px', color: '#fff' }}>Số lệnh Stop Loss: {countSL}</p>

      <Table columns={columns} dataSource={logs} pagination={false} />
    </div>
  );
};

export default LogHistory;
