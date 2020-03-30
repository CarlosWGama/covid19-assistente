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
    await this.adicionarFala(`Olá, ${this.nomeUsuario}.  O que você gostaria de saber agora?`);
    this.interagir('opcoes', [
      new Opcao('Estatistica', () => console.log('aaa')),
      new Opcao('Sintomas', () => console.log('bbb')),
      new Opcao('Notícias', () => console.log('ccc')),
    ])

  }

}
