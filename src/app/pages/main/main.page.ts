import { Component, OnInit } from '@angular/core';
import { Opcao } from 'src/app/models/opcao';
import { BotFaces } from 'src/app/models/bot-faces';
import { Covid19Modulo } from './modulos/covid19';

@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPage extends Covid19Modulo implements OnInit {

  readonly VERSAO = '1.0.1';

  async ngOnInit() {
    this.nomeUsuario = await this.usuarioService.getUsuario();

    //Primeiro acesso
    if (!this.nomeUsuario) {
      await this.adicionarFala('Olá meu nome é Bot-Covid-Camsec-01, mas pode me chamar de Bot-CC1 mesmo! Sou um assistente virtual que o ajudará a tirar algumas dúvidas sobre o COVID-19. Primeiro, deixe-me saber qual é o seu nome!', BotFaces.FELIZ);
      this.interagir('texto', () => this.apresentar(), BotFaces.TRANQUILO);
    } else {
      //Usuário voltando a acessar
      await this.adicionarFala(`Olá ${this.nomeUsuario}! Fico feliz que tenha voltado.`, BotFaces.FELIZ);
      this.interagir('opcoes', [
        new Opcao(`Gostaria de algumas informações`, async () => {
          await this.adicionarFala('Gostaria de algumas informações', null, 'Você', false)
          this.oQueGostariaSaber()
        }),
        new Opcao(`Não sou ${this.nomeUsuario}`, () => this.alterarNome()),
      ]);
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
  async oQueGostariaSaber(face = BotFaces.NORMAL) {
    await this.adicionarFala(`O que você gostaria de saber agora?`);
    this.interagir('opcoes', [
      new Opcao('O que é COVID-19?', () => this.oQueECovid19()),
      new Opcao('Sintomas', () => this.sintomas()),
      new Opcao('Estatística', () => this.estatistica()),
      new Opcao('Locais de apoio', () => this.locaisApoio()),
      new Opcao('Quem é você?', () => this.creditos()),
    ], face)
  }

  async recursoAindaNaoDisponivel() {
    await this.adicionarFala('Ooops! Ainda não estou com essa função', BotFaces.TRISTE);
    this.oQueGostariaSaber();
  }

  /** Define os creditos do aplicativo */
  async creditos() {
    await this.adicionarFala('Fale-me um pouco sobre você!', null, 'Você', false);
    await this.adicionarFala(`Oh, fico feliz que você queira saber sobre mim! Bom, eu sou o Bot-Covid-Camsec-01 e estou na versão ${this.VERSAO}. Fui criado por Carlos junto ao Núcleo de Robótica e IA do CESMAC e em parceria com curso de Medicina e o Mestrado Profissional de Pesquisa em Saúde da instituição.`, BotFaces.FELIZ);
    await this.adicionarFala('A composição da minha base de dados das estatistícas é retirada de api-sports.io e minha aparência foi criada através de getavataaars.com', BotFaces.FELIZ);
    this.oQueGostariaSaber(BotFaces.FELIZ);
  } 
}
