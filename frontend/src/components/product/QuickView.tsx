import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Heart, ShoppingBag, CreditCard, Truck, ShieldCheck, Star, RefreshCw } from 'lucide-react';
import { Produto } from '../../types';

interface QuickViewProps {
  produto: Produto | null;
  onClose: () => void;
  onAddToCart: (produto: Produto, tamanho: string | null) => void;
  onToggleWishlist: (id: number) => void;
  isWishlisted: boolean;
}

const QuickView: React.FC<QuickViewProps> = ({ 
  produto, 
  onClose, 
  onAddToCart, 
  onToggleWishlist,
  isWishlisted
}) => {
  // Estados internos do componente
  const [imagemSelecionadaIndex, setImagemSelecionadaIndex] = useState(0);
  const [tamanhoSelecionado, setTamanhoSelecionado] = useState<string | null>(produto?.tamanhos?.[0] ?? null);

  // Se não houver produto, não renderiza nada
  if (!produto) return null;

  // Resetar estados quando o produto mudar (ou inicializar com padrão)
  // Obs: Em um cenário real, useEffect seria usado aqui se o modal ficasse montado,
  // mas como ele desmonta ao fechar, o useState inicial resolve a maioria dos casos.
  // Porem, se o usuário trocar de produto sem fechar o modal, precisamos resetar:
  React.useEffect(() => {
    setImagemSelecionadaIndex(0);
    setTamanhoSelecionado(produto.tamanhos[0]);
  }, [produto]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label={`Detalhe do produto ${produto.nome}`}>
      <div className="absolute inset-0 bg-neutral-800/40 backdrop-blur-sm transition-opacity" onClick={onClose} />
      <div className="bg-white md:rounded-[2.5rem] shadow-2xl w-full max-w-4xl relative z-10 overflow-hidden animate-scale-in flex flex-col md:flex-row h-full md:max-h-[85vh] md:h-auto rounded-3xl" tabIndex={-1}>
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-white/60 hover:bg-white rounded-full z-20 transition-colors text-neutral-500 hover:text-rose-500 backdrop-blur-sm"
        >
          <X size={24} />
        </button>

        {/* Galeria de Imagens */}
        <div className="w-full md:w-1/2 bg-neutral-100 h-[40vh] md:h-auto flex-shrink-0 relative group">
          <img
            src={produto.imagens[imagemSelecionadaIndex] || produto.imagem}
            alt={produto.nome}
            className="w-full h-full object-cover transition-opacity duration-300"
            loading="lazy"
            decoding="async"
            width={800}
            height={1000}
            onError={(event) => {
              const target = event.currentTarget;
              target.onerror = null;
              target.src = '/placeholder-product.svg';
            }}
          />
          
          {produto.imagens.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setImagemSelecionadaIndex((prev) => (prev === 0 ? produto.imagens.length - 1 : prev - 1));
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/40 hover:bg-white rounded-full opacity-0 group-hover:opacity-100 transition-all backdrop-blur-sm"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setImagemSelecionadaIndex((prev) => (prev === produto.imagens.length - 1 ? 0 : prev + 1));
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/40 hover:bg-white rounded-full opacity-0 group-hover:opacity-100 transition-all backdrop-blur-sm"
              >
                <ChevronRight size={20} />
              </button>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {produto.imagens.map((_, idx) => (
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

        {/* Detalhes do Produto */}
        <div className="w-full md:w-1/2 p-8 md:p-12 overflow-y-auto flex flex-col h-full bg-white relative -mt-6 md:mt-0 rounded-t-[2rem] md:rounded-none">
          <div className="flex-1">
            <span className="text-xs font-bold tracking-widest text-rose-400 uppercase mb-3 block bg-rose-50 inline-block px-2 py-1 rounded-md">{produto.categoria}</span>
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-neutral-800 mb-2">{produto.nome}</h2>
            <div className="flex items-baseline gap-2 mb-6">
                <p className="text-2xl font-bold text-rose-500">R$ {produto.preco.toFixed(2).replace('.', ',')}</p>
                <span className="text-sm text-neutral-400 line-through">R$ {(produto.preco * 1.2).toFixed(2).replace('.', ',')}</span>
            </div>
            
            <p className="text-sm md:text-base text-neutral-500 leading-relaxed mb-8">{produto.descricao}</p>
            
            {/* Thumbnails */}
            {produto.imagens.length > 1 && (
              <div className="flex gap-3 mb-8 overflow-x-auto pb-2 scrollbar-hide">
                {produto.imagens.map((imagem, idx) => (
                  <button
                    key={`thumb-${idx}`}
                    onClick={() => setImagemSelecionadaIndex(idx)}
                    className={`w-16 h-16 flex-shrink-0 border-2 rounded-xl overflow-hidden transition-all ${
                      imagemSelecionadaIndex === idx ? 'border-rose-400 shadow-md' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={imagem}
                      alt="Miniatura"
                      className="w-full h-full object-cover"
                      loading="lazy"
                      decoding="async"
                      width={160}
                      height={160}
                      onError={(event) => {
                        const target = event.currentTarget;
                        target.onerror = null;
                        target.src = '/placeholder-product.svg';
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
            
            {/* Seleção de Tamanho */}
            <div className="mb-8">
              <div className="flex justify-between mb-3 items-end">
                <span className="text-sm font-bold text-neutral-800">Tamanho</span>
                <button className="text-xs text-rose-400 font-medium hover:underline flex items-center gap-1">
                    <span className="w-4 h-4 border border-rose-400 rounded-full flex items-center justify-center text-[10px]">?</span>
                    Guia de medidas
                </button>
              </div>
              <div className="flex gap-3 flex-wrap">
                {produto.tamanhos.map((tamanho) => (
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

            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex items-center gap-3 p-3 rounded-2xl border border-neutral-100 bg-neutral-50">
                  <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center font-bold">24h</div>
                  <div className="text-sm text-neutral-700">
                    <p className="font-semibold text-neutral-900">Envio rápido</p>
                    <p className="text-xs text-neutral-500">Postagem em até 24h úteis</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-2xl border border-neutral-100 bg-neutral-50">
                  <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center font-bold">↩</div>
                  <div className="text-sm text-neutral-700">
                    <p className="font-semibold text-neutral-900">Troca fácil</p>
                    <p className="text-xs text-neutral-500">30 dias para trocas</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-2xl border border-neutral-100 bg-neutral-50">
                  <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center font-bold">★</div>
                  <div className="text-sm text-neutral-700">
                    <p className="font-semibold text-neutral-900">Qualidade verificada</p>
                    <p className="text-xs text-neutral-500">Avaliação média 4.8/5</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-2xl border border-neutral-100 bg-neutral-50">
                  <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center font-bold">🔒</div>
                  <div className="text-sm text-neutral-700">
                    <p className="font-semibold text-neutral-900">Pagamento seguro</p>
                    <p className="text-xs text-neutral-500">Cartão, Pix e boleto</p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-neutral-100 bg-white shadow-sm p-4 space-y-3">
                <p className="text-sm font-semibold text-neutral-900">O que você precisa saber</p>
                <ul className="space-y-2 text-sm text-neutral-600">
                  <li className="flex gap-2"><span className="text-rose-400">•</span> Composição suave para pele sensível</li>
                  <li className="flex gap-2"><span className="text-rose-400">•</span> Tamanhos pensados para liberdade de movimento</li>
                  <li className="flex gap-2"><span className="text-rose-400">•</span> Estampas exclusivas produzidas em pequenas tiragens</li>
                  <li className="flex gap-2"><span className="text-rose-400">•</span> Garantia de troca em 30 dias</li>
                </ul>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="rounded-2xl border border-neutral-100 bg-white shadow-sm p-4 space-y-2">
                  <div className="flex items-center gap-2 text-neutral-900 font-semibold text-sm">
                    <CreditCard size={16} className="text-rose-400" />
                    Formas de pagamento
                  </div>
                  <p className="text-sm text-neutral-700">Até 3x sem juros ou 5% off no Pix.</p>
                  <button className="text-xs font-semibold text-rose-500 hover:text-rose-600">Ver opções</button>
                </div>
                <div className="rounded-2xl border border-neutral-100 bg-white shadow-sm p-4 space-y-2">
                  <div className="flex items-center gap-2 text-neutral-900 font-semibold text-sm">
                    <Truck size={16} className="text-rose-400" />
                    Entrega e devolução
                  </div>
                  <p className="text-sm text-neutral-700">Frete grátis acima de R$ 300 e devolução fácil em 30 dias.</p>
                  <button className="text-xs font-semibold text-rose-500 hover:text-rose-600">Calcular frete</button>
                </div>
                <div className="rounded-2xl border border-neutral-100 bg-white shadow-sm p-4 space-y-2">
                  <div className="flex items-center gap-2 text-neutral-900 font-semibold text-sm">
                    <ShieldCheck size={16} className="text-rose-400" />
                    Garantia e suporte
                  </div>
                  <p className="text-sm text-neutral-700">1 ano de garantia de fábrica + suporte dedicado.</p>
                  <button className="text-xs font-semibold text-rose-500 hover:text-rose-600">Ver condições</button>
                </div>
                <div className="rounded-2xl border border-neutral-100 bg-white shadow-sm p-4 space-y-2">
                  <div className="flex items-center gap-2 text-neutral-900 font-semibold text-sm">
                    <Star size={16} className="text-rose-400" />
                    Avaliação e confiança
                  </div>
                  <p className="text-sm text-neutral-700">Média 4.8/5 em conforto, tecido e durabilidade.</p>
                  <button className="text-xs font-semibold text-rose-500 hover:text-rose-600">Ver avaliações</button>
                </div>
              </div>

              <div className="rounded-2xl border border-neutral-100 bg-white shadow-sm p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-neutral-900">Ficha técnica</p>
                  <span className="text-[11px] text-neutral-500">Essencial</span>
                </div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs text-neutral-700">
                  <div className="space-y-1">
                    <p className="text-neutral-500">Material</p>
                    <p className="font-semibold text-neutral-800">Algodão premium</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-neutral-500">Origem</p>
                    <p className="font-semibold text-neutral-800">Produção local</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-neutral-500">Cuidados</p>
                    <p className="font-semibold text-neutral-800">Lavagem fria, secagem à sombra</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-neutral-500">Garantia</p>
                    <p className="font-semibold text-neutral-800">12 meses</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-neutral-600">
                  <RefreshCw size={14} className="text-rose-400" />
                  Trocas fáceis em até 30 dias após o recebimento.
                </div>
              </div>

            </div>
          </div>

          <div className="flex gap-4 pt-4 border-t border-neutral-100 md:border-none pb-4 md:pb-0">
            <button
              onClick={() => {
                onAddToCart(produto, tamanhoSelecionado);
                onClose(); // Opcional: fechar ao adicionar
              }}
              disabled={!tamanhoSelecionado}
              className={`flex-1 py-4 font-bold tracking-wide transition-all active:scale-95 shadow-xl shadow-rose-100 rounded-2xl flex items-center justify-center gap-2 ${
                tamanhoSelecionado
                  ? 'bg-neutral-900 text-white hover:bg-rose-500'
                  : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
              }`}
            >
              <ShoppingBag size={18} />
              Adicionar à Sacola
            </button>
            <button
              onClick={() => onToggleWishlist(produto.id)}
              className={`w-14 flex items-center justify-center border-2 rounded-2xl transition-all ${
                isWishlisted ? 'border-rose-200 bg-rose-50 text-rose-500' : 'border-neutral-100 hover:border-rose-200 text-neutral-400'
              }`}
            >
              <Heart size={22} className={isWishlisted ? 'fill-rose-500' : ''} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickView;