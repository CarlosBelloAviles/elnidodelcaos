import {useEffect,useMemo,useRef,useState,type ReactNode} from "react";
import {Link,useParams} from "react-router-dom";
import {ArrowLeft,ArrowRight,Eye,Pause,Play,RotateCcw,Volume2,Sun,Moon} from "lucide-react";
import BlogArticleLikes from "./BlogArticleLikes";
import SEO from "../../Components/SEO";
import {getPublishedBlogPost,getRecentBlogPosts,getRelatedServices,registerBlogPostView,type BlogPost,type RelatedService} from "./blogService";
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
 const normalized=text.replace(/\s+/g," ").trim();
 if(!normalized)return [];
 const sentences=normalized.match(/[^.!?。！？]+[.!?。！？]+|[^.!?。！？]+$/g)||[normalized];
 const chunks:string[]=[];let current="";
 const flush=()=>{if(current.trim())chunks.push(current.trim());current="";};
 for(const sentence of sentences){
  const part=sentence.trim();if(!part)continue;
  if(part.length>maxLength){
   flush();
   const words=part.split(/\s+/);let piece="";
   for(const word of words){
    if(piece&&piece.length+word.length+1>maxLength){chunks.push(piece);piece="";}
    if(word.length>maxLength){
     if(piece){chunks.push(piece);piece="";}
     for(let offset=0;offset<word.length;offset+=maxLength)chunks.push(word.slice(offset,offset+maxLength));
    }else piece+=(piece?" ":"")+word;
   }
   if(piece)chunks.push(piece);
   continue;
  }
  if(current&&current.length+part.length+1>maxLength)flush();
  current+=(current?" ":"")+part;
 }
 flush();return chunks;
}
function BlogAudioReader({title,description,content,postSlug}:{title:string;description:string|null;content:{content?:Array<Record<string,unknown>>}|null;postSlug:string}){
 const [supported,setSupported]=useState(false);
 const [status,setStatus]=useState<"idle"|"playing"|"paused"|"done"|"error">("idle");
 const [speed,setSpeed]=useState(1);
 const [progress,setProgress]=useState({current:0,total:0});
 const chunksRef=useRef<string[]>([]);
 const indexRef=useRef(0);
 const speedRef=useRef(1);
 const activeRef=useRef(false);
 const currentUtteranceRef=useRef<SpeechSynthesisUtterance|null>(null);
 const runChunkRef=useRef<()=>void>(()=>{});
 const storageKey=`nido-blog-audio:${postSlug}`;
 const speechText=useMemo(()=>[title,description||"",...(content?.content||[]).map(speechTextFromNode)].join(". ").replace(/\s+/g," ").trim(),[title,description,content]);
 useEffect(()=>{
  const available=typeof window!=="undefined"&&"speechSynthesis" in window&&"SpeechSynthesisUtterance" in window;
  setSupported(available);
  if(!available)return;

  const handleVisibility=()=>{
   if(document.visibilityState!=="visible")return;
   window.setTimeout(()=>{
    // Algunos navegadores móviles suspenden SpeechSynthesis al cambiar de aplicación.
    // Al volver, reintenta el fragmento actual en vez de abandonar la lectura.
    if(activeRef.current&&!window.speechSynthesis.speaking&&!window.speechSynthesis.paused){
     currentUtteranceRef.current=null;
     window.speechSynthesis.cancel();
     runChunkRef.current();
    }
   },500);
  };
  const mediaSession="mediaSession" in navigator?navigator.mediaSession:null;
  const setMediaState=(state:"playing"|"paused"|"none")=>{if(mediaSession)mediaSession.playbackState=state;};
  try{
   if(mediaSession&&"MediaMetadata" in window)mediaSession.metadata=new MediaMetadata({title,artist:"El Nido del Caos",album:"El Grimorio"});
   mediaSession?.setActionHandler("play",()=>{
    if(window.speechSynthesis.paused)window.speechSynthesis.resume();
    else if(!window.speechSynthesis.speaking){activeRef.current=true;runChunkRef.current();}
    activeRef.current=true;setStatus("playing");setMediaState("playing");
   });
   mediaSession?.setActionHandler("pause",()=>{window.speechSynthesis.pause();setStatus("paused");setMediaState("paused");});
   mediaSession?.setActionHandler("stop",()=>{activeRef.current=false;currentUtteranceRef.current=null;window.speechSynthesis.cancel();indexRef.current=0;chunksRef.current=[];setStatus("idle");setMediaState("none");});
  }catch{/* Los controles multimedia no están disponibles en todos los navegadores. */}
  document.addEventListener("visibilitychange",handleVisibility);
  return()=>{document.removeEventListener("visibilitychange",handleVisibility);try{mediaSession?.setActionHandler("play",null);mediaSession?.setActionHandler("pause",null);mediaSession?.setActionHandler("stop",null);setMediaState("none");}catch{/* API multimedia no compatible. */}currentUtteranceRef.current=null;window.speechSynthesis.cancel();activeRef.current=false;};
 },[]);
 useEffect(()=>{speedRef.current=speed;},[speed]);
 runChunkRef.current=()=>{
  if(!activeRef.current)return;
  const chunk=chunksRef.current[indexRef.current];
  if(!chunk){activeRef.current=false;setProgress({current:chunksRef.current.length,total:chunksRef.current.length});try{sessionStorage.removeItem(storageKey);}catch{/* El almacenamiento puede estar deshabilitado. */}setStatus("done");if("mediaSession" in navigator)navigator.mediaSession.playbackState="none";return;}
  setProgress({current:indexRef.current,total:chunksRef.current.length});
  try{sessionStorage.setItem(storageKey,JSON.stringify({index:indexRef.current,total:chunksRef.current.length,textLength:speechText.length}));}catch{/* El almacenamiento puede estar deshabilitado. */}
  const utterance=new SpeechSynthesisUtterance(chunk);
  currentUtteranceRef.current=utterance;
  const voices=window.speechSynthesis.getVoices();
  utterance.voice=voices.find(item=>/^es-CL$/i.test(item.lang))||voices.find(item=>/^es(-|$)/i.test(item.lang))||null;
  utterance.lang=utterance.voice?.lang||"es-CL";
  utterance.rate=speedRef.current;utterance.pitch=1;utterance.volume=1;
  utterance.onend=()=>{if(currentUtteranceRef.current!==utterance||!activeRef.current)return;currentUtteranceRef.current=null;indexRef.current+=1;runChunkRef.current();};
  utterance.onerror=(event)=>{
   if(currentUtteranceRef.current!==utterance||!activeRef.current)return;
   currentUtteranceRef.current=null;
   activeRef.current=false;
   if(event.error==="canceled"||event.error==="interrupted"){setStatus("paused");return;}
   setStatus("error");
  };
  window.speechSynthesis.speak(utterance);
  if("mediaSession" in navigator)navigator.mediaSession.playbackState="playing";
 };
 const stop=()=>{activeRef.current=false;currentUtteranceRef.current=null;if("speechSynthesis" in window)window.speechSynthesis.cancel();indexRef.current=0;chunksRef.current=[];try{sessionStorage.removeItem(storageKey);}catch{/* El almacenamiento puede estar deshabilitado. */}setStatus("idle");if("mediaSession" in navigator)navigator.mediaSession.playbackState="none";};
 const play=()=>{
  if(!supported)return;
  if(status==="paused"){
   if(window.speechSynthesis.paused){window.speechSynthesis.resume();activeRef.current=true;setStatus("playing");return;}
   activeRef.current=false;currentUtteranceRef.current=null;window.speechSynthesis.cancel();activeRef.current=true;setStatus("playing");if("mediaSession" in navigator)navigator.mediaSession.playbackState="playing";runChunkRef.current();return;
  }
  const canResume=status==="error"&&chunksRef.current.length>0;
  activeRef.current=false;currentUtteranceRef.current=null;window.speechSynthesis.cancel();
  if(!canResume){
   chunksRef.current=splitSpeechText(speechText);indexRef.current=0;setProgress({current:0,total:chunksRef.current.length});
   if(!chunksRef.current.length){setStatus("error");return;}
   try{
    const saved=sessionStorage.getItem(storageKey);
    if(saved){
     const progress=JSON.parse(saved) as {index?:number;total?:number;textLength?:number};
     if(progress.total===chunksRef.current.length&&progress.textLength===speechText.length&&Number.isInteger(progress.index)&&progress.index!>=0&&progress.index!<chunksRef.current.length)indexRef.current=progress.index!;
    }
   }catch{/* El almacenamiento puede estar deshabilitado o contener datos inválidos. */}
  }
  activeRef.current=true;setStatus("playing");if("mediaSession" in navigator)navigator.mediaSession.playbackState="playing";runChunkRef.current();
 };
 const pause=()=>{if(window.speechSynthesis.speaking){window.speechSynthesis.pause();setStatus("paused");if("mediaSession" in navigator)navigator.mediaSession.playbackState="paused";}};
 const seek=(value:number)=>{
  if(!supported||!chunksRef.current.length)return;
  const target=Math.max(0,Math.min(chunksRef.current.length-1,value));
  const shouldResume=status==="playing";
  activeRef.current=false;currentUtteranceRef.current=null;window.speechSynthesis.cancel();
  indexRef.current=target;setProgress({current:target,total:chunksRef.current.length});
  if(shouldResume){activeRef.current=true;setStatus("playing");runChunkRef.current();}
  else if(status==="paused"||status==="done"||status==="error")setStatus("paused");
 };
 return <section aria-label="Escuchar artículo" className="mx-auto mb-8 max-w-3xl rounded-xl border border-[rgba(212,175,55,0.35)] bg-[linear-gradient(135deg,rgba(55,25,70,0.55),rgba(16,11,23,0.92))] p-4 sm:p-5">
  <div className="flex items-start gap-3"><span className="mt-0.5 rounded-full border border-[rgba(212,175,55,0.35)] bg-[#21172b] p-2 text-[#f0d98a]"><Volume2 className="h-5 w-5"/></span><div className="min-w-0 flex-1"><h2 className="font-serif text-lg text-[#f4df9b]">Escuchar este artículo</h2><p className="mt-1 text-xs leading-5 text-[#bdb2c9]">{supported?"Escucha el artículo a tu ritmo.":"Tu navegador no ofrece lectura en voz alta."}</p></div></div>
  {progress.total>0&&<div className="mt-4"><div className="mb-2 flex items-center justify-between text-xs text-[#bdb2c9]"><span>Progreso de lectura</span><span>{Math.round((progress.current/progress.total)*100)}%</span></div><input aria-label="Progreso de lectura; desliza para avanzar o retroceder" type="range" min={0} max={Math.max(0,progress.total-1)} value={Math.min(progress.current,Math.max(0,progress.total-1))} onChange={event=>seek(Number(event.target.value))} disabled={!supported} className="w-full cursor-pointer accent-[#d4af37] disabled:cursor-not-allowed" /><div className="mt-1 flex justify-between text-[10px] text-[#aaa2b3]"><span>Inicio</span><span>Final</span></div></div>}
  <div className="mt-4 flex flex-wrap items-center gap-2">
   {status==="playing"?<button type="button" onClick={pause} className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-[#d4af37] bg-[#d4af37] px-4 py-2 text-sm font-semibold text-[#08060d] hover:bg-transparent hover:text-[#f4df9b]"><Pause className="h-4 w-4"/>Pausar</button>:<button type="button" disabled={!supported} onClick={play} className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-[#d4af37] bg-[#d4af37] px-4 py-2 text-sm font-semibold text-[#08060d] hover:bg-transparent hover:text-[#f4df9b] disabled:cursor-not-allowed disabled:opacity-50"><><Play className="h-4 w-4"/>{status==="paused"?"Continuar":"Reproducir"}</></button>}
   <button type="button" disabled={!supported||status==="idle"} onClick={stop} className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-[rgba(212,175,55,0.35)] px-3 py-2 text-sm text-[#e8e0ec] hover:border-[#d4af37] disabled:cursor-not-allowed disabled:opacity-40"><RotateCcw className="h-4 w-4"/>Detener</button>
   <label className="ml-auto flex items-center gap-2 text-sm text-[#d8d0df]"><span>Velocidad</span><select aria-label="Velocidad de lectura" value={speed} onChange={event=>setSpeed(Number(event.target.value))} className="rounded-md border border-[rgba(212,175,55,0.35)] bg-[#100b17] px-2 py-2 text-[#f4df9b]"><option value={0.8}>Lenta</option><option value={1}>Normal</option><option value={1.2}>Rápida</option></select></label>
  </div>
  {status==="done"&&<p role="status" className="mt-3 text-xs text-[#d8d0df]">La lectura ha terminado.</p>}
  {status==="error"&&<p role="status" className="mt-3 text-xs text-[#f4df9b]">No se pudo iniciar o continuar la lectura. Prueba de nuevo o revisa las voces disponibles en tu dispositivo.</p>}
  {!supported&&<p className="mt-2 text-xs text-[#bdb2c9]">Prueba con un navegador compatible y comprueba que tu dispositivo tenga una voz en español instalada.</p>}
 </section>;
}

function BlogArticlePage(){const {slug=""}=useParams();const [lightMode,setLightMode]=useState(()=>{try{return window.localStorage.getItem("nido-blog-theme")==="light";}catch{return false;}});const [post,setPost]=useState<BlogPost|null>(null);const [views,setViews]=useState(0);const [related,setRelated]=useState<BlogPost[]>([]);const [relatedServices,setRelatedServices]=useState<RelatedService[]>([]);const [loading,setLoading]=useState(true);const [failed,setFailed]=useState(false);useEffect(()=>{if(!post?.id)return;let active=true;setViews(Number(post.views)||0);try{const key="nido-blog-visitor-id";let visitorId=window.localStorage.getItem(key);if(!visitorId){visitorId=window.crypto.randomUUID();window.localStorage.setItem(key,visitorId);}registerBlogPostView(post.id,visitorId).then(count=>{if(active)setViews(count);}).catch(error=>console.error("No se pudo registrar la visualización del artículo.",error));}catch(error){console.error("No se pudo guardar el identificador de lectura en este navegador.",error);}return()=>{active=false;};},[post?.id]);useEffect(()=>{let active=true;setLoading(true);getPublishedBlogPost(slug).then(async item=>{if(!active)return;setPost(item);if(item){try{const rows=await getRecentBlogPosts(item.id,3);if(active)setRelated(rows);}catch(error){console.error("No se pudieron cargar las lecturas recientes.",error);}try{const services=await getRelatedServices(item.id);if(active)setRelatedServices(services);}catch(error){console.error("No se pudo cargar el servicio relacionado.",error);}}}).catch(error=>{console.error("No se pudo cargar el artículo.",error);if(active)setFailed(true);}).finally(()=>{if(active)setLoading(false);});return()=>{active=false;};},[slug]);if(loading)return <section className="min-h-[65vh] bg-[#08060d] px-5 pt-28 text-center text-[#d8d0df]">Abriendo el artículo…</section>;if(failed||!post)return <section className="min-h-[65vh] bg-[#08060d] px-5 pb-16 pt-28 text-center text-[#d8d0df]"><h1 className="font-serif text-3xl text-[#f4df9b]">No encontramos esta lectura</h1><p className="mt-3">Puede que el artículo no exista o ya no esté publicado.</p><Link to="/grimorio" className="mt-6 inline-flex text-[#d4af37]">Volver a El Grimorio</Link></section>;return <><SEO title={`${post.meta_title||post.title} | El Grimorio`} description={post.meta_description||excerpt(post)} canonical={`https://elnidodelcaos.cl/grimorio/${post.slug}`} image={post.cover_image_url||"https://elnidodelcaos.cl/seo_nido.png"}/><article data-theme={lightMode?"light":"dark"} className={`blog-article min-h-[65vh] bg-[radial-gradient(ellipse_at_50%_0%,rgba(92,43,116,0.14),transparent_40%),#08060d] px-5 pb-16 pt-24 text-[#e8e0ec] sm:px-8 sm:pt-28 ${lightMode?"blog-article-light":""}`}><div className="mx-auto max-w-4xl"><div className="mb-5 flex items-center justify-between gap-3"><Link to="/grimorio" className="inline-flex items-center gap-2 text-sm text-[#d4af37] hover:text-[#f4df9b]"><ArrowLeft className="h-4 w-4"/>Volver a El Grimorio</Link><button type="button" onClick={()=>setLightMode(current=>{const next=!current;try{window.localStorage.setItem("nido-blog-theme",next?"light":"dark");}catch{}return next;})} aria-pressed={lightMode} aria-label={lightMode?"Activar modo oscuro":"Activar modo claro"} className="inline-flex shrink-0 items-center gap-2 rounded-full border border-[rgba(212,175,55,0.45)] bg-[#21172b] px-3 py-2 text-xs font-medium text-[#f4df9b] transition-colors hover:border-[#d4af37]">{lightMode?<Moon className="h-4 w-4"/>:<Sun className="h-4 w-4"/>}{lightMode?"Modo oscuro":"Modo claro"}</button></div><header className="mx-auto mb-9 mt-8 max-w-3xl text-center"><h1 className="font-serif text-3xl font-semibold leading-tight text-[#f4df9b] sm:text-4xl lg:text-5xl" style={lightMode?{color:"#684785"}:undefined}>{post.title}</h1><div className="mt-5 flex flex-wrap items-center justify-center gap-2">{(post.categories?.length?post.categories:post.category?[post.category]:[]).map(category=><span key={category.id} className="rounded-full border border-[rgba(212,175,55,0.35)] px-3 py-1 text-[10px] uppercase tracking-[0.14em] text-[#b8944a]" style={lightMode?{color:"#98752f"}:undefined}>{category.name}</span>)}{!(post.categories?.length||post.category)&&<span className="text-xs uppercase tracking-[0.2em] text-[#b8944a]">El Grimorio</span>}</div>{post.meta_description?.trim()&&<p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-[#d8d0df] sm:text-xl" style={lightMode?{color:"#81513e"}:undefined}>{post.meta_description}</p>}{<div className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-[#aaa2b3]">{post.published_at&&<span>{new Intl.DateTimeFormat("es-CL",{dateStyle:"long"}).format(new Date(post.published_at))}</span>}<span className="inline-flex items-center gap-1.5" aria-label={`${views} visualizaciones`}><Eye aria-hidden="true" className="h-3.5 w-3.5 text-[#b8944a]"/><span>{views.toLocaleString("es-CL")} {views===1?"visualización":"visualizaciones"}</span></span></div>}</header><BlogAudioReader key={post.slug} postSlug={post.slug} title={post.title} description={post.meta_description} content={post.content}/>{post.cover_image_url&&<img src={post.cover_image_url} alt={post.cover_image_alt||post.title} className="mb-10 max-h-[520px] w-full rounded-xl border border-[rgba(212,175,55,0.25)] object-cover"/>}<div className="blog-prose mx-auto max-w-3xl space-y-6 text-lg leading-8 sm:text-xl" style={{ fontFamily: "'Newsreader', serif" }}>{(post.content?.content||[]).map((node,index)=><ContentNode key={index} node={node}/>)}</div><BlogArticleLikes postId={post.id}/>{relatedServices.length>0&&<section className="blog-related-services mx-auto mt-14 max-w-3xl border-t border-[rgba(212,175,55,0.2)] pt-8"><h2 className="font-serif text-2xl text-[#f4df9b]">Un servicio que puede acompañarte</h2><p className="mt-3 max-w-2xl text-sm leading-7 text-[#d8d0df]">Si quieres profundizar en este tema y llevarlo a una experiencia más personal, aquí puedes conocer el servicio relacionado con esta lectura, revisar sus detalles y decidir con calma si es adecuado para ti.</p><div className="mt-5 grid gap-3 sm:grid-cols-2">{relatedServices.map(item=><Link key={item.id} to={`/servicios/${item.slug}`} className="blog-service-card group flex gap-3 rounded-lg border border-[rgba(212,175,55,0.2)] bg-[#100b17] p-3 hover:border-[#d4af37]">{item.img_url&&<img src={item.img_url} alt="" loading="lazy" className="h-20 w-20 shrink-0 rounded object-cover"/>}<div className="min-w-0"><h3 className="font-serif text-lg text-[#f0d98a] group-hover:text-[#fff0b8]">{item.name}</h3>{item.description&&<p className="mt-1 line-clamp-2 text-xs leading-5 text-[#aaa2b3]">{item.description}</p>}<span className="mt-2 inline-flex text-xs font-semibold text-[#d4af37]">Conocer servicio →</span></div></Link>)}</div></section>}{related.length>0&&<section className="blog-related-articles mx-auto mt-14 max-w-3xl border-t border-[rgba(212,175,55,0.2)] pt-8"><h2 className="font-serif text-2xl text-[#f4df9b]">Lecturas recientes</h2><div className="mt-5 grid gap-3 sm:grid-cols-2">{related.map(item=><Link key={item.id} to={`/blog/${item.slug}`} className="blog-related-article-card rounded-lg border border-[rgba(212,175,55,0.2)] bg-[#100b17] p-4 text-[#f0d98a] hover:border-[#d4af37]">{item.title}<span className="mt-2 flex items-center gap-2 text-xs text-[#b8944a]">Leer artículo <ArrowRight className="h-3 w-3"/></span></Link>)}</div></section>}<section className="blog-article-cta mx-auto mt-14 max-w-3xl rounded-xl border border-[rgba(212,175,55,0.3)] bg-[linear-gradient(135deg,rgba(55,25,70,0.7),rgba(16,11,23,0.95))] px-5 py-7 text-center sm:px-8"><h2 className="font-serif text-2xl text-[#f4df9b]">¿Quieres conocer nuestros servicios?</h2><p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-[#d8d0df]">Explora las opciones de tarot, limpieza energética, protección y rituales de El Nido del Caos. Conoce en qué consiste cada servicio y encuentra el que mejor responda a lo que estás buscando.</p><Link to="/" state={{scrollTo:"servicios"}} className="mt-5 inline-flex items-center justify-center gap-2 rounded-lg border border-[#d4af37] bg-[#d4af37] px-5 py-3 text-sm font-semibold text-[#08060d] transition-colors hover:bg-transparent hover:text-[#f4df9b]">Explorar nuestros servicios <ArrowRight className="h-4 w-4"/></Link></section><div className="mt-12 text-center"><Link to="/grimorio" className="inline-flex items-center gap-2 rounded-lg border border-[#d4af37] px-5 py-3 text-sm font-semibold text-[#f4df9b] hover:bg-[#d4af37] hover:text-[#08060d]">Leer más artículos <ArrowRight className="h-4 w-4"/></Link></div></div></article></>;}
export default BlogArticlePage;
