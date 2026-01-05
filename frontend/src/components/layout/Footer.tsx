import React, { useState, FormEvent } from 'react';
import { Sun, Instagram, Facebook, Twitter, Check, ShieldCheck } from 'lucide-react';

const Footer: React.FC = () => {
  const [emailNewsletter, setEmailNewsletter] = useState('');
  const [newsletterSucesso, setNewsletterSucesso] = useState(false);

  const handleNewsletterSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!emailNewsletter) return;
    setNewsletterSucesso(true);
    setEmailNewsletter('');
    setTimeout(() => setNewsletterSucesso(false), 5000);
  };

  return (
    <footer className="bg-white border-t border-neutral-100 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-2 md:col-span-1">
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
          
          <div className="col-span-1">
            <h4 className="font-bold text-neutral-800 mb-6">Explorar</h4>
            <ul className="space-y-3 text-sm text-neutral-500">
              {['Nossa História', 'Sustentabilidade', 'Blog da Mamãe', 'Trabalhe Conosco'].map((item) => (
                <li key={item}><a href="#" className="hover:text-rose-400 transition-colors">{item}</a></li>
              ))}
            </ul>
          </div>

          <div className="col-span-1">
             <h4 className="font-bold text-neutral-800 mb-6">Ajuda</h4>
             <ul className="space-y-3 text-sm text-neutral-500">
               {['Trocas e Devoluções', 'Guia de Medidas', 'Prazos de Entrega', 'Fale Conosco'].map((item) => (
                 <li key={item}><a href="#" className="hover:text-rose-400 transition-colors">{item}</a></li>
               ))}
             </ul>
           </div>

          <div className="col-span-2 md:col-span-1 bg-yellow-50/50 p-6 rounded-3xl border border-yellow-100">
            <h4 className="font-bold text-neutral-800 mb-2">Fique por dentro</h4>
            <p className="text-xs text-neutral-500 mb-4">Cadastre-se para receber novidades e ofertas exclusivas.</p>
            
            {newsletterSucesso ? (
              <div className="bg-green-100 text-green-700 px-4 py-3 rounded-xl text-sm flex items-center gap-2 font-medium">
                <Check size={16} /> Tudo certo! Verifique seu e-mail.
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col gap-3">
                <input
                  type="email"
                  value={emailNewsletter}
                  onChange={(e) => setEmailNewsletter(e.target.value)}
                  placeholder="Seu melhor e-mail"
                  required
                  className="bg-white border-none py-3 px-4 rounded-xl text-sm w-full focus:ring-2 focus:ring-rose-300 outline-none text-neutral-800 placeholder:text-neutral-400"
                />
                <button type="submit" className="bg-neutral-900 text-white px-4 py-3 text-sm font-bold hover:bg-neutral-800 transition-colors rounded-xl shadow-sm uppercase tracking-wider">
                  Receber Novidades
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
      <div className="bg-neutral-50/70 border-t border-neutral-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8 text-sm">
            <div>
              <h4 className="font-bold text-neutral-800 mb-4">Formas de Pagamento</h4>
              <div className="flex flex-wrap gap-2 items-center">
                <img src="https://via.placeholder.com/40x25/ccc/fff?text=V" alt="Visa" className="h-6 rounded-sm" />
                <img src="https://via.placeholder.com/40x25/ccc/fff?text=M" alt="Mastercard" className="h-6 rounded-sm" />
                <img src="https://via.placeholder.com/40x25/ccc/fff?text=P" alt="Pix" className="h-6 rounded-sm" />
                <img src="https://via.placeholder.com/40x25/ccc/fff?text=B" alt="Boleto" className="h-6 rounded-sm" />
              </div>
            </div>
            <div>
              <h4 className="font-bold text-neutral-800 mb-4">Segurança</h4>
              <div className="flex items-center gap-3">
                <ShieldCheck size={32} className="text-neutral-400" />
                <div>
                  <p className="text-neutral-600">Compra 100% segura</p>
                  <p className="text-xs text-neutral-400">Certificado SSL</p>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-neutral-200/60 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-neutral-500 gap-4">
            <p>© 2025 Lumina Kids Store. Todos os direitos reservados. CNPJ 00.000.000/0000-00</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-rose-400">Política de Privacidade</a>
              <a href="#" className="hover:text-rose-400">Termos de Uso</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;