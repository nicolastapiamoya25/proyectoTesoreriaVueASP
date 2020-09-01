<template>
<v-layout align-start>
    <v-flex>
        <v-toolbar text color="white">
            <v-toolbar-title>Ingresos</v-toolbar-title>
            <v-divider class="mx-2" inset vertical></v-divider>
            <v-spacer></v-spacer>
            <v-text-field v-if="verNuevo==0" class="text-xs-center" v-model="search" append-icon="search" label="Búsqueda" single-line hide-details></v-text-field>
            <v-spacer></v-spacer>
            <v-btn v-if="verNuevo==0" @click="mostrarNuevo()" color="primary" dark class="mb-2">Nuevo</v-btn>
        </v-toolbar>
        <v-data-table :headers="headers" :items="ingresos" :search="search" v-if="verNuevo==0" class="elevation-1">
            <template v-slot:[`item.opciones`]="{ item }">
                <v-icon small class="mr-2" @click="editItem(item)">create</v-icon>
            </template>
            <template v-slot:[`items`]="{ item }">
                <td>{‌{ item.CORRELATIVO }}</td>
                <td>{‌{ item.FECHA }}</td>
                <td>{‌{ item.RUT }}</td>
                <td>{‌{ item.FECHARECEPCION }}</td>
                <td>{‌{ item.TIPODOC }}</td>
                <td>{‌{ item.NRODOC }}</td>
                <td>{‌{ item.NETO }}</td>
                <td>{‌{ item.impuesto }}</td>
                <td>{‌{ item.CARGO }}</td>
                <td>{‌{ item.ABONO }}</td>
                <td>{‌{ item.GLOSA }}</td>
            </template>

            <template v-slot:[`item.estado`]="{ item }">
                <div v-if="item.estado=='ACEPTADO'">
                    <span class="blue--text">Aceptado</span>
                </div>
                <div v-else>
                    <span class="red--text">{‌{ item.estado }}</span>
                </div>
            </template>
            <template slot="no-data">
                <v-btn color="primary" @click="listar()">Resetear</v-btn>
            </template>
        </v-data-table>
        <v-container grid-list-sm class="pa-4 white" v-if="verNuevo">
            <v-layout row wrap>
                <v-flex xs6 sm6 md6 lg6 xl6>
                    <v-card>
                        <v-container grid-list-md>
                            <v-flex xs12 sm12 md12 lg12 xl12>
                                <v-select v-model="tipodoc" :items="tipodocumento" label="Tipo Documento">
                                </v-select>
                            </v-flex>
                            <v-flex xs12 sm12 md12 lg12 xl12>
                                <v-text-field v-model="nrodoc" label="N° Documento"></v-text-field>
                            </v-flex>
                            <v-flex xs12 sm12 md12 lg12 xl12>
                                <v-text-field v-model="correlativo" label="Correlativo"></v-text-field>
                            </v-flex>
                            <v-autocomplete xs12 sm12 md12 lg12 xl12 v-model="rut" :items="proveedores" label="Proveedor"></v-autocomplete>
                            <v-menu xs12 sm12 md12 lg12 xl12 ref="menurecepcion" v-model="menurecepcion" :close-on-content-click="false" transition="scale-transition" offset-y min-width="290px">
                                <template v-slot:activator="{ on, attrs }">
                                    <v-text-field v-model="fecharecepcion" label="Fecha de Recepción" prepend-icon="event" readonly v-bind="attrs" v-on="on"></v-text-field>
                                </template>
                                <v-date-picker ref="picker" v-model="fecharecepcion" :max="new Date().toISOString().substr(0, 10)" min="1950-01-01" @change="saveRecepcion"></v-date-picker>
                            </v-menu>
                        </v-container>
                    </v-card>
                </v-flex>
                <v-flex xs6 sm6 md6 lg6 xl6>
                    <v-card>
                        <v-container grid-list-md>
                            <v-flex xs12 sm12 md12 lg12 xl12>
                                <v-text-field v-model="impuesto" label="Impuesto"></v-text-field>
                            </v-flex>
                            <v-flex xs12 sm12 md12 lg12 xl12>
                                <v-text-field v-model="neto" label="Neto"></v-text-field>
                            </v-flex>
                            <v-flex xs12 sm12 md12 lg12 xl12>
                                <v-text-field v-model="cargo" label="Cargo"></v-text-field>
                            </v-flex>
                            <v-flex xs12 sm12 md12 lg12 xl12>
                                <v-text-field v-model="abono" label="Abono"></v-text-field>
                            </v-flex>
                            <v-menu xs12 sm12 md12 lg12 xl12 ref="menu" v-model="menu" :close-on-content-click="false" transition="scale-transition" offset-y min-width="290px">
                                <template v-slot:activator="{ on, attrs }">
                                    <v-text-field v-model="fecha" label="Fecha" prepend-icon="event" readonly v-bind="attrs" v-on="on"></v-text-field>
                                </template>
                                <v-date-picker ref="picker" v-model="fecha" :max="new Date().toISOString().substr(0, 10)" min="1950-01-01" @change="save"></v-date-picker>
                            </v-menu>
                        </v-container>

                    </v-card>
                </v-flex>

                <v-flex xs12 sm12 md12 lg12 xl12>
                    <v-card>
                        <v-container>
                            <v-text-field v-model="glosa" label="Glosa"></v-text-field>
                        </v-container>

                    </v-card>
                </v-flex>

                <v-flex xs12 sm12 md12 v-show="valida">
                    <v-container>
                        <v-alert type="error">
                            <div v-for="v in validaMensaje" :key="v" v-text="v"></div>
                        </v-alert>
                    </v-container>

                </v-flex>
                <v-toolbar text color="white">
                    <v-toolbar-title center>Agregar Detalle</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <template>
                        <v-btn @click="dialog = true" color="primary" dark class="mb-2">Agregar</v-btn>
                    </template>
                    <v-dialog v-model="dialog" max-width="500px">

                        <v-card>
                            <v-card-title>
                                <span class="headline">Nuevo detalle</span>
                            </v-card-title>

                            <v-card-text>
                                <v-container grid-list-md>
                                    <v-layout wrap>
                                        <v-flex xs12 sm12 md12>
                                            <v-text-field type="number" v-model="monto" label="Monto"></v-text-field>
                                        </v-flex>
                                        <v-flex xs12 sm12 md12>
                                            <v-autocomplete xs12 sm12 md12 lg12 xl12 v-model="codcla" :items="cuentas" label="Cuentas"></v-autocomplete>
                                        </v-flex>
                                        <v-flex xs12 sm12 md12>
                                            <v-text-field v-model="sucursal" label="Sucursal"></v-text-field>
                                        </v-flex>
                                        <v-flex xs12 sm12 md12>
                                            <v-autocomplete xs12 sm12 md12 lg12 xl12 v-model="ccostos" :items="centroCostos" label="Centro de costo"></v-autocomplete>
                                        </v-flex>
                                        <v-flex xs12 sm12 md12 v-show="valida">
                                            <div class="red--text" v-for="v in validaMensaje" :key="v" v-text="v">
                                            </div>
                                        </v-flex>
                                    </v-layout>
                                </v-container>
                            </v-card-text>

                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="blue darken-1" text @click.native="close">Cancelar</v-btn>
                                <v-btn color="blue darken-1" text @click.native="guardarDetalle">Guardar</v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                </v-toolbar>

                <v-flex xs12 sm12 md12 lg12 xl12>
                    <v-data-table :headers="cabeceraDetalles" :items="detalles" hide-default-footer class="elevation-1">
                        <template v-slot:[`items`]="{ item }">

                            <td>{‌{ item.monto }}</td>

                            <td>{{ item.codcla }}</td>

                            <td>{{ item.ccostos }}</td>
                        </template>

                        <template slot="no-data">
                            <h3>No hay detalle</h3>
                        </template>
                    </v-data-table>
                </v-flex>
                <v-flex xs12 sm12 md12 lg12 xl12>
                    <v-btn color="blue darken-1" @click="ocultarNuevo()" text>Cancelar</v-btn>
                    <v-btn color="success" @click.native="guardar">Guardar</v-btn>
                </v-flex>
            </v-layout>
        </v-container>
    </v-flex>
</v-layout>
</template>

<script>
import axios from 'axios'
export default {
    data() {
        return {
            ingresos: [],
            dialog: false,
            headers: [{
                    text: 'Opciones',
                    value: 'opciones',
                    sortable: false
                },
                {
                    text: 'Correlativo',
                    value: 'correlativo'
                },
                {
                    text: 'Fecha',
                    value: 'fecha'
                },
                {
                    text: 'Rut',
                    value: 'rut'
                },
                {
                    text: 'Recepción',
                    value: 'fecharecepcion'
                },
                {
                    text: 'Tipo Doc',
                    value: 'tipodoc'
                },
                {
                    text: 'N° Doc',
                    value: 'nrodoc'
                },
                {
                    text: 'Neto',
                    value: 'neto',
                    sortable: false
                },
                {
                    text: 'Impuesto',
                    value: 'impuesto',
                    sortable: false
                },
                {
                    text: 'Cargo',
                    value: 'cargo',
                    sortable: false
                },
                {
                    text: 'Abono',
                    value: 'abono',
                    sortable: false
                },
                {
                    text: 'Glosa',
                    value: 'glosa',
                    sortable: false
                }
            ],
            cabeceraDetalles: [{
                    text: 'Monto',
                    value: 'monto',
                    sortable: false
                },
                {
                    text: 'Cuenta',
                    value: 'codcla',
                    sortable: false
                },
                {
                    text: 'Centro de Costo',
                    value: 'ccostos',
                    sortable: false
                }
            ],
            detalles: [],
            search: '',
            editedIndex: -1,
            editedIndexDetalle: -1,
            id: '',
            tipo_comprobante: '',
            comprobantes: ['FACTURA', 'BOLERTA', 'TICKECT'],
            serie_comprobante: '',
            num_comprobante: '',
            impuesto: 0,
            codigo: '',
            verNuevo: 0,
            errorArticulo: null,
            totalParcial: 0,
            totalImpuesto: 0,
            total: 0,
            articulos: [],
            texto: '',
            valida: 0,
            validaMensaje: [],
            adModal: 0,
            adAccion: 0,
            adNombre: 0,
            adId: '',
            // declaracion datos del formulario
            correlativo: 0,
            fecha: null,
            rut: 0,
            dvrut: 0,
            fecharecepcion: null,
            tipodoc: 0,
            tipodocumento: [],
            nrodoc: 0,
            neto: 0,
            impuesto: 19,
            cargo: 0,
            abono: 0,
            glosa: 0,
            fechavencimiento: 0,
            idproveedor: '',
            proveedores: [],
            monto: 0,
            sucursal: '',
            menu: false,
            menurecepcion: false,
            cuenta: '',
            cuentas: [],
            centroCosto: '',
            centroCostos: [],
            codcla: '',
            ccostos: ''
        }
    },
    computed: {
        calcularTotal: function () {
            var resultado = 0;
            this.detalles.forEach(e => {
                resultado += e.precio * e.cantidad;
            });
            //console.log(resultado);
            return resultado
        }
    },

    watch: {
        menu(val) {
            val && setTimeout(() => (this.$refs.picker.activePicker = 'YEAR'))
        },

        menurecepcion(val) {
            val && setTimeout(() => (this.$refs.picker.activePicker = 'YEAR'))
        },

        date(val) {
            this.dateFormatted = this.formatDate(this.date)
        },

        //*******Cierra el dialogo*********/

        dialog(val) {
            if (this.correlativo > 0) {
                val || this.close()
            }

        }
    },
    created() {
        this.listar();
        this.select();
        this.selectTipoDoc();
        this.selectCuentas();
        this.selectCentroCosto();
    },
    methods: {

        formatDate(date) {
            if (!date) return null

            const [year, month, day] = date.split('-')
            return `${month}/${day}/${year}`
        },
        parseDate(date) {
            if (!date) return null

            const [month, day, year] = date.split('/')
            return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
        },

        //************Metodo para guardar la fecha *********************
        save(fecha) {
            this.$refs.menu.save(fecha)
        },

        //************Metodo para guardar la fecha de recepcion*********************
        saveRecepcion(fecharecepcion) {
            this.$refs.menurecepcion.save(fecharecepcion)
        },
        eliminarDetalle(arr, item) {
            var i = arr.indexOf(item);
            if (i !== -1) {
                arr.splice(i, 1);
            }
        },
        encontrar(id) {
            var sw = 0;
            for (var i = 0; i < this.detalles.length; i++) {
                if (this.detalles[i].idarticulo == id) {
                    sw = 1;
                }
            }
            return sw;
        },

        //************Metodo para mostrar el datatable*********************
        mostrarNuevo() {
            this.verNuevo = 1;
            this.limpiar();
        },

        //************Metodo para ocultar el datatable*********************
        ocultarNuevo() {
            this.verNuevo = 0;
        },

        //************Metodo Listar, Lista todos los ingresos*********************
        listar() {
            let me = this;
            let header = {
                "Authorization": "Bearer " + this.$store.state.token
            };
            let configuracion = {
                headers: header
            };
            axios.get('api/ProveedoresEncas/Listar', configuracion).then(function (response) {
                //console.log(response);
                me.ingresos = response.data;
            }).catch(function (error) {
                console.log(error);
            });
        },
        listarDetalle(id) {
            let me = this;
            let header = {
                "Authorization": "Bearer " + this.$store.state.token
            };
            let configuracion = {
                headers: header
            };
            axios.get('api/ProveedoresDetas/ListarDeta/' + id, configuracion).then(function (response) {
                console.log(response);
                me.detalles = response.data;
            }).catch(function (error) {
                console.log(error);
            });
        },

        buscarCodigo() {
            let me = this;
            me.errorArticulo = null;
            let header = {
                "Authorization": "Bearer " + this.$store.state.token
            };
            let configuracion = {
                headers: header
            };
            axios.get('api/Articulos/BuscarCodigoIngreso/' + this.codigo, configuracion).then(function (response) {
                //console.log(response);
                me.agregarDetalle(response.data);
            }).catch(function (error) {
                console.log(error);
                me.errorArticulo = 'No existe el articulo';
            });
        },
        getSubtotal(cantidad, precio) {
            return cantidad * precio;
        },
        agregarDetalle(data = []) {
            this.errorArticulo == null;
            if (this.encontrar(data['idarticulo'])) {
                this.errorArticulo = 'El articulo ya ha sido agregado';
            } else {
                //asdas
                //console.log(data);
                this.detalles.push({
                    idarticulo: data['idarticulo'],
                    articulo: data['nombre'],
                    cantidad: 1,
                    precio: data['precio_venta'],
                    subtotal: this.getSubtotal(1, data['precio_venta'])
                })
            }
        },

        //************Metodo para select, muestra los rut de los proveedores*********************
        select() {
            let me = this;
            let header = {
                "Authorization": "Bearer " + this.$store.state.token
            };
            let configuracion = {
                headers: header
            };
            var proveedoresArray = [];
            axios.get('api/Personas/Select', configuracion).then(function (response) {
                proveedoresArray = response.data;
                //console.log(response.data)
                proveedoresArray.map(function (x) {
                    me.proveedores.push({
                        text: x.nombres + ' ' + x.paterno + ' ' + x.materno,
                        value: x.rut
                    });
                });
            }).catch(function (error) {
                console.log(error);
            });
        },

        //************Metodo para select, muestra los tipo de documentos*********************
        selectTipoDoc() {
            let me = this;
            var tipoDocumentoArray = [];
            axios.get('api/TipoDocumentos/SelectTipoDocumento').then(function (response) {
                tipoDocumentoArray = response.data;
                //console.log(response.data);
                tipoDocumentoArray.map(function (x) {
                    me.tipodocumento.push({
                        text: x.descripcion,
                        value: x.codigo
                    });
                });
            }).catch(function (error) {
                console.log(error);
            });
        },

        //************Metodo para select, muestra las cuentas*********************
        selectCuentas() {
            let me = this;
            var cuentasArray = [];
            axios.get('api/Cuentas/Select').then(function (response) {
                cuentasArray = response.data;
                console.log(response.data);
                cuentasArray.map(function (x) {
                    me.cuentas.push({
                        text: x.descripcion,
                        value: x.codcla
                    });
                });
            }).catch(function (error) {
                console.log(error);
            });
        },

        //************Metodo para select, muestra las cuentas*********************
        selectCentroCosto() {
            let me = this;
            var centroCostoArray = [];
            axios.get('api/CentrosCostos/Select').then(function (response) {
                centroCostoArray = response.data;
                console.log(response.data);
                centroCostoArray.map(function (x) {
                    me.centroCostos.push({
                        text: x.descripcion,
                        value: x.id
                    });
                });
            }).catch(function (error) {
                console.log(error);
            });
        },

        //************Metodo editar, trae los datos que corresponde*********************
        editItem(item) {
            this.mostrarNuevo();
            this.correlativo = item.correlativo;
            this.fecha = item.fecha;
            this.rut = item.rut;
            this.fecharecepcion = item.fecharecepcion;
            this.tipodoc = item.tipodoc;
            this.nrodoc = item.nrodoc;
            this.neto = item.neto;
            this.impuesto = item.impuesto;
            this.cargo = item.cargo;
            this.abono = item.abono;
            this.glosa = item.glosa;
            this.fechavencimiento = item.fechavencimiento;
            this.listarDetalle(item.correlativo);
            this.editedIndex = 1;

        },

        //************Metodo Cerrar Dialogo de agregar detalle*********************
        close() {
            this.dialog = false;
            this.limpiarDetalle();
        },

        //************Metodo Limpiar*********************
        limpiar() {
            this.correlativo = "",
                this.fecha = "",
                this.rut = "",
                this.fecharecepcion = "",
                this.tipodoc = "",
                this.nrodoc = "",
                this.neto = "",
                this.impuesto = "",
                this.cargo = 0,
                this.abono = 0,
                this.glosa = "",
                this.fechavencimiento = "",
                this.editedIndex = -1;
        },

        //************Metodo Limpiar*********************
        limpiarDetalle() {
            this.codcla = "",
                this.ccostos = "",
                this.monto = "",
                this.sucursal = ""
        },

        //************Metodo Guardar*********************
        guardarDetalle() {
            if (this.validarDetalle()) {
                return;
            }
            if (this.editedIndexDetalle > -1) {
                //Código para editar
                let me = this;
                let header = {
                    "Authorization": "Bearer " + this.$store.state.token
                };
                let configuracion = {
                    headers: header
                };

                //************Actualizar API*********************
                axios.put('api/ProveedoresDetas/Actualizar', {
                    'rut': me.rut,
                    'tipodoc': me.tipodoc,
                    'nrodoc': me.nrodoc,
                    'cargo': me.cargo,
                    'abono': me.abono,
                    'correlativo': me.correlativo,
                    'monto': me.monto,
                    'ccostos': me.ccostos,
                    'codcla': me.codcla
                }, configuracion).then(function (response) {
                    //************Si es OK muestra, limpia los campos y lista*********************
                    me.ocultarNuevo();
                    me.listar();
                    me.limpiarDetalle();
                }).catch(function (error) {
                    console.log(error);
                });
            } else {
                //************Crear API*********************
                let me = this;
                let header = {
                    "Authorization": "Bearer " + this.$store.state.token
                };
                let configuracion = {
                    headers: header
                };
                axios.post('api/ProveedoresDetas/Crear', {
                    'rut': me.rut,
                    'tipodoc': me.tipodoc,
                    'nrodoc': me.nrodoc,
                    'cargo': me.cargo,
                    'abono': me.abono,
                    'correlativo': me.correlativo,
                    'monto': me.monto,
                    'ccostos': me.ccostos,
                    'codcla': me.codcla
                }, configuracion).then(function (response) {
                    //************Si es OK muestra, limpia los campos y lista*********************
                    //me.ocultarNuevo();
                    me.listarDetalle(me.correlativo);
                    me.listar();
                    me.limpiarDetalle();
                    me.close();
                }).catch(function (error) {
                    console.log(error);
                });
            }
        },

        //************Metodo Guardar*********************
        guardar() {
            if (this.validar()) {
                return;
            }
            if (this.editedIndex > -1) {
                //Código para editar
                let me = this;
                let header = {
                    "Authorization": "Bearer " + this.$store.state.token
                };
                let configuracion = {
                    headers: header
                };

                //************Actualizar API*********************
                axios.put('api/ProveedoresEncas/Actualizar', {
                    'correlativo': me.correlativo,
                    'fecha': me.fecha,
                    'rut': me.rut,
                    'fecharecepcion': me.fecharecepcion,
                    'tipodoc': me.tipodoc,
                    'nrodoc': me.nrodoc,
                    'neto': me.neto,
                    'impuesto': me.impuesto,
                    'cargo': me.cargo,
                    'abono': me.abono,
                    'glosa': me.glosa
                }, configuracion).then(function (response) {
                    //************Si es OK muestra, limpia los campos y lista*********************
                    me.ocultarNuevo();
                    me.listar();
                    me.limpiar();
                }).catch(function (error) {
                    console.log(error);
                });
            } else {
                //************Crear API*********************
                let me = this;
                let header = {
                    "Authorization": "Bearer " + this.$store.state.token
                };
                let configuracion = {
                    headers: header
                };
                axios.post('api/ProveedoresEncas/Crear', {
                    'correlativo': me.correlativo,
                    'fecha': me.fecha,
                    'rut': me.rut,
                    'fecharecepcion': me.fecharecepcion,
                    'tipodoc': me.tipodoc,
                    'nrodoc': me.nrodoc,
                    'neto': me.neto,
                    'impuesto': me.impuesto,
                    'cargo': me.cargo,
                    'abono': me.abono,
                    'glosa': me.glosa
                }, configuracion).then(function (response) {
                    //************Si es OK muestra, limpia los campos y lista*********************
                    me.ocultarNuevo();
                    me.listar();
                    me.limpiar();
                }).catch(function (error) {
                    console.log(error);
                });
            }
        },

        //************Metodo Validar Campos*********************
        validar() {
            this.valida = 0;
            this.validaMensaje = [];
            if (!this.nrodoc || this.nrodoc == 0) {
                this.validaMensaje.push("Ingrese N° de Documento");
            }
            if (!this.correlativo || this.correlativo == "") {
                this.validaMensaje.push("Ingrese un Correlativo");
            }
            if (!this.fecha || this.fecha == "") {
                this.validaMensaje.push("Ingrese la Fecha");
            }
            if (!this.rut || this.rut == 0) {
                this.validaMensaje.push("Ingrese un Rut");
            }
            if (!this.neto || this.neto == 0) {
                this.validaMensaje.push("Ingrese valor Neto");
            }
            if (!this.impuesto || this.impuesto == 0) {
                this.validaMensaje.push("Ingrese valor impuesto");
            }
            if (!this.glosa || this.glosa == "") {
                this.validaMensaje.push("Ingrese una glosa");
            }
            if (this.validaMensaje.length) {
                this.valida = 1;
            }
            return this.valida;
        },

        //************Metodo Validar detalle Campos*********************
        validarDetalle() {
            this.valida = 0;
            this.validaMensaje = [];
            if (!this.monto || this.monto == 0) {
                this.validaMensaje.push("Ingrese Monto");
            }
            if (!this.codcla || this.codcla == "") {
                this.validaMensaje.push("Ingrese una cuenta");
            }
            if (!this.ccostos || this.ccostos == "") {
                this.validaMensaje.push("Ingrese centro de Costo");
            }
            if (!this.correlativo || this.correlativo == "") {
                this.validaMensaje.push("Ingrese un Documento");
            }
            if (this.validaMensaje.length) {
                this.valida = 1;
            }

            return this.valida;
        },

        money(value) {
            totalParts = value.toFixed(2).split('.');
            return totalParts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".")
        }
    }
}
</script>
