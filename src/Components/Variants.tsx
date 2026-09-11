import type { ProductDetails } from "../types";

interface VariantsProps {
  variantes?: ProductDetails["variantes"];
  currency: string;
}

const Variants = ({ variantes, currency }: VariantsProps) => {
  if (!variantes?.length) return null;

  const variantesConDuracion = variantes.filter(
    (variante) => variante.duracion
  );

  const variantesSinDuracion = variantes.filter(
    (variante) => !variante.duracion
  );

  const gruposPorDuracion = variantesConDuracion.reduce<
    Record<string, NonNullable<ProductDetails["variantes"]>>
  >((grupos, variante) => {
    const duracion = variante.duracion!;

    if (!grupos[duracion]) {
      grupos[duracion] = [];
    }

    grupos[duracion].push(variante);

    return grupos;
  }, {});

  return (
    <div className="mb-8 flex flex-col items-center justify-center gap-5 sm:mb-10 sm:gap-6">
  {Object.entries(gruposPorDuracion).map(
    ([duracion, variantesDelGrupo]) => (
      <div key={duracion} className="w-full">
        <p className="mb-2 text-center text-[16px] font-semibold text-[#d4af37] sm:mb-3 sm:text-[17px] md:text-[18px]">
          Duración: {duracion}
        </p>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-6">
          {variantesDelGrupo.map((variante) => (
            <div
              key={variante.nombre}
              className="min-w-0 rounded-lg border border-[rgba(212,175,55,0.55)] bg-[rgba(212,175,55,0.06)] px-3 py-3 text-center sm:rounded-xl sm:px-5 sm:py-4 md:px-8"
            >
              <p className="mb-1 text-[14px] text-[#d8d0df] sm:text-[15px] md:text-[16px]">
                {variante.nombre}
              </p>

              <p className="text-[20px] font-bold text-[#d4af37] sm:text-[24px] md:text-[28px]">
                ${variante.precio.toLocaleString("es-CL")} {currency}
              </p>
            </div>
          ))}
        </div>
      </div>
    )
  )}

  {variantesSinDuracion.length > 0 && (
    <div className="grid w-full grid-cols-2 gap-3 sm:gap-4 md:gap-6">
      {variantesSinDuracion.map((variante) => (
        <div
          key={variante.nombre}
          className="min-w-0 rounded-lg border border-[rgba(212,175,55,0.55)] bg-[rgba(212,175,55,0.06)] px-3 py-3 text-center sm:rounded-xl sm:px-5 sm:py-4 md:px-8"
        >
          <p className="mb-1 text-[14px] text-[#d8d0df] sm:text-[15px] md:text-[16px]">
            {variante.nombre}
          </p>

          <p className="text-[20px] font-bold text-[#d4af37] sm:text-[24px] md:text-[28px]">
            ${variante.precio.toLocaleString("es-CL")} {currency}
          </p>
        </div>
      ))}
    </div>
  )}
</div>
  );
};

export default Variants;

