import re
import json

##############################################################################
###  Data from:   resources/external-documentation/METEOALERTA_ANX2.pdf    ###
##############################################################################

# Autonomus communities (as stated in documentation)
comunidades = [
    "Andalucía", "Aragón", "Principado de Asturias", "Cantabria", "Castilla y León",
    "Castilla - La Mancha", "Cataluña", "Extremadura", "Galicia", 
    "Illes Balears", "Canarias", "La Rioja", "Comunidad de Madrid", 
    "Región de Murcia", "Comunidad Foral de Navarra", "País Vasco", "Comunitat Valenciana",
    "Ciudad de Ceuta", "Ciudad de Melilla"
]

# Provinces (as stated in documentation)
provincias = [
    "Almería", "Cádiz", "Córdoba", "Granada", "Huelva", "Jaén", "Málaga", "Sevilla",
    "Huesca", "Teruel", "Zaragoza", "Asturias", "Cantabria", "Ávila", "Burgos", 
    "León", "Palencia", "Salamanca", "Segovia", "Soria", "Valladolid", "Zamora",
    "Albacete", "Ciudad Real", "Cuenca", "Guadalajara", "Toledo", "Barcelona",
    "Girona", "Lleida", "Tarragona", "Badajoz", "Cáceres", "A Coruña", "Lugo",
    "Ourense", "Pontevedra",
    "La Rioja", "Madrid", "Murcia", "Navarra", "Araba/Álava", "Gipuzkoa", "Bizkaia",
    "Alacant/Alicante", "Castelló/Castellón", "València/Valencia",
    "Ibiza y Formentera", "Mallorca", "Gran Canaria", "Menorca",
    "Lanzarote", "Fuerteventura", "La Palma", "La Gomera", "El Hierro", "Tenerife",
    "Ceuta", "Melilla"
]

def split_pattern(text):
    fullJSON = []

    pattern = r'(\d{6})([^\d]+?)(\d)'
    matches = re.findall(pattern, text)

    for num, non_num, single_digit in matches:
        non_num = non_num.strip()

        comunidad = None
        provincia = None

        for c in comunidades:
            if non_num.endswith(c):
                comunidad = c
                non_num = non_num[:-len(c)].strip()
                break

        for p in provincias:
            if non_num.endswith(p):
                provincia = p
                non_num = non_num[:-len(p)].strip()
                break

        data = {
            "code": num,            # Geocode
            "zone": non_num,        # Warning zone
            "prov": provincia,      # Province
            "comm": comunidad,      # Autonomous Community        
            "seab": single_digit    # Sea Boolean
        }
        
        fullJSON.append(data)
        
        if single_digit == "1":
            num = num+"C"
            data = {
                "code": num,            # Geocode
                "zone": non_num,        # Warning zone
                "prov": provincia,      # Province
                "comm": comunidad,      # Autonomous Community        
                "seab": single_digit    # Sea Boolean
            }   
            fullJSON.append(data)

    with open('./resources/geo.basic.json', 'w', encoding='utf-8') as json_file:
        json.dump(fullJSON, json_file, ensure_ascii=False, indent=4)
    

input_string = "610401 Valle del Almanzora y Los Vélez Almería Andalucía 0 610402 Nacimiento y Campo de Tabernas Almería Andalucía 0 610403 Poniente y Almería Capital Almería Andalucía 1 610404 Levante almeriense Almería Andalucía 1 611101 Grazalema Cádiz Andalucía 0 611102 Campiña gaditana Cádiz Andalucía 0 611103 Litoral gaditano Cádiz Andalucía 1 611104 Estrecho Cádiz Andalucía 1 611401 Sierra y Pedroches Córdoba Andalucía 0 611402 Campiña cordobesa Córdoba Andalucía 0 611403 Subbética cordobesa Córdoba Andalucía 0 611801 Cuenca del Genil Granada Andalucía 0 611802 Guadix y Baza Granada Andalucía 0 611803 Nevada y Alpujarras Granada Andalucía 0 611804 Costa granadina Granada Andalucía 1 612101 Aracena Huelva Andalucía 0 612102 Andévalo y Condado Huelva Andalucía 0 612103 Litoral de Huelva Huelva Andalucía 1 612301 Morena y Condado Jaén Andalucía 0 612302 Cazorla y Segura Jaén Andalucía 0 612303 Valle del Guadalquivir de Jaén Jaén Andalucía 0 612304 Capital y Montes de Jaén Jaén Andalucía 0 612901 Antequera Málaga Andalucía 0 612902 Ronda Málaga Andalucía 0 612903 Sol y Guadalhorce Málaga Andalucía 1 612904 Axarquía Málaga Andalucía 1 614101 Sierra norte de Sevilla Sevilla Andalucía 0 614102 Campiña sevillana Sevilla Andalucía 0 614103 Sierra sur de Sevilla Sevilla Andalucía 0 622201 Pirineo oscense Huesca Aragón 0 622202 Centro de Huesca Huesca Aragón 0 622203 Sur de Huesca Huesca Aragón 0 624401 Albarracín y Jiloca Teruel Aragón 0 624402 Gúdar y Maestrazgo Teruel Aragón 0 624403 Bajo Aragón de Teruel Teruel Aragón 0 625001 Cinco Villas de Zaragoza Zaragoza Aragón 0 625002 Ibérica zaragozana Zaragoza Aragón 0 625003 Ribera del Ebro de Zaragoza Zaragoza Aragón 0 633301 Litoral occidental asturiano Asturias Principado de Asturias 1 633302 Litoral oriental asturiano Asturias Principado de Asturias 1 633303 Suroccidental asturiana Asturias Principado de Asturias 0 633304 Central y Valles Mineros Asturias Principado de Asturias 0 633305 Cordillera y Picos de Europa Asturias Principado de Asturias 0 645301 Ibiza y Formentera Ibiza y Formentera Illes Balears 1 645401 Sierra Tramontana Mallorca Illes Balears 1 645402 Norte y nordeste de Mallorca Mallorca Illes Balears 1 645403 Interior de Mallorca Mallorca Illes Balears 0 645404 Sur de Mallorca Mallorca Illes Balears 1 645405 Levante mallorquín Mallorca Illes Balears 1 645501 Menorca Menorca Illes Balears 1 659001 Norte de Gran Canaria Gran Canaria Canarias 1 659003 Cumbres de Gran Canaria Gran Canaria Canarias 0 659004 Este, sur y oeste de Gran Canaria Gran Canaria Canarias 1 659101 Lanzarote Lanzarote Canarias 1 659201 Fuerteventura Fuerteventura Canarias 1 659302 Cumbres de La Palma La Palma Canarias 0 659303 Este de La Palma La Palma Canarias 1 659304 Oeste de La Palma La Palma Canarias 1 659401 La Gomera La Gomera Canarias 1 659501 El Hierro El Hierro Canarias 1 659601 Norte de Tenerife Tenerife Canarias 1 659602 Área metropolitana de Tenerife Tenerife Canarias 1 659603 Este, sur y oeste de Tenerife Tenerife Canarias 1 663901 Litoral cántabro Cantabria Cantabria 1 663902 Liébana Cantabria Cantabria 0 663903 Centro y valle de Villaverde Cantabria Cantabria 0 663904 Cantabria del Ebro Cantabria Cantabria 0 670501 Meseta de Ávila Ávila Castilla y León 0 670502 Sistema Central de Ávila Ávila Castilla y León 0 670503 Sur de Ávila Ávila Castilla y León 0 670901 Cordillera Cantábrica de Burgos Burgos Castilla y León 0 670902 Norte de Burgos Burgos Castilla y León 0 670903 Condado de Treviño Burgos Castilla y León 0 670904 Meseta de Burgos Burgos Castilla y León 0 670905 Ibérica de Burgos Burgos Castilla y León 0 672401 Cordillera Cantábrica de León León Castilla y León 0 672402 Bierzo de León León Castilla y León 0 672403 Meseta de León León Castilla y León 0 673401 Cordillera Cantábrica de Palencia Palencia Castilla y León 0 673402 Meseta de Palencia Palencia Castilla y León 0 673701 Meseta de Salamanca Salamanca Castilla y León 0 673702 Sistema Central de Salamanca Salamanca Castilla y León 0 673703 Sur de Salamanca Salamanca Castilla y León 0 674001 Meseta de Segovia Segovia Castilla y León 0 674002 Sistema Central de Segovia Segovia Castilla y León 0 674201 Ibérica de Soria Soria Castilla y León 0 674202 Meseta de Soria Soria Castilla y León 0 674203 Sistema Central de Soria Soria Castilla y León 0 674701 Meseta de Valladolid Valladolid Castilla y León 0 674901 Sanabria Zamora Castilla y León 0 674902 Meseta de Zamora Zamora Castilla y León 0 680201 La Mancha albaceteña Albacete Castilla - La Mancha 0 680202 Alcaraz y Segura Albacete Castilla - La Mancha 0 680203 Hellín y Almansa Albacete Castilla - La Mancha 0 681301 Montes del norte y Anchuras Ciudad Real Castilla - La Mancha 0 681302 La Mancha de Ciudad Real Ciudad Real Castilla - La Mancha 0 681303 Valle del Guadiana Ciudad Real Castilla - La Mancha 0 681304 Sierras de Alcudia y Madrona Ciudad Real Castilla - La Mancha 0 681601 Alcarria conquense Cuenca Castilla - La Mancha 0 681602 Serranía de Cuenca Cuenca Castilla - La Mancha 0 681603 La Mancha conquense Cuenca Castilla - La Mancha 0 681901 Serranía de Guadalajara Guadalajara Castilla - La Mancha 0 681902 Parameras de Molina Guadalajara Castilla - La Mancha 0 681903 Alcarria de Guadalajara Guadalajara Castilla - La Mancha 0 684501 Sierra de San Vicente Toledo Castilla - La Mancha 0 684502 Valle del Tajo Toledo Castilla - La Mancha 0 684503 Montes de Toledo Toledo Castilla - La Mancha 0 684504 La Mancha toledana Toledo Castilla - La Mancha 0 690801 Prepirineo de Barcelona Barcelona Cataluña 0 690802 Depresión central de Barcelona Barcelona Cataluña 0 690803 Prelitoral de Barcelona Barcelona Cataluña 0 690804 Litoral de Barcelona Barcelona Cataluña 1 691701 Pirineo de Girona Girona Cataluña 0 691702 Prelitoral de Girona Girona Cataluña 0 691703 Ampurdán Girona Cataluña 1 691704 Litoral sur de Girona Girona Cataluña 1 692501 Valle de Arán Lleida Cataluña 0 692502 Pirineo de Lleida Lleida Cataluña 0 692503 Depresión central de Lleida Lleida Cataluña 0 694301 Depresión central de Tarragona Tarragona Cataluña 0 694302 Prelitoral norte de Tarragona Tarragona Cataluña 0 694303 Litoral norte de Tarragona Tarragona Cataluña 1 694304 Litoral sur de Tarragona Tarragona Cataluña 1 694305 Prelitoral sur de Tarragona Tarragona Cataluña 0 700601 Vegas del Guadiana Badajoz Extremadura 0 700602 La Siberia extremeña Badajoz Extremadura 0 700603 Barros y Serena Badajoz Extremadura 0 700604 Sur de Badajoz Badajoz Extremadura 0 701001 Norte de Cáceres Cáceres Extremadura 0 701002 Tajo y Alagón Cáceres Extremadura 0 701003 Meseta cacereña Cáceres Extremadura 0 701004 Villuercas y Montánchez Cáceres Extremadura 0 711501 Noroeste de A Coruña A Coruña Galicia 1 711502 Oeste de A Coruña A Coruña Galicia 1 711503 Interior de A Coruña A Coruña Galicia 0 711504 Suroeste de A Coruña A Coruña Galicia 1 712701 A Mariña Lugo Galicia 1 712702 Centro de Lugo Lugo Galicia 0 712703 Montaña de Lugo Lugo Galicia 0 712704 Sur de Lugo Lugo Galicia 0 713201 Noroeste de Ourense Ourense Galicia 0 713202 Miño de Ourense Ourense Galicia 0 713203 Sur de Ourense Ourense Galicia 0 713204 Montaña de Ourense Ourense Galicia 0 713205 Valdeorras Ourense Galicia 0 713601 Rias Baixas Pontevedra Galicia 1 713602 Interior de Pontevedra Pontevedra Galicia 0 713603 Miño de Pontevedra Pontevedra Galicia 1 722801 Sierra de Madrid Madrid Comunidad de Madrid 0 722802 Metropolitana y Henares Madrid Comunidad de Madrid 0 722803 Sur, Vegas y Oeste Madrid Comunidad de Madrid 0 733001 Altiplano de Murcia Murcia Región de Murcia 0 733002 Noroeste de Murcia Murcia Región de Murcia 0 733003 Vega del Segura Murcia Región de Murcia 0 733004 Valle del Guadalentín, Lorca y Águilas Murcia Región de Murcia 1 733005 Campo de Cartagena y Mazarrón Murcia Región de Murcia 1 743101 Vertiente cantábrica de Navarra Navarra Comunidad Foral de Navarra 0 743102 Centro de Navarra Navarra Comunidad Foral de Navarra 0 743103 Pirineo navarro Navarra Comunidad Foral de Navarra 0 743104 Ribera del Ebro de Navarra Navarra Comunidad Foral de Navarra 0 750101 Cuenca del Nervión Araba/Álava País Vasco 0 750102 Llanada alavesa Araba/Álava País Vasco 0 750103 Rioja alavesa Araba/Álava País Vasco 0 752001 Gipuzkoa litoral Gipuzkoa País Vasco 1 752002 Gipuzkoa interior Gipuzkoa País Vasco 0 754801 Bizkaia litoral Bizkaia País Vasco 1 754802 Bizkaia interior Bizkaia País Vasco 0 762601 Ribera del Ebro de La Rioja La Rioja La Rioja 0 762602 Ibérica riojana La Rioja La Rioja 0 770301 Litoral norte de Alicante Alacant/Alicante Comunitat Valenciana 1 770302 Interior de Alicante Alacant/Alicante Comunitat Valenciana 0 770303 Litoral sur de Alicante Alacant/Alicante Comunitat Valenciana 1 771201 Interior norte de Castellón Castelló/Castellón Comunitat Valenciana 0 771202 Litoral norte de Castellón Castelló/Castellón Comunitat Valenciana 1 771203 Interior sur de Castellón Castelló/Castellón Comunitat Valenciana 0 771204 Litoral sur de Castellón Castelló/Castellón Comunitat Valenciana 1 774601 Interior norte de Valencia València/Valencia Comunitat Valenciana 0 774602 Litoral norte de Valencia València/Valencia Comunitat Valenciana 1 774603 Interior sur de Valencia València/Valencia Comunitat Valenciana 0 774604 Litoral sur de Valencia València/Valencia Comunitat Valenciana 1 785101 Ceuta Ceuta Ciudad de Ceuta 1 795201 Melilla Melilla Ciudad de Melilla 1"
split_pattern(input_string)