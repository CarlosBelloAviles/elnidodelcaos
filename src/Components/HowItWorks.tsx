const HowItWorks = () => {
  const steps = [
    {
      number: "①",
      title: "CUÉNTANOS TU SITUACIÓN",
      text: "Explícanos brevemente qué estás viviendo, qué quieres trabajar o qué buscas comprender.",
    },
    {
      number: "②",
      title: "ELEGIMOS EL TRABAJO",
      text: "Revisamos tu situación y vemos qué servicio puede corresponder mejor al propósito que planteas.",
    },
    {
      number: "③",
      title: "REALIZAMOS EL TRABAJO",
      text: "Una vez coordinado el servicio, se realiza el trabajo correspondiente y se te informa sobre el proceso y sus resultados.",
    },
  ];

  return (
    <section
      id="como-funciona"
      className="
        w-full
        border-t border-[rgba(212,175,55,0.18)]
        bg-[radial-gradient(circle_at_50%_45%,rgba(91,43,116,0.12),transparent_45%),#08060d]
        px-5 py-[55px]
        text-white
        sm:px-8 sm:py-[65px]
        lg:px-10 lg:py-[80px]
      "
    >
      <div className="mx-auto max-w-[1200px]">
        <div className="mb-[35px] text-center lg:mb-[50px]">
          <div className="mb-[10px] flex items-center justify-center gap-3 min-[901px]:gap-[25px]">
            <span className="h-px w-[35px] bg-gradient-to-r from-transparent via-[#b8944a] to-transparent min-[601px]:w-[60px] min-[901px]:w-[100px]" />
            <h2 className="my-2 mb-[10px] font-serif text-[2rem] font-medium tracking-[4px] text-[#f4df9b] [text-shadow:0_0_10px_rgba(218,174,65,0.25),0_0_25px_rgba(218,174,65,0.12)] sm:text-[2.5rem] lg:text-[3.2rem]">
              CÓMO FUNCIONA
            </h2>
            <span className="h-px w-[35px] bg-gradient-to-r from-transparent via-[#b8944a] to-transparent min-[601px]:w-[60px] min-[901px]:w-[100px]" />
          </div>

          <p className="mx-auto max-w-[700px] font-serif text-base leading-[1.7] text-[#ddd6d0]">
            Cada trabajo comienza con una situación concreta y se adapta al propósito de cada persona.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-8">
          {steps.map((step) => (
            <article key={step.number} className="text-center">
              <div className="mb-4 flex items-center justify-center">
                <span className="font-serif text-[18px] tracking-[1px] text-[#b8944a]">
                  {step.number}
                </span>
              </div>

              <h3 className="mb-3 font-serif text-[18px] font-medium tracking-[1.5px] text-[#f0d98a] sm:text-[19px]">
                {step.title}
              </h3>

              <p className="mx-auto max-w-[320px] font-serif text-[15px] leading-[1.75] text-[#d8d0df] sm:text-[16px]">
                {step.text}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
