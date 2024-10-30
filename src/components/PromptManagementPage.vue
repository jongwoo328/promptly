<template>
  <div class="container" v-if="store.loaded">
    <Textarea
        v-model="newPrompt"
        rows="3"
        cols="30"
        placeholder="새로운 프롬프트 입력"
        class="textarea"
    />
    <Button label="프롬프트 추가" @click="addPrompt" class="add-button" />

    <ul class="prompt-list">
      <li v-for="(prompt, index) in prompts" :key="index" class="prompt-card">
        <div class="prompt-content">
          <div v-if="editingIndex === index" class="edit-mode">
            <!-- 인라인 편집 모드 (Textarea 사용) -->
            <Textarea
                v-model="editedPrompt"
                rows="3"
                class="input-edit"
                autoResize
            />
            <div class="prompt-actions">
              <Button
                  icon="pi pi-check"
                  class="save-button"
                  @click="saveEditedPrompt(index)"
                  aria-label="Save"
              />
              <Button
                  icon="pi pi-times"
                  class="cancel-button"
                  @click="cancelEdit"
                  aria-label="Cancel"
              />
            </div>
          </div>
          <div v-else class="view-mode">
            <!-- 일반 모드 -->
            <p class="prompt-text">{{ prompt }}</p>
            <div class="prompt-actions">
              <Button
                  icon="pi pi-pencil"
                  class="edit-button"
                  @click="editPrompt(index)"
                  aria-label="Edit"
              />
              <Button
                  icon="pi pi-copy"
                  class="duplicate-button"
                  @click="duplicatePrompt(index)"
                  aria-label="Duplicate"
              />
              <Button
                  icon="pi pi-trash"
                  class="delete-button"
                  @click="deletePrompt(index)"
                  aria-label="Delete"
              />
            </div>
          </div>
        </div>
      </li>
    </ul>
  </div>
  <div v-else>
    <p>로딩 중...</p>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useToast } from 'primevue/usetoast';
import { store } from '../store.js';

export default {
  name: 'PromptManagementPage',
  setup() {
    const newPrompt = ref('');
    const editedPrompt = ref('');
    const editingIndex = ref(-1);

    const toast = useToast();

    // 스토어의 prompts 사용
    const prompts = store.prompts;

    // 스토어의 storage 사용
    const storage = store.storage;

    // 데이터 로드 완료 상태
    store.loadPrompts();

    const addPrompt = () => {
      if (newPrompt.value.trim()) {
        store.prompts.value.push(newPrompt.value.trim());
        storage.set({ prompts: store.prompts.value }, () => {
          toast.add({
            severity: 'success',
            summary: '성공',
            detail: '프롬프트가 추가되었습니다.',
            life: 1000,
          });
          newPrompt.value = '';
        });
      }
    };

    const editPrompt = (index) => {
      editingIndex.value = index;
      editedPrompt.value = store.prompts.value[index];
    };

    const saveEditedPrompt = (index) => {
      if (editingIndex.value > -1 && editedPrompt.value.trim()) {
        store.prompts.value[index] = editedPrompt.value;
        storage.set({ prompts: store.prompts.value }, () => {
          toast.add({
            severity: 'success',
            summary: '성공',
            detail: '프롬프트가 수정되었습니다.',
            life: 1000,
          });
          editingIndex.value = -1; // 편집 모드 종료
        });
      }
    };

    const cancelEdit = () => {
      editingIndex.value = -1; // 편집 모드 종료
      editedPrompt.value = ''; // 수정 중인 프롬프트 초기화
    };

    const deletePrompt = (index) => {
      store.prompts.value.splice(index, 1);
      storage.set({ prompts: store.prompts.value }, () => {
        toast.add({
          severity: 'success',
          summary: '성공',
          detail: '프롬프트가 삭제되었습니다.',
          life: 1000,
        });
      });
    };

    const duplicatePrompt = (index) => {
      const promptToDuplicate = store.prompts.value[index];
      store.prompts.value.splice(index + 1, 0, promptToDuplicate); // 선택한 프롬프트 복제 후 바로 다음 위치에 삽입
      storage.set({ prompts: store.prompts.value }, () => {
        toast.add({
          severity: 'success',
          summary: '성공',
          detail: '프롬프트가 복제되었습니다.',
          life: 1000,
        });
      });
    };

    return {
      prompts,
      newPrompt,
      addPrompt,
      editPrompt,
      saveEditedPrompt,
      cancelEdit,
      deletePrompt,
      duplicatePrompt,
      editedPrompt,
      editingIndex,
      store,
    };
  },
};
</script>

<style scoped>
.container {
  max-width: 100%;
  padding: 1em;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.textarea {
  width: 100%;
  max-width: 600px;
}

.add-button {
  width: 100%;
  max-width: 600px;
  margin-top: 0.5em;
}

.prompt-list {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 600px;
  gap: 1em;
  list-style: none;
  padding: 0;
}

.prompt-card {
  padding: 1em;
  border: 1px solid #ddd;
  border-radius: 5px;
  background-color: #f9f9f9;
  width: 100%;
}

.prompt-content {
  display: flex;
  flex-direction: column;
}

.prompt-text {
  margin: 0 0 0.5rem 0;
  word-wrap: break-word;
  font-size: 1em;
}

.edit-mode, .view-mode {
  display: flex;
  flex-direction: column;
}

.prompt-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
  justify-content: flex-end;
}

.input-edit {
  width: 100%;
  margin-bottom: 0.5rem;
}
</style>
