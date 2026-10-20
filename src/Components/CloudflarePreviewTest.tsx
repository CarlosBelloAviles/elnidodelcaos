const CloudflarePreviewTest = () => {
  return (
    <section
      aria-label="Prueba temporal de Cloudflare Preview"
      className="mx-auto my-8 w-[calc(100%-2rem)] max-w-[1200px] rounded-xl border border-[#d4af37]/60 bg-[#1b0d2b] px-5 py-6 text-center text-[#f4df9b] sm:px-8"
    >
      <p className="text-xs font-semibold tracking-[0.2em] text-[#d4af37]">
        COMPONENTE DE PRUEBA
      </p>
      <h2 className="mt-2 font-serif text-xl sm:text-2xl">
        Cloudflare Preview está comprobándose
      </h2>
      <p className="mx-auto mt-2 max-w-2xl text-sm leading-6 text-[#d8d0df]">
        Si puedes leer este mensaje en la vista previa, el componente nuevo llegó al despliegue de esta rama.
      </p>
    </section>
  );
};

export default CloudflarePreviewTest;
