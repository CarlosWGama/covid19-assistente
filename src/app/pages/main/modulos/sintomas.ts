import { BotFaces } from 'src/app/models/bot-faces';
import { LocaisApoioModulo } from './locais-apoio';
import { Opcao } from 'src/app/models/opcao';

export abstract class SintomasModulo extends LocaisApoioModulo {

    private analiseSintomas = {
        tosse: false,
        sintomasSecundarios: false,
        febre: false,
        febreDuradora: false,
        dificuldadeRespirar: false,
        locaisContagios: false,
        idade:0,
        fumante:false,
        asma: false,
        hipertensoDiabetico: false,
    }

    //================================= SINTOMAS FLUXOS DESCENDO
    async sintomas() {
        await this.adicionarFala('Quais são os sintomas do COVID-19?', null, 'Você', false);
        await this.adicionarFala('Os principais sintomas são dor de garganta, tosse e principalmente febre e dificuldade na respiração', BotFaces.NORMAL);
        this.perguntarSintomas()
    }

    /** Pergunta se o usuário tem sintomas */
    async perguntarSintomas() {
        await this.adicionarFala('Se você desejar, eu posso fazer uma breve avaliação se você apresenta sintomas de risco. Lembrando que essa análise não é precisa, mas pode te poupar de buscar um especialista sem necessidade.', BotFaces.TRANQUILO);

        this.interagir('opcoes', [
            new Opcao('Sim', () => this.iniciarPerguntas()),
            new Opcao('Não', async () => {
                await this.adicionarFala('Não precisa, obrigado!', null, 'Você', false);
                this.oQueGostariaSaber()
            })
        ], BotFaces.TRANQUILO)
    }

    /** Inicia as perguntas do sintomas 
     * próximos: respostaTosse()
    */
    async iniciarPerguntas() {
        await this.adicionarFala('Gostaria de fazer uma breva análise!', null, 'Você', false);
        await this.adicionarFala(`Muito bem, ${this.nomeUsuario}, bora lá!`, BotFaces.TRANQUILO);
        await this.adicionarFala(`Você tem apresentado tosse esses dias?`, BotFaces.TRANQUILO);
        this.interagir('opcoes', [
            new Opcao('Sim', () => this.respostaTosse(true)),
            new Opcao('Não', () => this.respostaTosse(false))
        ]);
    }

    /** Coleta idade e pergunta 
     * próximos: 
     * - perguntaFebre: caso não tenha tosse
     * - perguntaSintomasSecundarios: caso tenha tosse 
     */
    async respostaTosse(tosse) {
        //Recupera dados
        await this.adicionarFala((tosse? 'Sim': 'Não'), null, 'Você', false);
        this.analiseSintomas.tosse = tosse;
        if (!this.analiseSintomas.tosse) {
            await this.adicionarFala('Opa, já começamos com uma  boa notícia!', BotFaces.FELIZ);
            this.perguntaFebre();
        } else {
            await this.adicionarFala('Entendi! Muitas coisas podem causar tosse, principalmente nesses dias. Vamos para a próxima pergunta', BotFaces.PENSANDO)
            this.perguntaSintomasSecundarios();
        }
    }

    /** Pergunta sobre coriza, cansaço ou dor de garganta 
     * próximo: respostaSintomasSecundarios()
    */
    async perguntaSintomasSecundarios() {
        await this.adicionarFala('Já que tem apresentado tosse, você também tem apresentado sintomas como dor de garganta, cabeça, coriza ou cansaço?')
        this.interagir('opcoes', [
            new Opcao('Sim', () => this.respostaSintomasSecundarios(true)),
            new Opcao('Não', () => this.respostaSintomasSecundarios(false))
        ]);
    }

    /**
     * Pergunta sintomas secundarios
     * proximo: perguntaFebre()
     * @param sintomasSecundarios boolean
     */
    async respostaSintomasSecundarios(sintomasSecundarios: boolean) {
        this.analiseSintomas.sintomasSecundarios = sintomasSecundarios;
        await this.adicionarFala((sintomasSecundarios? 'Sim': 'Não'), null, 'Você', false);

        if (sintomasSecundarios) 
            await this.adicionarFala('Esses são alguns sintomas que podem ser comuns também em gripes ou resfriados', BotFaces.NORMAL);
        
        this.perguntaFebre();
    }

    /**
     * Pergunta se o paciente apresenta sintomas de Febre
     * proximo: respostaFebre()
     */
    async perguntaFebre() {
        await this.adicionarFala('Continuando nossas perguntas, você tem apresentado sinal de febre?', BotFaces.NORMAL);
    
        this.interagir('opcoes', [
            new Opcao('Sim', () => this.respostaFebre(true)),
            new Opcao('Não', () => this.respostaFebre(false))
        ]);
    
    }

    /**
     * Coleta informações de febre
     * proximos:
     * - perguntaFebreDuracao: Caso apresente febre
     * - perguntaDificuldadeRespirar: Caso não apresente febre
     * @param febre 
     */
    async respostaFebre(febre: boolean) {
        this.analiseSintomas.febre = febre;
        await this.adicionarFala((febre? 'Sim': 'Não'), null, 'Você', false);

        if (febre) {
            await this.adicionarFala('Opa, precisamos ter um pouco mais de cuidado! Vamos saber um pouco mais sobre essa febre', BotFaces.TRISTE);
            this.perguntarFebreDuracao();
        } else {
            await this.adicionarFala('Muito bom! Mas ainda precisamos analisar mais alguns sintomas importantes!', BotFaces.FELIZ)
            this.perguntarDificuldadeRespirar();
        }
    }

    /**
     * Pergunta se a febre tem durado mais de 3 dias
     * proximo: respostaFebreDuracao
     */
    async perguntarFebreDuracao() {
        await this.adicionarFala('Essa sua febre tem durado por mais de 3 dias?', BotFaces.NORMAL);
    
        this.interagir('opcoes', [
            new Opcao('Sim', () => this.respostaFebreDuracao(true)),
            new Opcao('Não', () => this.respostaFebreDuracao(false))
        ]);
    }

    /**
     * COleta a duração da febre
     * proximos:
     * - perguntarFebreRecorrente: Caso febre duradora
     * @param febreDuracao 
     */
    async respostaFebreDuracao(febreDuracao: boolean) {
        this.analiseSintomas.febreDuradora = febreDuracao;
        await this.adicionarFala((febreDuracao? 'Sim': 'Não'), null, 'Você', false);

        if (!febreDuracao) 
            await this.adicionarFala('Vejo que o sintoma já desapareceu!', BotFaces.FELIZ)
        
        this.perguntarDificuldadeRespirar();
    }

    /**
     * Pergunta se a pessoa está com dificuldade de respirar
     * proximo: respostaDificuldadeRespirar()
     */
    async perguntarDificuldadeRespirar() {
        await this.adicionarFala('Você tem apresentando dificuldade de respirar? Lembre-se que não é nariz entupido, mas sim dificuldade de puxar o ar para os pulmões.', BotFaces.NORMAL);
    
        this.interagir('opcoes', [
            new Opcao('Sim', () => this.respostaDificuldadeRespirar(true)),
            new Opcao('Não', () => this.respostaDificuldadeRespirar(false))
        ]);
    }

    /**
     * Coleta os dados de Dificuldade de respiração do paciente
     * @param dificuldadeRespirar 
     */
    async respostaDificuldadeRespirar(dificuldadeRespirar: boolean) {
        this.analiseSintomas.dificuldadeRespirar = dificuldadeRespirar;
        await this.adicionarFala((dificuldadeRespirar? 'Sim': 'Não'), null, 'Você', false);

        if (!dificuldadeRespirar) 
            await this.adicionarFala('Esse é um dos mais perigosos sintomas do COVID-19, como você não tem, fique mais tranquilo, pois mesmo que possui COVID-19, pode não desenvolver esse sintoma e não precisa ir ao hospital', BotFaces.FELIZ)
        else 
            await this.adicionarFala('Esse pode ser um sintoma de risco do COVID-19, o qual pode ser preciso fazer alguma análise mais detalhada', BotFaces.TRISTE)
        
        if (this.analiseSintomas.febre || this.analiseSintomas.dificuldadeRespirar)
            this.perguntarLocaisContagio();
        else
            this.perguntarIdade();
    }

    /**
     * Recupera informações de possíveis contagios
     * proximo: respostaLocaisContagis()
     */
    async perguntarLocaisContagio() {
        await this.adicionarFala('Você teve contato ou esteve em alguma cidade nos últimos 14 dias com pessoas afetadas pelo COVID-19?', BotFaces.NORMAL);
    
        this.interagir('opcoes', [
            new Opcao('Sim', () => this.respostaLocaisContagio(true)),
            new Opcao('Não', () => this.respostaLocaisContagio(false))
        ]);
    }

    /**
     * Coleta informações de locais de contagios
     * @param locaisContagios 
     */
    async respostaLocaisContagio(locaisContagios: boolean) {
        this.analiseSintomas.locaisContagios = locaisContagios;
        await this.adicionarFala((locaisContagios? 'Sim': 'Não'), null, 'Você', false);

        if (locaisContagios)
            await this.adicionarFala('Isso pode não ser muito bom', BotFaces.ESPANTADO);
        else
            await this.adicionarFala('Caso não viajou, na sua cidade não tem e não teve contato, pode ficar mais tranquilo', BotFaces.FELIZ);
        if (locaisContagios) 
            this.perguntarIdade();
        else 
            this.analisandoSintomas()
    }

    /** 
     * Pergunta sobre a idade do paciente
     * proximo: respostaIdade()
     */
    async perguntarIdade() {
        await this.adicionarFala(`Desculpe ser indiscreto, mas qual a sua idade? Isso ajudará a minha análise`, BotFaces.TRANQUILO);
        this.interagir('numerico', () => this.respostaIdade())
    }

    /**
     * Coleta resposta de idade
     * proximos: perguntarFumante()
     */
    async respostaIdade() {
        this.analiseSintomas.idade = Number(this.input.texto);

        if (this.analiseSintomas.idade >= 60) 
            await this.adicionarFala('Opa, já chegou na melhor idade!', BotFaces.FELIZ)
        else if (this.analiseSintomas.idade >= 30)
            await this.adicionarFala('Eita, fase boa!', BotFaces.FELIZ)
        else
            await this.adicionarFala('Ainda é bem novinho(a)! Só não é mais que eu, que tenho apenas alguns dias de vida!', BotFaces.FELIZ)

        this.perguntarFumante();
    }

    
    /**
     * Pergunta se o usuário fuma
     * proximos: respostaFumante()
     */
    async perguntarFumante() {
        await this.adicionarFala(`Agora vamos para uma pergunta séria, sobre você, ${this.nomeUsuario}! Por acaso, você fuma?`, BotFaces.SERIO);
        this.interagir('opcoes', [
            new Opcao('Sim', () => this.respostaFumante(true)),
            new Opcao('Não', () => this.respostaFumante(false))
        ]);
    }

    /**
     * Coleta dados se o usuário fuma
     * proximos: perguntarAsma()
     */
    async respostaFumante(fumante:boolean) {
        this.analiseSintomas.fumante = fumante;
        await this.adicionarFala((fumante? 'Sim': 'Não'), null, 'Você', false);

        if (fumante) 
            await this.adicionarFala(`Isso não é algo legal para você, ${this.nomeUsuario}. Tente mudar esse hábito, do contrário isso vai te prejudicar, cedo ou tarde.`, BotFaces.TRISTE)
        else 
            await this.adicionarFala(`Muito bem, ${this.nomeUsuario}! Continue assim, sem fumar!`, BotFaces.FELIZ)
    
        this.perguntarAsma();
    }

    /**
     * Pergunta se o usuário tem asma
     * proximos: respostaAsma()
     */
    async perguntarAsma() {
        await this.adicionarFala(`Outra dúvida, você possui problema de respiração, como asma?`, BotFaces.SERIO);
        this.interagir('opcoes', [
            new Opcao('Sim', () => this.respostaAsma(true)),
            new Opcao('Não', () => this.respostaAsma(false))
        ]);
    }

    /**
     * Coleta dados se o usuário tem asma
     * proximos: respostaAsma()
     */
    async respostaAsma(asma: boolean) {
        this.analiseSintomas.asma = asma;
        await this.adicionarFala((asma? 'Sim': 'Não'), null, 'Você', false);

        if (asma) { 
            if (this.analiseSintomas.fumante)
                await this.adicionarFala(`Ter asma e furmar é algo que não combina, mas um motivo para mudar esse habito`, BotFaces.TRISTE)
            else
                await this.adicionarFala(`Para quem tem asma, nesses dias todo cuidado deve ser redobrado!`, BotFaces.SERIO)

        } else 
            await this.adicionarFala(`Certo, certo!`, BotFaces.FELIZ)

        this.perguntarHipertensoOuDiabetico();
    }

    /**
     * Pergunta se o usuário tem hipertensão ou é o diabetico
     * proximos: respostaHipertensoOuDiabetico()
     */
    async perguntarHipertensoOuDiabetico() {
        await this.adicionarFala(`Vamos a nossa última pergunta, antes da análise. Você é hipertenso ou diabético?`, BotFaces.SERIO);
        this.interagir('opcoes', [
            new Opcao('Sim', () => this.respostaHipertensoOuDiabetico(true)),
            new Opcao('Não', () => this.respostaHipertensoOuDiabetico(false))
        ]);
    }   

    /**
     * Coleta dados se o usuário tem hipertensão ou é o diabetico
     * proximos: analisandoSintomas()
     */
    async respostaHipertensoOuDiabetico(hipertensoDiabetico: boolean) {
        this.analiseSintomas.hipertensoDiabetico = hipertensoDiabetico;
        await this.adicionarFala((hipertensoDiabetico? 'Sim': 'Não'), null, 'Você', false);
        await this.adicionarFala(`Entendi. Vamos a análise agora!`, BotFaces.SERIO)
        this.analisandoSintomas();
    }

    /**
     * Realiza uma analise dos sintomas do paciente
     */
    async analisandoSintomas() {
        //Alguns outros sintomas podem surgir como dor de garganta, dores de cabeça ou cansaço.
        if (this.analiseSintomas.febre && this.analiseSintomas.dificuldadeRespirar) {
            if (this.analiseSintomas.locaisContagios) {
                //Possui febre e dificuldade de respirar
                if (this.analiseSintomas.idade >= 60 || this.analiseSintomas.hipertensoDiabetico || this.analiseSintomas.asma)  //Grupo de Risco
                    await this.adicionarFala(`Você tem apresentado febre e dificuldade de respirar, além de talvez ter tido contato com alguém afetado, o que é preocupante. Como você está no grupo de risco, recomendo procurar ajuda de um profissional para realizar o teste para COVID-19.`, BotFaces.SERIO)
                else //Não é grupo de risco
                    await this.adicionarFala(`Você tem apresentado febre e dificuldade de respirar, além de talvez ter tido contato com alguém afetado, o que é preocupante. É interessante considerar procurar um ajuda profissional para realizar o teste para COVID-19, principalmente se o sintoma estiver durando.`, BotFaces.SERIO)
                this.interagir('opcoes', [
                    new Opcao('AJUDA', () => this.locaisApoio()),
                    new Opcao('ESTOU BEM', () => this.oQueGostariaSaber())
                ]);
            } else { //Não risco de COVID-19
                await this.adicionarFala(`Como você não teve contato com pessoas ou ambientes que podem estar afetados, fique tranquilo quanto ao COVID-19. Mas caso os sintomas persistem, procure um ajuda profissional para saber a causa.`, BotFaces.SERIO) 
                this.oQueGostariaSaber();
            }
        } else if (this.analiseSintomas.febre) {
            //Possui apenas febre
            if (this.analiseSintomas.locaisContagios) {
                if (this.analiseSintomas.idade >= 60 || this.analiseSintomas.hipertensoDiabetico || this.analiseSintomas.asma) {  //Grupo de Risco
                    await this.adicionarFala(`No momento, você está apresentando sinais de febres, mas não precisa se preocupar muito, podendo ficar em casa descansando para se recuperar. Todavia, por estar no grupo de risco, fique em alerta, caso comece a sentir sintomas de falta de ar, procure ajuda profissional para fazer o teste do COVID-19.`, BotFaces.SERIO)
                } else { //Não é grupo de risco
                    if (this.analiseSintomas.febreDuradora) //Febre recorrente 
                        await this.adicionarFala(`Atualmente você está com febre que está durando bastante. Recomendo bastante descanso, repouso e água em casa mesmo. O estress desses dias, pode causar alguns sintomas. Se o sintomas não melhorarem, procure realizar o teste do COVID-19 em um hospital ou clínica, mas evitando aglomerações.`, BotFaces.SERIO)
                    else if (this.analiseSintomas.sintomasSecundarios) //Sinais de gripe ou resfriado
                        await this.adicionarFala(`Atualmente você está com febre, que pode ser ocasionada por uma simples virose, gripe ou até mesmo resfriado. Fique em casa e mantenha o repouso, bebendo bastante líquido.`, BotFaces.SERIO)
                    else 
                        await this.adicionarFala(`Atualmente você está com febre, que pode ser ocasionado uma simples doença passageira. Fique em casa de repouso e apenas procure um especialista, caso não apresente melhoras por mais dias.`, BotFaces.SERIO)
                    }
            } else { //Não teve contato com locais afetados
                await this.adicionarFala(`Como você não teve contato com pessoas ou ambientes afetados pelo COVID-19, fique tranquilo sobre o coronavirus.`, BotFaces.FELIZ)
                await this.adicionarFala(`Sua febre pode estar sendo ocasionada por um gripe ou resfriado que devem passar com descanso. Porém, se os sintomas persistirem por muito tempo, procure ajuda profissional, pois mesmo não sendo COVID-19, teu corpo pode estar te alertando algo.`, BotFaces.NORMAL)
            }   
            this.oQueGostariaSaber();
        } else if (this.analiseSintomas.dificuldadeRespirar) {
            //Possui apenas dificuldade de respirar
            if (this.analiseSintomas.locaisContagios) {
                if (this.analiseSintomas.asma) { //Asma
                    await this.adicionarFala(`Sua dificuldade parece está mais relacionada a asma do que ao COVID-19. Se a dificuldade for muito grande ou durar muito, tente buscar ajuda para descartar a possibilidade de COVID-19 ou saber a causa.`, BotFaces.SERIO)
                } else if (this.analiseSintomas.idade >= 60 || this.analiseSintomas.hipertensoDiabetico) {  //Grupo de Risco
                    await this.adicionarFala(`Apesar do seu problema poder não ser COVID-19. Você está num grupo de risco e teve contato com pessoas ou locais afetados pelo vírus. Por tanto, se a dificuldade de respirar for grande ou persistente, procure realizar o reste para COVID-19 em hospitais ou clínicas médicas.`, BotFaces.SERIO)
                } else { //Não é grupo risco, mas precisa de atençaõ
                    if (this.analiseSintomas.fumante)
                        await this.adicionarFala(`No momento, seu caso não parece ser muito grave, sua dificuldade pode estar atrelada alguns fatores como até mesmo o cigarro. Mas caso a dificuldade de respirar for grande ou persistente, procure fazer o teste para o COVID-19, senão for, mantenha-se em casa.`, BotFaces.SERIO)
                    else
                        await this.adicionarFala(`No momento, seu caso não parece ser muito grave, mas caso a dificuldade de respirar for grande ou persistente, procure ajuda urgente, senão for, mantenha-se em casa.`, BotFaces.SERIO)
                }
                this.interagir('opcoes', [
                    new Opcao('AJUDA', () => this.locaisApoio()),
                    new Opcao('ESTOU BEM', () => this.oQueGostariaSaber())
                ]);
            } else {
                await this.adicionarFala(`Como você não teve contato com pessoas ou ambientes afetados pelo COVID-19, fique tranquilo sobre o coronavirus.`, BotFaces.FELIZ)
                await this.adicionarFala(`Porém, se os sintomas persistirem por muito tempo ou estiverem fortes, procure ajuda profissional, pois não é comum essa dificuldade na respiração.`, BotFaces.NORMAL)
            }

        } else {
            //Não possui febre e nem dificuldade de respirar
            await this.adicionarFala(`Você não possui sintomas do COVID-19, então pode ficar mais tranquilo! Mas mantenha as medidas de segurança da sua cidade, para evitar contágio.`, BotFaces.FELIZ)
            if (this.analiseSintomas.locaisContagios && (this.analiseSintomas.idade >= 60 || this.analiseSintomas.asma || this.analiseSintomas.hipertensoDiabetico))
                await this.adicionarFala(`Também lembre que você se enquadra no grupo de risco, pode isso, apesar de estar tudo bem, sempre mantenha a atenção dobrada `, BotFaces.TRANQUILO)
            this.oQueGostariaSaber()
        }
    }


}

