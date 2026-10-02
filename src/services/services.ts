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
      category_id,
      name,
      description,
      price,
      Currency,
      img_url,
      slug,
      show_on_home,
      ProductDetails (
        id,
        product_id,
        contenido,
        variantes
      )
    `)
    .eq("slug", slug)
    .eq("show_on_home", true)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      throw new Error("SERVICE_NOT_FOUND");
    }

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



export const getRelatedProducts = async (
  categoryId: string,
  currentSlug: string,
): Promise<Product[]> => {
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
      show_on_home
    `)
    .eq("category_id", categoryId)
    .eq("show_on_home", true)
    .neq("slug", currentSlug)
    .order("name", { ascending: true })
    .limit(3);

  if (error) {
    console.error("Error al obtener servicios relacionados:", error);
    return [];
  }

  return data as Product[];
};
