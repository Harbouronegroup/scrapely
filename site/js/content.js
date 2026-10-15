/* ================================================================
   SMOKE & TACO: EDITABLE CONTENT
   Change the values below to update the website. No other file
   needs touching for ordinary updates. Keep the quote marks and
   commas exactly as they are.
   ================================================================ */
window.SITE = {
  email: "Smokeandtaco@outlook.com",
  phone: "",                                   // leave empty to hide
  area: "Hampshire, Dorset and Wiltshire",
  instagram: "https://www.instagram.com/smokeandtaco/",
  facebook: "https://www.facebook.com/share/18E6oognnj/?mibextid=wwXIfr",

  // Dishes listed on the Our Food page
  dishes: ["Birria tacos","Slow smoked New Forest brisket","Pulled pork carnitas","Tiger prawn al pastor","Seared sea bass","Loaded birria nachos","Breakfast tacos at selected shows"],

  // Photos: [file name in assets/photos without .jpg, description for screen readers]
  photos: [
    ["chicken","Crispy chicken tacos with slaw and pickled red onion"],
    ["birria","Taco with melted cheese and pickled red onion beside a pot of dipping broth"],
    ["prawn","Prawn taco on a blue corn tortilla with lime"],
    ["nachos","Loaded nachos with pulled meat, pickled onion and spring onion"],
    ["pineapple","Two tacos topped with grilled pineapple and pickled red onion"],
    ["cheese","Taco with grilled cheese, pickled red onion and a wedge of lime"],
    ["festival","Loaded nachos held up in front of a busy festival crowd"],
    ["counter","Plates of tacos and loaded nachos lined up on a counter"]
  ],

  // Upcoming events. date is YYYY-MM-DD. status: "published", "cancelled" or "draft".
  // An event with no date never shows as upcoming. Past dates drop off on their own.
  events: [
    { venue:"Dark Revolution", town:"Salisbury", date:"", day:"Thursday 16th", time:"From 5PM", status:"draft", featured:true },
    { venue:"The White Hart", town:"Over Wallop", date:"", day:"Friday 17th", time:"5PM to 8PM", status:"draft", featured:true },
    { venue:"The Red Lion", town:"Milford On Sea", date:"", day:"Saturday 18th and Sunday 19th", time:"From 12PM", status:"draft", featured:true }
  ],

  reviews: "",

  // Recent stops: [month, name, one line]
  past: [
    ["Jul","New Forest & Hampshire County Show","Three days at the Local Produce Market, with breakfast tacos in the morning and the full menu all day."],
    ["Jul","Lymington Seafood Festival","One of our favourite events of the year. The seared sea bass went down a treat."],
    ["Jun","The Red Lion, Milford on Sea","Serving through the Milford music festival weekend."],
    ["Jun","Highcliffe Food and Arts Festival","On the high street all weekend."],
    ["","Dogstival","Our first ever festival, in the New Forest."]
  ],

  // Event partners: [name, logo file in assets/partners, tile colour]
  partners: [
    ["Dark Revolution","darkrev.jpg","#000"],["Pig Beer","pigbeer.jpg","#000"],["Seafire Taproom","seafire.jpg","#3B5A6E"],
    ["Conker Distillery","conker.png","#22274F"],["The Solent Cellar","solent.png","#5E1707"],["The Swan, Enford","swan.png","#fff"],
    ["The Farmers Butcher & Farm Shop","farmers.png","#fff"],["New Forest & Hampshire County Show","newforest.jpg","#22274F"],
    ["Highcliffe Food & Arts Festival","highcliffe.jpg","#fff"],["Christchurch Food Fest","christchurch.jpg","#fff"],
    ["Dogstival","dogstival.jpg","#F4E6D4"],["Picnic in the Park, Lymington","picnic.jpg","#4FAE76"]
  ],

  // Facebook reels: poster is a photo name from the photos list
  reels: [
    { url:"https://www.facebook.com/reel/653627457750040", title:"Loaded birria nachos", text:"A hit at the New Forest Show.", poster:"nachos" },
    { url:"https://www.facebook.com/reel/683638967796468", title:"Cheese overload", text:"Taco 'bout a cheese pull.", poster:"cheese" },
    { url:"https://www.facebook.com/reel/1395404858369340", title:"Our first festival", text:"A great weekend at Dogstival.", poster:"festival" },
    { url:"https://www.facebook.com/reel/26085142111095151", title:"More from the hatch", text:"Another reel from our Facebook page.", poster:"pineapple" }
  ]
};
