import { AemetGeneralAlert } from "./interface/aemetGeneralAlert.js";
import { AemetLocalAlert } from "./interface/aemetLocalAlert.js";
import { xml2json } from 'xml-js';

async function fetchRssFeed(url: string): Promise<string> {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Error al obtener el RSS: ${response.statusText}`);
    }
    const xml = await response.text();
    return xml;
}

function convertXmlToTypedObject<RSS>(xml: string): RSS {
    const options = { compact: true, ignoreDeclaration: true, explicitArray: false };
    const jsonString = xml2json(xml, options);
    return JSON.parse(jsonString) as RSS;
}

export async function init(): Promise<AemetLocalAlert[]> {
    const mainRSSUrl: string = 'https://www.aemet.es/documentos_d/eltiempo/prediccion/avisos/rss/CAP_AFAE_RSS.xml';

    const mainXMLData: string = await fetchRssFeed(mainRSSUrl);
    const aemetMainJSON: AemetGeneralAlert = convertXmlToTypedObject(mainXMLData);
    //console.log(JSON.stringify(aemetMainJSON, null, 2));

    let aemetLocals: AemetLocalAlert[] = [];    
    for (const localItem of aemetMainJSON.rss.channel.item) {
        if (localItem.link._text.endsWith(".xml")) {
            const localXMLData = await fetchRssFeed(localItem.link._text);
            console.log(localItem.link._text);
            
            const aemetLocalJSON: AemetLocalAlert = convertXmlToTypedObject(localXMLData);
            aemetLocals.push(aemetLocalJSON);
        }
    }

    
    aemetLocals.forEach(localAlert => {
        localAlert.alert.info.forEach(localInfo => {
            if (localInfo.language._text == "es-ES") {
                console.log(localInfo.event + ".\nObtén más detalles en:" + localInfo.web);
            }
        });
    });
    
    
    return aemetLocals;
}

init();
