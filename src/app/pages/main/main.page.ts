import { Component, OnInit } from '@angular/core';
import { Chat } from './chat';
import { Opcao } from 'src/app/models/opcao';
import * as moment from 'moment';

export class MainPage extends Chat implements OnInit {

  async ngOnInit() {
    await this.adicionarFala('Olá meu nome é BOB! Sou um assistente virtual que o ajudará a tirar algumas duvidas sobre o COVID-19. Primeiro, deixe-me saber qual é o seu nome!');
    this.interagir('texto', this.apresentar.bind(this));
    
  }

  // ================================================= INTERAÇÕES ==========================================//

  /** Recupera o nome do usuário */
  async apresentar() {
    this.interacao.ativa = false;
    this.nomeUsuario = this.input.texto;
    await this.adicionarFala(this.nomeUsuario, 'Você', false);
    await this.adicionarFala(`Olá, ${this.nomeUsuario}.`);
    this.oQueGostariaSaber();
  }

  /** Pergunta Principal do que o usuário deseja fazer */
  async oQueGostariaSaber() {
    await this.adicionarFala(`O que você gostaria de saber agora?`);
    this.interagir('opcoes', [
      new Opcao('Estatistica', () => this.estatistica()),
      new Opcao('Sintomas', () => console.log('bbb')),
      new Opcao('Notícias', () => console.log('ccc')),
      new Opcao('Locais de apoio', () => console.log('ccc')),
    ])
  }


  //================================= ESTATISTICAS
  /** Informa os dados do Brasil e pergunta se quer saber de outro país */
  async estatistica() {
    await this.adicionarFala(`Estátistica`, 'Você', false);
    await this.adicionarFala(`Aguarde um pouco, estou buscando umas informações`);
    const dados = await this.estatService.buscarEstatisticaPais();
    await this.adicionarFala(`No dia de hoje, o mundo tem ${dados.confirmados} confirmados, ${dados.recuperados} recuperados e ${dados.mortes} mortes. Só no dia de hoje foram ${dados.confirmadosNovos} casos e ${dados.mortesNovas} mortes`)
    await this.adicionarFala(`Deseja saber mais alguma estatística?`)
    this.interagir('opcoes', [
      new Opcao('De um país', () => this.perguntarPaisEstatistica()),
      new Opcao('De uma semana atrás', () => this.estatisticaSemanaPassada('All')),
      new Opcao('Não', () => this.oQueGostariaSaber())
    ])
  }

  /** Pergunta qual pais gostaria saber a estatistica **/
  async perguntarPaisEstatistica() {
    await this.adicionarFala(`Gostaria de saber de outros países`, 'Você', false);
    await this.adicionarFala(`Qual país você gostaria de saber?`);
    this.interagir('texto', () => { this.buscarEstatisticaPais() })
  }

  /** Busca dados do país **/
  async buscarEstatisticaPais() {
    const pais = this.input.texto;
    await this.adicionarFala(pais, 'Você', false);
    await this.adicionarFala(`Aguarde um pouco, estou buscando as informações`);
    const dados = await this.estatService.buscarEstatisticaPais(pais);

    if (dados) //Encontrou
      await this.adicionarFala(`Em ${pais} atualmente temos ${dados.confirmados} (${dados.confirmadosNovos}) confirmados, ${dados.recuperados} recuperados e ${dados.mortes} (${dados.mortesNovas}) mortes`)
    else
      await this.adicionarFala(`Não encontrei dados de ${pais}`)
  
    await this.adicionarFala(`Deseja saber mais dados estatísticos?`)
    this.interagir('opcoes', [
      new Opcao('De um país', () => this.perguntarPaisEstatistica()),
      new Opcao('De uma semana atrás', () => this.estatisticaSemanaPassada(pais)),
      new Opcao('Não', () => this.oQueGostariaSaber())
    ])
  }

  /** Busca dados do pais na semana passada */
  async estatisticaSemanaPassada(pais) {
    await this.adicionarFala(`Como estava na semana passada?`, 'Você', false);
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

}
