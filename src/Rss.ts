import { AemetGeneralAlert } from "./interface/aemetGeneralAlert.js";
import { AemetLocalAlert } from "./interface/aemetLocalAlert.js";
import { immutable } from "../resources/immutable.js";
import { xml2json } from 'xml-js';

export class Rss {
    private _url!: string;
    private _xml!: string;
    private _json!: AemetGeneralAlert | AemetLocalAlert;

    constructor(url: string) {
        this._url = url;
    }

    public get url(): string {
        return this._url;
    }

    public set url(_url: string) {
        this._url = _url;
    }
    
    public get xml(): string {
        return this._xml;
    }

    public set xml(_xml: string) {
        this._xml = _xml;
    }

    public get json(): AemetGeneralAlert | AemetLocalAlert {
        return this.isMainRss()
            ?this._json as AemetGeneralAlert
            :this._json as AemetLocalAlert;
    }

    public set json(_json: AemetGeneralAlert | AemetLocalAlert) {
        this._json = _json;
    }

    /**
     * Fetch from the web the url you used in the constructor.
     * It loads the xml and json parameters.
     */
    public async initialize() {
        this._xml = await this.fetchFromUrl();
        this._json = this.isMainRss()
            ? this.parseXmlToJson<AemetGeneralAlert>()
            : this.parseXmlToJson<AemetLocalAlert>();
    }

    public isMainRss(): boolean {
        return this._url === immutable.mainRssUrl;
    }

    private async fetchFromUrl(): Promise<string> {
        const response = await fetch(this._url);
        if (!response.ok)
            throw new Error(`Error fetching. Response status obtained: ${response.statusText}`);
        return await response.text();
    }

    private parseXmlToJson<casting>(): casting {
        const options = { compact: true, ignoreDeclaration: true, explicitArray: false };
        const jsonString = xml2json(this._xml, options);
        return JSON.parse(jsonString) as casting;
    }
}