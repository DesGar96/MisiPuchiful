import BlogNovedades from '@/components/BlogNovedades';
import { Suspense } from 'react';
import { Spinner } from 'react-bootstrap';

export const metadata = {
  title: 'Novedades - Blog de Misipuchiful',
  description: 'Las últimas novedades del blog de Misipuchiful',
};

export default function BlogPage() {
  return (
    <Suspense fallback={
      <div className="text-center py-5">
        <Spinner animation="border" variant="success" />
        <p className="mt-3">Cargando novedades...</p>
      </div>
    }>
      <BlogNovedades />
    </Suspense>
  );
}