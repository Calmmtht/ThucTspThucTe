import React, { useState, useEffect } from "react";
import iconBot from "/src/assets/iconbot.png";
import { Select, DatePicker } from "antd";
import axios from "axios";
import { authService } from "../services/authService";
import { api } from "../services/api";
import moment from "moment";

const { Option } = Select;

function PersonalInfomation() {
  const [profitFilterType, setProfitFilterType] = useState<string>("all");
  const [profitDate, setProfitDate] = useState<moment.Moment | null>(null);
  const [serviceFilterType, setServiceFilterType] = useState<string>("all");
  const [serviceDate, setServiceDate] = useState<moment.Moment | null>(null);
  const [profitList, setProfitList] = useState<any[]>([]);
  const [totalProfit, setTotalProfit] = useState<number>(0);
  const [serviceList, setServiceList] = useState<any[]>([]);
  const [userInfo, setUserInfo] = useState<any>(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const currentUser = authService.getCurrentUser();
        if (!currentUser) return;

        // const res = await api.get(`/api/user/get/${currentUser.userId}`, {
        //   headers: { Authorization: `Bearer ${authService.getAccessToken()}` },
        // });

        setUserInfo(currentUser);
      } catch (error: any) {
        console.error("Lỗi khi lấy thông tin người dùng:", error);
      }
    };

    fetchUserInfo();
  }, []);

  useEffect(() => {
    const fetchProfitLoss = async () => {
      if (!userInfo) return;

      try {
        let url = "/api/profitLoss/GetProfitLossAll";
        const params: any = { user: userInfo.userId };

        if (profitFilterType === "year" && profitDate) {
          url = "/api/profitLoss/GetProfitLossYear";
          params.year = profitDate.year();
        } else if (profitFilterType === "month" && profitDate) {
          url = "/api/profitLoss/GetProfitLossMoth";
          params.month = profitDate.month() + 1;
          params.year = profitDate.year();
        } else if (profitFilterType === "day" && profitDate) {
          url = "/api/profitLoss/GetProfitLossDay";
          params.day = profitDate.date();
          params.month = profitDate.month() + 1;
          params.year = profitDate.year();
        }

        const res = await api.get(url, {
          headers: { Authorization: `Bearer ${authService.getAccessToken()}` },
          params,
        });

        setProfitList(res.data.profitLossDTOList || []);
        setTotalProfit(res.data.total || 0);
      } catch (err: any) {
        console.error(
          "Lỗi khi tải lợi nhuận:",
          err?.response?.data || err.message
        );
      }
    };

    fetchProfitLoss();
  }, [profitFilterType, profitDate, userInfo]);

  useEffect(() => {
    const fetchServiceData = async () => {
      if (!userInfo) return;

      try {
        let url = "/api/purchaseHistory/getPurchaseAllByUser";
        const params: any = { userId: userInfo.userId };

        if (serviceFilterType === "year" && serviceDate) {
          url = "/api/purchaseHistory/getPurchaseYearByUser";
          params.year = serviceDate.year();
        } else if (serviceFilterType === "month" && serviceDate) {
          url = "/api/purchaseHistory/getPurchaseMonthByUser";
          params.month = serviceDate.month() + 1;
          params.year = serviceDate.year();
        }

        const res = await api.get(url, {
          headers: { Authorization: `Bearer ${authService.getAccessToken()}` },
          params,
        });

        setServiceList(res.data.purchases || []);
      } catch (err: any) {
        console.error(
          "Lỗi khi tải dịch vụ:",
          err?.response?.data || err.message
        );
      }
    };

    fetchServiceData();
  }, [serviceFilterType, serviceDate, userInfo]);

  const handleProfitFilterChange = (value: string) => {
    setProfitFilterType(value);
    setProfitDate(null);
  };

  const handleProfitDateChange = (date: moment.Moment | null) => {
    setProfitDate(date);
  };

  const handleServiceFilterChange = (value: string) => {
    setServiceFilterType(value);
    setServiceDate(null);
  };

  const handleServiceDateChange = (date: moment.Moment | null) => {
    setServiceDate(date);
  };

  return (
    <div className="bg-[#1a2a44] text-white font-sans min-h-screen px-4 py-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row justify-between gap-6 mb-10">
          <div className="w-full lg:w-2/3 space-y-6">
            <div>
              <h1 className="text-[#00c4ff] text-2xl font-bold mb-2">
                THÔNG TIN TÀI KHOẢN
              </h1>
              <div className="bg-[#2a3b5a] rounded-lg p-4 space-y-1">
                {userInfo ? (
                  <>
                    <p>Tên: {userInfo["name"] ?? "Không có tên"}</p>
                    <p>
                      Số điện thoại:{" "}
                      {userInfo["phoneNumber"] ?? "Không có số điện thoại"}
                    </p>
                    <p>Email: {userInfo["email"]}</p>
                  </>
                ) : (
                  <p>Đang tải thông tin...</p>
                )}
              </div>
            </div>

            <div>
              <h1 className="text-[#00c4ff] text-2xl font-bold mb-2">
                LỢI NHUẬN
              </h1>
              <div className="mb-3">
                <Select
                  value={profitFilterType}
                  style={{ width: 160 }}
                  onChange={handleProfitFilterChange}
                >
                  <Option value="all">Tất cả</Option>
                  <Option value="year">Theo năm</Option>
                  <Option value="month">Theo tháng</Option>
                  <Option value="day">Theo ngày</Option>
                </Select>
                {profitFilterType === "year" && (
                  <DatePicker
                    picker="year"
                    onChange={handleProfitDateChange}
                    className="ml-3"
                  />
                )}
                {profitFilterType === "month" && (
                  <DatePicker
                    picker="month"
                    onChange={handleProfitDateChange}
                    className="ml-3"
                  />
                )}
                {profitFilterType === "day" && (
                  <DatePicker
                    onChange={handleProfitDateChange}
                    className="ml-3"
                  />
                )}
              </div>

              <div className="bg-[#2a3b5a] rounded-lg shadow-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-[#00c4ff] text-[#1a2a44]">
                    <tr>
                      <th className="p-2">NSLĐV</th>
                      <th className="p-2">GIÁ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {profitList.map((item, index) => (
                      <tr
                        key={index}
                        className="text-center hover:bg-[#3a4b6a] transition"
                      >
                        <td className="p-2">
                          {moment(item.date).format("DD/MM/YYYY HH:mm:ss")}
                        </td>
                        <td className="p-2">
                          {item.price.toLocaleString()} VND
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="text-right text-sm italic pr-2 py-2">
                  <p>Tổng lợi nhuận: {totalProfit.toLocaleString()} VND</p>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-1/3 flex-shrink-0 self-center">
            <img
              src={iconBot}
              alt="Robot"
              className="w-full max-w-[300px] mx-auto"
            />
          </div>
        </div>

        <div>
          <h1 className="text-[#00c4ff] text-2xl font-bold mb-4">
            GÓI DỊCH VỤ
          </h1>
          <div className="mb-3">
            <Select
              value={serviceFilterType}
              style={{ width: 160 }}
              onChange={handleServiceFilterChange}
            >
              <Option value="all">Tất cả</Option>
              <Option value="year">Theo năm</Option>
              <Option value="month">Theo tháng</Option>
            </Select>
            {(serviceFilterType === "year" ||
              serviceFilterType === "month") && (
              <DatePicker
                picker={serviceFilterType === "year" ? "year" : "month"}
                onChange={handleServiceDateChange}
                className="ml-3"
              />
            )}
          </div>

          <div className="bg-[#2a3b5a] rounded-lg shadow-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-[#00c4ff] text-[#1a2a44] text-center">
                <tr>
                  <th className="p-3">Ngày Thanh Toán</th>
                  <th className="p-3">Giá</th>
                  <th className="p-3">Ngày Bắt Đầu</th>
                  <th className="p-3">Ngày Kết Thúc</th>
                  <th className="p-3">Trạng Thái Thanh Toán</th>
                  <th className="p-3">Trạng Thái Gói</th>
                </tr>
              </thead>
              <tbody className="text-center">
                {serviceList.map((item, index) => (
                  <tr key={index} className="hover:bg-[#3a4b6a] transition">
                    <td className="p-3">
                      {moment(item.date).format("DD/MM/YYYY")}
                    </td>
                    <td className="p-3">
                      {item.priceBot.toLocaleString()} VND
                    </td>
                    <td className="p-3">
                      {moment(item.startDate).format("DD/MM/YYYY")}
                    </td>
                    <td className="p-3">
                      {moment(item.endDate).format("DD/MM/YYYY")}
                    </td>
                    <td className="p-3">
                      <button
                        className={`px-4 py-1 rounded font-medium ${
                          item.status === "PAID"
                            ? "bg-green-600"
                            : "bg-orange-500"
                        }`}
                      >
                        {item.status === "PAID"
                          ? "Đã Thanh Toán"
                          : "Chưa Thanh Toán"}
                      </button>
                    </td>
                    <td className="p-3">
                      <button
                        className={`px-4 py-1 rounded font-medium ${
                          moment().isBefore(item.endDate)
                            ? "bg-green-500"
                            : "bg-red-500"
                        }`}
                      >
                        {moment().isBefore(item.endDate)
                          ? "Hoạt Động"
                          : "Hết Hạn"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PersonalInfomation;
