import React, { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { Card, Button, Modal, Form, Input, message, Popconfirm, Upload, Select } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined, UploadOutlined, ArrowRightOutlined } from "@ant-design/icons";
import { contentService, Content, ContentCreateDTO, ContentUpdateDTO } from "../services/contentService";
import { authService } from "../services/authService";
import { Link } from "react-router-dom";
import type { UploadFile } from "antd/es/upload/interface";
import UnifiedTable from "../components/UnifiedTable";
import abouttest from "/src/assets/abouttest.jpg";
import { botTradingService, type BotTrading } from "../services/botService";

const { Option } = Select;

// Màu sắc và Style nhất quán
const ACCENT_COLOR = '#ec4899'; // pink-500
const PRIMARY_COLOR = '#1e293b'; // slate-800
const BACKGROUND_COLOR = '#0f172a'; // slate-900

const About: React.FC = () => {
    const [contents, setContents] = useState<Content[]>([]);
    const [loading, setLoading] = useState({ content: true, botList: false });
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingContent, setEditingContent] = useState<Content | null>(null);
    const [form] = Form.useForm();
    const [isAdmin, setIsAdmin] = useState(false);
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const contentRefs = useRef<(HTMLDivElement | null)[]>([]);
    const [botListData, setBotListData] = useState<BotTrading[]>([]);
    const [botListError, setBotListError] = useState<string | null>(null);

    // Columns cho bảng priceBot
    const botTableColumns = useMemo(
        () => [
            { title: "Tên bot", dataIndex: "name", key: "name", className: 'text-white' },
            { title: "Số lệnh", dataIndex: "commandNumber", key: "commandNumber", className: 'text-white' },
            {
                title: "Lợi nhuận",
                dataIndex: "profit",
                key: "profit",
                render: (profit: number) => <span className="text-green-400 font-bold">{`${profit.toLocaleString("vi-VN")} VND`}</span>,
            },
            {
                title: "Tỉ lệ thắng",
                dataIndex: "winRate",
                key: "winRate",
                render: (winRate: number) => <span className="text-yellow-400">{`${winRate}%`}</span>,
            },
            {
                title: "Lãi suất",
                dataIndex: "interestRate",
                key: "interestRate",
                render: (interestRate: number) => <span className="text-blue-400">{`${interestRate}%`}</span>,
            },
        ],
        []
    );

    // Fetch thông tin người dùng
    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const currentUser = authService.getCurrentUser();
                if (!currentUser) throw new Error("No user logged in");
                setIsAdmin(currentUser?.roles?.includes("Admin") || false);
            } catch (error) {
                console.error("Lỗi khi lấy thông tin người dùng:", error);
            }
        };

        fetchUserInfo();
    }, []);

    // Fetch nội dung (contentService)
    const fetchContents = async () => {
        try {
            setLoading((prev) => ({ ...prev, content: true }));
            setBotListError(null);
            const data = await contentService.getContentsByPage("about");
            setContents(data);
            contentRefs.current = Array(data.length).fill(null);
        } catch (error) {
            console.error("Error fetching contents:", error);
            setBotListError("Không thể tải nội dung.");
            message.error("Không thể tải nội dung");
        } finally {
            setLoading((prev) => ({ ...prev, content: false }));
        }
    };

    // Fetch danh sách bot
    const fetchBotList = useCallback(async () => {
        try {
            setLoading((prev) => ({ ...prev, botList: true }));
            setBotListError(null);
            const data = await botTradingService.getAllBotTradings();
            setBotListData(data);
        } catch (err) {
            console.error("Failed to fetch bot list:", err);
            setBotListError("Không thể tải danh sách bot. Vui lòng thử lại sau.");
            setBotListData([]);
            message.error("Không thể tải danh sách bot");
        } finally {
            setLoading((prev) => ({ ...prev, botList: false }));
        }
    }, []);

    // Gọi fetch khi component mount
    useEffect(() => {
        fetchContents();
        fetchBotList();
    }, [fetchBotList]);

    // IntersectionObserver cho hiệu ứng fade-in
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const target = entry.target as HTMLElement;
                        target.classList.add('fade-in-visible');
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.1 }
        );

        contentRefs.current.forEach((ref) => {
            if (ref) observer.observe(ref);
        });

        return () => {
            contentRefs.current.forEach((ref) => {
                if (ref) observer.unobserve(ref);
            });
        };
    }, [contents]);

    const handleAddContent = () => {
        setEditingContent(null);
        form.resetFields();
        setFileList([]);
        setIsModalVisible(true);
    };

    const handleEditContent = (content: Content) => {
        setEditingContent(content);
        form.setFieldsValue({
            title: content.title,
            content: content.content,
            page: "about",
        });
        if (content.url) {
            setFileList([
                {
                    uid: "-1",
                    name: "current-image",
                    status: "done",
                    url: `${import.meta.env.VITE_API_URL || "http://localhost:5131"}/assets/images/${content.url}`,
                },
            ]);
        } else {
            setFileList([]);
        }
        setIsModalVisible(true);
    };

    const handleDeleteContent = async (id: string) => {
        try {
            await contentService.deleteContent(id);
            message.success("Xóa nội dung thành công");
            fetchContents();
        } catch (error) {
            console.error("Error deleting content:", error);
            message.error("Không thể xóa nội dung");
        }
    };

    const handleModalOk = async () => {
        try {
            const values = await form.validateFields();
            if (editingContent) {
                const updateDto: ContentUpdateDTO = {
                    title: values.title,
                    content: values.content,
                    page: "about",
                };
                if (fileList.length > 0 && fileList[0].originFileObj) {
                    updateDto.ImageFile = fileList[0].originFileObj;
                }
                await contentService.updateContent(editingContent.id.toString(), updateDto);
                message.success("Cập nhật nội dung thành công");
            } else {
                const createDto: ContentCreateDTO = {
                    title: values.title,
                    content: values.content,
                    page: "about",
                };
                if (fileList.length > 0 && fileList[0].originFileObj) {
                    createDto.ImageFile = fileList[0].originFileObj;
                }
                await contentService.createContent(createDto);
                message.success("Thêm nội dung thành công");
            }
            setIsModalVisible(false);
            fetchContents();
        } catch (error) {
            console.error("Error saving content:", error);
            message.error("Không thể lưu nội dung");
        }
    };

    // Tinh gọn renderContentBlock (ĐÃ ĐIỀU CHỈNH GIAO DIỆN)
    const renderContentBlock = (content: Content, index: number) => {
        const isEven = index % 2 === 0;
        const imageUrl =
            content.url && content.url.trim() !== ""
                ? `${(import.meta.env.VITE_API_URL || "http://localhost:5131")}/assets/images/${content.url.trim()}`
                : null;

        const contentOrderClass = isEven ? 'md:order-1' : 'md:order-2';
        const imageOrderClass = isEven ? 'md:order-2' : 'md:order-1';

        // Màu sắc linh hoạt cho từng block
        const dynamicBg = isEven ? PRIMARY_COLOR : BACKGROUND_COLOR;
        const dynamicBorder = isEven ? ACCENT_COLOR : '#475569'; // slate-600

        const imageElement = imageUrl ? (
            <div className={`relative ${imageOrderClass} flex justify-center`}>
                <img
                    src={imageUrl}
                    alt={content.title || `Content ${index + 1}`}
                    className="w-full max-w-sm md:max-w-md h-auto object-cover rounded-2xl shadow-xl transition-transform duration-500 group-hover:scale-[1.05] border-2"
                    style={{ borderColor: dynamicBorder }}
                    onError={(e) => {
                        console.error(`Image load error for content #${index + 1}: `, { attemptedUrl: e.currentTarget.src, contentUrl: content.url, index });
                        e.currentTarget.style.display = "none";
                    }}
                />
            </div>
        ) : (
            <div className={`w-full max-w-sm md:max-w-md h-64 ${dynamicBg} rounded-2xl shadow-lg flex items-center justify-center text-gray-400 ${imageOrderClass} border-2`}
                style={{ borderColor: dynamicBorder }}>
                Không có ảnh
            </div>
        );

        return (
            <div
                ref={(el) => { contentRefs.current[index] = el; }}
                key={content.id}
                className={`content-block fade-in grid grid-cols-1 md:grid-cols-2 gap-12 items-center p-8 lg:p-12 mb-20 rounded-2xl transition-all duration-700 group relative`}
                style={{
                    backgroundColor: dynamicBg,
                    border: `1px solid ${dynamicBorder}`,
                    boxShadow: `0 0 0 1px ${dynamicBorder}A0, 0 10px 30px rgba(0, 0, 0, 0.5)`,
                }}
            >
                {/* Content Card Section */}
                <div className={`relative ${contentOrderClass}`}>
                    <Card
                        className="w-full rounded-xl border-none shadow-xl transition-shadow duration-300"
                        style={{
                            backgroundColor: dynamicBg,
                            color: 'white',
                            border: `1px solid ${dynamicBorder}50`
                        }}
                        bodyStyle={{ padding: '32px' }}
                        onMouseEnter={(e: React.MouseEvent<HTMLDivElement>) =>
                            e.currentTarget.style.boxShadow = `0 15px 30px rgba(0, 0, 0, 0.8)`
                        }
                        onMouseLeave={(e: React.MouseEvent<HTMLDivElement>) =>
                            e.currentTarget.style.boxShadow = `0 10px 30px rgba(0, 0, 0, 0.5)`
                        }
                    >
                        <h2
                            className="text-2xl font-bold mb-4"
                            style={{ color: ACCENT_COLOR, fontFamily: 'Montserrat, sans-serif' }}
                        >
                            {content.title}
                        </h2>
                        <p
                            className="text-gray-300 text-base leading-relaxed text-justify"
                            style={{ fontFamily: 'Roboto, sans-serif' }}
                        >
                            {content.content}
                        </p>
                        
                        {/* Admin Controls - Đặt lại vị trí nổi bật hơn */}
                        {isAdmin && (
                            <div className="absolute top-[-20px] right-[-20px] flex gap-2 z-20 p-2 rounded-full bg-slate-900 border border-slate-700 shadow-xl">
                                <Button
                                    type="primary"
                                    icon={<EditOutlined />}
                                    size="small"
                                    className="bg-blue-600 border-blue-600 hover:bg-blue-700 transition"
                                    onClick={() => handleEditContent(content)}
                                />
                                <Popconfirm
                                    title="Bạn có chắc chắn muốn xóa nội dung này?"
                                    onConfirm={() => handleDeleteContent(content.id.toString())}
                                    okText="Có"
                                    cancelText="Không"
                                >
                                    <Button
                                        type="primary"
                                        danger
                                        icon={<DeleteOutlined />}
                                        size="small"
                                        className="bg-red-600 border-red-600 hover:bg-red-700 transition"
                                    />
                                </Popconfirm>
                            </div>
                        )}
                    </Card>
                </div>
                {imageUrl && imageElement}
            </div>
        );
    };

    return (
        <div className="min-h-screen" style={{ backgroundColor: BACKGROUND_COLOR, fontFamily: "'Roboto', sans-serif" }}>

            {/* Hero Section (ĐÃ ĐIỀU CHỈNH GIAO DIỆN) */}
            <div
                className="h-96 md:h-[60vh] relative flex items-center justify-center p-8 shadow-inner"
                style={{
                    backgroundImage: `url(${abouttest})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
                {/* Gradient Overlay effect */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-black/70 to-black/50"></div>

                <div className="text-center max-w-4xl relative z-10">
                    <h2
                        className="text-4xl sm:text-5xl lg:text-7xl font-extrabold text-white uppercase tracking-wider"
                        style={{
                            fontFamily: 'Saira, sans-serif',
                            textShadow: `0 0 10px ${ACCENT_COLOR}, 0 0 20px rgba(236, 72, 153, 0.8)`
                        }}
                    >
                        SỨ MỆNH CÔNG NGHỆ <br /> <span style={{ color: ACCENT_COLOR }}>BOT AI</span>
                    </h2>
                    <div className="mt-4 mx-auto w-24 h-1 rounded-full" style={{ backgroundColor: ACCENT_COLOR, boxShadow: `0 0 8px ${ACCENT_COLOR}` }}></div>
                    <p className="mt-6 text-lg md:text-xl text-gray-300 font-light">
                        Tối ưu hóa lợi nhuận đầu tư của bạn với trí tuệ nhân tạo.
                    </p>
                </div>
            </div>

            {/* Content Header & Add Button */}
            <div className="max-w-7xl mx-auto px-6 py-16 flex flex-col md:flex-row justify-center md:justify-between items-center gap-6">
                <h2
                    className="text-3xl md:text-4xl font-extrabold text-center uppercase"
                    style={{ color: ACCENT_COLOR, fontFamily: 'Saira, sans-serif' }}
                >
                    Tại Sao Chọn TradingBot?
                </h2>
                {isAdmin && (
                    <Button
                        type="primary"
                        shape="circle"
                        size="large"
                        icon={<PlusOutlined />}
                        onClick={handleAddContent}
                        style={{
                            backgroundColor: ACCENT_COLOR,
                            borderColor: ACCENT_COLOR,
                        }}
                        className="hover:bg-pink-600 transition duration-300"
                    />
                )}
            </div>

            {/* Content Blocks Area */}
            <div className="max-w-7xl mx-auto px-6">
                {loading.content ? (
                    <div className="flex justify-center items-center h-96">
                        {/* Custom loading spinner */}
                        <div className="w-12 h-12 border-4 rounded-full animate-spin" style={{ borderColor: PRIMARY_COLOR, borderTopColor: ACCENT_COLOR }}></div>
                    </div>
                ) : botListError && contents.length === 0 ? (
                    <div className="p-12 text-center bg-red-900 bg-opacity-30 text-white rounded-lg mx-auto max-w-lg">
                        <p className="text-xl font-medium mb-4">{botListError}</p>
                        <Button
                            type="primary"
                            onClick={fetchContents}
                            className="bg-blue-600 border-blue-600 hover:bg-blue-700 transition"
                        >
                            Thử lại
                        </Button>
                    </div>
                ) : (
                    contents.map((content, index) => renderContentBlock(content, index))
                )}
            </div>

            {/* Bảng Giá Các Gói Bot */}
            <div
                className="max-w-7xl mx-auto px-6 pt-16 pb-20 mt-10 mb-20 rounded-2xl shadow-2xl"
                style={{
                    backgroundColor: PRIMARY_COLOR, // Màu nền tối
                    border: `1px solid ${ACCENT_COLOR}33` // Border nhẹ
                }}
            >
                <h2
                    className="text-3xl md:text-4xl font-extrabold mb-10 text-center uppercase"
                    style={{ color: 'white', fontFamily: 'Saira, sans-serif' }}
                >
                    <span style={{ color: ACCENT_COLOR }}>Bảng</span> Hiệu Suất Bot
                </h2>

                <UnifiedTable
                    type="priceBot"
                    columns={botTableColumns}
                    data={botListData}
                    loading={loading.botList}
                    error={botListError}
                    onRetry={fetchBotList}
                />

                {/* CTA Block (ĐÃ ĐIỀU CHỈNH GIAO DIỆN) */}
                <div
                    className="mt-16 mb-8 p-8 md:p-12 rounded-2xl text-center relative overflow-hidden"
                    style={{
                        backgroundColor: PRIMARY_COLOR,
                        border: `2px solid ${ACCENT_COLOR}`,
                        boxShadow: `0 0 25px rgba(236, 72, 153, 0.4)`, // Shadow with accent color
                    }}
                >
                    <Card
                        className="w-full mx-auto rounded-xl shadow-2xl border-none"
                        style={{
                            backgroundColor: BACKGROUND_COLOR, // Màu nền tối nhất
                            border: `1px solid ${ACCENT_COLOR}66`,
                            maxWidth: "900px",
                            padding: "32px",
                            transition: "box-shadow 0.3s ease, transform 0.3s ease",
                        }}
                        onMouseEnter={(e: React.MouseEvent<HTMLDivElement>) => {
                            e.currentTarget.style.boxShadow = `0 8px 20px rgba(0, 0, 0, 0.4), 0 0 15px ${ACCENT_COLOR}80`;
                            e.currentTarget.style.transform = "scale(1.02)";
                        }}
                        onMouseLeave={(e: React.MouseEvent<HTMLDivElement>) => {
                            e.currentTarget.style.boxShadow = "0 6px 16px rgba(0, 0, 0, 0.3)";
                            e.currentTarget.style.transform = "scale(1)";
                        }}
                    >
                        <h2
                            className="text-3xl font-extrabold"
                            style={{
                                color: ACCENT_COLOR,
                                marginBottom: "16px",
                                fontFamily: "'Poppins', sans-serif",
                            }}
                        >
                            Tăng Lợi Nhuận Ngay Hôm Nay!
                        </h2>
                        <p
                            className="text-base text-gray-300 mb-6"
                            style={{
                                lineHeight: "1.75",
                                fontFamily: "'Inter', sans-serif",
                                maxWidth: "700px",
                                margin: "0 auto 24px",
                            }}
                        >
                            Khám phá bot đầu tư chứng khoán AI với tỉ lệ thắng cao, giúp bạn tối ưu hóa lợi nhuận và giảm rủi ro. Đăng ký ngay để nhận ưu đãi giới hạn!
                        </p>
                        <Link to="/service-rate">
                            <Button
                                type="primary"
                                size="large"
                                icon={<ArrowRightOutlined />}
                                style={{
                                    padding: "10px 40px",
                                    background: ACCENT_COLOR,
                                    borderColor: ACCENT_COLOR,
                                    borderRadius: "12px",
                                    fontSize: "16px",
                                    fontWeight: "600",
                                    fontFamily: "'Poppins', sans-serif",
                                    transition: "all 0.3s ease",
                                    textShadow: "0 0 5px rgba(0, 0, 0, 0.3)"
                                }}
                                onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => {
                                    e.currentTarget.style.background = "#d9467d"; // pink-600
                                    e.currentTarget.style.borderColor = "#d9467d";
                                    e.currentTarget.style.transform = "scale(1.08)";
                                }}
                                onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => {
                                    e.currentTarget.style.background = ACCENT_COLOR;
                                    e.currentTarget.style.borderColor = ACCENT_COLOR;
                                    e.currentTarget.style.transform = "scale(1)";
                                }}
                            >
                                Đăng Ký Ngay
                            </Button>
                        </Link>
                    </Card>
                </div>
            </div>

            {/* Modal chỉnh sửa/thêm nội dung */}
            <Modal
                title={<span className="text-xl font-bold" style={{ color: ACCENT_COLOR }}>{editingContent ? "Chỉnh sửa nội dung" : "Thêm nội dung mới"}</span>}
                open={isModalVisible}
                onOk={handleModalOk}
                onCancel={() => {
                    setIsModalVisible(false);
                    setFileList([]);
                }}
                width={900}
                okButtonProps={{
                    className: "bg-blue-600 border-blue-600 hover:!bg-blue-700",
                    style: { borderRadius: '8px' }
                }}
                cancelButtonProps={{ style: { borderRadius: '8px' } }}
            >
                <Form
                    form={form}
                    layout="vertical"
                    className="p-6"
                >
                    <Form.Item name="title" label="Tiêu đề" rules={[{ required: true, message: "Vui lòng nhập tiêu đề" }]}>
                        <Input className="p-2 rounded-lg" />
                    </Form.Item>
                    <Form.Item name="content" label="Nội dung" rules={[{ required: true, message: "Vui lòng nhập nội dung" }]}>
                        <Input.TextArea rows={6} className="p-2 rounded-lg" />
                    </Form.Item>
                    <Form.Item name="image" label="Ảnh">
                        <Upload
                            listType="picture-card"
                            maxCount={1}
                            fileList={fileList}
                            beforeUpload={(file) => {
                                const isLt5M = file.size / 1024 / 1024 < 5;
                                if (!isLt5M) {
                                    message.error("Ảnh phải nhỏ hơn 5MB!");
                                    return false;
                                }
                                const isImage = file.type.startsWith("image/");
                                if (!isImage) {
                                    message.error("Chỉ được upload file ảnh!");
                                    return false;
                                }
                                return false;
                            }}
                            onChange={({ fileList }) => setFileList(fileList)}
                            onRemove={() => {
                                setFileList([]);
                                return true;
                            }}
                        >
                            {fileList.length >= 1 ? null : (
                                <div className="text-center">
                                    <UploadOutlined className="text-xl" style={{ color: ACCENT_COLOR }} />
                                    <div className="mt-2 text-sm font-medium" style={{ color: PRIMARY_COLOR }}>
                                        Upload
                                    </div>
                                </div>
                            )}
                        </Upload>
                    </Form.Item>
                </Form>
            </Modal>

            {/* Global CSS for fade-in effect */}
            <style>{`
                .fade-in {
                    opacity: 0;
                    transform: translateY(40px);
                    transition: opacity 0.6s ease-out, transform 0.6s ease-out;
                }
                .fade-in-visible {
                    opacity: 1;
                    transform: translateY(0);
                }
            `}</style>
        </div>
    );
};

export default About;