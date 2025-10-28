import abouttest from '/src/assets/abouttest.jpg'
import React, { useEffect, useState } from 'react';
import { Card, Button, Modal, Form, Input, message, Popconfirm, Table, Upload } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { contentService, Content, ContentCreateDTO, ContentUpdateDTO } from '../services/contentService';
import { authService } from '../services/authService';
import { botTradingService, type BotTrading } from '../services/botService';
import { Link } from 'react-router-dom';
import type { UploadFile } from 'antd/es/upload/interface';

const About: React.FC = () => {
  const [contents, setContents] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingContent, setEditingContent] = useState<Content | null>(null);
  const [form] = Form.useForm();
  const [isAdmin, setIsAdmin] = useState(false);
  const [botListData, setBotListData] = useState<BotTrading[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  useEffect(() => {
    const user = authService.getCurrentUser();
    setIsAdmin(user?.roles?.includes('Admin') || false);
    fetchContents();
    fetchBotData();
  }, []);

    const fetchBotData = async () => {
      try {
        const data = await botTradingService.getAllBotTradings();
        setBotListData(data); 
        setError(null); 
      } catch (err) {
        console.error("Failed to fetch bot list:", err);
        setError("Không thể tải danh sách bot. Vui lòng thử lại sau.");
        setBotListData([]);
    }
  };

  const fetchContents = async () => {
    try {
      const data = await contentService.getContentsByPage('about');
      console.log(data);
      setContents(data);
    } catch (error) {
      console.error('Error fetching contents:', error);
      message.error('Không thể tải nội dung');
      } finally {
        setLoading(false);
      }
    };

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
      page: 'about'
    });
    if (content.url) {
      setFileList([{
        uid: '-1',
        name: 'current-image',
        status: 'done',
        url: `${import.meta.env.VITE_API_URL || 'http://localhost:5131'}/assets/images/${content.url}`,
      }]);
    } else {
      setFileList([]);
    }
    setIsModalVisible(true);
  };

  const handleDeleteContent = async (id: string) => {
    try {
      await contentService.deleteContent(id);
      message.success('Xóa nội dung thành công');
      fetchContents();
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
          page: 'about'
        };
        
        if (fileList.length > 0 && fileList[0].originFileObj) {
          updateDto.ImageFile = fileList[0].originFileObj;
        }
        
        console.log('Update DTO:', updateDto);
        await contentService.updateContent(editingContent.id.toString(), updateDto);
        message.success('Cập nhật nội dung thành công');
      } else {
        const createDto: ContentCreateDTO = {
          title: values.title,
          content: values.content,
          page: 'about'
        };
        
        if (fileList.length > 0 && fileList[0].originFileObj) {
          createDto.ImageFile = fileList[0].originFileObj;
        }
        
        console.log('Create DTO:', createDto);
        await contentService.createContent(createDto);
        message.success('Thêm nội dung thành công');
      }
      setIsModalVisible(false);
      fetchContents();
    } catch (error) {
      console.error('Error saving content:', error);
      message.error('Không thể lưu nội dung');
    }
  };

  const renderContentBlock = (content: Content, index: number) => {
    const isEven = index % 2 === 0;
    const bgColor = isEven ? 'bg-gray-300' : 'bg-white';
    const flexDirection = isEven ? 'md:flex-row' : 'md:flex-row-reverse';


    // Construct the full image URL
    const imageUrl = content.url 
      ? `${import.meta.env.VITE_API_URL || 'http://localhost:5131'}/assets/images/${content.url}`
      : `src/assets/info${index + 1}.png`;

    console.log('Final image URL for rendering:', imageUrl);

    return (
      <div key={content.id} className={`block-animate-on-scroll h-[75vh] flex flex-col ${flexDirection} justify-center md:space-x-8 items-start px-4 py-8 ${bgColor} mb-40 pt-28`}>
        
        <img
          src={imageUrl}
          alt={content.title}
          className="p-4 h-[300px] sm:h-[400px] md:h-[500px] object-contain"
          onError={(e) => {
            console.error('Image load error:', e);
            e.currentTarget.src = `src/assets/info${index + 1}.png`;
          }}
        />
        <div className="pt-16 relative">
          <Card className="w-[70vh] h-[300px] rounded-2xl shadow-lg">
            <h2 className="text-2xl font-bold mb-2">{content.title}</h2>
            <p className="text-lg text-gray-600 mb-4">{content.content}</p>
          </Card>
          {isAdmin && (
            <div className="absolute top-2 right-2 flex space-x-2">
              <Button
                type="primary"
                icon={<EditOutlined />}
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
                />
              </Popconfirm>
            </div>
          )}
        </div>
      </div>
    );
  };

  const columns = [
    {
      title: 'Tên bot',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Số lệnh',
      dataIndex: 'commandNumber',
      key: 'commandNumber',
    },
    {
      title: 'Lợi nhuận',
      dataIndex: 'profit',
      key: 'profit',
      render: (profit: number) => `${profit.toLocaleString('vi-VN')} VND`,
    },
    {
      title: 'Tỉ lệ thắng',
      dataIndex: 'winRate',
      key: 'winRate',
      render: (winRate: number) => `${winRate}%`,
    },
    {
      title: 'Lãi suất',
      dataIndex: 'interestRate',
      key: 'interestRate',
      render: (interestRate: number) => `${interestRate}%`,
    },
  ];

  // const dataSource = botListData.map(bot => ({
  //   ...bot,
  //   key: `${bot.botTradingId}-${bot.month}-${bot.price}`,
  // }));

  return (
    <div className="min-h-screen">
        <div className="h-[75vh] bg-cover flex items-center py-16 px-4 sm:px-6 lg:px-8" 
     style={{ backgroundImage: `url(${abouttest})` }}>
          <div className="text-start ml-8">
            <h2 className="text-3xl text-white font-bold uppercase">
              Chào mừng bạn đến với Bot đầu tư chứng khoán
            </h2>
          </div>
        </div>

      <div className="bg-white py-10 px-5 flex justify-center items-center space-x-4">
        <h2 className="text-2xl font-bold uppercase text-black text-center mb-0">
            Tại Sao Chọn Bot Đầu Tư Chứng Khoán?
          </h2>
        {isAdmin && (
          <Button
            type="primary"
            shape="circle"
            size="large"
            icon={<PlusOutlined />}
            onClick={handleAddContent}
          />
        )}
          </div>

      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
            </div>
      ) : (
        contents.map((content, index) => renderContentBlock(content, index))
      )}

          <div className="mx-8 items-center">
            <h2 className="text-2xl text-center font-bold text-black mb-6 mt-24">
              Bảng Giá Các Gói Bot
            </h2>

            {loading && <p className="text-black text-center">Đang tải dữ liệu...</p>}
            {error && <p className="text-red-500 text-center">{error}</p>}
            {!loading && !error && (
              <Table
                columns={columns}
                dataSource={botListData}
                components={{
                  header: {
                    cell: (props: any) => (
                      <th
                        {...props}
                        style={{
                          textAlign: 'center',
                          padding: '12px 8px',
                          backgroundColor: '#f0f0f0',
                          fontWeight: 'bold',
                        }}
                      />
                    ),
                  },
                  body: {
                    cell: (props: any) => ( 
                      <td
                        {...props}
                        style={{
                          textAlign: 'center',
                          padding: '12px 8px',
                        }}
                      />
                    ),
                  },
                }}
                bordered
                pagination={{ pageSize: 5 }} 
              />
            )}
          </div>

      <div className="w-full flex justify-center mb-12">
        <Link to="/service-rate">
          <button className="mt-6 px-6 py-2 bg-blue-500 hover:bg-blue-600 rounded text-white font-medium">
            Đăng Ký Ngay
          </button>
        </Link>
      </div>

      <Modal
        title={editingContent ? 'Chỉnh sửa nội dung' : 'Thêm nội dung mới'}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => {
          setIsModalVisible(false);
          setFileList([]);
        }}
        width={800}
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
          <Form.Item
            label="Ảnh"
            name="image"
            rules={[{ required: true, message: 'Vui lòng tải lên ít nhất một hình ảnh' }]}
          >
            <Upload
              listType="picture-card"
              maxCount={1}
              
              fileList={fileList}
              beforeUpload={(file) => {
                const isLt5M = file.size / 1024 / 1024 < 5;
                if (!isLt5M) {
                  message.error('Ảnh phải nhỏ hơn 5MB!');
                  return false;
                }
                const isImage = file.type.startsWith('image/');
                if (!isImage) {
                  message.error('Chỉ được upload file ảnh!');
                  return false;
                }
                return false;
              }}
              onChange={({ fileList }) => {
                console.log('File list changed:', fileList);
                setFileList(fileList);
              }}
              onRemove={() => {
                setFileList([]);
                return true;
              }}
            >
              {fileList.length >= 1 ? null : (
                <div>
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>Upload</div>
                </div>
              )}
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default About;