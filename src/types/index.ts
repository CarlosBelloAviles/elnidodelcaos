export type ProductDetails = {
  resumen: string;
  descripcion: string;

  beneficios?: string[];
  para_que_sirve?: string[];
  incluye?: string[];
  caracteristicas?: string[];

  duracion?: string;
  como_funciona?: string;

  variantes?: {
    nombre: string;
    precio: number;
    duracion?: string;
  }[];
};

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  Currency: string;
  img_url: string;
  product_details: ProductDetails;
  slug: string;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  products: Product[];
};

export type Testimonials = {
  id: number;
  imagen: string;
};

export interface ServiceCardProps {
  producto: Product;
}

export interface CategorySectionProps {
  categoria: Category;
}

export interface DetailListProps {
  title: string;
  items?: string | string[];
}