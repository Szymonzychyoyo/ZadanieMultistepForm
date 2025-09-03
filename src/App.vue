<template>
  <div class="q-pa-md flex flex-center">
    <div style="width: 100%; max-width: 900px">
      <div class="q-mb-md flex justify-end">
        <q-btn
          flat
          round
          dense
          :icon="$q.dark.isActive ? 'light_mode' : 'dark_mode'"
          @click="toggleDark"
        />
      </div>
      <q-card flat bordered>
        <q-card-section class="text-h6">
          Rekrutacja — formularz 3‑krokowy
        </q-card-section>
        <q-separator />
        <q-card-section>
          <MultiStepForm />
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script setup>
import { useQuasar } from "quasar";
import MultiStepForm from "./components/MultiStepForm.vue";

const $q = useQuasar();

function toggleDark() {
  $q.dark.toggle();
}
</script>
