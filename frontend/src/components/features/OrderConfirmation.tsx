import React from 'react';
import { CheckCircle, Package, Calendar, ArrowRight, Copy } from 'lucide-react';

interface OrderConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  pedido: any; // Tipo do pedido
}

const OrderConfirmation: React.FC<OrderConfirmationProps> = ({ isOpen, onClose, pedido }) => {
  if (!isOpen || !pedido) return null;

  return (
    <div className="fixed inset-0 z-[80] bg-white overflow-y-auto animate-fade-in">
      <div className="min-h-screen flex flex-col items-center justify-center p-4 max-w-lg mx-auto text-center">
        
        <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mb-6 animate-bounce-slow">
          <CheckCircle size={48} className="text-emerald-500" />
        </div>

        <h1 className="text-3xl font-serif font-bold text-neutral-900 mb-2">Pedido Confirmado!</h1>
        <p className="text-neutral-500 mb-8">Obrigado pela sua compra. Enviamos os detalhes para o seu e-mail.</p>

        <div className="w-full bg-neutral-50 rounded-2xl border border-neutral-100 p-6 mb-8 text-left space-y-4">
          <div className="flex justify-between items-center pb-4 border-b border-neutral-200">
            <span className="text-sm text-neutral-500">Número do Pedido</span>
            <span className="font-mono font-bold text-neutral-800">#{pedido.id || '123456'}</span>
          </div>
          
          <div className="flex justify-between items-center pb-4 border-b border-neutral-200">
            <span className="text-sm text-neutral-500">Status</span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Pago
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-neutral-500">Previsão de Entrega</span>
            <span className="font-bold text-neutral-800">{pedido.frete?.prazo || '5 a 7 dias úteis'}</span>
          </div>
        </div>

        {pedido.pagamento?.metodo === 'pix' && (
           <div className="w-full bg-white border-2 border-emerald-100 rounded-2xl p-6 mb-8 shadow-sm">
              <p className="text-sm font-bold text-neutral-800 mb-4">Pagamento via Pix</p>
              <div className="aspect-square max-w-[200px] mx-auto bg-neutral-100 mb-4 flex items-center justify-center text-neutral-400 text-xs">
                 QR CODE AQUI
              </div>
              <div className="flex gap-2">
                 <input 
                    type="text" 
                    value="00020126580014br.gov.bcb.pix0136123e4567-e89b-12d3-a456-426614174000" 
                    readOnly
                    className="flex-1 bg-neutral-50 border border-neutral-200 rounded-lg px-3 py-2 text-xs text-neutral-500 truncate"
                 />
                 <button className="p-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition-colors">
                    <Copy size={18} />
                 </button>
              </div>
           </div>
        )}

        <button 
          onClick={onClose}
          className="w-full py-4 bg-neutral-900 text-white font-bold rounded-xl hover:bg-neutral-800 transition-all shadow-lg shadow-neutral-200 flex items-center justify-center gap-2"
        >
          Voltar para a Loja <ArrowRight size={18} />
        </button>

      </div>
    </div>
  );
};

export default OrderConfirmation;
