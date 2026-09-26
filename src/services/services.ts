import type {
  Category,
  Product,
  ProductDetails,
  Testimonial,
} from "../types";
import supabase from "../utils/supabase";

export const servicesData = async (): Promise<Category[]> => {
  const { data, error } = await supabase
    .from("Categories")
    .select(`
      id,
      name,
      slug,
      products:Products (
        id,
        name,
        description,
        price,
        Currency,
        img_url,
        slug,
        show_on_home
      )
    `)
    .eq("products.show_on_home", true)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error:", error);
    return [];
  }

  return data as Category[];
};

export const getProductBySlug = async (
  slug: string
): Promise<Product> => {
  const { data, error } = await supabase
    .from("Products")
    .select(`
      id,
      name,
      description,
      price,
      Currency,
      img_url,
      slug,
      ProductDetails (
        id,
        product_id,
        contenido,
        variantes
      )
    `)
    .eq("slug", slug)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return {
    ...data,
    ProductDetails:
      data.ProductDetails as unknown as ProductDetails | null,
  };
};

export const getTestimonials = async (): Promise<Testimonial[]> => {
  const { data, error } = await supabase
    .from("Testimonials")
    .select("id, imagen, display_order")
    .order("display_order", { ascending: true });

  if (error) {
    console.error(
      "Error al obtener testimonios:",
      error,
    );

    return [];
  }

  return data as Testimonial[];
};

