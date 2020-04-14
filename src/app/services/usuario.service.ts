import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { SMS } from '@ionic-native/sms/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(private storage: Storage, private sms: SMS, private geolocation: Geolocation) { }

  /** Busca o nome do usuário' */
  public async getUsuario(): Promise<string> {
    return await this.storage.get('usuario');
  }

  /** Salva o nome do usuário */
  public setUsuario(usuario: string) {
    this.storage.set('usuario', usuario);
  }
  
  /** Salva o telefone do contato */
  public setContato(contato: string) {
    this.storage.set('contato', contato);
  }
  
  /** Busca o telefone do contato */
  public getContato(): Promise<string> {
    return this.storage.get('contato');
  }
 
  /** Apaga os dados do usuário atual */
  public reset() {
    this.storage.set('usuario', null);
    this.storage.set('contato', null);
  }

  /** Envia um SMS para o contato */
  public async enviarSMS() {
    const telefone = await this.getContato();
    const nomeUsuario = await this.getUsuario();

    try {
      //Busca localização
      const localizacao = await this.geolocation.getCurrentPosition();
      const {longitude, latitude} = localizacao.coords;
      //Monta mensagem
      const mapa = `http://maps.google.com/maps?q=${latitude},${longitude}`
      let msg = `Esta é uma mensagem enviada por ${nomeUsuario} através do aplicativo Bot-CC1. Essa mensagem foi envianda, pois ${nomeUsuario} acredita estar em perigo, sem conseguir respirar ou falar direito. Você foi cadastrado como um contato para ajudar em caso de pânico.  Segue a sua localização ${mapa}`;
      //Envia
      await this.sms.send(telefone, msg);
      
      return true; //Enviado com sucesso
    } catch(e) {
      return false; //Falha no envio 
    }
  }
}
