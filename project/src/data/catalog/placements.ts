/*
 * Which shelves each product sits on, as "category/subcategory" paths.
 * A product can appear in several places (a gaming PC is both a computer and a gaming product).
 */
export const PLACEMENTS: Record<string, string[]> = {
  // Celulares
  '1': ['celulares/iphone'],
  '2': ['celulares/samsung'],
  '3': ['celulares/google-pixel'],
  '4': ['celulares/oneplus'],
  '5': ['celulares/xiaomi'],
  // Computadores
  '6': ['computadores/mac', 'computadores/portateis'],
  '8': ['computadores/windows', 'computadores/portateis'],
  '9': ['computadores/pcs-gaming', 'gaming/pcs-gaming'],
  '20': ['computadores/componentes'],
  '21': ['computadores/componentes'],
  '22': ['computadores/componentes'],
  '23': ['computadores/componentes'],
  // Gaming
  '10': ['gaming/playstation'],
  '11': ['gaming/xbox'],
  '12': ['gaming/nintendo'],
  '13': ['gaming/portateis-de-jogo'],
  '18': ['gaming/monitores-gaming'],
  // Câmaras
  '24': ['cameras/sony'],
  '25': ['cameras/canon'],
  '26': ['cameras/nikon'],
  '27': ['cameras/fujifilm'],
  '28': ['cameras/camaras-de-accao'],
  // Casa inteligente
  '29': ['casa-inteligente/colunas-inteligentes'],
  '30': ['casa-inteligente/colunas-inteligentes'],
  '31': ['casa-inteligente/ecras-inteligentes'],
  '32': ['casa-inteligente/camaras-inteligentes'],
  '33': ['casa-inteligente/dispositivos'],
  // Acessórios
  '14': ['acessorios/ratos'],
  '15': ['acessorios/ratos'],
  '16': ['acessorios/teclados'],
  '17': ['acessorios/auscultadores'],
  '19': ['acessorios/webcams'],
  '34': ['acessorios/auscultadores'],
  '35': ['acessorios/carregadores'],
  '36': ['acessorios/hubs'],
  '37': ['acessorios/capas'],
};
