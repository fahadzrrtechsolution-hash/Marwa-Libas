const DEFAULT_PRODUCTS = [
    {
        id: "maheen-embroidered-3pc",
        title: "Maheen Embroidered - 3pc",
        price: 6250,
        originalPrice: 6250,
        image: "assets/maheen.jpg",
        localImage: "assets/maheen.jpg",
        badge: "New",
        collection: "new-arrivals",
        description: "This exquisite Women's Eastern Ready to wear Kurta Set features a peach pink color with embroidered details. The three-piece ensemble includes a straight kurta, straight trouser, and matching dupatta in lawn cotton fabrics. Perfect for daily wear in the summer, it exudes elegance and style. From Silai Karhai.",
        specs: {
            "Fabric": "Cotton Lawn",
            "Work Technique": "Embroidered",
            "No. of Pieces": "3-piece",
            "Season": "Summer Wear",
            "Color": "Peach",
            "Top Style": "Kurta",
            "Bottom Style": "Straight Trouser"
        }
    },
    {
        id: "maya-2pc",
        title: "Maya - 2pc",
        price: 4349,
        originalPrice: 7999,
        image: "assets/maya-2pc.png",
        localImage: "assets/maya_dress.png",
        badge: "Sale",
        collection: "new-arrivals",
        description: "A gorgeous sky blue ensemble with delicate and intricate needlework on premium quality lawn fabric. Paired with comfortable cotton trousers, perfect for summer gatherings.",
        specs: {
            "Fabric": "Lawn & Cotton",
            "Work Technique": "Embroidered Neckline & Sleeves",
            "No. of Pieces": "2 Piece (Shirt + Trousers)",
            "Season": "Summer Collection 2026",
            "Color": "Sky Blue",
            "Top Style": "Straight Shirt",
            "Bottom Style": "Straight Pants"
        }
    },
    {
        id: "pari-zad-3pc",
        title: "Pari Zad - 3pc",
        price: 6050,
        originalPrice: 10990,
        image: "assets/pari-zad-3pc.png",
        localImage: "assets/parizad_dress.png",
        badge: "Sale",
        collection: "best-sellers",
        description: "Step into pure elegance with this rich dark purple 3-piece luxury embroidered lawn suit. Handcrafted with gold accents and featuring a premium printed silk dupatta.",
        specs: {
            "Fabric": "Luxury Lawn & Silk Dupatta",
            "Work Technique": "Gold Thread & Tilla Embroidery",
            "No. of Pieces": "3 Piece (Shirt + Dupatta + Pants)",
            "Season": "Eid ul-Adha SS’26",
            "Color": "Deep Purple",
            "Top Style": "A-Line Long Shirt",
            "Bottom Style": "Trousers"
        }
    },
    {
        id: "sky-fall-2pc",
        title: "Sky Fall - 2pc",
        price: 4399,
        originalPrice: 7490,
        image: "assets/sky-fall-2pc.png",
        localImage: "assets/skyfall_dress.png",
        badge: "Sale",
        collection: "summer",
        description: "Embrace the pastel charm of summer with Sky Fall. A stunning peach colored printed lawn dress featuring digital floral patterns and modern lace styling details.",
        specs: {
            "Fabric": "Digital Printed Lawn",
            "Work Technique": "Printed with Lace borders",
            "No. of Pieces": "2 Piece (Shirt + Trousers)",
            "Season": "Summer Collection 2026",
            "Color": "Pastel Peach",
            "Top Style": "Short Kurti Style",
            "Bottom Style": "Shalwar"
        }
    },
    {
        id: "eliza-2pc",
        title: "Eliza - 2pc",
        price: 2190,
        originalPrice: 4299,
        image: "assets/eliza-2pc.png",
        localImage: "assets/eliza_dress.png",
        badge: "Under 2290",
        collection: "under-2290",
        description: "An affordable yet highly fashionable mint green 2-piece set with white lace borders. Made of light, breathable lawn fabric, perfect for everyday casual wear.",
        specs: {
            "Fabric": "Breathable Lawn",
            "Work Technique": "Lace Embroidery Details",
            "No. of Pieces": "2 Piece (Shirt + Trouser)",
            "Season": "Summer Essentials",
            "Color": "Mint Green",
            "Top Style": "Straight Shirt",
            "Bottom Style": "Cigarette Pants"
        }
    },
    {
        id: "luxury-lawn-ss26",
        title: "Amber Luxury - 3pc",
        price: 7490,
        originalPrice: 12999,
        image: "assets/luxury-lawn-ss26.png",
        localImage: "assets/parizad_dress.png",
        badge: "Luxury",
        collection: "luxury-lawn",
        description: "Crafted for celebration, this dress offers high-grade luxury embroidery with gold threadwork on pure cotton lawn, completed with a premium organza dupatta.",
        specs: {
            "Fabric": "Premium Lawn & Organza Dupatta",
            "Work Technique": "Zari & Sequins Embroidery",
            "No. of Pieces": "3 Piece",
            "Season": "Luxury Lawn SS'26",
            "Color": "Olive Green",
            "Top Style": "Flared Kurta",
            "Bottom Style": "Palazzo Pants"
        }
    },
    {
        id: "eid-lawn-parnia",
        title: "Parnia Eid Special - 3pc",
        price: 6250,
        originalPrice: 9999,
        image: "assets/eid-lawn-parnia.png",
        localImage: "assets/maya_dress.png",
        badge: "Eid SS'26",
        collection: "eid-ul-adha",
        description: "Make this Eid memorable in this beautifully embroidered sky blue outfit. Adorned with delicate pearls and paired with floral printed organza dupatta.",
        specs: {
            "Fabric": "Lawn & Organza",
            "Work Technique": "Pearl work & Lace embroidery",
            "No. of Pieces": "3 Piece",
            "Season": "Eid ul-Adha SS’26",
            "Color": "Baby Blue",
            "Top Style": "Long Straight Cut",
            "Bottom Style": "Trouser with lace details"
        }
    }
];

let PRODUCTS = [];
const savedProducts = localStorage.getItem('marwa_products');
if (savedProducts) {
    PRODUCTS = JSON.parse(savedProducts);
} else {
    PRODUCTS = DEFAULT_PRODUCTS;
    localStorage.setItem('marwa_products', JSON.stringify(PRODUCTS));
}
