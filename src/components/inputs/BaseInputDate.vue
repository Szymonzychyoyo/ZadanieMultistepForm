<template>
  <q-input
    v-model="val"
    :label="label"
    :placeholder="placeholder || 'YYYY-MM-DD'"
    mask="####-##-##"
    :rules="rulesToUse"
    clearable
    @blur="$emit('blur', val)"
  >
    <template #append>
      <q-icon name="event" class="cursor-pointer" @mousedown.prevent>
        <q-popup-proxy
          v-model="show"
          cover
          transition-show="scale"
          transition-hide="scale"
        >
          <q-date
            v-model="val"
            mask="YYYY-MM-DD"
            :max="max"
            @update:model-value="show = false"
          />
        </q-popup-proxy>
      </q-icon>
    </template>
  </q-input>
</template>

<script setup>
import { ref, computed } from "vue";

const props = defineProps({
  modelValue: { type: String, default: "" },
  label: { type: String, default: "Data" },
  placeholder: { type: String, default: "" },
  rules: { type: Array, default: () => [] },
  max: { type: String, default: null },
});
const emit = defineEmits(["update:modelValue", "blur"]);

const show = ref(false);
const val = computed({
  get: () => props.modelValue,
  set: (v) => emit("update:modelValue", v),
});

const baseRules = [
  (v) => !!v || "Data jest wymagana",
  (v) => /^\d{4}-\d{2}-\d{2}$/.test(v) || "Format YYYY-MM-DD",
];
const rulesToUse = computed(() => [...baseRules, ...props.rules]);
</script>
