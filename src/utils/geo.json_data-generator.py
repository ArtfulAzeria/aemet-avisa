import json

# Cargar datos desde los archivos con la codificación correcta
with open('resources/geo.basic.json', 'r', encoding='utf-8') as basic_file:
    geo_basic = json.load(basic_file)

with open('resources/poly.json', 'r', encoding='utf-8') as poly_file:
    poly_data = json.load(poly_file)

# Combinar los datos
result = []
for entry in geo_basic:
    code = entry["code"]
    # Agregar polygons si el código existe en poly_data
    if code in poly_data:
        entry["polygons"] = poly_data[code].get("polygons", [])
    else:
        entry["polygons"] = []
    result.append(entry)

# Guardar el resultado en geo.json
with open('resources/geo.json', 'w', encoding='utf-8') as output_file:
    json.dump(result, output_file, indent=4, ensure_ascii=False)

print("Archivo geo.json generado correctamente.")
