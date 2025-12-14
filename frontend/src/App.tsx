import React, { type FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowRight,
  Check,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Eye,
  Facebook,
  Heart,
  Instagram,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  Package,
  Search,
  Send,
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
  imagens: string[];
  imagem: string;
  novo: boolean;
  tamanhos: string[];
  descricao: string;
  tags?: string[];
}

type CarrinhoItem = Produto & {
  qtd: number;
  tamanho: string;
  imagemSelecionada: string;
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

type ChatAuthor = 'bot' | 'user';

interface ChatMessage {
  tipo: ChatAuthor;
  texto: string;
}

const PRODUTOS: Produto[] = [
  {
    id: 1,
    nome: 'Vestido Longo Olive',
    preco: 289.9,
    categoria: 'vestidos',
    imagens: [
      'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&w=900&q=80'
    ],
    imagem: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=900&q=80',
    novo: true,
    tamanhos: ['PP', 'P', 'M', 'G'],
    descricao: 'Modelagem fluida em viscose premium com decote halter e cintura marcada.',
    tags: ['verde', 'viscose', 'fluidos']
  },
  {
    id: 2,
    nome: 'Chemise Linho Off',
    preco: 219.5,
    categoria: 'blusas',
    imagens: [
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80'
    ],
    imagem: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&q=80',
    novo: false,
    tamanhos: ['P', 'M', 'G', 'GG'],
    descricao: 'Linho certificado com botões em madrepérola e cinto-faixa removível.',
    tags: ['linho', 'chemise', 'off white']
  },
  {
    id: 3,
    nome: 'Calça Amélie Bege',
    preco: 310,
    categoria: 'calcas',
    imagens: [
      'https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1484328256245-34b717725f5b?auto=format&fit=crop&w=900&q=80'
    ],
    imagem: 'https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?auto=format&fit=crop&w=900&q=80',
    novo: false,
    tamanhos: ['36', '38', '40', '42'],
    descricao: 'Cintura alta, pregas frontais e barra levemente afunilada para alongar a silhueta.',
    tags: ['alfaiataria', 'bege', 'conforto']
  },
  {
    id: 4,
    nome: 'Blazer Trench Noite',
    preco: 459.9,
    categoria: 'casacos',
    imagens: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1504593811423-6dd665756598?auto=format&fit=crop&w=900&q=80'
    ],
    imagem: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80',
    novo: true,
    tamanhos: ['36', '38', '40', '42'],
    descricao: 'Tecido com toque acetinado, recortes estruturados e forro contrastante.',
    tags: ['blazer', 'sobretudo', 'noite']
  },
  {
    id: 5,
    nome: 'Vestido Soleil Bordado',
    preco: 339,
    categoria: 'vestidos',
    imagens: [
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=900&q=80'
    ],
    imagem: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=900&q=80',
    novo: true,
    tamanhos: ['PP', 'P', 'M', 'G'],
    descricao: 'Bordados à mão e decote coração inspirado na Riviera Francesa.',
    tags: ['bordado', 'verão', 'amarelo']
  },
  {
    id: 6,
    nome: 'Cardigã Nuage Cashmere',
    preco: 399.9,
    categoria: 'casacos',
    imagens: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80'
    ],
    imagem: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80',
    novo: false,
    tamanhos: ['P', 'M', 'G'],
    descricao: 'Cashmere sustentável com botões de resina e mangas volumosas.',
    tags: ['cashmere', 'macio', 'inverno']
  },
  {
    id: 7,
    nome: 'Blusa Aurora Seda',
    preco: 259.9,
    categoria: 'blusas',
    imagens: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1484328256245-34b717725f5b?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&q=80'
    ],
    imagem: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80',
    novo: false,
    tamanhos: ['PP', 'P', 'M', 'G'],
    descricao: 'Seda com leve brilho e laço removível para diferentes amarrações.',
    tags: ['seda', 'aurora', 'rosa']
  },
  {
    id: 8,
    nome: 'Saia Midi Horizon',
    preco: 199.9,
    categoria: 'calcas',
    imagens: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&q=80'
    ],
    imagem: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80',
    novo: false,
    tamanhos: ['34', '36', '38', '40'],
    descricao: 'Recortes arquitetônicos e pala interna para ajuste perfeito na cintura.',
    tags: ['saia', 'arquitetura', 'grafismo']
  }
];

const CATEGORIAS: Array<{ id: CategoriaId; nome: string; destaque?: string }> = [
  { id: 'todos', nome: 'Todas', destaque: 'Coleção completa' },
  { id: 'vestidos', nome: 'Vestidos', destaque: 'Silhuetas fluidas' },
  { id: 'blusas', nome: 'Blusas', destaque: 'Texturas leves' },
  { id: 'calcas', nome: 'Calças & Saias', destaque: 'Alfaiataria moderna' },
  { id: 'casacos', nome: 'Casacos', destaque: 'Camadas urbanas' }
];

const MENU_DESKTOP = ['NOVIDADES', 'COLEÇÃO', 'EDITORIAL', 'LIFESTYLE'];
const MENU_MOBILE = [...MENU_DESKTOP, 'CONTA', 'WISHLIST'];

const SHOP_FEATURES = [
  { icon: ShoppingBag, title: 'Envio Grátis', desc: 'Acima de R$ 299' },
  { icon: Star, title: 'Materiais Premium', desc: 'Com certificação' },
  { icon: ArrowRight, title: 'Troca Estendida', desc: '30 dias de conforto' }
];

const formatCurrency = (valor: number) => valor.toFixed(2).replace('.', ',');

const LuminaFashion = () => {
  const [carrinho, setCarrinho] = useState<CarrinhoItem[]>([]);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [carrinhoAberto, setCarrinhoAberto] = useState(false);
  const [menuMobileAberto, setMenuMobileAberto] = useState(false);
  const [categoriaAtiva, setCategoriaAtiva] = useState<CategoriaId>('todos');
  const [buscaAberta, setBuscaAberta] = useState(false);
  const [termoBusca, setTermoBusca] = useState('');
  const [notificacao, setNotificacao] = useState<string | null>(null);
  const [produtoQuickView, setProdutoQuickView] = useState<Produto | null>(null);
  const [indiceImagemAtiva, setIndiceImagemAtiva] = useState(0);
  const [tamanhoSelecionado, setTamanhoSelecionado] = useState<string | null>(null);
  const [emailNewsletter, setEmailNewsletter] = useState('');
  const [newsletterSucesso, setNewsletterSucesso] = useState(false);
  const [userMenuAberto, setUserMenuAberto] = useState(false);
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [viewAuth, setViewAuth] = useState<AuthView>('login');
  const [authForm, setAuthForm] = useState<AuthFormState>({ nome: '', email: '', senha: '' });
  const [chatAberto, setChatAberto] = useState(false);
  const [chatMensagem, setChatMensagem] = useState('');
  const [historicoChat, setHistoricoChat] = useState<ChatMessage[]>([
    { tipo: 'bot', texto: 'Olá! Bem-vinda à Lumina. Como posso ajudar você hoje?' }
  ]);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!notificacao) {
      return undefined;
    }
    const timeout = window.setTimeout(() => setNotificacao(null), 3200);
    return () => window.clearTimeout(timeout);
  }, [notificacao]);

  useEffect(() => {
    if (chatAberto && chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatAberto, historicoChat]);

  const produtosFiltrados = useMemo(() => {
    const termo = termoBusca.trim().toLowerCase();
    return PRODUTOS.filter((produto) => {
      const passaCategoria = categoriaAtiva === 'todos' || produto.categoria === categoriaAtiva;
      if (!termo) {
        return passaCategoria;
      }
      const campoBusca = `${produto.nome} ${produto.descricao} ${produto.tags?.join(' ') ?? ''}`.toLowerCase();
      return passaCategoria && campoBusca.includes(termo);
    });
  }, [categoriaAtiva, termoBusca]);

  const totalItens = carrinho.reduce((acc, item) => acc + item.qtd, 0);
  const totalValor = carrinho.reduce((acc, item) => acc + item.preco * item.qtd, 0);

  const mostrarNotificacao = (mensagem: string) => {
    setNotificacao(mensagem);
  };

  const adicionarAoCarrinho = (produto: Produto, options?: { tamanho?: string | null; imagem?: string }) => {
    const tamanhoFinal = options?.tamanho ?? produto.tamanhos[0];
    const imagemSelecionada = options?.imagem ?? produto.imagens[0] ?? produto.imagem;

    setCarrinho((prev) => {
      const existente = prev.find((item) => item.id === produto.id && item.tamanho === tamanhoFinal && item.imagemSelecionada === imagemSelecionada);
      if (existente) {
        return prev.map((item) =>
          item.id === produto.id && item.tamanho === tamanhoFinal && item.imagemSelecionada === imagemSelecionada
            ? { ...item, qtd: item.qtd + 1 }
            : item
        );
      }
      return [...prev, { ...produto, qtd: 1, tamanho: tamanhoFinal, imagemSelecionada }];
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

  const removerDoCarrinho = (id: number, tamanho: string, imagem: string) => {
    setCarrinho((prev) => prev.filter((item) => !(item.id === id && item.tamanho === tamanho && item.imagemSelecionada === imagem)));
  };

  const alterarQtd = (id: number, tamanho: string, imagem: string, delta: number) => {
    setCarrinho((prev) =>
      prev.map((item) => {
        if (item.id === id && item.tamanho === tamanho && item.imagemSelecionada === imagem) {
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
      setUsuario({ nome: 'Visitante Lumina', email: authForm.email });
      mostrarNotificacao('Bem-vinda novamente!');
    } else {
      setUsuario({ nome: authForm.nome || 'Cliente Lumina', email: authForm.email });
      mostrarNotificacao('Conta criada com sucesso!');
    }

    setAuthForm({ nome: '', email: '', senha: '' });
  };

  const handleSocialLogin = (provider: 'Google' | 'Apple' | 'Facebook') => {
    setUsuario({ nome: `Usuário ${provider}`, email: `cliente@${provider.toLowerCase()}.com` });
    setViewAuth('login');
    mostrarNotificacao(`Login com ${provider} realizado!`);
  };

  const handleLogout = () => {
    setUsuario(null);
    setViewAuth('login');
    mostrarNotificacao('Sessão encerrada');
  };

  const handleNewsletterSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!emailNewsletter) {
      return;
    }
    setNewsletterSucesso(true);
    setEmailNewsletter('');
    window.setTimeout(() => setNewsletterSucesso(false), 4500);
  };

  const handleEnviarMensagemChat = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const mensagemLimpa = chatMensagem.trim();
    if (!mensagemLimpa) {
      return;
    }

    const novaMensagem: ChatMessage = { tipo: 'user', texto: mensagemLimpa };
    setHistoricoChat((prev) => [...prev, novaMensagem]);
    setChatMensagem('');

    window.setTimeout(() => {
      setHistoricoChat((prev) => [
        ...prev,
        {
          tipo: 'bot',
          texto: 'Já localizei uma stylist disponível. Enquanto isso, posso sugerir peças que combinem com o que você procura.'
        }
      ]);
    }, 1200);
  };

  const abrirQuickView = (produto: Produto) => {
    setProdutoQuickView(produto);
    setIndiceImagemAtiva(0);
    setTamanhoSelecionado(produto.tamanhos[0]);
  };

  const navegarGaleria = (direcao: 'prev' | 'next') => {
    if (!produtoQuickView) {
      return;
    }
    setIndiceImagemAtiva((prev) => {
      const total = produtoQuickView.imagens.length;
      if (direcao === 'next') {
        return (prev + 1) % total;
      }
      return (prev - 1 + total) % total;
    });
  };

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      {notificacao && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 md:left-auto md:right-6 md:translate-x-0 bg-neutral-900 text-white px-6 py-3 rounded-full shadow-xl z-50 flex items-center gap-2 animate-fade-in-down">
          <Check size={14} />
          <span className="text-sm font-medium">{notificacao}</span>
        </div>
      )}

      <nav className="fixed w-full bg-white z-40 border-b border-neutral-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            <div className="flex items-center gap-3">
              <button
                className="p-2 -ml-2 hover:bg-neutral-100 rounded-full md:hidden"
                onClick={() => setMenuMobileAberto((prev) => !prev)}
                aria-label="Abrir menu"
              >
                <Menu size={22} />
              </button>
              <a href="#" className="text-2xl font-serif font-bold tracking-tight">LUMINA</a>
            </div>

            <div className="hidden md:flex gap-8 text-sm tracking-wide text-neutral-500">
              {MENU_DESKTOP.map((item) => (
                <button key={item} className="relative group" type="button">
                  <span className="font-medium">{item}</span>
                  <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-neutral-900 transition-all group-hover:w-full" />
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1 md:gap-3">
              <div className="relative">
                <button
                  className={`p-2 rounded-full transition-colors ${buscaAberta ? 'bg-neutral-900 text-white' : 'hover:bg-neutral-100 text-neutral-600'}`}
                  onClick={() => setBuscaAberta((prev) => !prev)}
                  aria-label="Buscar produtos"
                >
                  <Search size={20} />
                </button>

                <div
                  className={`absolute right-0 mt-2 w-[80vw] max-w-md bg-white border border-neutral-100 rounded-2xl shadow-2xl p-5 transition-all duration-200 ${
                    buscaAberta ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-2 pointer-events-none'
                  }`}
                >
                  <p className="text-[11px] font-semibold tracking-[0.3em] text-neutral-400 mb-3 uppercase">Buscar</p>
                  <div className="flex items-center gap-2 bg-neutral-50 border border-neutral-200 rounded-full px-4 py-2">
                    <Search size={16} className="text-neutral-400" />
                    <input
                      type="text"
                      value={termoBusca}
                      onChange={(event) => setTermoBusca(event.target.value)}
                      placeholder="o que você procura?"
                      className="flex-1 bg-transparent text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none"
                    />
                    {termoBusca && (
                      <button type="button" onClick={() => setTermoBusca('')} className="text-xs text-neutral-400 hover:text-neutral-700">
                        limpar
                      </button>
                    )}
                  </div>
                  <div className="mt-4 text-xs text-neutral-400">{produtosFiltrados.length} resultados curados</div>
                </div>
              </div>

              <button
                className="p-2 hover:bg-neutral-100 rounded-full text-neutral-600"
                onClick={() => setUserMenuAberto(true)}
                aria-label={usuario ? 'Abrir conta' : 'Entrar'}
              >
                <User size={20} />
              </button>

              <div className="relative">
                <button
                  className="p-2 hover:bg-neutral-100 rounded-full text-neutral-600"
                  onClick={() => setCarrinhoAberto(true)}
                  aria-label="Abrir sacola"
                >
                  <ShoppingBag size={20} />
                  {totalItens > 0 && (
                    <span className="absolute top-1 right-1 inline-flex items-center justify-center w-4 h-4 text-[10px] font-bold text-white bg-neutral-900 rounded-full border border-white">
                      {totalItens}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {menuMobileAberto && (
          <div className="fixed inset-0 top-16 z-30 bg-white md:hidden border-t border-neutral-100 animate-fade-in flex flex-col">
            <div className="p-6 space-y-4">
              <div className="bg-neutral-100 rounded-full px-4 py-2 flex items-center gap-2">
                <Search size={18} className="text-neutral-500" />
                <input
                  type="text"
                  value={termoBusca}
                  onChange={(event) => setTermoBusca(event.target.value)}
                  placeholder="Busque na coleção"
                  className="flex-1 bg-transparent text-sm focus:outline-none"
                />
              </div>
              {MENU_MOBILE.map((item) => (
                <button
                  key={item}
                  type="button"
                  className="flex items-center justify-between py-4 text-lg font-serif border-b border-neutral-100"
                  onClick={() => {
                    if (item === 'CONTA') {
                      setUserMenuAberto(true);
                    }
                    setMenuMobileAberto(false);
                  }}
                >
                  {item}
                  <ChevronRight size={16} className="text-neutral-300" />
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>

      <div className="relative pt-16 md:pt-20">
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent z-10 pointer-events-none" />
        <div
          className="h-[60vh] md:h-[80vh] bg-cover bg-center flex items-center"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=2000')"
          }}
        >
          <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
            <div className="max-w-lg text-white space-y-6">
              <span className="inline-flex items-center gap-2 text-[10px] tracking-[0.4em] font-semibold uppercase">
                <span className="w-2 h-2 bg-white rounded-full" /> verao 25 • drop ii
              </span>
              <h1 className="text-4xl md:text-6xl font-serif font-bold leading-tight">Manifesto da pele descansada</h1>
              <p className="text-sm md:text-lg text-white/80">
                Peças que respiram, inspiradas nas margens mediterrâneas. Curadoria autoral com tons minerais e texturas sensoriais.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button className="bg-white text-neutral-900 px-8 py-3 text-xs md:text-sm font-bold tracking-[0.3em] hover:bg-neutral-100 transition-all">
                  explorar cápsula
                </button>
                <button className="border border-white/40 text-white px-8 py-3 text-xs md:text-sm font-bold tracking-[0.3em] hover:bg-white hover:text-neutral-900 transition-all">
                  assistir editorial
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        <div className="bg-white rounded-3xl border border-neutral-100 shadow-sm p-6 md:p-10 -mt-16 md:-mt-24 relative z-20 space-y-8">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex-1">
              <p className="text-sm tracking-[0.2em] text-neutral-500 uppercase mb-3 font-semibold">Curadoria rápida</p>
              <div className="flex gap-2 flex-wrap">
                {CATEGORIAS.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setCategoriaAtiva(cat.id)}
                    className={`px-5 py-2.5 rounded-full text-base border transition-all ${
                      categoriaAtiva === cat.id ? 'bg-neutral-900 text-white border-neutral-900 shadow-lg shadow-neutral-900/10' : 'border-neutral-200 text-neutral-500 hover:border-neutral-400'
                    }`}
                  >
                    <span className="font-semibold mr-2">{cat.nome}</span>
                    <span className="text-xs text-neutral-500 hidden sm:inline">{cat.destaque}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between w-full md:w-auto gap-4 text-sm text-neutral-600 uppercase tracking-[0.2em]">
              <span>{produtosFiltrados.length} Peças</span>
              <span>Linho • Seda • Denim</span>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-3 gap-y-8 md:gap-8">
            {produtosFiltrados.map((produto) => {
              const imagemPrincipal = produto.imagens[0] ?? produto.imagem;
              return (
                <div key={produto.id} className="group">
                  <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-neutral-100 shadow-sm">
                    <img
                      src={imagemPrincipal}
                      alt={produto.nome}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105 cursor-pointer"
                      onClick={() => abrirQuickView(produto)}
                    />
                    {produto.novo && (
                      <span className="absolute top-4 left-4 bg-white text-neutral-900 text-[10px] font-bold tracking-[0.4em] px-3 py-1 rounded-full">
                        novo
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        toggleWishlist(produto.id);
                      }}
                      className={`absolute top-4 right-4 p-2 bg-white rounded-full shadow-md transition-colors ${
                        wishlist.includes(produto.id) ? 'text-rose-500' : 'text-neutral-900'
                      }`}
                      aria-label="Favoritar"
                    >
                      <Heart size={18} className={wishlist.includes(produto.id) ? 'fill-rose-500' : undefined} />
                    </button>
                    <div className="hidden md:flex absolute inset-x-4 bottom-4 gap-3 opacity-0 group-hover:opacity-100 translate-y-3 group-hover:translate-y-0 transition-all">
                      <button
                        onClick={(event) => {
                          event.stopPropagation();
                          abrirQuickView(produto);
                        }}
                        className="flex-1 bg-white/95 backdrop-blur text-neutral-900 py-3 text-sm font-semibold rounded-lg flex items-center justify-center gap-2"
                      >
                        <Eye size={16} /> ver detalhes
                      </button>
                      <button
                        onClick={(event) => {
                          event.stopPropagation();
                          adicionarAoCarrinho(produto);
                        }}
                        className="p-3 rounded-lg bg-neutral-900 text-white"
                        aria-label="Adicionar rápido"
                      >
                        <ShoppingBag size={16} />
                      </button>
                    </div>
                  </div>
                  <div className="mt-3 space-y-1">
                    <div className="flex items-center justify-between text-xs uppercase tracking-[0.2em] text-neutral-500">
                      <span>{produto.categoria}</span>
                      <span>{produto.tamanhos.join(' • ')}</span>
                    </div>
                    <h3 className="font-serif text-xl font-semibold text-neutral-900" onClick={() => abrirQuickView(produto)}>
                      {produto.nome}
                    </h3>
                    <p className="text-base text-neutral-600 line-clamp-2">{produto.descricao}</p>
                    <div className="flex items-center justify-between pt-2">
                      <span className="text-lg font-bold">R$ {formatCurrency(produto.preco)}</span>
                      <button
                        type="button"
                        className="text-xs font-semibold tracking-[0.3em] uppercase"
                        onClick={() => adicionarAoCarrinho(produto)}
                      >
                        adicionar
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          {SHOP_FEATURES.map((feature) => {
            const Icon = feature.icon;
            return (
              <div key={feature.title} className="p-6 bg-white rounded-2xl border border-neutral-100 shadow-sm hover:-translate-y-1 transition-transform">
                <div className="w-12 h-12 rounded-full bg-neutral-900 text-white flex items-center justify-center mb-4">
                  <Icon size={20} />
                </div>
                <h3 className="text-lg font-semibold mb-1">{feature.title}</h3>
                <p className="text-sm text-neutral-500">{feature.desc}</p>
              </div>
            );
          })}
        </div>
      </main>

      {produtoQuickView && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-0 md:p-6">
          <div className="absolute inset-0 bg-black/60" onClick={() => setProdutoQuickView(null)} />
          <div className="relative bg-white rounded-none md:rounded-3xl overflow-hidden shadow-2xl w-full max-w-5xl grid md:grid-cols-2">
            <button
              className="absolute top-4 left-4 bg-white/90 text-neutral-900 rounded-full px-4 py-2 flex items-center gap-2 shadow md:hidden"
              onClick={() => setProdutoQuickView(null)}
              aria-label="Voltar para início"
            >
              <ChevronLeft size={18} />
              <span className="text-sm font-semibold">voltar</span>
            </button>
            <button className="absolute top-4 right-4 bg-white/90 rounded-full w-11 h-11 flex items-center justify-center shadow" onClick={() => setProdutoQuickView(null)} aria-label="Fechar">
              <X size={22} />
            </button>

            <div className="relative bg-neutral-100">
              <img
                src={produtoQuickView.imagens[indiceImagemAtiva]}
                alt={produtoQuickView.nome}
                className="w-full h-[50vh] md:h-full object-cover"
              />
              <button
                type="button"
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2"
                onClick={() => navegarGaleria('prev')}
                aria-label="Imagem anterior"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                type="button"
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2"
                onClick={() => navegarGaleria('next')}
                aria-label="Próxima imagem"
              >
                <ChevronRight size={20} />
              </button>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {produtoQuickView.imagens.map((imagem, index) => (
                  <button
                    key={imagem}
                    type="button"
                    onClick={() => setIndiceImagemAtiva(index)}
                    className={`w-3 h-3 rounded-full border border-white ${index === indiceImagemAtiva ? 'bg-white' : 'bg-white/50'}`}
                  />
                ))}
              </div>
            </div>

            <div className="p-6 md:p-10 flex flex-col">
              <span className="text-[11px] tracking-[0.4em] text-neutral-400 uppercase">{produtoQuickView.categoria}</span>
              <h2 className="text-3xl font-serif font-semibold mt-3">{produtoQuickView.nome}</h2>
              <p className="text-2xl font-semibold mt-2">R$ {formatCurrency(produtoQuickView.preco)}</p>
              <p className="text-sm text-neutral-500 mt-4 leading-relaxed">{produtoQuickView.descricao}</p>

              <div className="mt-6">
                <div className="flex items-center justify-between text-sm font-semibold text-neutral-600">
                  <span>Tamanhos</span>
                  <button type="button" className="text-xs underline">
                    Guia de medidas
                  </button>
                </div>
                <div className="flex gap-3 mt-3">
                  {produtoQuickView.tamanhos.map((tamanho) => (
                    <button
                      key={tamanho}
                      onClick={() => setTamanhoSelecionado(tamanho)}
                      className={`w-12 h-12 border rounded-xl text-sm font-semibold transition-all ${
                        tamanhoSelecionado === tamanho ? 'bg-neutral-900 text-white border-neutral-900' : 'border-neutral-200'
                      }`}
                    >
                      {tamanho}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-8 flex gap-3">
                <button
                  className="flex-1 bg-neutral-900 text-white py-4 rounded-xl font-semibold tracking-[0.3em]"
                  onClick={() =>
                    adicionarAoCarrinho(produtoQuickView, {
                      tamanho: tamanhoSelecionado,
                      imagem: produtoQuickView.imagens[indiceImagemAtiva]
                    })
                  }
                >
                  adicionar
                </button>
                <button
                  type="button"
                  onClick={() => toggleWishlist(produtoQuickView.id)}
                  className={`w-14 rounded-xl border flex items-center justify-center ${
                    wishlist.includes(produtoQuickView.id)
                      ? 'border-rose-200 bg-rose-50 text-rose-500'
                      : 'border-neutral-200 text-neutral-600'
                  }`}
                >
                  <Heart size={20} className={wishlist.includes(produtoQuickView.id) ? 'fill-rose-500' : undefined} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <footer className="bg-neutral-900 text-white pt-16 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            <div>
              <h3 className="text-3xl font-serif font-semibold mb-4">Lumina</h3>
              <p className="text-sm text-neutral-400">
                Moda consciente criada em pequenas tiragens. Experiências personalizadas e peças com desenho afetivo.
              </p>
              <div className="flex gap-4 mt-6 text-neutral-400">
                <Instagram size={20} className="hover:text-white" />
                <Facebook size={20} className="hover:text-white" />
                <Twitter size={20} className="hover:text-white" />
              </div>
            </div>

            <div>
              <h4 className="text-xs tracking-[0.4em] uppercase text-neutral-400 mb-4">Loja</h4>
              <ul className="space-y-2 text-neutral-200 text-sm">
                {['Novidades', 'Coleções', 'Atelier', 'Presentes', 'Editorial'].map((item) => (
                  <li key={item}>
                    <a href="#" className="hover:text-white">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-xs tracking-[0.4em] uppercase text-neutral-400 mb-4">Atendimento</h4>
              <ul className="space-y-2 text-neutral-200 text-sm">
                {['Suporte 24h', 'Trocas', 'Guia de cuidados', 'Clube Lumina'].map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-xs tracking-[0.4em] uppercase text-neutral-400 mb-4">Newsletter</h4>
              {newsletterSucesso ? (
                <div className="bg-emerald-900/40 border border-emerald-800 text-emerald-100 px-4 py-3 rounded-xl flex items-center gap-2">
                  <Check size={16} /> inscrita!
                </div>
              ) : (
                <form onSubmit={handleNewsletterSubmit} className="space-y-3">
                  <div className="relative">
                    <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                    <input
                      type="email"
                      value={emailNewsletter}
                      onChange={(event) => setEmailNewsletter(event.target.value)}
                      placeholder="seu@email.com"
                      className="w-full bg-neutral-800 text-sm rounded-full pl-10 pr-4 py-3 border border-neutral-700 focus:outline-none"
                      required
                    />
                  </div>
                  <button type="submit" className="w-full bg-white text-neutral-900 py-3 rounded-full text-sm font-semibold">
                    receber convites
                  </button>
                </form>
              )}
            </div>
          </div>
          <div className="mt-12 border-t border-white/10 pt-6 text-xs text-neutral-500 flex flex-col md:flex-row justify-between">
            <span>© 2025 Lumina Studio</span>
            <span>Feito no Brasil com fibras certificadas</span>
          </div>
        </div>
      </footer>

      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-4">
        {chatAberto && (
          <div className="w-80 h-96 bg-white rounded-2xl shadow-2xl border border-neutral-100 flex flex-col overflow-hidden">
            <div className="bg-neutral-900 text-white px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-sm font-semibold">Suporte Lumina</span>
              </div>
              <button type="button" onClick={() => setChatAberto(false)} aria-label="Fechar chat">
                <X size={16} />
              </button>
            </div>
            <div className="flex-1 p-4 space-y-3 overflow-y-auto bg-neutral-50">
              {historicoChat.map((mensagem, index) => (
                <div key={`chat-${index}`} className={`flex ${mensagem.tipo === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${
                      mensagem.tipo === 'user'
                        ? 'bg-neutral-900 text-white rounded-br-none'
                        : 'bg-white text-neutral-700 border border-neutral-100 rounded-bl-none'
                    }`}
                  >
                    {mensagem.texto}
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>
            <form onSubmit={handleEnviarMensagemChat} className="p-3 border-t border-neutral-100 flex gap-2">
              <input
                type="text"
                value={chatMensagem}
                onChange={(event) => setChatMensagem(event.target.value)}
                placeholder="Compartilhe sua dúvida"
                className="flex-1 bg-neutral-100 rounded-full px-4 py-2 text-sm focus:outline-none"
              />
              <button type="submit" className="bg-neutral-900 text-white rounded-full w-10 h-10 flex items-center justify-center disabled:opacity-40" disabled={!chatMensagem.trim()}>
                <Send size={16} />
              </button>
            </form>
          </div>
        )}

        <button
          type="button"
          onClick={() => setChatAberto((prev) => !prev)}
          className="bg-neutral-900 text-white w-14 h-14 rounded-full shadow-2xl flex items-center justify-center"
          aria-label={chatAberto ? 'Fechar chat' : 'Abrir chat'}
        >
          {chatAberto ? <X size={22} /> : <MessageCircle size={22} />}
        </button>
      </div>

      {userMenuAberto && (
        <div className="fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black/40" onClick={() => setUserMenuAberto(false)} />
          <div className="absolute inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl flex flex-col animate-slide-in-right">
            <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-100">
              <h2 className="text-xl font-serif font-semibold">{usuario ? `Olá, ${usuario.nome}` : viewAuth === 'login' ? 'Entrar' : 'Criar conta'}</h2>
              <button onClick={() => setUserMenuAberto(false)} aria-label="Fechar painel">
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              {usuario ? (
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-500">
                      <User size={28} />
                    </div>
                    <div>
                      <p className="font-semibold">{usuario.nome}</p>
                      <p className="text-sm text-neutral-500">{usuario.email}</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {[{ label: 'Meus pedidos', icon: Package }, { label: 'Lista de desejos', icon: Heart }, { label: 'Endereços salvos', icon: MapPin }, { label: 'Cartões', icon: CreditCard }, { label: 'Preferências', icon: Settings }].map((item) => {
                      const Icon = item.icon;
                      return (
                        <button key={item.label} type="button" className="w-full flex items-center justify-between px-4 py-3 bg-neutral-50 rounded-xl">
                          <div className="flex items-center gap-3 text-neutral-600">
                            <Icon size={18} />
                            <span className="font-medium">{item.label}</span>
                          </div>
                          <ChevronRight size={16} className="text-neutral-300" />
                        </button>
                      );
                    })}
                  </div>
                  <button type="button" onClick={handleLogout} className="w-full text-center py-3 rounded-xl bg-neutral-900 text-white font-semibold">
                    sair
                  </button>
                </div>
              ) : (
                <div>
                  <form onSubmit={handleAuthSubmit} className="space-y-4">
                    {viewAuth === 'cadastro' && (
                      <div>
                        <label className="text-sm font-semibold text-neutral-600">Nome completo</label>
                        <input
                          type="text"
                          className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 mt-1"
                          value={authForm.nome}
                          onChange={(event) => atualizarAuthForm('nome', event.target.value)}
                          required
                        />
                      </div>
                    )}
                    <div>
                      <label className="text-sm font-semibold text-neutral-600">E-mail</label>
                      <input
                        type="email"
                        className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 mt-1"
                        value={authForm.email}
                        onChange={(event) => atualizarAuthForm('email', event.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <div className="flex items-center justify-between text-sm font-semibold text-neutral-600">
                        <label>Senha</label>
                        {viewAuth === 'login' && <button type="button" className="text-[11px] underline text-neutral-400">Esqueceu?</button>}
                      </div>
                      <input
                        type="password"
                        className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 mt-1"
                        value={authForm.senha}
                        onChange={(event) => atualizarAuthForm('senha', event.target.value)}
                        required
                      />
                    </div>
                    <button type="submit" className="w-full bg-neutral-900 text-white py-3 rounded-xl font-semibold">
                      {viewAuth === 'login' ? 'entrar' : 'Criar conta'}
                    </button>
                  </form>
                  <div className="mt-6">
                    <div className="text-center text-xs text-neutral-400 uppercase tracking-[0.4em]">ou</div>
                    <div className="grid grid-cols-3 gap-3 mt-4">
                      {[
                        { label: 'Google', handler: () => handleSocialLogin('Google') },
                        { label: 'Apple', handler: () => handleSocialLogin('Apple') },
                        { label: 'Facebook', handler: () => handleSocialLogin('Facebook') }
                      ].map((item) => (
                        <button key={item.label} type="button" onClick={item.handler} className="border border-neutral-200 rounded-xl py-2 text-sm">
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="mt-6 text-center text-sm text-neutral-500">
                    {viewAuth === 'login' ? 'Ainda sem conta?' : 'Já faz parte?'}
                    <button
                      type="button"
                      onClick={() => setViewAuth((prev) => (prev === 'login' ? 'cadastro' : 'login'))}
                      className="ml-2 font-semibold"
                    >
                      {viewAuth === 'login' ? 'Criar agora' : 'Entrar'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {carrinhoAberto && (
        <div className="fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black/50" onClick={() => setCarrinhoAberto(false)} />
          <div className="absolute inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl flex flex-col animate-slide-in-right">
            <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-100">
              <h2 className="text-xl font-serif font-semibold">Sua sacola ({totalItens})</h2>
              <button onClick={() => setCarrinhoAberto(false)} aria-label="Fechar sacola">
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              {carrinho.length === 0 ? (
                <div className="text-center text-neutral-400 py-20">
                  <ShoppingBag size={48} className="mx-auto mb-4 opacity-30" />
                  Sua curadoria ainda está vazia
                </div>
              ) : (
                carrinho.map((item) => (
                  <div key={`${item.id}-${item.tamanho}-${item.imagemSelecionada}`} className="flex gap-4">
                    <div className="w-24 h-28 rounded-xl overflow-hidden bg-neutral-50">
                      <img src={item.imagemSelecionada} alt={item.nome} className="h-full w-full object-cover" />
                    </div>
                    <div className="flex-1 text-sm">
                      <div className="flex justify-between font-semibold">
                        <span className="pr-4">{item.nome}</span>
                        <span>R$ {formatCurrency(item.preco * item.qtd)}</span>
                      </div>
                      <p className="text-neutral-400 text-xs mt-1 uppercase tracking-[0.3em]">{item.categoria}</p>
                      <p className="text-neutral-500 text-xs mt-1">tamanho {item.tamanho}</p>
                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-center border border-neutral-200 rounded-full">
                          <button
                            className="px-3 py-1"
                            onClick={() => alterarQtd(item.id, item.tamanho, item.imagemSelecionada, -1)}
                            disabled={item.qtd <= 1}
                          >
                            -
                          </button>
                          <span className="px-4">{item.qtd}</span>
                          <button className="px-3 py-1" onClick={() => alterarQtd(item.id, item.tamanho, item.imagemSelecionada, 1)}>
                            +
                          </button>
                        </div>
                        <button
                          type="button"
                          className="text-xs text-neutral-400 underline"
                          onClick={() => removerDoCarrinho(item.id, item.tamanho, item.imagemSelecionada)}
                        >
                          remover
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            {carrinho.length > 0 && (
              <div className="border-t border-neutral-100 p-6 space-y-3">
                <div className="flex justify-between text-base font-semibold">
                  <span>Subtotal</span>
                  <span>R$ {formatCurrency(totalValor)}</span>
                </div>
                <p className="text-xs text-neutral-400">Frete e impostos calculados no checkout.</p>
                <button className="w-full bg-neutral-900 text-white py-4 rounded-xl font-semibold tracking-[0.3em]">Finalizar compra</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LuminaFashion;
