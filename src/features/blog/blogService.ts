import supabase from "../../utils/supabase";
export interface BlogCategory { id:string; name:string; slug:string; description:string|null; display_order:number; }
export interface BlogPost { id:string; category_id:string; title:string; slug:string; content:{type?:string;content?:Array<Record<string,unknown>>}; status:"draft"|"published"|"archived"; service_recommendation_mode:"none"|"specific"|"all"; published_at:string|null; cover_image_url:string|null; cover_image_alt:string|null; home_order:number|null; featured_order:number|null; meta_title:string|null; meta_description:string|null; created_at:string; category?:BlogCategory; categories?:BlogCategory[]; }
const fields="id,category_id,title,slug,content,status,service_recommendation_mode,published_at,cover_image_url,cover_image_alt,home_order,featured_order,meta_title,meta_description,created_at";
export async function getBlogCategories():Promise<BlogCategory[]>{const {data,error}=await supabase.from("BlogPostCategories").select("category:BlogCategories!inner(id,name,slug,description,display_order),post:BlogPosts!inner(status)").eq("category.is_active",true).eq("post.status","published");if(error)throw error;const unique=new Map<string,BlogCategory>();for(const row of (data??[]) as unknown as Array<{category:BlogCategory|null}>){if(row.category)unique.set(row.category.id,row.category);}return [...unique.values()].sort((a,b)=>a.display_order-b.display_order||a.name.localeCompare(b.name,"es"));}
async function attachPrimaryCategories(posts: BlogPost[]): Promise<BlogPost[]> {
  if (posts.length === 0) return posts;
  const postIds = posts.map((post) => post.id);
  const primaryIds = [...new Set(posts.map((post) => post.category_id).filter(Boolean))];
  const [primaryResult, relationResult] = await Promise.all([
    primaryIds.length
      ? supabase.from("BlogCategories").select("id,name,slug,description,display_order").in("id", primaryIds)
      : Promise.resolve({ data: [], error: null }),
    supabase.from("BlogPostCategories")
      .select("post_id,category:BlogCategories!inner(id,name,slug,description,display_order)")
      .in("post_id", postIds)
      .eq("category.is_active", true),
  ]);
  if (primaryResult.error) console.error("No se pudieron cargar las categorías principales.", primaryResult.error);
  if (relationResult.error) console.error("No se pudieron cargar todas las categorías del artículo.", relationResult.error);
  const primaryById = new Map((primaryResult.data ?? []).map((category) => [category.id, category as BlogCategory]));
  const byPost = new Map<string, BlogCategory[]>();
  for (const row of (relationResult.data ?? []) as unknown as Array<{post_id:string;category:BlogCategory|null}>) {
    if (!row.category) continue;
    const list = byPost.get(row.post_id) ?? [];
    if (!list.some((category) => category.id === row.category!.id)) list.push(row.category);
    byPost.set(row.post_id, list);
  }
  return posts.map((post) => {
    const categories = (byPost.get(post.id) ?? []).sort((a,b) => a.display_order-b.display_order || a.name.localeCompare(b.name,"es"));
    const primary = primaryById.get(post.category_id) ?? categories.find((category) => category.id === post.category_id) ?? categories[0];
    return { ...post, category: primary, categories: categories.length ? categories : primary ? [primary] : [] };
  });
}

export async function getHomeBlogPosts(): Promise<BlogPost[]> {
  const { data, error } = await supabase
    .from("BlogPosts")
    .select(fields)
    .eq("status", "published")
    .not("home_order", "is", null)
    .order("home_order", { ascending: true })
    .limit(4);
  if (error) throw error;
  return attachPrimaryCategories((data ?? []) as unknown as BlogPost[]);
}

async function postIdsForCategory(categorySlug?: string): Promise<string[] | null> {
  if (!categorySlug) return null;
  const { data: category, error: categoryError } = await supabase
    .from("BlogCategories")
    .select("id")
    .eq("slug", categorySlug)
    .eq("is_active", true)
    .maybeSingle();
  if (categoryError) throw categoryError;
  if (!category) return [];
  const { data, error } = await supabase
    .from("BlogPostCategories")
    .select("post_id,post:BlogPosts!inner(status)")
    .eq("category_id", category.id)
    .eq("post.status", "published");
  if (error) throw error;
  return (data ?? []).map((row) => row.post_id as string);
}

export async function getFeaturedBlogPosts(categorySlug?: string): Promise<BlogPost[]> {
  const ids = await postIdsForCategory(categorySlug);
  if (ids && ids.length === 0) return [];
  let query = supabase
    .from("BlogPosts")
    .select(fields)
    .eq("status", "published")
    .not("featured_order", "is", null)
    .order("featured_order", { ascending: true })
    .order("published_at", { ascending: false, nullsFirst: false })
    .limit(3);
  if (ids) query = query.in("id", ids);
  const { data, error } = await query;
  if (error) throw error;
  return attachPrimaryCategories((data ?? []) as unknown as BlogPost[]);
}

export async function getPublishedBlogPosts(page = 0, pageSize = 9, categorySlug?: string): Promise<BlogPost[]> {
  const ids = await postIdsForCategory(categorySlug);
  if (ids && ids.length === 0) return [];
  let query = supabase
    .from("BlogPosts")
    .select(fields)
    .eq("status", "published")
    .is("featured_order", null)
    .order("published_at", { ascending: false, nullsFirst: false })
    .range(page * pageSize, page * pageSize + pageSize - 1);
  if (ids) query = query.in("id", ids);
  const { data, error } = await query;
  if (error) throw error;
  return attachPrimaryCategories((data ?? []) as unknown as BlogPost[]);
}

export async function getRecentBlogPosts(excludePostId: string, limit = 3): Promise<BlogPost[]> {
  const { data, error } = await supabase
    .from("BlogPosts")
    .select(fields)
    .eq("status", "published")
    .neq("id", excludePostId)
    .order("published_at", { ascending: false, nullsFirst: false })
    .limit(limit);
  if (error) throw error;
  return attachPrimaryCategories((data ?? []) as unknown as BlogPost[]);
}

export async function getPublishedBlogPost(slug: string): Promise<BlogPost | null> {
  const { data, error } = await supabase
    .from("BlogPosts")
    .select(fields)
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  const [post] = await attachPrimaryCategories([data as unknown as BlogPost]);
  return post;
}

export async function getRelatedPosts(postId:string):Promise<BlogPost[]>{const {data,error}=await supabase.from("BlogPostRelations").select(`related:BlogPosts!BlogPostRelations_related_post_id_fkey(${fields},category:BlogCategories(id,name,slug,description,display_order))`).eq("post_id",postId).order("display_order").limit(3);if(error)throw error;return(data??[]).map(row=>(row as unknown as {related:BlogPost}).related).filter(post=>post?.status==="published");}

export interface RelatedService { id:string; name:string; slug:string; description:string|null; img_url:string|null; }
export async function getRelatedServices(postId:string):Promise<RelatedService[]>{
  // Consultar la relación y el servicio en una sola petición evita perder la recomendación
  // cuando una de las consultas separadas no devuelve el mismo conjunto de filas.
  const {data:joined,error:joinError}=await supabase
    .from("BlogPostServices")
    .select("service_id,display_order,service:Products!BlogPostServices_service_id_fkey(id,name,slug,description,img_url)")
    .eq("post_id",postId)
    .order("display_order");
  if(!joinError){
    const services=(joined??[])
      .map(row=>(row as unknown as {service:RelatedService|null}).service)
      .filter((service):service is RelatedService=>Boolean(service?.id&&service.slug));
    if(services.length>0)return services;
  } else {
    console.error("No se pudo consultar el servicio relacionado mediante la relación directa.",joinError);
  }

  // Respaldo: cargar primero las relaciones y después los servicios.
  const {data:relations,error:relationsError}=await supabase
    .from("BlogPostServices")
    .select("service_id,display_order")
    .eq("post_id",postId)
    .order("display_order");
  if(relationsError)throw relationsError;
  const ids=(relations??[]).map(row=>row.service_id as string).filter(Boolean);
  if(ids.length===0)return [];
  const {data:services,error:servicesError}=await supabase
    .from("Products")
    .select("id,name,slug,description,img_url")
    .in("id",ids);
  if(servicesError)throw servicesError;
  const byId=new Map((services??[]).map(item=>[item.id,item as RelatedService]));
  return ids.map(id=>byId.get(id)).filter((item):item is RelatedService=>Boolean(item?.id&&item.slug));
}
