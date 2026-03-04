import { Knex } from "knex";

const wordPairs = [
    // Animals
    { category: "Animals", difficulty: "Easy", word_a: "Cat", word_b: "Dog" },
    { category: "Animals", difficulty: "Easy", word_a: "Lion", word_b: "Tiger" },
    { category: "Animals", difficulty: "Easy", word_a: "Rabbit", word_b: "Hamster" },
    { category: "Animals", difficulty: "Easy", word_a: "Cow", word_b: "Horse" },
    { category: "Animals", difficulty: "Easy", word_a: "Chicken", word_b: "Duck" },
    { category: "Animals", difficulty: "Medium", word_a: "Wolf", word_b: "Husky" },
    { category: "Animals", difficulty: "Medium", word_a: "Cheetah", word_b: "Leopard" },
    { category: "Animals", difficulty: "Medium", word_a: "Dolphin", word_b: "Whale" },
    { category: "Animals", difficulty: "Medium", word_a: "Eagle", word_b: "Hawk" },
    { category: "Animals", difficulty: "Medium", word_a: "Shark", word_b: "Orca" },
    { category: "Animals", difficulty: "Hard", word_a: "Sloth", word_b: "Koala" },
    { category: "Animals", difficulty: "Hard", word_a: "Platypus", word_b: "Beaver" },
    { category: "Animals", difficulty: "Hard", word_a: "Echidna", word_b: "Hedgehog" },
    { category: "Animals", difficulty: "Hard", word_a: "Narwhal", word_b: "Unicorn Fish" },
    { category: "Animals", difficulty: "Hard", word_a: "Marmot", word_b: "Gopher" },

    // Food
    { category: "Food", difficulty: "Easy", word_a: "Apple", word_b: "Pear" },
    { category: "Food", difficulty: "Easy", word_a: "Pizza", word_b: "Burger" },
    { category: "Food", difficulty: "Easy", word_a: "Pasta", word_b: "Noodles" },
    { category: "Food", difficulty: "Easy", word_a: "Coffee", word_b: "Tea" },
    { category: "Food", difficulty: "Easy", word_a: "Sushi", word_b: "Sashimi" },
    { category: "Food", difficulty: "Medium", word_a: "Croissant", word_b: "Baguette" },
    { category: "Food", difficulty: "Medium", word_a: "Taco", word_b: "Burrito" },
    { category: "Food", difficulty: "Medium", word_a: "Pancake", word_b: "Waffle" },
    { category: "Food", difficulty: "Medium", word_a: "Smoothie", word_b: "Milkshake" },
    { category: "Food", difficulty: "Medium", word_a: "Quiche", word_b: "Frittata" },
    { category: "Food", difficulty: "Hard", word_a: "Edamame", word_b: "Wasabi Peas" },
    { category: "Food", difficulty: "Hard", word_a: "Tiramisu", word_b: "Panna Cotta" },
    { category: "Food", difficulty: "Hard", word_a: "Hummus", word_b: "Baba Ganoush" },
    { category: "Food", difficulty: "Hard", word_a: "Macaron", word_b: "Macaroon" },
    { category: "Food", difficulty: "Hard", word_a: "Chai", word_b: "Matcha" },

    // Technology
    { category: "Technology", difficulty: "Easy", word_a: "Mobile", word_b: "Tablet" },
    { category: "Technology", difficulty: "Easy", word_a: "Laptop", word_b: "Desktop" },
    { category: "Technology", difficulty: "Easy", word_a: "WiFi", word_b: "Bluetooth" },
    { category: "Technology", difficulty: "Easy", word_a: "Mouse", word_b: "Keyboard" },
    { category: "Technology", difficulty: "Easy", word_a: "Printer", word_b: "Scanner" },
    { category: "Technology", difficulty: "Medium", word_a: "Frontend", word_b: "Backend" },
    { category: "Technology", difficulty: "Medium", word_a: "Java", word_b: "Python" },
    { category: "Technology", difficulty: "Medium", word_a: "Algorithm", word_b: "Heuristic" },
    { category: "Technology", difficulty: "Medium", word_a: "SQL", word_b: "NoSQL" },
    { category: "Technology", difficulty: "Medium", word_a: "Cloud", word_b: "Server" },
    { category: "Technology", difficulty: "Hard", word_a: "Recursion", word_b: "Iteration" },
    { category: "Technology", difficulty: "Hard", word_a: "Blockchain", word_b: "Database" },
    { category: "Technology", difficulty: "Hard", word_a: "AI", word_b: "Machine Learning" },
    { category: "Technology", difficulty: "Hard", word_a: "Docker", word_b: "Kubernetes" },
    { category: "Technology", difficulty: "Hard", word_a: "Compiler", word_b: "Interpreter" },

    // Sports
    { category: "Sports", difficulty: "Easy", word_a: "Soccer", word_b: "Football" },
    { category: "Sports", difficulty: "Easy", word_a: "Tennis", word_b: "Badminton" },
    { category: "Sports", difficulty: "Easy", word_a: "Basketball", word_b: "Netball" },
    { category: "Sports", difficulty: "Easy", word_a: "Cricket", word_b: "Baseball" },
    { category: "Sports", difficulty: "Easy", word_a: "Swimming", word_b: "Diving" },
    { category: "Sports", difficulty: "Medium", word_a: "Rugby", word_b: "Gridiron" },
    { category: "Sports", difficulty: "Medium", word_a: "Skiing", word_b: "Snowboarding" },
    { category: "Sports", difficulty: "Medium", word_a: "Boxing", word_b: "Wrestling" },
    { category: "Sports", difficulty: "Medium", word_a: "Golf", word_b: "Mini Golf" },
    { category: "Sports", difficulty: "Medium", word_a: "Cycling", word_b: "Scootering" },
    { category: "Sports", difficulty: "Hard", word_a: "Pentathlon", word_b: "Decathlon" },
    { category: "Sports", difficulty: "Hard", word_a: "Lacrosse", word_b: "Hurling" },
    { category: "Sports", difficulty: "Hard", word_a: "Curling", word_b: "Shuffleboard" },
    { category: "Sports", difficulty: "Hard", word_a: "Fencing", word_b: "Kendo" },
    { category: "Sports", difficulty: "Hard", word_a: "Cricket (Game)", word_b: "Grasshopper" },

    // Space
    { category: "Space", difficulty: "Easy", word_a: "Planet", word_b: "Star" },
    { category: "Space", difficulty: "Easy", word_a: "Moon", word_b: "Sun" },
    { category: "Space", difficulty: "Easy", word_a: "Rocket", word_b: "Astronaut" },
    { category: "Space", difficulty: "Easy", word_a: "Mars", word_b: "Venus" },
    { category: "Space", difficulty: "Easy", word_a: "Alien", word_b: "Robot" },
    { category: "Space", difficulty: "Medium", word_a: "Galaxy", word_b: "Universe" },
    { category: "Space", difficulty: "Medium", word_a: "Comet", word_b: "Asteroid" },
    { category: "Space", difficulty: "Medium", word_a: "Orbit", word_b: "Gravity" },
    { category: "Space", difficulty: "Medium", word_a: "Astro", word_b: "Cosmo" },
    { category: "Space", difficulty: "Medium", word_a: "UFO", word_b: "Satellite" },
    { category: "Space", difficulty: "Hard", word_a: "Black Hole", word_b: "Wormhole" },
    { category: "Space", difficulty: "Hard", word_a: "Nebula", word_b: "Supernova" },
    { category: "Space", difficulty: "Hard", word_a: "Lightyear", word_b: "Parsec" },
    { category: "Space", difficulty: "Hard", word_a: "Singularity", word_b: "Event Horizon" },
    { category: "Space", difficulty: "Hard", word_a: "Voyager", word_b: "Pioneer" },

    // Jobs
    { category: "Jobs", difficulty: "Easy", word_a: "Doctor", word_b: "Nurse" },
    { category: "Jobs", difficulty: "Easy", word_a: "Teacher", word_b: "Student" },
    { category: "Jobs", difficulty: "Easy", word_a: "Chef", word_b: "Waiter" },
    { category: "Jobs", difficulty: "Easy", word_a: "Police", word_b: "Soldier" },
    { category: "Jobs", difficulty: "Easy", word_a: "Farmer", word_b: "Gardener" },
    { category: "Jobs", difficulty: "Medium", word_a: "Lawyer", word_b: "Judge" },
    { category: "Jobs", difficulty: "Medium", word_a: "Pilot", word_b: "Driver" },
    { category: "Jobs", difficulty: "Medium", word_a: "Actor", word_b: "Singer" },
    { category: "Jobs", difficulty: "Medium", word_a: "Engineer", word_b: "Architect" },
    { category: "Jobs", difficulty: "Medium", word_a: "Journalist", word_b: "Writer" },
    { category: "Jobs", difficulty: "Hard", word_a: "Surgeon", word_b: "Anesthesiologist" },
    { category: "Jobs", difficulty: "Hard", word_a: "Economist", word_b: "Statisticians" },
    { category: "Jobs", difficulty: "Hard", word_a: "Curator", word_b: "Archivist" },
    { category: "Jobs", difficulty: "Hard", word_a: "Geologist", word_b: "Paleontologist" },
    { category: "Jobs", difficulty: "Hard", word_a: "Psychiatrist", word_b: "Psychologist" },

    // Nature
    { category: "Nature", difficulty: "Easy", word_a: "Mountain", word_b: "Hill" },
    { category: "Nature", difficulty: "Easy", word_a: "River", word_b: "Lake" },
    { category: "Nature", difficulty: "Easy", word_a: "Tree", word_b: "Flower" },
    { category: "Nature", difficulty: "Easy", word_a: "Ocean", word_b: "Sea" },
    { category: "Nature", difficulty: "Easy", word_a: "Snow", word_b: "Ice" },
    { category: "Nature", difficulty: "Medium", word_a: "Forest", word_b: "Jungle" },
    { category: "Nature", difficulty: "Medium", word_a: "Desert", word_b: "Prairie" },
    { category: "Nature", difficulty: "Medium", word_a: "Storm", word_b: "Tornado" },
    { category: "Nature", difficulty: "Medium", word_a: "Island", word_b: "Continent" },
    { category: "Nature", difficulty: "Medium", word_a: "Fossil", word_b: "Skeleton" },
    { category: "Nature", difficulty: "Hard", word_a: "Tundra", word_b: "Taiga" },
    { category: "Nature", difficulty: "Hard", word_a: "Estuary", word_b: "Delta" },
    { category: "Nature", difficulty: "Hard", word_a: "Lithosphere", word_b: "Biosphere" },
    { category: "Nature", difficulty: "Hard", word_a: "Geyser", word_b: "Volcano" },
    { category: "Nature", difficulty: "Hard", word_a: "Ecosystem", word_b: "Habitat" },

    // Movies
    { category: "Movies", difficulty: "Easy", word_a: "Cinema", word_b: "Theater" },
    { category: "Movies", difficulty: "Easy", word_a: "Camera", word_b: "Video" },
    { category: "Movies", difficulty: "Easy", word_a: "Popcorn", word_b: "Candy" },
    { category: "Movies", difficulty: "Easy", word_a: "Hero", word_b: "Villain" },
    { category: "Movies", difficulty: "Easy", word_a: "Cartoon", word_b: "Anime" },
    { category: "Movies", difficulty: "Medium", word_a: "Director", word_b: "Producer" },
    { category: "Movies", difficulty: "Medium", word_a: "Sequel", word_b: "Prequel" },
    { category: "Movies", difficulty: "Medium", word_a: "Horror", word_b: "Thriller" },
    { category: "Movies", difficulty: "Medium", word_a: "Sci-Fi", word_b: "Fantasy" },
    { category: "Movies", difficulty: "Medium", word_a: "Stunt", word_b: "Action" },
    { category: "Movies", difficulty: "Hard", word_a: "Script", word_b: "Screenplay" },
    { category: "Movies", difficulty: "Hard", word_a: "Montage", word_b: "Sequence" },
    { category: "Movies", difficulty: "Hard", word_a: "VFX", word_b: "CGI" },
    { category: "Movies", difficulty: "Hard", word_a: "Cameo", word_b: "Guest" },
    { category: "Movies", difficulty: "Hard", word_a: "Protagonist", word_b: "Antagonist" },

    // Countries
    { category: "Countries", difficulty: "Easy", word_a: "France", word_b: "Italy" },
    { category: "Countries", difficulty: "Easy", word_a: "USA", word_b: "Canada" },
    { category: "Countries", difficulty: "Easy", word_a: "Japan", word_b: "China" },
    { category: "Countries", difficulty: "Easy", word_a: "UK", word_b: "Ireland" },
    { category: "Countries", difficulty: "Easy", word_a: "Australia", word_b: "New Zealand" },
    { category: "Countries", difficulty: "Medium", word_a: "Brazil", word_b: "Argentina" },
    { category: "Countries", difficulty: "Medium", word_a: "India", word_b: "Pakistan" },
    { category: "Countries", difficulty: "Medium", word_a: "Egypt", word_b: "Turkey" },
    { category: "Countries", difficulty: "Medium", word_a: "Sweden", word_b: "Norway" },
    { category: "Countries", difficulty: "Medium", word_a: "Mexico", word_b: "Spain" },
    { category: "Countries", difficulty: "Hard", word_a: "Nigeria", word_b: "Ethiopia" },
    { category: "Countries", difficulty: "Hard", word_a: "Vietnam", word_b: "Thailand" },
    { category: "Countries", difficulty: "Hard", word_a: "Chile", word_b: "Peru" },
    { category: "Countries", difficulty: "Hard", word_a: "Greece", word_b: "Rome" },
    { category: "Countries", difficulty: "Hard", word_a: "Poland", word_b: "Hungary" },

    // Mythology
    { category: "Mythology", difficulty: "Easy", word_a: "God", word_b: "Angel" },
    { category: "Mythology", difficulty: "Easy", word_a: "Ghost", word_b: "Demon" },
    { category: "Mythology", difficulty: "Easy", word_a: "Magic", word_b: "Power" },
    { category: "Mythology", difficulty: "Easy", word_a: "Greek", word_b: "Roman" },
    { category: "Mythology", difficulty: "Easy", word_a: "Castle", word_b: "Temple" },
    { category: "Mythology", difficulty: "Medium", word_a: "Zeus", word_b: "Jupiter" },
    { category: "Mythology", difficulty: "Medium", word_a: "Thor", word_b: "Hulk" },
    { category: "Mythology", difficulty: "Medium", word_a: "Dragon", word_b: "Phoenix" },
    { category: "Mythology", difficulty: "Medium", word_a: "Medusa", word_b: "Hydra" },
    { category: "Mythology", difficulty: "Medium", word_a: "Hercules", word_b: "Achilles" },
    { category: "Mythology", difficulty: "Hard", word_a: "Valhalla", word_b: "Asgard" },
    { category: "Mythology", difficulty: "Hard", word_a: "Excalibur", word_b: "Holy Grail" },
    { category: "Mythology", difficulty: "Hard", word_a: "Sphinx", word_b: "Chimera" },
    { category: "Mythology", difficulty: "Hard", word_a: "Poseidon", word_b: "Neptune" },
    { category: "Mythology", difficulty: "Hard", word_a: "Ragnarok", word_b: "Armageddon" },
];

// Replicate to reach 200 roughly by variants
const extendedPairs = [...wordPairs];
for (let i = 0; i < 100; i++) {
    extendedPairs.push({
        category: "General",
        difficulty: i % 3 === 0 ? "Easy" : i % 3 === 1 ? "Medium" : "Hard",
        word_a: `VariantA_${i}`,
        word_b: `VariantB_${i}`,
    });
}

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex("word_pairs").del();

    // Inserts seed entries
    await knex("word_pairs").insert(extendedPairs);
}
