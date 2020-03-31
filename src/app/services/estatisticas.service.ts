import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as moment from 'moment';
import * as nlp from './../helpers/nlp';
@Injectable({
  providedIn: 'root'
})
export class EstatisticasService {

  private headers = {
    'headers': {
      "x-rapidapi-host": "covid-193.p.rapidapi.com",
      "x-rapidapi-key": "f52157b401msh79f83a38192009fp1536e8jsndbbd37080694"
  }}

  constructor(private http: HttpClient) {}

  //Retorna o pais pelo nome
  public async buscarEstatisticaPais(pais = 'All', dia = null) {

    const nomePais = (pais == 'All' ? pais : this.getNomePais(pais));
    if (!nomePais)
      return null;

    // const dia = moment().format('YYYY-MM-DD');

    return this.http.get('https://covid-193.p.rapidapi.com/history?country='+nomePais+(dia ? '&day='+dia : ''), this.headers)
          .toPromise().then((retorno:any) => {
            console.log(retorno);
            if (retorno.results == 0) 
              return null;
            const r = retorno.response[0];
            const dados = {
              'mortes': (r.deaths.total ? r.deaths.total : 0),
              'mortesNovas': (r.deaths.new ? r.deaths.new : 0),
              'confirmados': (r.cases.total ? r.cases.total : 0),
              'confirmadosNovos': (r.cases.new ? r.cases.new : 0),
              'recuperados': (r.cases.recovered ? r.cases.recovered : 0),
              'ultima_atualizacao': r.day
            }
            return dados;
          })
  }

  public buscarPais(pais): {achou: boolean, similares?:string[]} {
    const index = paises.map(p => p.nomePT.toLowerCase()).indexOf(pais.toLowerCase().trim());
    if (index != -1)
      return {achou: true}
    else {
      const similares = this.buscarSimilares(pais);
      return {achou: false, similares};
    }
  }

  /** Busca paises com nomes similares */
  public buscarSimilares(pais) {
    let resultados = paises.map((p) => {
      const similaridade = nlp.similar(p.nomePT.toLowerCase(), pais.toLowerCase().trim());
      return (similaridade > 0.6 ? p.nomePT : null) 
    })
    return resultados.filter(p => p != null);
  }

  /**
   * Busca o nome do país 
   * @param pais 
   */
  private getNomePais(pais): string|null {
    console.log(pais);
    const index = paises.map(p => p.nomePT.toLowerCase().trim()).indexOf(pais.toLowerCase().trim());
    console.log(index);
      return (index != -1 ? paises[index].nomeAPI : null);
  }

}

const paises = [ 
  { "gentilico" : "afegãne",
    "nomePT" : "Afeganistão",
    "nomeAPI" : "Afghanistan",
    "sigla" : "AF"
  },
  { "gentilico" : "sul-africana",
    "nomePT" : "África do Sul",
    "nomeAPI" : "South-Africa",
    "sigla" : "ZA"
  },
  { "gentilico" : "albanesa",
    "nomePT" : "Albânia",
    "nomeAPI" : "Albania",
    "sigla" : "AL"
  },
  { "gentilico" : "alemã",
    "nomePT" : "Alemanha",
    "nomeAPI" : "Germany",
    "sigla" : "DE"
  },
  { "gentilico" : "andorrana",
    "nomePT" : "Andorra",
    "nomeAPI" : "Andorra",
    "sigla" : "AD"
  },
  { "gentilico" : "angolana",
    "nomePT" : "Angola",
    "nomeAPI" : "Angola",
    "sigla" : "AO"
  },
  { "gentilico" : "anguillana",
    "nomePT" : "Anguilla",
    "nomeAPI" : "Anguilla",
    "sigla" : "AI"
  },
  { "gentilico" : "de antártida",
    "nomePT" : "Antártida",
    "nomeAPI" : "Antarctica",
    "sigla" : "AQ"
  },
  { "gentilico" : "antiguana",
    "nomePT" : "Antígua e Barbuda",
    "nomeAPI" : "Antigua-and-Barbuda",
    "sigla" : "AG"
  },
  { "gentilico" : "saudita",
    "nomePT" : "Arábia Saudita",
    "nomeAPI" : "Saudi-Arabia",
    "sigla" : "SA"
  },
  { "gentilico" : "argelina",
    "nomePT" : "Argélia",
    "nomeAPI" : "Algeria",
    "sigla" : "DZ"
  },
  { "gentilico" : "argentina",
    "nomePT" : "Argentina",
    "nomeAPI" : "Argentina",
    "sigla" : "AR"
  },
  { "gentilico" : "armênia",
    "nomePT" : "Armênia",
    "nomeAPI" : "Armenia",
    "sigla" : "AM"
  },
  { "gentilico" : "arubana",
    "nomePT" : "Aruba",
    "nomeAPI" : "Aruba",
    "sigla" : "AW"
  },
  { "gentilico" : "australiana",
    "nomePT" : "Austrália",
    "nomeAPI" : "Australia",
    "sigla" : "AU"
  },
  { "gentilico" : "austríaca",
    "nomePT" : "Áustria",
    "nomeAPI" : "Austria",
    "sigla" : "AT"
  },
  { "gentilico" : "azerbaijano",
    "nomePT" : "Azerbaijão",
    "nomeAPI" : "Azerbaijan",
    "sigla" : "AZ"
  },
  { "gentilico" : "bahamense",
    "nomePT" : "Bahamas",
    "nomeAPI" : "Bahamas",
    "sigla" : "BS"
  },
  { "gentilico" : "barenita",
    "nomePT" : "Bahrein",
    "nomeAPI" : "Bahrain",
    "sigla" : "BH"
  },
  { "gentilico" : "bengali",
    "nomePT" : "Bangladesh",
    "nomeAPI" : "Bangladesh",
    "sigla" : "BD"
  },
  { "gentilico" : "barbadiana",
    "nomePT" : "Barbados",
    "nomeAPI" : "Barbados",
    "sigla" : "BB"
  },
  { "gentilico" : "bielo-russa",
    "nomePT" : "Belarus",
    "nomeAPI" : "Belarus",
    "sigla" : "BY"
  },
  { "gentilico" : "belga",
    "nomePT" : "Bélgica",
    "nomeAPI" : "Belgium",
    "sigla" : "BE"
  },
  { "gentilico" : "belizenha",
    "nomePT" : "Belize",
    "nomeAPI" : "Belize",
    "sigla" : "BZ"
  },
  { "gentilico" : "beninense",
    "nomePT" : "Benin",
    "nomeAPI" : "Benin",
    "sigla" : "BJ"
  },
  { "gentilico" : "bermudiana",
    "nomePT" : "Bermudas",
    "nomeAPI" : "Bermuda",
    "sigla" : "BM"
  },
  { "gentilico" : "boliviana",
    "nomePT" : "Bolívia",
    "nomeAPI" : "Bolivia",
    "sigla" : "BO"
  },
  { "gentilico" : "bósnia",
    "nomePT" : "Bósnia-Herzegóvina",
    "nomeAPI" : "Bosnia-and-Herzegovina",
    "sigla" : "BA"
  },
  { "gentilico" : "betchuana",
    "nomePT" : "Botsuana",
    "nomeAPI" : "Botswana",
    "sigla" : "BW"
  },
  { "gentilico" : "brasileira",
    "nomePT" : "Brasil",
    "nomeAPI" : "Brazil",
    "sigla" : "BR"
  },
  { "gentilico" : "bruneiana",
    "nomePT" : "Brunei",
    "nomeAPI" : "Brunei-",
    "sigla" : "BN"
  },
  { "gentilico" : "búlgara",
    "nomePT" : "Bulgária",
    "nomeAPI" : "Bulgaria",
    "sigla" : "BG"
  },
  { "gentilico" : "burquinês",
    "nomePT" : "Burkina Fasso",
    "nomeAPI" : "Burkina-Faso",
    "sigla" : "BF"
  },
  { "gentilico" : "burundinesa",
    "nomePT" : "Burundi",
    "nomeAPI" : "Burundi",
    "sigla" : "BI"
  },
  { "gentilico" : "butanesa",
    "nomePT" : "Butão",
    "nomeAPI" : "Bhutan",
    "sigla" : "BT"
  },
  { "gentilico" : "cabo-verdiana",
    "nomePT" : "Cabo Verde",
    "nomeAPI" : "Cabo-Verde",
    "sigla" : "CV"
  },
  { "gentilico" : "camaronesa",
    "nomePT" : "Camarões",
    "nomeAPI" : "Cameroon",
    "sigla" : "CM"
  },
  { "gentilico" : "cambojana",
    "nomePT" : "Camboja",
    "nomeAPI" : "Cambodia",
    "sigla" : "KH"
  },
  { "gentilico" : "canadense",
    "nomePT" : "Canadá",
    "nomeAPI" : "Canada",
    "sigla" : "CA"
  },
  { "gentilico" : "canário",
    "nomePT" : "Canárias",
    "nomeAPI" : "Canary Islands",
    "sigla" : "IC"
  },
  { "gentilico" : "cazaque",
    "nomePT" : "Cazaquistão",
    "nomeAPI" : "Kazakhstan",
    "sigla" : "KZ"
  },
  { "gentilico" : "de ceuta e melilla",
    "nomePT" : "Ceuta e Melilla",
    "nomeAPI" : "Ceuta & Melilla",
    "sigla" : "EA"
  },
  { "gentilico" : "chadiana",
    "nomePT" : "Chade",
    "nomeAPI" : "Chad",
    "sigla" : "TD"
  },
  { "gentilico" : "chilena",
    "nomePT" : "Chile",
    "nomeAPI" : "Chile",
    "sigla" : "CL"
  },
  { "gentilico" : "chinesa",
    "nomePT" : "China",
    "nomeAPI" : "China",
    "sigla" : "CN"
  },
  { "gentilico" : "cipriota",
    "nomePT" : "Chipre",
    "nomeAPI" : "Cyprus",
    "sigla" : "CY"
  },
  { "gentilico" : "cingapuriana",
    "nomePT" : "Cingapura",
    "nomeAPI" : "Singapore",
    "sigla" : "SG"
  },
  { "gentilico" : "colombiana",
    "nomePT" : "Colômbia",
    "nomeAPI" : "Colombia",
    "sigla" : "CO"
  },
  { "gentilico" : "comorense",
    "nomePT" : "Comores",
    "nomeAPI" : "Comoros",
    "sigla" : "KM"
  },
  { "gentilico" : "congolesa",
    "nomePT" : "Congo",
    "nomeAPI" : "Congo (Republic)",
    "sigla" : "CG"
  },
  { "gentilico" : "norte-coreano",
    "nomePT" : "Coréia do Norte",
    "nomeAPI" : "North Korea",
    "sigla" : "KP"
  },
  { "gentilico" : "norte-coreana",
    "nomePT" : "Coréia do Sul",
    "nomeAPI" : "S.-Korea",
    "sigla" : "KR"
  },
  { "gentilico" : "marfinense",
    "nomePT" : "Costa do Marfim",
    "nomeAPI" : "Ivory-Coast",
    "sigla" : "CI"
  },
  { "gentilico" : "costarriquenha",
    "nomePT" : "Costa Rica",
    "nomeAPI" : "Costa-Rica",
    "sigla" : "CR"
  },
  { "gentilico" : "croata",
    "nomePT" : "Croácia",
    "nomeAPI" : "Croatia",
    "sigla" : "HR"
  },
  { "gentilico" : "cubana",
    "nomePT" : "Cuba",
    "nomeAPI" : "Cuba",
    "sigla" : "CU"
  },
  { "gentilico" : "curaçauense",
    "nomePT" : "Curaçao",
    "nomeAPI" : "Cura&ccedil;ao",
    "sigla" : "CW"
  },
  { "gentilico" : "chagositano",
    "nomePT" : "Diego Garcia",
    "nomeAPI" : "Diego Garcia",
    "sigla" : "DG"
  },
  { "gentilico" : "dinamarquesa",
    "nomePT" : "Dinamarca",
    "nomeAPI" : "Denmark",
    "sigla" : "DK"
  },
  { "gentilico" : "djibutiana",
    "nomePT" : "Djibuti",
    "nomeAPI" : "Djibouti",
    "sigla" : "DJ"
  },
  { "gentilico" : "dominiquense",
    "nomePT" : "Dominica",
    "nomeAPI" : "Dominica",
    "sigla" : "DM"
  },
  { "gentilico" : "egípcia",
    "nomePT" : "Egito",
    "nomeAPI" : "Egypt",
    "sigla" : "EG"
  },
  { "gentilico" : "salvadorenha",
    "nomePT" : "El Salvador",
    "nomeAPI" : "El-Salvador",
    "sigla" : "SV"
  },
  { "gentilico" : "árabe",
    "nomePT" : "Emirados Árabes Unidos",
    "nomeAPI" : "United Arab Emirates",
    "sigla" : "AE"
  },
  { "gentilico" : "equatoriana",
    "nomePT" : "Equador",
    "nomeAPI" : "Ecuador",
    "sigla" : "EC"
  },
  { "gentilico" : "eritreia",
    "nomePT" : "Eritréia",
    "nomeAPI" : "Eritrea",
    "sigla" : "ER"
  },
  { "gentilico" : "eslovaco",
    "nomePT" : "Eslováquia",
    "nomeAPI" : "Slovakia",
    "sigla" : "SK"
  },
  { "gentilico" : "esloveno",
    "nomePT" : "Eslovênia",
    "nomeAPI" : "Slovenia",
    "sigla" : "SI"
  },
  { "gentilico" : "espanhola",
    "nomePT" : "Espanha",
    "nomeAPI" : "Spain",
    "sigla" : "ES"
  },
  { "gentilico" : "norte-americana",
    "nomePT" : "Estados Unidos",
    // "nomeAPI" : "United States",
    "nomeAPI" : "US",
    "sigla" : "US"
  },
  { "gentilico" : "estoniana",
    "nomePT" : "Estônia",
    "nomeAPI" : "Estonia",
    "sigla" : "EE"
  },
  { "gentilico" : "etíope",
    "nomePT" : "Etiópia",
    "nomeAPI" : "Ethiopia",
    "sigla" : "ET"
  },
  { "gentilico" : "fijiana",
    "nomePT" : "Fiji",
    "nomeAPI" : "Fiji",
    "sigla" : "FJ"
  },
  { "gentilico" : "filipina",
    "nomePT" : "Filipinas",
    "nomeAPI" : "Philippines",
    "sigla" : "PH"
  },
  { "gentilico" : "finlandesa",
    "nomePT" : "Finlândia",
    "nomeAPI" : "Finland",
    "sigla" : "FI"
  },
  { "gentilico" : "francesa",
    "nomePT" : "França",
    "nomeAPI" : "France",
    "sigla" : "FR"
  },
  { "gentilico" : "gabonesa",
    "nomePT" : "Gabão",
    "nomeAPI" : "Gabon",
    "sigla" : "GA"
  },
  { "gentilico" : "gambiana",
    "nomePT" : "Gâmbia",
    "nomeAPI" : "Gambia",
    "sigla" : "GM"
  },
  { "gentilico" : "ganense",
    "nomePT" : "Gana",
    "nomeAPI" : "Ghana",
    "sigla" : "GH"
  },
  { "gentilico" : "georgiana",
    "nomePT" : "Geórgia",
    "nomeAPI" : "Georgia",
    "sigla" : "GE"
  },
  { "gentilico" : "gibraltariana",
    "nomePT" : "Gibraltar",
    "nomeAPI" : "Gibraltar",
    "sigla" : "GI"
  },
  { "gentilico" : "inglesa",
    "nomePT" : "Grã-Bretanha (Reino Unido, UK)",
    "nomeAPI" : "United Kingdom",
    "sigla" : "GB"
  },
  { "gentilico" : "granadina",
    "nomePT" : "Granada",
    "nomeAPI" : "Grenada",
    "sigla" : "GD"
  },
  { "gentilico" : "grega",
    "nomePT" : "Grécia",
    "nomeAPI" : "Greece",
    "sigla" : "GR"
  },
  { "gentilico" : "groenlandesa",
    "nomePT" : "Groelândia",
    "nomeAPI" : "Greenland",
    "sigla" : "GL"
  },
  { "gentilico" : "guadalupense",
    "nomePT" : "Guadalupe",
    "nomeAPI" : "Guadeloupe",
    "sigla" : "GP"
  },
  { "gentilico" : "guamês",
    "nomePT" : "Guam (Território dos Estados Unidos)",
    "nomeAPI" : "Guam",
    "sigla" : "GU"
  },
  { "gentilico" : "guatemalteca",
    "nomePT" : "Guatemala",
    "nomeAPI" : "Guatemala",
    "sigla" : "GT"
  },
  { "gentilico" : "guernesiano",
    "nomePT" : "Guernsey",
    "nomeAPI" : "Guernsey",
    "sigla" : "GG"
  },
  { "gentilico" : "guianense",
    "nomePT" : "Guiana",
    "nomeAPI" : "Guyana",
    "sigla" : "GY"
  },
  { "gentilico" : "franco-guianense",
    "nomePT" : "Guiana Francesa",
    "nomeAPI" : "French-Guiana",
    "sigla" : "GF"
  },
  { "gentilico" : "guinéu-equatoriano ou equatoguineana",
    "nomePT" : "Guiné",
    "nomeAPI" : "Guinea",
    "sigla" : "GN"
  },
  { "gentilico" : "guinéu-equatoriano",
    "nomePT" : "Guiné Equatorial",
    "nomeAPI" : "Equatorial-Guinea",
    "sigla" : "GQ"
  },
  { "gentilico" : "guineense",
    "nomePT" : "Guiné-Bissau",
    "nomeAPI" : "Guinea-Bissau",
    "sigla" : "GW"
  },
  { "gentilico" : "haitiana",
    "nomePT" : "Haiti",
    "nomeAPI" : "Haiti",
    "sigla" : "HT"
  },
  { "gentilico" : "holandês",
    "nomePT" : "Holanda",
    "nomeAPI" : "Netherlands",
    "sigla" : "NL"
  },
  { "gentilico" : "hondurenha",
    "nomePT" : "Honduras",
    "nomeAPI" : "Honduras",
    "sigla" : "HN"
  },
  { "gentilico" : "hong-konguiana ou chinesa",
    "nomePT" : "Hong Kong",
    "nomeAPI" : "Hong Kong",
    "sigla" : "HK"
  },
  { "gentilico" : "húngara",
    "nomePT" : "Hungria",
    "nomeAPI" : "Hungary",
    "sigla" : "HU"
  },
  { "gentilico" : "iemenita",
    "nomePT" : "Iêmen",
    "nomeAPI" : "Yemen",
    "sigla" : "YE"
  },
  { "gentilico" : "da ilha bouvet",
    "nomePT" : "Ilha Bouvet",
    "nomeAPI" : "Bouvet Island",
    "sigla" : "BV"
  },
  { "gentilico" : "da ilha de ascensão",
    "nomePT" : "Ilha de Ascensão",
    "nomeAPI" : "Ascension Island",
    "sigla" : "AC"
  },
  { "gentilico" : "da ilha de clipperton",
    "nomePT" : "Ilha de Clipperton",
    "nomeAPI" : "Clipperton Island",
    "sigla" : "CP"
  },
  { "gentilico" : "manês",
    "nomePT" : "Ilha de Man",
    "nomeAPI" : "Isle-of-Man",
    "sigla" : "IM"
  },
  { "gentilico" : "natalense",
    "nomePT" : "Ilha Natal",
    "nomeAPI" : "Christmas Island",
    "sigla" : "CX"
  },
  { "gentilico" : "pitcairnense",
    "nomePT" : "Ilha Pitcairn",
    "nomeAPI" : "Pitcairn Islands",
    "sigla" : "PN"
  },
  { "gentilico" : "reunionense",
    "nomePT" : "Ilha Reunião",
    "nomeAPI" : "R&eacute;union",
    "sigla" : "RE"
  },
  { "gentilico" : "alandês",
    "nomePT" : "Ilhas Aland",
    "nomeAPI" : "Åland Islands",
    "sigla" : "AX"
  },
  { "gentilico" : "caimanês",
    "nomePT" : "Ilhas Cayman",
    "nomeAPI" : "Cayman-Islands",
    "sigla" : "KY"
  },
  { "gentilico" : "coquense",
    "nomePT" : "Ilhas Cocos",
    "nomeAPI" : "Cocos (Keeling) Islands",
    "sigla" : "CC"
  },
  { "gentilico" : "cookense",
    "nomePT" : "Ilhas Cook",
    "nomeAPI" : "Cook Islands",
    "sigla" : "CK"
  },
  { "gentilico" : "faroense",
    "nomePT" : "Ilhas Faroes",
    "nomeAPI" : "Faeroe-Islands",
    "sigla" : "FO"
  },
  { "gentilico" : "das ilhas geórgia do sul e sandwich do sul",
    "nomePT" : "Ilhas Geórgia do Sul e Sandwich do Sul",
    "nomeAPI" : "South Georgia & South Sandwich Islands",
    "sigla" : "GS"
  },
  { "gentilico" : "das ilhas heard e mcdonald",
    "nomePT" : "Ilhas Heard e McDonald (Território da Austrália)",
    "nomeAPI" : "Heard & McDonald Islands",
    "sigla" : "HM"
  },
  { "gentilico" : "malvinense",
    "nomePT" : "Ilhas Malvinas",
    "nomeAPI" : "Falkland Islands (Islas Malvinas)",
    "sigla" : "FK"
  },
  { "gentilico" : "norte-marianense",
    "nomePT" : "Ilhas Marianas do Norte",
    "nomeAPI" : "Northern Mariana Islands",
    "sigla" : "MP"
  },
  { "gentilico" : "marshallino",
    "nomePT" : "Ilhas Marshall",
    "nomeAPI" : "Marshall Islands",
    "sigla" : "MH"
  },
  { "gentilico" : "das ilhas menores afastadas",
    "nomePT" : "Ilhas Menores dos Estados Unidos",
    "nomeAPI" : "U.S. Outlying Islands",
    "sigla" : "UM"
  },
  { "gentilico" : "norfolquino",
    "nomePT" : "Ilhas Norfolk",
    "nomeAPI" : "Norfolk Island",
    "sigla" : "NF"
  },
  { "gentilico" : "salomônico",
    "nomePT" : "Ilhas Salomão",
    "nomeAPI" : "Solomon Islands",
    "sigla" : "SB"
  },
  { "gentilico" : "seichelense",
    "nomePT" : "Ilhas Seychelles",
    "nomeAPI" : "Seychelles",
    "sigla" : "SC"
  },
  { "gentilico" : "toquelauano",
    "nomePT" : "Ilhas Tokelau",
    "nomeAPI" : "Tokelau",
    "sigla" : "TK"
  },
  { "gentilico" : "turquês",
    "nomePT" : "Ilhas Turks e Caicos",
    "nomeAPI" : "Turks & Caicos Islands",
    "sigla" : "TC"
  },
  { "gentilico" : "virginense",
    "nomePT" : "Ilhas Virgens",
    "nomeAPI" : "U.S.-Virgin-Islands",
    "sigla" : "VI"
  },
  { "gentilico" : "virginense",
    "nomePT" : "Ilhas Virgens (Inglaterra)",
    "nomeAPI" : "British Virgin Islands",
    "sigla" : "VG"
  },
  { "gentilico" : "indiano",
    "nomePT" : "Índia",
    "nomeAPI" : "India",
    "sigla" : "IN"
  },
  { "gentilico" : "indonésia",
    "nomePT" : "Indonésia",
    "nomeAPI" : "Indonesia",
    "sigla" : "ID"
  },
  { "gentilico" : "iraniano",
    "nomePT" : "Irã",
    "nomeAPI" : "Iran",
    "sigla" : "IR"
  },
  { "gentilico" : "iraquiana",
    "nomePT" : "Iraque",
    "nomeAPI" : "Iraq",
    "sigla" : "IQ"
  },
  { "gentilico" : "irlandesa",
    "nomePT" : "Irlanda",
    "nomeAPI" : "Ireland",
    "sigla" : "IE"
  },
  { "gentilico" : "islandesa",
    "nomePT" : "Islândia",
    "nomeAPI" : "Iceland",
    "sigla" : "IS"
  },
  { "gentilico" : "israelense",
    "nomePT" : "Israel",
    "nomeAPI" : "Israel",
    "sigla" : "IL"
  },
  { "gentilico" : "italiana",
    "nomePT" : "Itália",
    "nomeAPI" : "Italy",
    "sigla" : "IT"
  },
  { "gentilico" : "jamaicana",
    "nomePT" : "Jamaica",
    "nomeAPI" : "Jamaica",
    "sigla" : "JM"
  },
  { "gentilico" : "japonesa",
    "nomePT" : "Japão",
    "nomeAPI" : "Japan",
    "sigla" : "JP"
  },
  { "gentilico" : "canalina",
    "nomePT" : "Jersey",
    "nomeAPI" : "Jersey",
    "sigla" : "JE"
  },
  { "gentilico" : "jordaniana",
    "nomePT" : "Jordânia",
    "nomeAPI" : "Jordan",
    "sigla" : "JO"
  },
  { "gentilico" : "kiribatiana",
    "nomePT" : "Kiribati",
    "nomeAPI" : "Kiribati",
    "sigla" : "KI"
  },
  { "gentilico" : "kosovar",
    "nomePT" : "Kosovo",
    "nomeAPI" : "Kosovo",
    "sigla" : "XK"
  },
  { "gentilico" : "kuwaitiano",
    "nomePT" : "Kuait",
    "nomeAPI" : "Kuwait",
    "sigla" : "KW"
  },
  { "gentilico" : "laosiana",
    "nomePT" : "Laos",
    "nomeAPI" : "Laos",
    "sigla" : "LA"
  },
  { "gentilico" : "lesota",
    "nomePT" : "Lesoto",
    "nomeAPI" : "Lesotho",
    "sigla" : "LS"
  },
  { "gentilico" : "letão",
    "nomePT" : "Letônia",
    "nomeAPI" : "Latvia",
    "sigla" : "LV"
  },
  { "gentilico" : "libanesa",
    "nomePT" : "Líbano",
    "nomeAPI" : "Lebanon",
    "sigla" : "LB"
  },
  { "gentilico" : "liberiana",
    "nomePT" : "Libéria",
    "nomeAPI" : "Liberia",
    "sigla" : "LR"
  },
  { "gentilico" : "líbia",
    "nomePT" : "Líbia",
    "nomeAPI" : "Libya",
    "sigla" : "LY"
  },
  { "gentilico" : "liechtensteiniense",
    "nomePT" : "Liechtenstein",
    "nomeAPI" : "Liechtenstein",
    "sigla" : "LI"
  },
  { "gentilico" : "lituana",
    "nomePT" : "Lituânia",
    "nomeAPI" : "Lithuania",
    "sigla" : "LT"
  },
  { "gentilico" : "luxemburguesa",
    "nomePT" : "Luxemburgo",
    "nomeAPI" : "Luxembourg",
    "sigla" : "LU"
  },
  { "gentilico" : "macauense",
    "nomePT" : "Macau",
    "nomeAPI" : "Macau",
    "sigla" : "MO"
  },
  { "gentilico" : "macedônio",
    "nomePT" : "Macedônia",
    "nomeAPI" : "North-Macedonia",
    "sigla" : "MK"
  },
  { "gentilico" : "malgaxe",
    "nomePT" : "Madagascar",
    "nomeAPI" : "Madagascar",
    "sigla" : "MG"
  },
  { "gentilico" : "malaia",
    "nomePT" : "Malásia",
    "nomeAPI" : "Malaysia",
    "sigla" : "MY"
  },
  { "gentilico" : "malauiano",
    "nomePT" : "Malaui",
    "nomeAPI" : "Malawi",
    "sigla" : "MW"
  },
  { "gentilico" : "maldívia",
    "nomePT" : "Maldivas",
    "nomeAPI" : "Maldives",
    "sigla" : "MV"
  },
  { "gentilico" : "malinesa",
    "nomePT" : "Mali",
    "nomeAPI" : "Mali",
    "sigla" : "ML"
  },
  { "gentilico" : "maltesa",
    "nomePT" : "Malta",
    "nomeAPI" : "Malta",
    "sigla" : "MT"
  },
  { "gentilico" : "marroquina",
    "nomePT" : "Marrocos",
    "nomeAPI" : "Morocco",
    "sigla" : "MA"
  },
  { "gentilico" : "martiniquense",
    "nomePT" : "Martinica",
    "nomeAPI" : "Martinique",
    "sigla" : "MQ"
  },
  { "gentilico" : "mauriciana",
    "nomePT" : "Maurício",
    "nomeAPI" : "Mauritius",
    "sigla" : "MU"
  },
  { "gentilico" : "mauritana",
    "nomePT" : "Mauritânia",
    "nomeAPI" : "Mauritania",
    "sigla" : "MR"
  },
  { "gentilico" : "maiotense",
    "nomePT" : "Mayotte",
    "nomeAPI" : "Mayotte",
    "sigla" : "YT"
  },
  { "gentilico" : "mexicana",
    "nomePT" : "México",
    "nomeAPI" : "Mexico",
    "sigla" : "MX"
  },
  { "gentilico" : "micronésia",
    "nomePT" : "Micronésia",
    "nomeAPI" : "Micronesia",
    "sigla" : "FM"
  },
  { "gentilico" : "moçambicana",
    "nomePT" : "Moçambique",
    "nomeAPI" : "Mozambique",
    "sigla" : "MZ"
  },
  { "gentilico" : "moldavo",
    "nomePT" : "Moldova",
    "nomeAPI" : "Moldova",
    "sigla" : "MD"
  },
  { "gentilico" : "monegasca",
    "nomePT" : "Mônaco",
    "nomeAPI" : "Monaco",
    "sigla" : "MC"
  },
  { "gentilico" : "mongol",
    "nomePT" : "Mongólia",
    "nomeAPI" : "Mongolia",
    "sigla" : "MN"
  },
  { "gentilico" : "montenegra",
    "nomePT" : "Montenegro",
    "nomeAPI" : "Montenegro",
    "sigla" : "ME"
  },
  { "gentilico" : "montserratiano",
    "nomePT" : "Montserrat",
    "nomeAPI" : "Montserrat",
    "sigla" : "MS"
  },
  { "gentilico" : "birmanês",
    "nomePT" : "Myanma",
    "nomeAPI" : "Myanmar (Burma)",
    "sigla" : "MM"
  },
  { "gentilico" : "namíbia",
    "nomePT" : "Namíbia",
    "nomeAPI" : "Namibia",
    "sigla" : "NA"
  },
  { "gentilico" : "nauruana",
    "nomePT" : "Nauru",
    "nomeAPI" : "Nauru",
    "sigla" : "NR"
  },
  { "gentilico" : "nepalesa",
    "nomePT" : "Nepal",
    "nomeAPI" : "Nepal",
    "sigla" : "NP"
  },
  { "gentilico" : "nicaraguense",
    "nomePT" : "Nicarágua",
    "nomeAPI" : "Nicaragua",
    "sigla" : "NI"
  },
  { "gentilico" : "nigerina",
    "nomePT" : "Níger",
    "nomeAPI" : "Niger",
    "sigla" : "NE"
  },
  { "gentilico" : "nigeriana",
    "nomePT" : "Nigéria",
    "nomeAPI" : "Nigeria",
    "sigla" : "NG"
  },
  { "gentilico" : "niueana",
    "nomePT" : "Niue",
    "nomeAPI" : "Niue",
    "sigla" : "NU"
  },
  { "gentilico" : "norueguesa",
    "nomePT" : "Noruega",
    "nomeAPI" : "Norway",
    "sigla" : "NO"
  },
  { "gentilico" : "caledônia",
    "nomePT" : "Nova Caledônia",
    "nomeAPI" : "New Caledonia",
    "sigla" : "NC"
  },
  { "gentilico" : "neozelandesa",
    "nomePT" : "Nova Zelândia",
    "nomeAPI" : "New Zealand",
    "sigla" : "NZ"
  },
  { "gentilico" : "omani",
    "nomePT" : "Omã",
    "nomeAPI" : "Oman",
    "sigla" : "OM"
  },
  { "gentilico" : "dos países baixos caribenhos",
    "nomePT" : "Países Baixos Caribenhos",
    "nomeAPI" : "Caribbean Netherlands",
    "sigla" : "BQ"
  },
  { "gentilico" : "palauense",
    "nomePT" : "Palau",
    "nomeAPI" : "Palau",
    "sigla" : "PW"
  },
  { "gentilico" : "palestino",
    "nomePT" : "Palestina",
    "nomeAPI" : "Palestine",
    "sigla" : "PS"
  },
  { "gentilico" : "zona do canal do panamá",
    "nomePT" : "Panamá",
    "nomeAPI" : "Panama",
    "sigla" : "PA"
  },
  { "gentilico" : "pauásia",
    "nomePT" : "Papua-Nova Guiné",
    "nomeAPI" : "Papua-New-Guinea",
    "sigla" : "PG"
  },
  { "gentilico" : "paquistanesa",
    "nomePT" : "Paquistão",
    "nomeAPI" : "Pakistan",
    "sigla" : "PK"
  },
  { "gentilico" : "paraguaia",
    "nomePT" : "Paraguai",
    "nomeAPI" : "Paraguay",
    "sigla" : "PY"
  },
  { "gentilico" : "peruana",
    "nomePT" : "Peru",
    "nomeAPI" : "Peru",
    "sigla" : "PE"
  },
  { "gentilico" : "franco-polinésia",
    "nomePT" : "Polinésia Francesa",
    "nomeAPI" : "French-Polynesia",
    "sigla" : "PF"
  },
  { "gentilico" : "polonesa",
    "nomePT" : "Polônia",
    "nomeAPI" : "Poland",
    "sigla" : "PL"
  },
  { "gentilico" : "portorriquenha",
    "nomePT" : "Porto Rico",
    "nomeAPI" : "Puerto-Rico",
    "sigla" : "PR"
  },
  { "gentilico" : "portuguesa",
    "nomePT" : "Portugal",
    "nomeAPI" : "Portugal",
    "sigla" : "PT"
  },
  { "gentilico" : "catarense",
    "nomePT" : "Qatar",
    "nomeAPI" : "Qatar",
    "sigla" : "QA"
  },
  { "gentilico" : "queniano",
    "nomePT" : "Quênia",
    "nomeAPI" : "Kenya",
    "sigla" : "KE"
  },
  { "gentilico" : "quirguiz",
    "nomePT" : "Quirguistão",
    "nomeAPI" : "Kyrgyzstan",
    "sigla" : "KG"
  },
  { "gentilico" : "centro-africana",
    "nomePT" : "República Centro-Africana",
    "nomeAPI" : "Central African Republic",
    "sigla" : "CF"
  },
  { "gentilico" : "congolesa",
    "nomePT" : "República Democrática do Congo",
    "nomeAPI" : "Congo (DRC)",
    "sigla" : "CD"
  },
  { "gentilico" : "dominicana",
    "nomePT" : "República Dominicana",
    "nomeAPI" : "Dominican-Republic",
    "sigla" : "DO"
  },
  { "gentilico" : "tcheco",
    "nomePT" : "República Tcheca",
    "nomeAPI" : "Czechia",
    "sigla" : "CZ"
  },
  { "gentilico" : "romena",
    "nomePT" : "Romênia",
    "nomeAPI" : "Romania",
    "sigla" : "RO"
  },
  { "gentilico" : "ruandesa",
    "nomePT" : "Ruanda",
    "nomeAPI" : "Rwanda",
    "sigla" : "RW"
  },
  { "gentilico" : "russa",
    "nomePT" : "Rússia (antiga URSS) - Federação Russa",
    "nomeAPI" : "Russia",
    "sigla" : "RU"
  },
  { "gentilico" : "saariano",
    "nomePT" : "Saara Ocidental",
    "nomeAPI" : "Western Sahara",
    "sigla" : "EH"
  },
  { "gentilico" : "pedro-miquelonense",
    "nomePT" : "Saint-Pierre e Miquelon",
    "nomeAPI" : "St. Pierre & Miquelon",
    "sigla" : "PM"
  },
  { "gentilico" : "samoana",
    "nomePT" : "Samoa Americana",
    "nomeAPI" : "American Samoa",
    "sigla" : "AS"
  },
  { "gentilico" : "samoano",
    "nomePT" : "Samoa Ocidental",
    "nomeAPI" : "Samoa",
    "sigla" : "WS"
  },
  { "gentilico" : "samarinês",
    "nomePT" : "San Marino",
    "nomeAPI" : "San-Marino",
    "sigla" : "SM"
  },
  { "gentilico" : "helenense",
    "nomePT" : "Santa Helena",
    "nomeAPI" : "St. Helena",
    "sigla" : "SH"
  },
  { "gentilico" : "santa-lucense",
    "nomePT" : "Santa Lúcia",
    "nomeAPI" : "Saint-Lucia",
    "sigla" : "LC"
  },
  { "gentilico" : "são-bartolomeense",
    "nomePT" : "São Bartolomeu",
    "nomeAPI" : "St.-Barth",
    "sigla" : "BL"
  },
  { "gentilico" : "são-cristovense",
    "nomePT" : "São Cristóvão e Névis",
    "nomeAPI" : "St. Kitts & Nevis",
    "sigla" : "KN"
  },
  { "gentilico" : "são-martinhense",
    "nomePT" : "São Martim",
    "nomeAPI" : "Saint-Martin",
    "sigla" : "MF"
  },
  { "gentilico" : "são-martinhense",
    "nomePT" : "São Martinho",
    "nomeAPI" : "Sint-Maarten",
    "sigla" : "SX"
  },
  { "gentilico" : "são-tomense",
    "nomePT" : "São Tomé e Príncipe",
    "nomeAPI" : "São Tomé & Príncipe",
    "sigla" : "ST"
  },
  { "gentilico" : "sao-vicentino",
    "nomePT" : "São Vicente e Granadinas",
    "nomeAPI" : "St.-Vincent-Grenadines",
    "sigla" : "VC"
  },
  { "gentilico" : "senegalesa",
    "nomePT" : "Senegal",
    "nomeAPI" : "Senegal",
    "sigla" : "SN"
  },
  { "gentilico" : "leonesa",
    "nomePT" : "Serra Leoa",
    "nomeAPI" : "Sierra Leone",
    "sigla" : "SL"
  },
  { "gentilico" : "sérvia",
    "nomePT" : "Sérvia",
    "nomeAPI" : "Serbia",
    "sigla" : "RS"
  },
  { "gentilico" : "síria",
    "nomePT" : "Síria",
    "nomeAPI" : "Syria",
    "sigla" : "SY"
  },
  { "gentilico" : "somali",
    "nomePT" : "Somália",
    "nomeAPI" : "Somalia",
    "sigla" : "SO"
  },
  { "gentilico" : "cingalesa",
    "nomePT" : "Sri Lanka",
    "nomeAPI" : "Sri-Lanka",
    "sigla" : "LK"
  },
  { "gentilico" : "suazi",
    "nomePT" : "Suazilândia",
    "nomeAPI" : "Swaziland",
    "sigla" : "SZ"
  },
  { "gentilico" : "sudanesa",
    "nomePT" : "Sudão",
    "nomeAPI" : "Sudan",
    "sigla" : "SD"
  },
  { "gentilico" : "sul-sudanês",
    "nomePT" : "Sudão do Sul",
    "nomeAPI" : "South Sudan",
    "sigla" : "SS"
  },
  { "gentilico" : "sueca",
    "nomePT" : "Suécia",
    "nomeAPI" : "Sweden",
    "sigla" : "SE"
  },
  { "gentilico" : "suíça",
    "nomePT" : "Suíça",
    "nomeAPI" : "Switzerland",
    "sigla" : "CH"
  },
  { "gentilico" : "surinamesa",
    "nomePT" : "Suriname",
    "nomeAPI" : "Suriname",
    "sigla" : "SR"
  },
  { "gentilico" : "svalbardense",
    "nomePT" : "Svalbard",
    "nomeAPI" : "Svalbard & Jan Mayen",
    "sigla" : "SJ"
  },
  { "gentilico" : "tadjique",
    "nomePT" : "Tadjiquistão",
    "nomeAPI" : "Tajikistan",
    "sigla" : "TJ"
  },
  { "gentilico" : "tailandesa",
    "nomePT" : "Tailândia",
    "nomeAPI" : "Thailand",
    "sigla" : "TH"
  },
  { "gentilico" : "taiwanês",
    "nomePT" : "Taiwan",
    "nomeAPI" : "Taiwan",
    "sigla" : "TW"
  },
  { "gentilico" : "tanzaniana",
    "nomePT" : "Tanzânia",
    "nomeAPI" : "Tanzania",
    "sigla" : "TZ"
  },
  { "gentilico" : "do território britânico do oceano índico",
    "nomePT" : "Território Britânico do Oceano índico",
    "nomeAPI" : "British Indian Ocean Territory",
    "sigla" : "IO"
  },
  { "gentilico" : "do territórios do sul da frança",
    "nomePT" : "Territórios do Sul da França",
    "nomeAPI" : "French Southern Territories",
    "sigla" : "TF"
  },
  { "gentilico" : "timorense",
    "nomePT" : "Timor-Leste",
    "nomeAPI" : "Timor-Leste",
    "sigla" : "TL"
  },
  { "gentilico" : "togolesa",
    "nomePT" : "Togo",
    "nomeAPI" : "Togo",
    "sigla" : "TG"
  },
  { "gentilico" : "tonganesa",
    "nomePT" : "Tonga",
    "nomeAPI" : "Tonga",
    "sigla" : "TO"
  },
  { "gentilico" : "trinitário-tobagense",
    "nomePT" : "Trinidad e Tobago",
    "nomeAPI" : "Trinidad-and-Tobago",
    "sigla" : "TT"
  },
  { "gentilico" : "tristanita",
    "nomePT" : "Tristão da Cunha",
    "nomeAPI" : "Tristan da Cunha",
    "sigla" : "TA"
  },
  { "gentilico" : "tunisiana",
    "nomePT" : "Tunísia",
    "nomeAPI" : "Tunisia",
    "sigla" : "TN"
  },
  { "gentilico" : "turcomana",
    "nomePT" : "Turcomenistão",
    "nomeAPI" : "Turkmenistan",
    "sigla" : "TM"
  },
  { "gentilico" : "turca",
    "nomePT" : "Turquia",
    "nomeAPI" : "Turkey",
    "sigla" : "TR"
  },
  { "gentilico" : "tuvaluana",
    "nomePT" : "Tuvalu",
    "nomeAPI" : "Tuvalu",
    "sigla" : "TV"
  },
  { "gentilico" : "ucraniana",
    "nomePT" : "Ucrânia",
    "nomeAPI" : "Ukraine",
    "sigla" : "UA"
  },
  { "gentilico" : "ugandense",
    "nomePT" : "Uganda",
    "nomeAPI" : "Uganda",
    "sigla" : "UG"
  },
  { "gentilico" : "uruguaia",
    "nomePT" : "Uruguai",
    "nomeAPI" : "Uruguay",
    "sigla" : "UY"
  },
  { "gentilico" : "uzbeque",
    "nomePT" : "Uzbequistão",
    "nomeAPI" : "Uzbekistan",
    "sigla" : "UZ"
  },
  { "gentilico" : "vanuatuense",
    "nomePT" : "Vanuatu",
    "nomeAPI" : "Vanuatu",
    "sigla" : "VU"
  },
  { "gentilico" : "vaticano",
    "nomePT" : "Vaticano",
    "nomeAPI" : "Vatican-City",
    "sigla" : "VA"
  },
  { "gentilico" : "venezuelana",
    "nomePT" : "Venezuela",
    "nomeAPI" : "Venezuela",
    "sigla" : "VE"
  },
  { "gentilico" : "vietnamita",
    "nomePT" : "Vietnã",
    "nomeAPI" : "Vietnam",
    "sigla" : "VN"
  },
  { "gentilico" : "wallis-futunense",
    "nomePT" : "Wallis e Futuna",
    "nomeAPI" : "Wallis & Futuna",
    "sigla" : "WF"
  },
  { "gentilico" : "zambiana",
    "nomePT" : "Zâmbia",
    "nomeAPI" : "Zambia",
    "sigla" : "ZM"
  },
  { "gentilico" : "zimbabuana",
    "nomePT" : "Zimbábue",
    "nomeAPI" : "Zimbabwe",
    "sigla" : "ZW"
  }
]
