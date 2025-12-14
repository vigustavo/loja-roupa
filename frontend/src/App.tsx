import React, { type FormEvent, useEffect, useRef, useState } from 'react';
import {
  Check,
  ChevronLeft,
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
  MessageCircle,
  Package,
  Search,
  Send,
  Settings,
  ShoppingBag,
  Twitter,
  User,
  X
} from 'lucide-react';

type CategoriaId = 'todos' | 'vestidos' | 'blusas' | 'calcas' | 'casacos';

type AuthView = 'login' | 'cadastro';

interface Produto {
  id: number;
  nome: string;
  preco: number;
  categoria: Exclude<CategoriaId, 'todos'>;
  imagens: string[];
  imagem: string;
  novo: boolean;
  tamanhos: string[];
  descricao: string;
}

type CarrinhoItem = Produto & {
  qtd: number;
  tamanho: string;
  imagemSelecionada: string;
};

type ChatMessage = {
  tipo: 'bot' | 'user';
  texto: string;
};

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
    imagens: [
      'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&q=80&w=800'
    ],
    imagem: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&q=80&w=800',
    novo: true,
    tamanhos: ['PP', 'P', 'M', 'G'],
    descricao: 'Um vestido leve e romântico, perfeito para tardes de verão. Confeccionado em viscose premium com estampa floral exclusiva.'
  },
  {
    id: 2,
    nome: 'Blusa de Seda Off-White',
    preco: 129.5,
    categoria: 'blusas',
    imagens: [
      'https://images.unsplash.com/photo-1564257631407-4deb1f99d992?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1503185912284-5271ff81b9a8?auto=format&fit=crop&q=80&w=800'
    ],
    imagem: 'https://images.unsplash.com/photo-1564257631407-4deb1f99d992?auto=format&fit=crop&q=80&w=800',
    novo: false,
    tamanhos: ['P', 'M', 'G', 'GG'],
    descricao: 'Elegância pura em seda lavada. O caimento fluido e o tom off-white tornam esta peça um curinga no guarda-roupa.'
  },
  {
    id: 3,
    nome: 'Calça Alfaiataria Bege',
    preco: 210,
    categoria: 'calcas',
    imagens: [
      'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1552874869-5c39ec928857?auto=format&fit=crop&q=80&w=800'
    ],
    imagem: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&q=80&w=800',
    novo: false,
    tamanhos: ['36', '38', '40', '42'],
    descricao: 'Corte impecável e tecido estruturado. A calça ideal para transitar do escritório para o jantar com sofisticação.'
  },
  {
    id: 4,
    nome: 'Jaqueta Jeans Vintage',
    preco: 259.9,
    categoria: 'casacos',
    imagens: [
      'https://images.unsplash.com/photo-1525450824786-227cbef707f3?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&q=80&w=800'
    ],
    imagem: 'https://images.unsplash.com/photo-1525450824786-227cbef707f3?auto=format&fit=crop&q=80&w=800',
    novo: true,
    tamanhos: ['P', 'M', 'G'],
    descricao: 'Lavagem retrô com modelagem oversized. Uma terceira peça cheia de personalidade para compor looks despojados.'
  },
  {
    id: 5,
    nome: 'Vestido Longo Verão',
    preco: 159,
    categoria: 'vestidos',
    imagens: [
      'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=800'
    ],
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
    imagens: ['https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?auto=format&fit=crop&q=80&w=800'],
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
    imagens: [
      'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1552874869-5c39ec928857?auto=format&fit=crop&q=80&w=800'
    ],
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
    imagens: [
      'https://images.unsplash.com/photo-1503185912284-5271ff81b9a8?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1518310383802-640c2de311b2?auto=format&fit=crop&q=80&w=800'
    ],
    imagem: 'https://images.unsplash.com/photo-1503185912284-5271ff81b9a8?auto=format&fit=crop&q=80&w=800',
    novo: false,
    tamanhos: ['P', 'M', 'G'],
    descricao: 'Linho misto para garantir frescor. Modelagem estruturada que valoriza o colo.'
  }
];

const CATEGORIAS: Array<{ id: CategoriaId; nome: string }> = [
  { id: 'todos', nome: 'Todas' },
  { id: 'vestidos', nome: 'Vestidos' },
  { id: 'blusas', nome: 'Blusas' },
  { id: 'calcas', nome: 'Calças & Saias' },
  { id: 'casacos', nome: 'Casacos' }
];

const LuminaFashion = () => {
  const [carrinho, setCarrinho] = useState<CarrinhoItem[]>([]);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [carrinhoAberto, setCarrinhoAberto] = useState(false);
  const [userMenuAberto, setUserMenuAberto] = useState(false);
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [viewAuth, setViewAuth] = useState<AuthView>('login');
  const [authForm, setAuthForm] = useState<AuthFormState>({ nome: '', email: '', senha: '' });
  const [buscaAberta, setBuscaAberta] = useState(false);
  const [termoBusca, setTermoBusca] = useState('');
  const [chatAberto, setChatAberto] = useState(false);
  const [chatMensagem, setChatMensagem] = useState('');
  const [historicoChat, setHistoricoChat] = useState<ChatMessage[]>([
    { tipo: 'bot', texto: 'Olá! Bem-vinda à Lumina. Como posso ajudar você hoje?' }
  ]);
  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const [menuMobileAberto, setMenuMobileAberto] = useState(false);
  const [categoriaAtiva, setCategoriaAtiva] = useState<CategoriaId>('todos');
  const [notificacao, setNotificacao] = useState<string | null>(null);
  const [produtoQuickView, setProdutoQuickView] = useState<Produto | null>(null);
  const [imagemSelecionadaIndex, setImagemSelecionadaIndex] = useState(0);
  const [tamanhoSelecionado, setTamanhoSelecionado] = useState<string | null>(null);
  const [emailNewsletter, setEmailNewsletter] = useState('');
  const [newsletterSucesso, setNewsletterSucesso] = useState(false);

  const produtosFiltrados = PRODUTOS.filter((produto) => {
    const matchCategoria = categoriaAtiva === 'todos' || produto.categoria === categoriaAtiva;
    const matchBusca =
      produto.nome.toLowerCase().includes(termoBusca.toLowerCase()) ||
      produto.categoria.toLowerCase().includes(termoBusca.toLowerCase());
    return matchCategoria && matchBusca;
  });

  useEffect(() => {
    if (chatAberto && chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatAberto, historicoChat]);

  const mostrarNotificacao = (mensagem: string) => {
    setNotificacao(mensagem);
    window.setTimeout(() => setNotificacao(null), 3000);
  };

  const abrirQuickView = (produto: Produto) => {
    setProdutoQuickView(produto);
    setImagemSelecionadaIndex(0);
    setTamanhoSelecionado(produto.tamanhos[0]);
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

  const handleAuthSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (viewAuth === 'login') {
      setUsuario({ nome: 'Visitante', email: authForm.email });
      mostrarNotificacao('Bem-vindo de volta!');
    } else {
      setUsuario({ nome: authForm.nome, email: authForm.email });
      mostrarNotificacao('Conta criada com sucesso!');
    }
    setAuthForm({ nome: '', email: '', senha: '' });
  };

  const handleSocialLogin = (provider: 'Google' | 'Apple' | 'Facebook') => {
    setUsuario({ nome: `Usuário ${provider}`, email: `usuario@${provider.toLowerCase()}.com` });
    mostrarNotificacao(`Login com ${provider} realizado com sucesso!`);
  };

  const handleLogout = () => {
    setUsuario(null);
    mostrarNotificacao('Sessão terminada');
  };

  const handleEnviarMensagemChat = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!chatMensagem.trim()) {
      return;
    }
    const novaMsg: ChatMessage = { tipo: 'user', texto: chatMensagem };
    setHistoricoChat((prev) => [...prev, novaMsg]);
    setChatMensagem('');
    window.setTimeout(() => {
      setHistoricoChat((prev) => [
        ...prev,
        {
          tipo: 'bot',
          texto: 'Obrigado pelo contato! Um de nossos consultores de estilo responderá em instantes. Enquanto isso, já conferiu nossa nova coleção?'
        }
      ]);
    }, 1500);
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

  const totalItens = carrinho.reduce((acc, item) => acc + item.qtd, 0);
  const totalValor = carrinho.reduce((acc, item) => acc + item.preco * item.qtd, 0);

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

      <nav className="fixed w-full bg-white/95 backdrop-blur-md z-40 border-b border-neutral-100 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 md:h-20">
            <div className="flex items-center gap-2">
              <button
                className="p-2 -ml-2 hover:bg-neutral-100 rounded-full md:hidden text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-200"
                onClick={() => setMenuMobileAberto((prev) => !prev)}
              >
                {menuMobileAberto ? <X size={24} /> : <Menu size={24} />}
              </button>
              <a href="#" className="text-xl md:text-2xl font-serif font-bold tracking-tighter text-neutral-900">
                LUMINA
              </a>
            </div>

            <div className="hidden md:flex space-x-8 text-sm font-medium tracking-wide text-neutral-500">
              {['NOVIDADES', 'COLEÇÃO', 'ACESSÓRIOS', 'EDITORIAL'].map((item) => (
                <a key={item} href="#" className="hover:text-neutral-900 transition-colors relative group">
                  {item}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-neutral-900 transition-all group-hover:w-full" />
                </a>
              ))}
            </div>

            <div className="flex items-center space-x-1 md:space-x-2">
              <div className={`flex items-center transition-all duration-300 ${buscaAberta ? 'bg-neutral-100 rounded-full px-2' : ''}`}>
                <button
                  className="p-2 hover:bg-neutral-100 rounded-full transition-colors text-neutral-600"
                  onClick={() => {
                    setBuscaAberta((prev) => !prev);
                    if (!buscaAberta) {
                      window.setTimeout(() => document.getElementById('search-input')?.focus(), 100);
                    }
                  }}
                >
                  <Search size={20} className="w-5 h-5 md:w-6 md:h-6" />
                </button>
                {buscaAberta && (
                  <input
                    id="search-input"
                    type="text"
                    placeholder="Buscar..."
                    value={termoBusca}
                    onChange={(event) => setTermoBusca(event.target.value)}
                    className="bg-transparent border-none focus:ring-0 text-sm w-32 md:w-48 outline-none text-neutral-800 placeholder:text-neutral-400"
                    onBlur={() => {
                      if (!termoBusca) {
                        setBuscaAberta(false);
                      }
                    }}
                  />
                )}
              </div>

              <button className="p-2 hover:bg-neutral-100 rounded-full transition-colors text-neutral-600" onClick={() => setUserMenuAberto(true)}>
                <User size={20} className="w-5 h-5 md:w-6 md:h-6" />
              </button>

              <div className="relative">
                <button className="p-2 hover:bg-neutral-100 rounded-full transition-colors text-neutral-600" onClick={() => setCarrinhoAberto(true)}>
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
          <div className="fixed inset-0 top-16 z-50 bg-white md:hidden animate-in slide-in-from-top-5 duration-300 flex flex-col border-t border-neutral-100 shadow-xl">
            <div className="p-6 space-y-2 overflow-y-auto">
              {['NOVIDADES', 'COLEÇÃO', 'ACESSÓRIOS', 'CONTA', 'WISHLIST'].map((item) => (
                <a
                  key={item}
                  href="#"
                  className="flex items-center justify-between py-4 text-lg font-serif font-medium text-neutral-900 border-b border-neutral-50 hover:bg-neutral-50 hover:pl-2 transition-all group"
                  onClick={() => {
                    if (item === 'CONTA') {
                      setUserMenuAberto(true);
                    }
                    setMenuMobileAberto(false);
                  }}
                >
                  {item}
                  <ChevronRight size={18} className="text-neutral-300 group-hover:text-neutral-900" />
                </a>
              ))}
              <div className="pt-8 flex justify-center gap-8 text-neutral-400">
                <Instagram size={24} className="hover:text-neutral-900 cursor-pointer transition-colors" />
                <Facebook size={24} className="hover:text-neutral-900 cursor-pointer transition-colors" />
                <Twitter size={24} className="hover:text-neutral-900 cursor-pointer transition-colors" />
              </div>
            </div>
            <div className="flex-grow bg-white" onClick={() => setMenuMobileAberto(false)} />
          </div>
        )}
      </nav>

      <div className="relative pt-16 md:pt-20">
        <div className="absolute inset-0 bg-black/20 md:bg-gradient-to-r md:from-neutral-900/40 md:to-transparent z-10 pointer-events-none" />
        <div
          className="h-[55vh] md:h-[75vh] bg-cover bg-center bg-fixed flex items-center px-4"
          style={{
            backgroundImage: 'url(\'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=2000\')'
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
        <div className="sticky top-16 md:top-20 z-30 bg-neutral-50/95 backdrop-blur py-3 md:py-4 -mx-4 px-4 md:mx-0 md:px-0 border-b md:border-none border-neutral-100 mb-6 md:mb-10 transition-all">
          <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
            <h2 className="text-xl md:text-3xl font-serif font-bold text-neutral-900 hidden md:block">
              {termoBusca
                ? `Resultados para "${termoBusca}"`
                : categoriaAtiva === 'todos'
                  ? 'Destaques da Semana'
                  : CATEGORIAS.find((categoria) => categoria.id === categoriaAtiva)?.nome}
            </h2>

            <div className="flex flex-wrap gap-2 w-full md:w-auto md:flex-nowrap md:overflow-x-auto md:space-x-2 md:pb-0 justify-start">
              {CATEGORIAS.map((categoria) => (
                <button
                  key={categoria.id}
                  onClick={() => {
                    setCategoriaAtiva(categoria.id);
                    setTermoBusca('');
                  }}
                  className={`px-4 py-2 md:px-6 rounded-full text-xs md:text-sm font-medium whitespace-nowrap transition-all duration-300 flex-shrink-0 ${
                    categoriaAtiva === categoria.id && !termoBusca ? 'bg-neutral-900 text-white shadow-md' : 'bg-white text-neutral-500 border border-neutral-200'
                  }`}
                >
                  {categoria.nome}
                </button>
              ))}
            </div>
          </div>
        </div>

        {produtosFiltrados.length === 0 ? (
          <div className="text-center py-20 text-neutral-500">
            <p>Nenhum produto encontrado.</p>
            <button onClick={() => setTermoBusca('')} className="mt-4 text-neutral-900 underline">
              Limpar busca
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-3 gap-y-8 md:gap-x-8 md:gap-y-12">
            {produtosFiltrados.map((produto) => (
              <div key={produto.id} className="group relative">
                <div className="aspect-[3/4] w-full overflow-hidden rounded-md bg-neutral-200 relative shadow-sm md:group-hover:shadow-xl transition-all duration-300">
                  <img
                    src={produto.imagens[0]}
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
                    >
                      <ShoppingBag size={16} />
                    </button>
                  </div>
                  <button
                    onClick={(event) => {
                      event.stopPropagation();
                      toggleWishlist(produto.id);
                    }}
                    className={`absolute top-2 right-2 md:top-3 md:right-3 p-1.5 md:p-2 bg-white/70 backdrop-blur rounded-full shadow-sm md:opacity-0 md:group-hover:opacity-100 transition-all transform md:scale-90 md:group-hover:scale-100 z-10 ${wishlist.includes(produto.id) ? 'opacity-100' : ''}`}
                  >
                    <Heart size={16} className={wishlist.includes(produto.id) ? 'fill-rose-500 text-rose-500' : 'text-neutral-900'} />
                  </button>
                </div>
                <div className="mt-3 md:mt-5 space-y-0.5 md:space-y-1">
                  <h3 className="text-sm md:text-base font-medium text-neutral-900 line-clamp-1" onClick={() => abrirQuickView(produto)}>
                    {produto.nome}
                  </h3>
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <p className="text-sm md:text-base font-semibold text-neutral-900">R$ {produto.preco.toFixed(2).replace('.', ',')}</p>
                    <p className="text-[10px] md:text-sm text-neutral-500 capitalize">{produto.categoria}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
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
              <h4 className="font-bold mb-4 md:mb-6 text-sm uppercase tracking-wider text-neutral-300 text-center md:text-left">Newsletter</h4>
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
                  <button type="submit" className="bg-white text-neutral-900 px-4 py-3 text-sm font-bold hover:bg-neutral-200 transition-colors rounded-sm uppercase tracking-wide">
                    Inscrever-se
                  </button>
                </form>
              )}
            </div>
          </div>
          <div className="border-t border-neutral-800 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-neutral-500">
            <p>© 2025 Lumina Fashion.</p>
          </div>
        </div>
      </footer>

      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
        {chatAberto && (
          <div className="w-80 h-96 bg-white rounded-2xl shadow-2xl border border-neutral-100 flex flex-col overflow-hidden animate-slide-up origin-bottom-right">
            <div className="bg-neutral-900 p-4 text-white flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="font-bold text-sm">Suporte Lumina</span>
              </div>
              <button onClick={() => setChatAberto(false)} className="hover:bg-white/10 p-1 rounded transition-colors">
                <X size={16} />
              </button>
            </div>
            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-neutral-50">
              {historicoChat.map((mensagem, index) => (
                <div key={`chat-${index}`} className={`flex ${mensagem.tipo === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-3 text-sm rounded-2xl shadow-sm ${mensagem.tipo === 'user' ? 'bg-neutral-900 text-white rounded-br-none' : 'bg-white border border-neutral-200 text-neutral-800 rounded-bl-none'}`}>
                    {mensagem.texto}
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>
            <form onSubmit={handleEnviarMensagemChat} className="p-3 bg-white border-t border-neutral-100 flex gap-2">
              <input
                type="text"
                value={chatMensagem}
                onChange={(event) => setChatMensagem(event.target.value)}
                placeholder="Digite sua mensagem..."
                className="flex-1 bg-neutral-100 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-neutral-900 transition-shadow"
              />
              <button type="submit" className="p-2 bg-neutral-900 text-white rounded-full hover:bg-neutral-800 transition-colors shadow-sm disabled:opacity-50" disabled={!chatMensagem.trim()}>
                <Send size={16} />
              </button>
            </form>
          </div>
        )}

        <button
          onClick={() => setChatAberto((prev) => !prev)}
          className="bg-neutral-900 text-white p-4 rounded-full shadow-xl hover:bg-neutral-800 transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center relative group"
        >
          {chatAberto ? <X size={24} /> : <MessageCircle size={24} />}
          {!chatAberto && (
            <span className="absolute right-full mr-3 bg-white text-neutral-900 text-xs font-bold py-1 px-3 rounded shadow-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              Fale Conosco
            </span>
          )}
        </button>
      </div>

      {produtoQuickView && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-0 md:p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={() => setProdutoQuickView(null)} />
          <div className="bg-white md:rounded-lg shadow-2xl w-full max-w-4xl relative z-10 overflow-hidden animate-slide-up md:animate-scale-in flex flex-col md:flex-row h-full md:max-h-[85vh] md:h-auto">
            <button
              onClick={() => setProdutoQuickView(null)}
              className="absolute top-4 right-4 p-2 bg-white/80 md:bg-white/50 hover:bg-white rounded-full z-20 transition-colors shadow-sm"
            >
              <X size={24} />
            </button>
            <div className="w-full md:w-1/2 bg-neutral-100 h-[40vh] md:h-auto flex-shrink-0 relative group">
              <img
                src={produtoQuickView.imagens[imagemSelecionadaIndex] || produtoQuickView.imagem}
                alt={produtoQuickView.nome}
                className="w-full h-full object-cover transition-opacity duration-300"
              />
              {produtoQuickView.imagens.length > 1 && (
                <>
                  <button
                    onClick={(event) => {
                      event.stopPropagation();
                      setImagemSelecionadaIndex((prev) => (prev === 0 ? produtoQuickView.imagens.length - 1 : prev - 1));
                    }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/50 hover:bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={(event) => {
                      event.stopPropagation();
                      setImagemSelecionadaIndex((prev) => (prev === produtoQuickView.imagens.length - 1 ? 0 : prev + 1));
                    }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/50 hover:bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <ChevronRight size={20} />
                  </button>
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {produtoQuickView.imagens.map((_, idx) => (
                      <button
                        key={`dot-${idx}`}
                        onClick={() => setImagemSelecionadaIndex(idx)}
                        className={`w-2 h-2 rounded-full transition-all ${imagemSelecionadaIndex === idx ? 'bg-white w-4' : 'bg-white/50'}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
            <div className="w-full md:w-1/2 p-6 md:p-12 overflow-y-auto flex flex-col h-full bg-white relative -mt-4 md:mt-0 rounded-t-3xl md:rounded-none">
              <div className="flex-1">
                <span className="text-xs font-bold tracking-widest text-neutral-500 uppercase mb-2 block">{produtoQuickView.categoria}</span>
                <h2 className="text-2xl md:text-3xl font-serif font-bold text-neutral-900 mb-2 md:mb-4">{produtoQuickView.nome}</h2>
                <p className="text-xl md:text-2xl font-medium text-neutral-900 mb-4 md:mb-6">R$ {produtoQuickView.preco.toFixed(2).replace('.', ',')}</p>
                <p className="text-sm md:text-base text-neutral-600 leading-relaxed mb-6 md:mb-8">{produtoQuickView.descricao}</p>
                {produtoQuickView.imagens.length > 1 && (
                  <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                    {produtoQuickView.imagens.map((imagem, idx) => (
                      <button
                        key={`thumb-${idx}`}
                        onClick={() => setImagemSelecionadaIndex(idx)}
                        className={`w-16 h-16 flex-shrink-0 border rounded-md overflow-hidden transition-all ${
                          imagemSelecionadaIndex === idx ? 'border-neutral-900 ring-1 ring-neutral-900' : 'border-neutral-200 opacity-60 hover:opacity-100'
                        }`}
                      >
                        <img src={imagem} alt="Miniatura" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
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
                          tamanhoSelecionado === tamanho ? 'border-neutral-900 bg-neutral-900 text-white' : 'border-neutral-200 text-neutral-600 hover:border-neutral-400'
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
                  onClick={() => adicionarAoCarrinho(produtoQuickView, tamanhoSelecionado)}
                  className="flex-1 bg-neutral-900 text-white py-4 font-bold tracking-wider hover:bg-neutral-800 transition-all active:scale-95 shadow-lg text-sm md:text-base"
                >
                  ADICIONAR
                </button>
                <button
                  onClick={() => toggleWishlist(produtoQuickView.id)}
                  className={`w-14 flex items-center justify-center border rounded transition-colors ${
                    wishlist.includes(produtoQuickView.id) ? 'border-rose-200 bg-rose-50 text-rose-500' : 'border-neutral-200 hover:border-neutral-400'
                  }`}
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
                <h2 className="text-xl font-serif font-bold text-neutral-900">{usuario ? `Olá, ${usuario.nome}` : viewAuth === 'login' ? 'Entrar' : 'Criar Conta'}</h2>
                <button onClick={() => setUserMenuAberto(false)} className="p-2 hover:bg-neutral-100 rounded-full transition-colors">
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
                        { icon: Heart, label: 'Lista de Desejos', onClick: () => setUserMenuAberto(false) },
                        { icon: MapPin, label: 'Endereços' },
                        { icon: CreditCard, label: 'Cartões Salvos' },
                        { icon: Settings, label: 'Configurações da Conta' }
                      ].map((item) => (
                        <button key={item.label} onClick={item.onClick} className="w-full flex items-center justify-between p-4 bg-neutral-50 hover:bg-neutral-100 rounded-lg transition-colors group">
                          <div className="flex items-center gap-4 text-neutral-700">
                            <item.icon size={20} />
                            <span className="font-medium">{item.label}</span>
                          </div>
                          <ChevronRight size={16} className="text-neutral-400 group-hover:text-neutral-900" />
                        </button>
                      ))}
                    </div>
                    <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 p-4 text-rose-500 font-medium hover:bg-rose-50 rounded-lg transition-colors mt-8">
                      <LogOut size={20} />
                      Sair da Conta
                    </button>
                  </div>
                ) : (
                  <div className="animate-fade-in">
                    <form onSubmit={handleAuthSubmit} className="space-y-6">
                      {viewAuth === 'cadastro' && (
                        <div>
                          <label className="block text-sm font-bold text-neutral-900 mb-2">Nome Completo</label>
                          <input
                            type="text"
                            required
                            className="w-full p-4 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:border-neutral-900 transition-colors"
                            placeholder="Seu nome"
                            value={authForm.nome}
                            onChange={(event) => setAuthForm((prev) => ({ ...prev, nome: event.target.value }))}
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
                          onChange={(event) => setAuthForm((prev) => ({ ...prev, email: event.target.value }))}
                        />
                      </div>
                      <div>
                        <div className="flex justify-between mb-2">
                          <label className="block text-sm font-bold text-neutral-900">Senha</label>
                          {viewAuth === 'login' && <a href="#" className="text-xs text-neutral-500 underline">Esqueceu?</a>}
                        </div>
                        <input
                          type="password"
                          required
                          className="w-full p-4 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:border-neutral-900 transition-colors"
                          placeholder="••••••••"
                          value={authForm.senha}
                          onChange={(event) => setAuthForm((prev) => ({ ...prev, senha: event.target.value }))}
                        />
                      </div>
                      <button type="submit" className="w-full bg-neutral-900 text-white py-4 font-bold tracking-wide hover:bg-neutral-800 rounded-lg transition-transform active:scale-[0.99] shadow-lg">
                        {viewAuth === 'login' ? 'ENTRAR' : 'CRIAR CONTA'}
                      </button>
                    </form>
                    <div className="mt-6">
                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <span className="w-full border-t border-neutral-200" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                          <span className="bg-white px-2 text-neutral-500">Ou continue com</span>
                        </div>
                      </div>
                      <div className="mt-6 grid grid-cols-3 gap-3">
                        {[
                          { label: 'Google', handler: () => handleSocialLogin('Google') },
                          { label: 'Apple', handler: () => handleSocialLogin('Apple') },
                          { label: 'Facebook', handler: () => handleSocialLogin('Facebook') }
                        ].map((item) => (
                          <button key={item.label} type="button" onClick={item.handler} className="flex items-center justify-center w-full py-2.5 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors" title={item.label}>
                            {item.label}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="mt-8 text-center pt-8 border-t border-neutral-100">
                      <p className="text-neutral-500 mb-4">{viewAuth === 'login' ? 'Ainda não tem conta?' : 'Já tem uma conta?'}</p>
                      <button onClick={() => setViewAuth((prev) => (prev === 'login' ? 'cadastro' : 'login'))} className="text-neutral-900 font-bold border-b-2 border-neutral-900 pb-0.5 hover:text-neutral-700 hover:border-neutral-700 transition-colors">
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
                <button onClick={() => setCarrinhoAberto(false)} className="p-2 hover:bg-neutral-100 rounded-full transition-colors">
                  <X size={24} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 md:space-y-8">
                {carrinho.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-neutral-400 space-y-4">
                    <ShoppingBag size={64} className="opacity-10" />
                    <p className="text-lg font-medium text-neutral-500">Sua sacola está vazia</p>
                    <button onClick={() => setCarrinhoAberto(false)} className="text-neutral-900 font-bold border-b-2 border-neutral-900 hover:text-neutral-700 hover:border-neutral-700 pb-1">
                      Descobrir novidades
                    </button>
                  </div>
                ) : (
                  carrinho.map((item) => (
                    <div key={`${item.id}-${item.tamanho}`} className="flex gap-4 animate-fade-in">
                      <div className="h-24 w-20 md:h-28 md:w-24 flex-shrink-0 overflow-hidden rounded-md border border-neutral-100 bg-neutral-50">
                        <img
                          src={item.imagemSelecionada}
                          alt={item.nome}
                          className="h-full w-full object-cover object-center"
                        />
                      </div>
                      <div className="flex flex-1 flex-col justify-between py-1">
                        <div>
                          <div className="flex justify-between text-sm md:text-base font-medium text-neutral-900">
                            <h3 className="line-clamp-2 leading-tight pr-2">
                              <a href="#">{item.nome}</a>
                            </h3>
                            <p className="whitespace-nowrap">R$ {(item.preco * item.qtd).toFixed(2).replace('.', ',')}</p>
                          </div>
                          <p className="mt-1 text-xs md:text-sm text-neutral-500 capitalize">{item.categoria}</p>
                          <p className="text-[10px] md:text-xs font-bold text-neutral-400 mt-1 uppercase">Tam: {item.tamanho}</p>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center border border-neutral-200 rounded">
                            <button onClick={() => alterarQtd(item.id, item.tamanho, -1)} className="px-2 md:px-3 py-1 hover:bg-neutral-100 text-neutral-600 disabled:opacity-30" disabled={item.qtd <= 1}>
                              -
                            </button>
                            <span className="px-2 font-medium min-w-[1.5rem] text-center">{item.qtd}</span>
                            <button onClick={() => alterarQtd(item.id, item.tamanho, 1)} className="px-2 md:px-3 py-1 hover:bg-neutral-100 text-neutral-600">
                              +
                            </button>
                          </div>
                          <button type="button" onClick={() => removerDoCarrinho(item.id, item.tamanho)} className="text-xs font-medium text-neutral-400 underline hover:text-rose-500 transition-colors">
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
                    <p>R$ {totalValor.toFixed(2).replace('.', ',')}</p>
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
