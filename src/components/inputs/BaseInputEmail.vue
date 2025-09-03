<template>
  <q-input
    v-model="val"
    type="email"
    :label="label"
    :placeholder="placeholder"
    :rules="emailRules"
    clearable
    @update:model-value="$emit('update:modelValue', val)"
    @blur="$emit('blur', val)"
  />
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  modelValue: { type: String, default: "" },
  label: { type: String, default: "E-mail" },
  placeholder: { type: String, default: "" },
});
const emit = defineEmits(["update:modelValue", "blur"]);

const val = computed({
  get: () => props.modelValue,
  set: (v) => emit("update:modelValue", v),
});

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const emailRules = [
  (v) => !!v || "E-mail jest wymagany",
  (v) => emailRegex.test(v) || "Podaj poprawny adres e-mail",
];
</script>
