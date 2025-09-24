import pandas as pd

# ===============================
# 1. Comunas con IDs y Códigos
# ===============================
comunas = [
    {"id_comuna": 1, "nombre": "Comuna 1 – Centenario", "codigo_postal": 630001},
    {"id_comuna": 2, "nombre": "Comuna 2 – Rufino José Cuervo", "codigo_postal": 630001},
    {"id_comuna": 3, "nombre": "Comuna 3 – Alfonso López", "codigo_postal": 630002},
    {"id_comuna": 4, "nombre": "Comuna 4 – Francisco de Paula Santander", "codigo_postal": 630002},
    {"id_comuna": 5, "nombre": "Comuna 5 – El Bosque", "codigo_postal": 630002},
    {"id_comuna": 6, "nombre": "Comuna 6 – San José", "codigo_postal": 630003},
    {"id_comuna": 7, "nombre": "Comuna 7 – Cafetero", "codigo_postal": 630004},
    {"id_comuna": 8, "nombre": "Comuna 8 – Libertadores", "codigo_postal": 630003},
    {"id_comuna": 9, "nombre": "Comuna 9 – Fundadores", "codigo_postal": 630003},
    {"id_comuna": 10, "nombre": "Comuna 10 – Quimbaya", "codigo_postal": 630004},
]

# Limpiar nombres de comunas (quitar palabra "Comuna")
for c in comunas:
    c["nombre"] = c["nombre"].replace("Comuna", "").strip()

df_comunas = pd.DataFrame(comunas)

# ===============================
# 2. Barrios por Comuna (todos)
# ===============================
barrios = {
    1: [
        "Arenales","Arrayanes","Bambusa","Bloques de Bosques de Pinares","Bosques de Pinares",
        "Castilla Grande","Ciudadela Simón Bolívar","Conjunto Balcones del Edén",
        "Conjunto Residencial Guaduales del Edén","Conjunto Residencial La Villa",
        "El Emperador","El Milagro","El Palmar","Génesis","La Arcadia","La Castilla",
        "La Isabela","La Villa","Maravelez","Nuestra Señora de la Paz","Parque de La Villa",
        "Pinares","Portal de Pinares","Portal del Edén","Santa María del Bosque","Tres Esquinas",
        "Urbanización Cañas Gordas","Urbanización Guaduales de La Villa","Urbanización La Linda",
        "Villa Centenario","Vista Hermosa"
    ],
    2: [
        "14 de Octubre","19 de Enero","8 de Marzo","Alcázar del Café","Antonio Nariño",
        "Barrio Calima","Barrio La Milagrosa","Barrio Zuldemayda","San Vicente de Paúl",
        "Bello Horizonte","Bloques El Porvenir","Bosques de Gibraltar","Ciudadela Puerto Espejo",
        "Cristales","El Carmelo","El Poblado","El Tesorito","Farallones","Gibraltar",
        "Jesús María Ocampo","La Fachada","La Virginia","Las Acacias","Las Brisas","Las Veraneras",
        "Los Naranjos","Los Quindos","Los Quindos II Etapa","Los Quindos III Etapa",
        "Luis Carlos Galán","Manantiales","Marco Fidel Suárez","Nuevo Horizonte","Patricia",
        "San Francisco","Santa Rita","Serranías","Urbanización Girasoles",
        "Urbanización Jardines de La Fachada","Urbanización Lindaraja","Urbanización Lindaraja II Etapa",
        "Veracruz","Villa Alejandra","Villa Claudia","Villa de la Vida y el Trabajo","Villa del Carmen"
    ],
    3: [
        "Alfonso López","Arcades","Barrio 13 de Junio","Barrio 25 de Mayo","Barrio Arcoiris",
        "Barrio Belén","Barrio Ciudadela","Barrio Cooperativo","Barrio El Placer",
        "Barrio La Adiela","Barrio La Alhambra","Barrio La Esmeralda","Barrio La Miranda",
        "Barrio Los Kioscos","Barrio Manuela Beltrán","Barrio Mesón de Sinaí",
        "Barrio Santa María","Barrio Villa Hermosa","Barrio Villa Laura","Bosques de Viena",
        "Casablanca","Ciudad Dorada","Ciudadela Nuevo Armenia III","Ciudadela Nuevo Armenia",
        "Ciudadela Nuevo Armenia II","Conjunto Residencial Montecarlo","Conjunto Residencial Sinaí",
        "Cordillera","La Cecilia","La Cristalina","Nuevo Placer","Quintas de La Marina",
        "Urbanización La Grecia","Urbanización Las Colinas","Urbanización Loma Verde",
        "Urbanización Nuevo Amanecer","Urbanización San Diego","Urbanización Villa Ángela","Villa Italia"
    ],
    4: [
        "Barrio Brasilia","Barrio Belencito","Barrio Brasilia Nueva","Barrio Cincuentenario",
        "Barrio El Prado","Barrio Gaitán","Barrio Miraflores","Barrio Miraflores Bajo",
        "Barrio Obrero","Barrio Popular","Barrio Santa Fe","Barrio Santa Helena",
        "Barrio Santander","El Refugio","San José Sur","Sector Boyacá","Villa del Café","Villa Juliana"
    ],
    5: [
        "1 de Mayo","Artesanos","Barrio 7 de Agosto","Barrio Berlín","Barrio El Recreo",
        "Barrio Kennedy","Barrio La Unión","Barrio Monteprado","Barrio Montevideo",
        "Barrio Nueva Libertad","Barrio Salazar","Barrio Villa Liliana","Casas Fiscales",
        "La Anunciación","Montevideo Bajo","Nuevo Recreo","Palmares del Recreo",
        "Urbanización El Silencio I","Urbanización El Silencio II"
    ],
    6: [
        "Barrio La Clarita","Barrio La Patria","Barrio Las Américas","Barrio Los Cámbulos",
        "Barrio Quindío","Barrio Universal","Barrio San José","Carolina I",
        "Condominio San José de La Sierra","Conjunto Residencial Aldea de Los Comuneros",
        "Conjunto Residencial Villa Jardín","El Parque I","El Parque II",
        "Gustavo Rojas Pinilla I","Gustavo Rojas Pinilla II","La Montaña","Los Almendros",
        "Los Andes I","Quintas de Juliana","Rincón de Los Andes","Santa Sofía",
        "Urbanización Altos de La Pavona","Urbanización El Cortijo","Urbanización La Irlanda",
        "Urbanización La Pavona","Urbanización Monteblanco I Etapa","Urbanización Monteblanco II Etapa",
        "Urbanización Monteblanco III Etapa","Urbanización Quintas de Los Andes",
        "Urbanización San Andrés","Urbanización Villa Andrea","Vaguita de Tigreros",
        "Villa Carolina II","Villa Celmira","Villa de Las Américas","Villa Ximena"
    ],
    7: [
        "Barrio Alberto Zuleta","Barrio Patio Bonito Alto","Barrio Rincón Santo",
        "Barrio San Fernando","Barrio San Nicolás","Barrio Uribe","Barrio Vélez",
        "Condominio La Aldea","Condominio Torres del Río","Conjunto Residencial Sotavento",
        "Guayaquil Alto","La Florida","Sector Centro","Sector Parque Valencia",
        "Urbanización María Cristina I Etapa","Urbanización María Cristina II Etapa",
        "Urbanización María Cristina III Etapa"
    ],
    8: [
        "Barrio Ahitamara","Barrio Corbones","Barrio La Divisa","Barrio La Esperanza",
        "Barrio Las Mercedes","Barrio Tigreros","El Berlín","El Limonar I Etapa","El Limonar II Etapa",
        "El Limonar III Etapa","El Limonar IV Etapa","El Paraíso","Francisco José de Caldas","Jubileo",
        "Las Colinas","Libertadores","Nuevo Berlín","Piamonte","Urbanización Altos de La Calleja",
        "Urbanización Centenario","Urbanización Villa Inglesa","Villa Sofía"
    ],
    9: [
        "Altos del Niágara","Bajo Niágara","Barrio Las 60 Casas","Barrio Los Álamos",
        "Barrio Modelo","Barrio Vieja Libertad","Ciudadela Sorrento","Conjunto El Remanso",
        "Conjunto Residencial Nisa Bulevar","Conjunto Residencial Palmas del Modelo",
        "Conjunto Residencial Guayacanes","Edificio Alto de Las Palmas","Edificio Torres del Granada",
        "Gran Bretaña","Granada","La Arboleda","La Cabaña","Las Palmas","Quintas del Yulima",
        "Rincón de Yulima","Yulima I","Yulima II","Yulima III"
    ],
    10: [
        "Asentamiento Los Fundadores","Barrio Alcázar","Barrio El Nogal","Barrio Fundadores",
        "Barrio Galán","Barrio La Campiña","Barrio La Lorena","Barrio La Nueva Cecilia",
        "Barrio La Suiza","Barrio Laureles","Barrio Los Profesionales","Barrio Mercedes del Norte",
        "Barrio Nueva Cecilia","Barrio Providencia","Barrio Salvador Allende","Bloques Palmas de Sorrento",
        "Ciudadela Quimbaya","Condominio Altos del Bosque","Condominio Caminos de Calay",
        "Condominio El Alcázar","Condominio El Molino","Condominio El Palmar","Condominio La Hacienda",
        "Conjunto Cerrado Caminos de San Lorenzo","Conjunto Multifamiliar Providencia",
        "Conjunto Residencial Alejandría","Conjunto Residencial Bosques de Palermo",
        "Conjunto Residencial Bosques de San Martín","Conjunto Residencial Bulevar del Coliseo",
        "Conjunto Residencial Casa Loma","Conjunto Residencial Coinca","Conjunto Residencial El Retiro",
        "Conjunto Residencial Jardín de Las Mercedes","Conjunto Residencial La Abadía",
        "Conjunto Residencial La Alquería","Conjunto Residencial La Estancia",
        "Conjunto Residencial La Hacienda Palmacera","Conjunto Residencial Las Lomas",
        "Conjunto Residencial Los Andes","Conjunto Residencial Pasadena Country",
        "Conjunto Residencial Plazoleta Andina","Conjunto Residencial Portal de La Colonia",
        "Conjunto Residencial Rincón de Andalucía","Conjunto Residencial Torres de Marfil",
        "Conjunto Residencial Torres del Alcázar","Conjunto Residencial Santillana del Mar",
        "Conjunto Residencial Rincón de La Samaria","Parque Residencial Las Veraneras",
        "Proviteq Unidad I","Proviteq Unidad II","Proviteq Unidad III","Proviteq Unidad IV",
        "Proviteq Unidad V","Sector Bavaria","Simón Bolívar","Torres Providencia I",
        "Torres Providencia II","Urbanización Bosques de Viena","Urbanización La Aurora",
        "Urbanización La Mariela","Urbanización Los Tulipanes"
    ]
}

# ===============================
# 3. Crear IDs únicos de barrios
# ===============================
lista_barrios = []
id_barrio = 1

for id_comuna, lista in barrios.items():
    for b in lista:
        lista_barrios.append({
            "id_barrio": id_barrio,
            "nombre_barrio": b,
            "id_comuna": id_comuna
        })
        id_barrio += 1

df_barrios = pd.DataFrame(lista_barrios)



# ===============================
# 5. (Opcional) Exportar a CSV
# ===============================
df_comunas.to_csv("comunas.csv", index=False, encoding="utf-8")
df_barrios.to_csv("barrios.csv", index=False, encoding="utf-8")