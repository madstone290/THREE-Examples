interface Painting {
    name: string;
    artist: string;
    file: string;
}
const PAINTING_LIST: Painting[] = [
    { name: "Starry Night 1889", artist: "Vincent van Gogh (1853-1890)", file: "gogh001.jpg" },
    { name: "Irises 1889", artist: "Vincent van Gogh (1853-1890)", file: "gogh002.jpg" },
    { name: "Napoleon Crossing the Alps on 20th May 1800 1803", artist: "Jacques-Louis David (1748-1825)", file: "davidjl006.jpg" },
    { name: "The Scream 1893", artist: "Edvard Munch (1863-1944)", file: "munch004.jpg" },
    { name: "Water Lily Pond, (Symphony in Green) 1899", artist: "Claude Monet (1840-1926)", file: "monet018.jpg" },
    { name: "The Kiss c.1907/08", artist: "Gustav Klimt (1862-1918)", file: "klimt001.jpg" },
    { name: "The Man with the Golden Helmet 1636", artist: "van Rijn Rembrandt (1606-1669)", file: "rembrandt253.jpg" },
    { name: "The Cafe Terrace on the Place du Forum, Arles 1888", artist: "Vincent van Gogh (1853-1890)", file: "gogh151.jpg" },
    { name: "The Garden of Earthly Delights c.1490/00", artist: "Hieronymus Bosch (c.1450-1516)", file: "bosch-006.jpg" },
    { name: "Blossoming Almond Tree 1890", artist: "Vincent van Gogh (1853-1890)", file: "gogh103.jpg" },
    { name: "The Wanderer Above a Sea of Mist 1818", artist: "Caspar David Friedrich (1774-1840)", file: "friedrich016.jpg" },
    { name: "The Swing 1767", artist: "Jean-Honore Fragonard (1732-1806)", file: "fragonard002.jpg" },
    { name: "The Birth of Venus c.1485", artist: "Sandro Botticelli (1445-1510)", file: "botticelli001.jpg" },
    { name: "Portrait of Adele Bloch-Bauer I 1907", artist: "Gustav Klimt (1862-1918)", file: "klimt016.jpg" },
    { name: "Two Sisters (On the Terrace) 1881", artist: "Pierre-Auguste Renoir (1841-1919)", file: "renoir004.jpg" },
    { name: "Mona Lisa (La Gioconda) c.1503/06", artist: "Leonardo da Vinci (1452-1519)", file: "leonardo004.jpg" },
    { name: "The Calling of Saint Matthew 1599", artist: "Michelangelo Merisi da Caravaggio (1571-1610)", file: "caravaggio031.jpg" },
    { name: "Dancers in Blue 1890", artist: "Hilaire Germain Edgar Degas (1834-1917)", file: "degas051.jpg" },
    { name: "Composition 8 1923", artist: "Wassily Kandinsky (1866-1944)", file: "kandinsky019.jpg" },
    { name: "Luncheon of the Boating Party c.1880/81", artist: "Pierre-Auguste Renoir (1841-1919)", file: "renoir090.jpg" },
    { name: "Flaming June 1895", artist: "Lord Frederick Leighton (1830-1896)", file: "leighton001.jpg" },
    { name: "The Lady of Shalott 1888", artist: "John William Waterhouse (1849-1917)", file: "waterhouse001.jpg" },
    { name: "The Girl with a Pearl Earring c.1665/66", artist: "Johannes Vermeer, van Delft (1632-1675)", file: "vermeer005.jpg" },
    { name: "The Lunch on the Grass 1863", artist: "Edouard Manet (1832-1883)", file: "manet002.jpg" },

];
export { PAINTING_LIST };
export type { Painting };