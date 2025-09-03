<template>
  <q-input
    v-model="innerValue"
    :label="label"
    :placeholder="placeholder"
    :rules="rules"
    clearable
    :maxlength="maxlength"
    @update:model-value="$emit('update:modelValue', innerValue)"
    @blur="$emit('blur', innerValue)"
  />
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  modelValue: { type: String, default: "" },
  label: { type: String, default: "" },
  placeholder: { type: String, default: "" },
  rules: { type: Array, default: () => [] },
  maxlength: { type: Number, default: 100 },
});

const emit = defineEmits(["update:modelValue", "blur"]);

// Prosty filtr — bez znaków specjalnych (poza spacją i myślnikiem)
const innerValue = computed({
  get: () => props.modelValue,
  set: (v) => {
    const clean = (v || "").replace(/[^\p{L}0-9 \-]/gu, "");
    emit("update:modelValue", clean);
  },
});
</script>
