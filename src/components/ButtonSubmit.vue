<template>
  <button class="btn-submit" type="submit" :disabled="disabled || false">
    <p class="btn-text">{{ btn_text || "Submit" }}</p>
  </button>
</template>

<script>
export default {
  props: ["btn_text", "disabled"],
};
</script>

<style>
.btn-submit {
  color: var(--btn-first-color);
  padding: 0 15px;
  height: 40px;
  text-align: center;
  background: var(--btn-first-bg);
  outline: none;
  border: none;
  cursor: pointer;
}
.btn-submit:hover {
  background: var(--btn-first-hover-bg);
}
</style>
