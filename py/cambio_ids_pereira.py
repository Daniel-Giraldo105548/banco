import csv

# Archivos
input_file = r"C:\xampp\htdocs\banco\archivosCSV\barrios_sin_comuna.csv"
output_file = r"C:\xampp\htdocs\banco\archivosCSV\barrios_final_p.csv"

# Leer CSV
rows = []
with open(input_file, newline='', encoding='utf-8-sig') as csvfile:
    reader = csv.DictReader(csvfile)
    for row in reader:
        rows.append(row)

# Obtener todos los id_comuna únicos y ordenarlos de menor a mayor
unique_comunas = sorted({int(row['CODIGO DE LA COMUNA']) for row in rows})

# Crear un mapeo para reasignar los id_comuna empezando desde 22
comuna_map = {old_id: new_id for old_id, new_id in zip(unique_comunas, range(22, 22 + len(unique_comunas)))}

# Reasignar id_comuna y id_barrio
new_id_barrio = 427
for row in rows:
    row['CODIGO DE LA COMUNA'] = str(comuna_map[int(row['CODIGO DE LA COMUNA'])])
    row['CODIGO DEL BARRIO'] = str(new_id_barrio)
    new_id_barrio += 1

# Guardar CSV final
fieldnames = ['CODIGO DE LA COMUNA', 'CODIGO DEL BARRIO', 'NOMBRE']
with open(output_file, 'w', newline='', encoding='utf-8') as csvfile:
    writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
    writer.writeheader()
    writer.writerows(rows)

print(f"Archivo final guardado como '{output_file}'")
