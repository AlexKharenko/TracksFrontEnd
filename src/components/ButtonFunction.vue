<template>
  <div class="btn-function" :disabled="disabled || false">
    <p class="btn-text">{{ btn_text || "Do" }}</p>
  </div>
</template>

<script>
export default {
  props: ["btn_text", "disabled"],
};
</script>

<style lang="scss">
.btn-function {
  color: var(--btn-first-color);
  padding: 0 15px;
  height: 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
  background: var(--btn-first-bg);
  outline: none;
  border: none;
  cursor: pointer;
  .btn-text::selection {
    display: none;
  }
}
.btn-function:hover {
  background: var(--btn-first-hover-bg);
}
</style>
