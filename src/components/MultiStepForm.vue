<script setup>
import { ref, reactive, computed } from "vue";

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

// proste regexy używane też do „zielonej kropki” kroków
const telRegex = /^\+?[0-9][0-9 \-]{6,14}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

// reguły mogą być wykorzystywane w template (QInput rules)
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
    form.experience.length > 0 &&
    form.experience.every((r) => {
      if (!r.company || !r.position || !r.dateFrom || !r.dateTo) return false;
      if (!dateRegex.test(r.dateFrom) || !dateRegex.test(r.dateTo))
        return false;
      return new Date(r.dateFrom) <= new Date(r.dateTo);
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
  // zabezpieczenie, gdyby refy jeszcze nie były podpięte
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
    // kopia bez reaktywności
    const payload = JSON.parse(JSON.stringify(form));

    // „strzał” do backendu – symulacja
    const res = await fetch("https://httpbin.org/post", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error("Błąd zapisu");
    saveResult.value = {
      ok: true,
      msg: "Dane wysłane poprawnie (symulacja). Zobacz konsolę.",
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
