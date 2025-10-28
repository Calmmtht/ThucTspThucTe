import React, { useMemo } from "react";
import { Table, Skeleton, Button, Empty } from "antd";
import type { ColumnType } from "antd/es/table";

// Màu sắc mới được điều chỉnh
const HEADER_BG_COLOR = "#374151"; // Xám đậm (Slate-700)
const HEADER_TEXT_COLOR = "#f9fafb"; // Trắng sáng (Gray-50)
const BORDER_COLOR = "#4b5563"; // Xám trung bình (Gray-600)
const BODY_TEXT_COLOR = "#1f2937"; // Xám rất đậm (Slate-900)

// Hàm tạo tableComponents cho priceBot và backtest (Tối ưu cho giao diện Dark-friendly)
const getPriceBotTableComponents = () =>
  useMemo(
    () => ({
      header: {
        cell: (props: any) => (
          <th
            {...props}
            style={{
              background: HEADER_BG_COLOR, // Màu xám đậm
              color: HEADER_TEXT_COLOR, // Màu trắng
              fontFamily: "'Montserrat', sans-serif",
              fontWeight: 600,
              textAlign: "center",
              padding: "16px",
              borderBottom: `2px solid ${BORDER_COLOR}`, // Viền xám
              boxShadow: "0 1px 2px rgba(0, 0, 0, 0.2)",
            }}
          />
        ),
      },
      body: {
        cell: (props: any) => (
          <td
            {...props}
            style={{
              color: BODY_TEXT_COLOR, // Màu text tối
              fontFamily: "'Roboto', sans-serif",
              textAlign: "center",
              padding: "16px",
              borderBottom: "1px solid #e5e7eb", // Viền nhạt
              lineHeight: 1.5,
            }}
          />
        ),
      },
    }),
    []
  );

// Hàm tạo tableComponents chung (cho profit, service, logHistory)
const getTableComponents = () =>
  useMemo(
    () => ({
      header: {
        cell: (props: any) => (
          <th
            {...props}
            style={{
              background: HEADER_BG_COLOR, // Màu xám đậm
              color: HEADER_TEXT_COLOR, // Màu trắng
              fontFamily: "'Montserrat', sans-serif",
              fontWeight: 600,
              textAlign: "center",
              padding: "16px",
              borderBottom: `2px solid ${BORDER_COLOR}`, // Viền xám
              boxShadow: "0 1px 2px rgba(0, 0, 0, 0.2)",
            }}
          />
        ),
      },
      body: {
        row: (props: any) => (
          <tr
            {...props}
            style={{
              transition: "background-color 0.3s ease, transform 0.2s ease",
            }}
          />
        ),
        cell: (props: any) => (
          <td
            {...props}
            style={{
              color: BODY_TEXT_COLOR, // Màu text tối
              fontFamily: "'Roboto', sans-serif",
              textAlign: "center",
              padding: "16px",
              borderBottom: "1px solid #e5e7eb", // Viền nhạt
              lineHeight: 1.5,
            }}
          />
        ),
      },
    }),
    []
  );

interface UnifiedTableProps<T> {
  type: "profit" | "service" | "priceBot" | "logHistory" | "backtest";
  columns: ColumnType<T>[];
  data: T[];
  total?: number; // Chỉ dùng cho type="profit"
  countSL?: number; // Chỉ dùng cho type="logHistory"
  loading: boolean;
  error: string | null;
  onRetry: () => void;
}

// Component bảng chung
const UnifiedTable = <T,>({ type, columns, data, total, countSL, loading, error, onRetry }: UnifiedTableProps<T>) => {
  const tableComponents = type === "priceBot" || type === "backtest" ? getPriceBotTableComponents() : getTableComponents();

  // Tùy chỉnh empty state hoặc lỗi
  const emptyText = useMemo(() => (
    <div className="p-6 text-center">
      {/* Cập nhật màu chữ cho Empty State */}
      <p className="text-gray-700 text-xl font-roboto mb-4">
        {error ||
          (type === "profit"
            ? "Không có dữ liệu lợi nhuận để hiển thị"
            : type === "service"
              ? "Không có dữ liệu dịch vụ để hiển thị"
              : type === "priceBot" || type === "backtest"
                ? "Không có dữ liệu gói bot để hiển thị"
                : "Không có dữ liệu lịch sử giao dịch để hiển thị")}
      </p>
      <Button type="primary" className="rounded-lg hover:shadow-lg font-roboto" onClick={onRetry}>
        {error ? "Thử lại" : "Tải lại"}
      </Button>
    </div>
  ), [error, onRetry, type]);

  return (
    <div
      style={{
        backgroundColor: "#ffffff",
        borderRadius: type === "priceBot" ? "12px" : "16px",
        overflow: "hidden",
        boxShadow: type === "priceBot" ? "0 4px 12px rgba(0, 0, 0, 0.1)" : undefined,
        transition: type === "priceBot" ? "transform 0.3s ease" : undefined,
      }}
      onMouseEnter={(e: React.MouseEvent<HTMLDivElement>) =>
        type === "priceBot" && (e.currentTarget.style.transform = "scale(1.005)")
      }
      onMouseLeave={(e: React.MouseEvent<HTMLDivElement>) =>
        type === "priceBot" && (e.currentTarget.style.transform = "scale(1)")
      }
    >
      {type === "logHistory" && countSL !== undefined && !loading && !error && (
        <p
          style={{
            margin: "16px",
            color: "#1e3a8a",
            fontSize: "15px",
            fontWeight: "500",
            backgroundColor: "#e6f0ff",
            padding: "8px 12px",
            borderRadius: "6px",
            display: "inline-block",
            fontFamily: "'Roboto', sans-serif",
          }}
        >
          Số lệnh Stop Loss: <span style={{ fontWeight: "700" }}>{countSL}</span>
        </p>
      )}
      {loading ? (
        type === "priceBot" ? (
          <p style={{ color: BODY_TEXT_COLOR, textAlign: "center", fontSize: "18px", fontFamily: "'Roboto', sans-serif", padding: "32px" }}>
            Đang tải dữ liệu...
          </p>
        ) : (
          <div className="p-6">
            <Skeleton
              active
              round
              paragraph={{ rows: 6, width: ["60%", "80%", "40%", "70%", "30%", "90%"] }}
              className="animate-pulse transition-opacity duration-300"
            />
          </div>
        )
      ) : error ? (
        type === "priceBot" ? (
          <p style={{ color: "#dc2626", textAlign: "center", fontSize: "18px", fontFamily: "'Roboto', sans-serif", padding: "32px" }}>
            {error}
          </p>
        ) : (
          emptyText
        )
      ) : (
        <>
          <Table
            columns={columns}
            dataSource={data}
            rowKey={(record: any, index) => record.key || `${record.time || index} -${Math.random()} `}
            pagination={{ pageSize: 5, showSizeChanger: false }}
            components={tableComponents}
            rowClassName={() => (type !== "priceBot" && type !== "backtest" ? "hover:bg-[#f1f5f9] hover:cursor-pointer" : "")}
            scroll={{ x: 600 }}
            locale={{ emptyText }}
            bordered
          />
          {type === "profit" && total !== undefined && total > 0 && !error && (
            <div className="text-right text-xl font-semibold text-[#2563eb] px-4 py-3 border-t border-gray-200">
              Tổng lợi nhuận: {total.toLocaleString("vi-VN")} VND
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default UnifiedTable;