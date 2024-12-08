import { AemetGeneralAlert } from "./interface/aemetGeneralAlert.js";
import { immutable } from "../resources/immutable.js";
import { BskyAgent } from '@atproto/api';
import { captureAemetMap } from './scrap.js';
import { Rss } from './Rss.js';
import dotenv from 'dotenv';
import fs from "fs";
import { promises as fsp } from 'fs';

class Main {
    private warnings: Map<string, string>;

    constructor() {
        this.warnings = new Map<string, string>([
            ["Andalucía", "undefined"],
            ["Aragón", "undefined"],
            ["Principado de Asturias", "undefined"],
            ["Illes Balears", "undefined"],
            ["Canarias", "undefined"],
            ["Cantabria", "undefined"],
            ["Castilla y León", "undefined"],
            ["Castilla - La Mancha", "undefined"],
            ["Cataluña", "undefined"],
            ["Extremadura", "undefined"],
            ["Galicia", "undefined"],
            ["Comunidad de Madrid", "undefined"],
            ["Región de Murcia", "undefined"],
            ["Comunidad Foral de Navarra", "undefined"],
            ["País Vasco", "undefined"],
            ["La Rioja", "undefined"],
            ["Comunitat Valenciana", "undefined"],
            ["Ciudad de Ceuta", "undefined"],
            ["Ciudad de Melilla", "undefined"]
        ]);
    }

    async login() {
        // await agent.login({ 
        //     identifier: process.env.BLUESKY_USERNAME!, 
        //     password: process.env.BLUESKY_PASSWORD! 
        // })
    }

    private buildMessage(): string {
        const red: string[] = [];
        const orange: string[] = [];
        const yellow: string[] = [];

        this.warnings.forEach((value: string, key: string) => {

            if (value === "red")
                red.push(this.parseComm(key));
            if (value === "orange")
                orange.push(this.parseComm(key));
            if (value === "yellow")
                yellow.push(this.parseComm(key));
        });

        let msg = "";

        if (red.length > 0) {
            msg += (
                "🔴 Avisos rojos en:\n"
                + red.join(', ')
            )
            if (red.length >= 2)
                msg = msg.replace(/,([^,]*)$/, " y$1");
        }

        if (orange.length > 0 && red.length > 0)
            msg += "\n";

        if (orange.length > 0) {
            msg += (
                "🟠 Avisos naranjas en:\n"
                + orange.join(', ')
            )
            if (orange.length >= 2)
                msg = msg.replace(/,([^,]*)$/, " y$1");
        }

        if (yellow.length > 0 && orange.length > 0)
            msg += "\n";

        if (yellow.length > 0) {
            msg += (
                "🟡 Avisos amarillos en:\n"
                + yellow.join(', ')
            )
            if (yellow.length >= 2)
                msg = msg.replace(/,([^,]*)$/, " y$1");
        }

        return msg;
    }

    private waringPerComm(generalAlert: AemetGeneralAlert) {
        generalAlert.rss.channel.item.forEach(item => {
            if (item.title._text !== immutable.mainRssFirstTitle) {
                const itemArray = item.title._text.split('.').map(item => item.trim());
                switch (this.warnings.get(this.getCommunity(itemArray[3]))) {
                    case "red":
                        break;

                    case "orange":
                        if (itemArray[1] === "Nivel rojo") {
                            this.warnings.set(this.getCommunity(itemArray[3]), "red");
                        }
                        break;

                    case "yellow":
                        if (itemArray[1] === "Nivel rojo") {
                            this.warnings.set(this.getCommunity(itemArray[3]), "red");
                        } else if (itemArray[1] === "Nivel naranja") {
                            this.warnings.set(this.getCommunity(itemArray[3]), "orange");
                        }
                        break;

                    case "undefined":
                        if (itemArray[1] === "Nivel rojo") {
                            this.warnings.set(this.getCommunity(itemArray[3]), "red");
                        } else if (itemArray[1] === "Nivel naranja") {
                            this.warnings.set(this.getCommunity(itemArray[3]), "orange");
                        } else if (itemArray[1] === "Nivel amarillo") {
                            this.warnings.set(this.getCommunity(itemArray[3]), "yellow");
                        }
                        break;

                    default:
                        break;
                }
            }
        });

    }

    private parseComm(jsonComm: string): string {
        switch (jsonComm) {
            case "Andalucía":
                return "Andalucía";

            case "Aragón":
                return "Aragón";

            case "Principado de Asturias":
                return "Asturias";

            case "Illes Balears":
                return "Baleares";

            case "Canarias":
                return "Canarias";

            case "Cantabria":
                return "Cantabria";

            case "Castilla y León":
                return "Castilla y León";

            case "Castilla - La Mancha":
                return "Castilla - La Mancha";

            case "Cataluña":
                return "Cataluña";

            case "Extremadura":
                return "Extremadura";

            case "Galicia":
                return "Galicia";

            case "Comunidad de Madrid":
                return "Madrid";

            case "Región de Murcia":
                return "Murcia";

            case "Comunidad Foral de Navarra":
                return "Navarra";

            case "País Vasco":
                return "País Vasco";

            case "La Rioja":
                return "La Rioja";

            case "Comunitat Valenciana":
                return "Valencia";

            case "Ciudad de Ceuta":
                return "Ceuta";

            case "Ciudad de Melilla":
                return "Melilla";

            default:
                throw new Error("Error: Something went wrong when parsing the community.");
        }
    }

    private getCommunity(zone: string): string {
        const main = new Main();
        const data = fs.readFileSync('./resources/geo.json', 'utf-8');
        const geoData = JSON.parse(data);

        const entry = geoData.find((item: { zone: string }) => item.zone === zone);

        if (!entry) {
            throw new Error(`La región "${zone}" no se encontró en el archivo geo.json.`);
        }

        return entry.comm;
    }

    private currentData(mainJson: AemetGeneralAlert): AemetGeneralAlert {
        mainJson.rss.channel.item = mainJson.rss.channel.item.filter(item => {
            const match = item.description._text.match(/\d{2}:\d{2} \d{2}-\d{2}-\d{4}/);
            if (match) {
                const [time, date] = match[0].split(' ');
                const [day, month, year] = date.split('-');
                const itemDate = new Date(`${year}-${month}-${day}`);

                return itemDate.toISOString().split('T')[0] === new Date().toISOString().split('T')[0];
            }

            return false;
        });

        return mainJson;
    }

    private async imgToUint8Array(imagePath: string): Promise<Uint8Array> {
        try {
            // Leer la imagen como un buffer
            const buffer = await fsp.readFile(imagePath);
    
            // Convertir el buffer a Uint8Array
            const uint8Array = new Uint8Array(buffer);
    
            console.log('Imagen cargada en Uint8Array:', uint8Array);
            return uint8Array;
        } catch (error) {
            console.error('Error cargando la imagen:', error);
            throw error;
        }
    }

    static async main(): Promise<void> {
        let image: Uint8Array = await captureAemetMap();

        const mainRss: Rss = new Rss(immutable.mainRssUrl);
        await mainRss.initialize();
        let mainJson: AemetGeneralAlert = mainRss.json as AemetGeneralAlert;

        const main = new Main();
        //mainJson = main.currentData(mainJson);
        // Aemet doesnt use current data for their map, but the general one.
        main.waringPerComm(mainJson);

        dotenv.config();

        const agent = new BskyAgent({ service: "https://bsky.social" })
        console.log(
            "identifier: " + process.env.BLUESKY_USERNAME,
            "password: " + process.env.BLUESKY_PASSWORD
        );

        await agent.login({
            identifier: process.env.BLUESKY_USERNAME!,
            password: process.env.BLUESKY_PASSWORD!
        })

        // const testimage = await main.imgToUint8Array("./aemet_map.png");

        const testUpload = await agent.uploadBlob(image, { encoding: "image/png" })

        let response = await agent.post({
            text: main.buildMessage(),
            embed: {
                images: [
                    {
                        image: testUpload.data.blob,
                        alt: "test",
                    },
                ],
                $type: "app.bsky.embed.images",
            },
        });
        console.log(response);

    }
}

Main.main();