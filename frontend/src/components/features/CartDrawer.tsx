import React from 'react';
import { X, ShoppingBag } from 'lucide-react';
import { CarrinhoItem } from '../../types';

interface CartDrawerProps {
  isOpen: boolean;
  itens: CarrinhoItem[];
  onClose: () => void;
  onRemoveItem: (id: number, tamanho: string) => void;
  onUpdateQty: (id: number, tamanho: string, delta: number) => void;
  onCheckout: () => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ 
  isOpen, 
  itens, 
  onClose, 
  onRemoveItem, 
  onUpdateQty,
  onCheckout
}) => {
  if (!isOpen) return null;

  const totalValor = itens.reduce((acc, item) => acc + item.preco * item.qtd, 0);

  return (
    <div className="fixed inset-0 z-[60] overflow-hidden" role="dialog" aria-modal="true" aria-label="Carrinho">
      <div className="absolute inset-0 bg-neutral-800/40 backdrop-blur-sm transition-opacity" onClick={onClose} />
      <div className="absolute inset-y-0 right-0 max-w-full flex">
        <div className="relative w-screen max-w-md bg-[#fdfbf7] shadow-2xl flex flex-col h-full animate-slide-in-right transform transition-transform overflow-hidden">
          <div className="flex items-center justify-center px-6 py-6 border-b border-rose-100 bg-white relative">
            <button onClick={onClose} className="p-2 hover:bg-rose-50 rounded-full transition-colors text-neutral-500 absolute right-4">
              <X size={22} />
            </button>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-serif font-bold text-neutral-900">Sua sacola</h2>
              <span className="text-xs font-semibold text-rose-500 bg-rose-50 px-2 py-1 rounded-full border border-rose-100">{itens.length}</span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 bg-gradient-to-b from-white via-[#fdfbf7] to-[#f8f3ed]">
            {itens.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-neutral-400 space-y-4">
                <ShoppingBag size={64} className="opacity-10 text-rose-500" />
                <p className="text-lg font-medium text-neutral-500">Sua sacola está vazia</p>
                <button onClick={onClose} className="text-rose-500 font-bold border-b-2 border-rose-500 hover:text-rose-700 hover:border-rose-700 pb-1">
                  Ver roupinhas
                </button>
              </div>
            ) : (
              <>
                <div className="space-y-3">
                  {itens.map((item) => (
                    <div key={`${item.id}-${item.tamanho}`} className="bg-white border border-neutral-100 rounded-2xl shadow-sm px-3 py-3 md:px-4 md:py-4 flex gap-3 md:gap-4">
                      <div className="h-24 w-20 md:h-28 md:w-24 flex-shrink-0 overflow-hidden rounded-xl bg-neutral-50 border border-neutral-100">
                        <img src={item.imagemSelecionada} alt={item.nome} className="h-full w-full object-cover object-center" />
                      </div>
                      <div className="flex-1 flex flex-col gap-2">
                        <div className="flex justify-between items-start gap-2">
                          <div className="space-y-1">
                            <h3 className="text-sm md:text-base font-semibold text-neutral-900 leading-snug line-clamp-2">{item.nome}</h3>
                            <p className="text-xs text-neutral-500 capitalize">{item.categoria}</p>
                            <p className="text-[11px] font-semibold text-neutral-400 uppercase">Idade: {item.tamanho} anos</p>
                          </div>
                          <p className="text-sm md:text-base font-bold text-rose-500 whitespace-nowrap">R$ {(item.preco * item.qtd).toFixed(2).replace('.', ',')}</p>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center rounded-full border border-neutral-200 bg-neutral-50">
                            <button
                              onClick={() => onUpdateQty(item.id, item.tamanho, -1)}
                              className="px-3 py-1.5 text-neutral-600 hover:bg-white disabled:opacity-30"
                              disabled={item.qtd <= 1}
                            >
                              -
                            </button>
                            <span className="px-3 text-sm font-semibold text-neutral-800 min-w-[2rem] text-center">{item.qtd}</span>
                            <button
                              onClick={() => onUpdateQty(item.id, item.tamanho, 1)}
                              className="px-3 py-1.5 text-neutral-600 hover:bg-white"
                            >
                              +
                            </button>
                          </div>
                          <button
                            type="button"
                            onClick={() => onRemoveItem(item.id, item.tamanho)}
                            className="text-xs font-semibold text-neutral-400 hover:text-rose-500 transition-colors"
                          >
                            Remover
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-white border border-neutral-100 rounded-2xl shadow-sm p-4 space-y-3">
                  <div className="flex items-center justify-between text-sm font-semibold text-neutral-800">
                    <span>Frete</span>
                    <span className="text-neutral-600">-</span>
                  </div>
                  <div className="flex items-center justify-between text-sm font-semibold text-neutral-800">
                    <span>Descontos</span>
                    <span className="text-neutral-600">-</span>
                  </div>
                  <div className="flex items-center gap-2 border border-neutral-200 rounded-xl px-3 py-2.5 bg-neutral-50">
                    <input
                      className="flex-1 bg-transparent outline-none text-sm text-neutral-800 placeholder:text-neutral-400"
                      placeholder="Adicionar cupom"
                    />
                    <button className="text-sm font-semibold text-rose-500 hover:text-rose-600">Aplicar</button>
                  </div>
                  <div className="flex items-center justify-between text-base font-bold text-neutral-900 pt-1">
                    <span>Subtotal</span>
                    <span>R$ {totalValor.toFixed(2).replace('.', ',')}</span>
                  </div>
                  <p className="text-[11px] text-neutral-500">Frete grátis acima de R$ 300,00.</p>
                </div>
              </>
            )}
          </div>

          {itens.length > 0 && (
            <div className="border-t border-rose-100 px-4 md:px-6 py-5 bg-white shadow-inner">
              <div className="flex items-center justify-between text-sm font-semibold text-neutral-700 mb-3">
                <span>Total</span>
                <span className="text-lg font-bold text-neutral-900">R$ {totalValor.toFixed(2).replace('.', ',')}</span>
              </div>
              <button 
                onClick={onCheckout}
                className="w-full bg-rose-500 text-white py-4 px-6 text-sm font-bold rounded-2xl shadow-lg hover:bg-rose-600 active:scale-[0.99] transition-all"
              >
                Finalizar compra
              </button>
              <p className="text-[11px] text-neutral-500 text-center mt-2">Pagamento seguro e devolução em 30 dias</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartDrawer;