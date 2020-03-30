import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(private storage: Storage) { }

  public async getUsuario(): Promise<string> {
    return await this.storage.get('usuario');
  }

  public setUsuario(usuario: string) {
    this.storage.set('usuario', usuario);
  }
}
