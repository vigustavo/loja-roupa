import React, { Suspense, useEffect, useState } from 'react';
import { ArrowRight, Sparkles, Check, HelpCircle, Menu, X, ChevronRight, ChevronLeft, Sun, Instagram, Facebook, User, Search } from 'lucide-react';

// Dados e Tipos
import { PRODUTOS, CATEGORIAS } from './data/mockData';
import { Produto, CarrinhoItem, CategoriaId } from './types';
import { useAuth } from './context/AuthContext';

// Componentes
import Navbar from './components/layout/Navbar';
import ProductCard from './components/product/ProductCard';

const CartDrawer = React.lazy(() => import('./components/features/CartDrawer'));
const HelpDrawer = React.lazy(() => import('./components/features/HelpDrawer'));
const AuthModal = React.lazy(() => import('./components/features/AuthModal'));
const ProductDetail = React.lazy(() => import('./components/product/ProductDetail'));
const Checkout = React.lazy(() => import('./components/features/Checkout'));
const OrderConfirmation = React.lazy(() => import('./components/features/OrderConfirmation'));

const App = () => {
  // --- ESTADOS (STATES) ---
  
  // Dados
  const [carrinho, setCarrinho] = useState<CarrinhoItem[]>([]);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const { user } = useAuth();
  const [notificacao, setNotificacao] = useState<string | null>(null);
  const [loadingProdutos, setLoadingProdutos] = useState(true);
  const [helpAberto, setHelpAberto] = useState(false);
  const [produtoDetalhe, setProdutoDetalhe] = useState<Produto | null>(null);
  const [checkoutAberto, setCheckoutAberto] = useState(false);
  const [pedidoConfirmado, setPedidoConfirmado] = useState<any>(null);

  // Navegação e UI
  const [carrinhoAberto, setCarrinhoAberto] = useState(false);
  const [userMenuAberto, setUserMenuAberto] = useState(false);
  const [menuMobileAberto, setMenuMobileAberto] = useState(false);
  
  // Filtros
  const [categoriaAtiva, setCategoriaAtiva] = useState<CategoriaId>('todos');
  const [termoBusca, setTermoBusca] = useState('');

  // Animação
  const [heroAnimation, setHeroAnimation] = useState(false);
  const heroImages = [
    'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&q=80&w=1200',
    'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&q=80&w=1200'
  ];
  const [heroIndex, setHeroIndex] = useState(0);

  // --- EFEITOS (EFFECTS) ---

  // Filtro de busca global
  const produtosFiltradosBusca = PRODUTOS.filter((produto) =>
    produto.nome.toLowerCase().includes(termoBusca.toLowerCase()) ||
    produto.categoria.toLowerCase().includes(termoBusca.toLowerCase())
  );

  useEffect(() => {
    setTimeout(() => setHeroAnimation(true), 100);
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => setLoadingProdutos(false), 400);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % heroImages.length);
    }, 5500);
    return () => window.clearInterval(interval);
  }, [heroImages.length]);

  useEffect(() => {
    document.body.style.overflow = (menuMobileAberto || carrinhoAberto || helpAberto || !!produtoDetalhe) ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuMobileAberto, carrinhoAberto, helpAberto, produtoDetalhe]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (carrinhoAberto) setCarrinhoAberto(false);
        if (produtoDetalhe) setProdutoDetalhe(null);
        if (userMenuAberto) setUserMenuAberto(false);
        if (menuMobileAberto) setMenuMobileAberto(false);
        if (helpAberto) setHelpAberto(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [carrinhoAberto, produtoDetalhe, userMenuAberto, menuMobileAberto, helpAberto]);

  // --- FUNÇÕES LÓGICAS ---

  const mostrarNotificacao = (mensagem: string) => {
    setNotificacao(mensagem);
    window.setTimeout(() => setNotificacao(null), 3000);
  };

  const adicionarAoCarrinho = (produto: Produto, tamanho: string | null = null) => {
    const tamanhoFinal = tamanho ?? produto.tamanhos[0];
    setCarrinho((prev) => {
      const existente = prev.find((item) => item.id === produto.id && item.tamanho === tamanhoFinal);
      if (existente) {
        return prev.map((item) =>
          item.id === produto.id && item.tamanho === tamanhoFinal
            ? { ...item, qtd: item.qtd + 1 }
            : item
        );
      }
      return [...prev, { ...produto, qtd: 1, tamanho: tamanhoFinal, imagemSelecionada: produto.imagens[0] }];
    });
    setCarrinhoAberto(true);
    mostrarNotificacao(`Adicionado: ${produto.nome}`);
  };

  const removerDoCarrinho = (id: number, tamanho: string) => {
    setCarrinho((prev) => prev.filter((item) => !(item.id === id && item.tamanho === tamanho)));
  };

  const alterarQtd = (id: number, tamanho: string, delta: number) => {
    setCarrinho((prev) =>
      prev.map((item) => {
        if (item.id === id && item.tamanho === tamanho) {
          const novaQtd = Math.max(1, item.qtd + delta);
          return { ...item, qtd: novaQtd };
        }
        return item;
      })
    );
  };

  const toggleWishlist = (produtoId: number) => {
    setWishlist((prev) => {
      if (prev.includes(produtoId)) {
        mostrarNotificacao('Removido dos favoritos');
        return prev.filter((id) => id !== produtoId);
      }
      mostrarNotificacao('Adicionado aos favoritos ❤️');
      return [...prev, produtoId];
    });
  };

  const handleCheckout = () => {
    setCarrinhoAberto(false);
    setCheckoutAberto(true);
  };

  const handleFinalizarCompra = (dados: any) => {
    // Aqui entraria a chamada para o backend (Mercado Pago)
    console.log('Dados da compra:', dados);
    
    // Simula sucesso
    const novoPedido = {
      id: Math.floor(Math.random() * 1000000),
      ...dados,
      status: 'pago',
      data: new Date().toISOString()
    };
    
    setPedidoConfirmado(novoPedido);
    setCheckoutAberto(false);
    setCarrinho([]); // Limpa carrinho
    mostrarNotificacao('Pedido realizado com sucesso! 🎉');
  };

  // Definição das seções da Home para facilitar a renderização
  const sections = [
    { title: "Novidades & Lançamentos", products: PRODUTOS.filter(p => p.novo) },
    { title: "Vestidos", products: PRODUTOS.filter(p => p.categoria === 'vestidos') },
    { title: "Blusas", products: PRODUTOS.filter(p => p.categoria === 'blusas') },
    { title: "Calças & Shorts", products: PRODUTOS.filter(p => p.categoria === 'calcas') },
    { title: "Acessórios", products: PRODUTOS.filter(p => p.categoria === 'acessorios') },
    { title: "Conjuntos", products: PRODUTOS.filter(p => p.categoria === 'conjuntos') }
  ];

  const ProductSkeleton = () => (
    <div className="group relative bg-white p-3 rounded-3xl shadow-sm border border-neutral-50 h-full flex flex-col animate-pulse">
      <div className="aspect-[4/5] w-full overflow-hidden rounded-2xl bg-neutral-200 mb-3" />
      <div className="px-1 pb-2 flex-1 flex flex-col justify-between gap-3">
        <div className="space-y-2">
          <div className="h-2 w-12 bg-neutral-200 rounded-full" />
          <div className="h-3 w-3/4 bg-neutral-200 rounded-full" />
        </div>
        <div className="flex items-center justify-between mt-2">
          <div className="h-4 w-20 bg-neutral-200 rounded-full" />
          <div className="h-3 w-12 bg-neutral-200 rounded-full" />
        </div>
      </div>
    </div>
  );

  const renderSkeletonGrid = (count = 8) => (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
      {Array.from({ length: count }).map((_, idx) => (
        <ProductSkeleton key={`skeleton-${idx}`} />
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FDFBF7] font-sans text-neutral-800 selection:bg-rose-200 selection:text-rose-900 overflow-x-hidden">
      
      {/* Toast Notification */}
      {notificacao && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 md:left-auto md:translate-x-0 md:right-4 bg-rose-400 text-white px-6 py-4 rounded-3xl shadow-xl z-50 animate-fade-in-down flex items-center gap-3 w-[90%] md:w-auto justify-center md:justify-start">
          <div className="bg-white/20 p-1 rounded-full"><Check size={14} /></div>
          <span className="text-sm font-medium whitespace-nowrap">{notificacao}</span>
        </div>
      )}

      <Navbar 
        totalItensCarrinho={carrinho.reduce((acc, item) => acc + item.qtd, 0)}
        categoriaAtiva={categoriaAtiva}
        termoBusca={termoBusca}
        onSearchChange={setTermoBusca}
        onCategoryChange={setCategoriaAtiva}
        onOpenCart={() => setCarrinhoAberto(true)}
        onOpenUserMenu={() => setUserMenuAberto(true)}
        onOpenMobileMenu={() => setMenuMobileAberto((prev) => !prev)}
        mobileMenuAberto={menuMobileAberto}
      />

      {/* Menu Mobile Drawer */}
      {menuMobileAberto && (
        <div className="fixed inset-0 z-[60] md:hidden">
          <div className="absolute inset-0 bg-neutral-800/20 backdrop-blur-sm" onClick={() => setMenuMobileAberto(false)} />
          <div className="relative h-full w-[85%] max-w-sm bg-[#FDFBF7] flex flex-col shadow-2xl animate-slide-in-right rounded-r-3xl overflow-hidden">
             <div className="flex items-center justify-between px-6 h-20 bg-white">
                <div className="flex items-center gap-2 text-xl font-serif font-bold text-neutral-800">
                    <Sun size={24} className="text-yellow-400 fill-yellow-400" />
                    Menu
                </div>
              <button
                className="p-2 rounded-full hover:bg-rose-50 text-neutral-400 hover:text-rose-500"
                onClick={() => setMenuMobileAberto(false)}
                aria-label="Fechar menu"
              >
                <X size={24} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {CATEGORIAS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={`w-full flex items-center justify-between py-3 text-lg font-medium text-left transition-all ${categoriaAtiva === item.id ? 'text-rose-500 font-bold pl-2' : 'text-neutral-600 hover:text-rose-500 hover:pl-2'}`}
                  onClick={() => {
                    setCategoriaAtiva(item.id);
                    setMenuMobileAberto(false);
                  }}
                >
                  <span>{item.nome}</span>
                  <ChevronRight size={18} className="text-neutral-300" />
                </button>
              ))}
            </div>
            <div className="px-6 pt-6 mt-auto border-t border-rose-100">
              {user ? (
                <button
                  onClick={() => {
                    setUserMenuAberto(true);
                    setMenuMobileAberto(false);
                  }}
                  className="w-full flex items-center gap-3 text-left p-2 -ml-2 rounded-xl hover:bg-rose-100/50 transition-colors"
                >
                  <div className="w-11 h-11 rounded-full bg-rose-100 text-rose-500 font-bold flex items-center justify-center text-lg flex-shrink-0">
                    {user.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-neutral-800 text-base leading-tight">{user.name}</p>
                    <p className="text-xs text-neutral-500">Ver minha conta e pedidos</p>
                  </div>
                </button>
              ) : (
                <div className="bg-white border border-neutral-100 rounded-2xl p-5 shadow-sm relative overflow-hidden">
                    <div className="flex items-center gap-2 mb-4">
                       <div className="p-1.5 bg-rose-50 rounded-full text-rose-500"><User size={16} /></div>
                       <span className="font-bold text-neutral-800">Olá, visitante</span>
                    </div>
                    <button
                        onClick={() => { setUserMenuAberto(true); setMenuMobileAberto(false); }}
                        className="w-full py-3 rounded-xl bg-neutral-900 text-white font-bold text-sm hover:bg-neutral-800 transition-all active:scale-95 shadow-lg shadow-neutral-200"
                    >
                        Entrar ou Criar Conta
                    </button>
                </div>
              )}
            </div>
            <div className="p-8 bg-rose-50/50">
               <p className="text-sm text-neutral-500 mb-4 text-center">Acompanhe a gente</p>
               <div className="flex items-center justify-center gap-8 text-rose-400">
                  <Instagram size={24} />
                  <Facebook size={24} />
               </div>
            </div>
          </div>
        </div>
      )}

      {/* Barra de Busca (Mobile) */}
      <div className="pt-24 px-4 md:hidden relative z-30">
        <div className="relative">
          <input
            type="text"
            placeholder="O que você procura?"
            value={termoBusca}
            onChange={(e) => setTermoBusca(e.target.value)}
            className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-neutral-200 bg-white shadow-sm focus:border-rose-300 focus:ring-4 focus:ring-rose-50 focus:outline-none transition-all text-neutral-700 placeholder:text-neutral-400"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={20} />
        </div>
      </div>

      {/* Hero Banner */}
      <div className="relative pt-8 md:pt-32 pb-16 md:pb-24 overflow-hidden">
        <div className="absolute top-0 right-0 w-[520px] h-[520px] bg-rose-50 rounded-full blur-3xl opacity-60 -translate-y-1/3 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[480px] h-[480px] bg-rose-50 rounded-full blur-3xl opacity-60 translate-y-1/3 -translate-x-1/4 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row items-center md:items-stretch gap-10 md:gap-14">
            <div className={`w-full md:w-1/2 max-w-3xl transition-all duration-1000 transform ${heroAnimation ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
               <div className="backdrop-card p-6 md:p-8 rounded-3xl shadow-2xl shadow-rose-100/60 w-full text-left space-y-6">
                 <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-rose-100 text-rose-500 text-sm font-semibold shadow-sm">
                   Feito com amor de mãe
                 </div>
                 <div className="space-y-4">
                   <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-neutral-800 leading-[1.05]">
                     Conforto para <br className="hidden md:block"/><span className="text-rose-400 italic">brincar e sonhar</span>
                   </h1>
                   <p className="text-neutral-500 text-lg md:text-xl leading-relaxed font-light max-w-xl">
                     Tecidos macios que abraçam, modelagens livres para correr e estampas que contam histórias. Vista quem você mais ama.
                   </p>
                 </div>
                 <div className="flex flex-col sm:flex-row gap-4">
                   <button onClick={() => setCategoriaAtiva('todos')} className="bg-rose-400 text-white px-10 py-4 rounded-full font-bold shadow-lg shadow-rose-200 hover:bg-rose-500 hover:shadow-xl hover:-translate-y-0.5 transition-all">
                     Ver Coleção
                   </button>
                   <button className="bg-white text-neutral-600 border border-neutral-200 px-10 py-4 rounded-full font-bold hover:bg-neutral-50 hover:border-neutral-300 transition-all">
                     Nossa História
                   </button>
                 </div>
               </div>
            </div>

            <div className={`w-full md:w-1/2 max-w-4xl transition-all duration-1000 delay-200 transform ${heroAnimation ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
              <div className="relative rounded-[3rem] md:rounded-[4rem] overflow-hidden shadow-2xl shadow-rose-100/50 rotate-2 hover:rotate-0 transition-transform duration-700 h-[320px] sm:h-[380px] md:h-[480px] lg:h-[520px] border border-white/60">
                <img
                  key={heroIndex}
                  src={heroImages[heroIndex]}
                  alt="Banner principal"
                  className="w-full h-full object-cover transition-opacity duration-700"
                  loading="lazy"
                  decoding="async"
                  width={1200}
                  height={900}
                />

                {heroImages.length > 1 && (
                  <>
                    <button
                      onClick={() => setHeroIndex((prev) => (prev - 1 + heroImages.length) % heroImages.length)}
                      className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/70 hover:bg-white text-neutral-700 shadow-md backdrop-blur-sm"
                      aria-label="Banner anterior"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button
                      onClick={() => setHeroIndex((prev) => (prev + 1) % heroImages.length)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/70 hover:bg-white text-neutral-700 shadow-md backdrop-blur-sm"
                      aria-label="Próximo banner"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center gap-4 -mt-6 mb-6 relative z-20">
        <div className="h-px w-16 md:w-32 bg-gradient-to-r from-transparent to-rose-300/50" />
        <Sparkles size={18} className="text-rose-300/70" />
        <div className="h-px w-16 md:w-32 bg-gradient-to-l from-transparent to-rose-300/50" />
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
        
        {/* Filtros */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-y-6 gap-x-4">
            <h2 className="text-2xl font-serif font-bold text-neutral-800 flex items-center justify-center md:justify-start gap-2">
               {termoBusca ? `Resultados para "${termoBusca}"` : 'Explore nossa loja'}
               {!termoBusca && <Sparkles size={20} className="text-yellow-400" />}
            </h2>
            <div className="flex flex-wrap justify-center gap-x-2 gap-y-3 md:flex-nowrap md:justify-start md:gap-3 md:overflow-x-auto no-scrollbar md:pb-0">
              {CATEGORIAS.map((categoria) => (
                <button
                  key={categoria.id}
                  onClick={() => { setCategoriaAtiva(categoria.id); setTermoBusca(''); }}
                  className={`px-5 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-300 ${
                    categoriaAtiva === categoria.id && !termoBusca
                      ? 'bg-rose-400 text-white shadow-lg shadow-rose-200 transform -translate-y-0.5'
                      : 'bg-white text-neutral-500 border border-neutral-100 hover:border-rose-200 hover:text-rose-400'
                  }`}
                >
                  {categoria.nome}
                </button>
              ))}
            </div>
        </div>

        {/* --- LÓGICA DE EXIBIÇÃO DOS PRODUTOS --- */}
        
        {/* 1. SE TIVER BUSCA ATIVA */}
        {loadingProdutos ? (
          renderSkeletonGrid()
        ) : termoBusca ? (
           <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
             {produtosFiltradosBusca.map((produto) => (
                 <ProductCard 
                   key={produto.id} 
                   produto={produto} 
                   isWishlisted={wishlist.includes(produto.id)} 
                   onToggleWishlist={toggleWishlist} 
                 onOpenProduct={setProdutoDetalhe}
                 />
             ))}
           </div>
        ) : (
           /* 2. SE FOR A HOME (TODOS) - MOSTRA SEÇÕES */
           categoriaAtiva === 'todos' ? (
             <div className="space-y-4">
               {sections.map((section, idx) => (
                 section.products.length > 0 && (
                   <div key={idx} className="mb-12">
                      <div className="flex items-center justify-between mb-6 px-2">
                        <h3 className="text-xl md:text-2xl font-serif font-bold text-neutral-800 flex items-center gap-2">
                          {section.title}
                          <div className="h-px bg-rose-100 flex-1 ml-4 hidden md:block w-32" />
                        </h3>
                        <button 
                          onClick={() => {
                              const cat = CATEGORIAS.find(c => c.nome === section.title || section.title.includes(c.nome));
                              if (cat) setCategoriaAtiva(cat.id);
                          }}
                          className="text-sm font-bold text-rose-400 hover:text-rose-500 flex items-center gap-1 group"
                        >
                          Ver tudo <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                        </button>
                      </div>
                      <div className="flex overflow-x-auto pb-6 gap-4 px-2 -mx-2 md:mx-0 md:px-0 snap-x snap-mandatory scrollbar-hide">
                        {section.products.map((produto) => (
                          <div key={produto.id} className="min-w-[160px] w-[45%] md:min-w-[260px] md:w-[260px] snap-center flex-shrink-0">
                             <ProductCard 
                               produto={produto} 
                               isWishlisted={wishlist.includes(produto.id)}
                               onToggleWishlist={toggleWishlist}
                              onOpenProduct={setProdutoDetalhe}
                             />
                          </div>
                        ))}
                      </div>
                   </div>
                 )
               ))}
             </div>
           ) : (
             /* 3. SE FOR UMA CATEGORIA ESPECÍFICA - MOSTRA GRID */
             <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
               {PRODUTOS.filter(p => p.categoria === categoriaAtiva || (categoriaAtiva === 'conjuntos' && p.categoria === 'conjuntos')).map((produto) => (
                 <ProductCard 
                   key={produto.id} 
                   produto={produto} 
                   isWishlisted={wishlist.includes(produto.id)} 
                   onToggleWishlist={toggleWishlist} 
                  onOpenProduct={setProdutoDetalhe}
                 />
               ))}
             </div>
           )
        )}
      </main>

      {/* Renderiza a página de detalhes do produto como uma sobreposição de página inteira */}
      {produtoDetalhe && (
        <Suspense fallback={null}>
            <ProductDetail
              produto={produtoDetalhe}
              onClose={() => setProdutoDetalhe(null)}
              onAddToCart={(produto: Produto, tamanho: string | null) => {
                adicionarAoCarrinho(produto, tamanho);
              }}
              onToggleWishlist={toggleWishlist}
              isWishlisted={wishlist.includes(produtoDetalhe.id)}
              totalItensCarrinho={carrinho.reduce((acc, item) => acc + item.qtd, 0)}
              categoriaAtiva={categoriaAtiva}
              termoBusca={termoBusca}
              onSearchChange={(termo) => {
                setTermoBusca(termo);
                if (termo) setProdutoDetalhe(null);
              }}
              onCategoryChange={(id) => {
                setCategoriaAtiva(id);
                setProdutoDetalhe(null);
              }}
              onOpenCart={() => setCarrinhoAberto(true)}
              onOpenUserMenu={() => setUserMenuAberto(true)}
              onOpenMobileMenu={() => setMenuMobileAberto((prev) => !prev)}
              mobileMenuAberto={menuMobileAberto}
            />
        </Suspense>
      )}

      <footer className="bg-rose-50 border-t border-rose-100 pt-16 pb-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            <div className="space-y-4">
              <h3 className="text-2xl font-serif font-bold text-rose-500 flex items-center gap-2">
                <Sun size={24} className="text-yellow-400 fill-yellow-400" />
                LUMINA Kids Store
              </h3>
              <p className="text-neutral-500 text-sm leading-relaxed">
                Vestindo crianças com a liberdade que elas precisam para serem felizes. Peças pensadas por quem entende de amor e cuidado.
              </p>
              <div className="flex gap-4 text-rose-400">
                <Instagram size={20} className="hover:text-rose-500 cursor-pointer transition-colors" />
                <Facebook size={20} className="hover:text-rose-500 cursor-pointer transition-colors" />
              </div>
            </div>

            <div>
              <h4 className="font-bold text-neutral-800 mb-6">Categorias</h4>
              <ul className="space-y-3 text-sm text-neutral-500">
                <li><a href="#" onClick={(e) => { e.preventDefault(); setCategoriaAtiva('vestidos'); }} className="hover:text-rose-500 transition-colors">Vestidos</a></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); setCategoriaAtiva('blusas'); }} className="hover:text-rose-500 transition-colors">Blusas</a></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); setCategoriaAtiva('calcas'); }} className="hover:text-rose-500 transition-colors">Calças & Shorts</a></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); setCategoriaAtiva('acessorios'); }} className="hover:text-rose-500 transition-colors">Acessórios</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-neutral-800 mb-6">Ajuda</h4>
              <ul className="space-y-3 text-sm text-neutral-500">
                <li><a href="#" className="hover:text-rose-500 transition-colors">Trocas e Devoluções</a></li>
                <li><a href="#" className="hover:text-rose-500 transition-colors">Guia de Medidas</a></li>
                <li><a href="#" className="hover:text-rose-500 transition-colors">Prazos de Entrega</a></li>
                <li><a href="#" className="hover:text-rose-500 transition-colors">Fale Conosco</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-neutral-800 mb-6">Fique por dentro</h4>
              <p className="text-sm text-neutral-500 mb-4">
                Cadastre-se para receber novidades e ofertas exclusivas.
              </p>
              <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
                <input 
                  type="email" 
                  placeholder="Seu melhor e-mail" 
                  className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-rose-300 focus:ring-4 focus:ring-rose-50 focus:outline-none transition-all text-sm"
                />
                <button className="w-full bg-rose-400 text-white font-bold py-3 rounded-xl hover:bg-rose-500 transition-colors shadow-lg shadow-rose-100 text-sm">
                  Receber Novidades
                </button>
              </form>
            </div>
          </div>

          <div className="border-t border-neutral-100 pt-8 pb-4">
             <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
                <div className="flex flex-col items-center md:items-start gap-2">
                   <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Formas de Pagamento</span>
                   <div className="flex gap-2">
                      {[
                        { name: 'Visa', src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/1200px-Visa_Inc._logo.svg.png' },
                        { name: 'Mastercard', src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/MasterCard_Logo.svg/1200px-MasterCard_Logo.svg.png' },
                        { name: 'Pix', src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Logo%E2%80%94pix_powered_by_Banco_Central_%28Brazil%2C_2020%29.svg/1200px-Logo%E2%80%94pix_powered_by_Banco_Central_%28Brazil%2C_2020%29.svg.png' },
                        { name: 'Boleto', src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Boleto_Banc%C3%A1rio_logo.svg/1200px-Boleto_Banc%C3%A1rio_logo.svg.png' }
                      ].map((method) => (
                        <div key={method.name} className="h-9 w-14 px-2 bg-white border border-neutral-200 rounded flex items-center justify-center overflow-hidden">
                          <img src={method.src} alt={method.name} className="max-h-full max-w-full object-contain" />
                        </div>
                      ))}
                   </div>
                </div>
                <div className="flex flex-col items-center md:items-end gap-2">
                   <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Segurança</span>
                   <div className="flex gap-3 items-center">
                      <div className="flex items-center gap-1.5 bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-medium border border-green-100">
                         <Check size={12} /> Compra 100% Segura
                      </div>
                      <div className="flex items-center gap-1.5 bg-neutral-50 text-neutral-600 px-3 py-1 rounded-full text-xs font-medium border border-neutral-100">
                         <Check size={12} /> Certificado SSL
                      </div>
                   </div>
                </div>
             </div>

             <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-neutral-400 border-t border-neutral-50 pt-8">
                <p>© 2025 Lumina Kids Store. Todos os direitos reservados. CNPJ 00.000.000/0000-00</p>
                <div className="flex gap-6">
                  <a href="#" className="hover:text-rose-500 transition-colors">Política de Privacidade</a>
                  <a href="#" className="hover:text-rose-500 transition-colors">Termos de Uso</a>
                </div>
             </div>
          </div>
        </div>
      </footer>

      {/* Botão flutuante de ajuda */}
      <button
        onClick={() => setHelpAberto(true)}
        className="fixed bottom-6 right-4 md:right-6 z-40 group transition-transform hover:-translate-y-1"
        aria-label="Abrir central de ajuda"
      >
        <div className="relative">
          <div className="absolute bottom-full right-0 mb-2 w-max bg-white px-4 py-2 rounded-2xl rounded-br-none shadow-xl border border-rose-100 text-sm font-bold text-neutral-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300 origin-bottom-right">
            Precisa de ajuda? 👋
          </div>
          <div className="w-16 h-16 rounded-full bg-[#FDFBF7] shadow-2xl border-4 border-white flex items-center justify-center overflow-hidden">
             <img 
               src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/People/Person%20Raising%20Hand%20Light.png"
               alt="Ajuda"
               className="w-full h-full object-cover"
             />
          </div>
        </div>
      </button>

      {/* Drawers e Modais que abrem por cima de tudo */}
      <Suspense fallback={null}>
        <CartDrawer 
          isOpen={carrinhoAberto}
          itens={carrinho}
          onClose={() => setCarrinhoAberto(false)}
          onRemoveItem={removerDoCarrinho}
          onUpdateQty={alterarQtd}
          onCheckout={handleCheckout}
        />

        <Checkout 
          isOpen={checkoutAberto}
          onClose={() => setCheckoutAberto(false)}
          itens={carrinho}
          total={carrinho.reduce((acc, item) => acc + item.preco * item.qtd, 0)}
          onFinalizarCompra={handleFinalizarCompra}
        />

        <OrderConfirmation 
          isOpen={!!pedidoConfirmado}
          onClose={() => setPedidoConfirmado(null)}
          pedido={pedidoConfirmado}
        />

        <HelpDrawer isOpen={helpAberto} onClose={() => setHelpAberto(false)} />
        <AuthModal isOpen={userMenuAberto} onClose={() => setUserMenuAberto(false)} />
      </Suspense>

    </div>
  );
};

export default App;