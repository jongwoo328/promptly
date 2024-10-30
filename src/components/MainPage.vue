<template>
  <div class="container">
    <div class="dropdown-container">
      <Dropdown
          :options="prompts"
          optionLabel="text"
          optionValue="value"
          v-model="selectedPrompt"
          placeholder="프롬프트를 선택하세요"
          style="width: 100%; margin-bottom: 1rem;"
      />

      <div v-if="variables.length" class="variables-container">
        <div
            v-for="(variable, index) in variables"
            :key="index"
            class="p-field variable-field"
        >
          <label :for="'var_' + index">{{ variable }} 입력:</label>
          <component
              :is="userInputs[variable].length > 50 ? 'Textarea' : 'InputText'"
              v-model="userInputs[variable]"
              :id="'var_' + index"
              :rows="userInputs[variable].length > 50 ? 3 : 1"
              autoResize
              class="variable-input"
          />
        </div>
      </div>
    </div>
    <div class="button-container">
      <Button
          label="결과 보기"
          @click="generatePrompt"
          class="result-button"
          :disabled="!selectedPrompt"
      />
    </div>
    <div v-if="filledPrompt" class="p-mt-3">
      <p><strong>결과:</strong></p>
      <pre class="result-block">{{ filledPrompt }}</pre>
      <div class="button-container">
        <Button
            label="ChatGPT로 보내기"
            icon="pi pi-external-link"
            iconPos="right"
            @click="sendToChatGPT"
            class="p-mt-2 p-button-primary"
        />
        <Button
            label="복사"
            icon="pi pi-copy"
            iconPos="right"
            @click="copyToClipboard"
            class="p-mt-2 p-button-secondary"
        />
      </div>
    </div>
  </div>
</template>

<script>
import {computed, reactive, ref, watch} from 'vue';
import {store} from '../store.js';
import {useToast} from 'primevue/usetoast';

export default {
  name: 'MainPage',
  setup() {
    const toast = useToast();
    const selectedPrompt = ref(null);
    const variables = ref([]);
    const userInputs = reactive({});
    const filledPrompt = ref('');

    // 스토어의 prompts 사용
    const prompts = computed(() => {
      return store.prompts.value.map((prompt, index) => ({
        text: prompt,
        value: prompt,
        id: index,
      }));
    });

    // 프롬프트 변경 감지
    watch(selectedPrompt, (newPrompt) => {
      if (newPrompt) {
        // 변수 추출
        const varMatches = newPrompt.match(/{(.*?)}/g);
        variables.value = varMatches
            ? varMatches.map((v) => v.replace(/[{}]/g, ''))
            : [];
        // 입력 초기화
        variables.value.forEach((variable) => {
          userInputs[variable] = '';
        });
        filledPrompt.value = '';
      } else {
        variables.value = [];
      }
    });

    // 정규식 특수 문자 이스케이프 함수
    function escapeRegExp(string) {
      return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    // 프롬프트 생성 함수
    const generatePrompt = () => {
      if (selectedPrompt.value) {
        let tempPrompt = selectedPrompt.value;
        variables.value.forEach((variable) => {
          const value = userInputs[variable] || '';
          const escapedVariable = escapeRegExp(variable);
          tempPrompt = tempPrompt.replace(
              new RegExp(`\\{${escapedVariable}\\}`, 'g'),
              value
          );
        });
        filledPrompt.value = tempPrompt;
      }
    };

    // ChatGPT로 전달 함수
    const sendToChatGPT = () => {
      if (filledPrompt.value) {
        const encodedPrompt = encodeURIComponent(filledPrompt.value);
        const url = `https://chat.openai.com/?model=gpt-4&q=${encodedPrompt}`;
        window.open(url, '_blank');
      }
    };

    // 클립보드 복사 함수
    const copyToClipboard = async () => {
      try {
        await navigator.clipboard.writeText(filledPrompt.value);
        toast.add({
          severity: 'success',
          summary: '복사 완료',
          detail: '프롬프트가 클립보드에 복사되었습니다!',
          life: 1000,
        });
      } catch (error) {
        toast.add({
          severity: 'error',
          summary: '복사 실패',
          detail: '클립보드에 복사할 수 없습니다.',
          life: 1000,
        });
      }
    };

    return {
      prompts,
      selectedPrompt,
      variables,
      userInputs,
      generatePrompt,
      filledPrompt,
      sendToChatGPT,
      copyToClipboard,
      store,
    };
  },
};
</script>

<style scoped>
.p-field {
  margin-top: 1em;
}

.variable-input {
  width: 100%;
}

.dropdown-container {
  margin-bottom: 1.5rem; /* Dropdown과 변수 입력 필드 사이의 여백 */
}

.variables-container {
  margin-top: 1rem;
}

.variable-field {
  margin-bottom: 1rem; /* 각 변수 필드 사이의 여백 */
}

.button-container {
  display: flex;
  justify-content: flex-end; /* 우측 정렬 */
  gap: 0.5rem; /* 버튼 사이 간격 */
  margin-top: 1rem;
}

.result-block {
  background-color: #f5f5f5; /* 코드 블럭 느낌을 주기 위한 회색 배경 */
  padding: 1rem;
  border-radius: 4px;
  font-family: monospace;
  white-space: pre-wrap; /* 줄바꿈이 적용되도록 */
  border: 1px solid #ddd;
  overflow-x: auto;
}
</style>
