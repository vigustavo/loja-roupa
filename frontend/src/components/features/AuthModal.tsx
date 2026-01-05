import React, { useEffect, useState } from 'react';
import { X, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

type View = 'login' | 'register' | 'forgot' | 'reset';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { user, login, register, forgotPassword, resetPassword, logout } = useAuth();
  const [view, setView] = useState<View>('login');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [recoveryMethod, setRecoveryMethod] = useState<'email' | 'telefone' | 'cpf'>('email');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);

  // Sempre voltar para login ao abrir o modal
  useEffect(() => {
    if (isOpen) {
      setView('login');
      setMessage(null);
      setError(null);
      setEmail('');
      setPassword('');
      setName('');
      setUsername('');
      setConfirmPassword('');
      setResetToken('');
      setRecoveryMethod('email');
      setLoading(false);
      setShowLoginPassword(false);
      setShowRegisterPassword(false);
      setShowConfirmPassword(false);
      setShowResetPassword(false);
    }
  }, [isOpen]);

  const resetRegisterFields = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setUsername('');
    setName('');
  };

  const resetLoginFields = () => {
    setEmail('');
    setPassword('');
    setMessage(null);
    setError(null);
  };

  if (!isOpen) return null;

  const clearMessages = () => {
    setMessage(null);
    setError(null);
  };

  const handleLogin = async () => {
    clearMessages();
    setLoading(true);
    try {
      await login(email, password);
      setMessage('Login realizado');
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao entrar');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    clearMessages();
    if (password !== confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }
    setLoading(true);
    try {
      await register(name, email, password);
      setMessage('Conta criada');
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao cadastrar');
    } finally {
      setLoading(false);
    }
  };

  const handleForgot = async () => {
    clearMessages();
    setLoading(true);
    try {
      const token = await forgotPassword(email);
      setMessage(`Token gerado: ${token}`);
      setView('reset');
      setResetToken(token);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao solicitar reset');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    clearMessages();
    setLoading(true);
    try {
      await resetPassword(resetToken, password);
      setMessage('Senha redefinida');
      setView('login');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao redefinir senha');
    } finally {
      setLoading(false);
    }
  };

  const renderHeaderTitle = () => {
    if (user) return `Olá, ${user.name}`;
    switch (view) {
      case 'login':
        return 'Bem-vindo(a)';
      case 'register':
        return 'Criar conta';
      case 'forgot':
        return 'Esqueci a senha';
      case 'reset':
        return 'Redefinir senha';
      default:
        return '';
    }
  };

  const goBack = () => {
    clearMessages();
    if (view !== 'login') {
      resetLoginFields();
      setConfirmPassword('');
      setUsername('');
      setName('');
      setResetToken('');
      setRecoveryMethod('email');
      setView('login');
    }
  };

  return (
    <div className="fixed inset-0 z-[60] overflow-hidden" role="dialog" aria-modal="true" aria-label="Conta do usuário">
      <div className="absolute inset-0 bg-neutral-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute inset-y-0 right-0 max-w-full flex">
        <div className="relative w-screen max-w-md bg-white shadow-2xl flex flex-col h-full animate-slide-in-right transform transition-transform rounded-l-3xl border-l border-neutral-100 overflow-hidden">

          <div className="relative px-6 py-8 border-b border-rose-100 bg-white text-center">
            {view !== 'login' && !user && (
              <button
                onClick={goBack}
                className="p-2 rounded-full hover:bg-rose-50 text-neutral-500 absolute left-6 top-1/2 -translate-y-1/2"
                aria-label="Voltar"
              >
                <ArrowLeft size={18} />
              </button>
            )}
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-neutral-900 leading-tight">{renderHeaderTitle()}</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-rose-50 rounded-full transition-colors text-neutral-500 absolute right-6 top-1/2 -translate-y-1/2"
              aria-label="Fechar"
            >
              <X size={22} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {user ? (
              <div className="space-y-4">
                <div className="bg-rose-50 border border-rose-100 rounded-2xl p-4">
                  <p className="text-sm text-neutral-500">Logado como</p>
                  <p className="text-lg font-semibold text-neutral-800">{user.name}</p>
                  <p className="text-sm text-neutral-500">{user.email}</p>
                </div>
                <button
                  className="w-full py-3 rounded-full bg-neutral-900 text-white font-semibold hover:bg-neutral-800 transition-colors"
                  onClick={() => {
                    logout();
                    onClose();
                  }}
                >
                  Sair
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {message && <div className="text-sm text-green-600 bg-green-50 border border-green-100 rounded-2xl p-3">{message}</div>}
                {error && <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-2xl p-3">{error}</div>}

                {view === 'login' && (
                  <>
                    <div className="space-y-3 mt-2">
                      <div className="space-y-1">
                        <label className="text-sm font-medium text-neutral-700">Usuário</label>
                        <input
                          className="w-full rounded-2xl border border-neutral-200 px-4 py-3 focus:border-rose-300 focus:outline-none"
                          placeholder="Seu usuário"
                          type="text"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-sm font-medium text-neutral-700">Senha</label>
                        <div className="relative">
                          <input
                            className="w-full rounded-2xl border border-neutral-200 px-4 py-3 focus:border-rose-300 focus:outline-none pr-12"
                            placeholder="••••••••"
                            type={showLoginPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                          />
                          <button
                            type="button"
                            className="absolute inset-y-0 right-3 flex items-center text-neutral-400 hover:text-neutral-600"
                            onClick={() => setShowLoginPassword((prev) => !prev)}
                            aria-label={showLoginPassword ? 'Ocultar senha' : 'Mostrar senha'}
                          >
                            {showLoginPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end text-sm text-rose-500 font-semibold">
                      <button
                        className="hover:text-rose-600"
                        onClick={() => {
                          clearMessages();
                          setPassword('');
                          setConfirmPassword('');
                          setUsername('');
                          setName('');
                          setResetToken('');
                          setRecoveryMethod('email');
                          setView('forgot');
                        }}
                      >
                        Esqueci minha senha
                      </button>
                    </div>
                    <button
                      disabled={loading}
                      className="w-full py-3 rounded-full bg-rose-400 text-white font-semibold hover:bg-rose-500 disabled:opacity-60 transition-colors"
                      onClick={handleLogin}
                    >
                      {loading ? 'Entrando...' : 'Entrar'}
                    </button>
                    <div className="flex items-center gap-3">
                      <div className="h-px flex-1 bg-neutral-200" aria-hidden="true" />
                      <span className="text-xs text-neutral-500">ou</span>
                      <div className="h-px flex-1 bg-neutral-200" aria-hidden="true" />
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-neutral-700">Entrar com</p>
                      <div className="flex gap-3">
                        <button
                          type="button"
                          className="flex-1 flex items-center justify-center gap-2 rounded-2xl border border-neutral-200 px-4 py-2 hover:bg-neutral-50 transition-colors"
                          aria-label="Entrar com Google"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="h-5 w-5" aria-hidden="true" focusable="false">
                            <path fill="#EA4335" d="M24 9.5c3.14 0 5.32 1.36 6.54 2.5l4.78-4.68C31.79 4.07 28.24 2.5 24 2.5 14.64 2.5 6.51 8.73 3.5 17.1l5.93 4.6C10.94 14.36 16.9 9.5 24 9.5z" />
                            <path fill="#4285F4" d="M46.5 24.5c0-1.57-.14-3.05-.39-4.5H24v8.52h12.7c-.57 2.92-2.24 5.4-4.73 7.05l7.34 5.7C43.76 37.51 46.5 31.5 46.5 24.5z" />
                            <path fill="#FBBC05" d="M9.43 28.49c-.47-1.42-.73-2.94-.73-4.49s.26-3.07.73-4.49l-5.93-4.6C1.78 17.12 1 20.46 1 24s.78 6.88 2.5 9.58l5.93-5.09z" />
                            <path fill="#34A853" d="M24 47.5c6.24 0 11.48-2.04 15.3-5.53l-7.34-5.7c-2.03 1.37-4.64 2.23-7.96 2.23-6.1 0-11.16-4.12-12.98-9.71l-5.93 5.09C6.51 40.96 14.64 47.5 24 47.5z" />
                            <path fill="none" d="M1 1h46v46H1z" />
                          </svg>
                          <span className="text-sm font-semibold text-neutral-800">Google</span>
                        </button>
                        <button
                          type="button"
                          className="flex-1 flex items-center justify-center gap-2 rounded-2xl border border-neutral-200 px-4 py-2 hover:bg-neutral-50 transition-colors"
                          aria-label="Entrar com Facebook"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true" focusable="false">
                            <path fill="#1877F2" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 5 3.657 9.128 8.438 9.878V14.89H7.898v-2.89h2.54V9.797c0-2.507 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562v1.875h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 17 22 12z" />
                          </svg>
                          <span className="text-sm font-semibold text-neutral-800">Facebook</span>
                        </button>
                        <button
                          type="button"
                          className="flex-1 flex items-center justify-center gap-2 rounded-2xl border border-neutral-200 px-4 py-2 hover:bg-neutral-50 transition-colors"
                          aria-label="Entrar com Apple"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true" focusable="false">
                            <path fill="currentColor" d="M17.38 12.52c.02 2.2 1.93 2.93 1.95 2.94-.02.07-.3 1.04-.98 2.06-.59.9-1.2 1.8-2.16 1.82-.94.02-1.24-.58-2.31-.58-1.07 0-1.41.56-2.3.6-.92.04-1.62-.97-2.23-1.87-1.21-1.76-2.13-4.97-.89-7.14.62-1.07 1.74-1.76 2.95-1.78.92-.02 1.79.62 2.31.62.52 0 1.63-.77 2.75-.65.47.02 1.8.19 2.65 1.46-.07.05-1.58.9-1.54 2.52zM15.3 4.89c.5-.61.84-1.46.75-2.3-.73.03-1.62.49-2.14 1.1-.47.54-.88 1.42-.77 2.26.82.06 1.65-.41 2.16-1.06z" />
                          </svg>
                          <span className="text-sm font-semibold text-neutral-800">Apple</span>
                        </button>
                      </div>
                    </div>
                    <div className="text-sm text-center text-neutral-600">
                      Ainda não tem conta?{' '}
                      <button
                        className="text-rose-500 font-semibold"
                        onClick={() => {
                          clearMessages();
                          resetRegisterFields();
                          setView('register');
                        }}
                      >
                        Cadastre-se
                      </button>
                    </div>
                  </>
                )}

                {view === 'register' && (
                  <>
                    <div className="space-y-3">
                      <input
                        className="w-full rounded-2xl border border-neutral-200 px-4 py-3 focus:border-rose-300 focus:outline-none"
                        placeholder="Nome completo"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                      <input
                        className="w-full rounded-2xl border border-neutral-200 px-4 py-3 focus:border-rose-300 focus:outline-none"
                        placeholder="Nome de usuário"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                      />
                      <input
                        className="w-full rounded-2xl border border-neutral-200 px-4 py-3 focus:border-rose-300 focus:outline-none"
                        placeholder="E-mail"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                      <div className="relative">
                        <input
                          className="w-full rounded-2xl border border-neutral-200 px-4 py-3 focus:border-rose-300 focus:outline-none pr-12"
                          placeholder="Senha (mín. 6)"
                          type={showRegisterPassword ? 'text' : 'password'}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-3 flex items-center text-neutral-400 hover:text-neutral-600"
                          onClick={() => setShowRegisterPassword((prev) => !prev)}
                          aria-label={showRegisterPassword ? 'Ocultar senha' : 'Mostrar senha'}
                        >
                          {showRegisterPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                      <div className="relative">
                        <input
                          className="w-full rounded-2xl border border-neutral-200 px-4 py-3 focus:border-rose-300 focus:outline-none pr-12"
                          placeholder="Confirme a senha"
                          type={showConfirmPassword ? 'text' : 'password'}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-3 flex items-center text-neutral-400 hover:text-neutral-600"
                          onClick={() => setShowConfirmPassword((prev) => !prev)}
                          aria-label={showConfirmPassword ? 'Ocultar senha' : 'Mostrar senha'}
                        >
                          {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>
                    <button
                      disabled={loading}
                      className="w-full py-3 rounded-full bg-rose-400 text-white font-semibold hover:bg-rose-500 disabled:opacity-60 transition-colors"
                      onClick={handleRegister}
                    >
                      {loading ? 'Criando...' : 'Criar conta'}
                    </button>
                    <div className="flex items-center gap-3">
                      <div className="h-px flex-1 bg-neutral-200" aria-hidden="true" />
                      <span className="text-xs text-neutral-500">ou</span>
                      <div className="h-px flex-1 bg-neutral-200" aria-hidden="true" />
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-neutral-700">Criar com</p>
                      <div className="flex gap-3">
                        <button
                          type="button"
                          className="flex-1 flex items-center justify-center gap-2 rounded-2xl border border-neutral-200 px-4 py-2 hover:bg-neutral-50 transition-colors"
                          aria-label="Criar conta com Google"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="h-5 w-5" aria-hidden="true" focusable="false">
                            <path fill="#EA4335" d="M24 9.5c3.14 0 5.32 1.36 6.54 2.5l4.78-4.68C31.79 4.07 28.24 2.5 24 2.5 14.64 2.5 6.51 8.73 3.5 17.1l5.93 4.6C10.94 14.36 16.9 9.5 24 9.5z" />
                            <path fill="#4285F4" d="M46.5 24.5c0-1.57-.14-3.05-.39-4.5H24v8.52h12.7c-.57 2.92-2.24 5.4-4.73 7.05l7.34 5.7C43.76 37.51 46.5 31.5 46.5 24.5z" />
                            <path fill="#FBBC05" d="M9.43 28.49c-.47-1.42-.73-2.94-.73-4.49s.26-3.07.73-4.49l-5.93-4.6C1.78 17.12 1 20.46 1 24s.78 6.88 2.5 9.58l5.93-5.09z" />
                            <path fill="#34A853" d="M24 47.5c6.24 0 11.48-2.04 15.3-5.53l-7.34-5.7c-2.03 1.37-4.64 2.23-7.96 2.23-6.1 0-11.16-4.12-12.98-9.71l-5.93 5.09C6.51 40.96 14.64 47.5 24 47.5z" />
                            <path fill="none" d="M1 1h46v46H1z" />
                          </svg>
                          <span className="text-sm font-semibold text-neutral-800">Google</span>
                        </button>
                        <button
                          type="button"
                          className="flex-1 flex items-center justify-center gap-2 rounded-2xl border border-neutral-200 px-4 py-2 hover:bg-neutral-50 transition-colors"
                          aria-label="Criar conta com Facebook"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true" focusable="false">
                            <path fill="#1877F2" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 5 3.657 9.128 8.438 9.878V14.89H7.898v-2.89h2.54V9.797c0-2.507 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562v1.875h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 17 22 12z" />
                          </svg>
                          <span className="text-sm font-semibold text-neutral-800">Facebook</span>
                        </button>
                        <button
                          type="button"
                          className="flex-1 flex items-center justify-center gap-2 rounded-2xl border border-neutral-200 px-4 py-2 hover:bg-neutral-50 transition-colors"
                          aria-label="Criar conta com Apple"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true" focusable="false">
                            <path fill="currentColor" d="M17.38 12.52c.02 2.2 1.93 2.93 1.95 2.94-.02.07-.3 1.04-.98 2.06-.59.9-1.2 1.8-2.16 1.82-.94.02-1.24-.58-2.31-.58-1.07 0-1.41.56-2.3.6-.92.04-1.62-.97-2.23-1.87-1.21-1.76-2.13-4.97-.89-7.14.62-1.07 1.74-1.76 2.95-1.78.92-.02 1.79.62 2.31.62.52 0 1.63-.77 2.75-.65.47.02 1.8.19 2.65 1.46-.07.05-1.58.9-1.54 2.52zM15.3 4.89c.5-.61.84-1.46.75-2.3-.73.03-1.62.49-2.14 1.1-.47.54-.88 1.42-.77 2.26.82.06 1.65-.41 2.16-1.06z" />
                          </svg>
                          <span className="text-sm font-semibold text-neutral-800">Apple</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}

                {view === 'forgot' && (
                  <>
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-neutral-700">Como quer recuperar?</label>
                        <select
                          className="w-full rounded-2xl border border-neutral-200 px-4 py-2.5 bg-white focus:border-rose-300 focus:outline-none text-sm"
                          value={recoveryMethod}
                          onChange={(e) => setRecoveryMethod(e.target.value as 'email' | 'telefone' | 'cpf')}
                        >
                          <option value="email">E-mail</option>
                          <option value="telefone">Telefone</option>
                          <option value="cpf">CPF</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-neutral-700">Informe seu {recoveryMethod}</label>
                        <input
                          className="w-full rounded-2xl border border-neutral-200 px-4 py-3 focus:border-rose-300 focus:outline-none text-sm"
                          placeholder={`Digite seu ${recoveryMethod === 'cpf' ? 'CPF' : recoveryMethod}`}
                          type={recoveryMethod === 'email' ? 'email' : recoveryMethod === 'telefone' ? 'tel' : 'text'}
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                    </div>
                    <button
                      disabled={loading}
                      className="w-full py-3 rounded-full bg-rose-400 text-white font-semibold hover:bg-rose-500 disabled:opacity-60 transition-colors"
                      onClick={handleForgot}
                    >
                      {loading ? 'Enviando...' : 'Gerar token'}
                    </button>
                    <div className="text-sm text-center text-neutral-500">
                      Lembrou a senha?{' '}
                      <button
                        className="text-rose-500 font-semibold"
                        onClick={() => {
                          clearMessages();
                          resetLoginFields();
                          setConfirmPassword('');
                          setUsername('');
                          setName('');
                          setResetToken('');
                          setRecoveryMethod('email');
                          setView('login');
                        }}
                      >
                        Fazer login
                      </button>
                    </div>
                  </>
                )}

                {view === 'reset' && (
                  <>
                    <div className="space-y-3">
                      <input
                        className="w-full rounded-2xl border border-neutral-200 px-4 py-3 focus:border-rose-300 focus:outline-none"
                        placeholder="Token de reset"
                        value={resetToken}
                        onChange={(e) => setResetToken(e.target.value)}
                      />
                      <div className="relative">
                        <input
                          className="w-full rounded-2xl border border-neutral-200 px-4 py-3 focus:border-rose-300 focus:outline-none pr-12"
                          placeholder="Nova senha"
                          type={showResetPassword ? 'text' : 'password'}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-3 flex items-center text-neutral-400 hover:text-neutral-600"
                          onClick={() => setShowResetPassword((prev) => !prev)}
                          aria-label={showResetPassword ? 'Ocultar senha' : 'Mostrar senha'}
                        >
                          {showResetPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>
                    <button
                      disabled={loading}
                      className="w-full py-3 rounded-full bg-rose-400 text-white font-semibold hover:bg-rose-500 disabled:opacity-60 transition-colors"
                      onClick={handleReset}
                    >
                      {loading ? 'Redefinindo...' : 'Redefinir senha'}
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
