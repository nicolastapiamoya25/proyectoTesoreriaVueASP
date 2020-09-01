
<template>
  <v-layout align-center justify-center>
    <v-flex xs12 sm8 md6 lg5 xl4 justify-xl-center>
      <v-card color="white">

      <v-img
          :src="require('../assets/logoLR.jpg')"
          contain
        />
        <v-card-text>

          <v-text-field class="text-center primary rounded-pill align-center justify-center px-5" v-model="usuario" autodocus color="white" label="Usuario" prepend-icon="people" required>
          </v-text-field>
          <v-text-field class="text-center primary rounded-pill align-center justify-center px-5" v-model="contrasena" type="password" color="white" label="Contraseña" prepend-icon="lock" required>
          </v-text-field>
          <v-flex v-if="error">
          {{error}}
          </v-flex>
        </v-card-text>
        <v-card-actions class="px-3 pb-3">
          <v-flex>
          <v-layout align-center justify-center>
            <v-btn @click="ingresar" rounded large color="primary" dark>Ingresar</v-btn>
          </v-layout>
          </v-flex>
        </v-card-actions>
      </v-card>  
    </v-flex>
</v-layout>
</template>

<script>
import axios from 'axios'
  export default {
    data(){
      return{
        usuario: '',
        contrasena: '',
        error: null 

      }
    },
    methods :{
      ingresar(){
          this.error = null;
          axios.post('api/Perfiles/Login',{usuario: this.usuario, contrasena: this.contrasena})
          .then(respuesta => {
            console.log(respuesta.data);
            return respuesta.data
          })
          .then(data => {
            this.$store.dispatch("guardarToken", data.token)
            this.$router.push({ name: 'home' })
            console.log("pasa por router home Login.vue")
          })
          .catch(err => {
            //console.log(err.response)
            if(err.response.status==400){
              this.error = "No es un Email válido";
            }else if(err.response.status==404){
              this.error = "Datos incorrectos";
            }else{
              this.error = "Error de Conexión";
            }
            //console.log(err)
          });
      }
    }
    
  }
</script>
