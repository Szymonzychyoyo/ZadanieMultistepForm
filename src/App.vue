<template>
  <div class="q-pa-md flex flex-center">
    <div style="width: 100%; max-width: 900px">
      <q-card flat bordered>
        <q-card-section class="text-h6"
          >Rekrutacja — formularz 3‑krokowy</q-card-section
        >
        <q-separator />
        <q-card-section>
          <MultiStepForm />
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script setup>
import MultiStepForm from "./components/MultiStepForm.vue";
</script>
