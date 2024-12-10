import puppeteer from 'puppeteer';

export async function captureAemetMap(): Promise<Uint8Array> {
    let mapToReturn: Uint8Array = new Uint8Array;
    const url = 'https://www.aemet.es/es/eltiempo/prediccion/avisos';
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();

    // Different parameters may result in the map being badly cropped.
    await page.setViewport({
        width: 1920,
        height: 1080,
    });

    try {
        await page.goto(url, { timeout: 60000, waitUntil: 'networkidle2' });
    } catch (error) {
        console.error(`Error navegando a la URL: ${url}`, error);
    }
    await page.waitForSelector('#mapa');

    await page.evaluate(() => {
        const style = document.createElement('style');
        style.textContent = `
            html, body {
                background-color: #181a1b !important;
                color: #e8e6e3 !important;
            }

            #mapa {
                filter: invert(90%) hue-rotate(180deg) brightness(0.9) contrast(1.2);
            }

            /* Prevent excesive color correction */
            img, video {
                filter: invert(100%) hue-rotate(180deg) !important;
            }

            /*
            // We override colors after previous transformations to make
            // sure it stays in the final image. Keep in mind the hue-rotate and
            // other previous filters still aplies.
            // Only fill color is changed, but other instructions can be
            // manipulated (opacity, stroke width, stroke color...)
            */

            /* Override color: Yellow */
            path.leaflet-interactive[fill="#f4e72a"] {
                fill: #d9ca00 !important;
            }

            /* Override color: Orange */
            path.leaflet-interactive[fill="#f6ba2c"] {
                /* fill: #f6ba2c !important; */
            }

            /* Override color: Red */
            path.leaflet-interactive[fill="#a20e02"] {
                fill: #ffbdbd !important;
            }

        `;
        document.head.appendChild(style);
    });

    await page.evaluate(() => {
        const zoomControl = document.querySelector('.leaflet-control-zoom');
        if (zoomControl)
            zoomControl.remove();
    });

    const mapElement = await page.$('#mapa');
    if (mapElement) {
        mapToReturn = await mapElement.screenshot();
        // await mapElement.screenshot({ path: 'aemet_map.png' });
        console.log('Mapa capturado y guardado como aemet_map.png');
    } else {
        console.error('No se pudo encontrar el mapa.');
    }

    await browser.close();
    return mapToReturn;
}

captureAemetMap().catch(console.error);