export interface AemetGeneralAlert {
    rss: RSS;
}

export interface RSS {
    _version: _text;
    channel:     Channel;
}

export interface Channel {
    title:         _text;
    link:          _text;
    description:   _text;
    language:      _text;
    copyright:     _text;
    pubDate:       _text;
    lastBuildDate: _text;
    image:         Image;
    item:          Item[];
}

export interface Image {
    title: _text;
    link:  _text;
    url:   _text;
}

export interface Item {
    title:       _text;
    description: _text;
    link:        _text;
    guid:        GUID;
    pubDate:     _text;
}

export interface GUID {
    _isPermaLink: _text;
    _text:       _text;
}

export interface _text {
    _text: string;
}