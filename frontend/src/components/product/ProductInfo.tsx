import React, { useEffect, useState } from 'react';
import { X, Heart, ShoppingBag, CreditCard, Truck, ShieldCheck, Star, RefreshCw } from 'lucide-react';
import { Produto } from '../../types';

interface ProductInfoProps {
  produto: Produto | null;
  onClose: () => void;
  onAddToCart: (produto: Produto, tamanho?: string | null) => void;
  onToggleWishlist: (id: number) => void;
  isWishlisted: boolean;
}

const ProductInfo: React.FC<ProductInfoProps> = ({ produto, onClose, onAddToCart, onToggleWishlist, isWishlisted }) => {
  if (!produto) return null;

  const installment = produto.preco / 10;
  const tamanhoPadrao = produto.tamanhos?.[0] ?? null;
  const [imagemIndex, setImagemIndex] = useState(0);

  useEffect(() => {
    setImagemIndex(0);
  }, [produto?.id]);

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label={`Informações do produto ${produto.nome}`}>
      <div className="absolute inset-0 bg-neutral-900/50 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute inset-0 overflow-y-auto">
        <div className="min-h-full bg-white md:rounded-none rounded-none">
          <div className="flex flex-col md:flex-row md:min-h-screen">
            <div className="w-full md:w-1/2 bg-neutral-50 relative">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/80 hover:bg-white text-neutral-500 shadow-sm z-20"
                aria-label="Fechar"
              >
                <X size={22} />
              </button>
              <div className="aspect-[4/5] w-full overflow-hidden bg-neutral-50">
                <img
                  src={produto.imagens?.[imagemIndex] || produto.imagem}
                  alt={produto.nome}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  decoding="async"
                  width={1200}
                  height={900}
                  onError={(event) => {
                    const target = event.currentTarget;
                    target.onerror = null;
                    target.src = '/placeholder-product.svg';
                  }}
                />
              </div>
            </div>

            <div className="w-full md:w-1/2 flex flex-col">
              <div className="p-6 sm:p-8 flex flex-col gap-6">
                <div className="flex flex-wrap items-center gap-3">
                <span className="text-[11px] uppercase tracking-widest font-bold text-rose-400 bg-rose-50 px-3 py-1 rounded-full border border-rose-100">{produto.categoria}</span>
                {produto.novo && <span className="text-[11px] font-semibold text-neutral-700 bg-neutral-100 px-3 py-1 rounded-full">Novo</span>}
                <span className="text-[11px] font-semibold text-neutral-500 bg-neutral-50 px-3 py-1 rounded-full">+5 vendidos</span>
              </div>

              <div>
                <h1 className="text-3xl sm:text-4xl font-serif font-bold text-neutral-900 leading-tight mb-3">{produto.nome}</h1>
                <div className="flex items-baseline gap-3 mb-2">
                  <p className="text-3xl font-bold text-rose-500">R$ {produto.preco.toFixed(2).replace('.', ',')}</p>
                  <span className="text-sm text-neutral-400 line-through">R$ {(produto.preco * 1.2).toFixed(2).replace('.', ',')}</span>
                </div>
                <p className="text-sm text-neutral-700">10x de R$ {installment.toFixed(2).replace('.', ',')} sem juros</p>
                <button className="text-xs font-semibold text-rose-500 hover:text-rose-600 mt-1">Ver meios de pagamento</button>
              </div>

              <p className="text-sm text-neutral-700 leading-relaxed">{produto.descricao}</p>

              <div className="flex items-center gap-2 text-sm font-semibold text-neutral-800">
                <span>Tamanho</span>
                <button className="text-xs text-rose-500 font-semibold hover:underline">Guia de medidas</button>
              </div>
              <div className="flex gap-2 flex-wrap">
                {produto.tamanhos.map((tamanho) => (
                  <span key={tamanho} className="px-4 py-2 rounded-xl border border-neutral-200 bg-white text-sm font-semibold text-neutral-800 shadow-sm">
                    {tamanho}
                  </span>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-3 p-3 rounded-2xl border border-neutral-100 bg-neutral-50">
                  <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center text-xs font-bold">24h</div>
                  <div className="text-sm text-neutral-700">
                    <p className="font-semibold text-neutral-900">Envio rápido</p>
                    <p className="text-xs text-neutral-500">Postagem em até 24h úteis</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-2xl border border-neutral-100 bg-neutral-50">
                  <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center text-xs font-bold">↩</div>
                  <div className="text-sm text-neutral-700">
                    <p className="font-semibold text-neutral-900">Troca fácil</p>
                    <p className="text-xs text-neutral-500">30 dias para trocar</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-2xl border border-neutral-100 bg-neutral-50">
                  <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center text-xs font-bold">★</div>
                  <div className="text-sm text-neutral-700">
                    <p className="font-semibold text-neutral-900">Avaliação 4.8/5</p>
                    <p className="text-xs text-neutral-500">Conforto e durabilidade</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-2xl border border-neutral-100 bg-neutral-50">
                  <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center text-xs font-bold">🔒</div>
                  <div className="text-sm text-neutral-700">
                    <p className="font-semibold text-neutral-900">Pagamento seguro</p>
                    <p className="text-xs text-neutral-500">Pix, boleto e cartão</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  onClick={() => onAddToCart(produto, tamanhoPadrao)}
                  className="w-full bg-rose-500 text-white py-4 px-6 text-sm font-bold rounded-2xl shadow-lg hover:bg-rose-600 active:scale-[0.99] transition-all flex items-center justify-center gap-2"
                >
                  <ShoppingBag size={18} />
                  Adicionar à sacola
                </button>
                <button
                  onClick={() => onToggleWishlist(produto.id)}
                  className={`w-full py-3 px-4 text-sm font-semibold rounded-2xl border transition-colors flex items-center justify-center gap-2 ${
                    isWishlisted ? 'border-rose-200 bg-rose-50 text-rose-500' : 'border-neutral-200 text-neutral-600 hover:border-rose-200'
                  }`}
                >
                  <Heart size={18} className={isWishlisted ? 'fill-rose-500' : ''} />
                  {isWishlisted ? 'Remover dos favoritos' : 'Salvar nos favoritos'}
                </button>
                <p className="text-[11px] text-neutral-500 text-center">Pagamento seguro e devolução em 30 dias.</p>
              </div>

              {produto.imagens?.length > 1 && (
                <div className="flex gap-3 justify-center pt-4">
                  {produto.imagens.map((img, idx) => (
                    <button
                      key={img}
                      onClick={() => setImagemIndex(idx)}
                      className={`h-16 w-16 rounded-xl overflow-hidden border-2 transition-all ${imagemIndex === idx ? 'border-rose-400 shadow-md' : 'border-transparent opacity-70 hover:opacity-100'}`}
                    >
                      <img
                        src={img}
                        alt="Miniatura"
                        className="h-full w-full object-cover"
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
              </div>

              <div className="bg-neutral-50 p-6 sm:p-8 flex flex-col gap-6 border-t border-neutral-100">
                <div className="rounded-2xl border border-neutral-100 bg-white shadow-sm p-4 space-y-3">
                <p className="text-sm font-semibold text-neutral-900">O que você precisa saber</p>
                <ul className="space-y-1 text-sm text-neutral-700">
                  <li className="flex gap-2"><span className="text-rose-400">•</span> Composição suave e respirável</li>
                  <li className="flex gap-2"><span className="text-rose-400">•</span> Ajuste confortável para brincar e dormir</li>
                  <li className="flex gap-2"><span className="text-rose-400">•</span> Produção local com baixo desperdício</li>
                  <li className="flex gap-2"><span className="text-rose-400">•</span> Troca fácil em até 30 dias</li>
                </ul>
              </div>

              <div className="rounded-2xl border border-neutral-100 bg-white shadow-sm p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-neutral-900">Ficha técnica</p>
                  <span className="text-[11px] text-neutral-500">Essencial</span>
                </div>
                <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm text-neutral-700">
                  <div className="space-y-1">
                    <p className="text-neutral-500">Material</p>
                    <p className="font-semibold text-neutral-900">Algodão premium</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-neutral-500">Origem</p>
                    <p className="font-semibold text-neutral-900">Produção local</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-neutral-500">Cuidados</p>
                    <p className="font-semibold text-neutral-900">Lavagem fria, secagem à sombra</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-neutral-500">Garantia</p>
                    <p className="font-semibold text-neutral-900">12 meses</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-neutral-600">
                  <RefreshCw size={14} className="text-rose-400" />
                  Trocas fáceis em até 30 dias após o recebimento.
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="rounded-2xl border border-neutral-100 bg-white shadow-sm p-4 space-y-2">
                  <div className="flex items-center gap-2 text-neutral-900 font-semibold text-sm">
                    <CreditCard size={16} className="text-rose-400" />
                    Formas de pagamento
                  </div>
                  <p className="text-sm text-neutral-700">Até 10x sem juros ou 5% off no Pix.</p>
                  <button className="text-xs font-semibold text-rose-500 hover:text-rose-600">Ver opções</button>
                </div>
                <div className="rounded-2xl border border-neutral-100 bg-white shadow-sm p-4 space-y-2">
                  <div className="flex items-center gap-2 text-neutral-900 font-semibold text-sm">
                    <Truck size={16} className="text-rose-400" />
                    Entrega
                  </div>
                  <p className="text-sm text-neutral-700">Frete grátis acima de R$ 300 e postagem em até 24h úteis.</p>
                  <button className="text-xs font-semibold text-rose-500 hover:text-rose-600">Calcular frete</button>
                </div>
                <div className="rounded-2xl border border-neutral-100 bg-white shadow-sm p-4 space-y-2">
                  <div className="flex items-center gap-2 text-neutral-900 font-semibold text-sm">
                    <ShieldCheck size={16} className="text-rose-400" />
                    Garantia
                  </div>
                  <p className="text-sm text-neutral-700">1 ano de garantia de fábrica + suporte dedicado.</p>
                  <button className="text-xs font-semibold text-rose-500 hover:text-rose-600">Ver condições</button>
                </div>
                <div className="rounded-2xl border border-neutral-100 bg-white shadow-sm p-4 space-y-2">
                  <div className="flex items-center gap-2 text-neutral-900 font-semibold text-sm">
                    <Star size={16} className="text-rose-400" />
                    Avaliação
                  </div>
                  <p className="text-sm text-neutral-700">Média 4.8/5 em conforto, tecido e durabilidade.</p>
                  <button className="text-xs font-semibold text-rose-500 hover:text-rose-600">Ver avaliações</button>
                </div>
              </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;
