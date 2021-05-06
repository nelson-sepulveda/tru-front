<template>
  <div>
    <b-navbar toggleable="lg" type="dark" variant="info">
      <b-navbar-brand href="#">
        <b-icon icon="house"></b-icon>
        Alcancia
      </b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav class="ml-auto">
          <b-nav-item-dropdown right>
            <template #button-content>
              <b-icon icon="person"></b-icon> {{ user.data.nombre }}
            </template>
            <b-dropdown-item @click="_agregarAlcancia">Agregar alcancia</b-dropdown-item>
            <b-dropdown-item @click="_cerrarSesion">Cerrar sesión</b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
    <p class="text-center fz-24 mt-5">
      Mis Alcancias
    </p>
    <b-row class="p-5 justify-content-center" lg="12">
      <b-card
        no-body
        class="overflow-hidden"
        style="max-width: 540px; width: 600px;"
        v-for="item in list"
        :key="item._id"
      >
        <b-row no-gutters>
          <b-col md="6">
            <b-card-img src="https://picsum.photos/400/400/?image=20" alt="Image" class="rounded-0"></b-card-img>
          </b-col>
          <b-col md="6">
            <b-card-body title="Alcancia">
              <b-card-text>
                Tipo: {{ item.tipo }}
              </b-card-text>
              <b-card-text>
                Total: {{ _getTotal(item.total) }}
              </b-card-text>
              <b-row>
                <b-button @click="_retirarFondos(item)" variant="success">Retirar fondos</b-button>
              </b-row>
              <b-row class="mt-3">
                <b-button @click="_registrarFondos(item)" variant="success">Registrar fondos</b-button>
              </b-row>
            </b-card-body>
          </b-col>
        </b-row>
      </b-card>      
    </b-row>
    <b-modal id="modal-retiro-fondo" title="Retiro de fondos">
      <b-container>
        <b-form>
          <b-form-group
            label="Monto del fondo"
          >
            <b-form-input
              v-model="retiro.monto"
              type="number"
              placeholder="Monto del fondo"
              required
            ></b-form-input>
          </b-form-group>
        </b-form>
      </b-container>
      <template #modal-footer>
        <div class="w-100">
          <b-row class="justify-content-around">
            <b-button @click="_retirarFondo" type="submit" variant="primary">Retiro</b-button>
            <b-button @click="_cerrarModal('modal-retiro-fondo')" variant="danger">Cancelar</b-button>
          </b-row>
        </div>
      </template>
    </b-modal>
    <b-modal id="modal-registro-fondo" title="Registro de alcancia">
      <b-container>
        <b-form>
          <b-form-group
            label="Monto del fondo"
          >
            <b-form-input
              v-model="fondo.monto"
              type="number"
              placeholder="Monto del fondo"
              required
            ></b-form-input>
          </b-form-group>
          <b-form-group
            label="Tipo del fondo"
          >
            <b-form-input
              v-model="fondo.tipo"
              type="text"
              placeholder="Tipo del fondo"
              required
            ></b-form-input>
          </b-form-group>
        </b-form>
      </b-container>
      <template #modal-footer>
        <div class="w-100">
          <b-row class="justify-content-around">
            <b-button @click="_crearFondo" type="submit" variant="primary">Registrar</b-button>
            <b-button @click="_cerrarModal('modal-registro-fondo')" variant="danger">Cancelar</b-button>
          </b-row>
        </div>
      </template>
    </b-modal>
    <b-modal id="modal-registro-alcancia" title="Registro de alcancia">
      <b-container>
        <b-form>
          <b-form-group
            label="Nombre completo"
            label-for="input-tipo-alcancia"
          >
            <b-form-input
              id="input-tipo-alcancia"
              v-model="registro.tipo"
              type="email"
              placeholder="Tipo de alcancia"
              required
            ></b-form-input>
          </b-form-group>
        </b-form>
      </b-container>
      <template #modal-footer>
        <div class="w-100">
          <b-row class="justify-content-around">
            <b-button @click="_crearAlcancia" type="submit" variant="primary">Registrarme</b-button>
            <b-button @click="_cerrarModal('modal-registro-alcancia')" variant="danger">Cancelar</b-button>
          </b-row>
        </div>
      </template>
    </b-modal>
  </div>
</template>
<script>
import http from '../api/config'
export default {
  name: 'ProfileUserComponent',
  data () {
    return {
      registro: {
        autor: '',
        total: 0,
        tipo: ''
      },
      fondo: {
        fecha: new Date()
      },
      retiro: {
        monto: 0,
        _id: '',
        total: 0
      },
      user: {},
      itemAlcancia: {},
      list: []
    }
  },
  created () {
    const usuario = JSON.parse(localStorage.getItem('usuario'))
    this.user = { ...usuario }
    this.registro.autor = usuario.data._id
    this.fondo.autor = usuario.data._id
    this._getAlcancias()
  },
  methods: {
    _retirarFondo () {
      this.retiro.monto = parseInt(this.retiro.monto)
      console.log(typeof this.retiro.monto)
      if (!this.retiro.monto || this.retiro.monto <= 0) {
        this.$swal.fire({
          position: 'top-end',
          icon: 'error',
          title: 'Monto requerido o no valido',
          showConfirmButton: false,
          timerProgressBar: true,
          timer: 4500,
          toast: true
        })
      } else {
        http.put(`/alcancia/${this.retiro._id}`, this.retiro).then(()=> {
          this.$swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Retiro exitoso',
            showConfirmButton: false,
            timerProgressBar: true,
            timer: 4500,
            toast: true
          })
          this._cerrarModal('modal-retiro-fondo')
          this.retiro = {
            monto: 0,
            _id: '',
            autor: ''
          }
          this._getAlcancias()
        }).catch((error) => {
          console.log(error)
          this.$swal.fire({
            position: 'top-end',
            icon: 'error',
            title: 'Error en retiro de fondo',
            showConfirmButton: false,
            timerProgressBar: true,
            timer: 4500,
            toast: true
          })
        })
      }
    },
    _crearFondo () {
      this.fondo.alcancia = this.itemAlcancia._id
      http.post('/fondo', this.fondo).then(() => {
        this.$swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Fondo asignado correctamente',
          showConfirmButton: false,
          timerProgressBar: true,
          timer: 4500,
          toast: true
        })
        this.fondo = {
          fecha: new Date(),
          monto: 0,
          tipo: '',
          autor: this.registro.autor
        }
        this._cerrarModal('modal-registro-fondo')
        this._getAlcancias()
      }).catch(() => {
        this.$swal.fire({
          position: 'top-end',
          icon: 'error',
          title: 'Error en asignación de fondo',
          showConfirmButton: false,
          timerProgressBar: true,
          timer: 4500,
          toast: true
        })
      })
    },
    _registrarFondos (item) {
      this.itemAlcancia = { ...item }
      this.$bvModal.show('modal-registro-fondo')
    },
    _retirarFondos (item) {
      this.retiro.autor = item.autor
      this.retiro.total = item.total
      this.retiro._id = item._id
      this.$bvModal.show('modal-retiro-fondo')
    },
    _getAlcancias () {
      http.get(`/alcancia/${this.registro.autor}`).then((data) => {
        console.log(data, '76')
        this.list = data.data.data
      }).catch((error) => {
        console.log(error)
        this.$swal.fire({
          position: 'top-end',
          icon: 'error',
          title: 'Error en la carga de tus alcancias',
          showConfirmButton: false,
          timerProgressBar: true,
          timer: 4000,
          toast: true
        })
      })
    },
    _cerrarSesion () {
      localStorage.removeItem('usuario')
      this.$router.push({ path: '/' })
    },
    _agregarAlcancia () {
      this.$bvModal.show('modal-registro-alcancia')
    },
    _cerrarModal (id) {
      this.$bvModal.hide(id)
    },
    _crearAlcancia () {
      http.post('/alcancia', this.registro).then(() => {
        this._cerrarModal('modal-registro-alcancia')
        this.$swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Alcancia creada de manera exitosa',
          showConfirmButton: false,
          timerProgressBar: true,
          timer: 4000,
          toast: true
        })
      }).catch(()=>{
        this.$swal.fire({
          position: 'top-end',
          icon: 'error',
          title: 'Se presento un error al crear la alcancia',
          showConfirmButton: false,
          timerProgressBar: true,
          timer: 4000,
          toast: true
        })
      })
    },
    _getTotal (total) {
      var formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      })
      return formatter.format(total);
    }
  }
}
</script>
<style>
  .fz-24 {
    font-size: 34px;
  }
</style>
