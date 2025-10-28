import React, { useEffect, useState, useCallback, useMemo } from "react";
// LỖI ĐƯỢC KHẮC PHỤC TẠI ĐÂY: Thêm 'Button' vào import
import { Select, DatePicker, message, Card, Statistic, Row, Col, Typography, Button } from "antd"; 
import moment from "moment";
import { authService } from "../services/authService";
import LogHistoryService from "../services/logHistoryService";
import type { LogHistory } from "../services/logHistoryService";
import UnifiedTable from "../components/UnifiedTable";
import { SyncOutlined, FallOutlined, AreaChartOutlined } from "@ant-design/icons"; 

const { Option } = Select;
const { Title } = Typography;

const LogHistory: React.FC = () => {
  const [filterType, setFilterType] = useState<string>("all");
  const [selectedDate, setSelectedDate] = useState<moment.Moment | null>(null);
  const [logs, setLogs] = useState<any[]>([]);
  const [countSL, setCountSL] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<{ userId: string } | null>(null);

  // Tính tổng lợi nhuận để hiển thị trên Statistic Card
  const totalProfit = useMemo(() => {
    return logs.reduce((sum, log) => sum + (log.profit || 0), 0);
  }, [logs]);

  // Cột cho bảng log history (Đã thêm style cho cột LỢI NHUẬN)
  const logColumns = useMemo(
    () => [
      { title: "THỜI GIAN", dataIndex: "time", key: "time", width: 160 },
      { title: "LOẠI LỆNH", dataIndex: "signal", key: "signal", width: 100 },
      { title: "GIÁ CHỐT", dataIndex: "profitPointTP", key: "profitPointTP", width: 120 },
      { title: "SL", dataIndex: "isSL", key: "isSL", width: 80 },
      { title: "SỐ HĐ", dataIndex: "numberContract", key: "numberContract", width: 100 },
      { title: "GIÁ KHỚP", dataIndex: "priceBuy", key: "priceBuy", width: 120 },
      {
        title: "LỢI NHUẬN (VND)",
        dataIndex: "profit",
        key: "profit",
        width: 150,
        render: (profit: number) => (
          <span
            style={{ fontWeight: "bold", color: profit > 0 ? "#10b981" : profit < 0 ? "#ef4444" : "#9ca3af" }}
          >
            {profit.toLocaleString("vi-VN")}
          </span>
        ),
      },
    ],
    []
  );

  // Ánh xạ dữ liệu từ backend sang frontend
  const mapToFrontend = (logsFromBackend: LogHistory[]): any[] => {
    return logsFromBackend.map((log) => ({
      key: log.id,
      ...log, // Giữ nguyên các trường khác từ backend
      time: new Date(log.dateTime).toLocaleString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      }),
      isSL: log.isSL ? "SL" : "TP", // Hiện rõ ràng là SL hay TP
    }));
  };

  // Fetch thông tin người dùng
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const currentUser = authService.getCurrentUser();
        if (!currentUser) throw new Error("No user logged in");
        setUserInfo({ userId: currentUser.userId });
      } catch (err: any) {
        console.error("Lỗi khi lấy thông tin người dùng:", err);
        setError("Không thể tải thông tin người dùng.");
      }
    };

    fetchUserInfo();
  }, []);

  // Fetch dữ liệu log history
  const fetchLogData = useCallback(async () => {
    if (!userInfo) return;

    try {
      setLoading(true);
      setError(null);

      const currentUserId = userInfo.userId;
      let logHistoryData: LogHistory[] = [];
      let countSL = 0;

      if (filterType === "all") {
        const res = (await LogHistoryService.getAll()) as any;
        logHistoryData = res.logHistory || res.logHistoryList || [];
        countSL = res.countSL ?? 0;
      } else if (selectedDate) {
        const year = selectedDate.year();
        const month = selectedDate.month() + 1;
        const day = selectedDate.date();

        let res;
        switch (filterType) {
          case "year":
            res = (await LogHistoryService.getByYear(year, currentUserId)) as any;
            break;
          case "month":
            res = (await LogHistoryService.getByMonth(month, year, currentUserId)) as any;
            break;
          case "day":
            res = (await LogHistoryService.getByDay(day, month, year, currentUserId)) as any;
            break;
          default:
            return;
        }
        logHistoryData = res.logHistoryList || res.logHistory || [];
        countSL = res.countSL ?? 0;
      } else {
        setLogs([]);
        message.warning("Vui lòng chọn ngày/tháng/năm trước khi lọc");
        return;
      }

      setLogs(mapToFrontend(logHistoryData));
      setCountSL(countSL);
    } catch (err: any) {
      console.error("Error fetching log history:", err);
      setError("Không thể tải lịch sử giao dịch. Vui lòng thử lại.");
      message.error("Không thể tải lịch sử giao dịch");
    } finally {
      setLoading(false);
    }
  }, [filterType, selectedDate, userInfo]);

  // Gọi fetch khi userInfo, filterType hoặc selectedDate thay đổi
  useEffect(() => {
    if (userInfo && (filterType === "all" || selectedDate)) {
      fetchLogData();
    } else {
      setLogs([]);
      setCountSL(0);
    }
  }, [userInfo, filterType, selectedDate, fetchLogData]);

  const handleFilterChange = useCallback((value: string) => {
    setFilterType(value);
    setSelectedDate(null);
    setLogs([]);
    setCountSL(0);
  }, []);

  const handleDateChange = useCallback((date: moment.Moment | null) => {
    setSelectedDate(date);
  }, []);

  const onRetry = useCallback(() => fetchLogData(), [fetchLogData]);
  
  const totalTrades = logs.length;
  const winTrades = totalTrades - countSL;
  const winRate = totalTrades > 0 ? (winTrades / totalTrades) * 100 : 0;
  const totalProfitVND = totalProfit.toLocaleString('vi-VN');

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f0f2f5",
        padding: "32px",
        fontFamily: "'Roboto', sans-serif",
      }}
    >
      <Title level={2} style={{ textAlign: 'center', color: '#1890ff', marginBottom: '32px' }}>
        <AreaChartOutlined style={{ marginRight: 10 }} /> LỊCH SỬ GIAO DỊCH BOT
      </Title>

      {/* KHỐI LỌC & THỐNG KÊ */}
      <Card
        bordered={false}
        style={{ marginBottom: "24px", borderRadius: "12px", boxShadow: "0 6px 18px rgba(0, 0, 0, 0.1)" }}
      >
        <div
          style={{
            marginBottom: "24px",
            display: "flex",
            alignItems: "center",
            gap: "20px",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <Select
            value={filterType}
            onChange={handleFilterChange}
            style={{ width: "160px", borderRadius: "6px" }}
            size="large"
            aria-label="Chọn loại lọc lịch sử giao dịch (tất cả, năm, tháng, ngày)"
          >
            <Option value="all">Toàn bộ lịch sử</Option>
            <Option value="year">Theo năm</Option>
            <Option value="month">Theo tháng</Option>
            <Option value="day">Theo ngày</Option>
          </Select>
          {(filterType === "year" || filterType === "month" || filterType === "day") && (
            <DatePicker
              picker={filterType === "year" ? "year" : filterType === "month" ? "month" : "date"}
              onChange={handleDateChange}
              size="large"
              style={{ width: "160px", borderRadius: "6px" }}
              format={filterType === "year" ? "YYYY" : filterType === "month" ? "MM/YYYY" : "DD/MM/YYYY"}
              aria-label={`Chọn ${filterType === "year" ? "năm" : filterType === "month" ? "tháng" : "ngày"} để lọc lịch sử giao dịch`}
            />
          )}
          <Button 
            type="primary" 
            onClick={onRetry} 
            loading={loading}
            icon={<SyncOutlined />}
            size="large"
            style={{ borderRadius: "6px" }}
          >
            Tải lại
          </Button>
        </div>

        {/* THỐNG KÊ */}
        <Row gutter={[16, 16]} justify="center">
          <Col xs={24} sm={8} md={6}>
            <Card style={{ backgroundColor: '#e6f7ff', borderLeft: '4px solid #1890ff' }} className="shadow-md">
              <Statistic 
                title="Tổng Lợi Nhuận" 
                value={totalProfitVND} 
                suffix="VND" 
                precision={0}
                valueStyle={{ color: totalProfit >= 0 ? '#3f8600' : '#cf1322', fontWeight: 700 }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8} md={6}>
            <Card style={{ backgroundColor: '#fffbe6', borderLeft: '4px solid #faad14' }} className="shadow-md">
              <Statistic 
                title="Tỉ lệ Thắng" 
                value={winRate} 
                suffix="%" 
                precision={2}
                valueStyle={{ color: winRate >= 50 ? '#3f8600' : '#cf1322', fontWeight: 700 }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8} md={6}>
            <Card style={{ backgroundColor: '#f6ffed', borderLeft: '4px solid #52c41a' }} className="shadow-md">
              <Statistic 
                title="Tổng Giao dịch" 
                value={totalTrades} 
                suffix="lệnh"
                valueStyle={{ color: '#000', fontWeight: 700 }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8} md={6}>
            <Card style={{ backgroundColor: '#fff0f6', borderLeft: '4px solid #eb2f96' }} className="shadow-md">
              <Statistic 
                title="Số lệnh SL" 
                value={countSL} 
                suffix="lệnh" 
                prefix={<FallOutlined />}
                valueStyle={{ color: '#eb2f96', fontWeight: 700 }}
              />
            </Card>
          </Col>
        </Row>
      </Card>

      {/* BẢNG LỊCH SỬ */}
      <Card
        title={<Title level={3} style={{ margin: 0, color: '#1e3a8a' }}>CHI TIẾT GIAO DỊCH</Title>}
        bordered={false}
        style={{ borderRadius: "12px", boxShadow: "0 6px 18px rgba(0, 0, 0, 0.1)" }}
        bodyStyle={{ padding: 0 }}
      >
        <UnifiedTable
          type="logHistory"
          columns={logColumns}
          data={logs}
          countSL={countSL}
          loading={loading}
          error={error}
          onRetry={onRetry}
        />
      </Card>
    </div>
  );
};

export default LogHistory;