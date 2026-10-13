export interface BrandCatalog {
  name: string;
  models: string[];
}

export const CATALOG_BY_CATEGORY: Record<string, BrandCatalog[]> = {
  autos: [
    {
      name: 'Toyota',
      models: ['Hilux', 'Corolla', 'RAV4', 'Land Cruiser', 'Land Cruiser Prado', 'Yaris', 'Starlet', 'Fortuner', '4Runner', 'Tacoma', 'Camry', 'Rush']
    },
    {
      name: 'Suzuki',
      models: ['Swift', 'Grand Vitara', 'Jimny', 'Alto', 'Celerio', 'Baleno', 'S-Presso', 'Vitara', 'Ertiga', 'Fronx']
    },
    {
      name: 'Nissan',
      models: ['Patrol', 'X-Trail', 'Sentra', 'Versa', 'Frontier', 'Pathfinder', 'Kicks', 'Navara', 'Tiida', 'March']
    },
    {
      name: 'Ford',
      models: ['Ranger', 'Explorer', 'F-150', 'Bronco', 'Bronco Sport', 'Escape', 'Expedition', 'Mustang', 'Territory', 'Edge']
    },
    {
      name: 'Hyundai',
      models: ['Tucson', 'Santa Fe', 'Creta', 'Accent', 'Elantra', 'H1', 'Venue', 'Grand i10', 'Palisade', 'Kona']
    },
    {
      name: 'Chevrolet',
      models: ['Tracker', 'Trailblazer', 'S10', 'Colorado', 'Onix', 'Captiva', 'Silverado', 'Cruze', 'Groove', 'Tahoe']
    },
    {
      name: 'Mitsubishi',
      models: ['Montero', 'Montero Sport', 'L200', 'Outlander', 'ASX', 'Eclipse Cross', 'Pajero', 'Attrage']
    },
    {
      name: 'Volkswagen',
      models: ['Gol', 'Amarok', 'Tiguan', 'Taos', 'T-Cross', 'Saveiro', 'Polo', 'Nivus', 'Jetta', 'Virtus']
    },
    {
      name: 'Kia',
      models: ['Sportage', 'Sorento', 'Seltos', 'Rio', 'Picanto', 'Cerato', 'Carnival', 'Sonet', 'Carens']
    },
    {
      name: 'Mazda',
      models: ['CX-5', 'CX-30', 'CX-9', 'Mazda 3', 'Mazda 2', 'BT-50', 'CX-50']
    },
    {
      name: 'Jeep',
      models: ['Wrangler', 'Grand Cherokee', 'Compass', 'Renegade', 'Gladiator', 'Cherokee']
    },
    {
      name: 'Honda',
      models: ['CR-V', 'Civic', 'HR-V', 'Pilot', 'Fit', 'City', 'Accord']
    },
    {
      name: 'BMW',
      models: ['X3', 'X5', 'X6', 'Serie 3', 'Serie 4', 'Serie 5', 'X1']
    },
    {
      name: 'Mercedes-Benz',
      models: ['Clase C', 'Clase E', 'GLC', 'GLE', 'GLA', 'Clase G', 'Clase A']
    },
    {
      name: 'GAC Motor',
      models: ['GS3', 'GS4', 'GS8', 'Emzoom', 'Emkoo']
    },
    {
      name: 'Changan',
      models: ['CS15', 'CS35 Plus', 'CS55 Plus', 'Hunter', 'UNI-T', 'UNI-K']
    },
    {
      name: 'Chery',
      models: ['Tiggo 2', 'Tiggo 4 Pro', 'Tiggo 7 Pro', 'Tiggo 8 Pro']
    },
    {
      name: 'Geely',
      models: ['Coolray', 'Azkarra', 'Okavango', 'Emgrand', 'GX3 Pro']
    }
  ],

  autos_electricos: [
    {
      name: 'BYD',
      models: ['Dolphin', 'Seal', 'Yuan Plus EV', 'Song Plus DM-i', 'Tang EV', 'Han EV', 'Seagull', 'Dolphin Mini']
    },
    {
      name: 'Tesla',
      models: ['Model 3', 'Model Y', 'Model S', 'Model X', 'Cybertruck']
    },
    {
      name: 'Hyundai',
      models: ['Ioniq 5', 'Ioniq 6', 'Kona Electric']
    },
    {
      name: 'Kia',
      models: ['EV6', 'EV9', 'Niro EV']
    },
    {
      name: 'Geely',
      models: ['Geometry C', 'Geometry E', 'Zeekr 001', 'Zeekr X']
    },
    {
      name: 'BMW',
      models: ['i4', 'iX3', 'iX', 'i7']
    },
    {
      name: 'Mercedes-EQ',
      models: ['EQA', 'EQB', 'EQC', 'EQE', 'EQS']
    },
    {
      name: 'MG',
      models: ['MG4 Electric', 'ZS EV', 'Marvel R']
    },
    {
      name: 'Volvo',
      models: ['EX30', 'XC40 Recharge', 'C40 Recharge']
    }
  ],

  motos: [
    {
      name: 'Honda',
      models: ['CB500X', 'CB190R', 'XR150L', 'XR190L', 'CRF250L', 'Wave 110', 'NAVI 110', 'África Twin CRF1100', 'Transalp XL750', 'CB300F Twister', 'XRE 300']
    },
    {
      name: 'Yamaha',
      models: ['MT-03', 'MT-07', 'MT-09', 'FZ-S FI', 'FZ 25', 'YBR 125', 'XTZ 150 Crosser', 'XTZ 250 Lander', 'Tenere 700', 'Crypton 115', 'R3', 'NMAX 155']
    },
    {
      name: 'Suzuki',
      models: ['Gixxer 150', 'Gixxer 250', 'V-Strom 650 XT', 'V-Strom 1050', 'GN 125', 'DR 650', 'Hayabusa', 'Burgman 125', 'AX 100']
    },
    {
      name: 'Bajaj',
      models: ['Pulsar NS200', 'Pulsar NS160', 'Pulsar N250', 'Dominar 400', 'Dominar 250', 'Boxer 150', 'Platina 100', 'Avenger 220', 'Pulsar 150']
    },
    {
      name: 'Kawasaki',
      models: ['Ninja 400', 'Ninja 650', 'Ninja ZX-6R', 'Z400', 'Z900', 'KLR 650', 'Versys 650', 'Versys 300', 'KX 250']
    },
    {
      name: 'KTM',
      models: ['Duke 200', 'Duke 250', 'Duke 390', 'Adventure 390', 'Adventure 790', 'Adventure 890', 'RC 390']
    },
    {
      name: 'BMW Motorrad',
      models: ['G 310 GS', 'G 310 R', 'F 750 GS', 'F 850 GS', 'F 900 GS', 'R 1250 GS', 'R 1300 GS', 'S 1000 RR']
    },
    {
      name: 'Benelli',
      models: ['TRK 502X', 'TRK 702X', 'TNT 150', '302S', 'Leoncino 500', 'Imperiale 400']
    },
    {
      name: 'CF Moto',
      models: ['300NK', '450SR', '450MT', '650MT', '700CL-X', '800MT Explore']
    },
    {
      name: 'TVS',
      models: ['Apache RTR 160', 'Apache RTR 200 4V', 'NTORQ 125', 'HLX 150', 'Raider 125']
    },
    {
      name: 'Hero',
      models: ['XPulse 200 4V', 'Hunk 160R', 'Hunk 190', 'Eco 150', 'Dash 125']
    }
  ],

  motos_electricos: [
    {
      name: 'Super Soco',
      models: ['TC Max', 'CPx', 'TS Street Hunter', 'CUx', 'TC', 'TC Wanderer']
    },
    {
      name: 'NIU',
      models: ['NQi GTS', 'MQi GT', 'UQi GT', 'RQi', 'KQi3']
    },
    {
      name: 'Yadea',
      models: ['G5', 'C-Umi', 'Keeness', 'E8S Pro', 'VoltGuard']
    },
    {
      name: 'Horwin',
      models: ['CR6', 'CR6 Pro', 'EK3', 'SK3', 'Senmenti 0']
    },
    {
      name: 'Sunra',
      models: ['Miku Super', 'Robo-S', 'Hawk', 'Grace', 'Anger']
    },
    {
      name: 'Harley-Davidson LiveWire',
      models: ['LiveWire ONE', 'S2 Del Mar', 'S2 Mulholland']
    }
  ],

  maquinaria_agricola: [
    {
      name: 'John Deere',
      models: ['5075E', '6110M', '6125M', '6130M', '7200R', '8R 340', 'S700 Cosechadora', '310L Retroexcavadora', '670G Motoniveladora']
    },
    {
      name: 'Caterpillar (CAT)',
      models: ['320 Excavadora', '330 Excavadora', 'D6 Dozer', 'D8 Dozer', '416 Retroexcavadora', '420 Retroexcavadora', '950 Pala Cargadora', '120M Motoniveladora', 'CS54B Compactador']
    },
    {
      name: 'Komatsu',
      models: ['PC200 Excavadora', 'PC300 Excavadora', 'D65EX Dozer', 'WA320 Cargador', 'GD655 Motoniveladora']
    },
    {
      name: 'New Holland',
      models: ['TT4.75', 'T6.140', 'T7.240', 'CR 7.90 Cosechadora', 'B95B Retroexcavadora', 'W130B Cargador']
    },
    {
      name: 'Massey Ferguson',
      models: ['MF 4292', 'MF 6713', 'MF 7718', 'MF 8700 S', 'MF 9895 Cosechadora']
    },
    {
      name: 'Case IH',
      models: ['Farmall 75A', 'Puma 185', 'Magnum 340', 'Axial-Flow 7250 Cosechadora']
    },
    {
      name: 'Kubota',
      models: ['M7040', 'M9540', 'M108S', 'KX040 Miniexcavadora']
    }
  ],

  transporte_pesado: [
    {
      name: 'Volvo',
      models: ['FH 460 6x2 / 6x4', 'FH 500 6x4', 'FH 540 Globetrotter', 'FM 380', 'FM 420', 'FMX 440 Volqueta', 'FMX 500 8x4', 'VM 330 6x2']
    },
    {
      name: 'Scania',
      models: ['R450 6x2', 'R500 V8', 'R540', 'G410', 'P360', 'S500 Highline', 'G440 XT']
    },
    {
      name: 'Mercedes-Benz',
      models: ['Actros 2645 6x4', 'Actros 3344 6x4', 'Axor 1933', 'Atego 1726', 'Accelo 1016', 'Arocs 3345 Volqueta']
    },
    {
      name: 'Hino',
      models: ['300 Series (Dutro)', '500 Series (FC/GD/FG/GH)', '700 Series (Profia)']
    },
    {
      name: 'Isuzu',
      models: ['NPR 75 (Reward)', 'NQR 71', 'FVR 34 (Forward)', 'GIGA CYZ 6x4']
    },
    {
      name: 'Sinotruk (HOWO)',
      models: ['HOWO 371 6x4 Volqueta', 'HOWO A7 420 Tractocamión', 'HOWO TX 380', 'HOWO T7H']
    },
    {
      name: 'Foton',
      models: ['Auman EST 430', 'Aumark S 5 Ton', 'Auman GTL 380', 'Forland 4 Ton']
    },
    {
      name: 'Freightliner',
      models: ['Cascadia 126', 'M2 106', 'Columbia 120', 'Coronado']
    },
    {
      name: 'Mack',
      models: ['Anthem 6x4', 'Granite 6x4 / 8x4', 'Pinnacle']
    }
  ]
};
