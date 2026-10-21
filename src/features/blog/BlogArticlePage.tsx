import {useEffect,useState,type ReactNode} from "react";
import {Link,useParams} from "react-router-dom";
import {ArrowLeft,ArrowRight,Pause,Play,RotateCcw,Volume2} from "lucide-react";
import SEO from "../../Components/SEO";
import {getPublishedBlogPost,getRecentBlogPosts,getRelatedServices,type BlogPost,type RelatedService} from "./blogService";
function excerpt(post:BlogPost){return post.meta_description?.trim()||"Artículos y lecturas de El Nido del Caos."; }
function renderInline(node:Record<string,unknown>,key:number):ReactNode{
 if(typeof node.text!=="string")return null;
 let value:ReactNode=node.text;
 const marks=Array.isArray(node.marks)?node.marks as Record<string,unknown>[]:[];
 marks.forEach((mark,index)=>{const attrs=(mark.attrs||{}) as {href?:string};if(mark.type==="bold")value=<strong key={index}>{value}</strong>;else if(mark.type==="italic")value=<em key={index}>{value}</em>;else if(mark.type==="strike")value=<s key={index}>{value}</s>;else if(mark.type==="superscript")value=<sup key={index}>{value}</sup>;else if(mark.type==="subscript")value=<sub key={index}>{value}</sub>;else if(mark.type==="textColor"){const color=(mark.attrs as {color?:unknown}|undefined)?.color;if(typeof color==="string"&&/^#[0-9a-fA-F]{6}$/.test(color))value=<span key={index} style={{color}}>{value}</span>;}else if(mark.type==="code")value=<code key={index} className="rounded bg-[#21172b] px-1.5 py-0.5 text-sm text-[#f0d98a]">{value}</code>;else if(mark.type==="link"&&attrs.href&&/^(https?:\/\/|mailto:)/i.test(attrs.href))value=<a key={index} href={attrs.href} target={attrs.href.startsWith("mailto:")?"_self":"_blank"} rel="noopener noreferrer" className="text-[#e2c56c] underline underline-offset-4 hover:text-[#fff0b8]">{value}</a>;});
 return <span key={key}>{value}</span>;
}
function ContentNode({node}:{node:Record<string,unknown>}){
 const type=String(node.type||"paragraph");
 const children=Array.isArray(node.content)?node.content as Record<string,unknown>[]:[];
 const attrs=(node.attrs||{}) as {level?:number;textAlign?:string;src?:string;alt?:string;caption?:string};
 const textAlign=["left","center","right","justify"].includes(attrs.textAlign||"")?attrs.textAlign as "left"|"center"|"right"|"justify":undefined;
 if(type==="text")return renderInline(node,0);
 if(type==="heading"){const content=children.map((child,i)=>renderInline(child,i));return attrs.level===3?<h3 style={{textAlign}} className="pt-3 font-serif text-xl text-[#f0d98a] sm:text-2xl">{content}</h3>:<h2 style={{textAlign}} className="pt-4 font-serif text-2xl text-[#f4df9b] sm:text-3xl">{content}</h2>;}
 if(type==="bulletList"||type==="orderedList"){const ListTag=type==="orderedList"?"ol":"ul";return <ListTag className={type==="orderedList"?"list-decimal space-y-2 pl-6 marker:text-[#d4af37]":"list-disc space-y-2 pl-6 marker:text-[#d4af37]"}>{children.map((item,i)=><li key={i}>{(Array.isArray(item.content)?item.content as Record<string,unknown>[]:[]).map((child,j)=><ContentNode key={j} node={child}/>)}</li>)}</ListTag>;}
 if(type==="listItem")return <>{children.map((child,i)=><ContentNode key={i} node={child}/>)}</>;
 if(type==="blockquote")return <blockquote className="border-l-2 border-[#d4af37] bg-[#100b17]/80 px-5 py-3 italic text-[#e7d8b0]">{children.map((child,i)=><ContentNode key={i} node={child}/>)}</blockquote>;
 if(type==="horizontalRule")return <hr className="my-8 border-0 border-t border-[rgba(212,175,55,0.45)]"/>;
 if(type==="table")return <div className="my-8 max-w-full overflow-x-auto rounded-lg border border-[rgba(212,175,55,0.25)]"><table className="w-full min-w-[360px] border-collapse text-left"><tbody>{children.map((child,i)=><ContentNode key={i} node={child}/>)}</tbody></table></div>;
 if(type==="tableRow")return <tr className="border-b border-[rgba(212,175,55,0.2)] last:border-b-0">{children.map((child,i)=><ContentNode key={i} node={child}/>)}</tr>;
 if(type==="tableHeader")return <th className="bg-[#21172b] px-3 py-3 font-semibold text-[#f4df9b] sm:px-4">{children.map((child,i)=><ContentNode key={i} node={child}/>)}</th>;
 if(type==="tableCell")return <td className="px-3 py-3 align-top sm:px-4">{children.map((child,i)=><ContentNode key={i} node={child}/>)}</td>;
 if(type==="image"){if(!attrs.src||!/^https:\/\//i.test(attrs.src))return null;return <figure className="my-8"><img src={attrs.src} alt={attrs.alt||""} loading="lazy" className="mx-auto max-h-[520px] rounded-lg object-contain"/>{typeof attrs.caption==="string"&&attrs.caption.trim()&&<figcaption className="mt-3 text-center text-sm italic text-[#bdb2c9]">{attrs.caption}</figcaption>}</figure>;}
 if(type==="paragraph")return <p style={{textAlign}}>{children.map((child,i)=>child.type==="text"?renderInline(child,i):<ContentNode key={i} node={child}/>)}</p>;
 return <div>{children.map((child,i)=><ContentNode key={i} node={child}/>)}</div>;
}

function speechTextFromNode(node:Record<string,unknown>):string{
 const type=String(node.type||"");
 if(type==="text")return typeof node.text==="string"?node.text:"";
 const children=Array.isArray(node.content)?node.content as Record<string,unknown>[]:[];
 const text=children.map(speechTextFromNode).join(type==="listItem"?" ": "");
 if(["paragraph","heading","blockquote","listItem","tableRow","tableCell","tableHeader"].includes(type))return text.trim()?" "+text.trim()+". ":"";
 return text;
}
function splitSpeechText(text:string,maxLength=220):string[]{
 const normalized=text.replace(/\\s+/g," ").trim();
 if(!normalized)return [];
 const sentences=normalized.match(/[^.!?。！？]+[.!?。！？]+|[^.!?。！？]+$/g)||[normalized];
 const chunks:string[]=[];let current="";
 for(const sentence of sentences){
  const part=sentence.trim();if(!part)continue;
  if(current&&(current.length+part.length+1>maxLength)){chunks.push(current.trim());current="";}
  if(part.length>maxLength){
   for(let start=0;start<part.length;start+=maxLength){const piece=part.slice(start,start+maxLength).trim();if(piece)chunks.push(piece);}
  }else current+=(current?" ":"")+part;
 }
 if(current.trim())chunks.push(current.trim());
 return chunks;
}
function BlogAudioReader({title,description,content}:{title:string;description:string|null;content:{content?:Array<Record<string,unknown>>}|null}){
 const [supported,setSupported]=useState(false);
 const [status,setStatus]=useState<"idle"|"playing"|"paused"|"done"|"error">("idle");
 const [speed,setSpeed]=useState(1);
 const [voiceLabel,setVoiceLabel]=useState("Voz en español disponible en tu dispositivo");
 const chunksRef=useRef<string[]>([]);
 const indexRef=useRef(0);
 const speedRef=useRef(1);
 const activeRef=useRef(false);
 const runChunkRef=useRef<()=>void>(()=>{});
 const speechText=useMemo(()=>[title,description||"",...(content?.content||[]).map(speechTextFromNode)].join(". ").replace(/\\s+/g," ").trim(),[title,description,content]);
 useEffect(()=>{
  const available=typeof window!=="undefined"&&"speechSynthesis" in window&&"SpeechSynthesisUtterance" in window;
  setSupported(available);
  if(!available)return;
  const updateVoice=()=>{
   const voices=window.speechSynthesis.getVoices();
   const voice=voices.find(item=>/^es-CL$/i.test(item.lang))||voices.find(item=>/^es(-|$)/i.test(item.lang));
   if(voice)setVoiceLabel(voice.name+" · "+voice.lang);
  };
  updateVoice();window.speechSynthesis.addEventListener?.("voiceschanged",updateVoice);
  return()=>{window.speechSynthesis.removeEventListener?.("voiceschanged",updateVoice);window.speechSynthesis.cancel();activeRef.current=false;};
 },[]);
 useEffect(()=>{speedRef.current=speed;if(typeof window!=="undefined"&&"speechSynthesis" in window&&status==="playing")window.speechSynthesis.cancel();},[speed]);
 runChunkRef.current=()=>{
  if(!activeRef.current)return;
  const chunk=chunksRef.current[indexRef.current];
  if(!chunk){activeRef.current=false;setStatus("done");return;}
  const utterance=new SpeechSynthesisUtterance(chunk);
  const voices=window.speechSynthesis.getVoices();
  utterance.voice=voices.find(item=>/^es-CL$/i.test(item.lang))||voices.find(item=>/^es(-|$)/i.test(item.lang))||null;
  utterance.lang=utterance.voice?.lang||"es-CL";
  utterance.rate=speedRef.current;utterance.pitch=1;utterance.volume=1;
  utterance.onend=()=>{if(!activeRef.current)return;indexRef.current+=1;runChunkRef.current();};
  utterance.onerror=(event)=>{if(event.error==="canceled"||event.error==="interrupted")return;activeRef.current=false;setStatus("error");};
  window.speechSynthesis.speak(utterance);
 };
 const stop=()=>{activeRef.current=false;if("speechSynthesis" in window)window.speechSynthesis.cancel();indexRef.current=0;setStatus("idle");};
 const play=()=>{
  if(!supported)return;
  if(status==="paused"&&window.speechSynthesis.paused){window.speechSynthesis.resume();activeRef.current=true;setStatus("playing");return;}
  window.speechSynthesis.cancel();
  chunksRef.current=splitSpeechText(speechText);indexRef.current=0;
  if(!chunksRef.current.length){setStatus("error");return;}
  activeRef.current=true;setStatus("playing");runChunkRef.current();
 };
 const pause=()=>{if(window.speechSynthesis.speaking){window.speechSynthesis.pause();setStatus("paused");}};
 return <section aria-label="Escuchar artículo" className="mx-auto mb-8 max-w-3xl rounded-xl border border-[rgba(212,175,55,0.35)] bg-[linear-gradient(135deg,rgba(55,25,70,0.55),rgba(16,11,23,0.92))] p-4 sm:p-5">
  <div className="flex items-start gap-3"><span className="mt-0.5 rounded-full border border-[rgba(212,175,55,0.35)] bg-[#21172b] p-2 text-[#f0d98a]"><Volume2 className="h-5 w-5"/></span><div className="min-w-0 flex-1"><h2 className="font-serif text-lg text-[#f4df9b]">Escuchar este artículo</h2><p className="mt-1 text-xs leading-5 text-[#bdb2c9]">{supported?voiceLabel:"Tu navegador no ofrece lectura en voz alta."}</p></div></div>
  <div className="mt-4 flex flex-wrap items-center gap-2">
   {status==="playing"?<button type="button" onClick={pause} className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-[#d4af37] bg-[#d4af37] px-4 py-2 text-sm font-semibold text-[#08060d] hover:bg-transparent hover:text-[#f4df9b]"><Pause className="h-4 w-4"/>Pausar</button>:<button type="button" disabled={!supported} onClick={play} className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-[#d4af37] bg-[#d4af37] px-4 py-2 text-sm font-semibold text-[#08060d] hover:bg-transparent hover:text-[#f4df9b] disabled:cursor-not-allowed disabled:opacity-50"><Play className="h-4 w-4"/>{status==="paused"?"Continuar":status==="done"?"Escuchar de nuevo":"Reproducir"}</button>}
   <button type="button" disabled={!supported||status==="idle"} onClick={stop} className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-[rgba(212,175,55,0.35)] px-3 py-2 text-sm text-[#e8e0ec] hover:border-[#d4af37] disabled:cursor-not-allowed disabled:opacity-40"><RotateCcw className="h-4 w-4"/>Detener</button>
   <label className="ml-auto flex items-center gap-2 text-sm text-[#d8d0df]"><span>Velocidad</span><select aria-label="Velocidad de lectura" value={speed} onChange={event=>setSpeed(Number(event.target.value))} className="rounded-md border border-[rgba(212,175,55,0.35)] bg-[#100b17] px-2 py-2 text-[#f4df9b]"><option value={0.8}>Lenta</option><option value={1}>Normal</option><option value={1.2}>Rápida</option></select></label>
  </div>
  {status==="done"&&<p role="status" className="mt-3 text-xs text-[#d8d0df]">La lectura ha terminado.</p>}
  {status==="error"&&<p role="status" className="mt-3 text-xs text-[#f4df9b]">No se pudo iniciar o continuar la lectura. Prueba de nuevo o revisa las voces disponibles en tu dispositivo.</p>}
  {!supported&&<p className="mt-2 text-xs text-[#bdb2c9]">Prueba con un navegador compatible y comprueba que tu dispositivo tenga una voz en español instalada.</p>}
 </section>;
}

function BlogArticlePage(){const {slug=""}=useParams();const [post,setPost]=useState<BlogPost|null>(null);const [related,setRelated]=useState<BlogPost[]>([]);const [relatedServices,setRelatedServices]=useState<RelatedService[]>([]);const [loading,setLoading]=useState(true);const [failed,setFailed]=useState(false);useEffect(()=>{let active=true;setLoading(true);getPublishedBlogPost(slug).then(async item=>{if(!active)return;setPost(item);if(item){try{const rows=await getRecentBlogPosts(item.id,3);if(active)setRelated(rows);}catch(error){console.error("No se pudieron cargar las lecturas recientes.",error);}try{const services=await getRelatedServices(item.id);if(active)setRelatedServices(services);}catch(error){console.error("No se pudo cargar el servicio relacionado.",error);}}}).catch(error=>{console.error("No se pudo cargar el artículo.",error);if(active)setFailed(true);}).finally(()=>{if(active)setLoading(false);});return()=>{active=false;};},[slug]);if(loading)return <section className="min-h-[65vh] bg-[#08060d] px-5 pt-28 text-center text-[#d8d0df]">Abriendo el artículo…</section>;if(failed||!post)return <section className="min-h-[65vh] bg-[#08060d] px-5 pb-16 pt-28 text-center text-[#d8d0df]"><h1 className="font-serif text-3xl text-[#f4df9b]">No encontramos esta lectura</h1><p className="mt-3">Puede que el artículo no exista o ya no esté publicado.</p><Link to="/grimorio" className="mt-6 inline-flex text-[#d4af37]">Volver a El Grimorio</Link></section>;return <><SEO title={`${post.meta_title||post.title} | El Grimorio`} description={post.meta_description||excerpt(post)} canonical={`https://elnidodelcaos.cl/grimorio/${post.slug}`} image={post.cover_image_url||"https://elnidodelcaos.cl/seo_nido.png"}/><article className="min-h-[65vh] bg-[radial-gradient(ellipse_at_50%_0%,rgba(92,43,116,0.14),transparent_40%),#08060d] px-5 pb-16 pt-24 text-[#e8e0ec] sm:px-8 sm:pt-28"><div className="mx-auto max-w-4xl"><Link to="/grimorio" className="inline-flex items-center gap-2 text-sm text-[#d4af37] hover:text-[#f4df9b]"><ArrowLeft className="h-4 w-4"/>Volver a El Grimorio</Link><header className="mx-auto mb-9 mt-8 max-w-3xl text-center"><h1 className="font-serif text-3xl font-semibold leading-tight text-[#f4df9b] sm:text-4xl lg:text-5xl">{post.title}</h1><div className="mt-5 flex flex-wrap items-center justify-center gap-2">{(post.categories?.length?post.categories:post.category?[post.category]:[]).map(category=><span key={category.id} className="rounded-full border border-[rgba(212,175,55,0.35)] px-3 py-1 text-[10px] uppercase tracking-[0.14em] text-[#b8944a]">{category.name}</span>)}{!(post.categories?.length||post.category)&&<span className="text-xs uppercase tracking-[0.2em] text-[#b8944a]">El Grimorio</span>}</div>{post.meta_description?.trim()&&<p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-[#d8d0df] sm:text-xl">{post.meta_description}</p>}{post.published_at&&<p className="mt-4 text-xs text-[#aaa2b3]">{new Intl.DateTimeFormat("es-CL",{dateStyle:"long"}).format(new Date(post.published_at))}</p>}</header><BlogAudioReader title={post.title} description={post.meta_description} content={post.content}/>{post.cover_image_url&&<img src={post.cover_image_url} alt={post.cover_image_alt||post.title} className="mb-10 max-h-[520px] w-full rounded-xl border border-[rgba(212,175,55,0.25)] object-cover"/>}<div className="blog-prose mx-auto max-w-3xl space-y-6 text-lg leading-8 sm:text-xl" style={{ fontFamily: "'Newsreader', serif" }}>{(post.content?.content||[]).map((node,index)=><ContentNode key={index} node={node}/>)}</div>{relatedServices.length>0&&<section className="mx-auto mt-14 max-w-3xl border-t border-[rgba(212,175,55,0.2)] pt-8"><h2 className="font-serif text-2xl text-[#f4df9b]">Un servicio que puede acompañarte</h2><p className="mt-3 max-w-2xl text-sm leading-7 text-[#d8d0df]">Si quieres profundizar en este tema y llevarlo a una experiencia más personal, aquí puedes conocer el servicio relacionado con esta lectura, revisar sus detalles y decidir con calma si es adecuado para ti.</p><div className="mt-5 grid gap-3 sm:grid-cols-2">{relatedServices.map(item=><Link key={item.id} to={`/servicios/${item.slug}`} className="group flex gap-3 rounded-lg border border-[rgba(212,175,55,0.2)] bg-[#100b17] p-3 hover:border-[#d4af37]">{item.img_url&&<img src={item.img_url} alt="" loading="lazy" className="h-20 w-20 shrink-0 rounded object-cover"/>}<div className="min-w-0"><h3 className="font-serif text-lg text-[#f0d98a] group-hover:text-[#fff0b8]">{item.name}</h3>{item.description&&<p className="mt-1 line-clamp-2 text-xs leading-5 text-[#aaa2b3]">{item.description}</p>}<span className="mt-2 inline-flex text-xs font-semibold text-[#d4af37]">Conocer servicio →</span></div></Link>)}</div></section>}{related.length>0&&<section className="mx-auto mt-14 max-w-3xl border-t border-[rgba(212,175,55,0.2)] pt-8"><h2 className="font-serif text-2xl text-[#f4df9b]">Lecturas recientes</h2><div className="mt-5 grid gap-3 sm:grid-cols-2">{related.map(item=><Link key={item.id} to={`/blog/${item.slug}`} className="rounded-lg border border-[rgba(212,175,55,0.2)] bg-[#100b17] p-4 text-[#f0d98a] hover:border-[#d4af37]">{item.title}<span className="mt-2 flex items-center gap-2 text-xs text-[#b8944a]">Leer artículo <ArrowRight className="h-3 w-3"/></span></Link>)}</div></section>}<section className="mx-auto mt-14 max-w-3xl rounded-xl border border-[rgba(212,175,55,0.3)] bg-[linear-gradient(135deg,rgba(55,25,70,0.7),rgba(16,11,23,0.95))] px-5 py-7 text-center sm:px-8"><h2 className="font-serif text-2xl text-[#f4df9b]">¿Quieres conocer nuestros servicios?</h2><p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-[#d8d0df]">Explora las opciones de tarot, limpieza energética, protección y rituales de El Nido del Caos. Conoce en qué consiste cada servicio y encuentra el que mejor responda a lo que estás buscando.</p><Link to="/" state={{scrollTo:"servicios"}} className="mt-5 inline-flex items-center justify-center gap-2 rounded-lg border border-[#d4af37] bg-[#d4af37] px-5 py-3 text-sm font-semibold text-[#08060d] transition-colors hover:bg-transparent hover:text-[#f4df9b]">Explorar nuestros servicios <ArrowRight className="h-4 w-4"/></Link></section><div className="mt-12 text-center"><Link to="/grimorio" className="inline-flex items-center gap-2 rounded-lg border border-[#d4af37] px-5 py-3 text-sm font-semibold text-[#f4df9b] hover:bg-[#d4af37] hover:text-[#08060d]">Leer más artículos <ArrowRight className="h-4 w-4"/></Link></div></div></article></>;}
export default BlogArticlePage;
