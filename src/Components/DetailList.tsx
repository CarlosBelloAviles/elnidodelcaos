import type { DetailListProps } from "../types";

const DetailList = ({ title, items } : DetailListProps) => {
  if (!items?.length) return null;

  return (
    <section className="mt-[35px]">
      <h2 className="mb-[15px] text-[27px] font-normal text-[#d4af37]">
        {title}
      </h2>

      <ul className="list-disc pl-[25px] leading-[2] text-[#ddd]">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
};

export default DetailList;