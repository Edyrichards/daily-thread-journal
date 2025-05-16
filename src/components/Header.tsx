
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Feather } from "lucide-react";

interface HeaderProps {
  title?: string;
}

const Header = ({ title }: HeaderProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const showBackButton = location.pathname !== "/";
  
  let displayTitle = title;
  
  if (!title) {
    // Home screen format with the feather icon
    return (
      <header className="bg-[#f8f3eb] pt-6 pb-3 px-6 text-center">
        <div className="flex items-center justify-center">
          <h1 className="text-lg uppercase tracking-wider font-serif text-[#333] text-center">
            Threads of <br /> Grace
          </h1>
          <div className="ml-2 mt-1">
            <Feather size={18} className="rotate-12 opacity-80 text-[#d78b60]" />
          </div>
        </div>
      </header>
    );
  }
  
  // For other pages, show the back button and title
  return (
    <header className="bg-[#f8f3eb] py-6 px-6 flex items-center justify-between">
      {showBackButton && (
        <button 
          onClick={() => navigate(-1)}
          className="text-[#333] p-1"
          aria-label="Go back"
        >
          <ArrowLeft size={18} />
        </button>
      )}
      
      <div className="text-center flex-grow">
        {title === "THREADS of GRACE" ? (
          <div className="flex items-center justify-center">
            <div>
              <h1 className="text-base uppercase tracking-wider font-serif text-[#333]">
                Threads of Grace
              </h1>
            </div>
            <Feather size={16} className="ml-1 rotate-12 opacity-80 text-[#d78b60]" />
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
