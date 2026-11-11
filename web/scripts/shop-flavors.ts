/**
 * Flavour lists the shop hands us, keyed by catalogue title. A product listed
 * here shows exactly these flavours, replacing whatever the POS export had.
 *
 * Source: Kemal's product list (PDF, 2026-11-10), read column by column and
 * checked against the page images. Every name, old or new, has obvious typos
 * fixed (Rasberry, Tripple, Methol, pineapplee, …) and consistent title case;
 * a spelling-only difference from the old POS name counts as the same flavour.
 *
 * Not here on purpose: cone pack sizes (not flavours), and the products the
 * list names but the site does not carry or could not map with confidence
 * (Pyne kits, Pillow Talk, Juul, Mello Pro, Grabba Leaf).
 */
export const SHOP_FLAVORS: Record<string, string[]> = {
  "Foger Kit + Pod 30.000 Puff": [
    "Baja Splash", "Berry Bliss", "Blackberry Blueberry",
    "Blackberry Passion Refresher", "Blue Dragon", "Blue Rancher B-Pop",
    "Blue Razz Ice", "Blue Sour Raspberry", "Blueberry Cotton Candy",
    "Blueberry Watermelon", "California Cherry", "Cherry Bomb", "Cherry Slush",
    "Chocolate Cupcake", "Clear", "Coconut Cupcake", "Coffee", "Cola Slush",
    "Cool Mint", "Dragon Fruit Lemonade", "Dragon Melon", "Drop Sour Savers",
    "Frozen Banana", "Frozen Blackberry", "Frozen Blueberry", "Frozen Lemon",
    "Frozen Orange Green", "Frozen Pineapple", "Frozen Strawberry GrapeFruit",
    "Frozen Summer Grape", "Frozen Watermelon", "Grape Slush", "Gum Mint",
    "Gummy Bear", "Hawaiian Punch", "Icy Mint", "Juicy Peach Ice",
    "Kiwi Dragon Berry", "Lemon Heads", "Lemon Hubba", "Lime Berry Orange",
    "Meta Moon", "Mexico Mango", "Miami Mint", "Mint Lemonade", "Omg B-Pop",
    "Orange Dream Refresher", "Orange Slush", "Peach Slush",
    "Pineapple Coconut", "Pineapple Savers", "Pink Lemonade", "Pink&Blue",
    "Purple Passion Punch", "Red Mix Refresher", "Red Velvet Cupcake",
    "Skittles Cupcake", "Sour Apple Ice", "Sour Blue Dust",
    "Sour Cherry Savers", "Sour Cranapple", "Sour Fcuking Fab", "Sour Gush",
    "Sour Punch", "Sour Raspberry Punch", "Strawberry B-Pop",
    "Strawberry Banana", "Strawberry Cotton Candy", "Strawberry CupCake",
    "Strawberry Ice", "Strawberry Kiwi", "Strawberry Mango",
    "Strawberry Savers", "Strawberry Slush", "Strawberry Watermelon",
    "Strawberry Watermelon Hubba", "Strawnana Ice Cream", "Tobacco",
    "Triple Berry Punch", "Tropical Hubba", "Vanilla Cupcake",
    "Vanilla Ice Cream", "Watermelon Bubble Gum", "Watermelon Cotton Candy",
    "Watermelon Ice", "White Gummy", "Wild Berry Savers",
  ],
  "Foger Bit 35K": [
    "Banana Taffy Freeze", "Black Blueberry Freezer Jam", "Blue Razz Ice",
    "Cool Mint", "Fcuking Fab", "Frozen Cherry", "Frozen Kiwi", "Frozen Peach",
    "Frozen Tropical Rainbow", "Frozen Vanilla", "Georgia Peach", "Miami Mint",
    "Orange Cranberry Lime Ice", "Orange Freezer Jam", "Passion Kiwi",
    "Peach Freezer Jam", "Sour Apple Watermelon", "Sour Blackberry Gush",
    "Sour Blueberry Jam", "Sour Kiwi Gush", "Sour Mango Pineapple",
    "Strawberry Freezer Jam", "Summer Mist", "Watermelon Ice", "Wintergreen",
  ],
  "Lost Mary 70K Nera Kits": [
    "Blue Raz Ice/Blackberry Blueberry", "Blue Razz Ice",
    "Golden Berry/Scary Berry", "Miami Mint", "Miami Mint/Winter Mint",
    "Pineapple Passion Orange", "Pink Lemonade", "Pink&Blue/Pink Lemonade",
    "Polar Mint/Cool Mint", "Pomegranate Blast", "Rocket Freeze", "Scary Berry",
    "Sour Apple Ice", "Watermelon Ice", "Watermelon Ice/Watermelon Fcuking Fab",
  ],
  "Lost Mary 70K Nera Pod": [
    "Black Mint", "Blackberry Blueberry", "Blue Carnival", "Blue Razz Ice",
    "Cool Mint", "Dragon Strawnana", "Golden Berry", "Hawaiian Punch",
    "Lemon Pop", "Miami Mint", "Orange Dream", "Pineapple Passion Orange",
    "Pink & Blue", "Pink Lemonade", "Polar Mint", "Pomegranate Blast",
    "Rocket Freeze", "Scary Berry", "Sour Apple Ice", "Watermelon Fcuking Fab",
    "Watermelon Ice", "Winter Mint",
  ],
  "Foger 30.000 Puff Pod": [
    "Berry Bliss", "Blackberry Blueberry", "Blackberry Passion Refresher",
    "Blue Dragon", "Blue Rancher", "Blue Ranger B-Pop", "Blue Razz Ice",
    "Blueberry Cotton Candy", "Blueberry Watermelon", "California Cherry",
    "Cherry Bomb", "Cherry Slush", "Chocolate Cupcake", "Clear",
    "Coconut Cupcake", "Coffee", "Cola SLush", "Cool Mint", "Dragon Melon",
    "Frozen Banana", "Frozen Blackberry", "Frozen Blueberry", "Frozen Lemon",
    "Frozen Orange & Green", "Frozen Pineapple", "Frozen Straw Grapefruit",
    "Frozen Summer Pear", "Frozen Watermelon", "Frozen Wildberry Mix",
    "Grape Slush", "Gum Mint", "Gummy Bear", "Hawaiian Punch", "Ice Mint",
    "Juicy Peach Ice", "Kiwi Dragon Berry", "Lemon Heads", "Lime Berry Orange",
    "Mango Pineapple Refresher", "Meta Moon", "Mexico Mango", "Miami Mint",
    "OMG B-Pop", "Orange Dream Refresher", "Orange Slush",
    "Peach Berries Refresher", "Peach Slush", "Pineapple Coconut",
    "Pink & Blue", "Pink Lemonade", "Purple Passion Punch",
    "Raspberry Watermelon", "Red Mix Refresher", "Red Velvet Cupcake",
    "Skittles Cupcake", "Sour Apple Ice", "Sour Blue Dust", "Sour Cranapple",
    "Sour Fcuking Fab", "Sour Gush", "Sour Punch", "Sour Raspberry Punch",
    "Strawberry B-Pop", "Strawberry Banana", "Strawberry Cotton Candy",
    "Strawberry Cupcake", "Strawberry Ice", "Strawberry Kiwi",
    "Strawberry Mango", "Strawberry Slush", "Strawberry Watermelon",
    "Strawnana Ice Cream", "Tobacco", "Triple Berry Punch", "Vanilla Cupcake",
    "Vanilla Ice Cream", "Watermelon Bubble", "Watermelon Cotton Candy",
    "Watermelon Ice", "White Gummy",
  ],
  "Lost Mary MT35000 Turbo": [
    "B-Gum Cotton Carnival", "Baja Splash", "Berry Burst",
    "Berry Burst Cotton Carnival", "Black Mint", "Black Razz Lemon",
    "Blackberry Blueberry+", "Blue Razz Cotton Carnival", "Blue Razz Ice",
    "Blue Razz Lemonade", "Classic Tobacco", "Clear", "Golden Berry",
    "Half&Half", "Kiwi Passion Fruit", "Miami Mint", "Mint Lemonade",
    "Mountain Berry", "Orange Passion Mango", "Orange Pixy", "Pineapple Lime+",
    "Pink Lemonade+", "Purple Pixy", "Red Pixy", "Rocket Freeze",
    "Scary Berry+", "Strawberry Cotton Carnival", "Strawberry Dragon Lemonade",
    "Strawberry Kiwi+", "Strawberry+", "Strawmelon Peach", "Summer Grape",
    "Sunny Orange", "Tigers Blood+", "Toasted Banana", "Tropical Lemonade",
    "Watermelon Cotton Carnival", "Watermelon+", "White Gummy", "White Pixy",
    "Winter Mint", "Yellow Pixy",
  ],
  "Lost Mary VIZ 55K Nicotine Vape": [
    "Baja Splash", "Blackberry Chill", "Blue Razz Ice", "Cool Mint",
    "Miami Mint",
  ],
  "Float X 10K": [
    "Banana", "Clear Oolong", "Clear", "Lemon Pineapple",
  ],
  "Flum UT Bar 50K": [
    "Aloe Grape", "Aloe Grape Aloe Watermelon", "Aloe Watermelon Sour Sweet",
    "Banana Smoothie Strawberry", "Blue Rancher Lemonade", "Blue Razz Lemonade",
    "BlueRazz Ice", "Bluerazz Ice Triple Berry", "Cherry Strawberry Gummy",
    "Clear", "Cola Ice", "Cola Ice Cherry", "Cool Mint", "Cool Mint Icy Mint",
    "Crush Mango Strawberry", "Fresh Menthol", "Gold", "Green Apple Fuji",
    "Green Apple Ice", "Green Crisp Watermelon Icy",
    "Heartbeat Watermelon B-Pop", "Icy Mint", "Lemon Drop", "Lemonade Slush",
    "Mango Peach", "Mango Strawberry", "Mango Tango", "Match Slushy",
    "Mexican Mango", "Miami Mint-Mint Slushy", "Naked Spring Water",
    "Passion Fruit Mango", "Passion Kiwi Pineapple", "Peach Ice",
    "Peach Mango Watermelon", "Pineapple Coconut Slushy",
    "Pink Lemonade Mixberry", "Raspberry Grape Guava", "Root Soda Vanilla",
    "Sapphire", "Slushy Lemon", "Sour Apple", "Sour Fab Citrus Ice",
    "Strawberry Guava", "Strawberry Swirl", "Strawberry Watermelon",
    "Strawberry Watermelon Icy", "Strawnana Gelato", "Thai Mango Juice Peach",
    "Tobacco", "Watermelon Ice", "Watermelon Icy Slushy",
    "Watermelon Sour Peach", "Watermelon B Pop", "White Gummy Cherry",
    "White Peach Lemon Head", "White Peach Raspberry", "Wild Berry Drop",
  ],
  "Raz RL Classic 35k": [
    "Banana Ice", "Bitch Please", "Blue Raz Bliss", "Blue Raz Ice",
    "Dragonfruit Lemonade", "Grape Tease", "Icy Mint", "Miami Mint",
    "Night Crawler", "Orange Mango", "Peach Baddie", "Peach Passionfruit",
    "Pink &Blue", "Pretty In Pink", "Rainbow", "Raspberry Watermelon",
    "Sour Apple", "Sour Apple Ice", "Sour Strawberry", "Triple Berry",
    "Watermelon Ice", "White Yummy Ice", "Wild Berry Dew",
  ],
  "Airis Neo 40K": [
    "Banana Coconut", "Black Cherry", "Blue Razz Ice", "Blueberry Watermelon",
    "Grape Lemon", "Kiwi Dragon Berry", "Miami Mint", "Orange Creamsicle",
    "Sour Apple", "Strawberry Banana", "Strawberry Sour Candy", "Super Mint",
    "Watermelon Ice",
  ],
  "Adjust MyFlavor 40k": [
    "Black Razz Baja", "Blue Razz Ice", "Mixed Mint", "Pineapple Ice Peach",
    "Raspberry Watermelon", "Sour Grapple", "Strawberry Mint Candy",
    "Tangerine White Gummy", "Triple Berry Grape", "Watermelon Mango Peach",
    "Wintergreen Savers",
  ],
  "Pixi 50K": [
    "Arctic Freeze", "Black Currant Grape", "Blood Orange Ice", "Blue Razz Ice",
    "Blueberry Peach Ice", "Cane Tobacco", "Cool Mint", "Double Apple Ice",
    "Naked", "Sour Double Apple Ice", "Sour Pineapple Strawberry",
    "Sour Watermelon Ice", "Strawberry Dew Ice", "Vanilla Bean Coffee",
    "White Gummy",
  ],
  "Raz Rx 50K Dew Edition": [
    "Code Blue", "Code Green", "Code Red", "Code White", "Code Pink",
  ],
  "Hyppe Infiniti 50k": [
    "Blue Razz Freeze", "Blue Razz Lemonade", "Chewy Banana Freeze",
    "Chewy Watermelon", "Cool Mint", "Dubai Chocolate", "Fizzy Cola",
    "Grape Aloe Freeze", "Gummy Freezer", "Hawaiian POG", "Icy Mint",
    "Kiwi Melon Blush", "Mighty Mint", "Misu Midnight", "Naked", "Peach Freeze",
    "Pineapple Lychee Freeze", "Rainbow Loops", "Sour Apple Freeze",
    "Sour Mango Pineapple", "Sour Pineapple Coconut", "Sour Straw Kiwi",
    "Sour Straw Mango", "Sour Straw Melon", "Sour Summer Fab",
    "Sour Watermelon Freeze", "Straw Razz Freeze", "Strawberry Glow",
    "Virginia Tobacco", "White Gummy Freeze",
  ],
  "Rodman Playoffs": [
    "Crystal Clear", "Hokkaido Custard", "Root Beer",
  ],
  "Horizon Tech 100K Disposable Vape": [
    "Banana Slush", "Blue Razz Ice", "Blueberry Watermelon", "Cherry Slush",
    "Cola Slush", "Cool Mint", "Grape Slush", "Mango Slush", "Miami Mint",
    "Sour Fcuking Fab", "Starlight Mint", "Strawberry Banana", "Watermelon Ice",
    "Watermelon Slush", "White Peach Raspberry",
  ],
  "Fifty Bar 20.000 Puff": [
    "Apple Cronut", "Baja Burst", "Baja Mango", "Baja Slushie", "Berry Pop",
    "Blueberry Cereal Donut Milk", "Blueberry Pound Cake", "Bonker Berries",
    "Butterbean", "Chocolate Creme", "Cinnamon Funnel Cake", "Cookie Butter",
    "Gold Tobacco", "Green Apple Blast", "Gummy Whip", "Hawaiian Nectar",
    "HoneyBerry Cream", "Lava Blast", "Milky Loops", "Mint", "Omg ! Smoothie",
    "Peach Cobbler", "Pina Lush", "Pineapple Whip", "Pink Sour Straws",
    "Polar Ice", "Rainbow Road", "Raspberry Jam", "Salted Caramel",
    "Southern Tobacco", "Spearmint", "Strawberry Beltz",
    "Strawberry Cereal Donut Milk", "Strawberry Shortcake",
    "Strawberry Watermelon Ice", "Tree Leches", "Vanilla Bean Tobacco",
    "Vanilla Custard", "Watermelon Hubba", "Watermelon Ice",
    "White Cherry Slushie", "White Punch Raspberry", "Yeti Mint",
  ],
  "Fasta Drop 50K Nicotine Vape": [
    "Berry Punch", "Blue Melon", "Cool Mint", "Miami Mint", "Peach Ice",
  ],
  "Flum 3000 Puffs": [
    "Aloe Grape", "Apple Icy", "Blue Raspberry Ice", "Clear", "Cool Mint",
    "Guava Citrus", "Gummy Drop", "Lime Romance", "Peach Ice", "Tobacco",
    "Tropical Delight", "Tropical Punch",
  ],
  "Geek Bar Pulse 15000 Puffs Disposable": [
    "Banana Ice", "Berry Bliss", "Black Cherry", "BlackMintz", "Blow Pop",
    "Blue Mint", "Blue Razz Ice", "Blueberry Ice", "Blueberry Sour Raspberry",
    "Blueberry Watermelon", "California Cherry", "Cherry Bomb", "Clear",
    "Cool Mint", "Crazy Melon", "CreamyMintz", "Dragon Melon",
    "Drop Sour Savers", "Fcuking Fab", "Frozen Blackberry Fab",
    "Frozen Cherry Apple", "Frozen Pina Colada", "Frozen Strawberry",
    "Frozen Watermelon", "Frozen White Grape", "Fuyuan Cranberry Ice",
    "Grape Blow Pop", "Grape Ice", "Grape Lemon", "IceyMintz",
    "Juicy Peach Ice", "Kiwi Passion Fruit", "Mango Peach Watermelon",
    "Meta Moon", "Mexico Mango", "Miami Mint", "Mixed Berry Ice",
    "Omg Blow Pop", "Orange Creamsicle", "Orange Mint Savers", "Peach Ice",
    "Peach Lemonade", "Peppermintz", "Pineapple Savers", "Pink Lemonade",
    "Punch", "Raspberry Watermelon", "Sour Apple Blow Pop", "Sour Apple Ice",
    "Sour Blue Dust", "Sour Cranapple", "Sour Gush", "Sour Strawberry",
    "Sour Watermelon", "Spooky Vanilla", "StoneMintz", "Strawberry Banana",
    "Strawberry Cc", "Strawberry Kiwi", "Strawberry Kiwi Ice",
    "Strawberry Mango", "Strawberry Mango Ice", "Strawberry Savers",
    "Strawberry Watermelon Ice", "Tobacco", "Triple Melon Ice",
    "Tropical Rainbow Blast", "Watermelon Ice", "White Gummy Ice",
    "Wild Berry Savers",
  ],
  "Geek Bar Pulse 2 15K": [
    "Bahama Freeze", "Berry Bliss", "Blue Razz Hubba", "Blue Razz Ice",
    "Blueberry Watermelon", "Dragon Melon", "Fcuking Fab", "Frozen White Grape",
    "Grape Hubba", "Juicy Peach Ice", "La Mint", "Lemon Hubba", "Mexico Mango",
    "Miami Mint", "Peach Lemonade", "Pineapple Savers", "Pink Lemonade",
    "Sour Apple Ice", "Sour Blue Dust", "Sour Fcuking Fab", "Sour Gush",
    "Sour Strawberry", "Stone Freeze", "Strawberry Banana",
    "Strawberry Watermelon Hubba", "Toasted Pina Colada", "Watermelon Ice",
    "White Gummy Ice", "White Peach Hubba",
  ],
  "Geek Bar Pulse X 25K": [
    "Atl Mint", "Banana Taffy Freeze", "Blackberry B-Pop",
    "Blackberry Blueberry", "Blue Rancher", "Blue Razz Ice", "Blueberry Jam",
    "Cola Slush", "Cool Mint", "CreamyMintz", "Dualicious", "Grape Slush",
    "Grapefruit Refresher", "Lemon Heads", "Lime Berry Orange", "Miami Mint",
    "Orange Dragon", "Orange Fcuking Fab", "Orange Jam", "Orange Mint",
    "Orange Slush", "Peach Jam", "Peach Perfect Slush", "Pear Of Thieves",
    "Peppermintz", "Pink & Blue", "Pink Berry Lemonade", "Raspberry Jam",
    "Raspberry Peach Lime", "Sour Apple Ice", "Sour Fcuking Fab",
    "Sour Mango Pineapple", "Sour Straws", "Strawberry B-Pop",
    "Strawberry Colada", "Strawberry Dragon", "Strawberry Jam",
    "Strawberry Kiwi Ice", "Strawberry Watermelon", "Watermelon Ice",
    "White Peach Raspberry", "Wild Cherry Slush",
  ],
  "Geek Bar Mate Kit 60K": [
    "Amazon Lemonade", "Blue Razz Ice", "Blue Straws", "Blueberry Yummy",
    "Cool Mint", "Juicy Peach", "Miami Mint", "Peach Mango Watermelon",
    "Sky Blue Ice", "Strawberry Kiwi", "Strawberry Banana", "Triple Berry",
    "Watermelon Ice", "White Gummy", "White Peach Raspberry",
  ],
  "Geek Bar Clio Platinum Kit": [
    "Blue Razz Ice", "Code Red", "Triple Berry Ice", "Strawberry B-Burst",
    "White Peach Raspberry",
  ],
  "Geek Bar Clio Pod": [
    "Blue Razz Ice", "Cool Mint", "Code Red", "Fcuking Fab", "Peach Slush",
  ],
  "Geek Bar CLR 50K Disposable": [
    "Amazon Lemonade", "Banana Ice", "Blue Rancher", "Blue Razz Ice", "Coffee",
    "Cool Mint", "Miami Mint", "Peach Berry", "Peach Slush",
    "Strawberry Lemonade", "Triple Berry Ice", "Watermellon Twist",
    "Watermelon Ice",
  ],
  "Geek Bar Burj 80K Hookah Vape": [
    "Blueberry Gum", "Blue Razz", "Double Apple", "Grape Mint", "Gum Mint",
    "Lemon Mint", "Mango", "Peach Ice", "Strawberry", "Watermelon Mint",
  ],
  "DKHAAN hookah 25.000 Puffs": [
    "Passion Fruit Guava", "Caramel Macchiato", "Blueberry Gummy Bear",
    "Mixed Berries", "Pure Mint", "Clear", "Cool Mint", "Watermelon Ice",
    "Baghdad Nights",
  ],
  "Olit Pro 60k Hookahlit": [
    "Fcuking Fab", "Two Apple", "Blackcurrant Ice",
    "Watermelon Strawberry Melon", "BlueRazz Lemonade", "Love 66",
    "Mango Freeze", "Peach Ice", "Strawberry Kiwi", "First Love",
    "Watermelon Kiwi", "Watermelon Straw Melon", "Strawberry Ice", "Berry Ice",
    "Blueberry Mint", "Cool Mint",
  ],
  "Al Fakher Crown 60K": [
    "Blue Razz Blast", "Blueberry Gum", "Blueberry Lemonade",
    "Blueberry Raspberry", "Cherry Fizz", "Cool Mango", "Fusion Pop",
    "Gum Mint", "Lemon Mint", "Lush Ice", "Magic Love", "Mango Pineapple",
    "Mint", "Peach Ice", "Pineapple Ice", "Strawberry Punch", "Summer Dream",
    "Two Apple", "Watermelon Cherry", "Watermelon Kiwi", "Watermelon Lime",
    "Watermelon Pineapple",
  ],
  "ZYN 3 Nicotine Pouches": [
    "Apple Mint", "Chill", "Citrus", "Coffee", "Cool Mint", "Espresso Martini",
    "Menthol", "Dragonberry", "Peppermint", "Smooth", "Spearmint",
    "Spiced Cider", "Wintergreen",
  ],
  "ZYN 6 Nicotine Pouches": [
    "Black Cherry", "Chill", "Cinnamon", "Citrus", "Coffee", "Cool Mint",
    "Espresso Martini", "Menthol", "Dragonberry", "Peppermint", "Smooth",
    "Spearmint", "Spiced Cider", "Wintergreen",
  ],
  "Zyn Ultra 9 Mg Nicotine Pouches": [
    "Peppermint Frost", "Signature Smooth", "Citrus Zest", "Arctic Mint",
    "Chill Mist", "Wintergreen",
  ],
  "On Nicotine Pouches 2 Mg": [
    "Mint", "Wintergreen", "Coffee", "Citrus", "Cinnamon", "Original",
  ],
  "On Nicotine Pouches 4Mg": [
    "Mint", "Wintergreen", "Citrus", "Cinnamon", "Coffee", "Original",
  ],
  "On Nicotine Pouches 8Mg": [
    "Citrus", "Wintergreen", "Original", "Mint", "Coffee", "Cinnamon",
  ],
  "On Plus Nicotine Pouches": [
    "Mint", "Tobacco", "Wintergreen",
  ],
  "Velo 3mg": [
    "Cappuccino", "Peppermint", "Spearmint", "Wild Berry", "Wintergreen",
  ],
  "Velo 6mg": [
    "Cappuccino", "Citrus Chill", "Dragon Fruit", "Mint", "Wild Berry",
    "Peppermint", "Spearmint", "Tropical Heat", "Wintergreen",
  ],
  "Velo 9mg": [
    "Citrus Chill", "Mint", "Peppermint", "Spearmint", "Wild Berry",
    "Wintergreen", "Smooth", "SpicedCider",
  ],
  "ZONE Nicotine Pouches 6Mg": [
    "Mint", "Spearmint", "Wintergreen", "Dragonfruit", "Peppermint", "Citrus",
    "White",
  ],
  "Zone Nicotine Pouches 9Mg": [
    "Mint", "Wintergreen", "Dragonfruit", "Spearmint", "Peppermint", "Tobacco",
    "Citrus",
  ],
  "Alp 3Mg Nicotine Pouches": [
    "Chilled Mint", "Classic", "Mountain Wintergreen", "Refreshing Chill",
    "Spearmint", "Sweet Nectar", "Tropical Fruit",
  ],
  "Alp 6Mg Nicotine Pouches": [
    "Chilled Mint", "Classic", "Mountain Wintergreen", "Refreshing Chill",
    "Spearmint", "Sweet Nectar", "Tropical Fruit",
  ],
  "Alp 9Mg Nicotine Pouches": [
    "Chilled Mint", "Classic", "Mountain Wintergreen", "Refreshing Chill",
    "Spearmint", "Sweet Nectar", "Tropical Fruit",
  ],
  "Lucy 4 Mg Nicotine Pouches": [
    "Apple Ice", "Espresso", "Cinnamon", "Mango", "Tobacco", "Wintergreen",
    "Mint",
  ],
  "Lucy 8 Mg Nicotine Pouches": [
    "Apple Ice", "Espresso", "Cinnamon", "Mango", "Tobacco", "Wintergreen",
    "Mint",
  ],
  "Lucy 12 Mg Nicotine Pouches": [
    "Apple Ice", "Espresso", "Cinnamon", "Mango", "Tobacco", "Wintergreen",
    "Mint",
  ],
  "Lucy Breakers 4 Mg Nicotine Pouches": [
    "Apple Ice", "Mango", "Espresso", "Apple Cider",
  ],
  "Lucy Breakers 8 Mg Nicotine Pouches": [
    "Apple Ice", "Mango", "Espresso", "Apple Cider",
  ],
  "Rogue 3Mg Nicotine Pouches": [
    "Apple", "Berry", "Cinnamon", "Citrus", "Honey Lemon", "Mango", "Original",
    "Peppermint", "Spearmint", "Tobacco", "Wintergreen",
  ],
  "Rogue 6 Mg Nicotine Pouches": [
    "Apple", "Berry", "Cinnamon", "Citrus", "Frost", "Honey Lemon", "Mango",
    "Original", "Peppermint", "Spearmint", "Tobacco", "Wintergreen",
  ],
  "Rogue 12Mg Nicotine Pouches": [
    "Spearmint", "Citrus", "Blue Raspberry", "Wintergreen",
  ],
  "Rogue 15Mg Nicotine Pouches": [
    "Spearmint", "Citrus", "Blue Raspberry", "Wintergreen",
  ],
  "Fre 6mg Nicotine Pouches": [
    "Mint",
  ],
  "Fre 9 Mg Nicotine  Pouches": [
    "Lush", "Mint", "Wintergreen", "Sweet",
  ],
  "Fre 12 Mg Nicotine Pouches": [
    "Mint", "Lush", "Wintergreen", "Sweet",
  ],
  "Fre 15 Mg Nicotine Pouches": [
    "Mint", "Lush", "Wintergreen", "Sweet", "Watermelon",
  ],
  "Marlboro": [
    "Blend 27 100 \"", "Gold 100\"", "Menthol 100\"", "Menthol Silver 100\"",
    "Menthol Gold 100\"", "Red 100\"", "SIlver 100\"", "Smooth 100 \"",
    "Black Menthol 72s", "Gold 72s", "Menthol 72s", "Red 72s", "Silver 72 S",
    "Black 100\"", "Black", "Black Menthol", "Gold", "Menthol", "Menthol Gold",
    "Menthol Silver", "Nxt", "Red", "Silver", "Smooth", "Special Select",
    "Midnight", "Special Select 100", "27", "Ice", "Black Gold",
    "Black Gold 100’s", "Black Menthol 100'", "Bold Ice", "Red Label 100",
    "Red Label", "Special Select Gold", "Special Select Gold 100 S",
  ],
  "Kool": [
    "Blue", "Green", "Blue 100 \"", "Green 100\"",
  ],
  "Camel": [
    "Crush Menthol", "Crush Silver Menthol", "Crush Smooth",
    "Crush Smooth Silver", "Crush", "Turkish Royal", "Red", "Blue", "Gold",
    "Red 100 \"", "Blue 100", "Silver", "Jade Silver Menthol", "Gold 100",
  ],
  "Parliament": [
    "Regular", "Light", "Light 100 '",
  ],
  "Newport": [
    "Menthol", "Menthol 100'", "Menthol Gold", "Menthol Gold 100'", "Red",
    "Red 100 '",
  ],
  "American Spirit": [
    "Light Blue", "Gold", "Sky", "Orange", "Purple", "Turquoise", "Green",
    "Black", "Celadon", "Yellow", "Dark Green", "Dark Blue",
  ],
  "Pyramid": [
    "Red", "Menthol", "Blue", "Menthol Short",
  ],
  "Pall Mall": [
    "Red", "Blue", "Red 100 '", "Blue 100'", "Orange", "Orange 100'",
    "Green 100'", "Green",
  ],
  "Benson & Hedges": [
    "Premium", "Menthol Premium", "Luxury", "Menthol Luxury", "De Luxe",
    "De Luxe Menthol",
  ],
  "Capri": [
    "Magenta", "Indigo", "Violet", "Jade", "Indigo120 S",
  ],
  "LM": [
    "Red", "Red 100'", "Blue", "Blue 100", "Green", "Green 100'",
  ],
  "Dunhill": [
    "Blue", "Red", "Fine Cut",
  ],
  "Lucky Strike": [
    "Gold", "Red", "Gold 100s", "Red 100s",
  ],
  "Winston": [
    "Red", "Gold", "White", "White '100s",
  ],
  "Virginia Slims": [
    "Menthol", "Gold 120\"", "Red", "Super Red", "Super Menthol", "Green 120\"",
    "Menthol Silver", "Silver", "Gold", "Menthol Gold", "Menthol Silver 120s",
  ],
  "Montego": [
    "Red 100", "Blue 100s", "Menthol Gold 100s", "Menthol Silver 100s", "Red",
    "Blue", "Menthol Gold",
  ],
  "Salem": [
    "Menthol Short", "Salem 100", "Gold Menthol Short", "Slim 100'",
    "Silver Menthol 100'", "Gold Menthol 100s",
  ],
  "Talon": [
    "Vanilla", "Sweet",
  ],
  "Eve": [
    "Amethyst", "Emerald", "Sapphire",
  ],
  "Backwoods True Wraps": [
    "Aromatic", "Original", "Vanilla",
  ],
  "Backwoods 5pk": [
    "Banana", "Sweet Aromatic", "Honey Bourbon", "Original", "Black Russian",
    "Chocolate", "Dark Berry", "Dark Leaf", "Dark Scout", "Honey Berry",
    "Smooth", "Smoked Caramel", "Tical", "Wild Rum", "Philly", "Nola", "Honey",
    "Vanilla", "Rum Cake", "Marathon", "Bet", "Russian Cream",
  ],
  "Swisher Sweets Leaf Wraps": [
    "Irish Cream", "Peach Brandy", "Original", "Russian Cream",
  ],
  "Zig-Zag Wraps": [
    "Mango", "Dragonberry", "Melon", "Peach", "Strawberry", "Straight Up",
  ],
  "Al Capone Leaf": [
    "Cognac", "Original", "Rum",
  ],
  "Loose Leaf": [
    "Grape Dream", "Banana Dream", "Ice Gold", "Strawberry Dream",
    "Honey Bourbon", "Red Rum", "Sweet Aromatic", "Watermelon Dream",
  ],
  "Loud Leaf 2 Pack": [
    "Russian Cream", "Original", "Honey Bourbon",
  ],
  "Swisher 5 Pack": [
    "Original", "Diamond", "Cherry",
  ],
  "Zigzag Leaf": [
    "Berry Bash", "Palma",
  ],
  "Swisher Sweets Leaf": [
    "Aromatic", "Cognac", "Dark Stout", "Honey", "Irish Cream", "Original",
    "Neon Lights", "Peach Brandy",
  ],
  "Zaza Large Leaf Cigar Wraps": [
    "Dark Natural", "Natural",
  ],
  "Zaza Small Leaf Cigar Wraps": [
    "Dark Natural", "Natural",
  ],
  "Grab a Crush": [
    "Black", "Russian Cream", "Dark", "Hot",
  ],
  "White Owl": [
    "White Russian", "Chocolate", "Emerald", "Blue Raspberry", "Blackout Berry",
  ],
  "BLK Swisher Sweets": [
    "Grape", "Berry", "Cream", "Cherry", "Smooth", "Wine",
  ],
  "Dutch": [
    "Gold Fusion", "Tropical", "Diamond Fusion", "Green Envy", "Sweet Fusion",
    "Og Fusion", "Royal Haze", "Platinum Fusion", "Irish Cream", "Java Fusion",
    "Blue Dream Fusion", "Berry Fusion",
  ],
  "Swisher Sweets": [
    "Diamonds", "Blueberry", "Tropical Fusion", "Cookies N Cream", "Cream",
    "Grape", "Green", "Peach", "Strawberry", "Coco Pineapple", "Vanilla",
    "Original",
  ],
  "Zig-Zag Cones": [
    "Dragonberry", "Blueberry", "Grape", "Straight Up",
  ],
  "Black & Mild 5 Pack": [
    "Apple Plastic Tip", "Cream Plastic Tip", "Jazz Plastic Tip",
    "Jazz Wood Tip", "Wine Plastic Tip", "Wine Wood Tip",
    "Original Plastic Tip", "Original Wood Tip", "Original Filter Tip",
    "Sweets Filter Tip",
  ],
  "Black  & Mild Single": [
    "Casino Plastic Tip", "Casino Wood Tip", "Jazz Plastic Tip",
    "Jazz Wood Tip", "Wine Plastic Tip", "Wine Wood Tip", "Sweets Plastic Tip",
    "Sweets Wood Tip", "Original Plastic Tip", "Original Wood Tip",
  ],
};
