import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import iconBot from '/src/assets/iconbot.png'; // Adjust the path as necessary
function NotFoundPage() {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="relative flex flex-col items-center justify-center h-screen bg-black" 
    style={{ 
    backgroundImage: "url('src/assets/404background.png')", 
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center'}}>
      <div className="absolute inset-0 bg-black/50"></div>
      <div className="relative z-10 flex flex-col items-center justify-center text-white text-center p-4">
        <img
          src={iconBot}
          alt="Autobot Not Found"
          className="w-20 mb-6 animate-bounce"
        />
        <h1 className="text-5xl font-bold mb-4">Oops! Trang không tồn tại</h1>
        <p className="text-lg mb-6">Hình như bạn đã đi lạc vào vũ trụ của Autobot khác</p>

        <Button
            type="primary"
            className="bg-blue-600 hover:bg-blue-700 active:scale-95 transition-transform duration-150 text-white font-bold uppercase px-10 py-5 rounded-full tracking-wide"
            onClick={handleGoHome}
            >
            Go Back Home
        </Button>

      </div>
    </div>
  );
}

export default NotFoundPage;
