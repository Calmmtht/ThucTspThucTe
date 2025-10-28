//import React from 'react';
//import Slider from 'react-slick';
import info6 from "/src/assets/info6.png";
import info1 from "/src/assets/info1.png";
import info2 from "/src/assets/info2.png";
import info3 from "/src/assets/info3.png";
import iconBot from "/src/assets/iconbot.png";
import { Button, Card, message, Modal, Form, Input, Popconfirm, Upload } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { paymentService } from '../services/paymentService';
import { authService } from '../services/authService';
import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { priceBotService, type PriceBot } from '../services/priceBotService';
import { contentService, Content, ContentCreateDTO, ContentUpdateDTO } from '../services/contentService';


const carouselImages = [
    info6,
    info1,
    info2,
    info3,
  ];

const carouselHeightClass = "h-[300px] sm:h-[400px] md:h-[500px] w-[1000px]";

interface SimpleImageCarouselProps {
  images: string[];
  heightClass?: string;
  autoPlayInterval?: number;
}

const SimpleImageCarousel: React.FC<SimpleImageCarouselProps> = ({
  images,
  heightClass = 'h-64',
  autoPlayInterval,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);


  const goToNext = useCallback(() => {
    setCurrentIndex(prevIndex => {
      const isLastSlide = prevIndex === images.length - 1;
      return isLastSlide ? 0 : prevIndex + 1;
    });
  }, [images.length]);


  useEffect(() => {

    if (autoPlayInterval && autoPlayInterval > 0 && images.length > 1) {
      const timer = setInterval(() => {
        goToNext();
      }, autoPlayInterval);

      return () => clearInterval(timer);
    }

  }, [currentIndex, autoPlayInterval, images.length, goToNext]);


  if (!images || images.length === 0) {
    return <div className={`w-full ${heightClass} bg-gray-700 flex items-center justify-center text-gray-400 rounded-lg`}>No images to display.</div>;
  }

  return (
    <div className={`relative w-full ${heightClass} rounded-lg overflow-hidden shadow-xl`}>
      <img
        src={images[currentIndex]}
        alt={`slide-${currentIndex}`}
        className="w-full h-full object-cover object-center duration-500 ease-in-out block"
        style={{ minHeight: 120, background: '#e5e7eb' }}
        onError={e => { e.currentTarget.src = '/assets/info1.png'; }}
      />
    </div>
  );
};

//--------------------------------------------------------------------------------------------------


const HomePage = () => {

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [priceBots, setPriceBots] = useState<PriceBot[]>([]);
  const [loading, setLoading] = useState(true);
  const autoPlayTime = 3000;

  // State for dynamic content
  const [contents, setContents] = useState<Content[]>([]);
  const [contentLoading, setContentLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingContent, setEditingContent] = useState<Content | null>(null);
  const [form] = Form.useForm();
  const [isAdmin, setIsAdmin] = useState(false);


    useEffect(() => {
      const user = authService.getCurrentUser();
      setIsLoggedIn(!!user);
      setIsAdmin(user?.roles?.includes('Admin') || false);

  const fetchPriceBots = async () => {
        try {
          const data = await priceBotService.getAllPriceBots(); console.log(data);
          setPriceBots(data);
        } catch (error) {
          console.error("Error fetching price bots:", error);
          message.error("Không thể tải dữ liệu gói dịch vụ");
        } finally {
          setLoading(false);
        }
      };

    const fetchContents = async () => {
      try {
        const data = await contentService.getContentsByPage('home');
        console.log('Fetched home contents:', data);
        setContents(data);
      } catch (error) {
        console.error('Error fetching contents:', error);
        message.error('Không thể tải nội dung tính năng');
      } finally {
        setContentLoading(false);
      }
    };

    fetchPriceBots();
    fetchContents();
  }, []);


  const handleBuyNow = async (month: number, botTradingId: number) => {
  try {
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
    // 3. Gọi API để tạo link thanh toáns
    const response = await paymentService.addUserBot(request);
    // const response = await paymentService.createPaymentLink(request);
     
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
  

//------------------------------------------------------------------------------------------------------------------------------
// Moved processStepsData inside the component to be filtered from fetched contents
// const processStepsData = [...]

interface ProcessStepCardProps {
  icon: React.ReactNode;
  title: string;
  content: string;
}

const ProcessStepCard: React.FC<ProcessStepCardProps> = ({ icon, title, content }) => {
  return (
    <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg w-full transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
      <div className="flex items-start space-x-4 md:space-x-5">
        <div className="flex-shrink-0 text-pink-500 text-3xl w-10 h-10 flex items-center justify-center mt-1">
          <span className="text-4xl">{icon}</span>
        </div>
        <div className="flex-1">
          <h3 className="text-xl md:text-2xl font-semibold text-gray-800 mb-2">{title}</h3>
          <p className="text-gray-600 text-sm md:text-base leading-relaxed">{content}</p>
        </div>
      </div>
    </div>
  );
};


  const handleAddContent = () => {
    setEditingContent(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEditContent = (content: Content) => {
    setEditingContent(content);
    form.setFieldsValue({
      title: content.title,
      content: content.content,
      page: 'home'
    });
    setIsModalVisible(true);
  };

  const handleDeleteContent = async (id: string) => {
    try {
      await contentService.deleteContent(id);
      message.success('Xóa nội dung thành công');
      const data = await contentService.getContentsByPage('home'); // Refetch
      setContents(data);
    } catch (error) {
      console.error('Error deleting content:', error);
      message.error('Không thể xóa nội dung');
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      console.log('Form values:', values);

      if (editingContent) {
        const updateDto: ContentUpdateDTO = {
          title: values.title,
          content: values.content,
          page: 'home'
        };
        
        console.log('Update DTO:', updateDto);
        await contentService.updateContent(editingContent.id.toString(), updateDto);
        message.success('Cập nhật nội dung thành công');
      } else {
        const createDto: ContentCreateDTO = {
          title: values.title,
          content: values.content,
          page: 'home'
        };
        
        console.log('Create DTO:', createDto);
        await contentService.createContent(createDto);
        message.success('Thêm nội dung thành công');
      }
      setIsModalVisible(false);
      const data = await contentService.getContentsByPage('home'); // Refetch
      setContents(data);
    } catch (error) {
      console.error('Error saving content:', error);
      message.error('Không thể lưu nội dung');
    }
  };

  const leftColumnContent = contents.find(item => item.id === 999);
  const rightColumnContents = contents.filter(item => item.id !== 999);


  return (
    <div className="font-sans">
        {/*deoo biet sua sao cho vua */}
        <div className="bg-gray-200 text-gray-700 h-[75vh] flex items-center py-16 px-4 sm:px-6 lg:px-8">
              <div className="container mx-auto flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
                {/*ben trai */}
                <div className="lg:w-1/2 text-center lg:text-left">
                  <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight mb-6">
                    HIỆU SUẤT ĐẦU TƯ CAO
                  </h1>
                  <p className="text-lg sm:text-xl text-gray-900 mb-8 max-w-xl mx-auto lg:mx-0">
                    Tự động giao dịch phái sinh
                  </p>
                  {!isLoggedIn && (
                    <div className="flex justify-start gap-4">
                      <Link to="/login">
                        <Button className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 px-8 rounded-lg text-lg transition duration-300 ease-in-out transform hover:scale-105">
                          Đăng nhập
                        </Button>
                      </Link>

                      <Link to="/register">
                        <Button className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 px-8 rounded-lg text-lg transition duration-300 ease-in-out transform hover:scale-105">
                          Đăng ký
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>

                {/* ben phai */}
                <div className="lg:w-1/2 mt-10 lg:mt-0">
                  <div className="p-4 h-[300px] sm:h-[400px] md:h-[500px] flex items-center justify-center">
                    <SimpleImageCarousel images={carouselImages} heightClass={carouselHeightClass} autoPlayInterval={autoPlayTime} />
                  </div>
                </div>
              </div>
          </div>  


      {/* tinh nang chinh*/}


      <section className="py-16 lg:py-24 bg-slate-50">

        <div className="mb-20">
          <h2 className= "text-center md:text-4xl font-bold text-gray-700 mb-10">Tính Năng Hệ Thống</h2>
      </div>

        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-center">

            {/* cot trai */}
          <div className="lg:w-5/12 xl:w-1/2 w-full px-4 py-8">
            {contentLoading ? (
              <p className="text-center text-gray-700">Đang tải nội dung...</p>
            ) : leftColumnContent ? (
              <>
                <h2 className="text-left text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 md:mb-6">
                  {leftColumnContent.title}
                </h2>
                <p className="text-left text-gray-700 text-base md:text-lg leading-relaxed text-justify">
                  {leftColumnContent.content}
                </p>
                {isAdmin && (
                  <Button
                    type="primary"
                    icon={<EditOutlined />}
                    onClick={() => handleEditContent(leftColumnContent)}
                    className="mt-4"
                  >
                    Chỉnh sửa
                  </Button>
                )}
              </>
            ) : (
               <p className="text-center text-gray-700">Không tìm thấy nội dung cho cột trái.</p>
            )}
          </div>

            {/* cot phai */}
            <div className="lg:w-7/12 xl:w-1/2 w-full flex flex-col space-y-8 md:space-y-10 relative">
              <div className="flex justify-end mb-4 pr-4">
                {isAdmin && (
                   <Button
                     type="primary"
                     icon={<PlusOutlined />}
                     onClick={handleAddContent}
                   >
                     Thêm mới
                   </Button>
                )}
              </div>
              {contentLoading ? (
                <p className="text-center text-gray-700">Đang tải nội dung...</p>
              ) : rightColumnContents.length > 0 ? (
                <div className="max-h-[600px] md:max-h-[650px] lg:max-h-[700px] xl:max-h-[750px] overflow-y-auto scrollbar-hide px-4">
                  {rightColumnContents.map((step) => (
                    <div key={step.id} className="mb-8 last:mb-0 relative">
                      <ProcessStepCard 
                        icon={"🚀"} // Hardcoded rocket icon
                        title={step.title}
                        content={step.content}
                      />
                       {isAdmin && (
                         <div className="absolute top-2 right-2 flex space-x-2 z-10">
                           <Button
                             type="primary"
                             icon={<EditOutlined />}
                             onClick={() => handleEditContent(step)}
                             size="small"
                           />
                           <Popconfirm
                             title="Bạn có chắc chắn muốn xóa nội dung này?"
                             onConfirm={() => handleDeleteContent(step.id.toString())}
                             okText="Có"
                             cancelText="Không"
                           >
                             <Button
                               type="primary"
                               danger
                               icon={<DeleteOutlined />}
                               size="small"
                             />
                           </Popconfirm>
                         </div>
                       )}
                    </div>
                  ))}
                </div>
              ) : (
                 <p className="text-center text-gray-700">Không có nội dung tính năng nào.</p>
              )}
              {rightColumnContents.length > (/* Approximate number of cards that fit */ 3) && (
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-8 flex items-center justify-center">
                  <div className="animate-bounce">
                    {/* Updated SVG icon */}
                    <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {/* First chevron */}
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7" />
                      {/* Second chevron slightly above */}
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 10l-7 7m0 0l-7-7" />
                    </svg>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>


      {/*bang gia dich vu */}
      <section className="bg-gray-300 py-16 text-center">
        <div className="container mx-auto px-4"> 
          <h2 className="md:text-4xl font-bold text-gray-700 mb-10">Bảng giá dịch vụ</h2>
          
          {loading ? (
            <p className="text-center text-white">Đang tải dữ liệu gói dịch vụ...</p>
          ) : priceBots.length === 0 ? (
            <p className="text-center text-white">Không có dữ liệu gói dịch vụ.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 justify-items-center">
              {priceBots.map((pkg, idx) => (
                <Card key={idx} className="rounded-2xl shadow-lg w-full max-w-xs transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"> 
                  <div className="text-center p-4">

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

                    <h3 className="text-xl font-semibold mb-2">{`${pkg.month} Tháng`}</h3>

                    <div className="flex items-center justify-center gap-2 mb-4">
                      {pkg.discount > 0 ? (
                        <>
                          <span className="text-sm font-semibold text-gray-400 line-through" style={{textDecorationThickness: '1.5px'}}>
                            {pkg.price.toLocaleString('vi-VN')}&nbsp;VND
                          </span>
                          <span className="text-lg font-semibold text-green-700">
                            {(pkg.price * (1 - pkg.discount/100)).toLocaleString('vi-VN')}
                            <span className="text-sm ml-1">VND</span>
                          </span>
                        </>
                      ) : (
                        <span className="text-lg font-semibold text-green-700">
                          {pkg.price.toLocaleString('vi-VN')}
                          <span className="text-sm ml-1">VND</span>
                        </span>
                      )}
                    </div>

                    {pkg.description && (
                      <p className="text-sm text-gray-600 mb-4">{pkg.description}</p>
                    )}

                    {isLoggedIn && (
                      <Button 
                        type="primary" 
                        className="bg-[#22D3EE]"
                        onClick={
                          () => console.log("may ngay................")
                          // () => handleBuyNow(pkg.month, pkg.botTradingId)
                        }
                      >
                        Mua ngay home.tsx
                      </Button>
                    )}

                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      <Modal
        title={editingContent ? 'Chỉnh sửa nội dung' : 'Thêm nội dung mới'}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => {
          setIsModalVisible(false);
        }}
        width={800}
        destroyOnClose // Destroy modal content on close to reset form/upload
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            name="title"
            label="Tiêu đề"
            rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="content"
            label="Nội dung"
            rules={[{ required: true, message: 'Vui lòng nhập nội dung' }]}
          >
            <Input.TextArea rows={6} />
          </Form.Item>
           {/* Hidden field for page, always 'home' */}
          <Form.Item
            name="page"
            initialValue="home"
            hidden
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>

    </div>
  );
};
export default HomePage;
