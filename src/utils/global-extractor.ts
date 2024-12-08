import { AemetLocalAlert } from "../interface/aemetLocalAlert.js";
import { xml2json } from 'xml-js';
import * as fs from 'fs';
import * as path from 'path';

function convertXmlToTypedObject(xml: string): AemetLocalAlert {
    const options = { 
        compact: true,
        ignoreDeclaration: true,
        alwaysArray: [
            'alert.info', 
            'alert.info.parameter', 
            'alert.info.area', 
            'alert.info.area.polygon'
        ]
    };
    const jsonString = xml2json(xml, options);

    const parsedJSON: AemetLocalAlert = JSON.parse(jsonString) as AemetLocalAlert;
    parsedJSON.alert.info.forEach(info => {
        // Forzar `area` a ser un array
        if (!Array.isArray(info.area)) {
            info.area = [info.area];
        }

        info.area.forEach(area => {
            // Forzar `polygon` a ser un array
            if (area.polygon && !Array.isArray(area.polygon)) {
                area.polygon = [area.polygon];
            }
        });
    });
    return parsedJSON;
}

const folderPath = './global-folder';

// Llamar a la función para leer los archivos XML
const aemetLocals: AemetLocalAlert[] = [];
const geoData: Record<string, { polygons: string[] }> = {};

const readXmlFiles = async (folderPath: string) => {
    try {
        const files = fs.readdirSync(folderPath);
        const xmlFiles = files.filter(file => file.endsWith('.xml'));

        for (const file of xmlFiles) {
            const filePath = path.join(folderPath, file);
            const xmlContent = fs.readFileSync(filePath, 'utf-8');
            const aemetMainJSON: AemetLocalAlert = convertXmlToTypedObject(xmlContent);
            aemetLocals.push(aemetMainJSON);

            aemetMainJSON.alert.info.forEach(infoItem => {
                if (infoItem.language._text === "es-ES") {
                    infoItem.area.forEach(area => {
                        const geocode = area.geocode.value._text;
                        const polygons = area.polygon.map(poly => poly._text);

                        // Si el geocode ya existe, añadimos los nuevos polígonos y eliminamos duplicados
                        if (geoData[geocode]) {
                            geoData[geocode].polygons.push(...polygons);
                            geoData[geocode].polygons = [...new Set(geoData[geocode].polygons)];
                        } else {
                            // Si no existe, creamos una nueva entrada sin duplicados
                            geoData[geocode] = { polygons: [...new Set(polygons)] };
                        }
                    });
                }
            });
        }

        // Guardar el resultado en un archivo JSON
        const outputPath = './resources/poly.json';
        fs.writeFileSync(outputPath, JSON.stringify(geoData, null, 2));
        console.log(`Archivo guardado en: ${outputPath}`);
    } catch (error) {
        console.error('Error al leer los archivos:', error);
    }
}

readXmlFiles(folderPath)
