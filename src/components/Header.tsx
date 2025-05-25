
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Feather } from "lucide-react";

interface HeaderProps {
  title?: string;
}

const Header = ({ title }: HeaderProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const showBackButton = location.pathname !== "/";
  
  // let displayTitle = title; // Not strictly needed if title is directly used.
  
  if (!title) {
    // Home screen format with the feather icon
    return (
      <header className="pt-6 pb-3 px-6 text-center"> {/* Removed bg-[#f8f3eb] */}
        <div className="flex items-center justify-center">
          <h1 className="text-lg uppercase tracking-wider font-serif text-foreground text-center"> {/* Changed text-[#333] */}
            Threads of <br /> Grace
          </h1>
          <div className="ml-2 mt-1">
            <Feather size={18} className="rotate-12 opacity-80 text-grace-gold" /> {/* Changed text-[#d78b60] */}
          </div>
        </div>
      </header>
    );
  }
  
  // For other pages, show the back button and title
  return (
    <header className="py-6 px-6 flex items-center justify-between"> {/* Removed bg-[#f8f3eb] */}
      <div className="w-10 flex items-center justify-start"> {/* Container for back button */}
        {showBackButton && (
          <button 
            onClick={() => navigate(-1)}
            className="text-foreground p-1" /* Changed text-[#333] */
            aria-label="Go back"
          >
            <ArrowLeft size={18} />
          </button>
        )}
      </div>
      
      <div className="text-center flex-grow">
        {title === "THREADS of GRACE" ? (
          <div className="flex items-center justify-center">
            <div>
              <h1 className="text-base uppercase tracking-wider font-serif text-foreground"> {/* Changed text-[#333] */}
                Threads of Grace
              </h1>
            </div>
            <Feather size={16} className="ml-1 rotate-12 opacity-80 text-grace-gold" /> {/* Changed text-[#d78b60] */}
          </div>
        ) : (
          <h1 className="text-xl font-serif text-foreground"> {/* Changed text-[#333] */}
            {title} {/* Used title directly */}
          </h1>
        )}
      </div>
      
      <div className="w-10"></div> {/* Spacer div to balance the back button */}
    </header>
  );
};

export default Header;
