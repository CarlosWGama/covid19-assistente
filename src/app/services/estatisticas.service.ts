import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EstatisticasService {

  private headers = {
    'headers': {
      "x-rapidapi-host": "covid-19-coronavirus-statistics.p.rapidapi.com",
      "x-rapidapi-key": "f52157b401msh79f83a38192009fp1536e8jsndbbd37080694"
  }}

  constructor(private http: HttpClient) {}

  public async buscarEstatisticaPais(pais = 'Brazil') {
    return this.http.get('https://covid-19-coronavirus-statistics.p.rapidapi.com/v1/stats?country='+pais, this.headers)
          .toPromise().then(retorno => {
            const dados = {
              'mortes': retorno.data.covid19Stats[0].deaths,
              'confirmados': retorno.data.covid19Stats[0].confirmed,
              'recuperados': retorno.data.covid19Stats[0].recovered,
              'ultima_atualizacao': retorno.data.covid19Stats[0].lastUpdate
            }
            return dados;
          })
  }
}
