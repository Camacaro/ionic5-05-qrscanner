import { Component } from '@angular/core';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { DataLocalService } from '../../services/data-local.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

    swiperOpts = {
        allowSlidePrev: false,
        allowSlideNext: false,
    };

    constructor(private barcodeScanner: BarcodeScanner,
                private dataLocalService: DataLocalService) {}

    // Ciclos de vida de ionic

    // Se ejecuta al entrar a la pagina cargada
    ionViewDidEnter() {
        // console.log('ionViewDidEnter');
    }

    // Se ejecuta al haber dejado la pagina
    ionViewDidLeave() {
        // console.log('ionViewDidLeave');
    }

    // Se ejecuta antes de entrar a la pagina, cuando se esta cargando
    ionViewWillEnter() {
        // console.log('ionViewWillEnter');
        this.scan();
    }

    // Se ejecuta antes de dejar la pagina, antes de salir
    ionViewWillLeave() {
        // console.log('ionViewWillLeave');
    }

    scan() {

        this.barcodeScanner.scan().then( barcodeData => {

            console.log('Barcode data', barcodeData);

            if ( !barcodeData.cancelled ) {

                this.dataLocalService.guardarRegistro( barcodeData.format, barcodeData.text );
            }

        }).catch( err => {

            // console.log('Error', err);
            // this.dataLocalService.guardarRegistro( 'QRCode', 'https://fernando-herrera.com' );
            this.dataLocalService.guardarRegistro( 'QRCode', 'geo:40.73151796986687,-74.06087294062502' );
        });
    }

}
