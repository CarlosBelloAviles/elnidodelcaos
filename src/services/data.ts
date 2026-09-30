import { cloudinaryImage } from "../utils/cloudinary";

export const destacados = [
  {
    id: 1,
    image: cloudinaryImage("destacados/tarotnido"),
    imageMobile: cloudinaryImage("destacados/tarotnidoMobile"),
    alt: "Tarot - 3 preguntas",
  },

  {
    id: 2,
    image: cloudinaryImage("destacados/tarotpredectivo"),
    imageMobile: cloudinaryImage("destacados/tarotpredectivomobil"),
    alt: "Tarot Predictivo",
  },

  {
    id: 3,
    image: cloudinaryImage("destacados/proteccionautonoma"),
    imageMobile: cloudinaryImage("destacados/protecionautonomamobil"),
    alt: "Ritual de protección autónoma",
  },

  {
    id: 4,
    image: cloudinaryImage("destacados/ritualpersonalizado"),
    imageMobile: cloudinaryImage("destacados/ritualpersonalizadomobil"),
    alt: "Ritual Personalizado",
  },

  {
    id: 5,
    image: cloudinaryImage("destacados/limpiezaenergetica"),
    imageMobile: cloudinaryImage("destacados/limpiezaenergeticamobil"),
    alt: "Limpieza Energética",
  },

  {
    id: 6,
    image: cloudinaryImage("destacados/cortemagianegra"),
    imageMobile: cloudinaryImage("destacados/cortemagianegraMobil"),
    alt: "Limpieza y corte de brujería",
  },

  {
    id: 7,
    image: cloudinaryImage("destacados/abundanciaPersonalizada"),
    imageMobile: cloudinaryImage("destacados/abundanciaPersonalzadaMobil"),
    alt: "Ritual de Abundancia Personalizada",
  },
];
