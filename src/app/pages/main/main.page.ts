import { Component, OnInit } from '@angular/core';
import { Chat } from './chat';
import { Opcao } from 'src/app/models/opcao';

export class MainPage extends Chat implements OnInit {

  async ngOnInit() {
    await this.adicionarFala('Olá meu nome é BOB! Sou um assistente virtual que o ajudará a tirar algumas duvidas sobre o COVID-19. Primeiro, deixe-me saber qual é o seu nome!');
    this.interagir('texto', this.apresentar.bind(this));
  }

  // ================================================= INTERAÇÕES ==========================================//

  /** Possíveis interações */
  async apresentar() {
    this.interacao.ativa = false;
    this.nomeUsuario = this.input.texto;
    await this.adicionarFala(this.nomeUsuario, 'Você', false);
    this.oQueGostariaSaber();
  }

  async oQueGostariaSaber() {
    await this.adicionarFala(`Olá, ${this.nomeUsuario}.  O que você gostaria de saber agora?`);
    this.interagir('opcoes', [
      new Opcao('Estatistica', () => this.estatistica()),
      new Opcao('Sintomas', () => console.log('bbb')),
      new Opcao('Notícias', () => console.log('ccc')),
    ])
  }


  //================================= ESTATISTICAS
  async estatistica() {
    await this.adicionarFala(`Estátistica`, 'Você', false);
    await this.adicionarFala(`Aguarde um pouco, estou buscando umas informações`);
    const dados = await this.estatService.buscarEstatisticaPais();
    console.log(dados);
    await this.adicionarFala(`No Brasil atualmente temos ${dados.confirmados} confirmados, ${dados.recuperados} recuperados e ${dados.mortes} mortes`)
    await this.adicionarFala(`Deseja saber de algum outro país?`)
    this.interagir('opcoes', [
      new Opcao('Sim', () => this.perguntarPaisEstatistica()),
      new Opcao('Não', () => this.oQueGostariaSaber())
    ])
  }

  //Pergunta qual pais gostaria saber a estatistica
  async perguntarPaisEstatistica() {
    await this.adicionarFala(`Gostaria de saber de outros países`, 'Você', false);
    await this.adicionarFala(`Qual país você gostaria de saber?`);
    this.interagir('texto', () => { this.buscarEstatisticaPais() })
  }

  //Busca dados do pais
  async buscarEstatisticaPais() {
    const pais = this.input.texto;
    await this.adicionarFala(pais, 'Você', false);
    await this.adicionarFala(`Aguarde um pouco, estou buscando as informações`);
    const dados = await this.estatService.buscarEstatisticaPais(pais);
    console.log(dados);
    await this.adicionarFala(`Em ${pais} atualmente temos ${dados.confirmados} confirmados, ${dados.recuperados} recuperados e ${dados.mortes} mortes`)
    await this.adicionarFala(`Deseja saber de algum outro país?`)
    this.interagir('opcoes', [
      new Opcao('Sim', () => this.perguntarPaisEstatistica()),
      new Opcao('Não', () => this.oQueGostariaSaber())
    ])
  }

}
