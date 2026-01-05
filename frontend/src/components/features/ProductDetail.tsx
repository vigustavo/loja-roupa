import React, { useState } from 'react';
import { X, Heart, ShoppingBag, Truck, RotateCcw, Star, ShieldCheck, Ruler, ChevronRight, ChevronLeft } from 'lucide-react';
import { Produto } from '../../types';

interface ProductDetailProps {
  produto: Produto;
  onClose: () => void;
  onAddToCart: (produto: Produto, tamanho: string | null) => void;
  onToggleWishlist: (id: number) => void;
  isWishlisted: boolean;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ produto, onClose, onAddToCart, onToggleWishlist, isWishlisted }) => {
  const [tamanhoSelecionado, setTamanhoSelecionado] = useState<string | null>(null);
  const [imagemAtiva, setImagemAtiva] = useState(0);
  const [tabAtiva, setTabAtiva] = useState<'detalhes' | 'entrega' | 'trocas' | 'avaliacoes'>('detalhes');

  // Simulação de preços e descontos baseados no input
  const precoOriginal = produto.preco ? produto.preco * 1.2 : 179.88;
  const precoAtual = produto.preco || 149.90;
  
  const handleAddToCart = () => {
    if (tamanhoSelecionado) {
      onAddToCart(produto, tamanhoSelecionado);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-neutral-900/40 backdrop-blur-sm transition-opacity" onClick={onClose} />
      
      <div className="relative w-full max-w-6xl bg-[#FDFBF7] rounded-[2.5rem] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col md:flex-row animate-scale-in">
        
        {/* Botão Fechar Mobile */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 bg-white/80 backdrop-blur rounded-full text-neutral-500 md:hidden"
        >
          <X size={20} />
        </button>

        {/* Coluna Imagens */}
        <div className="w-full md:w-1/2 bg-white p-6 md:p-10 flex flex-col gap-6 relative">
           <div className="absolute top-6 left-6 z-10 flex flex-col gap-2">
              <span className="bg-rose-400 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm tracking-wide">
                Exclusivo Aurora
              </span>
           </div>

           <div className="flex-1 relative rounded-3xl overflow-hidden bg-neutral-100 aspect-[4/5] md:aspect-auto group">
             <img 
               src={produto.imagens[imagemAtiva]} 
               alt={produto.nome} 
               className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
             />
             
             {/* Navegação Imagem */}
             {produto.imagens.length > 1 && (
               <>
                 <button 
                   onClick={(e) => { e.stopPropagation(); setImagemAtiva(prev => (prev > 0 ? prev - 1 : produto.imagens.length - 1)); }}
                   className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/60 hover:bg-white rounded-full text-neutral-700 transition-all opacity-0 group-hover:opacity-100"
                 >
                   <ChevronLeft size={20} />
                 </button>
                 <button 
                   onClick={(e) => { e.stopPropagation(); setImagemAtiva(prev => (prev < produto.imagens.length - 1 ? prev + 1 : 0)); }}
                   className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/60 hover:bg-white rounded-full text-neutral-700 transition-all opacity-0 group-hover:opacity-100"
                 >
                   <ChevronRight size={20} />
                 </button>
               </>
             )}
           </div>

           {/* Miniaturas */}
           <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar justify-center">
             {produto.imagens.map((img, idx) => (
               <button
                 key={idx}
                 onClick={() => setImagemAtiva(idx)}
                 className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                   imagemAtiva === idx ? 'border-rose-400 ring-2 ring-rose-100' : 'border-transparent opacity-70 hover:opacity-100'
                 }`}
               >
                 <img src={img} alt={`Miniatura ${idx + 1}`} className="w-full h-full object-cover" />
               </button>
             ))}
           </div>
        </div>

        {/* Coluna Informações */}
        <div className="w-full md:w-1/2 flex flex-col h-full overflow-y-auto custom-scrollbar bg-[#FDFBF7]">
          
          {/* Header Fixo Desktop */}
          <div className="flex flex-col p-6 md:p-8 pb-0 border-b border-neutral-100/50 bg-white/50 backdrop-blur-sm sticky top-0 z-10">
             <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                   <div className="w-14 h-14 bg-rose-100 rounded-2xl flex items-center justify-center text-rose-500 font-serif font-bold text-xl shadow-sm">AK</div>
                   <div className="flex flex-col">
                     <span className="text-rose-500 font-serif italic text-2xl leading-none">Aurora Kids</span>
                     <span className="text-[10px] text-neutral-400 tracking-[0.2em] uppercase mt-1">pequenas grandes histórias</span>
                   </div>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-neutral-100 rounded-full text-neutral-400 transition-colors hidden md:block">
                  <X size={24} />
                </button>
             </div>
             
             <div className="flex gap-6 overflow-x-auto no-scrollbar">
                 {['detalhes', 'entrega', 'trocas', 'avaliacoes'].map((tab) => (
                   <button
                     key={tab}
                     onClick={() => setTabAtiva(tab as any)}
                     className={`pb-4 text-sm font-bold uppercase tracking-wide transition-all border-b-2 whitespace-nowrap ${
                       tabAtiva === tab 
                         ? 'text-rose-500 border-rose-500' 
                         : 'text-neutral-400 border-transparent hover:text-neutral-600'
                     }`}
                   >
                     {tab}
                   </button>
                 ))}
             </div>
          </div>

          <div className="p-6 md:p-8 md:pt-6 space-y-8 flex-1">
            
            {/* Título e Preço */}
            <div className="space-y-4">
              <div className="flex justify-between items-start gap-4">
                <div>
                  <h2 className="text-3xl md:text-4xl font-serif font-bold text-neutral-800 leading-tight">
                    {produto.nome}
                  </h2>
                  <p className="text-neutral-500 mt-1 capitalize">Categoria: {produto.categoria}</p>
                </div>
                <button 
                  onClick={() => onToggleWishlist(produto.id)}
                  className={`p-3 rounded-full transition-all ${isWishlisted ? 'bg-rose-50 text-rose-500' : 'bg-white border border-neutral-200 text-neutral-400 hover:text-rose-400'}`}
                >
                  <Heart size={20} fill={isWishlisted ? "currentColor" : "none"} />
                </button>
              </div>

              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold text-rose-500">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(precoAtual)}
                </span>
                {precoOriginal > precoAtual && (
                  <span className="text-lg text-neutral-400 line-through decoration-rose-200">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(precoOriginal)}
                  </span>
                )}
                <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-md">
                  10% off no Pix
                </span>
              </div>

              <p className="text-neutral-600 leading-relaxed text-lg">
                {produto.descricao || "Perfeito para girar! Vestido romper com estampa floral delicada, unindo o charme do vestido com o conforto do romper."}
              </p>
            </div>

            {/* Seleção de Tamanho */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-bold text-neutral-800">Tamanho</span>
                <button className="text-rose-400 text-sm font-medium hover:underline flex items-center gap-1">
                  <Ruler size={14} /> Guia de medidas
                </button>
              </div>
              <div className="flex flex-wrap gap-3">
                {produto.tamanhos.map((tamanho) => (
                  <button
                    key={tamanho}
                    onClick={() => setTamanhoSelecionado(tamanho)}
                    className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold transition-all ${
                      tamanhoSelecionado === tamanho
                        ? 'bg-neutral-800 text-white shadow-lg scale-110'
                        : 'bg-white border border-neutral-200 text-neutral-600 hover:border-rose-300 hover:text-rose-500'
                    }`}
                  >
                    {tamanho}
                  </button>
                ))}
              </div>
            </div>

            {/* Tabs de Informação */}
            <div className="space-y-4">
               <div className="min-h-[120px] py-2">
                 {tabAtiva === 'detalhes' && (
                   <div className="space-y-4 animate-fade-in">
                     <div className="grid grid-cols-2 gap-4">
                       <div className="bg-white p-4 rounded-2xl border border-neutral-100">
                         <p className="text-xs text-neutral-400 uppercase font-bold mb-1">Material</p>
                         <p className="text-neutral-700 font-medium">Algodão macio</p>
                       </div>
                       <div className="bg-white p-4 rounded-2xl border border-neutral-100">
                         <p className="text-xs text-neutral-400 uppercase font-bold mb-1">Origem</p>
                         <p className="text-neutral-700 font-medium">Produção local</p>
                       </div>
                       <div className="bg-white p-4 rounded-2xl border border-neutral-100">
                         <p className="text-xs text-neutral-400 uppercase font-bold mb-1">Cuidados</p>
                         <p className="text-neutral-700 font-medium">Lavagem fria</p>
                       </div>
                       <div className="bg-white p-4 rounded-2xl border border-neutral-100">
                         <p className="text-xs text-neutral-400 uppercase font-bold mb-1">Garantia</p>
                         <p className="text-neutral-700 font-medium">12 meses</p>
                       </div>
                     </div>
                   </div>
                 )}

                 {tabAtiva === 'entrega' && (
                   <div className="space-y-4 animate-fade-in">
                      <div className="flex items-start gap-4 p-4 bg-white rounded-2xl border border-neutral-100">
                        <div className="p-2 bg-yellow-50 text-yellow-600 rounded-full"><Truck size={20} /></div>
                        <div>
                          <h4 className="font-bold text-neutral-800">Entrega acolhedora</h4>
                          <p className="text-sm text-neutral-500 mt-1">Grátis acima de R$ 300. Consulte prazos para sua região.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4 p-4 bg-white rounded-2xl border border-neutral-100">
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-full"><ShieldCheck size={20} /></div>
                        <div>
                          <h4 className="font-bold text-neutral-800">Pronto para envio</h4>
                          <p className="text-sm text-neutral-500 mt-1">Postamos em até 24h úteis com rastreio.</p>
                        </div>
                      </div>
                   </div>
                 )}

                 {tabAtiva === 'trocas' && (
                   <div className="flex items-start gap-4 p-4 bg-white rounded-2xl border border-neutral-100 animate-fade-in">
                      <div className="p-2 bg-purple-50 text-purple-600 rounded-full"><RotateCcw size={20} /></div>
                      <div>
                        <h4 className="font-bold text-neutral-800">Troca sem drama</h4>
                        <p className="text-sm text-neutral-500 mt-1">30 dias para trocas e ajustes. A primeira troca é por nossa conta.</p>
                      </div>
                   </div>
                 )}

                 {tabAtiva === 'avaliacoes' && (
                   <div className="flex items-start gap-4 p-4 bg-white rounded-2xl border border-neutral-100 animate-fade-in">
                      <div className="p-2 bg-orange-50 text-orange-500 rounded-full"><Star size={20} /></div>
                      <div>
                        <h4 className="font-bold text-neutral-800">Conforto aprovado</h4>
                        <p className="text-sm text-neutral-500 mt-1">4.8/5 em maciez, ajuste e durabilidade baseado em 128 avaliações.</p>
                      </div>
                   </div>
                 )}
               </div>
            </div>

          </div>

          {/* Footer Fixo Mobile/Desktop */}
          <div className="p-6 border-t border-neutral-100 bg-white/50 backdrop-blur-md sticky bottom-0">
            <button
              onClick={handleAddToCart}
              disabled={!tamanhoSelecionado}
              className={`w-full py-4 rounded-full font-bold text-lg flex items-center justify-center gap-3 transition-all shadow-xl ${
                tamanhoSelecionado 
                  ? 'bg-rose-500 text-white hover:bg-rose-600 hover:shadow-rose-200 hover:-translate-y-1' 
                  : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
              }`}
            >
              <ShoppingBag size={20} />
              {tamanhoSelecionado ? 'Colocar na sacola' : 'Selecione um tamanho'}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProductDetail;