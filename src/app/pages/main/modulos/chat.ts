import { Component, OnInit } from '@angular/core';
import { Opcao } from 'src/app/models/opcao';
import { InputTexto } from 'src/app/models/input-text';
import { UsuarioService } from 'src/app/services/usuario.service';
import { EstatisticasService } from 'src/app/services/estatisticas.service';
import { BotFaces } from 'src/app/models/bot-faces';

@Component({
  selector: 'app-main',
  templateUrl: './../main.page.html',
  styleUrls: ['./../main.page.scss'],
})
export abstract class Chat  {

  //Mensagens do Chat
  mensagens: {autor:string, fala: string, robo?:boolean}[] = []
  botFace:BotFaces = BotFaces.NORMAL;
  //Interação com o Chat
  interacao: {ativa: boolean, tipo: 'texto'|'opcoes'} = {ativa: false, tipo: 'texto'};
  input: InputTexto = new InputTexto();
  opcoes: Opcao[] = [];
  debug = false;
  //Usuario
  delay = 10;
  nomeUsuario = null;

  constructor(protected usuarioService: UsuarioService, public estatService:EstatisticasService) {}

  /** Adiciona uma fala da aplicação */
  protected async adicionarFala(fala: string, botFace:BotFaces=null, autor: string  = 'BOT', robo:boolean = true) {
    
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
  protected interagir(tipo: 'texto'|'opcoes', funcoes?: any, botFace = BotFaces.NORMAL) {
    this.botFace = botFace;

    this.interacao.ativa = true;
    this.interacao.tipo = tipo;
    
    if (this.interacao.tipo == 'texto')
      this.input = new InputTexto(funcoes)
    else 
      this.opcoes = funcoes;    
  }

  /** Pergunta Principal do que o usuário deseja fazer */
  async abstract oQueGostariaSaber();

}
