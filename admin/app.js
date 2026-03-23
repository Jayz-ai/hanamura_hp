const { createApp, ref, computed, onMounted } = Vue;

createApp({
    setup() {
        // State
        const newsList = ref([]);
        const currentTab = ref('public'); // 'public', 'archive'
        const editingItem = ref(null);
        const editingForm = ref({});
        const isDeploying = ref(false);

        // Fetch news from server
        const fetchNews = async () => {
            try {
                const res = await fetch('/api/news');
                const data = await res.json();
                newsList.value = data;
            } catch (e) {
                console.error('Failed to fetch news', e);
            }
        };

        // Save news to server
        const saveNewsToServer = async () => {
            try {
                const res = await fetch('/api/news', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newsList.value)
                });
                if (!res.ok) throw new Error('Failed to save');
            } catch (e) {
                console.error('Failed to save news', e);
                alert('保存に失敗しました');
            }
        };

        onMounted(() => {
            fetchNews();
        });

        // Computed
        const filteredNews = computed(() => {
            if (currentTab.value === 'public') {
                return newsList.value.filter(item => item.status !== 'archive');
            } else {
                return newsList.value.filter(item => item.status === 'archive');
            }
        });

        // Methods
        const getStatusLabel = (status) => {
            switch (status) {
                case 'public': return '公開中';
                case 'hidden': return '非公開 (準備中)';
                case 'archive': return 'アーカイブ';
                default: return status;
            }
        };

        const truncateText = (text, maxLength) => {
            if (!text) return '';
            if (text.length <= maxLength) return text;
            return text.substring(0, maxLength) + '...';
        };

        const createNewArticle = () => {
            const today = new Date();
            const yyyy = today.getFullYear();
            const mm = String(today.getMonth() + 1).padStart(2, '0');
            const dd = String(today.getDate()).padStart(2, '0');
            const dateStr = `${yyyy}.${mm}.${dd}`;

            editingItem.value = {};
            editingForm.value = {
                id: `news-${Date.now()}`,
                date: dateStr,
                title: '',
                content: '',
                status: 'hidden' // デフォルトは非公開
            };
        };

        const editArticle = (item) => {
            editingItem.value = item;
            editingForm.value = JSON.parse(JSON.stringify(item));
        };

        const cancelEdit = () => {
            editingItem.value = null;
            editingForm.value = {};
        };

        const saveEdit = async () => {
            if (!editingForm.value.title || !editingForm.value.date) {
                alert('タイトルと日付は必須です');
                return;
            }

            const index = newsList.value.findIndex(item => item.id === editingForm.value.id);
            if (index !== -1) {
                // Update
                newsList.value[index] = { ...editingForm.value };
            } else {
                // Add new (to the top)
                newsList.value.unshift({ ...editingForm.value });
            }

            await saveNewsToServer();
            cancelEdit();
        };

        const deleteArticle = async () => {
            if (!confirm('本当に削除してもよろしいですか？（この操作は元に戻せません）')) return;
            
            newsList.value = newsList.value.filter(item => item.id !== editingForm.value.id);
            await saveNewsToServer();
            cancelEdit();
        };

        const toggleArchive = async (item) => {
            const index = newsList.value.findIndex(i => i.id === item.id);
            if (index === -1) return;

            if (newsList.value[index].status === 'archive') {
                newsList.value[index].status = 'hidden'; // アーカイブ解除時は一旦非公開に
            } else {
                newsList.value[index].status = 'archive';
            }
            await saveNewsToServer();
        };

        const moveUp = async (filteredIndex) => {
            if (filteredIndex === 0) return;
            // フィルタされた配列上での位置から元のインデックスを見つける
            const itemToMove = filteredNews.value[filteredIndex];
            const originalIdx = newsList.value.findIndex(i => i.id === itemToMove.id);
            
            // 1つ上のアイテムを見つける（同じタブ内の）
            const targetItem = filteredNews.value[filteredIndex - 1];
            const targetOriginalIdx = newsList.value.findIndex(i => i.id === targetItem.id);

            // 要素を入れ替える
            const temp = newsList.value[originalIdx];
            newsList.value[originalIdx] = newsList.value[targetOriginalIdx];
            newsList.value[targetOriginalIdx] = temp;

            await saveNewsToServer();
        };

        const moveDown = async (filteredIndex) => {
            if (filteredIndex === filteredNews.value.length - 1) return;
            
            const itemToMove = filteredNews.value[filteredIndex];
            const originalIdx = newsList.value.findIndex(i => i.id === itemToMove.id);
            
            const targetItem = filteredNews.value[filteredIndex + 1];
            const targetOriginalIdx = newsList.value.findIndex(i => i.id === targetItem.id);

            const temp = newsList.value[originalIdx];
            newsList.value[originalIdx] = newsList.value[targetOriginalIdx];
            newsList.value[targetOriginalIdx] = temp;

            await saveNewsToServer();
        };

        const deployToProduction = async () => {
            if (!confirm('現在の状態をGitHub Pagesに反映(公開)してよろしいでしょうか？')) return;

            isDeploying.value = true;
            try {
                const res = await fetch('/api/deploy', { method: 'POST' });
                const data = await res.json();
                if (data.success) {
                    alert('反映が完了しました！\n数分以内に本番サイトに反映されます。');
                } else {
                    alert(`反映に失敗しました。\nエラー: ${data.error || '不明なエラー'}`);
                }
            } catch (e) {
                console.error('Deploy error', e);
                alert('サーバーとの通信に失敗しました。');
            } finally {
                isDeploying.value = false;
            }
        };

        return {
            newsList,
            currentTab,
            filteredNews,
            editingItem,
            editingForm,
            isDeploying,
            getStatusLabel,
            truncateText,
            createNewArticle,
            editArticle,
            cancelEdit,
            saveEdit,
            deleteArticle,
            toggleArchive,
            moveUp,
            moveDown,
            deployToProduction
        };
    }
}).mount('#app');
