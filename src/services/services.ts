import type { Category, Product } from "../types";
import supabase from "../utils/supabase";


export const servicesData = async (): Promise<Category[]> => {

 
  const { data, error } = await supabase
    .from("Categories")
    .select(
      `
      id,
      name,
      slug,
      products: Products (
        id,
        name,
        description,
        price,
        Currency,
        img_url,
        slug
      )
    `,
    )
   .order("created_at", { ascending: true})

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
      product_details
    `)
    .eq("slug", slug)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as Product;
};