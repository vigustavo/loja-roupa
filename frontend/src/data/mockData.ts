// src/data/mockData.ts
import { Produto, CategoriaId } from '../types';

export const CATEGORIAS: Array<{ id: CategoriaId; nome: string }> = [
  { id: 'todos', nome: 'Início' },
  { id: 'vestidos', nome: 'Vestidos' },
  { id: 'blusas', nome: 'Blusas' },
  { id: 'calcas', nome: 'Calças & Shorts' },
  { id: 'acessorios', nome: 'Acessórios' },
  { id: 'conjuntos', nome: 'Conjuntos' }
];

export const PRODUTOS: Produto[] = [
  {
    id: 1,
    nome: 'Vestido Romper Jardim Encantado',
    preco: 149.90,
    categoria: 'vestidos',
    imagens: [
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTlc1MpfhU1c4qjkvcNyBipEHMD3tp9GcP8ikC10fJuJA&s',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQUo_CQ18fbcl8YjNsh_RKlZw5XCrCS11qVKg&s'
    ],
    imagem: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTlc1MpfhU1c4qjkvcNyBipEHMD3tp9GcP8ikC10fJuJA&s',
    novo: true,
    tamanhos: ['4', '6', '8', '10'],
    descricao: 'Perfeito para girar! Vestido romper com estampa floral delicada, unindo o charme do vestido com o conforto do romper.'
  },
  {
    id: 2,
    nome: 'Conjunto Diversão Colorida',
    preco: 98.00,
    categoria: 'conjuntos',
    imagens: [
      'https://images.unsplash.com/photo-1604467794349-0b74285de7e7?auto=format&fit=crop&q=80&w=800',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTnMHJZWH_FTACjs96ZcX6wH7PeYv0nPPzHPrcw5QmD2A&s',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQrKSgWbKARSWim1UgCQmXmnzbzBTmARTwEyv95gekHog&s'
    ],
    imagem: 'https://images.unsplash.com/photo-1604467794349-0b74285de7e7?auto=format&fit=crop&q=80&w=800',
    novo: true,
    tamanhos: ['2', '4', '6', '8'],
    descricao: 'Para brincar o dia todo. Camiseta de algodão orgânico e shortinho confortável com elástico na cintura.'
  },
  {
    id: 3,
    nome: 'Jardineira Jeans Mini',
    preco: 129.90,
    categoria: 'calcas',
    imagens: [
      'https://images.unsplash.com/photo-1519457431-44ccd64a579b?auto=format&fit=crop&q=80&w=800',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZXwtxq_eL_-8K8QevfstYarUwioWT9ZxQKQ&s'
    ],
    imagem: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&q=80&w=800',
    novo: false,
    tamanhos: ['2', '4', '6', '8', '10'],
    descricao: 'Conforto total para correr e pular. Tecido com elastano que não restringe os movimentos.'
  },
  {
    id: 7,
    nome: 'Blusa Gola Boneca',
    preco: 79.90,
    categoria: 'blusas',
    imagens: [
      'https://images.unsplash.com/photo-1515516089376-88db1e26e9c0?auto=format&fit=crop&q=80&w=800',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQzFu285UCEl-s895E-1sb8tdwx3r9_bSFvLA&s'
    ],
    imagem: 'https://images.unsplash.com/photo-1515516089376-88db1e26e9c0?auto=format&fit=crop&q=80&w=800',
    novo: false,
    tamanhos: ['4', '6', '8', '10'],
    descricao: 'Charme retrô. Blusa em tecido leve com gola boneca bordada, perfeita para compor looks arrumadinhos.'
  },
  {
    id: 8,
    nome: 'Sapatilha Bailarina',
    preco: 89.90,
    categoria: 'acessorios',
    imagens: [
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTkrMe57sTT1LZn9ilSFHy523bLlNlyd0lWlw&s',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTBoqvRPx6eA0leH7IN3P9FVXKGod9CLFAuEw&s'
    ],
    imagem: 'https://images.unsplash.com/photo-1519417688547-61e5d5338ab0?auto=format&fit=crop&q=80&w=800',
    novo: false,
    tamanhos: ['24', '26', '28', '30'],
    descricao: 'Para os pezinhos dançantes. Sapatilha confortável com fita de cetim e acabamento metalizado suave.'
  }
];