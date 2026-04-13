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
    background: #fff;
    border-radius: 18px;
    padding: 20px;
    border: 1px solid #e5e7eb;
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.06);
    }

    .record-title {
    margin: 0 0 14px;
    font-size: 20px;
    font-weight: 700;
    color: #1f2937;
    }

    .required {
    color: #2563eb;
    }

    .level-options {
    display: flex;
    gap: 10px;
    margin-bottom: 14px;
    }

    .level-btn {
    flex: 1;
    min-height: 52px;
    border: 1px solid #cbd5e1;
    border-radius: 14px;
    background: #f8fafc;
    font-size: 16px;
    font-weight: 700;
    cursor: pointer;
    }

    .level-btn.active {
    background: #dbeafe;
    border-color: #2563eb;
    color: #1d4ed8;
    }

    .memo-textarea {
    width: 100%;
    min-height: 90px;
    border: 1px solid #cbd5e1;
    border-radius: 14px;
    padding: 12px;
    box-sizing: border-box;
    resize: vertical;
    font-size: 15px;
    }
</style>