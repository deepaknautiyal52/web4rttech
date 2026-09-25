// Sister businesses run alongside Web4rtTech, each on its own website.
// This is the single source for the Ventures page, the Home section,
// the footer column and the site map.
//
// `url` is the venture's own site (full https:// address). While it is
// empty, the "Visit website" button is hidden and visitors are pointed to
// the Contact page instead, so nothing ever links to a dead address.
const ventures = [
  {
    id: 'homestay',
    name: 'Uttarakhand Homestay',
    category: 'Hospitality & Travel',
    url: '',
    tagline: 'Stay in the hills, live like a local',
    description:
      'Comfortable, family-run homestays in the mountains of Uttarakhand: fresh air, home-cooked Pahadi food, and Himalayan views away from the crowded hotels.',
    highlights: ['Homestays in the Uttarakhand hills', 'Home-cooked local food', 'Help with local sightseeing and treks', 'Ideal for families, couples and remote workers'],
    color: '#059669'
  },
  {
    id: 'real-estate',
    name: 'Real Estate',
    category: 'Property',
    url: '',
    tagline: 'Buy, sell and rent property with confidence',
    description:
      'Help with residential and commercial property: finding the right home, plot or investment, arranging site visits, and guiding you through the paperwork.',
    highlights: ['Residential and commercial property', 'Plots, homes and rentals', 'Site visits arranged', 'Guidance through the paperwork'],
    color: '#D97706'
  },
  {
    id: 'yoga',
    name: 'Yoga & Wellness',
    category: 'Health & Wellness',
    url: '',
    tagline: 'Yoga for a calmer, healthier life',
    description:
      'Yoga sessions and wellness programmes rooted in the traditions of Uttarakhand, the land of yoga, for beginners and experienced practitioners alike.',
    highlights: ['Classes for all levels', 'Breathing and meditation practice', 'Wellness retreats in the hills', 'Online and in-person sessions'],
    color: '#7C3AED'
  }
];

export default ventures;
