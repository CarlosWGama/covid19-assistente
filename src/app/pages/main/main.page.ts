import { Component, OnInit } from '@angular/core';
import { Chat } from './modulos/chat';
import { Opcao } from 'src/app/models/opcao';
import * as moment from 'moment';
import { EstatisticaModulo } from './modulos/estatistica';
import { BotFaces } from 'src/app/models/bot-faces';

export class MainPage extends EstatisticaModulo implements OnInit {

  async ngOnInit() {
    this.nomeUsuario = await this.usuarioService.getUsuario();
    if (!this.nomeUsuario) {
      await this.adicionarFala('Olá meu nome é Bot-Covid-Camsec-01, mas pode me chamar de Bot memso! Sou um assistente virtual que o ajudará a tirar algumas dúvidas sobre o COVID-19. Primeiro, deixe-me saber qual é o seu nome!', BotFaces.FELIZ);
      this.interagir('texto', () => this.apresentar(), BotFaces.TRANQUILO);
    } else {
      await this.adicionarFala(`Olá ${this.nomeUsuario}! Fico feliz que tenha voltado.`, BotFaces.FELIZ);
      this.interagir('opcoes', [
        new Opcao(`Não sou ${this.nomeUsuario}`, () => this.alterarNome()),
        new Opcao(`Gostaria de algumas informações`, async () => {
          await this.adicionarFala('Gostaria de algumas informações', null, 'Você', false)
          this.oQueGostariaSaber()
        }),
      ]);
      //this.oQueGostariaSaber();
    }

  }

  // ================================================= INTERAÇÕES ==========================================//

  /** Recupera o nome do usuário */
  async apresentar() {
    this.interacao.ativa = false;
    this.nomeUsuario = this.input.texto;
    this.usuarioService.setUsuario(this.nomeUsuario);
    await this.adicionarFala(this.nomeUsuario, null, 'Você', false);
    await this.adicionarFala(`Olá, ${this.nomeUsuario}.`);
    this.oQueGostariaSaber();
  }

  /** Altera o nome do usuário */
  async alterarNome() {
    await this.adicionarFala(`Ahh, você não é ${this.nomeUsuario}? Peço minhas desculpas!`, BotFaces.ESPANTADO);
    await this.adicionarFala('Como posso chamá-lo então?', BotFaces.TRANQUILO);
    this.interagir('texto', () => this.apresentar(), BotFaces.TRANQUILO);
  }

  /** Pergunta Principal do que o usuário deseja fazer */
  async oQueGostariaSaber() {
    await this.adicionarFala(`O que você gostaria de saber agora?`);
    this.interagir('opcoes', [
      new Opcao('Estatistica', () => this.estatistica()),
      new Opcao('Sintomas', () => this.recursoAindaNaoDisponivel()),
      new Opcao('Notícias', () => this.recursoAindaNaoDisponivel()),
      new Opcao('Locais de apoio', () => this.recursoAindaNaoDisponivel()),
    ])
  }

  async recursoAindaNaoDisponivel() {
    await this.adicionarFala('Ooops! Ainda não estou com essa função', BotFaces.ESPANTADO);
    this.oQueGostariaSaber();
  }
}
