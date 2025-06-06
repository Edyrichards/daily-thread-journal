
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Feather, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  title?: string;
  onMenuClick?: () => void;
}

const Header = ({ title, onMenuClick }: HeaderProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const showBackButton = location.pathname !== "/";
  
  if (!title) {
    // Home screen format with the feather icon
    return (
      <header className="pt-6 pb-3 px-6 text-center">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuClick}
            className="text-foreground"
          >
            <Menu size={20} />
          </Button>
          
          <div className="flex items-center justify-center flex-1">
            <h1 className="text-lg uppercase tracking-wider font-serif text-foreground text-center">
              Threads of <br /> Grace
            </h1>
            <div className="ml-2 mt-1">
              <Feather size={18} className="rotate-12 opacity-80 text-grace-gold" />
            </div>
          </div>
          
          <div className="w-10"></div> {/* Spacer */}
        </div>
      </header>
    );
  }
  
  // For other pages, show the back button and title
  return (
    <header className="py-6 px-6 flex items-center justify-between">
      <div className="w-10 flex items-center justify-start">
        {showBackButton ? (
          <button 
            onClick={() => navigate(-1)}
            className="text-foreground p-1"
            aria-label="Go back"
          >
            <ArrowLeft size={18} />
          </button>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuClick}
            className="text-foreground p-1"
          >
            <Menu size={18} />
          </Button>
        )}
      </div>
      
      <div className="text-center flex-grow">
        {title === "THREADS of GRACE" ? (
          <div className="flex items-center justify-center">
            <div>
              <h1 className="text-base uppercase tracking-wider font-serif text-foreground">
                Threads of Grace
              </h1>
            </div>
            <Feather size={16} className="ml-1 rotate-12 opacity-80 text-grace-gold" />
          </div>
        ) : (
          <h1 className="text-xl font-serif text-foreground">
            {title}
          </h1>
        )}
      </div>
      
      <div className="w-10"></div>
    </header>
  );
};

export default Header;
