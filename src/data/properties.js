// Base de dados dos Empreendimentos Vetter com links do Google Drive e materiais
export const DRIVE_ROOT_URL = "https://drive.google.com/drive/folders/1hL6hQs1pqr7-sp0bdkU14CXJWe8RBcht?usp=sharing";

export const PROPERTIES_DATA = [
  {
    id: "vetter-palm-beach",
    name: "Palm Beach Vetter",
    tagline: "Frente Mar • Alto Padrão Exclusivo",
    city: "Balneário Piçarras - SC",
    location: "Av. José Temístocles de Macedo, Frente Mar",
    status: "Lançamento",
    category: "frente-mar",
    deliveryDate: "Dezembro / 2028",
    priceStartingAt: "R$ 2.450.000",
    coverImage: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1000&q=80",
    description: "Um ícone arquitetônico com vista panorâmica definitiva para o mar, acabamento artesanal Vetter, amplas sacadas com churrasqueira a carvão e área de lazer estilo resort internacional.",
    driveFolderUrl: DRIVE_ROOT_URL,
    materials: {
      tablePdfUrl: DRIVE_ROOT_URL,
      bookPdfUrl: DRIVE_ROOT_URL,
      videoTourUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      photosCount: 24,
      floorPlansCount: 4
    },
    specs: {
      suites: "3 a 4 Suítes",
      area: "142m² a 285m² privativos",
      garages: "2 a 4 Vagas + Hobby Box",
      towers: 1,
      totalUnits: 48,
      differentiators: [
        "Vista mar permanente em todas as unidades",
        "Living gourmet integrado de 58m²",
        "Churrasqueira a carvão com exaustão forçada",
        "Tratamento acústico de piso e tubulações",
        "Piscina aquecida de borda infinita de frente para o mar",
        "Áreas comuns entregues 100% decoradas e climatizadas"
      ]
    },
    floorPlans: [
      {
        id: "palm-tipo-01",
        title: "Apartamento Tipo 01",
        area: "178,50 m² privativos",
        suites: 4,
        garages: 3,
        orientation: "Frente Mar (Leste)",
        image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
        rooms: [
          { name: "Living Integrado & Jantar", dimensions: "8,40m x 5,90m", area: "49,56 m²" },
          { name: "Sacada Gourmet com Churrasqueira", dimensions: "5,80m x 2,80m", area: "16,24 m²" },
          { name: "Suíte Master com Closet", dimensions: "5,20m x 4,10m", area: "21,32 m²" },
          { name: "Banheiro Master com Cuba Dupla", dimensions: "3,10m x 2,40m", area: "7,44 m²" },
          { name: "Suíte 02", dimensions: "3,80m x 3,40m", area: "12,92 m²" },
          { name: "Suíte 03", dimensions: "3,70m x 3,30m", area: "12,21 m²" },
          { name: "Suíte 04 / Home Office", dimensions: "3,50m x 3,10m", area: "10,85 m²" },
          { name: "Cozinha & Área de Serviço", dimensions: "4,60m x 2,90m", area: "13,34 m²" },
          { name: "Lavabo Social", dimensions: "1,80m x 1,40m", area: "2,52 m²" }
        ]
      },
      {
        id: "palm-tipo-02",
        title: "Apartamento Tipo 02",
        area: "142,80 m² privativos",
        suites: 3,
        garages: 2,
        orientation: "Frente Mar Lateral (Nordeste)",
        image: "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80",
        rooms: [
          { name: "Living & Jantar", dimensions: "7,20m x 5,10m", area: "36,72 m²" },
          { name: "Sacada Gourmet", dimensions: "4,90m x 2,60m", area: "12,74 m²" },
          { name: "Suíte Master", dimensions: "4,60m x 3,80m", area: "17,48 m²" },
          { name: "Suíte 02", dimensions: "3,60m x 3,30m", area: "11,88 m²" },
          { name: "Suíte 03", dimensions: "3,50m x 3,20m", area: "11,20 m²" },
          { name: "Cozinha Integrada", dimensions: "3,80m x 2,60m", area: "9,88 m²" }
        ]
      }
    ]
  },
  {
    id: "vetter-ocean-breeze",
    name: "Ocean Breeze Vetter",
    tagline: "Quadra Mar • Conforto & Design",
    city: "Penha - SC",
    location: "Praia da Armação, a 50m da areia",
    status: "Em Construção",
    category: "quadra-mar",
    deliveryDate: "Junho / 2027",
    priceStartingAt: "R$ 1.680.000",
    coverImage: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1000&q=80",
    description: "Conexão direta com a natureza exuberante de Penha e as praias mais desejadas do litoral catarinense, a passos do mar e perto de tudo.",
    driveFolderUrl: DRIVE_ROOT_URL,
    materials: {
      tablePdfUrl: DRIVE_ROOT_URL,
      bookPdfUrl: DRIVE_ROOT_URL,
      videoTourUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      photosCount: 32,
      floorPlansCount: 3
    },
    specs: {
      suites: "3 Suítes",
      area: "126m² a 158m² privativos",
      garages: "2 Vagas",
      towers: 2,
      totalUnits: 64,
      differentiators: [
        "50 metros da praia da Armação",
        "Rooftop com piscina panorâmica e sky lounge",
        "Áreas sociais com pé-direito elevado",
        "Bikes compartilhadas e estação de recarga elétrica",
        "Espaço Pet Place e Beach Care no térreo"
      ]
    },
    floorPlans: [
      {
        id: "ocean-tipo-01",
        title: "Apartamento Tipo 01 - Torre A",
        area: "135,20 m² privativos",
        suites: 3,
        garages: 2,
        orientation: "Leste / Sol da manhã",
        image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
        rooms: [
          { name: "Living Gourmet", dimensions: "6,90m x 4,80m", area: "33,12 m²" },
          { name: "Suíte Master", dimensions: "4,40m x 3,60m", area: "15,84 m²" },
          { name: "Suíte 02", dimensions: "3,50m x 3,20m", area: "11,20 m²" },
          { name: "Suíte 03", dimensions: "3,40m x 3,10m", area: "10,54 m²" },
          { name: "Sacada com Churrasqueira", dimensions: "4,20m x 2,30m", area: "9,66 m²" }
        ]
      }
    ]
  },
  {
    id: "vetter-sunset-boulevard",
    name: "Sunset Boulevard Vetter",
    tagline: "Pronto para Morar • Vida à Beira-Mar",
    city: "Balneário Piçarras - SC",
    location: "Centro - Balneário Piçarras",
    status: "Pronto para Morar",
    category: "frente-mar",
    deliveryDate: "Entregue (100% Concluído)",
    priceStartingAt: "R$ 2.190.000",
    coverImage: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1000&q=80",
    description: "Obra de arte pronta para morar com o inconfundível padrão de entrega Vetter. Lazer completíssimo com mais de 1.800m² de entretenimento privativo.",
    driveFolderUrl: DRIVE_ROOT_URL,
    materials: {
      tablePdfUrl: DRIVE_ROOT_URL,
      bookPdfUrl: DRIVE_ROOT_URL,
      videoTourUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      photosCount: 45,
      floorPlansCount: 2
    },
    specs: {
      suites: "3 a 4 Suítes",
      area: "138m² a 240m² privativos",
      garages: "2 a 3 Vagas",
      towers: 1,
      totalUnits: 36,
      differentiators: [
        "Empreendimento 100% pronto e entregue",
        "Cinema privativo Vetter, Wine Bar e Pub Inglês",
        "Spa com sauna seca e úmida + jacuzzi aquecida",
        "Quadra de Beach Tennis privativa no condomínio"
      ]
    },
    floorPlans: [
      {
        id: "sunset-tipo-01",
        title: "Planta Tipo 01 - 3 Suítes",
        area: "148,00 m² privativos",
        suites: 3,
        garages: 2,
        orientation: "Norte / Leste",
        image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80",
        rooms: [
          { name: "Living 2 Ambientes", dimensions: "7,50m x 4,90m", area: "36,75 m²" },
          { name: "Sacada Gourmet Panorâmica", dimensions: "5,10m x 2,70m", area: "13,77 m²" },
          { name: "Suíte Principal", dimensions: "4,80m x 3,90m", area: "18,72 m²" },
          { name: "Suíte 02", dimensions: "3,60m x 3,40m", area: "12,24 m²" },
          { name: "Suíte 03", dimensions: "3,50m x 3,30m", area: "11,55 m²" }
        ]
      }
    ]
  },
  {
    id: "vetter-grand-palais",
    name: "Grand Palais Vetter",
    tagline: "Residencial Boutique de Alto Luxo",
    city: "Penha - SC",
    location: "Praia Grande, Penha",
    status: "Lançamento",
    category: "frente-mar",
    deliveryDate: "Novembro / 2028",
    priceStartingAt: "R$ 3.100.000",
    coverImage: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1000&q=80",
    description: "Arquitetura neoclássica refinada combinada com alta tecnologia sustentável e tecnologia acústica suíça. O ápice do luxo no litoral de Santa Catarina.",
    driveFolderUrl: DRIVE_ROOT_URL,
    materials: {
      tablePdfUrl: DRIVE_ROOT_URL,
      bookPdfUrl: DRIVE_ROOT_URL,
      videoTourUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      photosCount: 28,
      floorPlansCount: 3
    },
    specs: {
      suites: "4 Suítes Plenas",
      area: "195m² a 340m² privativos",
      garages: "3 a 4 Vagas",
      towers: 1,
      totalUnits: 20,
      differentiators: [
        "Apenas 2 apartamentos por andar com elevador privativo com biometria",
        "Janelas piso-teto com atenuação acústica máxima",
        "Manta acústica entre lajes de 10mm",
        "Infraestrutura para automação total e piso aquecido nos banheiros"
      ]
    },
    floorPlans: [
      {
        id: "grand-tipo-01",
        title: "Apartamento Tipo Classic",
        area: "210,40 m² privativos",
        suites: 4,
        garages: 3,
        orientation: "Frente Mar Total",
        image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
        rooms: [
          { name: "Living Grand Saloon", dimensions: "9,20m x 6,40m", area: "58,88 m²" },
          { name: "Sacada Gourmet Integrada", dimensions: "6,20m x 3,10m", area: "19,22 m²" },
          { name: "Suíte Master com Hidro & Closet", dimensions: "5,80m x 4,50m", area: "26,10 m²" },
          { name: "Suíte 02", dimensions: "4,00m x 3,60m", area: "14,40 m²" },
          { name: "Suíte 03", dimensions: "3,90m x 3,50m", area: "13,65 m²" },
          { name: "Suíte 04", dimensions: "3,80m x 3,40m", area: "12,92 m²" }
        ]
      }
    ]
  }
];

// Atalhos rápidos para pastas e documentos mais consultados no Drive
export const QUICK_DRIVE_SHORTCUTS = [
  {
    title: "Pasta Raiz • Todos os Empreendimentos",
    description: "Acesso completo à pasta compartilhada com todos os materiais, books, plantas e fotos",
    category: "Drive Completo",
    url: DRIVE_ROOT_URL,
    icon: "FolderArchive"
  },
  {
    title: "Tabelas de Vendas & Disponibilidade",
    description: "Planilhas e PDFs com condições de pagamento atualizadas de todos os imóveis",
    category: "Tabelas",
    url: DRIVE_ROOT_URL,
    icon: "Table"
  },
  {
    title: "Plantas Arquitetônicas em Alta Resolução",
    description: "PDFs com todas as cotas, implantações, garagens e plantas humanizadas",
    category: "Plantas",
    url: DRIVE_ROOT_URL,
    icon: "Layers"
  },
  {
    title: "Books e Apresentações Comerciais",
    description: "Materiais institucionais em alta definição prontos para enviar a clientes",
    category: "Books",
    url: DRIVE_ROOT_URL,
    icon: "BookOpen"
  },
  {
    title: "Acervo de Fotos & Acompanhamento de Obras",
    description: "Relatórios mensais em foto e vídeo de evolução da construção",
    category: "Fotos de Obra",
    url: DRIVE_ROOT_URL,
    icon: "Camera"
  }
];
