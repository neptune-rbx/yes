export type Ride = {
  id: string;
  name: string;
  type: string;
  speed: string;
  height: string;
  length: string;
  year: number;
  rating: number;
  img: string;
  alt: string;
};

export const PARKS: Record<string, Ride[]> = {
  "dorney park": [
    {
      id: "dp_talon",
      name: "Talon: The Grip of Fear",
      type: "Inverted Coaster",
      speed: "58 mph",
      height: "135 ft",
      length: "3,110 ft",
      year: 2001,
      rating: 8.7,
      img: "https://cdn.sanity.io/images/bsnrdz4t/production/728b88ec36da4cba3a6f1252f7248c2c928a1392-1440x690.jpg",
      alt: "Talon inverted coaster at Dorney Park"
    },
    {
      id: "dp_steelforce",
      name: "Steel Force",
      type: "Hyper Coaster",
      speed: "75 mph",
      height: "200 ft",
      length: "5,600 ft",
      year: 1997,
      rating: 8.3,
      img: "https://cdn.sanity.io/images/bsnrdz4t/production/6d47f3727ca35c5be87a8118a344d6c78a252d1c-1440x690.jpg",
      alt: "Steel Force hyper coaster at Dorney Park"
    },
    {
      id: "dp_hydra",
      name: "Hydra the Revenge",
      type: "Floorless Coaster",
      speed: "50 mph",
      height: "95 ft",
      length: "2,800 ft",
      year: 2005,
      rating: 7.8,
      img: "https://cdn.sanity.io/images/bsnrdz4t/production/f2ea51e0c918a80f29e7e12082bce1bc662e89c4-6000x4000.jpg",
      alt: "Hydra the Revenge floorless coaster at Dorney Park"
    },
    {
      id: "dp_possessed",
      name: "Possessed",
      type: "Inverted Impulse",
      speed: "70 mph",
      height: "132 ft",
      length: "685 ft",
      year: 2008,
      rating: 8.0,
      img: "https://i.ytimg.com/vi/4O2O5NQt_G8/maxresdefault.jpg",
      alt: "Possessed inverted impulse coaster at Dorney Park"
    },
    {
      id: "dp_ironmenace",
      name: "Iron Menace",
      type: "Dive Coaster",
      speed: "71 mph",
      height: "175 ft",
      length: "2,550 ft",
      year: 2024,
      rating: 9.0,
      img: "https://whyy.org/wp-content/uploads/2024/04/2024-04-17-e-lee-dorneyvill-pa-dorney-park-iron-menace-roller-coaster.jpeg",
      alt: "Iron Menace dive coaster at Dorney Park"
    }
  ],
  "six flags": [
    {
      id: "sf_jerseydevil",
      name: "Jersey Devil Coaster",
      type: "Single-Rail Coaster",
      speed: "58 mph",
      height: "130 ft",
      length: "3,000 ft",
      year: 2021,
      rating: 8.9,
      img: "https://cdn.sanity.io/images/bsnrdz4t/production/3ddf96009b4c91a313810eca3984950f7838b17c-1440x800.png",
      alt: "Jersey Devil Coaster at Six Flags Great Adventure"
    },
    {
      id: "sf_elticoindio",
      name: "El Toro",
      type: "Wood Coaster",
      speed: "70 mph",
      height: "181 ft",
      length: "4,400 ft",
      year: 2006,
      rating: 9.4,
      img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQkqZ8S4Bh5f1VvkKuZ6SCKyY_3_MeUvxtRFQ&s",
      alt: "El Toro wooden coaster at Six Flags Great Adventure"
    },
    {
      id: "sf_nitro",
      name: "Nitro",
      type: "Hyper Coaster",
      speed: "80 mph",
      height: "230 ft",
      length: "5,394 ft",
      year: 2001,
      rating: 8.8,
      img: "https://upload.wikimedia.org/wikipedia/commons/f/fe/Nitro_coaster.jpg",
      alt: "Nitro hyper coaster at Six Flags Great Adventure"
    },
    {
      id: "sf_batman",
      name: "Batman The Ride",
      type: "Inverted Coaster",
      speed: "50 mph",
      height: "105 ft",
      length: "2,693 ft",
      year: 1993,
      rating: 8.1,
      img: "https://images.coasterpedia.net/thumb/c/c9/Batman_The_Ride_%28Six_Flags_Great_America%29_first_drop_and_loop.jpg/1200px-Batman_The_Ride_%28Six_Flags_Great_America%29_first_drop_and_loop.jpg.webp",
      alt: "Batman The Ride at Six Flags Great Adventure"
    },
    {
      id: "sf_medusa",
      name: "Medusa",
      type: "Floorless Coaster",
      speed: "61 mph",
      height: "142 ft",
      length: "3,985 ft",
      year: 1999,
      rating: 8.3,
      img: "https://cloudfront-us-east-1.images.arcpublishing.com/advancelocal/OLZA6UAO35HXDNIEE5CL62U7SE.jpg",
      alt: "Medusa floorless coaster at Six Flags Great Adventure"
    },
    {
      id: "sf_superman",
      name: "Superman Ultimate Flight",
      type: "Flying Coaster",
      speed: "60 mph",
      height: "106 ft",
      length: "2,759 ft",
      year: 2003,
      rating: 7.9,
      img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ2Ejlm9C8Ri6NhPfsG372h8DaEUgJUVStrXg&s",
      alt: "Superman Ultimate Flight at Six Flags Great Adventure"
    },
    {
      id: "sf_grenadeekingofcoasters",
      name: "The Joker",
      type: "Free Fly Coaster",
      speed: "52 mph",
      height: "120 ft",
      length: "1,300 ft",
      year: 2016,
      rating: 8.5,
      img: "https://cdn.sanity.io/images/bsnrdz4t/production/010bbe8225466272ca74b4c07623847471f20320-7952x5304.jpg",
      alt: "The Joker free fly coaster at Six Flags Great Adventure"
    }
  ],
  "wildwood": [
    {
      id: "ww_seaserpent",
      name: "Sea Serpent",
      type: "Boomerang Coaster",
      speed: "50 mph",
      height: "100 ft",
      length: "875 ft",
      year: 1984,
      rating: 7.5,
      img: "https://static.skitude.com/resorts/5fd716f9107f313d407255ed4667aa8d3c94f2a3042c62e7f71370a998d8d8e6/touristic-objects/c5a5cdac-ac62-45a8-866b-909c20625094.jpg",
      alt: "Sea Serpent boomerang coaster at Wildwood"
    },
    {
      id: "ww_greatnoreaster",
      name: "Great Nor'Easter",
      type: "Suspended Looping",
      speed: "55 mph",
      height: "115 ft",
      length: "2,170 ft",
      year: 1995,
      rating: 8.2,
      img: "https://cdn4.picryl.com/photo/2017/01/01/moreys-piers-great-nor-easter-roller-coaster-now-known-as-flywildwood-new-jersey-88e7e6-1024.jpg",
      alt: "Great Nor'Easter suspended looping coaster at Wildwood"
    },
    {
      id: "ww_greatwhite",
      name: "Great White",
      type: "Wood Coaster",
      speed: "50 mph",
      height: "100 ft",
      length: "3,100 ft",
      year: 1996,
      rating: 8.0,
      img: "https://static.skitude.com/resorts/5fd716f9107f313d407255ed4667aa8d3c94f2a3042c62e7f71370a998d8d8e6/touristic-objects/ef29c7e7-d342-46ac-b49e-029b541874f8.jpg",
      alt: "Great White wooden coaster at Wildwood"
    }
  ],
  "cedar point": [
    {
      id: "cp_steel_vengeance",
      name: "Steel Vengeance",
      type: "Hybrid Coaster",
      speed: "74 mph",
      height: "205 ft",
      length: "5,740 ft",
      year: 2018,
      rating: 9.8,
      img: "https://www.freep.com/gcdn/-mm-/c866a26832d9a00c13d83ca470f7860c9325bbed/c=0-18-2099-1204/local/-/media/2017/08/16/DetroitFreeP/DetroitFreePress/636384989754521386-SteelVengence-07.JPG?width=1733&height=980&fit=crop&format=pjpg&auto=webp",
      alt: "Steel Vengeance roller coaster"
    },
    {
      id: "cp_millennium_force",
      name: "Millennium Force",
      type: "Giga Coaster",
      speed: "93 mph",
      height: "310 ft",
      length: "6,595 ft",
      year: 2000,
      rating: 9.5,
      img: "https://www.sixflags.com/_next/image?url=https%3A%2F%2Fcdn.sanity.io%2Fimages%2Fbsnrdz4t%2Fproduction%2F9c5549347988051fe7b242e1e259ed06c6290107-1440x690.jpg%3Fw%3D1920%26h%3D1066%26q%3D80%26fit%3Dclip%26auto%3Dformat%26dpr%3D2&w=1920&q=75",
      alt: "Millennium Force roller coaster"
    },
    {
      id: "cp_maverick",
      name: "Maverick",
      type: "Launched Coaster",
      speed: "70 mph",
      height: "105 ft",
      length: "4,450 ft",
      year: 2007,
      rating: 9.3,
      img: "https://cdn.sanity.io/images/bsnrdz4t/production/1f236ecc541e618e02e306aa7a9069a7a31cf23c-2000x1333.webp",
      alt: "Maverick roller coaster"
    },
    {
      id: "cp_top_thrill_2",
      name: "Top Thrill 2",
      type: "Strata Coaster",
      speed: "120 mph",
      height: "420 ft",
      length: "2,800 ft",
      year: 2024,
      rating: 9.1,
      img: "https://ewscripps.brightspotcdn.com/dims4/default/6acc448/2147483647/strip/true/crop/1440x756+0+88/resize/1200x630!/quality/90/?url=http%3A%2F%2Fewscripps-brightspot.s3.amazonaws.com%2F78%2F5d%2F9efbe0f240a68884ed6b26c95f1c%2Fcedar-point-top-thrill-2-5.jpeg",
      alt: "Top Thrill 2 roller coaster"
    },
    {
      id: "cp_raptor",
      name: "Raptor",
      type: "Inverted Coaster",
      speed: "57 mph",
      height: "137 ft",
      length: "3,790 ft",
      year: 1994,
      rating: 8.8,
      img: "https://images.imagerenderer.com/images/artworkimages/mediumlarge/3/cedar-point-raptor-roller-coaster-2021-dave-morgan.jpg",
      alt: "Raptor inverted coaster"
    },
    {
      id: "cp_magnum_xl_200",
      name: "Magnum XL-200",
      type: "Hyper Coaster",
      speed: "72 mph",
      height: "205 ft",
      length: "5,106 ft",
      year: 1989,
      rating: 8.5,
      img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQw6Jb1eGARwbM1TVjFj6wUSwg6X9W4peZ0Jg&s",
      alt: "Magnum XL-200 roller coaster"
    },
    {
      id: "cp_valravn",
      name: "Valravn",
      type: "Dive Coaster",
      speed: "75 mph",
      height: "223 ft",
      length: "3,415 ft",
      year: 2016,
      rating: 8.2,
      img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTQkBpJC5s2kJDcz4f-UMH2kAPJ79R-KAvmMQ&s",
      alt: "Valravn dive coaster"
    },
    {
      id: "cp_gatekeeper",
      name: "GateKeeper",
      type: "Wing Coaster",
      speed: "67 mph",
      height: "170 ft",
      length: "4,164 ft",
      year: 2013,
      rating: 8.0,
      img: "https://www.coaster101.com/wp-content/uploads/2013/05/DSC_0125.jpg",
      alt: "GateKeeper wing coaster"
    },
    {
      id: "cp_rougarou",
      name: "Rougarou",
      type: "Floorless Coaster",
      speed: "60 mph",
      height: "145 ft",
      length: "3,900 ft",
      year: 2015,
      rating: 7.6,
      img: "https://www.freep.com/gcdn/-mm-/49f959f1a87a950b952708947c9c91ee4653581e/c=0-138-3000-1830/local/-/media/DetroitFreePress/DetroitFreePress/2014/09/18/1411078318000-Rougarou-First-Hill.jpg?width=3000&height=1692&fit=crop&format=pjpg&auto=webp",
      alt: "Rougarou floorless coaster"
    },
    {
      id: "cp_gemini",
      name: "Gemini",
      type: "Racing Coaster",
      speed: "60 mph",
      height: "125 ft",
      length: "3,935 ft",
      year: 1978,
      rating: 7.3,
      img: "https://cdn.sanity.io/images/bsnrdz4t/production/c6a1ad2213367345ea44709075eef7d5174b036b-1440x690.jpg?rect=60,0,1321,690&w=1200&h=627&fit=crop&auto=format",
      alt: "Gemini racing coaster"
    }
  ]
};

export const PARK_INFO = {
  "dorney park": {
    name: "Dorney Park & Wildwater Kingdom",
    desc: "Allentown, PA · Cedar Fair / Six Flags · Est. 1884",
  },
  "six flags": {
    name: "Six Flags Great Adventure",
    desc: "Jackson, NJ · Six Flags Entertainment · Est. 1974",
  },
  "wildwood": {
    name: "Wildwood Boardwalk Piers",
    desc: "Wildwood, NJ · Morey's Piers · Est. 1969",
  },
  "cedar point": {
    name: "Cedar Point",
    desc: "Sandusky, OH · Cedar Fair / Six Flags · Est. 1870",
  }
};
