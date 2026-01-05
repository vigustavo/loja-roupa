import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Heart,
  ShoppingBag,
  Star,
  ChevronLeft,
  ChevronRight,
  Ruler,
  Truck,
  CreditCard,
  ShieldCheck,
  RotateCcw,
  CheckCircle,
  Clock,
  Lock,
  Phone,
  Share2
} from 'lucide-react';
import { Produto, CategoriaId } from '../../types';
import Navbar from '../layout/Navbar';

// Mock Data for extra fields not in Produto type
const MOCK_DATA = {
  sku: "MK1131VER",
  rating: 5.0,
  reviewsCount: 1412,
  composition: {
    main: "100% Algodão",
    secondary: "85% Algodão no mínimo"
  },
  care: [
    "Lavar com cores similares",
    "Não deixar de molho",
    "Não usar alvejante",
    "Não secar na máquina",
    "Não passar sobre a estampa"
  ]
};

const MEASUREMENTS = {
  top: [
    { tam: "02", torax: "30cm", compr: "41cm" },
    { tam: "04", torax: "34cm", compr: "45cm" },
    { tam: "06", torax: "36cm", compr: "47cm" },
    { tam: "08", torax: "38cm", compr: "49cm" },
    { tam: "10", torax: "40cm", compr: "51cm" },
    { tam: "12", torax: "42cm", compr: "53cm" },
  ],
  bottom: [
    { tam: "02", cint: "20cm", compr: "28cm" },
    { tam: "04", cint: "23cm", compr: "32cm" },
    { tam: "06", cint: "25cm", compr: "34cm" },
    { tam: "08", cint: "27cm", compr: "36cm" },
    { tam: "10", cint: "29cm", compr: "38cm" },
    { tam: "12", cint: "31cm", compr: "40cm" },
  ]
};

const INITIAL_REVIEWS = [
  { id: 1, name: "Amanda S.", date: "28/12/2025", location: "Brasília - DF", text: "Lindo", recommend: true, rating: 5 },
  { id: 2, name: "Simone D.", date: "26/12/2025", location: "Herval D'Oeste - SC", text: "Eu amei e o meu filho também amou. Parabéns!", recommend: true, rating: 5 },
  { id: 3, name: "Diandra M.", date: "26/12/2025", location: "Corumbá - MS", text: "Ficou certinho no meu filho amei", recommend: true, rating: 5 },
  { id: 4, name: "Carla T.", date: "25/12/2025", location: "São Paulo - SP", text: "Qualidade excelente, entrega rápida.", recommend: true, rating: 5 },
  { id: 5, name: "Mariana R.", date: "24/12/2025", location: "Rio de Janeiro - RJ", text: "Adorei as cores, muito vivas.", recommend: true, rating: 4 },
  { id: 6, name: "Fernanda L.", date: "23/12/2025", location: "Belo Horizonte - MG", text: "Tecido muito macio.", recommend: true, rating: 5 },
  { id: 7, name: "Patrícia O.", date: "22/12/2025", location: "Curitiba - PR", text: "Recomendo a loja!", recommend: true, rating: 5 },
];

interface ProductDetailProps {
  produto: Produto;
  onClose: () => void;
  onAddToCart: (produto: Produto, tamanho: string | null) => void;
  onToggleWishlist: (id: number) => void;
  isWishlisted: boolean;
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

const TabButton = ({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) => (
  <button
    onClick={onClick}
    className={`px-6 py-3 font-medium text-sm transition-all border-b-2 ${
      active 
        ? 'border-rose-500 text-rose-600' 
        : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
    }`}
  >
    {children}
  </button>
);

const TrustBadge = ({ icon: Icon, title, text, className = '' }: { icon: any, title: string, text: string, className?: string }) => (
  <div className={`flex items-start gap-3 p-4 bg-neutral-50 rounded-lg border border-neutral-100 ${className}`}>
    <div className="p-1.5 bg-white rounded-full shadow-sm text-rose-500 flex-shrink-0">
      <Icon size={16} />
    </div>
    <div>
      <h4 className="font-bold text-neutral-800 text-xs">{title}</h4>
      <p className="text-xs text-neutral-500 mt-0.5">{text}</p>
    </div>
  </div>
);

const ProductDetail: React.FC<ProductDetailProps> = ({
  produto,
  onClose,
  onAddToCart,
  onToggleWishlist,
  isWishlisted,
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
  const [activeImage, setActiveImage] = useState(produto.imagens[0] || produto.imagem);
  const [selectedSize, setSelectedSize] = useState<string | null>(produto.tamanhos[0] ?? null);
  const [activeTab, setActiveTab] = useState('description');
  const [cep, setCep] = useState('');

  // Drag Scroll State
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollContainerRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 2; // Scroll speed multiplier
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  // Review State
  const [reviews, setReviews] = useState(INITIAL_REVIEWS);
  const [isWritingReview, setIsWritingReview] = useState(false);
  const [newReview, setNewReview] = useState({
    name: '',
    location: '',
    text: '',
    rating: 5,
    recommend: true
  });

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 5;

  const totalPages = Math.ceil(reviews.length / ITEMS_PER_PAGE);
  const currentReviews = reviews.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    const review = {
      id: reviews.length + 1,
      ...newReview,
      name: "Usuário Anônimo", // Simulado: viria do sistema
      location: "Brasil", // Simulado: viria do sistema
      date: new Date().toLocaleDateString('pt-BR')
    };
    setReviews([review, ...reviews]);
    setIsWritingReview(false);
    setNewReview({ name: '', location: '', text: '', rating: 5, recommend: true });
  };

  useEffect(() => {
    setActiveImage(produto.imagens[0] || produto.imagem);
    setSelectedSize(produto.tamanhos[0] ?? null);
  }, [produto]);

  const originalPrice = produto.preco * 1.2;
  const pixPrice = produto.preco; // Assuming same price for now or discount logic
  const installments = `3x de R$ ${(produto.preco / 3).toFixed(2).replace('.', ',')} sem juros`;

  return (
    <div className="fixed inset-0 z-50 bg-neutral-900/40 backdrop-blur-sm overflow-y-auto">
      <div className="min-h-screen bg-[#FDFBF7] font-sans text-neutral-800">
        <Navbar
          totalItensCarrinho={totalItensCarrinho}
          categoriaAtiva={categoriaAtiva}
          termoBusca={termoBusca}
          onSearchChange={onSearchChange}
          onCategoryChange={onCategoryChange}
          onOpenCart={onOpenCart}
          onOpenUserMenu={onOpenUserMenu}
          onOpenMobileMenu={onOpenMobileMenu}
          mobileMenuAberto={mobileMenuAberto}
        />

        {/* Close Button */}
        <div className="fixed top-24 right-4 z-50">
           <button
            onClick={onClose}
            className="p-2 rounded-full bg-white shadow-md hover:bg-neutral-100 text-neutral-500"
            aria-label="Fechar"
          >
            <X size={24} />
          </button>
        </div>

        <main className="max-w-7xl mx-auto py-8 px-4 pt-28">
          
          {/* Breadcrumbs */}
          <nav className="text-sm text-neutral-500 mb-6 flex items-center gap-2">
            <span className="cursor-pointer hover:text-rose-500" onClick={onClose}>Home</span> 
            <ChevronRight size={14} />
            <span className="capitalize">{produto.categoria}</span>
            <ChevronRight size={14} />
            <span className="text-neutral-800 font-medium truncate max-w-[200px]">{produto.nome}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            {/* COLUNA ESQUERDA: IMAGENS */}
            <div className="lg:col-span-7 flex flex-col md:flex-row gap-4">
              <div className="flex md:flex-col gap-3 order-2 md:order-1 overflow-x-auto md:overflow-hidden pb-2 md:pb-0">
                {produto.imagens.map((img, idx) => (
                  <button 
                    key={idx} 
                    onClick={() => setActiveImage(img)}
                    className={`w-16 h-16 md:w-20 md:h-20 border-2 rounded-xl overflow-hidden flex-shrink-0 transition-all ${activeImage === img ? 'border-rose-500 shadow-md' : 'border-neutral-200 hover:border-rose-200'}`}
                  >
                    <img src={img} className="w-full h-full object-cover" alt={`View ${idx}`} />
                  </button>
                ))}
              </div>
              <div className="flex-1 order-1 md:order-2 bg-white rounded-3xl shadow-sm border border-neutral-100 overflow-hidden relative group">
                <img src={activeImage} className="w-full h-full object-cover aspect-[4/5] md:aspect-auto md:min-h-[600px]" alt={produto.nome} />
                {produto.novo && (
                    <div className="absolute top-4 left-4 bg-rose-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                        NOVIDADE
                    </div>
                )}
              </div>
            </div>

            {/* COLUNA DIREITA: INFO & COMPRA */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Título e Preço */}
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-neutral-100">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-xs font-medium text-neutral-500 bg-neutral-100 px-2 py-1 rounded-md">Ref: {produto.id}</span>
                  <div className="flex text-yellow-400 text-sm items-center">
                    <Star fill="currentColor" size={16} />
                    <span className="text-neutral-800 font-bold ml-1">{MOCK_DATA.rating}</span>
                    <span className="text-neutral-400 ml-1">({MOCK_DATA.reviewsCount})</span>
                  </div>
                </div>

                <h1 className="text-2xl md:text-3xl font-serif font-bold text-neutral-900 mb-4 leading-tight">
                  {produto.nome}
                </h1>

                <div className="mb-6 space-y-1">
                  <span className="text-neutral-400 line-through text-lg">R$ {originalPrice.toFixed(2).replace('.',',')}</span>
                  <div className="flex items-end gap-2">
                    <span className="text-4xl font-bold text-rose-500">R$ {produto.preco.toFixed(2).replace('.',',')}</span>
                    <span className="text-sm text-emerald-600 font-medium bg-emerald-50 px-2 py-0.5 rounded-full">10% OFF no PIX</span>
                  </div>
                  <p className="text-sm text-neutral-500">ou {installments}</p>
                </div>

                {/* Seletor de Tamanho */}
                <div className="mb-8">
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-bold text-neutral-800">Tamanho:</span>
                    <button onClick={() => setActiveTab('measures')} className="text-xs text-rose-500 font-semibold underline flex items-center gap-1 hover:text-rose-600">
                      <Ruler size={14} /> Tabela de medidas
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {produto.tamanhos.map(size => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`w-12 h-12 rounded-xl border-2 font-bold transition-all
                          ${selectedSize === size 
                            ? 'bg-rose-500 text-white border-rose-500 shadow-lg shadow-rose-200' 
                            : 'bg-white text-neutral-600 border-neutral-200 hover:border-rose-300'}`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Ações */}
                <div className="flex gap-3 mb-6">
                  <button 
                    onClick={() => onAddToCart(produto, selectedSize)}
                    disabled={!selectedSize}
                    className={`flex-1 py-4 rounded-xl font-bold text-lg shadow-xl flex items-center justify-center gap-2 transition-all transform active:scale-95 ${
                        selectedSize 
                        ? 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-emerald-200' 
                        : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                    }`}
                  >
                    <ShoppingBag size={20} />
                    {selectedSize ? 'COMPRAR AGORA' : 'SELECIONE O TAMANHO'}
                  </button>
                  <button 
                    onClick={() => onToggleWishlist(produto.id)}
                    className={`p-4 border-2 rounded-xl transition-colors ${
                        isWishlisted 
                        ? 'border-rose-200 bg-rose-50 text-rose-500' 
                        : 'border-neutral-200 text-neutral-400 hover:text-rose-500 hover:border-rose-200'
                    }`}
                  >
                    <Heart size={24} className={isWishlisted ? 'fill-rose-500' : ''} />
                  </button>
                </div>

                {/* Calculadora de Frete */}
                <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-100">
                  <label className="text-sm font-bold text-neutral-700 flex items-center gap-2 mb-2">
                    <Truck size={18} className="text-rose-500" /> Calcule o frete
                  </label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={cep}
                      onChange={(e) => setCep(e.target.value)}
                      placeholder="00000-000"
                      className="flex-1 border border-neutral-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
                    />
                    <button className="bg-neutral-800 text-white px-5 py-2 rounded-lg text-sm font-bold hover:bg-neutral-700 transition-colors">
                      OK
                    </button>
                  </div>
                  <a href="#" className="text-xs text-neutral-500 underline mt-2 block hover:text-rose-500">Não sei o meu CEP</a>
                </div>
              </div>

              {/* Sinais de Confiança */}
              <div className="bg-white p-5 rounded-3xl shadow-sm border border-neutral-100 overflow-hidden">
                <h3 className="font-bold text-neutral-800 mb-4 px-1">Por que comprar na Lumina?</h3>
                
                {/* Mobile Marquee */}
                <div className="sm:hidden relative w-full overflow-hidden">
                  <style>{`
                    @keyframes marquee {
                      0% { transform: translateX(0); }
                      100% { transform: translateX(-50%); }
                    }
                    .animate-marquee {
                      animation: marquee 20s linear infinite;
                    }
                  `}</style>
                  <div className="flex w-max animate-marquee gap-3">
                    {[
                      { icon: Truck, title: "Frete Rápido", text: "Envio em até 24h" },
                      { icon: CreditCard, title: "Facilidade", text: "Até 10x sem juros" },
                      { icon: ShieldCheck, title: "Compra Segura", text: "Dados protegidos" },
                      { icon: RotateCcw, title: "Troca Fácil", text: "7 dias grátis" },
                      { icon: Truck, title: "Frete Rápido", text: "Envio em até 24h" },
                      { icon: CreditCard, title: "Facilidade", text: "Até 10x sem juros" },
                      { icon: ShieldCheck, title: "Compra Segura", text: "Dados protegidos" },
                      { icon: RotateCcw, title: "Troca Fácil", text: "7 dias grátis" }
                    ].map((item, idx) => (
                      <TrustBadge 
                        key={idx} 
                        className="min-w-[220px]" 
                        icon={item.icon} 
                        title={item.title} 
                        text={item.text} 
                      />
                    ))}
                  </div>
                </div>

                {/* Desktop Grid */}
                <div className="hidden sm:grid sm:grid-cols-2 gap-3">
                  <TrustBadge icon={Truck} title="Frete Rápido" text="Envio em até 24h" />
                  <TrustBadge icon={CreditCard} title="Facilidade" text="Até 10x sem juros" />
                  <TrustBadge icon={ShieldCheck} title="Compra Segura" text="Dados protegidos" />
                  <TrustBadge icon={RotateCcw} title="Troca Fácil" text="7 dias grátis" />
                </div>
              </div>

            </div>
          </div>

          {/* --- CONTEÚDO DETALHADO (Abas) --- */}
          <div className="mt-12 bg-white rounded-3xl shadow-sm border border-neutral-100 overflow-hidden" id="details">
            <div className="flex border-b border-neutral-100 overflow-x-auto">
              <TabButton active={activeTab === 'description'} onClick={() => setActiveTab('description')}>Descrição</TabButton>
              <TabButton active={activeTab === 'measures'} onClick={() => setActiveTab('measures')}>Medidas</TabButton>
              <TabButton active={activeTab === 'care'} onClick={() => setActiveTab('care')}>Cuidados</TabButton>
            </div>

            <div className="p-6 md:p-8">
              {activeTab === 'description' && (
                <div className="prose max-w-none text-neutral-600">
                  <h3 className="text-xl font-serif font-bold text-neutral-800 mb-4">Detalhes do Produto</h3>
                  <p className="whitespace-pre-line leading-relaxed">
                    {produto.descricao}
                  </p>
                  <p className="mt-4">
                    Peça confeccionada com todo carinho para proporcionar o máximo de conforto e estilo para os pequenos.
                  </p>
                </div>
              )}

              {activeTab === 'measures' && (
                <div className="grid md:grid-cols-2 gap-10">
                  <div>
                    <h4 className="font-bold text-rose-500 mb-4 flex items-center gap-2"><Ruler size={18}/> Medidas da Peça (Superior)</h4>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm text-left text-neutral-600">
                        <thead className="bg-neutral-50 text-neutral-700 font-bold uppercase">
                          <tr>
                            <th className="px-4 py-3 rounded-l-lg">Tamanho</th>
                            <th className="px-4 py-3">Tórax</th>
                            <th className="px-4 py-3 rounded-r-lg">Comprimento</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-100">
                          {MEASUREMENTS.top.map((row, i) => (
                            <tr key={i} className="hover:bg-neutral-50">
                              <td className="px-4 py-3 font-bold">{row.tam}</td>
                              <td className="px-4 py-3">{row.torax}</td>
                              <td className="px-4 py-3">{row.compr}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold text-rose-500 mb-4 flex items-center gap-2"><Ruler size={18}/> Medidas da Peça (Inferior)</h4>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm text-left text-neutral-600">
                        <thead className="bg-neutral-50 text-neutral-700 font-bold uppercase">
                          <tr>
                            <th className="px-4 py-3 rounded-l-lg">Tamanho</th>
                            <th className="px-4 py-3">Cintura</th>
                            <th className="px-4 py-3 rounded-r-lg">Comprimento</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-100">
                          {MEASUREMENTS.bottom.map((row, i) => (
                            <tr key={i} className="hover:bg-neutral-50">
                              <td className="px-4 py-3 font-bold">{row.tam}</td>
                              <td className="px-4 py-3">{row.cint}</td>
                              <td className="px-4 py-3">{row.compr}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="mt-4 p-4 bg-yellow-50 text-yellow-800 text-sm rounded-xl border border-yellow-100 flex gap-2">
                      <Lock size={16} className="flex-shrink-0 mt-0.5"/>
                      <p><strong>Atenção:</strong> As medidas podem variar até 3cm. Na dúvida, opte por um tamanho maior.</p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'care' && (
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="font-bold text-neutral-800 mb-3">Composição</h4>
                    <ul className="list-disc pl-5 space-y-2 text-neutral-600">
                      <li><strong>Principal:</strong> {MOCK_DATA.composition.main}</li>
                      <li><strong>Detalhes:</strong> {MOCK_DATA.composition.secondary}</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-bold text-neutral-800 mb-3">Cuidados</h4>
                    <ul className="space-y-2 text-neutral-600">
                      {MOCK_DATA.care.map((item, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <CheckCircle size={16} className="text-emerald-500"/> {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* --- PRODUTOS RELACIONADOS --- */}
          <section className="mt-12">
            <h3 className="text-2xl font-serif font-bold text-neutral-800 mb-6">Produtos que você gosta</h3>
            <div 
              ref={scrollContainerRef}
              className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 md:mx-0 md:px-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] cursor-grab active:cursor-grabbing"
              onMouseDown={handleMouseDown}
              onMouseLeave={handleMouseLeave}
              onMouseUp={handleMouseUp}
              onMouseMove={handleMouseMove}
            >
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div key={item} className="min-w-[160px] md:min-w-[200px] bg-white rounded-2xl p-3 border border-neutral-100 shadow-sm hover:shadow-md transition-all cursor-pointer group select-none">
                  <div className="aspect-[4/5] rounded-xl overflow-hidden mb-3 bg-neutral-100 relative">
                    <img 
                      src={produto.imagem} 
                      alt="Produto Relacionado" 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 pointer-events-none"
                    />
                    <button className="absolute top-2 right-2 p-1.5 bg-white/80 backdrop-blur-sm rounded-full text-neutral-400 hover:text-rose-500 transition-colors">
                      <Heart size={16} />
                    </button>
                  </div>
                  <h4 className="font-medium text-neutral-800 text-sm mb-1 truncate">Produto Relacionado {item}</h4>
                  <p className="text-rose-500 font-bold text-sm">R$ {produto.preco.toFixed(2).replace('.', ',')}</p>
                  <p className="text-xs text-neutral-400">3x de R$ {(produto.preco/3).toFixed(2).replace('.', ',')}</p>
                </div>
              ))}
            </div>
          </section>

          {/* --- AVALIAÇÕES --- */}
          <section className="mt-12 bg-white rounded-3xl shadow-sm border border-neutral-100 p-6 md:p-8">
            <div className="flex flex-col md:flex-row items-center justify-between mb-10 pb-10 border-b border-neutral-100 gap-8">
               <div className="text-center md:text-left">
                  <h2 className="text-2xl font-serif font-bold text-neutral-800 mb-2">Avaliações dos Clientes</h2>
                  <div className="flex items-center justify-center md:justify-start gap-4">
                    <span className="text-5xl font-extrabold text-neutral-800">{MOCK_DATA.rating}</span>
                    <div>
                      <div className="flex text-yellow-400 mb-1">
                        {[...Array(5)].map((_,i) => <Star key={i} fill="currentColor" size={20}/>)}
                      </div>
                      <p className="text-sm text-neutral-500">{reviews.length} opiniões</p>
                    </div>
                  </div>
               </div>
               {!isWritingReview && (
                 <button 
                   onClick={() => setIsWritingReview(true)}
                   className="px-8 py-3 border-2 border-rose-500 text-rose-500 font-bold rounded-full hover:bg-rose-50 transition-colors"
                 >
                   Escrever Avaliação
                 </button>
               )}
            </div>

            {isWritingReview && (
              <form onSubmit={handleSubmitReview} className="bg-neutral-50 p-6 rounded-2xl border border-neutral-100 mb-8 animate-fade-in">
                <h3 className="font-bold text-lg mb-4 text-neutral-800">Escreva sua avaliação</h3>
                
                <div className="mb-4">
                    <label className="block text-sm font-medium text-neutral-700 mb-1">Sua Nota</label>
                    <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                onClick={() => setNewReview({...newReview, rating: star})}
                                className="focus:outline-none transition-transform hover:scale-110"
                            >
                                <Star 
                                    size={28} 
                                    fill={star <= newReview.rating ? "#FACC15" : "none"} 
                                    className={star <= newReview.rating ? "text-yellow-400" : "text-neutral-300"}
                                />
                            </button>
                        ))}
                    </div>
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-neutral-700 mb-1">O que você achou?</label>
                    <textarea 
                        required
                        rows={3}
                        className="w-full p-2 rounded-lg border border-neutral-200 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 outline-none"
                        value={newReview.text}
                        onChange={e => setNewReview({...newReview, text: e.target.value})}
                        placeholder="Conte sua experiência com o produto..."
                    />
                </div>

                <div className="flex items-center gap-2 mb-6">
                    <input 
                        type="checkbox" 
                        id="recommend"
                        checked={newReview.recommend}
                        onChange={e => setNewReview({...newReview, recommend: e.target.checked})}
                        className="w-4 h-4 rounded text-rose-500 focus:ring-rose-500 border-neutral-300"
                    />
                    <label htmlFor="recommend" className="text-sm text-neutral-700 cursor-pointer select-none">Recomendo este produto</label>
                </div>

                <div className="flex gap-3">
                    <button 
                        type="submit"
                        className="px-6 py-2 bg-rose-500 text-white font-bold rounded-lg hover:bg-rose-600 transition-colors shadow-lg shadow-rose-200"
                    >
                        Enviar Avaliação
                    </button>
                    <button 
                        type="button"
                        onClick={() => setIsWritingReview(false)}
                        className="px-6 py-2 border border-neutral-300 text-neutral-600 font-bold rounded-lg hover:bg-neutral-50 transition-colors"
                    >
                        Cancelar
                    </button>
                </div>
              </form>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {currentReviews.map((review) => (
                <div key={review.id} className="p-6 bg-neutral-50 rounded-2xl border border-neutral-100">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center font-bold text-lg">
                        {review.name.charAt(0)}
                      </div>
                      <div>
                        <h5 className="font-bold text-neutral-800 text-sm">{review.name}</h5>
                        <span className="text-xs text-neutral-400 flex items-center gap-1">
                           {review.location} • {review.date}
                        </span>
                      </div>
                    </div>
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_,i) => <Star key={i} fill={i < review.rating ? "currentColor" : "none"} className={i < review.rating ? "drop-shadow-sm" : "text-neutral-300"} size={14}/>)}
                    </div>
                  </div>
                  <p className="text-neutral-700 italic mb-3">"{review.text}"</p>
                  {review.recommend && (
                    <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
                      <CheckCircle size={14} /> Recomendo este produto
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Paginação */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8">
                <button
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-neutral-200 text-neutral-600 hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={20} />
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`w-10 h-10 rounded-lg font-bold transition-colors ${
                      currentPage === page
                        ? 'bg-rose-500 text-white shadow-lg shadow-rose-200'
                        : 'bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border border-neutral-200 text-neutral-600 hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </section>

        </main>
      </div>
    </div>
  );
};

export default ProductDetail;
