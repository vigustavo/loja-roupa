import React from 'react';
import { Menu, X, Sun, Search, User, ShoppingBag } from 'lucide-react';
import { CATEGORIAS } from '../../data/mockData';
import { CategoriaId } from '../../types';

interface NavbarProps {
  totalItensCarrinho: number;
  categoriaAtiva: CategoriaId;
  termoBusca: string;
  onSearchChange: (termo: string) => void;
  onCategoryChange: (id: CategoriaId) => void;
  onOpenCart: () => void;
  onOpenUserMenu: () => void;
  onOpenMobileMenu: () => void;
  mobileMenuAberto: boolean;
}

const Navbar: React.FC<NavbarProps> = ({
  totalItensCarrinho,
  categoriaAtiva,
  termoBusca,
  onSearchChange,
  onCategoryChange,
  onOpenCart,
  onOpenUserMenu,
  onOpenMobileMenu,
  mobileMenuAberto
}) => {
  return (
    <nav className="fixed w-full bg-[#FDFBF7]/95 backdrop-blur-md z-40 transition-all duration-300 border-b border-neutral-100/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative flex justify-between items-center h-20 md:h-24">
          
          {/* Menu Mobile */}
          <button
            className="p-3 -ml-2 hover:bg-orange-50 rounded-full md:hidden text-neutral-800 focus:outline-none"
            onClick={onOpenMobileMenu}
          >
            {mobileMenuAberto ? <X size={30} /> : <Menu size={30} />}
          </button>

          {/* Logo */}
          <a 
            href="#" 
            className="mx-auto md:mx-0 flex items-center gap-2 text-2xl md:text-3xl font-serif font-bold tracking-tight text-neutral-800" 
            onClick={(e) => { e.preventDefault(); onCategoryChange('todos'); }}
          >
            <Sun size={28} className="text-yellow-400 fill-yellow-400" />
            <span className="flex flex-col leading-none">
              LUMINA
              <span className="text-xs font-sans font-medium tracking-widest text-rose-400 uppercase mt-0.5 ml-0.5">Kids Store</span>
            </span>
          </a>

          {/* Links Desktop */}
          <div className="hidden md:flex space-x-10 text-sm font-bold tracking-wide text-neutral-500">
            {CATEGORIAS.filter(c => c.id !== 'todos').slice(0, 4).map((item) => (
              <button 
                key={item.id} 
                onClick={() => onCategoryChange(item.id)}
                className={`hover:text-rose-400 transition-colors relative group py-2 ${categoriaAtiva === item.id ? 'text-rose-400' : ''}`}
              >
                {item.nome}
                <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-rose-400 rounded-full transition-all ${categoriaAtiva === item.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} />
              </button>
            ))}
          </div>

          {/* Ícones da Direita */}
          <div className="flex items-center space-x-2 md:space-x-3">
            <button className="p-3 hover:bg-orange-50 rounded-full transition-colors text-neutral-600" onClick={onOpenUserMenu}>
              <User size={26} className="w-6 h-6 md:w-7 md:h-7" />
            </button>

            <div className="relative">
              <button className="p-3 hover:bg-orange-50 rounded-full transition-colors text-neutral-600" onClick={onOpenCart}>
                <ShoppingBag size={26} className="w-6 h-6 md:w-7 md:h-7" />
                {totalItensCarrinho > 0 && (
                  <span className="absolute top-2 right-0 inline-flex items-center justify-center w-5 h-5 text-[10px] font-bold text-white bg-rose-400 rounded-full shadow-sm border-2 border-white">
                    {totalItensCarrinho}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;