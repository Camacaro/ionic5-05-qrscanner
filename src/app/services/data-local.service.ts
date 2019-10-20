import { Injectable } from '@angular/core';
import { Registro } from '../models/registro.model';
import { Storage } from '@ionic/storage';
import { NavController } from '@ionic/angular';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { File } from '@ionic-native/file/ngx';
import { EmailComposer } from '@ionic-native/email-composer/ngx';

@Injectable({
  providedIn: 'root'
})
export class DataLocalService {

    guardados: Registro[] = [];

    constructor( private storage: Storage,
                 private navCtrl: NavController,
                 private iab: InAppBrowser,
                 private file: File,
                 private emailComposer: EmailComposer ) {

        this.cargarStorage();
    }

    async guardarRegistro( format: string, text: string ) {

        await this.cargarStorage();

        const nuevoRegisto = new   Registro( format, text );

        this.guardados.unshift( nuevoRegisto );

        this.storage.set('registros', this.guardados);

        this.abrirRegistro( nuevoRegisto );
    }

    async cargarStorage() {

        this.guardados = await this.storage.get('registros') || [];
    }

    abrirRegistro( registro: Registro ) {

        this.navCtrl.navigateForward('/tabs/tab2');

        switch ( registro.type ) {

            case 'http':
                // abrir navegador
                this.iab.create( registro.text, '_system');
                break;

            case 'geo':
                this.navCtrl.navigateForward( `tabs/tab2/mapa/${registro.text}` );
                break;
        }
    }

    enviarCorreo() {

        const arrTemp = [];
        const titulos = 'Tipo, Formato, Creado en, Texto\n';

        arrTemp.push( titulos );

        this.guardados.forEach( registro => {

            const linea = `${ registro.type }, ${ registro.format }, ${ registro.created }, ${ registro.text.replace( ',', ' ' ) }\n`;

            arrTemp.push( linea );
        } );

        // console.log(arrTemp.join(''));
        this.crearArchivoFisico( arrTemp.join('') );
    }

    crearArchivoFisico( text: string ) {

        // verificar si existe el archivo
        this.file.checkFile( this.file.dataDirectory, 'registros.csv' )
            .then( existe => {
                console.log('Existe archivo?', existe);
                return this.escribirEnArchivo( text );
            })
            .catch( err => {
                // el false es para que no reemplace
                return this.file.createFile( this.file.dataDirectory, 'registros.csv', false )
                    .then( creado => this.escribirEnArchivo(text ) )
                    .catch( err2 => console.log('No se pudo crear el archivo', err2) );
            });
    }

    async escribirEnArchivo( text: string ) {

        await this.file.writeExistingFile( this.file.dataDirectory, 'registros.csv', text );

        console.log(`${this.file.dataDirectory}/registros.csv`);

        // const archivo = `file:///Android/data/io.ionic.devapp/files/registros.csv`;
        const archivo = `${this.file.dataDirectory}registros.csv`;

        // const email = {
        //     to: 'jesus_camacaro@hotmail.com',
        //     // cc: 'erika@mustermann.de',
        //     // bcc: ['john@doe.com', 'jane@doe.com'],
        //     attachments: [
        //         // 'file://img/logo.png',
        //         // 'res://icon.png',
        //         // 'base64:icon.png//iVBORw0KGgoAAAANSUhEUg...',
        //         // 'file://README.pdf'
        //         archivo
        //     ],
        //     subject: 'Backup de scans',
        //     body: 'Aqui tiene sus backups de sus scans - <strong> ScanApp </strong>',
        //     isHtml: true
        // }

        const email = {
            to: 'jesus_camacaro@hotmail.com',
            attachments: [
                archivo
            ],
            subject: 'Backup de scans',
            body: 'Aqui tiene sus backups de sus scans - <strong> ScanApp </strong>',
            isHtml: true
        };

        // Send a text message using default options
        this.emailComposer.open(email);
    }
}
