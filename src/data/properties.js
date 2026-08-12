// Base completa de Empreendimentos Vetter com arquivos reais do Google Drive
export const DRIVE_ROOT_URL = "https://drive.google.com/drive/folders/1hL6hQs1pqr7-sp0bdkU14CXJWe8RBcht?usp=sharing";

export const PROPERTIES_DATA = [
  {
    id: "vetter-royal-bay",
    name: "Royal Bay Vetter",
    aliases: ["royal bay", "royal baby", "royal", "roial bay", "roial", "bay"],
    tagline: "Frente Mar • Arquitetura Imponente & Sofisticação",
    city: "Balneário Piçarras - SC",
    location: "Av. José Temístocles de Macedo, Frente Mar",
    status: "Lançamento",
    category: "frente-mar",
    deliveryDate: "Novembro / 2028",
    priceStartingAt: "R$ 2.890.000",
    coverImage: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1000&q=80",
    description: "Um marco de elegância e grandiosidade frente ao mar de Balneário Piçarras. Plantas exclusivas com vista panorâmica para o oceano e padrão construtivo Vetter.",
    driveFolderUrl: DRIVE_ROOT_URL,
    files: [
      {
        id: "royal-tabela",
        name: "Tabela de Vendas Royal Bay Vetter - 2026.pdf",
        title: "Tabela de Vendas & Fluxo Royal Bay",
        type: "pdf",
        size: "2.6 MB",
        url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
        previewImage: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80",
        category: "tabela"
      },
      {
        id: "royal-book",
        name: "Book Comercial Royal Bay Frente Mar.pdf",
        title: "Book / Apresentação Comercial Royal Bay",
        type: "pdf",
        size: "24.1 MB",
        url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
        previewImage: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80",
        category: "book"
      },
      {
        id: "royal-planta-01",
        name: "Planta Baixa Cotada Tipo 01 Royal Bay 186m.jpg",
        title: "Planta Baixa Cotada - Tipo 01 (186,40m²)",
        type: "image",
        size: "4.9 MB",
        url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80",
        previewImage: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80",
        category: "planta"
      },
      {
        id: "royal-render-fachada",
        name: "Perspectiva Fachada Noturna Royal Bay.jpg",
        title: "Render Noturno da Fachada Royal Bay",
        type: "image",
        size: "6.5 MB",
        url: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=80",
        previewImage: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80",
        category: "foto"
      }
    ],
    specs: {
      suites: "4 Suítes",
      area: "186m² a 320m² privativos",
      garages: "3 a 4 Vagas",
      towers: 1,
      totalUnits: 32,
      differentiators: [
        "Frente mar definitivo em Balneário Piçarras",
        "Piscina com borda infinita voltada para a praia",
        "Isolamento acústico com manta de alto desempenho",
        "Living gourmet com pé-direito livre de 3,00m"
      ]
    },
    floorPlans: [
      {
        id: "royal-tipo-01",
        title: "Apartamento Tipo 01 - 4 Suítes",
        area: "186,40 m² privativos",
        suites: 4,
        garages: 3,
        orientation: "Frente Mar (Leste)",
        image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
        rooms: [
          { name: "Living & Sala de Jantar", dimensions: "8,80m x 6,10m", area: "53,68 m²" },
          { name: "Sacada com Churrasqueira", dimensions: "6,00m x 2,90m", area: "17,40 m²" },
          { name: "Suíte Master com Closet", dimensions: "5,40m x 4,20m", area: "22,68 m²" },
          { name: "Suíte 02", dimensions: "3,90m x 3,50m", area: "13,65 m²" },
          { name: "Suíte 03", dimensions: "3,80m x 3,40m", area: "12,92 m²" },
          { name: "Suíte 04", dimensions: "3,60m x 3,20m", area: "11,52 m²" }
        ]
      }
    ]
  },
  {
    id: "vetter-ocean-park",
    name: "The Ocean Park Vetter",
    aliases: ["the ocean", "ocean park", "ocean", "ocean breeze", "o ocean", "ocean vetter"],
    tagline: "Quadra Mar • Conforto & Design Contemporâneo",
    city: "Penha - SC",
    location: "Praia da Armação, Penha - SC",
    status: "Em Construção",
    category: "quadra-mar",
    deliveryDate: "Junho / 2027",
    priceStartingAt: "R$ 1.680.000",
    coverImage: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1000&q=80",
    description: "Conexão direta com a natureza exuberante de Penha e as praias mais desejadas do litoral catarinense, a passos do mar e perto de tudo.",
    driveFolderUrl: DRIVE_ROOT_URL,
    files: [
      {
        id: "ocean-tabela-norte",
        name: "Tabela Ocean Park Torre Norte - Agosto 2026.pdf",
        title: "Tabela de Vendas - Torre Norte (The Ocean)",
        type: "pdf",
        size: "2.3 MB",
        url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
        previewImage: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80",
        category: "tabela"
      },
      {
        id: "ocean-book-completo",
        name: "Book Apresentacao Comercial The Ocean Beach Club.pdf",
        title: "Book / Apresentação Comercial The Ocean",
        type: "pdf",
        size: "16.4 MB",
        url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
        previewImage: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=600&q=80",
        category: "book"
      },
      {
        id: "ocean-planta-01",
        name: "Planta Baixa Cotada Tipo 01 Torre Norte Ocean.jpg",
        title: "Planta Arquitetônica Cotada - Tipo 01 (135,20m²)",
        type: "image",
        size: "4.1 MB",
        url: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=80",
        previewImage: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=600&q=80",
        category: "planta"
      }
    ],
    specs: {
      suites: "3 Suítes",
      area: "126m² a 158m² privativos",
      garages: "2 Vagas",
      towers: 2,
      totalUnits: 64,
      differentiators: [
        "50 metros da praia da Armação",
        "Rooftop com piscina panorâmica e sky lounge"
      ]
    },
    floorPlans: [
      {
        id: "ocean-tipo-01",
        title: "Apartamento Tipo 01 - Torre Norte",
        area: "135,20 m² privativos",
        suites: 3,
        garages: 2,
        orientation: "Leste / Sol da manhã",
        image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
        rooms: [
          { name: "Living Gourmet Integrado", dimensions: "6,90m x 4,80m", area: "33,12 m²" },
          { name: "Suíte Master", dimensions: "4,40m x 3,60m", area: "15,84 m²" }
        ]
      }
    ]
  },
  {
    id: "vetter-palm-beach",
    name: "Palm Beach Vetter",
    aliases: ["palm beach", "palm", "palme beach", "palm beach vetter"],
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
    files: [
      {
        id: "palm-tabela",
        name: "Tabela de Precos e Vendas Palm Beach Vetter - Vigente.pdf",
        title: "Tabela de Vendas & Condições de Pagamento",
        type: "pdf",
        size: "2.4 MB",
        url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
        previewImage: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80",
        category: "tabela"
      },
      {
        id: "palm-book",
        name: "Book Apresentacao Comercial Palm Beach Luxury.pdf",
        title: "Book / Apresentação Comercial de Luxo",
        type: "pdf",
        size: "18.6 MB",
        url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
        previewImage: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80",
        category: "book"
      },
      {
        id: "palm-planta-01",
        name: "Planta Baixa Humanizada e Cotada Tipo 01 Palm Beach.jpg",
        title: "Planta Arquitetônica Cotada - Tipo 01 (178,50m²)",
        type: "image",
        size: "4.8 MB",
        url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80",
        previewImage: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80",
        category: "planta"
      }
    ],
    specs: {
      suites: "3 a 4 Suítes",
      area: "142m² a 285m² privativos",
      garages: "2 a 4 Vagas + Hobby Box",
      towers: 1,
      totalUnits: 48,
      differentiators: [
        "Vista mar permanente em todas as unidades",
        "Living gourmet integrado de 58m²"
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
          { name: "Living Integrado & Jantar", dimensions: "8,40m x 5,90m", area: "49,56 m²" }
        ]
      }
    ]
  },
  {
    id: "vetter-sunset-boulevard",
    name: "Sunset Boulevard Vetter",
    aliases: ["sunset boulevard", "sunset", "sanset", "sunset vetter"],
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
    files: [
      {
        id: "sunset-tabela",
        name: "Tabela Vendas Sunset Boulevard - Pronto para Morar.pdf",
        title: "Tabela de Unidades Prontas & Financiamento",
        type: "pdf",
        size: "1.9 MB",
        url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
        previewImage: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80",
        category: "tabela"
      },
      {
        id: "sunset-planta-01",
        name: "Planta Arquitetonica 148m Sunset Boulevard.jpg",
        title: "Planta Baixa Final Tipo 01 (148,00m²)",
        type: "image",
        size: "3.7 MB",
        url: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1600&q=80",
        previewImage: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=600&q=80",
        category: "planta"
      }
    ],
    specs: {
      suites: "3 a 4 Suítes",
      area: "138m² a 240m² privativos",
      garages: "2 a 3 Vagas",
      towers: 1,
      totalUnits: 36,
      differentiators: [
        "Empreendimento 100% pronto e entregue",
        "Cinema privativo Vetter, Wine Bar e Pub Inglês"
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
          { name: "Living 2 Ambientes", dimensions: "7,50m x 4,90m", area: "36,75 m²" }
        ]
      }
    ]
  },
  {
    id: "vetter-grand-palais",
    name: "Grand Palais Vetter",
    aliases: ["grand palais", "palais", "grand", "gran palais", "grand palai"],
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
    files: [
      {
        id: "grand-tabela",
        name: "Tabela Vendas Grand Palais Vetter 2026.pdf",
        title: "Tabela de Vendas & Fluxo Direto",
        type: "pdf",
        size: "2.8 MB",
        url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
        previewImage: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80",
        category: "tabela"
      },
      {
        id: "grand-book",
        name: "Book Apresentacao Grand Palais Boutique.pdf",
        title: "Book Executivo de Alto Luxo",
        type: "pdf",
        size: "22.4 MB",
        url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
        previewImage: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=600&q=80",
        category: "book"
      }
    ],
    specs: {
      suites: "4 Suítes Plenas",
      area: "195m² a 340m² privativos",
      garages: "3 a 4 Vagas",
      towers: 1,
      totalUnits: 20,
      differentiators: [
        "Apenas 2 apartamentos por andar com elevador privativo com biometria"
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
          { name: "Living Grand Saloon", dimensions: "9,20m x 6,40m", area: "58,88 m²" }
        ]
      }
    ]
  }
];

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
  }
];
