import { createApp } from 'vue';
import App from './App.vue';
import PrimeVue from 'primevue/config';

// PrimeVue 테마 및 CSS
import 'primevue/resources/themes/saga-blue/theme.css';
import 'primevue/resources/primevue.min.css';
import 'primeicons/primeicons.css';

// PrimeVue 컴포넌트 등록
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import Dropdown from 'primevue/dropdown';
import Dialog from 'primevue/dialog';
import ToastService from 'primevue/toastservice';
import Toast from 'primevue/toast';

const app = createApp(App);

app.use(PrimeVue);
app.use(ToastService);

app.component('Button', Button);
app.component('InputText', InputText);
app.component('Textarea', Textarea);
app.component('Dropdown', Dropdown);
app.component('Dialog', Dialog);
app.component('Toast', Toast);

app.mount('#app');
