export default {
  title: 'Fields'
}

export const Input = () => ({
  name: 'input',
  data () {
    return {
      model: ''
    }
  },
  template: `
    <div class="row q-gutter-lg">
    <div class="col q-mx-lg">
      <q-input v-model="model"
               outlined
               placeholder="Enter your email"/>
    </div>
    <div class="col q-mx-lg">
      <q-input v-model="model"
               outlined
               disable
               placeholder="Enter your email"/>
    </div>
    <div class="col q-mx-lg">
      <q-input v-model="model"
               outlined
               error
               :rules="[ val => val !== null && val !== '' || 'Please type' ]"
               placeholder="Enter your email"/>
    </div>
    </div>`
})

export const Select = () => ({
  name: 'select',
  data () {
    return {
      userName: '',
      filterVal: '',
      searchQuery: '',
      options: [
        'Josh Doel',
        'Gal Saad',
        'Shai Aron'
      ],
      social: []
    }
  },
  methods: {
    filterFn (val, update, abort) {
      const def = ['Google', 'Facebook', 'Twitter', 'Apple', 'Oracle']
      this.filterVal = val
      if (val === '') return
      setTimeout(() => {
        const needle = val.toLowerCase()
        this.social = def.filter(v => v.toLowerCase().indexOf(needle) > -1)
        update()
      }, 1000)
    }
  },
  template: `
    <div>
    <div class="row q-gutter-lg">
      <div class="col q-mx-lg">
        <q-select
          outlined
          v-model="userName"
          use-input
          hide-selected
          fill-input
          placeholder="Find your Epic Name"
          :options="options"
          :rules="[val => !!val || 'Field is required']"
        />
      </div>
      <div class="col q-mx-lg">
        <q-select
          outlined
          v-model="userName"
          use-input
          hide-selected
          fill-input
          disable
          placeholder="Find your Epic Name"
          :options="options"
          :rules="[val => !!val || 'Field is required']"
        />
      </div>
      <div class="col q-mx-lg">
        <q-select
          outlined
          v-model="userName"
          use-input
          hide-selected
          fill-input
          error
          placeholder="Find your Epic Name"
          :options="options"
          :rules="[val => !!val || 'Field is required']"
        />
      </div>
    </div>
    <div class="row q-gutter-lg q-mt-md">
      <div class="col q-mx-lg">
        <label>
          Search field
        </label>
        <q-select
          outlined
          v-model="searchQuery"
          use-input
          hide-selected
          fill-input
          input-debounce="100"
          placeholder="Find your Epic Name"
          :options="options"
          :rules="[val => !!val || 'Field is required']"
          @filter="filterFn"
          class="q-mt-sm"
        >
          <template v-slot:loading v-if="!filterVal || filterVal.length === 0">
          </template>
          <template v-slot:prepend>
            <q-icon name="search" v-if="!userName"/>
          </template>
          <template v-slot:no-option>
            <div class="no-user-result column">
              <div class="col q-mb-sm">
                <img src="./../assets/onboarding/user.svg">
              </div>
              <div class="col text-h5 text-gray">
                No Epic name found
              </div>
              <div class="col text-center q-mt-sm">
                <q-btn flat
                       dense
                       color="dark-pink"
                       @click="userName = null"
                       class="q-btn--no-hover">
                  clear search
                </q-btn>
              </div>
            </div>
          </template>
        </q-select>
      </div>
    </div>
    </div>`
})

export const Textarea = () => ({
  name: 'textarea',
  data () {
    return {
      model: ''
    }
  },
  template: `
    <div class="row q-gutter-lg">
      <div class="col q-mx-lg">
        <q-input v-model="model"
                 type="textarea"
                 outlined
                 placeholder="Enter your text here"/>
      </div>
      <div class="col q-mx-lg">
        <q-input v-model="model"
                 type="textarea"
                 outlined
                 disable
                 placeholder="Enter your text here"/>
      </div>
    </div>`
})

export const RadioBox = () => ({
  name: 'RadioBox',
  data () {
    return {
      difficulty: ''
    }
  },
  template: `
    <div class="row">
    <div class="col-4 q-gutter-lg">
      <div class="text-h5">
        Like button
      </div>
      <q-radio class="like-button-select text-uppercase font-rift" v-model="difficulty" val="1" label="Easy" />
      <q-radio class="like-button-select text-uppercase font-rift" v-model="difficulty" val="2" label="Just right" />
      <q-radio class="like-button-select text-uppercase font-rift" v-model="difficulty" val="3" label="Hard"/>
    </div>
    <div class="col-4 q-gutter-lg">
      <div class="text-h5">
        Default
      </div>
      <q-radio class="text-uppercase font-rift" v-model="difficulty" val="1" label="Easy" />
      <q-radio class="text-uppercase font-rift" v-model="difficulty" val="2" label="Just right" />
      <q-radio class="text-uppercase font-rift" v-model="difficulty" val="3" label="Hard"/>
    </div>
    </div>`
})

export const CheckBox = () => ({
  name: 'CheckBox',
  data () {
    return {
      difficulty: '',
      checkbox: {
        c1: false,
        c2: false,
        c3: false,
        c4: false,
        c5: false,
        c6: false
      }
    }
  },
  template: `
    <div class="row">
    <div class="col-4 q-gutter-lg">
      <div class="text-h5">
        Like button
      </div>
      <q-checkbox class="like-button-select text-uppercase font-rift" v-model="checkbox.c1" label="Easy" />
      <q-checkbox class="like-button-select text-uppercase font-rift" v-model="checkbox.c2" label="Just right" />
      <q-checkbox class="like-button-select text-uppercase font-rift" v-model="checkbox.c3" label="Hard"/>
    </div>
    <div class="col-4 q-gutter-lg">
      <div class="text-h5">
        Default
      </div>
      <q-checkbox class="text-uppercase font-rift" v-model="checkbox.c4" label="Easy" />
      <q-checkbox class="text-uppercase font-rift" v-model="checkbox.c5" label="Just right" />
      <q-checkbox class="text-uppercase font-rift" v-model="checkbox.c6" label="Hard"/>
    </div>
    </div>`
})
