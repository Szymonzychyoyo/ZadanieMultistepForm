<template>
  <div class="col-12 col-md-4">
    <BaseInputText v-model="item.company" label="Firma" :rules="[req]" />
  </div>
  <div class="col-12 col-md-4">
    <BaseInputText v-model="item.position" label="Stanowisko" :rules="[req]" />
  </div>
  <div class="col-12 col-md-2">
    <BaseInputDate
      v-model="item.dateFrom"
      label="Data od"
      :rules="[req, validDate, notAfterToday, notAfterTo]"
      :max="today"
    />
  </div>
  <div class="col-12 col-md-2">
    <BaseInputDate
      v-model="item.dateTo"
      label="Data do"
      :rules="[req, validDate, notAfterToday, notBeforeFrom]"
      :max="today"
    />
  </div>
  <div class="q-mt-sm flex justify-end">
    <q-btn
      dense
      flat
      color="negative"
      icon="delete"
      label="Usuń"
      @click="$emit('remove')"
    />
  </div>
</template>

<script setup>
import { computed } from "vue";
import BaseInputText from "../inputs/BaseInputText.vue";
import BaseInputDate from "../inputs/BaseInputDate.vue";

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({ company: "", position: "", dateFrom: "", dateTo: "" }),
  },
});
const emit = defineEmits(["update:modelValue", "remove"]);

const item = computed({
  get: () => props.modelValue,
  set: (v) => emit("update:modelValue", v),
});

const req = (v) => !!v || "Pole jest wymagane";
const validDate = (v) => /\d{4}-\d{2}-\d{2}/.test(v) || "Format YYYY-MM-DD";
const today = new Date().toISOString().slice(0, 10);
const notAfterToday = (v) => new Date(v) <= new Date(today) || "Data nie może być późniejsza niż dziś";
const notAfterTo = (v) => {
  const from = new Date(v);
  const to = new Date(item.value.dateTo);
  if (!item.value.dateTo) return true;
  return from <= to || "Data od nie może być późniejsza niż data do";
};
const notBeforeFrom = (v) => {
  const to = new Date(v);
  const from = new Date(item.value.dateFrom);
  if (!item.value.dateFrom) return true;
  return to >= from || "Data do nie może być wcześniejsza niż data od";
};
</script>
