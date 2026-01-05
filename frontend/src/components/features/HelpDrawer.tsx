import React from 'react';
import { X, HelpCircle, Phone, MessageCircle, MapPin, Package } from 'lucide-react';

interface HelpDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const HelpDrawer: React.FC<HelpDrawerProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const faq = [
    {
      title: 'Guia de medidas',
      content: 'Use uma fita métrica e meça altura, peito e cintura. Compare com nossa tabela: P 2-3, M 4-6, G 8-10, GG 12+. Em dúvida? Escolha o maior.'
    },
    {
      title: 'Pedidos e entregas',
      content: 'Prazo padrão: 3-7 dias úteis. Assim que o pedido sai, enviamos código de rastreio por e-mail.'
    },
    {
      title: 'Trocas e devoluções',
      content: 'Você tem 7 dias após o recebimento para solicitar devolução ou 30 dias para troca por tamanho. Produto deve estar sem uso e com etiqueta.'
    },
    {
      title: 'Conta e senha',
      content: 'Para recuperar senha, use “Esqueci minha senha” no login. Se não recebeu e-mail, confira o spam ou solicite novamente.'
    }
  ];

  const contatos = [
    { icon: Phone, label: 'Telefone', value: '(11) 0000-0000' },
    { icon: MessageCircle, label: 'WhatsApp', value: '(11) 90000-0000' },
    { icon: Package, label: 'Rastrear pedido', value: 'Acesse seu histórico de pedidos' },
    { icon: MapPin, label: 'Endereços', value: 'Gerencie seus endereços salvos' }
  ];

  return (
    <div className="fixed inset-0 z-[60] overflow-hidden" role="dialog" aria-modal="true" aria-label="Central de ajuda">
      <div className="absolute inset-0 bg-neutral-800/40 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute inset-y-0 right-0 max-w-full flex">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col h-full animate-slide-in-right">
          <div className="flex items-center justify-between px-6 py-6 border-b border-rose-100 bg-white">
            <div className="flex items-center gap-3">
              <HelpCircle size={22} className="text-rose-500" />
              <div>
                <h2 className="text-xl font-serif font-bold text-neutral-900">Central de ajuda</h2>
                <p className="text-xs text-neutral-500">Medidas, pedidos, trocas e suporte</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-rose-50 rounded-full transition-colors text-neutral-500" aria-label="Fechar ajuda">
              <X size={24} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div className="bg-rose-50/60 border border-rose-100 rounded-2xl p-4">
              <p className="text-sm text-neutral-600 leading-relaxed">
                Precisa de ajuda para escolher o tamanho ou resolver um pedido? Veja as respostas rápidas ou fale com a gente.
              </p>
            </div>

            <div className="space-y-4">
              {faq.map((item) => (
                <div key={item.title} className="border border-neutral-100 rounded-xl p-4 bg-white shadow-[0_6px_24px_-12px_rgba(0,0,0,0.12)]">
                  <h3 className="text-sm font-bold text-neutral-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-neutral-600 leading-relaxed">{item.content}</p>
                </div>
              ))}
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-bold text-neutral-900">Atalhos rápidos</h4>
              <div className="grid grid-cols-2 gap-3">
                {contatos.map(({ icon: Icon, label, value }) => (
                  <button key={label} className="p-3 border border-neutral-100 rounded-xl bg-neutral-50 hover:border-rose-200 hover:bg-rose-50 text-left transition-colors flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-neutral-800 font-semibold text-sm">
                      <Icon size={16} className="text-rose-500" />
                      {label}
                    </div>
                    <span className="text-xs text-neutral-500">{value}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpDrawer;