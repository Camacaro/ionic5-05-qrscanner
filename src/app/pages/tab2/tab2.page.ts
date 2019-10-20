import { Component } from '@angular/core';
import { DataLocalService } from '../../services/data-local.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

    constructor(public dataLocalService: DataLocalService) {}

    enviarCorreo() {
        console.log('enviando correo');
        this.dataLocalService.enviarCorreo();
    }

    abrirRegistro( registo ) {
        console.log( 'Registro', registo );
        this.dataLocalService.abrirRegistro( registo );
    }

}
