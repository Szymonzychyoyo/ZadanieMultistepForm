<template>
<q-input
v-model="val"
:label="label"
:placeholder="placeholder"
:rules="telRules"
clearable
@update:model-value="$emit('update:modelValue', val)"
@blur="$emit('blur', val)"
/>
</template>


<script setup>
import { computed } from 'vue'


const props = defineProps({
modelValue: { type: String, default: '' },
label: { type: String, default: 'Telefon' },
placeholder: { type: String, default: '' }
})
const emit = defineEmits(['update:modelValue', 'blur'])


const val = computed({
get: () => props.modelValue,
set: (v) => {
// tylko cyfry, spacje, plus i myślniki
const clean = (v || '').replace(/[^0-9 +\-]/g, '')
emit('update:modelValue', clean)
}
})


// dość liberalny wzorzec (7–15 cyfr, opcjonalny +)
const telRegex = /^\+?[0-9][0-9 \-]{6,14}$/
const telRules = [
v => !!v || 'Numer telefonu jest wymagany',
v => telRegex.test(v) || 'Podaj poprawny numer telefonu'
]
</script>