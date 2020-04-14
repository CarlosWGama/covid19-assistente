import { Opcao } from 'src/app/models/opcao';
import { BotFaces } from 'src/app/models/bot-faces';
import { EstatisticaModulo } from './estatistica';

export abstract class LocaisApoioModulo extends EstatisticaModulo {

  //================================= ESTATISTICAS
  async locaisApoio() {
      await this.adicionarFala('Gostaria de saber sobre locais de apoio', null, 'Você', false);
      await this.adicionarFala(`Então ${this.nomeUsuario}, caso possua alguns sintomas do COVID-19, o ideal é que fique isolado em casa e não precisa se preocupar muito`, BotFaces.TRANQUILO);
      await this.adicionarFala('O processo de quarentena é ideal para você não contrair ou até mesmo passar vírus para outras pessoas, que podem ser mais sensíveis', BotFaces.TRANQUILO);
      await this.adicionarFala('Mas caso esteja com falta de ar e passando muito mal, você deve procurar apoio em algum hospital ou clínica para fazer o teste do COVID-19', BotFaces.SERIO);
      this.getLocaisApoio()
  }

  async getLocaisApoio() {
    await this.adicionarFala('Deseja buscar por hospitais ou clínica próximas atrás de apoio?', BotFaces.SERIO);
    this.interagir('opcoes', [
        new Opcao('Hospitais', () => this.abrirLocal('hospital')),
        new Opcao('Clínicas', () => this.abrirLocal('laboratorio')),
        new Opcao('Não desejo buscar local', async () => {
            await this.adicionarFala('Não desejo buscar locais, obrigado!', null, 'Você', false);
            this.oQueGostariaSaber()
        }),
    ])
  }

  async abrirLocal(local) {
    window.open('https://maps.google.com?q='+local);
  }

}
