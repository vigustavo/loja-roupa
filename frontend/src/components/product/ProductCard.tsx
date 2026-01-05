import React from 'react';
import { Heart, ShoppingBag } from 'lucide-react';
import { Produto } from '../../types';

interface ProductCardProps {
  produto: Produto;
  isWishlisted: boolean;
  onToggleWishlist: (id: number) => void;
  onOpenProduct: (produto: Produto) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  produto,
  isWishlisted,
  onToggleWishlist,
  onOpenProduct
}) => {
  return (
    <div className="group relative bg-white p-3 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 border border-neutral-50 h-full flex flex-col">
      <div className="aspect-[4/5] w-full overflow-hidden rounded-2xl bg-neutral-100 relative mb-3">
        <img
          src={produto.imagens[0]}
          alt={produto.nome}
          className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out cursor-pointer"
          onClick={() => onOpenProduct(produto)}
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

        {produto.novo && (
          <span className="absolute top-3 left-3 bg-white/90 text-rose-500 px-3 py-1 text-[10px] font-bold tracking-wider uppercase shadow-sm rounded-full">
            Novo
          </span>
        )}

        <div className="absolute right-3 top-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={(event) => {
              event.stopPropagation();
              onToggleWishlist(produto.id);
            }}
            className={`p-2 rounded-full shadow-md transition-colors ${isWishlisted ? 'bg-rose-50 text-rose-500' : 'bg-white text-neutral-400 hover:text-rose-500'}`}
            aria-label={isWishlisted ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
          >
            <Heart size={18} className={isWishlisted ? 'fill-rose-500' : ''} />
          </button>
        </div>

        <button
          onClick={(event) => {
            event.stopPropagation();
            onOpenProduct(produto);
          }}
          className="absolute bottom-3 right-3 p-3 bg-rose-400 text-white rounded-full shadow-lg shadow-rose-200 hover:bg-rose-500 hover:scale-110 active:scale-95 transition-all flex items-center justify-center"
          aria-label="Escolher tamanho e adicionar"
          title="Escolher tamanho e adicionar"
        >
          <ShoppingBag size={18} />
        </button>
      </div>

      <div className="px-1 pb-2 flex-1 flex flex-col justify-between">
        <div>
          <p className="text-[10px] text-neutral-400 uppercase tracking-wide font-bold mb-1">{produto.categoria}</p>
          <h3
            className="text-sm md:text-base font-bold text-neutral-800 line-clamp-1 mb-1 group-hover:text-rose-500 transition-colors cursor-pointer"
            onClick={() => onOpenProduct(produto)}
          >
            {produto.nome}
          </h3>
        </div>
        <div className="flex items-center justify-between mt-2">
          <p className="text-sm md:text-lg font-bold text-rose-400">R$ {produto.preco.toFixed(2).replace('.', ',')}</p>
          <p className="text-[10px] text-neutral-400 bg-neutral-100 px-2 py-0.5 rounded-full">
            {produto.tamanhos[0]}-{produto.tamanhos[produto.tamanhos.length - 1]}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;