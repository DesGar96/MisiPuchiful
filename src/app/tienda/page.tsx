import ProductGrid from "@/components/GridProductos";
import { Suspense } from "react";
import { Spinner } from "react-bootstrap";

export default function Tienda() {
  return (
    <Suspense fallback={<div className="text-center py-5"><Spinner animation="border" variant="success" /></div>}>
      <ProductGrid />
    </Suspense>
  );
}