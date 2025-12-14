import React, { type FormEvent, useEffect, useState } from 'react';
import {
  ArrowRight,
  Check,
  ChevronRight,
  CreditCard,
  Eye,
  Facebook,
  Heart,
  Instagram,
  LogOut,
  Mail,
  MapPin,
  Menu,
  Package,
  Search,
  Settings,
  ShoppingBag,
  Star,
  Twitter,
  User,
  X
} from 'lucide-react';

type CategoriaId = 'todos' | 'vestidos' | 'blusas' | 'calcas' | 'casacos';

interface Produto {
  id: number;
  nome: string;
  preco: number;
  categoria: Exclude<CategoriaId, 'todos'>;
  imagem: string;
  novo: boolean;
  tamanhos: string[];
  descricao: string;
}

type CarrinhoItem = Produto & {
  qtd: number;
  tamanho: string;
};

type AuthView = 'login' | 'cadastro';

interface Usuario {
  nome: string;
  email: string;
}

interface AuthFormState {
  nome: string;
  email: string;
  senha: string;
}

const PRODUTOS: Produto[] = [
  {
    id: 1,
    nome: 'Vestido Midi Floral',
    preco: 189.9,
    categoria: 'vestidos',
    imagem: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&q=80&w=800',
    novo: true,
    tamanhos: ['PP', 'P', 'M', 'G'],
    descricao:
      'Um vestido leve e romântico, perfeito para tardes de verão. Confeccionado em viscose premium com estampa floral exclusiva.'
  },
  {
    id: 2,
    nome: 'Blusa de Seda Off-White',
    preco: 129.5,
    categoria: 'blusas',
    imagem: 'https://images.unsplash.com/photo-1564257631407-4deb1f99d992?auto=format&fit=crop&q=80&w=800',
    novo: false,
    tamanhos: ['P', 'M', 'G', 'GG'],
    descricao:
      'Elegância pura em seda lavada. O caimento fluido e o tom off-white tornam esta peça um curinga no guarda-roupa.'
  },
  {
    id: 3,
    nome: 'Calça Alfaiataria Bege',
    preco: 210,
    categoria: 'calcas',
    imagem: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&q=80&w=800',
    novo: false,
    tamanhos: ['36', '38', '40', '42'],
    descricao:
      'Corte impecável e tecido estruturado. A calça ideal para transitar do escritório para o jantar com sofisticação.'
  },
  {
    id: 4,
    nome: 'Jaqueta Jeans Vintage',
    preco: 259.9,
    categoria: 'casacos',
    imagem:
      'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&q=80&w=800',
    novo: true,
    tamanhos: ['P', 'M', 'G'],
    descricao:
      'Lavagem retrô com modelagem oversized. Uma terceira peça cheia de personalidade para compor looks despojados.'
  },
  {
    id: 5,
    nome: 'Vestido Longo Verão',
    preco: 159,
    categoria: 'vestidos',
    imagem: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&q=80&w=800',
    novo: false,
    tamanhos: ['P', 'M', 'G'],
    descricao: 'Frescor e movimento. Este vestido longo possui fendas laterais discretas e decote nas costas.'
  },
  {
    id: 6,
    nome: 'Saia Plissada Preta',
    preco: 99.9,
    categoria: 'calcas',
    imagem: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?auto=format&fit=crop&q=80&w=800',
    novo: false,
    tamanhos: ['P', 'M', 'G'],
    descricao: 'O clássico plissado em versão midi. Versátil, combina tanto com tênis quanto com salto alto.'
  },
  {
    id: 7,
    nome: 'Blazer Clássico',
    preco: 320,
    categoria: 'casacos',
    imagem: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=800',
    novo: true,
    tamanhos: ['38', '40', '42', '44'],
    descricao: 'Alfaiataria de ponta com forro acetinado. A peça-chave para elevar qualquer produção instantaneamente.'
  },
  {
    id: 8,
    nome: 'Top Cropped Linho',
    preco: 79.9,
    categoria: 'blusas',
    imagem: 'https://images.unsplash.com/photo-1503185912284-5271ff81b9a8?auto=format&fit=crop&q=80&w=800',
    novo: false,
    tamanhos: ['P', 'M', 'G'],
    descricao: 'Linho misto para garantir frescor. Modelagem estruturada que valoriza o colo.'
  }
];

const CATEGORIAS: Array<{ id: CategoriaId; nome: string; destaque: string }> = [
  { id: 'todos', nome: 'Todas', destaque: 'Coleção completa' },
  { id: 'vestidos', nome: 'Vestidos', destaque: 'Silhuetas fluidas' },
  { id: 'blusas', nome: 'Blusas', destaque: 'Texturas leves' },
  { id: 'calcas', nome: 'Calças & Saias', destaque: 'Alfaiataria moderna' },
  { id: 'casacos', nome: 'Casacos', destaque: 'Camadas urbanas' }
];

const MENU_DESKTOP = ['NOVIDADES', 'COLEÇÃO', 'ACESSÓRIOS', 'EDITORIAL'];
const MENU_MOBILE = ['NOVIDADES', 'COLEÇÃO', 'ACESSÓRIOS', 'CONTA', 'WISHLIST'];

const SHOP_FEATURES = [
  { icon: ShoppingBag, title: 'Envio Grátis', desc: 'Acima de R$ 299' },
  { icon: Star, title: 'Qualidade Premium', desc: 'Materiais nobres' },
  { icon: ArrowRight, title: 'Troca Facilitada', desc: '30 dias grátis' }
];

const formatCurrency = (valor: number) => valor.toFixed(2).replace('.', ',');

const LuminaFashion = () => {
  const [carrinho, setCarrinho] = useState<CarrinhoItem[]>([]);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [carrinhoAberto, setCarrinhoAberto] = useState(false);
  const [menuMobileAberto, setMenuMobileAberto] = useState(false);
  const [categoriaAtiva, setCategoriaAtiva] = useState<CategoriaId>('todos');
  const [notificacao, setNotificacao] = useState<string | null>(null);
  const [produtoQuickView, setProdutoQuickView] = useState<Produto | null>(null);
  const [tamanhoSelecionado, setTamanhoSelecionado] = useState<string | null>(null);
  const [emailNewsletter, setEmailNewsletter] = useState('');
  const [newsletterSucesso, setNewsletterSucesso] = useState(false);
  const [userMenuAberto, setUserMenuAberto] = useState(false);
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [viewAuth, setViewAuth] = useState<AuthView>('login');
  const [authForm, setAuthForm] = useState<AuthFormState>({ nome: '', email: '', senha: '' });

  useEffect(() => {
    if (!notificacao) {
      return undefined;
    }

    const timeout = window.setTimeout(() => setNotificacao(null), 3000);
    return () => window.clearTimeout(timeout);
  }, [notificacao]);

  const produtosFiltrados = categoriaAtiva === 'todos'
    ? PRODUTOS
    : PRODUTOS.filter((produto) => produto.categoria === categoriaAtiva);

  const totalItens = carrinho.reduce((acc, item) => acc + item.qtd, 0);
  const totalValor = carrinho.reduce((acc, item) => acc + item.preco * item.qtd, 0);

  const mostrarNotificacao = (mensagem: string) => {
    setNotificacao(mensagem);
  };

  const adicionarAoCarrinho = (produto: Produto, tamanho?: string | null) => {
    const tamanhoFinal = tamanho ?? produto.tamanhos[0];

    setCarrinho((prev) => {
      const itemExistente = prev.find((item) => item.id === produto.id && item.tamanho === tamanhoFinal);

      if (itemExistente) {
        return prev.map((item) =>
          item.id === produto.id && item.tamanho === tamanhoFinal
            ? { ...item, qtd: item.qtd + 1 }
            : item
        );
      }

      return [...prev, { ...produto, qtd: 1, tamanho: tamanhoFinal }];
    });

    setCarrinhoAberto(true);
    setProdutoQuickView(null);
    mostrarNotificacao(`Adicionado: ${produto.nome}`);
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

  const atualizarAuthForm = (campo: keyof AuthFormState, valor: string) => {
    setAuthForm((prev) => ({ ...prev, [campo]: valor }));
  };

  const handleAuthSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!authForm.email || !authForm.senha) {
      return;
    }

    if (viewAuth === 'login') {
      setUsuario({ nome: 'Visitante', email: authForm.email });
      mostrarNotificacao('Bem-vindo de volta!');
    } else {
      setUsuario({ nome: authForm.nome || 'Cliente Lumina', email: authForm.email });
      mostrarNotificacao('Conta criada com sucesso!');
    }

    setAuthForm({ nome: '', email: '', senha: '' });
  };

  const handleLogout = () => {
    setUsuario(null);
    setViewAuth('login');
    mostrarNotificacao('Sessão terminada');
  };

  const handleNewsletterSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!emailNewsletter) {
      return;
    }

    setNewsletterSucesso(true);
    setEmailNewsletter('');
    window.setTimeout(() => setNewsletterSucesso(false), 5000);
  };

  const abrirQuickView = (produto: Produto) => {
    setProdutoQuickView(produto);
    setTamanhoSelecionado(produto.tamanhos[0]);
  };

  return (
    <div className="min-h-screen bg-neutral-50 font-sans text-neutral-800 selection:bg-rose-200 selection:text-rose-900 overflow-x-hidden">
      {notificacao && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 md:left-auto md:translate-x-0 md:right-4 bg-neutral-900 text-white px-6 py-4 rounded-full md:rounded shadow-2xl z-50 animate-fade-in-down flex items-center gap-3 w-[90%] md:w-auto justify-center md:justify-start">
          <div className="bg-white/20 p-1 rounded-full">
            <Check size={14} />
          </div>
          <span className="text-sm font-medium whitespace-nowrap">{notificacao}</span>
        </div>
      )}

      <nav className="fixed w-full bg-white z-40 border-b border-neutral-100 shadow-sm transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 md:h-20">
            <div className="flex items-center gap-2">
              <button
                className="p-2 -ml-2 hover:bg-neutral-100 rounded-full md:hidden text-neutral-900"
                onClick={() => setMenuMobileAberto((prev) => !prev)}
                aria-label="Abrir menu"
              >
                <Menu size={24} />
              </button>
              <a href="#" className="text-xl md:text-2xl font-serif font-bold tracking-tighter text-neutral-900">
                LUMINA
              </a>
            </div>

            <div className="hidden md:flex space-x-8 text-sm font-medium tracking-wide text-neutral-500">
              {MENU_DESKTOP.map((item) => (
                <a key={item} href="#" className="hover:text-neutral-900 transition-colors relative group">
                  {item}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-neutral-900 transition-all group-hover:w-full" />
                </a>
              ))}
            </div>

            <div className="flex items-center space-x-1 md:space-x-2">
              <button className="p-2 hover:bg-neutral-100 rounded-full transition-colors text-neutral-600" aria-label="Buscar">
                <Search size={20} className="w-5 h-5 md:w-6 md:h-6" />
              </button>

              <button
                className="p-2 hover:bg-neutral-100 rounded-full transition-colors text-neutral-600"
                onClick={() => setUserMenuAberto(true)}
                aria-label={usuario ? 'Abrir painel da conta' : 'Entrar na conta'}
              >
                <User size={20} className="w-5 h-5 md:w-6 md:h-6" />
              </button>

              <div className="relative">
                <button
                  className="p-2 hover:bg-neutral-100 rounded-full transition-colors text-neutral-600"
                  onClick={() => setCarrinhoAberto(true)}
                  aria-label="Abrir carrinho"
                >
                  <ShoppingBag size={20} className="w-5 h-5 md:w-6 md:h-6" />
                  {totalItens > 0 && (
                    <span className="absolute top-1 right-0.5 inline-flex items-center justify-center w-4 h-4 text-[10px] font-bold text-white bg-neutral-900 rounded-full border border-white">
                      {totalItens}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {menuMobileAberto && (
          <div className="fixed inset-0 top-16 z-30 bg-white md:hidden animate-fade-in flex flex-col border-t border-neutral-100 shadow-2xl">
            <div className="p-6 space-y-2 overflow-y-auto">
              {MENU_MOBILE.map((item) => (
                <button
                  key={item}
                  type="button"
                  className="flex items-center justify-between w-full py-4 text-lg font-serif font-medium text-neutral-900 border-b border-neutral-50 hover:bg-neutral-50 hover:pl-2 transition-all"
                  onClick={() => {
                    if (item === 'CONTA') {
                      setUserMenuAberto(true);
                    }
                    setMenuMobileAberto(false);
                  }}
                >
                  <span>{item}</span>
                  <ChevronRight size={18} className="text-neutral-300" />
                </button>
              ))}
              <div className="pt-8 flex justify-center gap-8 text-neutral-400">
                <Instagram size={24} className="hover:text-neutral-900 transition-colors" />
                <Facebook size={24} className="hover:text-neutral-900 transition-colors" />
                <Twitter size={24} className="hover:text-neutral-900 transition-colors" />
              </div>
            </div>
          </div>
        )}
      </nav>

      <div className="relative pt-16 md:pt-20">
        <div className="absolute inset-0 bg-black/20 md:bg-gradient-to-r md:from-neutral-900/40 md:to-transparent z-10 pointer-events-none" />
        <div
          className="h-[55vh] md:h-[75vh] bg-cover bg-center bg-fixed flex items-center px-4"
          style={{
            backgroundImage:
              'url(\'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=2000\')'
          }}
        >
          <div className="relative z-20 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 text-center md:text-left">
            <div className="max-w-xl text-white animate-slide-up mx-auto md:mx-0">
              <span className="inline-block border border-white/40 px-3 py-1 text-[10px] md:text-xs font-bold tracking-[0.2em] mb-4 md:mb-6 uppercase backdrop-blur-sm">
                Verão 2025
              </span>
              <h1 className="text-4xl md:text-7xl font-serif font-bold mb-4 md:mb-6 leading-none shadow-sm">
                Essência <br /> Natural
              </h1>
              <p className="text-sm md:text-xl text-white/90 mb-6 md:mb-8 font-light max-w-md mx-auto md:mx-0 leading-relaxed">
                Tecidos fluidos e tons terrosos. Descubra a nova coleção.
              </p>
              <button className="bg-white text-neutral-900 px-8 py-3 md:px-10 md:py-4 text-xs md:text-sm font-bold tracking-wider hover:bg-neutral-100 transition-all shadow-lg w-full md:w-auto">
                EXPLORAR COLEÇÃO
              </button>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">

        <div className="sticky top-16 md:top-20 z-30 bg-neutral-50/95 backdrop-blur py-3 md:py-4 -mx-4 px-4 md:mx-0 md:px-6 border-b md:border-none border-neutral-100 mb-6 md:mb-12 transition-all relative overflow-hidden rounded-none md:rounded-3xl">
          <div className="absolute inset-y-0 right-[-15%] w-1/2 bg-gradient-to-l from-rose-50 via-transparent to-transparent blur-3xl opacity-80 hidden md:block" aria-hidden="true" />
          <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0 relative z-10">
            <h2 className="text-xl md:text-3xl font-serif font-bold text-neutral-900 hidden md:block">
              {categoriaAtiva === 'todos'
                ? 'Destaques da Semana'
                : CATEGORIAS.find((cat) => cat.id === categoriaAtiva)?.nome}
            </h2>
            <div className="grid grid-cols-2 gap-2 w-full justify-start md:w-auto md:flex md:flex-nowrap md:overflow-x-auto md:space-x-2 md:pb-0 md:flex-1 md:justify-end">
              {CATEGORIAS.map((cat, index) => {
                const precisaPreencher = CATEGORIAS.length % 2 === 1;
                const ehUltimo = index === CATEGORIAS.length - 1;
                const ocuparLinhaInteira = precisaPreencher && ehUltimo;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setCategoriaAtiva(cat.id)}
                    aria-pressed={categoriaAtiva === cat.id}
                    className={`group relative flex items-center gap-3 md:gap-4 px-4 py-2 md:px-5 md:py-3 rounded-full border transition-all duration-300 w-full md:w-auto ${
                      categoriaAtiva === cat.id
                        ? 'bg-neutral-900 text-white border-neutral-900 shadow-lg shadow-neutral-900/20 scale-[1.01]'
                        : 'bg-white text-neutral-600 border-neutral-200 hover:border-neutral-400 hover:text-neutral-900 hover:shadow-sm'
                    } ${ocuparLinhaInteira ? 'col-span-2' : 'col-span-1'} md:col-span-1 md:flex-shrink-0`}
                  >
                    <span
                      className={`inline-flex w-2 h-2 rounded-full transition-colors duration-300 ${
                        categoriaAtiva === cat.id ? 'bg-white' : 'bg-neutral-300 group-hover:bg-neutral-500'
                      }`}
                    />
                    <div className="flex flex-col text-left leading-tight">
                      <span className="text-[11px] md:text-xs font-semibold tracking-wide uppercase">{cat.nome}</span>
                      <span
                        className={`text-[9px] md:text-[10px] font-medium ${
                          categoriaAtiva === cat.id ? 'text-white/80' : 'text-neutral-400 group-hover:text-neutral-500'
                        }`}
                      >
                        {cat.destaque}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
          <div className="hidden md:flex items-center justify-end gap-6 mt-4 text-[11px] tracking-[0.35em] text-neutral-400 uppercase relative z-10">
            <span>120 PEÇAS CURADAS</span>
            <span>LINHO · SEDA · JEANS</span>
            <span>DROP EXCLUSIVO</span>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-3 gap-y-8 md:gap-x-8 md:gap-y-12">
          {produtosFiltrados.map((produto) => (
            <div key={produto.id} className="group relative">
              <div className="aspect-[3/4] w-full overflow-hidden rounded-md bg-neutral-200 relative shadow-sm md:group-hover:shadow-xl transition-all duration-300">
                <img
                  src={produto.imagem}
                  alt={produto.nome}
                  className="h-full w-full object-cover object-center md:group-hover:scale-105 transition-transform duration-700 ease-out"
                  onClick={() => abrirQuickView(produto)}
                />

                {produto.novo && (
                  <span className="absolute top-2 left-2 md:top-3 md:left-3 bg-neutral-900 text-white px-2 py-0.5 md:px-3 md:py-1 text-[9px] md:text-[10px] font-bold tracking-wider uppercase shadow-sm z-10">
                    Novo
                  </span>
                )}

                <button
                  onClick={(event) => {
                    event.stopPropagation();
                    adicionarAoCarrinho(produto);
                  }}
                  className="absolute bottom-2 right-2 p-2 bg-white/90 text-neutral-900 rounded-full shadow-md md:hidden active:scale-95 transition-transform z-10"
                  aria-label="Adicionar ao carrinho"
                >
                  <ShoppingBag size={18} />
                </button>

                <div className="hidden md:flex absolute inset-x-0 bottom-4 px-4 justify-between items-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0 z-20">
                  <button
                    onClick={(event) => {
                      event.stopPropagation();
                      abrirQuickView(produto);
                    }}
                    className="flex-1 bg-white/95 backdrop-blur text-neutral-900 py-3 text-sm font-bold shadow-lg hover:bg-neutral-900 hover:text-white transition-colors rounded-sm flex items-center justify-center gap-2 mr-2"
                  >
                    <Eye size={16} /> Espiar
                  </button>
                  <button
                    onClick={(event) => {
                      event.stopPropagation();
                      adicionarAoCarrinho(produto);
                    }}
                    className="bg-neutral-900 text-white p-3 shadow-lg hover:bg-neutral-700 transition-colors rounded-sm"
                    title="Adicionar rápido"
                    aria-label="Adicionar rápido"
                  >
                    <ShoppingBag size={16} />
                  </button>
                </div>

                <button
                  onClick={(event) => {
                    event.stopPropagation();
                    toggleWishlist(produto.id);
                  }}
                  className={`absolute top-2 right-2 md:top-3 md:right-3 p-1.5 md:p-2 bg-white/70 backdrop-blur rounded-full shadow-sm md:opacity-0 md:group-hover:opacity-100 transition-all transform md:scale-90 md:group-hover:scale-100 z-10 ${
                    wishlist.includes(produto.id) ? 'opacity-100' : ''
                  }`}
                  aria-label="Favoritar"
                >
                  <Heart
                    size={16}
                    className={`transition-colors ${wishlist.includes(produto.id) ? 'fill-rose-500 text-rose-500' : 'text-neutral-900'}`}
                  />
                </button>
              </div>

              <div className="mt-3 md:mt-5 space-y-0.5 md:space-y-1">
                <h3 className="text-sm md:text-base font-medium text-neutral-900 line-clamp-1" onClick={() => abrirQuickView(produto)}>
                  {produto.nome}
                </h3>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <p className="text-sm md:text-base font-semibold text-neutral-900">R$ {formatCurrency(produto.preco)}</p>
                  <p className="text-[10px] md:text-sm text-neutral-500 capitalize">{produto.categoria}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 md:mt-32 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 border-t border-neutral-200 pt-10 md:pt-16">
          {SHOP_FEATURES.map((feature) => {
            const Icon = feature.icon;
            const isFreteGratis = feature.title === 'Envio Grátis';
            const isQualidade = feature.title === 'Qualidade Premium';
            const isTroca = feature.title === 'Troca Facilitada';
            const highlight = isFreteGratis || isQualidade || isTroca;
            return (
              <div
                key={feature.title}
                className={`group flex flex-row md:flex-col items-center md:text-center p-4 md:p-6 rounded-lg border border-neutral-100 shadow-sm md:shadow-none transition-all duration-300 ${
                  highlight
                    ? 'bg-white hover:bg-neutral-900 hover:text-white hover:-translate-y-1 hover:shadow-lg'
                    : 'bg-white md:border-transparent md:hover:border-neutral-100 hover:-translate-y-1'
                }`}
              >
                <div
                  className={`w-10 h-10 md:w-14 md:h-14 rounded-full flex items-center justify-center mr-4 md:mr-0 md:mb-5 flex-shrink-0 transition-colors duration-300 ${
                    highlight
                      ? 'bg-neutral-100 text-neutral-900 group-hover:bg-white group-hover:text-neutral-900'
                      : 'bg-neutral-100 text-neutral-900'
                  }`}
                >
                  <Icon size={20} className="md:w-6 md:h-6" strokeWidth={1.5} />
                </div>
                <div className="text-left md:text-center">
                  <h3 className={`font-bold text-sm md:text-lg mb-0.5 md:mb-2 ${highlight ? 'transition-colors duration-300' : ''}`}>
                    {feature.title}
                  </h3>
                  <p className={`text-xs md:text-sm ${highlight ? 'text-neutral-500 group-hover:text-neutral-200 transition-colors duration-300' : 'text-neutral-500'}`}>
                    {feature.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      <footer className="bg-neutral-900 text-white pt-10 md:pt-20 pb-8 md:pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12 mb-10 md:mb-16">
            <div className="md:col-span-1 text-center md:text-left">
              <h2 className="text-2xl md:text-3xl font-serif font-bold mb-4 md:mb-6 tracking-tight">LUMINA</h2>
              <p className="text-neutral-400 text-sm leading-relaxed mb-6 hidden md:block">
                Curadoria de moda para mulheres que buscam autenticidade. Peças atemporais criadas com consciência e estilo.
              </p>
              <div className="flex justify-center md:justify-start space-x-6">
                <Instagram size={20} className="hover:text-white cursor-pointer opacity-70 hover:opacity-100 transition-opacity" />
                <Facebook size={20} className="hover:text-white cursor-pointer opacity-70 hover:opacity-100 transition-opacity" />
                <Twitter size={20} className="hover:text-white cursor-pointer opacity-70 hover:opacity-100 transition-opacity" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8 md:col-span-2 text-sm">
              <div>
                <h4 className="font-bold mb-4 md:mb-6 uppercase tracking-wider text-neutral-300">Comprar</h4>
                <ul className="space-y-2 md:space-y-3 text-neutral-400">
                  {['Novidades', 'Vestidos', 'Alfaiataria', 'Acessórios', 'Sale'].map((item) => (
                    <li key={item}>
                      <a href="#" className="hover:text-white transition-colors">
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-bold mb-4 md:mb-6 uppercase tracking-wider text-neutral-300">Suporte</h4>
                <ul className="space-y-2 md:space-y-3 text-neutral-400">
                  {['Meus Pedidos', 'Trocas', 'Guia de Medidas', 'Fale Conosco'].map((item) => (
                    <li key={item}>
                      <a href="#" className="hover:text-white transition-colors">
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="md:col-span-1">
              <h4 className="font-bold mb-4 md:mb-6 text-sm uppercase tracking-wider text-neutral-300 text-center md:text-left">
                Newsletter
              </h4>

              {newsletterSucesso ? (
                <div className="bg-emerald-900/50 text-emerald-200 px-4 py-3 rounded text-sm flex items-center justify-center md:justify-start gap-2 border border-emerald-800">
                  <Check size={16} /> Inscrito!
                </div>
              ) : (
                <form onSubmit={handleNewsletterSubmit} className="flex flex-col gap-3">
                  <div className="relative">
                    <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                    <input
                      type="email"
                      value={emailNewsletter}
                      onChange={(event) => setEmailNewsletter(event.target.value)}
                      placeholder="seu@email.com"
                      required
                      className="bg-neutral-800 border border-neutral-700 text-sm pl-10 pr-4 py-3 w-full focus:ring-1 focus:ring-white outline-none text-white rounded-sm placeholder:text-neutral-600 transition-all focus:bg-neutral-700"
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-white text-neutral-900 px-4 py-3 text-sm font-bold hover:bg-neutral-200 transition-colors rounded-sm uppercase tracking-wide"
                  >
                    Inscrever-se
                  </button>
                </form>
              )}
            </div>
          </div>

          <div className="border-t border-neutral-800 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-neutral-500">
            <p>&copy; 2025 Lumina Fashion.</p>
          </div>
        </div>
      </footer>

      {produtoQuickView && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-0 md:p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={() => setProdutoQuickView(null)} />

          <div className="bg-white md:rounded-lg shadow-2xl w-full max-w-4xl relative z-10 overflow-hidden animate-slide-up md:animate-scale-in flex flex-col md:flex-row h-full md:max-h-[85vh] md:h-auto">
            <button
              onClick={() => setProdutoQuickView(null)}
              className="absolute top-4 right-4 p-2 bg-white/80 md:bg-white/50 hover:bg-white rounded-full z-20 transition-colors shadow-sm"
              aria-label="Fechar"
            >
              <X size={24} />
            </button>

            <div className="w-full md:w-1/2 bg-neutral-100 h-[40vh] md:h-auto flex-shrink-0">
              <img src={produtoQuickView.imagem} alt={produtoQuickView.nome} className="w-full h-full object-cover" />
            </div>

            <div className="w-full md:w-1/2 p-6 md:p-12 overflow-y-auto flex flex-col h-full bg-white relative -mt-4 md:mt-0 rounded-t-3xl md:rounded-none">
              <div className="flex-1">
                <span className="text-xs font-bold tracking-widest text-neutral-500 uppercase mb-2 block">{produtoQuickView.categoria}</span>
                <h2 className="text-2xl md:text-3xl font-serif font-bold text-neutral-900 mb-2 md:mb-4">{produtoQuickView.nome}</h2>
                <p className="text-xl md:text-2xl font-medium text-neutral-900 mb-4 md:mb-6">R$ {formatCurrency(produtoQuickView.preco)}</p>

                <p className="text-sm md:text-base text-neutral-600 leading-relaxed mb-6 md:mb-8">{produtoQuickView.descricao}</p>

                <div className="mb-8">
                  <div className="flex justify-between mb-3">
                    <span className="text-sm font-bold text-neutral-900">Tamanho</span>
                    <button className="text-xs text-neutral-500 underline">Guia de medidas</button>
                  </div>
                  <div className="flex gap-3">
                    {produtoQuickView.tamanhos.map((tamanho) => (
                      <button
                        key={tamanho}
                        onClick={() => setTamanhoSelecionado(tamanho)}
                        className={`w-10 h-10 md:w-12 md:h-12 rounded border flex items-center justify-center text-sm font-medium transition-all ${
                          tamanhoSelecionado === tamanho
                            ? 'border-neutral-900 bg-neutral-900 text-white'
                            : 'border-neutral-200 text-neutral-600 hover:border-neutral-400'
                        }`}
                      >
                        {tamanho}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-4 border-t border-neutral-100 md:border-none pb-4 md:pb-0">
                <button
                  onClick={() => produtoQuickView && adicionarAoCarrinho(produtoQuickView, tamanhoSelecionado)}
                  className="flex-1 bg-neutral-900 text-white py-4 font-bold tracking-wider hover:bg-neutral-800 transition-all active:scale-95 shadow-lg text-sm md:text-base"
                >
                  ADICIONAR
                </button>
                <button
                  onClick={() => toggleWishlist(produtoQuickView.id)}
                  className={`w-14 flex items-center justify-center border rounded transition-colors ${
                    wishlist.includes(produtoQuickView.id)
                      ? 'border-rose-200 bg-rose-50 text-rose-500'
                      : 'border-neutral-200 hover:border-neutral-400'
                  }`}
                  aria-label="Salvar nos favoritos"
                >
                  <Heart size={20} className={wishlist.includes(produtoQuickView.id) ? 'fill-rose-500' : ''} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {userMenuAberto && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={() => setUserMenuAberto(false)} />

          <div className="absolute inset-y-0 right-0 max-w-full flex">
            <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col h-full animate-slide-in-right transform transition-transform">
              <div className="flex items-center justify-between px-6 py-6 border-b border-neutral-100 bg-white">
                <h2 className="text-xl font-serif font-bold text-neutral-900">
                  {usuario ? `Olá, ${usuario.nome}` : viewAuth === 'login' ? 'Entrar' : 'Criar Conta'}
                </h2>
                <button onClick={() => setUserMenuAberto(false)} className="p-2 hover:bg-neutral-100 rounded-full transition-colors" aria-label="Fechar painel do usuário">
                  <X size={24} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 md:p-8">
                {usuario ? (
                  <div className="space-y-8 animate-fade-in">
                    <div className="flex items-center gap-4 pb-8 border-b border-neutral-100">
                      <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center text-neutral-400">
                        <User size={32} />
                      </div>
                      <div>
                        <p className="font-bold text-lg text-neutral-900">{usuario.nome}</p>
                        <p className="text-sm text-neutral-500">{usuario.email}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {[
                        { icon: Package, label: 'Meus Pedidos' },
                        {
                          icon: Heart,
                          label: 'Lista de Desejos',
                          onClick: () => {
                            setUserMenuAberto(false);
                          }
                        },
                        { icon: MapPin, label: 'Endereços' },
                        { icon: CreditCard, label: 'Cartões Salvos' },
                        { icon: Settings, label: 'Configurações da Conta' }
                      ].map((item) => {
                        const Icon = item.icon;
                        return (
                          <button
                            key={item.label}
                            type="button"
                            onClick={() => {
                              item.onClick?.();
                            }}
                            className="w-full flex items-center justify-between p-4 bg-neutral-50 hover:bg-neutral-100 rounded-lg transition-colors group"
                          >
                            <div className="flex items-center gap-4 text-neutral-700">
                              <Icon size={20} />
                              <span className="font-medium">{item.label}</span>
                            </div>
                            <ChevronRight size={16} className="text-neutral-400 group-hover:text-neutral-900" />
                          </button>
                        );
                      })}
                    </div>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center justify-center gap-2 p-4 text-rose-500 font-medium hover:bg-rose-50 rounded-lg transition-colors"
                    >
                      <LogOut size={20} />
                      Sair da Conta
                    </button>
                  </div>
                ) : (
                  <div className="animate-fade-in">
                    <form onSubmit={handleAuthSubmit} className="space-y-6">
                      {viewAuth === 'cadastro' && (
                        <div>
                          <label className="block text-sm font-bold text-neutral-900 mb-2">Nome completo</label>
                          <input
                            type="text"
                            required
                            className="w-full p-4 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:border-neutral-900 transition-colors"
                            placeholder="Seu nome"
                            value={authForm.nome}
                            onChange={(event) => atualizarAuthForm('nome', event.target.value)}
                          />
                        </div>
                      )}

                      <div>
                        <label className="block text-sm font-bold text-neutral-900 mb-2">E-mail</label>
                        <input
                          type="email"
                          required
                          className="w-full p-4 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:border-neutral-900 transition-colors"
                          placeholder="seu@email.com"
                          value={authForm.email}
                          onChange={(event) => atualizarAuthForm('email', event.target.value)}
                        />
                      </div>

                      <div>
                        <div className="flex justify-between mb-2">
                          <label className="block text-sm font-bold text-neutral-900">Senha</label>
                          {viewAuth === 'login' && (
                            <button type="button" className="text-xs text-neutral-500 underline">
                              Esqueceu?
                            </button>
                          )}
                        </div>
                        <input
                          type="password"
                          required
                          className="w-full p-4 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:border-neutral-900 transition-colors"
                          placeholder="••••••••"
                          value={authForm.senha}
                          onChange={(event) => atualizarAuthForm('senha', event.target.value)}
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-neutral-900 text-white py-4 font-bold tracking-wide hover:bg-neutral-800 rounded-lg transition-transform active:scale-[0.99] shadow-lg"
                      >
                        {viewAuth === 'login' ? 'Entrar' : 'Criar Conta'}
                      </button>
                    </form>

                    <div className="mt-8 text-center pt-8 border-t border-neutral-100">
                      <p className="text-neutral-500 mb-4">{viewAuth === 'login' ? 'Ainda não tem conta?' : 'Já tem uma conta?'}</p>
                      <button
                        type="button"
                        onClick={() => setViewAuth((prev) => (prev === 'login' ? 'cadastro' : 'login'))}
                        className="text-neutral-900 font-bold border-b-2 border-neutral-900 pb-0.5 hover:text-neutral-700 hover:border-neutral-700 transition-colors"
                      >
                        {viewAuth === 'login' ? 'Cadastre-se agora' : 'Faça login'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {carrinhoAberto && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={() => setCarrinhoAberto(false)} />

          <div className="absolute inset-y-0 right-0 max-w-full flex">
            <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col h-full animate-slide-in-right transform transition-transform">
              <div className="flex items-center justify-between px-6 py-6 border-b border-neutral-100 bg-white">
                <h2 className="text-xl font-serif font-bold text-neutral-900">Sua Sacola ({totalItens})</h2>
                <button onClick={() => setCarrinhoAberto(false)} className="p-2 hover:bg-neutral-100 rounded-full transition-colors" aria-label="Fechar carrinho">
                  <X size={24} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 md:space-y-8">
                {carrinho.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-neutral-400 space-y-4">
                    <ShoppingBag size={64} className="opacity-10" />
                    <p className="text-lg font-medium text-neutral-500">Sua sacola está vazia</p>
                    <button
                      onClick={() => setCarrinhoAberto(false)}
                      className="text-neutral-900 font-bold border-b-2 border-neutral-900 hover:text-neutral-700 hover:border-neutral-700 pb-1"
                    >
                      Descobrir novidades
                    </button>
                  </div>
                ) : (
                  carrinho.map((item) => (
                    <div key={`${item.id}-${item.tamanho}`} className="flex gap-4 animate-fade-in">
                      <div className="h-24 w-20 md:h-28 md:w-24 flex-shrink-0 overflow-hidden rounded-md border border-neutral-100 bg-neutral-50">
                        <img src={item.imagem} alt={item.nome} className="h-full w-full object-cover object-center" />
                      </div>
                      <div className="flex flex-1 flex-col justify-between py-1">
                        <div>
                          <div className="flex justify-between text-sm md:text-base font-medium text-neutral-900">
                            <h3 className="line-clamp-2 leading-tight pr-2">
                              <a href="#">{item.nome}</a>
                            </h3>
                            <p className="whitespace-nowrap">R$ {formatCurrency(item.preco * item.qtd)}</p>
                          </div>
                          <p className="mt-1 text-xs md:text-sm text-neutral-500 capitalize">{item.categoria}</p>
                          <p className="text-[10px] md:text-xs font-bold text-neutral-400 mt-1 uppercase">Tam: {item.tamanho}</p>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center border border-neutral-200 rounded">
                            <button
                              onClick={() => alterarQtd(item.id, item.tamanho, -1)}
                              className="px-2 md:px-3 py-1 hover:bg-neutral-100 text-neutral-600 disabled:opacity-30"
                              disabled={item.qtd <= 1}
                            >
                              -
                            </button>
                            <span className="px-2 font-medium min-w-[1.5rem] text-center">{item.qtd}</span>
                            <button onClick={() => alterarQtd(item.id, item.tamanho, 1)} className="px-2 md:px-3 py-1 hover:bg-neutral-100 text-neutral-600">
                              +
                            </button>
                          </div>
                          <button
                            type="button"
                            onClick={() => removerDoCarrinho(item.id, item.tamanho)}
                            className="text-xs font-medium text-neutral-400 underline hover:text-rose-500 transition-colors"
                          >
                            Remover
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {carrinho.length > 0 && (
                <div className="border-t border-neutral-100 px-6 py-6 bg-neutral-50">
                  <div className="flex justify-between text-base font-medium text-neutral-900 mb-2">
                    <p>Subtotal</p>
                    <p>R$ {formatCurrency(totalValor)}</p>
                  </div>
                  <p className="text-xs text-neutral-500 mb-6">Taxas e frete calculados no checkout.</p>
                  <button className="w-full bg-neutral-900 text-white py-4 px-6 text-sm font-bold uppercase tracking-wider hover:bg-neutral-800 transition-colors shadow-lg active:transform active:scale-[0.99]">
                    Finalizar Compra
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LuminaFashion;
