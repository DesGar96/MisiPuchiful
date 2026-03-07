import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  // Obtener la cookie de sesión
  const session = request.cookies.get('user_session');
  
  // Rutas que requieren autenticación
  const protectedPaths = [
    '/zonaPrivada',
    '/zonaPrivada/miPerfil',
    '/zonaPrivada/pedidos',
    '/zonaPrivada/resenas',
    '/miPerfil', // También protegemos /perfil directamente
  ];
  
  // Verificar si la ruta actual está protegida
  const isProtectedPath = protectedPaths.some(path => 
    request.nextUrl.pathname.startsWith(path)
  );
  
  // Si es una ruta protegida y no hay sesión, redirigir al inicio
  if (isProtectedPath && !session) {
    return NextResponse.redirect(new URL('/', request.url));
  }
  
  // Continuar normalmente
  return NextResponse.next();
}

// Configurar las rutas donde se ejecutará el middleware
export const config = {
  matcher: [
    '/zonaPrivada/:path*',
    '/perfil/:path*',
  ],
};