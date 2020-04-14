import { BotFaces } from 'src/app/models/bot-faces';
import { Opcao } from 'src/app/models/opcao';
import { PanicoModulo } from './panico';

export abstract class Covid19Modulo extends PanicoModulo {

  //================================= ESTATISTICAS
    async oQueECovid19() {
        await this.adicionarFala('Poderia falar um pouco sobre o COVID-19?', null, 'Você', false);
        await this.adicionarFala('Claro, deixe-me te ajudar. O COVID-19 foi descoberto em 31/12/2019 na China e faz parte da família de vírus Coronavírus, que é um grupo de vírus que ataca o sistema respiratório. Apesar da baixa mortalidade, seu contágio é alto!', BotFaces.TRANQUILO);
        this.perguntasCovid()
    }
    
    async perguntasCovid() {
        await this.adicionarFala('O que gostaria de saber?', BotFaces.TRANQUILO);
        this.interagir('opcoes', [
            new Opcao('Grupos de risco', () => this.grupoRisco()),
            new Opcao('Contágio', () => this.evitarContagio()),
            new Opcao('Quarentena', () => this.quarentena()),
            new Opcao('Nada', async () => {
                await this.adicionarFala('Entendi, obrigado!', null, 'Você', false)
                this.oQueGostariaSaber()
            }),
        ], BotFaces.TRANQUILO)
    }
    
    /** Fala sobre grupos de risco */
    async grupoRisco() {
        await this.adicionarFala('O que são os grupos de risco?', null, 'Você', false);  
        await this.adicionarFala('O vírus pode apresentar um risco maior para umas pessoas do que outras. Algumas pessoas mesmo podem até ter o vírus e não sentir nenhum sintoma.', BotFaces.SERIO);  
        await this.adicionarFala('Já para outros, seu contágio pode ser fatal. Quem apresenta mais risco são os idosos, fumantes, pessoas com problema respiratório como asma, hipertensos e diabéticos.', BotFaces.TRISTE);  
        this.perguntasCovid();
    }
    
    /** Fala sobre quarentena e isolamento */
    async quarentena() {
        await this.adicionarFala('Por que o povo está fazendo quarentena?', null, 'Você', false);   
        await this.adicionarFala('Isso acontece devido ao fato do COVID-19 possuir uma taxa muito alta de contágio. Se todo mundo continuar nas ruas normalmente, várias pessoas vão se infectar e os hospitais não terão capacidade de tratar todo mundo ao mesmo tempo, fora os demais problemas de saúde que as pessoas podem ter. Por isso é importante fazermos quarentena.', BotFaces.SERIO);  
        await this.adicionarFala(`Ah, e isolamento é diferente de quarentena. Você sabe a diferença dos dois, ${this.nomeUsuario}?`, BotFaces.SERIO);  
        this.interagir('opcoes', [
            new Opcao('Sim', async () => {
                await this.adicionarFala('Sim', null, 'Você', false);  
                await this.adicionarFala('Muito bem!', BotFaces.TRANQUILO);
                this.perguntasCovid();
            }),
            new Opcao('Não', async () => {
                await this.adicionarFala('Não', null, 'Você', false);  
                await this.adicionarFala('Na quaretena, você deve ficar em casa, mas pode ter contato com as pessoas de casa. Já o isolamento é apenas para apresentou sintomas ou está com o COVID-19. Nesse caso, a pessoa deve ser isolar e não ter contato com ninguém nem da casa, para não passar o vírus.', BotFaces.NORMAL)
                this.perguntasCovid()
            }),
        ], BotFaces.NORMAL)
    }
    
    /** Explica como evitar contagios */
    async evitarContagio() {
        await this.adicionarFala('Como evitar o contágio?', null, 'Você', false);   
        await this.adicionarFala(`Boa pergunta, ${this.nomeUsuario}! Para evitar o contágio você deve sempre lavar as mãos com água e sabão ou alcóol; evitar aglomeração, se possível fique em casa; manter ambientes abertos e ventilados; caso sinta vontade de tossir, cobra a boca e nariz com o braço e não compartilhe objetos pessoais como talheres e copos.`, BotFaces.FELIZ);   
        this.perguntasCovid();

    }
 
}
