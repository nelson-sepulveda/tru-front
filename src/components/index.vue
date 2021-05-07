<template>
  <div class="container-tru">
    <h2 class="tru-h2-title">¡Crea tu cuenta!</h2>
    <h4 class="tru-h4-title">Tru - Group</h4>
    <div class="container-login">
      <b-form
        @submit="onInicioSesion"
        @reset="onReset"
        v-if="show"
        class="b-form-container"
      >
      <div>
        <b-form-group
          class="container-input"
          id="input-group-1"
          label="Correo electronico"
          label-for="input-1"
        >
          <b-form-input
            id="input-1"
            v-model="form.email"
            type="email"
            placeholder="Correo electronico"
            required
          ></b-form-input>
        </b-form-group>

        <b-form-group
          id="input-group-2"
          label="Contraseña"
          label-for="input-2"
          class="container-input"
        >
          <b-form-input
            id="input-2"
            v-model="form.password"
            placeholder="Contraseña"
            required
            type="password"
          ></b-form-input>
        </b-form-group>
        <b-row class="justify-content-around mt-5 container-btn-login">
          <b-button
            class="btn-color-main btn-tru"
            type="submit"
          >
            Ingresar
          </b-button>
          <b-button
            class="btn-tru"
            @click="_abrirRegistro"
            variant="success"
          >
            Registrarme
          </b-button>
        </b-row>
      </div>
      </b-form>
      <b-modal id="modal-registro" title="Registro">
        <b-container>
          <b-form>
            <b-form-group
              id="input-nombre-group-1"
              label="Nombre completo"
              label-for="input-nombre"
            >
              <b-form-input
                id="input-nombre"
                v-model="registro.nombre"
                type="email"
                placeholder="Nombre completo"
                required
              ></b-form-input>
            </b-form-group>

            <b-form-group
              id="input-correo-group-1"
              label="Correo electronico"
              label-for="input-correo"
            >
              <b-form-input
                id="input-correo"
                v-model="registro.email"
                type="email"
                placeholder="Correo electronico"
                required
              ></b-form-input>
            </b-form-group>

            <b-form-group id="input-pass-group-2" label="Contraseña" label-for="input-pass">
              <b-form-input
                type="password"
                id="input-pass"
                v-model="registro.password"
                placeholder="Contraseña"
                required
              ></b-form-input>
            </b-form-group>
          </b-form>
        </b-container>
        <template #modal-footer>
          <div class="w-100">
            <b-row class="justify-content-around">
              <b-button @click="onRegister" type="submit" variant="primary">Registrarme</b-button>
              <b-button @click="_cerrarModal" variant="danger">Cancelar</b-button>
            </b-row>
          </div>
        </template>
      </b-modal>
    </div>
  </div>
</template>
<script>
import http from '../api/config'
export default {
  name: 'IndexComponent',
  data() {
    return {
      registro: {},
      form: {
        email: '',
        name: '',
        food: null,
        checked: []
      },
      foods: [{ text: 'Select One', value: null }, 'Carrots', 'Beans', 'Tomatoes', 'Corn'],
      show: true,
      pattern: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    }
  },
  methods: {
    _cerrarModal () {
      this.$bvModal.hide('modal-registro')
    },
    _abrirRegistro () {
      this.$bvModal.show('modal-registro')
    },
    _validateLogin () {
      if (!this.form.email || this.form.email === '' || !this.pattern.test(this.form.email)) {
        return {
          error: true,
          message: 'Email no valido'
        }
      } else if (!this.form.password || this.form.password === '') {
        return {
          error: true,
          message: 'Contraseña no valido'
        }
      }
      return {
        error: false,
        message: ''
      }
    },
    onInicioSesion(event) {
      event.preventDefault()
      const { error, message } = this._validateLogin()
      if (error) {
        this.$swal.fire({
          position: 'top-end',
          icon: 'error',
          title: message,
          showConfirmButton: false,
          timerProgressBar: true,
          timer: 4000,
          toast: true
        })
      } else {
        http.post('/autor/login', this.form).then((data)=> {
          this.$swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Cargando sesion de usuario..',
            showConfirmButton: false,
            timerProgressBar: true,
            timer: 4000,
            toast: true
          })
          localStorage.setItem('usuario', JSON.stringify(data.data))
          setTimeout(() => {
            this.$router.push({ path: 'profile' })
          }, 4500);
        }).catch(() => {
          this.$swal.fire({
            position: 'top-end',
            icon: 'error',
            title: 'Verifica tus datos',
            showConfirmButton: false,
            timerProgressBar: true,
            timer: 4000,
            toast: true
          })
        })
      }
    },
    onReset(event) {
      event.preventDefault()
      this.form.email = ''
      this.form.name = ''
      this.form.food = null
      this.form.checked = []
      this.show = false
    },
    _validate () {
      if (!this.registro.nombre || this.registro.nombre === '') {
        return {
          error: true,
          message: 'Nombre Requerido'
        }
      } else if (!this.registro.email || this.registro.email === '') {
        return {
          error: true,
          message: 'Email Requerido'
        }
      } else if (!this.registro.password || this.registro.password === '') {
        return {
          error: true,
          message: 'Contraseña Requerido'
        }
      }
      return {
        error: false,
        message: ''
      }
    },
    async onRegister () {
      const { error, message } = this._validate()
      if (error) {
        this.$swal.fire({
          position: 'top-end',
          icon: 'error',
          title: message,
          showConfirmButton: false,
          timerProgressBar: true,
          timer: 4000,
          toast: true
        })
      } else {
        http.post('/autor', this.registro).then((data) => {
          console.log(data)
          this._cerrarModal()
          this.$swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Registro Exitoso',
            showConfirmButton: false,
            timerProgressBar: true,
            timer: 4000,
            toast: true
          })
        }).catch(() => {
          this.$swal.fire({
            position: 'top-end',
            icon: 'error',
            title: 'Se presento un error en tu registro intenta mas tarde',
            showConfirmButton: false,
            timerProgressBar: true,
            timer: 4000,
            toast: true
          })
        })
      }
    }
  }
}
</script>
<style lang="scss">
  .container-tru {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    background-image: url("../assets/bg.jpg");
    background-size: cover;
    background-position: center;
    height: 210px;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    &:after {
      content: "";
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(#000, 0.4);
    }
  }
  .container-login {
    width: 600px;
    max-width: 600px;
    z-index: 5;
    background-color: #fff;
    border-radius: 4px;
    padding: 25px;
    @media (max-width: 900px) {
      width: 450px;
    }
    @media (max-width: 500px) {
      width: 300px;
    }
  }

  @media (max-width: 500px) {
    .container-btn-login {
      display: flex;
      flex-direction: column !important;
      align-items: center;
      .btn-color-main {
        margin-bottom: 10px;
      }
    }
  }

  .container-input {
    label {
      color: #404040;
    }
  }

  .btn-color-main {
    background-color: #2778c4;
    color: #fff;
    border-color: #2778c4;
    height: 50px;
    width: 10rem;
  }

  .tru-h2-title {
    color: #fff;
    z-index: 5;
    margin: 5px 0px;
    letter-spacing: 1.5px;
    font-size: 46px;
  }
  .b-form-container {
    display: flex;
    justify-content: center;
    align-items: center;
    div {
      width: 100%;
    }
  }
  .form-control {
    height: 45px;
  }
  .btn-tru {
    height: 50px;
    width: 10rem;
  }
  .tru-h4-title {
    font-size: 26px;
    color: #fff;
    margin-bottom: 40px;
  }
</style>