import { WandSparkles } from "lucide-react";
import type {  CategorySectionProps } from "../types";
import ServiceCard from "./ServiceCard";



const CategorySection = ({ categoria }: CategorySectionProps) => {
  return (
    <section id={categoria.slug} className="max-w-[1600px] mx-auto my-12 px-5 sm:px-10">
      {/* Título de categoría */}
      <div className="flex items-center gap-3 text-white">
        <WandSparkles color="gold" />
        <h2 className="font-Newsreader text-2xl font-bold m-0">{categoria.name}</h2>
      </div>

      {/* Productos */}
      <div className="grid grid-cols-2 gap-5 mt-5 lg:grid-cols-3">
        {categoria.products.map((producto) => (
          <div key={producto.id} className="w-full h-full">
            <ServiceCard producto={producto} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default CategorySection;