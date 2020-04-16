import { Component, OnInit, Injectable } from '@angular/core';
import { Opcao } from 'src/app/models/opcao';
import { InputTexto } from 'src/app/models/input-text';
import { UsuarioService } from 'src/app/services/usuario.service';
import { EstatisticasService } from 'src/app/services/estatisticas.service';
import { BotFaces } from 'src/app/models/bot-faces';
import { Platform } from '@ionic/angular';

@Injectable()
export abstract class Chat  {

  //Mensagens do Chat
  mensagens: {autor:string, fala: string, robo?:boolean}[] = []
  botFace:BotFaces = BotFaces.NORMAL;
  //Interação com o Chat
  interacao: {ativa: boolean, tipo: 'aberta'|'opcoes'} = {ativa: false, tipo: 'aberta'};
  inputType:'text'|'number' = 'text';
  input: InputTexto = new InputTexto();
  opcoes: Opcao[] = [];
  debug = false;
  //Usuario
  delay = 20;
  nomeUsuario = null;
  contato = null;
  botaoPanico: boolean = false;
  browser: boolean = false;

  constructor(protected usuarioService: UsuarioService, public estatService:EstatisticasService, private platform: Platform) {
    this.browser = (document.URL.startsWith('http://covid'));
  }

  /** Adiciona uma fala da aplicação */
  protected async adicionarFala(fala: string, botFace:BotFaces=null, autor: string  = 'Bot-CC1', robo:boolean = true) {
    
    if (botFace != null) this.botFace = botFace;

    this.interacao.ativa = false;
    //Adiciona fala
    this.mensagens.push({autor, fala:'', robo});
    const index = this.mensagens.length-1;
    for (var i = 0; i < fala.length; i++) {
      this.mensagens[index].fala += fala.charAt(i);
      await new Promise(resolve => setTimeout(() => resolve(), this.delay))
    }
    
    //Remove mensagens antigas
    if (this.mensagens.length > 5) this.mensagens.shift();
    
  }
  
  /** Habilita a interação */
  protected interagir(tipo: 'texto'|'numerico'|'opcoes', funcoes?: any, botFace = BotFaces.NORMAL) {
    this.botFace = botFace; 
    this.inputType = (tipo == 'numerico' ? 'number' : 'text');


    this.interacao.ativa = true;
    this.interacao.tipo = (tipo == 'opcoes' ? 'opcoes' : 'aberta');
    
    if (this.interacao.tipo == 'aberta')
      this.input = new InputTexto(funcoes)
    else 
      this.opcoes = funcoes;    
  }

  /** Pergunta Principal do que o usuário deseja fazer */
  async abstract oQueGostariaSaber()

}
