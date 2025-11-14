<template>
  <div class="hamster"></div>
</template>

<style lang="scss">
.hamster {
  width: 100%;
  height: 100%;
  position: relative;

  &::before {
    content: "";
    width: 100%;
    height: 100%;
    background: linear-gradient(#7da0ea, #363ca0);
    position: absolute;
    left: 0;
    top: 0;
  }

  &::after {
    content: "Hamster";
    width: 296px;
    height: 296px;
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    left: 50%;
    margin-left: -148px;
    top: 124px;
    color: #ffffff;
  }
}
</style>
