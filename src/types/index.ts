export type ProductDetails = {
  id: string;
  product_id: string;
  contenido?: string;
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
  slug: string;
  ProductDetails?: ProductDetails | null;
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

export type Testimonial = {
  id: string;
  imagen: string;
  display_order: number;
};

export interface ServiceCardProps {
  producto: Product;
}

export interface CategorySectionProps {
  categoria: Category;
}