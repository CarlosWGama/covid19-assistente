import { Component, OnInit } from '@angular/core';
import { Chat } from './modulos/chat';
import { Opcao } from 'src/app/models/opcao';
import * as moment from 'moment';
import { EstatisticaModulo } from './modulos/estatistica';

export class MainPage extends EstatisticaModulo implements OnInit {

  async ngOnInit() {
    // await this.adicionarFala('Olá meu nome é BOB! Sou um assistente virtual que o ajudará a tirar algumas duvidas sobre o COVID-19. Primeiro, deixe-me saber qual é o seu nome!');
    // this.interagir('texto', this.apresentar.bind(this));
    this.oQueGostariaSaber();
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
}
