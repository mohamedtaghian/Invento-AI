import type { ProductDetail, RelatedProduct } from './product.interface';

export const AURA_WATCH: ProductDetail = {
  id: 'p19',
  category: 'Electronics',
  name: 'Aura Smart Watch Series X',
  tagline:
    'The ultimate companion for your sophisticated lifestyle, featuring advanced AI health tracking and seamless connectivity.',
  badge: 'New Release',
  rating: 4.9,
  reviewCount: 128,
  price: 299,
  compareAtPrice: 349,
  inStock: true,
  shippingNote: 'Ships within 24 hours',
  images: [
    {
      id: 'img-main',
      src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCfmXWGxzcQwstYZ-Y1gQcoSHt_veYy3saQ-B1FF_9yIuNH4SUQgGTaa7LXJKWnCGkrXTiEK9dbSd8TKd-BPPTMCNUAggemlWAw45N6EVnJcBwfPk-0QBBNeLZvYCzCTz5TyxSXE7E1OOB_4qnfiwVsWV-8HwfKvLE6-GrEiL25j7hNFeuEpktBYZEBz_e5XXoNOTUj-f9bgzHufWO0jU5NQeAV5HZ_0NkCM73lQfD9uDcUMEYsr2-8T2KpM1BteKZ7HNjkJOWMwoU',
      alt: 'Aura Smart Watch Series X shown against a clean studio background.',
    },
    {
      id: 'img-face',
      src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDxVSAVCKYWEY9kWLIM5h9EErCSEqbQx3duoEv7vbf4cP9yAIISd056aAkDRyn-Rf-76mwwVgxdOuGEdqVeoM-l04I2iLyMugdvB-C60CDyt6ypJzZaRYwQmlPMSDQKBULkr-XEog6d115I6-p8hnhKvlth7A9CYsb3LgWvyan4HsN0GlIWpoQRjjOiCPgUx7dOV8uOOnzw7b-jUN3rmsPUDeryM-urf0RB-nbndoofPrkfDtImyyKuxlYVSzaW2qAGoaobjOhLje0',
      alt: 'Close-up of the smart watch face showing the vibrant display.',
    },
    {
      id: 'img-side',
      src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBKo1jWsXixsOgwpa7EdwkWySURM-rYE3546r9PE4-ky2CutLjaVsW4YmJMDh_ZhgSeDtsDwCh3Lo-V7FMP7VT-Q8FyUqz2nBlaLMdBBrZphOIFEYW_Ed_-FyJhB4m1uD3VsV_FMMCuazeeh8xY93oyu0GwMrxgKKEQVy9Z3vPvszuW8ktnNDIqSpo36RqSNxIUI-H9a6Lyc-LVZHdEJFjVnCgCQkWtkUNIKsl2Vb_IJP3neQkC-kcWfvYF1tRtfj93as3wkeXNXm0',
      alt: 'Side profile view showing slim design and buttons.',
    },
    {
      id: 'img-band',
      src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCmZ3zmG4onMSXr_yAu4ScVUOYbgGS3AmeTzZ9oy68ra73smyk6mj4FuK5YDboYFV60i7JUgwFzu8z17RkkRZw_GaVz-z3XH_0_HMK8cosHos4wWsU594H6xE5jYSeXiG2e0HBRbN-uf3m5y0Zz_jVLje6RniZWH2hlW-iXM_GOK6y4IU0Pwxjf0mAJlmcIUiQzLSnIm9NwhRsN1VyS8tC_q-_P7HYBOhhUPNjIXlcuIICPgl5eKLJ_ZV3lSsUQTYlHwjOGAwXzIkg',
      alt: 'Detail shot of the watch band texture and material.',
    },
    {
      id: 'img-lifestyle',
      src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB5_-rAl0y2cszCQmufcCjMUvWogv3xfZeKb8I8JZrTRzAR71407uRaXWtiLMMRllXF_pgB1jSyzvxP6CGxMh6YGdykVpoEmSFauv-j_ybmkyx6mTsH5pvMsMr5EQsmprQ-n4VHNW2IxlCMEufCDajDoIsmVjTOcfWnC2QOGHWD-9LEbs1yOdeTxbZB9_2-1-gMtLc7MCEhVNiPaseknTD5eYw1i3IW7O-MCqLk40HNtWQ3ao-XdOaLgHLpK0sru-o0mAs10xHGXtg',
      alt: 'Watch worn on a wrist in a professional setting.',
    },
  ],
  colors: [
    { id: 'midnight-blue', label: 'Midnight Blue', hex: '#1e293b' },
    { id: 'cloud-white', label: 'Cloud White', hex: '#e2e8f0' },
    { id: 'obsidian-black', label: 'Obsidian Black', hex: '#0f172a' },
  ],
  sizes: [
    { id: '41mm', label: '41mm' },
    { id: '45mm', label: '45mm' },
  ],
  highlights: [
    'Always-On Retina display',
    'Blood Oxygen app & ECG app',
    'High and low heart rate notifications',
    'Water resistant up to 50 meters',
    'Up to 18 hours of battery life',
  ],
  shippingReturnsPolicy:
    'Free standard shipping on all orders. Returns accepted within 30 days of purchase.',
};

export const RELATED_PRODUCTS: readonly RelatedProduct[] = [
  {
    id: 'aura-magcharge-pad',
    name: 'Aura MagCharge Pad',
    category: 'Accessories',
    price: 49,
    rating: 4.8,
    image: {
      id: 'img-magcharge',
      src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCQrmBedtELbjsQoCRxlyybV0A945s9MpdiK9j3xkMLACpDDrKWZC7VK7j0fgDvR-zUozp1YfIKdCgy479b4hbfI3kgTjMU-LHlbNlQnFXqWRlicvkFjxUCmB7hrnJgEA2RBM9i7b5SrZ4Otm_AVcX3BdNJ9xyOgo46Y0OyAK4BKQ63G36Njpsbfz5cHAUa-LQ3GxpLYBFSL6YQMGYYXNrtt5s9DwMuji2awReqnCyi2-w5tm1FePxzPse0z5LIi3WJBm7H9UxFtaY',
      alt: 'Wireless charging pad on a desk.',
    },
  },
  {
    id: 'aura-soundpro-max',
    name: 'Aura SoundPro Max',
    category: 'Audio',
    price: 199,
    rating: 4.9,
    image: {
      id: 'img-soundpro',
      src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBQOFgaZaOdCl5vmrGGBVDfA7JVxRxObG2gGqnfWFyrqEJdkShnNwxWAvHdGkiA9qfRQ591_3_X6SAATmnnXrpsdXUSmDq7uNtYe5mGfV4MahbmHWTUZZ2iakiydpiOyeBXIvCLI52qQtf_DV6ow4zua7pb3Uk-0ufFNSkAQMUAmSHFkII9r7s_jjUi487CmXRR9HLw1gF7fCViY57UmUGclgJ-hWQH_MhcPSmR0IZKmHTJ0RpBMHDtOqS8i_lOLQcm-x8LOMu9Ie4',
      alt: 'Over-ear headphones on a stand.',
    },
  },
  {
    id: 'braided-fast-cable-2m',
    name: 'Braided Fast Cable (2m)',
    category: 'Accessories',
    price: 29,
    rating: 4.7,
    image: {
      id: 'img-cable',
      src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCJ6E48wzBsR1OGDO0d5oRM6EBEbDuDzFOMk4k8X7F6Jdp3CNkIWolL0j9Zh0osSKqUPMn8Mup0L_xUQ8PtRZxBolj3y0tHFOu55X48CAlwkT0hZZeE8yb0pEnIAkEP6ovl0SSlE8LqrLHurx6uEFw6C1oDGoNqzK99JtyzxK-CwBo59Ac_ORTq4EsNidqyTjdovdUJb5ykpBDFwSVQqv_KDj_OJvHfVj3QwSw_a77RUekjA61rpR4y4pm9Loorn_phEXtWslxvYAE',
      alt: 'Braided USB-C cable coiled on a surface.',
    },
  },
  {
    id: 'aura-buds-pro',
    name: 'Aura Buds Pro',
    category: 'Audio',
    price: 149,
    rating: 4.6,
    image: {
      id: 'img-buds',
      src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBs39-RytU_EsAsbTTocgGD_G6FfziCXcmm68ECwqMltoDawYWsKQjxmRD6HvJaloNQvHwzbMh3r_kWEIUMHCDgc1EpbruYCW8V4AKgOnwUQNiBTC417_ISd5LLyp_jEK7mlRHW6E7_iWBhON1I_HFvBSLkQwoNhVNU7G6Q6ykVPXUEMgthlEwXgB2P-HSN8sOHSUrOlfwo95OI65Hk9JDHOfBA9RRVsrcfGRyub6rlr-3gDB4OAuBx8jOGQ56GfakoFkUDgJwf53o',
      alt: 'Earbuds in charging case on marble.',
    },
  },
];
