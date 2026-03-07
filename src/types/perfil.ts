export interface Direccion {
  tipo_via?: string;
  nombre_via?: string;
  numero_via?: string;
  piso?: string;
  codigo_postal?: string;
  ciudad?: string;
}

export interface UsuarioPerfil {
  id: number;
  nombre: string;
  email: string;
  rol: 'usuario' | 'admin';
  telefono?: string | null;
  direccion?: string | null;
  tipo_via?: string | null;
  nombre_via?: string | null;
  numero_via?: string | null;
  piso?: string | null;
  codigo_postal?: string | null;
  ciudad?: string | null;
}

export interface PerfilFormData {
  nombre: string;
  email: string;
  telefono: string;
  tipo_via: string;
  nombre_via: string;
  numero_via: string;
  piso: string;
  codigo_postal: string;
  ciudad: string;
  direccion: string;
  password: string;
  nuevaPassword: string;
  confirmarPassword: string;
}

export interface PerfilUpdateData {
  nombre: string;
  telefono: string;
  tipo_via: string;
  nombre_via: string;
  numero_via: string;
  piso: string;
  codigo_postal: string;
  ciudad: string;
  direccion: string;
  passwordActual?: string;
  nuevaPassword?: string;
}

export interface PerfilApiResponse {
  success: boolean;
  user?: UsuarioPerfil;
  error?: string;
  message?: string;
}