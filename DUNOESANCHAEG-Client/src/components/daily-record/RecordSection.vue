<template>
    <section class="record-card">
        <h3 class="record-title">
        {{ title }} <span v-if="required" class="required">*</span>
        </h3>

        <div class="level-options">
        <button
            type="button"
            class="level-btn"
            :class="{ active: selectedLevel === 'GOOD' }"
            @click="$emit('update:selectedLevel', 'GOOD')"
        >
            😄 좋음
        </button>

        <button
            type="button"
            class="level-btn"
            :class="{ active: selectedLevel === 'MID' }"
            @click="$emit('update:selectedLevel', 'MID')"
        >
            😐 중간
        </button>

        <button
            type="button"
            class="level-btn"
            :class="{ active: selectedLevel === 'BAD' }"
            @click="$emit('update:selectedLevel', 'BAD')"
        >
            😟 나쁨
        </button>
        </div>

        <textarea
        class="memo-textarea"
        :value="memo"
        :placeholder="placeholder"
        @input="$emit('update:memo', $event.target.value)"
        />
    </section>
    </template>

    <script setup>
    defineProps({
    title: String,
    required: Boolean,
    selectedLevel: String,
    memo: String,
    placeholder: String,
    });

    defineEmits(['update:selectedLevel', 'update:memo']);
    </script>

    <style scoped>
    .record-card {
    background: var(--color-surface);
    border-radius: var(--radius-card);
    padding: 20px;
    border: 1px solid var(--color-surface-variant);
    box-shadow: 0 6px 18px rgba(17, 24, 39, 0.05);
    }

    .record-title {
    margin: 0 0 14px;
    font-size: var(--text-xl);
    font-weight: 700;
    color: var(--color-text-main);
    line-height: var(--text-xl--line-height);
    }

    .required {
    color: var(--color-brand-green);
    }

    .level-options {
    display: flex;
    gap: 10px;
    margin-bottom: 14px;
    }

    .level-btn {
    flex: 1;
    min-height: 52px;
    border: 1px solid var(--color-surface-variant);
    border-radius: 14px;
    background: var(--color-brand-blue);
    color: var(--color-text-sub);
    font-size: var(--text-base);
    font-weight: 700;
    cursor: pointer;
    transition: background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease, transform 0.2s ease;
    }

    .level-btn.active {
    background: var(--color-brand-green);
    border-color: var(--color-brand-green);
    color: #ffffff;
    transform: translateY(-1px);
    }

    .memo-textarea {
    width: 100%;
    min-height: 90px;
    border: 1px solid var(--color-surface-variant);
    border-radius: 14px;
    padding: 12px;
    box-sizing: border-box;
    resize: vertical;
    background: var(--color-surface);
    color: var(--color-text-main);
    font-size: var(--text-sm);
    line-height: var(--text-sm--line-height);
    }

    .memo-textarea::placeholder {
    color: var(--color-text-muted);
    }
</style>
