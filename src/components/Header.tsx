
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Menu } from "lucide-react";

interface HeaderProps {
  title?: string;
  showMenu?: boolean;
  setShowMenu?: (show: boolean) => void;
}

const Header = ({ title, showMenu, setShowMenu }: HeaderProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const showBackButton = location.pathname !== "/";
  
  const handleMenuClick = () => {
    if (setShowMenu) {
      setShowMenu(!showMenu);
    }
  };
  
  let displayTitle = title;
  
  if (!title) {
    // Home screen format with the feather icon
    return (
      <header className="bg-[#f8f3eb] pt-8 pb-4 px-6 flex items-center justify-between">
        <button 
          onClick={handleMenuClick}
          className="text-[#333] p-2 rounded-full hover:bg-[#e8e8e0]"
          aria-label="Menu"
        >
          <Menu size={24} />
        </button>
        
        <div className="flex items-center justify-center flex-grow">
          <h1 className="text-xl uppercase tracking-wider font-serif text-[#333] text-center">
            Threads of <br /> Grace
          </h1>
          <div className="ml-3 text-2xl rotate-12 opacity-80">🪶</div>
        </div>
        
        <div className="w-10"></div> {/* Empty div for spacing */}
      </header>
    );
  }
  
  // For other pages, show the back button and title
  return (
    <header className="bg-[#f8f3eb] py-6 px-6 flex items-center justify-between">
      {showBackButton ? (
        <button 
          onClick={() => navigate(-1)}
          className="text-[#333] p-1"
          aria-label="Go back"
        >
          <ArrowLeft size={18} />
        </button>
      ) : (
        <button 
          onClick={handleMenuClick}
          className="text-[#333] p-1"
          aria-label="Menu"
        >
          <Menu size={18} />
        </button>
      )}
      
      <div className="text-center flex-grow">
        {title === "THREADS of GRACE" ? (
          <div>
            <h1 className="text-lg uppercase tracking-wider font-serif text-[#333]">
              Threads
            </h1>
            <h1 className="text-lg uppercase tracking-wider font-serif text-[#333]">
              of Grace
            </h1>
          </div>
        ) : (
          <h1 className="text-xl font-serif text-[#333]">
            {displayTitle}
          </h1>
        )}
      </div>
      
      <div className="w-6"></div> {/* Empty div for spacing */}
    </header>
  );
};

export default Header;
