<template>
  <div>
  <!-- toast -->
    <b-toast
      variant="danger"
      id="example-toast5"
      auto-hide-delay="10000"
    >
      <template #toast-title>
        <div class="d-flex flex-grow-1 align-items-center mr-25">
        
          <strong class="mr-auto">UR QnA Login Error</strong>
          <small class="text-muted">Now</small>
        </div>
      </template>
      <span>{{loginError}}</span>
    </b-toast>
    <!-- END toast -->

  <div class="auth-wrapper auth-v2">
    <b-row class="auth-inner m-0">
      <!-- Brand logo-->
      <b-link class="brand-logo">
        <VuexyLogo />

        <h2 class="brand-text text-primary ml-1">UR QnA &emsp;</h2>
        <div @click="skin = isDark ? 'light' : 'dark'">
          <feather-icon size="21" :icon="`${isDark ? 'Sun' : 'Moon'}Icon`" />
        </div>
      </b-link>
      <!-- /Brand logo-->

      <!-- Left Text-->
      <b-col lg="8" class="d-none d-lg-flex align-items-center p-5">
        <div
          class="w-100 d-lg-flex align-items-center justify-content-center px-5"
        >
          <b-img fluid :src="imgUrl" alt="Login V2" />
        </div>
      </b-col>
      <!-- /Left Text-->

      <!-- Login-->
      <b-col lg="4" class="d-flex align-items-center auth-bg px-2 p-lg-5">
        <b-col sm="8" md="6" lg="12" class="px-xl-2 mx-auto">
          <b-card-title
            title-tag="h2"
            class="brand-text text-primary font-weight-bold mb-1"
          >
            Welcome to UR QnA! 👋
          </b-card-title>
          <b-card-text class="mb-2">
            Please sign-in to your account
          </b-card-text>

          <!-- form -->
          <validation-observer ref="loginValidation">
            <b-form class="auth-login-form mt-2" @submit.prevent>
              <!-- email -->
              <b-form-group label="Email" label-for="login-email">
                <validation-provider
                  #default="{ errors }"
                  name="Email"
                  rules="required|email"
                >
                  <b-form-input
                    id="login-email"
                    v-model="userEmail"
                    :state="errors.length > 0 ? false : null"
                    name="login-email"
                    placeholder="john@uregina.ca"
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>

              <!-- forgot password -->
              <b-form-group>
                <div class="d-flex justify-content-between">
                  <label for="login-password">Password</label>
                  <b-link :to="{ name: 'forgot-password' }">
                    <small>Forgot Password?</small>
                  </b-link>
                </div>
                <validation-provider
                  #default="{ errors }"
                  name="Password"
                  rules="required"
                >
                  <b-input-group
                    class="input-group-merge"
                    :class="errors.length > 0 ? 'is-invalid' : null"
                  >
                    <b-form-input
                      id="login-password"
                      v-model="password"
                      :state="errors.length > 0 ? false : null"
                      class="form-control-merge"
                      :type="passwordFieldType"
                      name="login-password"
                      placeholder="············"
                    />
                    <b-input-group-append is-text>
                      <feather-icon
                        class="cursor-pointer"
                        :icon="passwordToggleIcon"
                        @click="togglePasswordVisibility"
                      />
                    </b-input-group-append>
                  </b-input-group>
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>

              <!-- submit buttons -->
              <b-button
                type="submit"
                variant="primary"
                block
                @click="validationForm"
              >
                Sign in
              </b-button>
            </b-form>
          </validation-observer>

          <b-card-text class="text-center mt-2">
            <span>New on our platform? </span>
            <b-link :to="{ name: 'register' }">
              <span>&nbsp;Create an account</span>
            </b-link>
          </b-card-text>
        </b-col>
      </b-col>
      <!-- /Login-->
    </b-row>
  </div>
  </div>
</template>

<script>
/* eslint-disable global-require */
import { ValidationProvider, ValidationObserver } from "vee-validate";
import VuexyLogo from "@core/layouts/components/Logo.vue";
import {
  BRow,
  BCol,
  BLink,
  BFormGroup,
  BFormInput,
  BInputGroupAppend,
  BInputGroup,
  BFormCheckbox,
  BCardText,
  BCardTitle,
  BImg,
  BForm,
  BButton,
  BToast,
} from "bootstrap-vue";
import { required, email } from "@validations";
import { togglePasswordVisibility } from "@core/mixins/ui/forms";
import ToastificationContent from "@core/components/toastification/ToastificationContent.vue";
import { BFormRadio } from "bootstrap-vue";
import useAppConfig from "@core/app-config/useAppConfig";
import { computed } from "@vue/composition-api";
import { getAuth, setPersistence, signInWithEmailAndPassword ,browserLocalPersistence} from '@firebase/auth';


export default {
  setup() {
    const { skin } = useAppConfig();

    const isDark = computed(() => skin.value === "dark");

    return { skin, isDark };
  },
  components: {
    BToast,
    BRow,
    BCol,
    BLink,
    BFormGroup,
    BFormInput,
    BInputGroupAppend,
    BInputGroup,
    BFormCheckbox,
    BCardText,
    BCardTitle,
    BImg,
    BForm,
    BButton,
    VuexyLogo,
    ValidationProvider,
    ValidationObserver,
  },
  mixins: [togglePasswordVisibility],
  data() {
    return {
      status: "",
      password: "",
      userEmail: "",
      sideImg: require("@/assets/images/pages/UR_Logo_Primary_Black.png"),
      // validation rulesimport store from '@/store/index'
      required,
      email,
      loginError: '',
    };
  },
  computed: {
    // Gets called every time any of the varibales inside changes
    passwordToggleIcon() {
      return this.passwordFieldType === "password" ? "EyeIcon" : "EyeOffIcon";
    },
    imgUrl() {
      if (this.$store.state.appConfig.layout.skin === "dark") {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.sideImg = require("@/assets/images/pages/UR_Logo_Primary_Reverse_White.png");
        return this.sideImg;
      } else if (this.$store.state.appConfig.layout.skin === "light") {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.sideImg = require("@/assets/images/pages/UR_Logo_Primary_Black.png");
        return this.sideImg;
      }
      return this.sideImg;
    },
  },
  methods: {
    validationForm() {
      this.$refs.loginValidation.validate().then((success) => {
        if (success) {
          this.userEmail;
          this.password;
          const auth = getAuth();
          setPersistence(auth, browserLocalPersistence).then(()=>{
            signInWithEmailAndPassword(auth, this.userEmail, this.password)
          .then((userCredential)=>{
            const user = userCredential.user;
            //console.log(user);
            this.$store.dispatch('user/getUserProfile').then(() => {
                if (this.$store.state.user.user.SelectedStudentOrEmployee == "Student"){
                  this.$router.push({ name: 'student-dashboard' })
                } else {
                  this.$router.push({ name: 'employee-dashboard' })
                } 
            })
            
            }).catch((error)=>{
              this.loginError = error.message
              this.$bvToast.show('example-toast5')
              // Error for sign in with email
              // console.log(error.message);
              // console.log(error.code);
            })
          }).catch((error)=>{
            this.loginError = error.message
            this.$bvToast.show('example-toast5')
              // Error for setting persistence
              // console.log(error.message);
              // console.log(error.code);

          })
          

          // this.$toast({
          //   component: ToastificationContent,
          //   props: {
          //     title: 'Form Submitted',
          //     icon: 'EditIcon',
          //     variant: 'success',
          //   },
          // })
        }
      });
    },
  },
};
</script>

<style lang="scss">
@import "@core/scss/vue/pages/page-auth.scss";
</style>
