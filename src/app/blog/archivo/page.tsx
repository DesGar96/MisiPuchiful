import BlogArchivo from '@/components/BlogArchivo';
import { Suspense } from 'react';
import { Spinner } from 'react-bootstrap';

export const metadata = {
  title: 'Todos los posts - Blog de Misipuchiful',
  description: 'Todos los artículos del blog de Misipuchiful',
};

export default function ArchivoPage() {
  return (
    <Suspense fallback={
      <div className="text-center py-5">
        <Spinner animation="border" variant="success" />
        <p className="mt-3">Cargando todos los posts...</p>
      </div>
    }>
      <BlogArchivo />
    </Suspense>
  );
}