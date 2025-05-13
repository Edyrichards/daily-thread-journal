
import { Link } from "react-router-dom";

interface HeaderProps {
  title?: string;
}

const Header = ({ title }: HeaderProps) => {
  return (
    <header className="bg-white shadow-sm py-4 px-6 flex items-center justify-between">
      <div className="flex items-center">
        <h1 className="text-xl font-serif font-medium text-grace-700">
          {title || "Threads of Grace"}
        </h1>
      </div>
      <nav className="flex space-x-4">
        <Link 
          to="/" 
          className="text-grace-500 hover:text-grace-700 transition-colors"
        >
          Home
        </Link>
        <Link 
          to="/journal" 
          className="text-grace-500 hover:text-grace-700 transition-colors"
        >
          Journal
        </Link>
        <Link 
          to="/prayer" 
          className="text-grace-500 hover:text-grace-700 transition-colors"
        >
          Prayers
        </Link>
      </nav>
    </header>
  );
};

export default Header;
