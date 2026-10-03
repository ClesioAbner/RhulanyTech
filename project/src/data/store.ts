export const STORE = {
  phone: '+258 87 959 6862',
  phoneHref: 'tel:+258879596862',
  whatsappUrl: 'https://wa.me/258879596862',
  email: 'info@rhulanytech.co.mz',
  address: 'Urbanização, Maputo',
  mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Rhulany%20Tech%20Urbaniza%C3%A7%C3%A3o%20Maputo',
  hours: 'Segunda a sábado, das 8h às 18h',
  facebookUrl: 'https://facebook.com/RhulanyTech',
  instagramUrl: 'https://instagram.com/RhulanyTech',
};

export const SOCIAL = [
  { id: 'whatsapp', label: 'WhatsApp', href: STORE.whatsappUrl },
  { id: 'facebook', label: 'Facebook', href: STORE.facebookUrl },
  { id: 'instagram', label: 'Instagram', href: STORE.instagramUrl },
] as const;
