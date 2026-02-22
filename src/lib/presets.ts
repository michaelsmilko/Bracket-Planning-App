/**
 * Curated tour presets. Organizer picks one to fill the bracket with every date/location.
 */

export type Preset = {
  id: string;
  name: string;
  options: { id: string; label: string }[];
};

export const PRESETS: Preset[] = [
  {
    id: "rufus-na-2026",
    name: "Rüfüs Du Sol – North America 2026",
    options: [
      { id: "gorge", label: "Jun 5 – The Gorge, George, WA" },
      { id: "kc", label: "Jun 10 – Morton Amphitheater, Kansas City, MO" },
      { id: "chicago", label: "Jun 12 – Wrigley Field, Chicago, IL" },
      { id: "bonnaroo", label: "Jun 13 – Bonnaroo, Manchester, TN" },
      { id: "charlotte", label: "Jun 16 – Truliant Amphitheater, Charlotte, NC" },
      { id: "dc", label: "Jun 18 – Audi Field, Washington, DC" },
      { id: "montreal", label: "Jun 20 – Parc Jean-Drapeau, Montréal, QC" },
      { id: "boston", label: "Jun 23 – Fenway Park, Boston, MA" },
      { id: "nyc", label: "Jun 25 – Madison Square Garden, New York, NY" },
      { id: "birmingham", label: "Jun 30 – Coca-Cola Amphitheater, Birmingham, AL" },
      { id: "mexico", label: "Jul 4 – Estadio GNP Seguros, Mexico City, MX" },
      { id: "la", label: "Aug 6 – Kia Forum, Los Angeles, CA" },
      { id: "sandiego", label: "Aug 15 – Petco Park, San Diego, CA" },
      { id: "phoenix", label: "Aug 19 – Phoenix, AZ" },
      { id: "albuquerque", label: "Aug 20 – Albuquerque, NM" },
      { id: "boulder", label: "Aug 22 – Folsom Field, Boulder, CO" },
      { id: "minneapolis", label: "Aug 25 – Mystic Lake Amphitheater, Minneapolis, MN" },
      { id: "milwaukee", label: "Aug 26 – American Family Insurance Amphitheater, Milwaukee, WI" },
      { id: "cleveland", label: "Aug 27 – Blossom Music Center, Cleveland, OH" },
      { id: "atlantic", label: "Aug 29 – Atlantic City Beach, Atlantic City, NJ" },
      { id: "grandrapids", label: "Sep 1 – Acrisure Amphitheater, Grand Rapids, MI" },
      { id: "cincinnati", label: "Sep 2 – Riverbend Music Center, Cincinnati, OH" },
      { id: "pittsburgh", label: "Sep 3 – The Pavilion at Star Lake, Pittsburgh, PA" },
      { id: "toronto", label: "Sep 5 – Rogers Centre, Toronto, ON" },
    ],
  },
];
