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
  X,
  Star,
  Sparkles,
  Smile,
  Sun,
  Cloud
} from 'lucide-react';

// Tipos adaptados para infantil
type CategoriaId = 'todos' | 'vestidos' | 'conjuntos' | 'basicos' | 'festa';

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

// DADOS DE PRODUTOS INFANTIS (FEMININO) - Links Atualizados e Verificados
const PRODUTOS: Produto[] = [
  {
    id: 1,
    nome: 'Vestido Jardim Encantado',
    preco: 149.90,
    categoria: 'vestidos',
    imagens: [
      'https://images.unsplash.com/photo-1519457431-44ccd64a579b?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1606323528256-429994c965c7?auto=format&fit=crop&q=80&w=800',
    ],
    imagem: 'https://images.unsplash.com/photo-1519457431-44ccd64a579b?auto=format&fit=crop&q=80&w=800',
    novo: true,
    tamanhos: ['4', '6', '8', '10'],
    descricao: 'Perfeito para girar! Vestido em algodão macio com estampa floral delicada e saia rodada para total liberdade de movimentos.'
  },
  {
    id: 2,
    nome: 'Conjunto Diversão Colorida',
    preco: 98.00,
    categoria: 'conjuntos',
    imagens: [
      'https://images.unsplash.com/photo-1604467794349-0b74285de7e7?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1522771930-78848d9293e8?auto=format&fit=crop&q=80&w=800'
    ],
    imagem: 'https://images.unsplash.com/photo-1604467794349-0b74285de7e7?auto=format&fit=crop&q=80&w=800',
    novo: false,
    tamanhos: ['2', '4', '6', '8'],
    descricao: 'Para brincar o dia todo. Camiseta de algodão orgânico e shortinho confortável com elástico na cintura.'
  },
  {
    id: 3,
    nome: 'Jardineira Jeans Mini',
    preco: 129.90,
    categoria: 'basicos',
    imagens: [
      'https://images.unsplash.com/photo-1519457431-44ccd64a579b?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1519238263496-61437aeb1134?auto=format&fit=crop&q=80&w=800'
    ],
    imagem: 'https://images.unsplash.com/photo-1519457431-44ccd64a579b?auto=format&fit=crop&q=80&w=800',
    novo: true,
    tamanhos: ['2', '4', '6', '8', '10'],
    descricao: 'Um clássico cheio de estilo. Jeans macio com lavagem clara, botões de pressão e bolsinhos para guardar tesouros.'
  },
  {
    id: 4,
    nome: 'Vestido Festa de Tule',
    preco: 199.00,
    categoria: 'festa',
    imagens: [
      'https://images.unsplash.com/photo-1632193245229-44677760742a?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1503919005314-30d93d07d823?auto=format&fit=crop&q=80&w=800'
    ],
    imagem: 'https://images.unsplash.com/photo-1632193245229-44677760742a?auto=format&fit=crop&q=80&w=800',
    novo: true,
    tamanhos: ['4', '6', '8', '10', '12'],
    descricao: 'Para as ocasiões especiais. Camadas de tule macio com brilhos discretos, digno de uma verdadeira princesa moderna.'
  },
  {
    id: 5,
    nome: 'Casaco Teddy Bear',
    preco: 159.90,
    categoria: 'basicos',
    imagens: [
      'https://images.unsplash.com/photo-1520466809213-7b9a56adcd45?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1514050290518-2e06c710d48a?auto=format&fit=crop&q=80&w=800'
    ],
    imagem: 'https://images.unsplash.com/photo-1520466809213-7b9a56adcd45?auto=format&fit=crop&q=80&w=800',
    novo: false,
    tamanhos: ['2', '4', '6', '8'],
    descricao: 'O abraço mais quentinho! Casaco em material sintético estilo pelúcia, com orelhinhas no capuz.'
  },
  {
    id: 6,
    nome: 'Legging Conforto',
    preco: 59.90,
    categoria: 'basicos',
    imagens: [
      'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1617331566395-568b244bbd29?auto=format&fit=crop&q=80&w=800'
    ],
    imagem: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&q=80&w=800',
    novo: false,
    tamanhos: ['2', '4', '6', '8', '10'],
    descricao: 'Conforto total para correr e pular. Tecido com elastano que não restringe os movimentos.'
  },
  {
    id: 7,
    nome: 'Blusa Gola Boneca',
    preco: 79.90,
    categoria: 'conjuntos',
    imagens: [
      'https://images.unsplash.com/photo-1515516089376-88db1e26e9c0?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1471286174890-9c112ffca5b4?auto=format&fit=crop&q=80&w=800'
    ],
    imagem: 'https://images.unsplash.com/photo-1515516089376-88db1e26e9c0?auto=format&fit=crop&q=80&w=800',
    novo: false,
    tamanhos: ['4', '6', '8', '10'],
    descricao: 'Charme retrô. Blusa em tecido leve com gola boneca bordada, perfeita para compor looks arrumadinhos.'
  },
  {
    id: 8,
    nome: 'Sapatilha Bailarina',
    preco: 89.90,
    categoria: 'festa',
    imagens: [
      'https://images.unsplash.com/photo-1519417688547-61e5d5338ab0?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1547449576-903df886b761?auto=format&fit=crop&q=80&w=800'
    ],
    imagem: 'https://images.unsplash.com/photo-1519417688547-61e5d5338ab0?auto=format&fit=crop&q=80&w=800',
    novo: false,
    tamanhos: ['24', '26', '28', '30'],
    descricao: 'Para os pezinhos dançantes. Sapatilha confortável com fita de cetim e acabamento metalizado suave.'
  }
];

const CATEGORIAS: Array<{ id: CategoriaId; nome: string }> = [
  { id: 'todos', nome: 'Todas' },
  { id: 'vestidos', nome: 'Vestidos' },
  { id: 'conjuntos', nome: 'Conjuntos' },
  { id: 'basicos', nome: 'Dia a Dia' },
  { id: 'festa', nome: 'Festas & Eventos' }
];

const LuminaKids = () => {
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
    { tipo: 'bot', texto: 'Olá mamãe ou papai! Bem-vindos à Lumina Kids. Precisa de ajuda para escolher o tamanho ideal?' }
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
  const [heroAnimation, setHeroAnimation] = useState(false);

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

  useEffect(() => {
    // Dispara a animação do banner ao carregar (mais suave agora)
    const timer = setTimeout(() => {
      setHeroAnimation(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (menuMobileAberto) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuMobileAberto]);

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
          texto: 'Adoramos sua mensagem! Nossa fada madrinha do atendimento responderá em breve. Enquanto isso, veja nossas promoções de conjuntos!'
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
    <div className="min-h-screen bg-[#FDFBF7] font-sans text-neutral-800 selection:bg-rose-200 selection:text-rose-900 overflow-x-hidden">
      {notificacao && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 md:left-auto md:translate-x-0 md:right-4 bg-rose-400 text-white px-6 py-4 rounded-3xl shadow-xl z-50 animate-fade-in-down flex items-center gap-3 w-[90%] md:w-auto justify-center md:justify-start">
          <div className="bg-white/20 p-1 rounded-full">
            <Check size={14} />
          </div>
          <span className="text-sm font-medium whitespace-nowrap">{notificacao}</span>
        </div>
      )}

      {/* NAV - Acolhedora e Limpa */}
      <nav className="fixed w-full bg-[#FDFBF7]/95 backdrop-blur-md z-40 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20 md:h-24">
            <div className="flex items-center gap-2">
              <button
                className="p-3 -ml-2 hover:bg-orange-50 rounded-full md:hidden text-neutral-800 focus:outline-none"
                onClick={() => setMenuMobileAberto((prev) => !prev)}
              >
                {menuMobileAberto ? <X size={26} /> : <Menu size={26} />}
              </button>
              <a href="#" className="flex items-center gap-2 text-2xl md:text-3xl font-serif font-bold tracking-tight text-neutral-800">
                <Sun size={28} className="text-yellow-400 fill-yellow-400" />
                <span className="flex flex-col leading-none">
                    LUMINA
                    <span className="text-xs font-sans font-medium tracking-widest text-rose-400 uppercase mt-0.5 ml-0.5">Kids Store</span>
                </span>
              </a>
            </div>

            <div className="hidden md:flex space-x-10 text-sm font-bold tracking-wide text-neutral-500">
              {['NOVIDADES', 'MENINAS', 'SAPATOS', 'ACESSÓRIOS'].map((item) => (
                <a key={item} href="#" className="hover:text-rose-400 transition-colors relative group py-2">
                  {item}
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-rose-400 rounded-full opacity-0 group-hover:opacity-100 transition-all" />
                </a>
              ))}
            </div>

            <div className="flex items-center space-x-2 md:space-x-3">
              <div className={`flex items-center transition-all duration-300 ${buscaAberta ? 'bg-white shadow-sm rounded-full px-2 border border-orange-100' : ''}`}>
                <button
                  className="p-3 hover:bg-orange-50 rounded-full transition-colors text-neutral-600"
                  onClick={() => {
                    setBuscaAberta((prev) => !prev);
                    if (!buscaAberta) {
                      window.setTimeout(() => document.getElementById('search-input')?.focus(), 100);
                    }
                  }}
                >
                  <Search size={22} className="w-5 h-5 md:w-6 md:h-6" />
                </button>
                {buscaAberta && (
                  <input
                    id="search-input"
                    type="text"
                    placeholder="O que procura?"
                    value={termoBusca}
                    onChange={(event) => setTermoBusca(event.target.value)}
                    className="bg-transparent border-none focus:ring-0 text-sm w-32 md:w-48 outline-none text-neutral-800 placeholder:text-neutral-400 px-2"
                    onBlur={() => {
                      if (!termoBusca) {
                        setBuscaAberta(false);
                      }
                    }}
                  />
                )}
              </div>

              <button className="p-3 hover:bg-orange-50 rounded-full transition-colors text-neutral-600" onClick={() => setUserMenuAberto(true)}>
                <User size={22} className="w-5 h-5 md:w-6 md:h-6" />
              </button>

              <div className="relative">
                <button className="p-3 hover:bg-orange-50 rounded-full transition-colors text-neutral-600" onClick={() => setCarrinhoAberto(true)}>
                  <ShoppingBag size={22} className="w-5 h-5 md:w-6 md:h-6" />
                  {totalItens > 0 && (
                    <span className="absolute top-2 right-1 inline-flex items-center justify-center w-4 h-4 text-[10px] font-bold text-white bg-rose-400 rounded-full shadow-sm">
                      {totalItens}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Menu Mobile - Mantido funcional, visual mais limpo */}
      {menuMobileAberto && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-neutral-800/20 backdrop-blur-sm" onClick={() => setMenuMobileAberto(false)} />
          <div className="relative h-full w-[85%] max-w-sm bg-[#FDFBF7] flex flex-col shadow-2xl animate-slide-in-right rounded-r-3xl overflow-hidden">
             <div className="flex items-center justify-between px-6 h-24 bg-white">
                <div className="flex items-center gap-2 text-xl font-serif font-bold text-neutral-800">
                    <Sun size={24} className="text-yellow-400 fill-yellow-400" />
                    Menu
                </div>
              <button
                className="p-2 rounded-full hover:bg-rose-50 text-neutral-400 hover:text-rose-500"
                onClick={() => setMenuMobileAberto(false)}
              >
                <X size={24} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {['NOVIDADES', 'MENINAS', 'BEBÊS', 'SAPATOS', 'CONTA', 'FAVORITOS'].map((item) => (
                <button
                  key={item}
                  type="button"
                  className="w-full flex items-center justify-between py-3 text-lg font-medium text-left text-neutral-600 hover:text-rose-500 hover:pl-2 transition-all"
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

      {/* HERO - Acolhedor, Confortável e Suave */}
      <div className="relative pt-24 md:pt-32 pb-20 md:pb-32 overflow-hidden">
         {/* Fundo com formas orgânicas sutis */}
         <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-yellow-50 rounded-full blur-3xl opacity-60 -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
         <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-rose-50 rounded-full blur-3xl opacity-60 translate-y-1/3 -translate-x-1/4 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16">
            
            {/* Texto: Foco no emocional e conforto */}
            <div className={`flex-1 text-center md:text-left transition-all duration-1000 transform ${heroAnimation ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
               <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-rose-100 text-rose-500 text-sm font-semibold mb-6 shadow-sm">
                 <Heart size={14} className="fill-rose-500" />
                 Feito com amor de mãe
               </div>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-neutral-800 leading-[1.1] mb-6">
                Conforto para <br className="hidden md:block"/>
                <span className="text-rose-400 italic">brincar e sonhar</span>
              </h1>
              <p className="text-neutral-500 text-lg md:text-xl mb-10 max-w-lg mx-auto md:mx-0 leading-relaxed font-light">
                Tecidos macios que abraçam, modelagens livres para correr e estampas que contam histórias. Vista quem você mais ama.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <button className="bg-rose-400 text-white px-10 py-4 rounded-full font-bold shadow-lg shadow-rose-200 hover:bg-rose-500 hover:shadow-xl hover:-translate-y-0.5 transition-all">
                  Ver Coleção
                </button>
                <button className="bg-white text-neutral-600 border border-neutral-200 px-10 py-4 rounded-full font-bold hover:bg-neutral-50 hover:border-neutral-300 transition-all">
                  Nossa História
                </button>
              </div>
            </div>

            {/* Imagem: Orgânica, suave, formato de "nuvem" ou círculo imperfeito */}
            <div className={`flex-1 w-full max-w-lg md:max-w-xl transition-all duration-1000 delay-200 transform ${heroAnimation ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
               <div className="relative">
                  {/* Elementos decorativos */}
                  <Star className="absolute -top-6 right-10 text-yellow-300 fill-yellow-200 w-10 h-10 animate-pulse delay-700" />
                  <Cloud className="absolute bottom-10 -left-8 text-blue-100 w-16 h-16 fill-blue-50 opacity-80" />
                  
                  {/* Máscara orgânica para a imagem (blob) */}
                  <div className="relative rounded-[3rem] md:rounded-[4rem] overflow-hidden shadow-2xl shadow-rose-100/50 rotate-2 hover:rotate-0 transition-transform duration-700">
                     <img 
                        src="https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&q=80&w=1000" 
                        alt="Criança feliz brincando" 
                        className="w-full h-auto object-cover"
                     />
                  </div>
                  
                  {/* Card flutuante "Acolhedor" */}
                   <div className="absolute -bottom-6 -right-4 md:right-4 bg-white p-4 rounded-3xl shadow-xl flex items-center gap-4 animate-bounce-slow">
                     <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600">
                        <Smile size={24} />
                     </div>
                     <div>
                        <p className="text-xs text-neutral-400 font-bold uppercase tracking-wider">Mood do dia</p>
                        <p className="text-base font-bold text-neutral-800">Alegria & Diversão</p>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
         
         {/* Onda SVG Suave na base */}
         <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
            <svg className="relative block w-[calc(100%+1.3px)] h-[60px] md:h-[100px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="fill-white opacity-40"></path>
            </svg>
         </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
        {/* Filtros - Mais arredondados e cores suaves */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
           <div>
              <h2 className="text-2xl font-serif font-bold text-neutral-800 flex items-center gap-2">
                 {termoBusca ? `Buscando por "${termoBusca}"` : 'Vitrine de Fofuras'}
                 {!termoBusca && <Sparkles size={20} className="text-yellow-400" />}
              </h2>
              {!termoBusca && <p className="text-neutral-500 text-sm mt-1">Escolhas especiais para o dia a dia</p>}
           </div>

            <div className="flex overflow-x-auto pb-4 md:pb-0 gap-3 no-scrollbar">
              {CATEGORIAS.map((categoria) => (
                <button
                  key={categoria.id}
                  onClick={() => {
                    setCategoriaAtiva(categoria.id);
                    setTermoBusca('');
                  }}
                  className={`px-6 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-300 ${
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

        {produtosFiltrados.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-neutral-50">
            <div className="mb-4 flex justify-center">
              <div className="bg-rose-50 p-4 rounded-full">
                 <Search size={40} className="text-rose-300" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-neutral-800 mb-2">Ops! Nada por aqui.</h3>
            <p className="text-neutral-500 mb-6">Não encontramos o que você procurou.</p>
            <button onClick={() => setTermoBusca('')} className="text-rose-500 font-bold hover:text-rose-600 hover:underline">
              Limpar busca e ver tudo
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            {produtosFiltrados.map((produto) => (
              <div key={produto.id} className="group relative bg-white p-3 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 border border-neutral-50">
                <div className="aspect-[4/5] w-full overflow-hidden rounded-2xl bg-neutral-100 relative mb-3">
                  <img
                    src={produto.imagens[0]}
                    alt={produto.nome}
                    className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out cursor-pointer"
                    onClick={() => abrirQuickView(produto)}
                  />
                  {produto.novo && (
                    <span className="absolute top-3 left-3 bg-white/90 text-rose-500 px-3 py-1 text-[10px] font-bold tracking-wider uppercase shadow-sm rounded-full">
                      Novo
                    </span>
                  )}
                  
                  {/* Botões de ação sobre a imagem (Hover Desktop) */}
                  <div className="absolute right-3 top-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                     <button
                        onClick={(e) => { e.stopPropagation(); toggleWishlist(produto.id); }}
                        className={`p-2 rounded-full shadow-md transition-colors ${wishlist.includes(produto.id) ? 'bg-rose-50 text-rose-500' : 'bg-white text-neutral-400 hover:text-rose-500'}`}
                     >
                        <Heart size={18} className={wishlist.includes(produto.id) ? 'fill-rose-500' : ''} />
                     </button>
                     <button
                        onClick={(e) => { e.stopPropagation(); abrirQuickView(produto); }}
                        className="p-2 bg-white rounded-full shadow-md text-neutral-400 hover:text-blue-500 transition-colors hidden md:block"
                     >
                        <Eye size={18} />
                     </button>
                  </div>

                  <button
                    onClick={(event) => {
                      event.stopPropagation();
                      adicionarAoCarrinho(produto);
                    }}
                    className="absolute bottom-3 right-3 p-3 bg-rose-400 text-white rounded-full shadow-lg shadow-rose-200 hover:bg-rose-500 hover:scale-110 active:scale-95 transition-all flex items-center justify-center"
                  >
                    <ShoppingBag size={18} />
                  </button>
                </div>

                <div className="px-1 pb-2">
                  <p className="text-[10px] text-neutral-400 uppercase tracking-wide font-bold mb-1">{produto.categoria}</p>
                  <h3 className="text-sm md:text-base font-bold text-neutral-800 line-clamp-1 mb-1 group-hover:text-rose-500 transition-colors cursor-pointer" onClick={() => abrirQuickView(produto)}>
                    {produto.nome}
                  </h3>
                  <div className="flex items-center justify-between">
                     <p className="text-sm md:text-lg font-bold text-rose-400">R$ {produto.preco.toFixed(2).replace('.', ',')}</p>
                     <p className="text-[10px] text-neutral-400 bg-neutral-100 px-2 py-0.5 rounded-full">{produto.tamanhos[0]}-{produto.tamanhos[produto.tamanhos.length-1]}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <footer className="bg-white border-t border-neutral-100 pt-16 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="md:col-span-1">
              <div className="flex items-center gap-2 mb-6">
                 <Sun size={24} className="text-yellow-400 fill-yellow-400" />
                 <span className="text-xl font-serif font-bold text-neutral-800">LUMINA Kids</span>
              </div>
              <p className="text-neutral-500 text-sm leading-relaxed mb-6">
                Vestindo crianças com a liberdade que elas precisam para serem felizes. Peças pensadas por quem entende de amor e cuidado.
              </p>
              <div className="flex space-x-4">
                {[Instagram, Facebook, Twitter].map((Icon, idx) => (
                   <button key={idx} className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center text-rose-400 hover:bg-rose-400 hover:text-white transition-all">
                      <Icon size={18} />
                   </button>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-bold text-neutral-800 mb-6">Explorar</h4>
              <ul className="space-y-3 text-sm text-neutral-500">
                {['Nossa História', 'Sustentabilidade', 'Blog da Mamãe', 'Trabalhe Conosco'].map((item) => (
                  <li key={item}><a href="#" className="hover:text-rose-400 transition-colors">{item}</a></li>
                ))}
              </ul>
            </div>

            <div>
               <h4 className="font-bold text-neutral-800 mb-6">Ajuda</h4>
               <ul className="space-y-3 text-sm text-neutral-500">
                 {['Trocas e Devoluções', 'Guia de Medidas', 'Prazos de Entrega', 'Fale Conosco'].map((item) => (
                   <li key={item}><a href="#" className="hover:text-rose-400 transition-colors">{item}</a></li>
                 ))}
               </ul>
             </div>

            <div className="md:col-span-1 bg-yellow-50/50 p-6 rounded-3xl border border-yellow-100">
              <h4 className="font-bold text-neutral-800 mb-2">Clube de Descontos</h4>
              <p className="text-xs text-neutral-500 mb-4">Entre para nossa lista VIP e ganhe 10% na primeira compra.</p>
              
              {newsletterSucesso ? (
                <div className="bg-green-100 text-green-700 px-4 py-3 rounded-xl text-sm flex items-center gap-2 font-medium">
                  <Check size={16} /> Tudo certo! Verifique seu e-mail.
                </div>
              ) : (
                <form onSubmit={handleNewsletterSubmit} className="flex flex-col gap-3">
                  <input
                    type="email"
                    value={emailNewsletter}
                    onChange={(event) => setEmailNewsletter(event.target.value)}
                    placeholder="Seu melhor e-mail"
                    required
                    className="bg-white border-none py-3 px-4 rounded-xl text-sm w-full focus:ring-2 focus:ring-yellow-300 outline-none text-neutral-800 placeholder:text-neutral-400"
                  />
                  <button type="submit" className="bg-yellow-400 text-yellow-900 px-4 py-3 text-sm font-bold hover:bg-yellow-500 transition-colors rounded-xl shadow-sm">
                    Quero meu desconto
                  </button>
                </form>
              )}
            </div>
          </div>
          
          <div className="border-t border-neutral-100 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-neutral-400 gap-4">
            <p>© 2025 Lumina Kids Store. Todos os direitos reservados.</p>
            <div className="flex gap-4">
               <span>Política de Privacidade</span>
               <span>Termos de Uso</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Chat flutuante - Mais amigável */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
        {chatAberto && (
          <div className="w-80 h-[400px] bg-white rounded-3xl shadow-2xl border border-rose-100 flex flex-col overflow-hidden animate-slide-up origin-bottom-right">
            <div className="bg-rose-400 p-4 text-white flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-1.5 rounded-full">
                   <Smile size={18} />
                </div>
                <div>
                   <span className="font-bold text-sm block">Ajuda Lumina</span>
                   <span className="text-[10px] opacity-90 block">Respondemos rapidinho!</span>
                </div>
              </div>
              <button onClick={() => setChatAberto(false)} className="hover:bg-white/10 p-1 rounded-full transition-colors">
                <X size={18} />
              </button>
            </div>
            <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-[#FDFBF7]">
              {historicoChat.map((mensagem, index) => (
                <div key={`chat-${index}`} className={`flex ${mensagem.tipo === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-3.5 text-sm rounded-2xl shadow-sm ${mensagem.tipo === 'user' ? 'bg-rose-400 text-white rounded-br-none' : 'bg-white border border-neutral-100 text-neutral-600 rounded-bl-none'}`}>
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
                placeholder="Escreva aqui..."
                className="flex-1 bg-neutral-50 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-rose-300 transition-colors"
              />
              <button type="submit" className="p-2 bg-rose-400 text-white rounded-full hover:bg-rose-500 transition-colors shadow-sm disabled:opacity-50" disabled={!chatMensagem.trim()}>
                <Send size={16} />
              </button>
            </form>
          </div>
        )}

        <button
          onClick={() => setChatAberto((prev) => !prev)}
          className="bg-neutral-800 text-white p-4 rounded-full shadow-lg hover:bg-rose-500 transition-all transform hover:scale-110 active:scale-95 flex items-center justify-center relative group"
        >
          {chatAberto ? <X size={24} /> : <MessageCircle size={24} />}
        </button>
      </div>

      {/* Quick View - Arredondado e Suave */}
      {produtoQuickView && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-neutral-800/40 backdrop-blur-sm transition-opacity" onClick={() => setProdutoQuickView(null)} />
          <div className="bg-white md:rounded-[2.5rem] shadow-2xl w-full max-w-4xl relative z-10 overflow-hidden animate-scale-in flex flex-col md:flex-row h-full md:max-h-[85vh] md:h-auto rounded-3xl">
            <button
              onClick={() => setProdutoQuickView(null)}
              className="absolute top-4 right-4 p-2 bg-white/60 hover:bg-white rounded-full z-20 transition-colors text-neutral-500 hover:text-rose-500 backdrop-blur-sm"
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
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/40 hover:bg-white rounded-full opacity-0 group-hover:opacity-100 transition-all backdrop-blur-sm"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={(event) => {
                      event.stopPropagation();
                      setImagemSelecionadaIndex((prev) => (prev === produtoQuickView.imagens.length - 1 ? 0 : prev + 1));
                    }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/40 hover:bg-white rounded-full opacity-0 group-hover:opacity-100 transition-all backdrop-blur-sm"
                  >
                    <ChevronRight size={20} />
                  </button>
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {produtoQuickView.imagens.map((_, idx) => (
                      <button
                        key={`dot-${idx}`}
                        onClick={() => setImagemSelecionadaIndex(idx)}
                        className={`w-2.5 h-2.5 rounded-full transition-all ${imagemSelecionadaIndex === idx ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/80'}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
            <div className="w-full md:w-1/2 p-8 md:p-12 overflow-y-auto flex flex-col h-full bg-white relative -mt-6 md:mt-0 rounded-t-[2rem] md:rounded-none">
              <div className="flex-1">
                <span className="text-xs font-bold tracking-widest text-rose-400 uppercase mb-3 block bg-rose-50 inline-block px-2 py-1 rounded-md">{produtoQuickView.categoria}</span>
                <h2 className="text-2xl md:text-3xl font-serif font-bold text-neutral-800 mb-2">{produtoQuickView.nome}</h2>
                <div className="flex items-baseline gap-2 mb-6">
                    <p className="text-2xl font-bold text-rose-500">R$ {produtoQuickView.preco.toFixed(2).replace('.', ',')}</p>
                    <span className="text-sm text-neutral-400 line-through">R$ {(produtoQuickView.preco * 1.2).toFixed(2).replace('.', ',')}</span>
                </div>
                
                <p className="text-sm md:text-base text-neutral-500 leading-relaxed mb-8">{produtoQuickView.descricao}</p>
                
                {produtoQuickView.imagens.length > 1 && (
                  <div className="flex gap-3 mb-8 overflow-x-auto pb-2 scrollbar-hide">
                    {produtoQuickView.imagens.map((imagem, idx) => (
                      <button
                        key={`thumb-${idx}`}
                        onClick={() => setImagemSelecionadaIndex(idx)}
                        className={`w-16 h-16 flex-shrink-0 border-2 rounded-xl overflow-hidden transition-all ${
                          imagemSelecionadaIndex === idx ? 'border-rose-400 shadow-md' : 'border-transparent opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img src={imagem} alt="Miniatura" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
                
                <div className="mb-8">
                  <div className="flex justify-between mb-3 items-end">
                    <span className="text-sm font-bold text-neutral-800">Tamanho</span>
                    <button className="text-xs text-rose-400 font-medium hover:underline flex items-center gap-1">
                        <span className="w-4 h-4 border border-rose-400 rounded-full flex items-center justify-center text-[10px]">?</span>
                        Guia de medidas
                    </button>
                  </div>
                  <div className="flex gap-3 flex-wrap">
                    {produtoQuickView.tamanhos.map((tamanho) => (
                      <button
                        key={tamanho}
                        onClick={() => setTamanhoSelecionado(tamanho)}
                        className={`min-w-[3rem] h-10 px-3 rounded-xl border-2 flex items-center justify-center text-sm font-bold transition-all ${
                          tamanhoSelecionado === tamanho ? 'border-rose-400 bg-rose-50 text-rose-500' : 'border-neutral-100 text-neutral-500 hover:border-rose-200'
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
                  className="flex-1 bg-neutral-900 text-white py-4 font-bold tracking-wide hover:bg-rose-500 transition-all active:scale-95 shadow-xl shadow-rose-100 rounded-2xl flex items-center justify-center gap-2"
                >
                  <ShoppingBag size={18} />
                  Adicionar à Sacola
                </button>
                <button
                  onClick={() => toggleWishlist(produtoQuickView.id)}
                  className={`w-14 flex items-center justify-center border-2 rounded-2xl transition-all ${
                    wishlist.includes(produtoQuickView.id) ? 'border-rose-200 bg-rose-50 text-rose-500' : 'border-neutral-100 hover:border-rose-200 text-neutral-400'
                  }`}
                >
                  <Heart size={22} className={wishlist.includes(produtoQuickView.id) ? 'fill-rose-500' : ''} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LuminaKids;