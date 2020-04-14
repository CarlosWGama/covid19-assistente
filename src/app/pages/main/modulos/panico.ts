import { BotFaces } from 'src/app/models/bot-faces';
import { Opcao } from 'src/app/models/opcao';
import { SintomasModulo } from './sintomas';

export abstract class PanicoModulo extends SintomasModulo {


    //================================= SINTOMAS FLUXOS DESCENDO
    async panico() {
        if (!this.contato) 
            this.semcontato();
        else {
            await this.adicionarFala(`${this.nomeUsuario}, você clicou no botão de pânico. Quer que eu envie uma solicitação de ajuda para seu contato cadastrado (${this.contato})?`, BotFaces.SERIO);
            this.interagir('opcoes', [
                new Opcao('Sim', async () => {
                    await this.adicionarFala('Sim, Estou em perigo!', null, 'Você', false);
                    this.enviandoSMS()
                }),
                new Opcao('Não', async () => {
                    await this.adicionarFala('Não precisa, obrigado!', null, 'Você', false);
                    this.oQueGostariaSaber()
                })
            ], BotFaces.PENSANDO)
        }
    }

    /** INFORMA QUE O USUÀRIO NÃO POSSUI CONTATO CADASTRADO */
    async semcontato() {
        await this.adicionarFala(`${this.nomeUsuario}, você ainda não tem um contato para se comunicar em caso de pânico. Esse tipo de contato serve para caso esteja em pânico, sem ar, sem conseguir falar, poderá enviar um SMS com sua localização atual para essa pessoa. Deseja cadastrar um contato em caso pânico? `, BotFaces.ESPANTADO);

        this.interagir('opcoes', [
            new Opcao('Sim', async () => {
                await this.adicionarFala('Sim, por favor!', null, 'Você', false);
                await this.adicionarFala('Ótimo!', BotFaces.FELIZ);
                this.cadastrarContato()
            }),
            new Opcao('Não', async () => {
                await this.adicionarFala('Não precisa, obrigado!', null, 'Você', false);
                this.oQueGostariaSaber()
            })
        ], BotFaces.TRANQUILO)
    }

    /** SOLICITA NUMERO DO CONTATO PARA CAADASTRO*/
    async cadastrarContato() {
        await this.adicionarFala(`Informe o telefone do seu contato para eu salvar a informação.`, BotFaces.FELIZ);
        this.interagir('numerico', () => this.confirmaSalvar())
    }

    /** CONFIRMA CADASTRO */
    async confirmaSalvar() {
        const contato = this.input.texto;
        await this.adicionarFala(`Poderia confirmar se o telefone do seu contato é ${contato}?`, BotFaces.TRANQUILO);

        this.interagir('opcoes', [
            new Opcao('Sim', async () => {
                this.botaoPanico = true;
                this.contato = contato;
                this.usuarioService.setContato(contato);
                await this.adicionarFala('Sim, esse mesmo!', null, 'Você', false);
                await this.adicionarFala('Pronto, o telefone está salvo para caso precise de ajuda futura. Basta clicar na opção Pânico na parte superior!', BotFaces.FELIZ);
                this.oQueGostariaSaber()
            }),
            new Opcao('Não, informar outro', async () => {
                await this.adicionarFala('Não, me enganei!', null, 'Você', false);
                this.cadastrarContato()
            }),
            new Opcao('Não cadastrar', async () => {
                this.botaoPanico = true;
                await this.adicionarFala('Não quero cadastrar no momento!', null, 'Você', false);
                this.oQueGostariaSaber()
            })
        ], BotFaces.PENSANDO)
    }

    /** Envia SMS para o contato */
    async enviandoSMS() {
        await this.adicionarFala('Estou agora mesmo enviando uma mensagem para seu contato. Aguarde!', BotFaces.SERIO);
        const sucesso = await this.usuarioService.enviarSMS();
        if (sucesso) 
            await this.adicionarFala('Um SMS com sua localização foi enviado. Tente ficar calmo, enquanto aguarda por ajuda', BotFaces.SERIO);
        else 
            await this.adicionarFala('Infelizmente não consegui enviar sua mensagem de ajuda. Tente ficar calma, enquanto busca por ajuda', BotFaces.TRISTE);
        
        this.oQueGostariaSaber(); 
    }

}

