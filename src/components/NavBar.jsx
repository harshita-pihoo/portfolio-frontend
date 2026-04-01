import { Link } from 'react-router-dom';

const NavBar = () => {
  return (
    <nav className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="text-white font-bold text-xl">
          Portfolio
        </Link>
        <div className="flex gap-8">
          <Link to="/" className="text-gray-300 hover:text-white transition-colors">Home</Link>
          <Link to="/projects" className="text-gray-300 hover:text-white transition-colors">Projects</Link>
          <Link to="/resume" className="text-gray-300 hover:text-white transition-colors">Resume</Link>
          <Link to="/contact" className="text-gray-300 hover:text-white transition-colors">Contact</Link>
          {/* <Link to="/admin" className="text-gray-300 hover:text-white transition-colors">Admin</Link> */}
          <Link to="/admin/login" className="text-gray-300 hover:text-white transition-colors">Admin</Link>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;