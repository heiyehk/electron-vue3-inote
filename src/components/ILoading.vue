<template>
  <div class="comp-loading flex-center">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      style="margin:auto;background:#fff;display:block;"
      width="80px"
      height="80px"
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid"
    >
      <g>
        <animateTransform
          attributeName="transform"
          type="rotate"
          values="0 50 50;120 50 50"
          keyTimes="0;1"
          dur="0.47846889952153115s"
          repeatCount="indefinite"
        ></animateTransform>
        <circle
          cx="50"
          cy="50"
          r="26"
          stroke="#e15b64"
          fill="none"
          stroke-dasharray="27.22713633111154 163.36281798666926"
          stroke-linecap="round"
          stroke-width="3"
          transform="rotate(0 50 50)"
        >
          <animate
            attributeName="stroke"
            values="#e15b64;#f47e60"
            keyTimes="0;1"
            dur="0.47846889952153115s"
            repeatCount="indefinite"
          ></animate>
        </circle>
        <circle
          cx="50"
          cy="50"
          r="26"
          stroke="#f47e60"
          fill="none"
          stroke-dasharray="27.22713633111154 163.36281798666926"
          stroke-linecap="round"
          stroke-width="3"
          transform="rotate(120 50 50)"
        >
          <animate
            attributeName="stroke"
            values="#f47e60;#f8b26a"
            keyTimes="0;1"
            dur="0.47846889952153115s"
            repeatCount="indefinite"
          ></animate>
        </circle>
        <circle
          cx="50"
          cy="50"
          r="26"
          stroke="#f8b26a"
          fill="none"
          stroke-dasharray="27.22713633111154 163.36281798666926"
          stroke-linecap="round"
          stroke-width="3"
          transform="rotate(240 50 50)"
        >
          <animate
            attributeName="stroke"
            values="#f8b26a;#e15b64"
            keyTimes="0;1"
            dur="0.47846889952153115s"
            repeatCount="indefinite"
          ></animate>
        </circle>
      </g>
    </svg>
  </div>
</template>

<style lang="less">
.comp-loading {
  width: 100%;
  height: 100%;
}
</style>
