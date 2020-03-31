import { Component, OnInit } from '@angular/core';
import { Chat } from './chat';
import { Opcao } from 'src/app/models/opcao';
import * as moment from 'moment';
import { BotFaces } from 'src/app/models/bot-faces';

export abstract class EstatisticaModulo extends Chat {

  //================================= ESTATISTICAS
  /** Informa os dados do Mundo e pergunta se quer saber de outro país */
  async estatistica() {
    await this.adicionarFala(`Estátistica`, null, 'Você', false);
    await this.adicionarFala(`Aguarde um pouco, estou buscando umas informações`, BotFaces.PENSANDO);
    const dados = await this.estatService.buscarEstatisticaPais();
    console.log(dados);
    await this.adicionarFala(`No dia ${this.fData(dados.ultima_atualizacao)}, o mundo apresenta ${dados.confirmados} confirmados, ${dados.recuperados} recuperados e ${dados.mortes} mortes. Só no dia de hoje foram ${dados.confirmadosNovos} casos e ${dados.mortesNovas} mortes`)
    await this.adicionarFala(`Deseja saber mais alguma estatística?`)
    this.interagir('opcoes', [
      new Opcao('De um país', () => this.perguntarPaisEstatistica()),
      new Opcao('De uma semana atrás', () => this.estatisticaSemanaPassada('All')),
      new Opcao('Não', () => this.oQueGostariaSaber())
    ])
  }

  /** Pergunta qual pais gostaria saber a estatistica **/
  async perguntarPaisEstatistica() {
    await this.adicionarFala(`Gostaria de saber de outros países`, null, 'Você', false);
    await this.adicionarFala(`Qual país você gostaria de saber?`);
    this.interagir('texto', () => { this.buscarEstatisticaPais() })
  }

  /** Busca dados do país **/
  async buscarEstatisticaPais(pais?) {
    
    //Se pais não foi informado por botão, recupera no texto
    if (!pais) pais = this.input.texto;
    
    await this.adicionarFala(pais, null, 'Você', false);
    await this.adicionarFala(`Aguarde um pouco, estou buscando as informações`, BotFaces.PENSANDO);

    const encontrouPais = this.estatService.buscarPais(pais);

    //O país buscado existe
    if (encontrouPais.achou) {
      const dados = await this.estatService.buscarEstatisticaPais(pais);
      if (dados) //Encontrou dados do país
        await this.adicionarFala(`Em ${pais}, no último dado coletado (${this.fData(dados.ultima_atualizacao)}), temos ${dados.confirmados} (${dados.confirmadosNovos}) confirmados, ${dados.recuperados} recuperados e ${dados.mortes} (${dados.mortesNovas}) mortes`)
      else
        await this.adicionarFala(`Não encontrei dados de ${pais}`)
    
      await this.adicionarFala(`Deseja saber mais dados estatísticos?`)
      this.interagir('opcoes', [
        new Opcao('De um país', () => this.perguntarPaisEstatistica()),
        new Opcao('De uma semana atrás', () => this.estatisticaSemanaPassada(pais)),
        
      ])
    } else {
      //O pais buscado não existe
      await this.adicionarFala(`Não encontrei o país ${pais}.`)

      //Mas existe pais com nome similar  
      if (encontrouPais.similares.length > 0) {
        await this.adicionarFala(`Talvez você esteja querendo dizer`)

        const opcoes = encontrouPais.similares.map(p => {
          return new Opcao(p, () => this.buscarEstatisticaPais(p))
        })
        opcoes.push(new Opcao('Nenhum desses', () => this.oQueGostariaSaber()))

        this.interagir('opcoes', opcoes)
      } else {
        this.oQueGostariaSaber()
      }
    }
    
  }

  /** Busca dados do pais na semana passada */
  async estatisticaSemanaPassada(pais) {
    await this.adicionarFala(`Como estava na semana passada?`, null, 'Você', false);
    await this.adicionarFala(`Huuum... Deixe me ver`);
    
    //Busca uma semana atrás
    let dia = moment().subtract(1, 'weeks').format('YYYY-MM-DD');
    const dados = await this.estatService.buscarEstatisticaPais(pais, dia);
    dia = moment(dia, 'YYYY-MM-DD').format('DD/MM/YYYY');

    await this.adicionarFala(`Em  ${dia}, tinhamos ${dados.confirmados} confirmados, ${dados.recuperados} recuperados e ${dados.mortes} mortes.`)
    await this.adicionarFala(`Deseja saber de algum outro país?`)
    this.interagir('opcoes', [
      new Opcao('um país', () => this.perguntarPaisEstatistica()),
      new Opcao('Não', () => this.oQueGostariaSaber())
    ])
  }

  /** Retorna data formadata no modelo DD/MM/YYYY */
  private fData(data) {
    return moment(data).format('DD/MM/YYYY')
  }

}