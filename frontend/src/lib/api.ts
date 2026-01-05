const API_URL = import.meta.env.VITE_API_URL || '/api';

type RequestOptions = {
  token?: string;
};

export async function post<T>(path: string, body: unknown, options: RequestOptions = {}): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(options.token ? { Authorization: `Bearer ${options.token}` } : {})
    },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Erro ${res.status}`);
  }

  return res.json() as Promise<T>;
}
