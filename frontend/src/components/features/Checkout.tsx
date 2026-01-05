import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, MapPin, Truck, CreditCard, User, CheckCircle, Lock } from 'lucide-react';
import { CarrinhoItem } from '../../types';

interface CheckoutProps {
  isOpen: boolean;
  onClose: () => void;
  itens: CarrinhoItem[];
  total: number;
  onFinalizarCompra: (dados: any) => void;
}

const Checkout: React.FC<CheckoutProps> = ({ isOpen, onClose, itens, total, onFinalizarCompra }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  // Dados do Formulário
  const [formData, setFormData] = useState({
    // Cliente
    nome: '',
    cpf: '',
    email: '',
    telefone: '',
    
    // Endereço
    cep: '',
    rua: '',
    numero: '',
    complemento: '',
    cidade: '',
    estado: '',
    
    // Pagamento
    formaPagamento: 'pix' as 'pix' | 'credito' | 'debito',
    cartaoNumero: '',
    cartaoNome: '',
    cartaoValidade: '',
    cartaoCvv: '',
    parcelas: 1
  });

  // Frete Mockado
  const [freteSelecionado, setFreteSelecionado] = useState<{tipo: string, valor: number, prazo: string} | null>(null);
  
  const opcoesFrete = [
    { tipo: 'Econômico', valor: 15.90, prazo: '5 a 7 dias úteis' },
    { tipo: 'Expresso', valor: 29.90, prazo: '2 a 3 dias úteis' }
  ];

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // Auto-preenchimento de CEP (Simulado)
  const handleCepBlur = () => {
    if (formData.cep.length >= 8) {
      // Aqui entraria a chamada para API de CEP
      // Simulando preenchimento
      setFormData(prev => ({
        ...prev,
        rua: 'Rua das Flores',
        cidade: 'São Paulo',
        estado: 'SP'
      }));
      // Seleciona frete padrão
      setFreteSelecionado(opcoesFrete[0]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simula processamento
    setTimeout(() => {
      setLoading(false);
      onFinalizarCompra({
        cliente: {
            nome: formData.nome,
            cpf: formData.cpf,
            email: formData.email,
            telefone: formData.telefone
        },
        endereco: {
            cep: formData.cep,
            rua: formData.rua,
            numero: formData.numero,
            complemento: formData.complemento,
            cidade: formData.cidade,
            estado: formData.estado
        },
        pagamento: {
            metodo: formData.formaPagamento,
            parcelas: formData.parcelas
        },
        itens,
        frete: freteSelecionado,
        total: total + (freteSelecionado?.valor || 0)
      });
    }, 2000);
  };

  if (!isOpen) return null;

  const totalFinal = total + (freteSelecionado?.valor || 0);

  return (
    <div className="fixed inset-0 z-[70] bg-neutral-50 overflow-y-auto animate-fade-in">
      {/* Header */}
      <header className="bg-white border-b border-neutral-200 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
          <button onClick={onClose} className="flex items-center gap-2 text-neutral-600 hover:text-rose-500 font-medium">
            <ChevronLeft size={20} /> Voltar
          </button>
          <h1 className="text-lg font-serif font-bold text-neutral-800">Finalizar Compra</h1>
          <div className="w-20"></div> {/* Espaçador para centralizar título */}
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8 pb-24">
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* 1. Dados do Cliente */}
          <section className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-100">
            <div className="flex items-center gap-3 mb-6 border-b border-neutral-100 pb-4">
              <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center">
                <User size={20} />
              </div>
              <h2 className="text-xl font-bold text-neutral-800">Dados Pessoais</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-neutral-700 mb-1">Nome Completo</label>
                <input 
                  type="text" 
                  name="nome"
                  required
                  value={formData.nome}
                  onChange={handleInputChange}
                  className="w-full p-3 rounded-xl border border-neutral-200 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 outline-none"
                  placeholder="Como no seu documento"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">CPF</label>
                <input 
                  type="text" 
                  name="cpf"
                  required
                  value={formData.cpf}
                  onChange={handleInputChange}
                  className="w-full p-3 rounded-xl border border-neutral-200 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 outline-none"
                  placeholder="000.000.000-00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Telefone</label>
                <input 
                  type="tel" 
                  name="telefone"
                  required
                  value={formData.telefone}
                  onChange={handleInputChange}
                  className="w-full p-3 rounded-xl border border-neutral-200 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 outline-none"
                  placeholder="(00) 00000-0000"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-neutral-700 mb-1">E-mail</label>
                <input 
                  type="email" 
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full p-3 rounded-xl border border-neutral-200 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 outline-none"
                  placeholder="seu@email.com"
                />
              </div>
            </div>
          </section>

          {/* 2. Endereço */}
          <section className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-100">
            <div className="flex items-center gap-3 mb-6 border-b border-neutral-100 pb-4">
              <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center">
                <MapPin size={20} />
              </div>
              <h2 className="text-xl font-bold text-neutral-800">Entrega</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">CEP</label>
                <input 
                  type="text" 
                  name="cep"
                  required
                  value={formData.cep}
                  onChange={handleInputChange}
                  onBlur={handleCepBlur}
                  className="w-full p-3 rounded-xl border border-neutral-200 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 outline-none"
                  placeholder="00000-000"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-neutral-700 mb-1">Rua</label>
                <input 
                  type="text" 
                  name="rua"
                  required
                  value={formData.rua}
                  onChange={handleInputChange}
                  className="w-full p-3 rounded-xl border border-neutral-200 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Número</label>
                <input 
                  type="text" 
                  name="numero"
                  required
                  value={formData.numero}
                  onChange={handleInputChange}
                  className="w-full p-3 rounded-xl border border-neutral-200 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Complemento</label>
                <input 
                  type="text" 
                  name="complemento"
                  value={formData.complemento}
                  onChange={handleInputChange}
                  className="w-full p-3 rounded-xl border border-neutral-200 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 outline-none"
                  placeholder="Apto, Bloco, etc."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Cidade</label>
                <input 
                  type="text" 
                  name="cidade"
                  required
                  value={formData.cidade}
                  onChange={handleInputChange}
                  className="w-full p-3 rounded-xl border border-neutral-200 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 outline-none bg-neutral-50"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Estado</label>
                <input 
                  type="text" 
                  name="estado"
                  required
                  value={formData.estado}
                  onChange={handleInputChange}
                  className="w-full p-3 rounded-xl border border-neutral-200 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 outline-none bg-neutral-50"
                  readOnly
                />
              </div>
            </div>

            {/* Opções de Frete */}
            {formData.cep.length >= 8 && (
              <div className="mt-6 pt-6 border-t border-neutral-100">
                <h3 className="font-bold text-neutral-800 mb-4 flex items-center gap-2">
                  <Truck size={18} className="text-rose-500" /> Opções de Frete
                </h3>
                <div className="space-y-3">
                  {opcoesFrete.map((opcao) => (
                    <label key={opcao.tipo} className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${freteSelecionado?.tipo === opcao.tipo ? 'border-rose-500 bg-rose-50' : 'border-neutral-200 hover:border-rose-200'}`}>
                      <div className="flex items-center gap-3">
                        <input 
                          type="radio" 
                          name="frete" 
                          checked={freteSelecionado?.tipo === opcao.tipo}
                          onChange={() => setFreteSelecionado(opcao)}
                          className="text-rose-500 focus:ring-rose-500"
                        />
                        <div>
                          <p className="font-bold text-neutral-800">{opcao.tipo}</p>
                          <p className="text-xs text-neutral-500">Chega em {opcao.prazo}</p>
                        </div>
                      </div>
                      <span className="font-bold text-rose-500">R$ {opcao.valor.toFixed(2).replace('.', ',')}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </section>

          {/* 3. Pagamento */}
          <section className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-100">
            <div className="flex items-center gap-3 mb-6 border-b border-neutral-100 pb-4">
              <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center">
                <CreditCard size={20} />
              </div>
              <h2 className="text-xl font-bold text-neutral-800">Pagamento</h2>
            </div>

            <div className="grid grid-cols-3 gap-2 mb-6">
              {[
                { id: 'pix', label: 'Pix', icon: '💠' },
                { id: 'credito', label: 'Crédito', icon: '💳' },
                { id: 'debito', label: 'Débito', icon: '💳' }
              ].map((metodo) => (
                <button
                  key={metodo.id}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, formaPagamento: metodo.id as any }))}
                  className={`p-3 rounded-xl border font-medium text-sm flex flex-col items-center gap-2 transition-all ${formData.formaPagamento === metodo.id ? 'border-rose-500 bg-rose-50 text-rose-600' : 'border-neutral-200 text-neutral-600 hover:bg-neutral-50'}`}
                >
                  <span className="text-xl">{metodo.icon}</span>
                  {metodo.label}
                </button>
              ))}
            </div>

            {formData.formaPagamento === 'pix' && (
              <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 text-center">
                <p className="text-emerald-800 font-medium mb-2">Pagamento via Pix</p>
                <p className="text-sm text-emerald-600">Aprovação imediata. Você receberá o código QR Code na próxima tela.</p>
                <div className="mt-3 inline-block bg-white px-3 py-1 rounded-full text-xs font-bold text-emerald-600 border border-emerald-200">
                  -10% de desconto aplicado
                </div>
              </div>
            )}

            {(formData.formaPagamento === 'credito' || formData.formaPagamento === 'debito') && (
              <div className="space-y-4 animate-fade-in">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Número do Cartão</label>
                  <input 
                    type="text" 
                    name="cartaoNumero"
                    value={formData.cartaoNumero}
                    onChange={handleInputChange}
                    className="w-full p-3 rounded-xl border border-neutral-200 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 outline-none"
                    placeholder="0000 0000 0000 0000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Nome no Cartão</label>
                  <input 
                    type="text" 
                    name="cartaoNome"
                    value={formData.cartaoNome}
                    onChange={handleInputChange}
                    className="w-full p-3 rounded-xl border border-neutral-200 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 outline-none"
                    placeholder="COMO NO CARTAO"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">Validade</label>
                    <input 
                      type="text" 
                      name="cartaoValidade"
                      value={formData.cartaoValidade}
                      onChange={handleInputChange}
                      className="w-full p-3 rounded-xl border border-neutral-200 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 outline-none"
                      placeholder="MM/AA"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">CVV</label>
                    <input 
                      type="text" 
                      name="cartaoCvv"
                      value={formData.cartaoCvv}
                      onChange={handleInputChange}
                      className="w-full p-3 rounded-xl border border-neutral-200 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 outline-none"
                      placeholder="123"
                    />
                  </div>
                </div>
                {formData.formaPagamento === 'credito' && (
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">Parcelamento</label>
                    <select 
                      name="parcelas"
                      value={formData.parcelas}
                      onChange={handleInputChange}
                      className="w-full p-3 rounded-xl border border-neutral-200 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 outline-none bg-white"
                    >
                      {[1, 2, 3, 4, 5, 6].map(p => (
                        <option key={p} value={p}>{p}x de R$ {(totalFinal / p).toFixed(2).replace('.', ',')} sem juros</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            )}
          </section>

          {/* Resumo e Botão Final */}
          <section className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-100 sticky bottom-4">
            <div className="space-y-2 mb-4 text-sm">
              <div className="flex justify-between text-neutral-600">
                <span>Subtotal ({itens.length} itens)</span>
                <span>R$ {total.toFixed(2).replace('.', ',')}</span>
              </div>
              <div className="flex justify-between text-neutral-600">
                <span>Frete</span>
                <span>{freteSelecionado ? `R$ ${freteSelecionado.valor.toFixed(2).replace('.', ',')}` : 'Calculando...'}</span>
              </div>
              {formData.formaPagamento === 'pix' && (
                <div className="flex justify-between text-emerald-600 font-medium">
                  <span>Desconto Pix (10%)</span>
                  <span>- R$ {(total * 0.1).toFixed(2).replace('.', ',')}</span>
                </div>
              )}
              <div className="flex justify-between text-lg font-bold text-neutral-900 pt-2 border-t border-neutral-100">
                <span>Total</span>
                <span>R$ {(formData.formaPagamento === 'pix' ? totalFinal * 0.9 : totalFinal).toFixed(2).replace('.', ',')}</span>
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-rose-500 text-white font-bold rounded-xl hover:bg-rose-600 transition-all shadow-lg shadow-rose-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>Processando...</>
              ) : (
                <>
                  <Lock size={18} /> Pagar Agora
                </>
              )}
            </button>
            
            <div className="mt-3 flex items-center justify-center gap-2 text-xs text-neutral-400">
              <Lock size={12} /> Ambiente 100% Seguro
            </div>
          </section>

        </form>
      </main>
    </div>
  );
};

export default Checkout;
