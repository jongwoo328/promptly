import {ref} from 'vue';

export const store = {
    prompts: ref([]),
    loaded: ref(false), // 데이터 로딩 완료 여부 확인

    // 스토리지 접근 객체
    storage: {
        get(key, callback) {
            if (typeof chrome !== 'undefined' && chrome.storage) {
                chrome.storage.sync.get(key, callback);
            } else {
                const data = {};
                data[key] = JSON.parse(localStorage.getItem(key));
                callback(data);
            }
        },
        set(data, callback) {
            if (typeof chrome !== 'undefined' && chrome.storage) {
                chrome.storage.sync.set(data, callback);
            } else {
                for (const key in data) {
                    localStorage.setItem(key, JSON.stringify(data[key]));
                }
                if (callback) callback();
            }
        },
    },

    // 프롬프트 로드 함수
    async loadPrompts() {
        if (this.loaded.value) return; // 이미 로드된 경우 실행하지 않음
        return new Promise((resolve) => {
            this.storage.get('prompts', (data) => {
                // 불러온 데이터가 배열인지 확인하고, 아니면 빈 배열로 초기화
                if (Array.isArray(data.prompts)) {
                    this.prompts.value = data.prompts;
                } else {
                    this.prompts.value = data.prompts ? Object.values(data.prompts) : [];
                }
                this.loaded.value = true; // 데이터 로딩 완료 표시
                resolve();
            });
        });
    },
};

// 컴포넌트에서 호출할 수 있도록 초기화를 유지함
store.loadPrompts();
