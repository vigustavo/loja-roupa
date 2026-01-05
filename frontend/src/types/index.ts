// src/types/index.ts

export type CategoriaId = 'todos' | 'novidades' | 'vestidos' | 'blusas' | 'calcas' | 'acessorios' | 'conjuntos';

export type AuthView = 'login' | 'cadastro';

export interface Produto {
  id: number;
  nome: string;
  preco: number;
  categoria: Exclude<CategoriaId, 'todos' | 'novidades'>;
  imagens: string[];
  imagem: string;
  novo: boolean;
  tamanhos: string[];
  descricao: string;
}

export type CarrinhoItem = Produto & {
  qtd: number;
  tamanho: string;
  imagemSelecionada: string;
};

export type ChatMessage = {
  tipo: 'bot' | 'user';
  texto: string;
};

export interface Usuario {
  nome: string;
  email: string;
}

export interface AuthFormState {
  nome: string;
  email: string;
  senha: string;
}