<script setup>
import { ref, reactive, computed } from "vue";
import BaseInputText from "./inputs/BaseInputText.vue";
import BaseInputDate from "./inputs/BaseInputDate.vue";
import BaseInputTel from "./inputs/BaseInputTel.vue";
import BaseInputEmail from "./inputs/BaseInputEmail.vue";
import ExperienceRow from "./experience/ExperienceRow.vue";

const step = ref(1);
const saving = ref(false);
const saveResult = ref(null);

const form1 = ref(null);
const form2 = ref(null);

const form = reactive({
  firstName: "",
  lastName: "",
  birthDate: "",
  phone: "",
  email: "",
  experience: [],
});

// proste regexy używane do kropek u góry, bardziej zaawansowane w components/inputs
const telRegex = /^(\d{9}|\d{11})$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const dateRegex = /^\d{4}-\d{2}-\d{2}$/;


const req = (v) => !!v || "Pole jest wymagane";
const validDate = (v) => dateRegex.test(v) || "Format YYYY-MM-DD";
const earlierThanToday = (v) => {
  if (!v || !dateRegex.test(v)) return "Format YYYY-MM-DD";
  const d = new Date(v);
  const t = new Date();
  const todayStart = new Date(t.getFullYear(), t.getMonth(), t.getDate());
  return d < todayStart || "Data musi być wcześniejsza niż dziś";
};

// „kropki done” w Stepperze – nie tylko niepusty, ale i poprawny format
const isStep1Valid = computed(
  () =>
    !!form.firstName &&
    !!form.lastName &&
    dateRegex.test(form.birthDate) &&
    earlierThanToday(form.birthDate) === true
);

const isStep2Valid = computed(
  () => telRegex.test(form.phone) && emailRegex.test(form.email)
);

const isStep3Valid = computed(
  () =>
    form.experience.length > 0 ||
    form.experience.every((r) => {
      if (!r.company || !r.position || !r.dateFrom || !r.dateTo) return false;
      if (!dateRegex.test(r.dateFrom) || !dateRegex.test(r.dateTo))
        return false;
      const today = new Date();
      const todayStart = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
      );
      const from = new Date(r.dateFrom);
      const to = new Date(r.dateTo);
      return from <= to && from <= todayStart && to <= todayStart;
    })
);

function goTo(n) {
  step.value = n;
}

function addExperience() {
  form.experience.push({ company: "", position: "", dateFrom: "", dateTo: "" });
}
function removeExperience(i) {
  form.experience.splice(i, 1);
}

async function validateAll() {
  const r1 = await (form1.value?.validate?.() ?? true);
  const r2 = await (form2.value?.validate?.() ?? true);
  return !!r1 && !!r2 && isStep3Valid.value;
}

async function submitAll() {
  saveResult.value = null;
  const ok = await validateAll();
  if (!ok) {
    saveResult.value = {
      ok: false,
      msg: "Uzupełnij i popraw pola we wszystkich krokach.",
    };
    return;
  }

  saving.value = true;
  try {
    const payload = JSON.parse(JSON.stringify(form));

    const res = await fetch("https://httpbin.org/post", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error("Błąd zapisu");
    saveResult.value = {
      ok: true,
      msg: "Dane wysłane poprawnie.Zobacz konsolę.",
    };
    console.log("Wysłany payload:", payload);
    const echo = await res.json();
    console.log("Echo z httpbin:", echo);
  } catch (e) {
    console.error(e);
    saveResult.value = { ok: false, msg: "Nie udało się wysłać danych." };
  } finally {
    saving.value = false;
  }
}
</script>
<template>
  <q-stepper v-model="step" animated header-nav>
    <q-step :name="1" title="Dane osobowe" :done="isStep1Valid">
      <q-form ref="form1" class="column q-gutter-md">
        <BaseInputText v-model="form.firstName" label="Imię" :rules="[req]" />
        <BaseInputText
          v-model="form.lastName"
          label="Nazwisko"
          :rules="[req]"
        />
        <BaseInputDate
          v-model="form.birthDate"
          label="Data urodzenia"
          :rules="[req, validDate, earlierThanToday]"
        />
      </q-form>

      <q-stepper-navigation>
        <q-btn color="primary" label="Dalej" @click="goTo(2)" />
      </q-stepper-navigation>
    </q-step>

    <q-step :name="2" title="Kontakt" :done="isStep2Valid">
      <q-form ref="form2" class="column q-gutter-md">
        <BaseInputTel
          v-model="form.phone"
          label="Telefon"
          :rules="[
            req,
            (v) => telRegex.test(v) || 'Numer musi mieć 9 lub 11 cyfr',
          ]"
        />
        <BaseInputEmail
          v-model="form.email"
          label="Email"
          :rules="[req, (v) => emailRegex.test(v) || 'Niepoprawny email']"
        />
      </q-form>

      <q-stepper-navigation>
        <q-btn flat label="Wstecz" @click="goTo(1)" />
        <q-btn class="q-ml-sm" color="primary" label="Dalej" @click="goTo(3)" />
      </q-stepper-navigation>
    </q-step>

    <q-step :name="3" title="Doświadczenie" :done="isStep3Valid">
      <div class="row q-col-gutter-md">
        <div
          v-for="(exp, i) in form.experience"
          :key="i"
          class="row col-12 q-col-gutter-md"
        >
          <ExperienceRow
            v-model="form.experience[i]"
            @remove="removeExperience(i)"
          />
        </div>
      </div>
      <div class="q-mt-md">
        <q-btn
          outline
          color="primary"
          icon="add"
          label="Dodaj doświadczenie"
          @click="addExperience"
        />
      </div>
      <div v-if="saveResult" class="q-mt-md">
        <q-banner
          :class="
            saveResult.ok ? 'bg-positive text-white' : 'bg-negative text-white'
          "
        >
          {{ saveResult.msg }}
        </q-banner>
      </div>
      <q-stepper-navigation>
        <q-btn flat label="Wstecz" @click="goTo(2)" />
        <q-btn
          class="q-ml-sm"
          color="primary"
          label="Wyślij"
          :loading="saving"
          @click="submitAll"
        />
      </q-stepper-navigation>
    </q-step>
  </q-stepper>
</template>
