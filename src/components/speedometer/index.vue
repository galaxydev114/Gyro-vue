<template>
  <div class="speedometer"
       :class="`speedometer--${sizeClass} ${animated ? 'animated' : 'no-animation'}`">
    <q-resize-observer @resize="resizeIframe"/>
    <div class="speedometer__main">
      <svg class="speedometer__main-svg" viewBox="0 0 487 469" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g class="anim anim--1 main-bg" filter="url(#filter0_f_19007_81572)">
          <circle cx="234.5" cy="234.5" r="232.5" fill="url(#paint0_linear_19007_81572)"/>
          <circle cx="234.5" cy="234.5" r="232.327" stroke="url(#paint1_linear_19007_81572)" stroke-width="0.345358"/>
        </g>
        <g class="anim anim--2 dots">
          <path fill-rule="evenodd" clip-rule="evenodd"
                d="M340.395 355.876C339.936 356.316 339.916 357.044 340.352 357.506L342.243 359.506C342.68 359.968 343.409 359.989 343.868 359.548C344.547 358.897 345.22 358.239 345.887 357.576C346.337 357.127 346.334 356.398 345.882 355.951L343.927 354.014C343.475 353.566 342.746 353.57 342.295 354.019C341.667 354.643 341.034 355.262 340.395 355.876ZM370.719 314.864C370.433 315.431 370.655 316.125 371.22 316.416L373.667 317.675C374.233 317.966 374.927 317.744 375.214 317.176C375.426 316.757 375.636 316.336 375.845 315.913C376.053 315.491 376.26 315.068 376.465 314.645C376.741 314.072 376.496 313.386 375.921 313.113L373.434 311.935C372.859 311.663 372.173 311.908 371.897 312.48C371.704 312.879 371.51 313.277 371.313 313.675C371.117 314.072 370.919 314.468 370.719 314.864ZM385.722 266.114C385.64 266.744 386.079 267.325 386.709 267.412L389.436 267.788C390.065 267.875 390.647 267.435 390.729 266.804C390.851 265.871 390.964 264.937 391.069 264.002C391.14 263.37 390.68 262.804 390.048 262.738L387.311 262.451C386.679 262.385 386.113 262.844 386.042 263.476C385.943 264.356 385.836 265.235 385.722 266.114ZM383.703 215.148C383.834 215.77 384.442 216.173 385.065 216.046L387.762 215.496C388.385 215.369 388.787 214.761 388.655 214.139C388.558 213.679 388.459 213.219 388.357 212.759C388.256 212.299 388.152 211.84 388.046 211.382C387.904 210.762 387.282 210.38 386.664 210.527L383.987 211.165C383.368 211.312 382.987 211.933 383.129 212.553C383.229 212.984 383.326 213.416 383.422 213.849C383.517 214.282 383.611 214.715 383.703 215.148ZM364.891 167.738C365.221 168.281 365.928 168.459 366.473 168.132L368.835 166.719C369.38 166.393 369.558 165.686 369.228 165.142C368.739 164.339 368.243 163.539 367.739 162.744C367.399 162.207 366.686 162.053 366.152 162.397L363.838 163.887C363.303 164.231 363.149 164.943 363.489 165.48C363.963 166.229 364.43 166.981 364.891 167.738ZM331.417 129.254C331.909 129.656 332.634 129.59 333.041 129.101L334.8 126.984C335.206 126.495 335.139 125.769 334.648 125.366C334.284 125.068 333.918 124.772 333.551 124.477C333.184 124.182 332.816 123.889 332.447 123.597C331.948 123.203 331.224 123.294 330.834 123.796L329.145 125.969C328.755 126.471 328.846 127.194 329.345 127.588C329.692 127.863 330.039 128.139 330.384 128.416C330.73 128.694 331.074 128.973 331.417 129.254ZM126.808 359.376C127.266 359.817 127.995 359.797 128.432 359.336L130.326 357.339C130.764 356.878 130.744 356.15 130.286 355.709C129.649 355.094 129.016 354.474 128.389 353.849C127.939 353.4 127.21 353.395 126.758 353.841L124.799 355.775C124.347 356.222 124.342 356.951 124.792 357.4C125.458 358.065 126.13 358.723 126.808 359.376ZM95.5291 316.954C95.8149 317.522 96.509 317.745 97.0748 317.455L99.524 316.2C100.09 315.91 100.313 315.217 100.027 314.649C99.8283 314.253 99.631 313.856 99.4353 313.459C99.2396 313.061 99.0458 312.662 98.8537 312.263C98.5781 311.69 97.8924 311.444 97.3174 311.715L94.8285 312.89C94.2535 313.161 94.0069 313.847 94.2824 314.42C94.4863 314.844 94.6922 315.268 94.9 315.69C95.1079 316.112 95.3176 316.534 95.5291 316.954ZM80.0941 266.557C80.1753 267.188 80.756 267.629 81.386 267.543L84.1129 267.171C84.7429 267.085 85.1835 266.505 85.1024 265.875C84.9895 264.996 84.8842 264.117 84.7867 263.236C84.7166 262.604 84.1515 262.144 83.5191 262.21L80.7815 262.492C80.149 262.557 79.6888 263.123 79.7586 263.755C79.862 264.69 79.9738 265.624 80.0941 266.557ZM82.2514 213.895C82.1188 214.517 82.5204 215.126 83.1431 215.254L85.839 215.808C86.4617 215.936 87.0699 215.534 87.2026 214.913C87.295 214.479 87.3894 214.047 87.4857 213.614C87.582 213.181 87.6802 212.749 87.7802 212.318C87.9238 211.698 87.5432 211.077 86.925 210.929L84.2487 210.287C83.6304 210.139 83.0086 210.52 82.8649 211.139C82.7585 211.597 82.6542 212.056 82.5519 212.516C82.4496 212.975 82.3494 213.435 82.2514 213.895ZM101.757 164.93C101.425 165.472 101.602 166.18 102.147 166.507L104.507 167.924C105.052 168.251 105.759 168.075 106.09 167.532C106.552 166.776 107.02 166.024 107.495 165.277C107.836 164.74 107.683 164.028 107.149 163.683L104.837 162.189C104.303 161.844 103.59 161.998 103.249 162.534C102.745 163.328 102.247 164.127 101.757 164.93ZM136.4 125.209C135.908 125.611 135.84 126.337 136.246 126.826L138.001 128.946C138.407 129.435 139.132 129.503 139.625 129.101C139.968 128.821 140.313 128.543 140.659 128.265C141.005 127.988 141.352 127.713 141.7 127.439C142.199 127.046 142.291 126.323 141.902 125.82L140.216 123.645C139.827 123.142 139.104 123.05 138.604 123.443C138.234 123.734 137.866 124.026 137.498 124.321C137.131 124.615 136.765 124.911 136.4 125.209ZM288.552 103.369C288.331 103.966 287.669 104.269 287.071 104.052C286.238 103.751 285.403 103.456 284.565 103.169C283.963 102.963 283.638 102.311 283.839 101.708L284.712 99.0978C284.913 98.4948 285.566 98.169 286.167 98.375C287.057 98.6798 287.945 98.9926 288.829 99.3134C289.427 99.5302 289.731 100.193 289.51 100.789L288.552 103.369ZM236.964 89.9356C237.6 89.9418 238.106 90.4664 238.095 91.1021L238.048 93.8539C238.037 94.4896 237.513 94.9956 236.877 94.9895C236.434 94.9853 235.991 94.983 235.548 94.9826C235.105 94.9823 234.662 94.9839 234.219 94.9874C233.583 94.9925 233.06 94.4856 233.05 93.8499L233.007 91.0981C232.997 90.4624 233.504 89.9385 234.14 89.9333C234.611 89.9295 235.081 89.9277 235.552 89.9281C236.023 89.9285 236.494 89.931 236.964 89.9356ZM184.924 98.2944C185.525 98.0894 186.177 98.4163 186.378 99.0196L187.246 101.631C187.447 102.235 187.12 102.886 186.518 103.091C185.68 103.377 184.844 103.67 184.011 103.97C183.413 104.186 182.751 103.882 182.531 103.285L181.577 100.703C181.357 100.107 181.662 99.4445 182.26 99.2287C183.145 98.9093 184.033 98.5978 184.924 98.2944Z"
                fill="#433558"/>
        </g>
        <g class="anim anim--3 first-level">
          <mask id="second" fill="white">
            <path
              d="M64.4934 332.653C60.5812 334.911 55.5629 333.578 53.4625 329.579C37.9041 299.955 29.8332 266.924 30.0166 233.381C30.2 199.837 38.6315 166.897 54.5128 137.445C56.6568 133.469 61.6894 132.19 65.5766 134.492C69.4639 136.793 70.7325 141.802 68.6023 145.786C54.1915 172.735 46.5429 202.829 46.3754 233.47C46.2079 264.112 53.5271 294.288 67.6423 321.392C69.7289 325.399 68.4056 330.394 64.4934 332.653Z"/>
          </mask>
          <path
            d="M64.4934 332.653C60.5812 334.911 55.5629 333.578 53.4625 329.579C37.9041 299.955 29.8332 266.924 30.0166 233.381C30.2 199.837 38.6315 166.897 54.5128 137.445C56.6568 133.469 61.6894 132.19 65.5766 134.492C69.4639 136.793 70.7325 141.802 68.6023 145.786C54.1915 172.735 46.5429 202.829 46.3754 233.47C46.2079 264.112 53.5271 294.288 67.6423 321.392C69.7289 325.399 68.4056 330.394 64.4934 332.653Z"
            fill="#2CAD6D" fill-opacity="0.3" stroke="#2CAD6D" stroke-width="4"
            mask="url(#second)"/></g>
        <g class="anim anim--4 second-level">
          <mask id="first" fill="white">
            <path
              d="M73.6881 121.91C69.9875 119.32 69.0749 114.208 71.8116 110.614C95.7578 79.1663 128.349 55.2822 165.68 41.9398C205.582 27.6784 248.93 26.1653 289.73 37.6099C330.529 49.0544 366.766 72.8912 393.43 105.825C418.376 136.636 433.79 173.986 437.888 213.3C438.356 217.793 434.918 221.684 430.41 221.973C425.901 222.261 422.032 218.836 421.548 214.345C417.677 178.415 403.528 144.295 380.716 116.119C356.185 85.8198 322.847 63.8899 285.311 53.361C247.776 42.832 207.896 44.224 171.185 57.3445C137.047 69.5458 107.217 91.3295 85.2243 120.005C82.475 123.589 77.3887 124.501 73.6881 121.91Z"/>
          </mask>
          <path
            d="M73.6881 121.91C69.9875 119.32 69.0749 114.208 71.8116 110.614C95.7578 79.1663 128.349 55.2822 165.68 41.9398C205.582 27.6784 248.93 26.1653 289.73 37.6099C330.529 49.0544 366.766 72.8912 393.43 105.825C418.376 136.636 433.79 173.986 437.888 213.3C438.356 217.793 434.918 221.684 430.41 221.973C425.901 222.261 422.032 218.836 421.548 214.345C417.677 178.415 403.528 144.295 380.716 116.119C356.185 85.8198 322.847 63.8899 285.311 53.361C247.776 42.832 207.896 44.224 171.185 57.3445C137.047 69.5458 107.217 91.3295 85.2243 120.005C82.475 123.589 77.3887 124.501 73.6881 121.91Z"
            fill="#4FD1E3" fill-opacity="0.3" stroke="#4FD1E3" stroke-width="4"
            mask="url(#path-3-inside-1_19007_81572)"/>
        </g>
        <g class="anim anim--5 third-level">
          <mask id="third" fill="white">
            <path
              d="M404.509 332.653C408.421 334.911 413.439 333.578 415.539 329.579C429.297 303.384 437.206 274.513 438.72 244.964C438.952 240.452 435.314 236.747 430.797 236.697C426.279 236.646 422.595 240.269 422.348 244.78C420.885 271.519 413.729 297.641 401.36 321.392C399.273 325.399 400.596 330.394 404.509 332.653Z"/>
          </mask>
          <path
            d="M404.509 332.653C408.421 334.911 413.439 333.578 415.539 329.579C429.297 303.384 437.206 274.513 438.72 244.964C438.952 240.452 435.314 236.747 430.797 236.697C426.279 236.646 422.595 240.269 422.348 244.78C420.885 271.519 413.729 297.641 401.36 321.392C399.273 325.399 400.596 330.394 404.509 332.653Z"
            fill="#594FE3" fill-opacity="0.3" stroke="#594FE3" stroke-width="4"
            mask="url(#third)"/>
        </g>
        <g class="anim anim--7 user-line">
          <rect x="214.926" y="242.037" width="195.323" height="7.20181" transform="rotate(150.484 214.926 242.037)" fill="#DFDAE7" stroke="#231538" stroke-width="3"/>
          <rect x="47.2416" y="341.91" width="5.8012" height="15.6054" rx="2.9006" transform="rotate(150.484 47.2416 341.91)" fill="#DFDAE7" stroke="#231538" stroke-width="3"/>
        </g>
        <g v-if="showPro" class="anim anim--8 pro-line">
          <rect x="258.027" y="232.887" width="195.323" height="7.20181" transform="rotate(16.4209 258.027 232.887)"
                fill="#594FE3" stroke="#231538" stroke-width="3"/>
          <rect x="446.41" y="283.924" width="5.8012" height="15.6054" rx="2.9006"
                transform="rotate(16.4209 446.41 283.924)" fill="#594FE3" stroke="#231538" stroke-width="3"/>
          <rect x="458" y="284" width="28" height="28" rx="14" fill="url(#pattern0)" stroke="#594FE3" stroke-width="2"></rect>
        </g>
        <g class="anim anim--6 center" filter="url(#filter1_dddii_19007_81572)">
          <circle cx="234.5" cy="235.902" r="114.849" fill="#433558"/>
          <circle cx="234.5" cy="235.902" r="113.349" stroke="#DFDAE7" stroke-width="3"/>
        </g>
        <defs>
          <filter id="filter0_f_19007_81572" x="0.848808" y="0.848808" width="467.302" height="467.302"
                  filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
            <feFlood flood-opacity="0" result="BackgroundImageFix"/>
            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
            <feGaussianBlur stdDeviation="0.575596" result="effect1_foregroundBlur_19007_81572"/>
          </filter>
          <filter id="filter1_dddii_19007_81572" x="85.1146" y="98.0289" width="298.771" height="301.073"
                  filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
            <feFlood flood-opacity="0" result="BackgroundImageFix"/>
            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                           result="hardAlpha"/>
            <feOffset dy="13.8143"/>
            <feGaussianBlur stdDeviation="17.2679"/>
            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.8 0"/>
            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_19007_81572"/>
            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                           result="hardAlpha"/>
            <feOffset dy="3.45358"/>
            <feGaussianBlur stdDeviation="6.90715"/>
            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.9 0"/>
            <feBlend mode="normal" in2="effect1_dropShadow_19007_81572" result="effect2_dropShadow_19007_81572"/>
            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                           result="hardAlpha"/>
            <feOffset dy="-9.20953"/>
            <feGaussianBlur stdDeviation="6.90715"/>
            <feColorMatrix type="matrix" values="0 0 0 0 0.9 0 0 0 0 0.928 0 0 0 0 1 0 0 0 0.16 0"/>
            <feBlend mode="normal" in2="effect2_dropShadow_19007_81572" result="effect3_dropShadow_19007_81572"/>
            <feBlend mode="normal" in="SourceGraphic" in2="effect3_dropShadow_19007_81572" result="shape"/>
            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                           result="hardAlpha"/>
            <feOffset dy="-2.30238"/>
            <feGaussianBlur stdDeviation="1.72679"/>
            <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
            <feColorMatrix type="matrix" values="0 0 0 0 0.0546875 0 0 0 0 0.0564063 0 0 0 0 0.0625 0 0 0 0.4 0"/>
            <feBlend mode="normal" in2="shape" result="effect4_innerShadow_19007_81572"/>
            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                           result="hardAlpha"/>
            <feOffset dy="1.72679"/>
            <feGaussianBlur stdDeviation="1.15119"/>
            <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
            <feColorMatrix type="matrix" values="0 0 0 0 0.755625 0 0 0 0 0.830212 0 0 0 0 0.975 0 0 0 0.25 0"/>
            <feBlend mode="normal" in2="effect4_innerShadow_19007_81572" result="effect5_innerShadow_19007_81572"/>
          </filter>
          <linearGradient id="paint0_linear_19007_81572" x1="234.5" y1="2" x2="234.5" y2="467"
                          gradientUnits="userSpaceOnUse">
            <stop stop-color="#1C102C"/>
            <stop offset="1" stop-color="#231538"/>
          </linearGradient>
          <linearGradient id="paint1_linear_19007_81572" x1="234.5" y1="2" x2="234.5" y2="467"
                          gradientUnits="userSpaceOnUse">
            <stop stop-color="#808293"/>
            <stop offset="1" stop-color="#231538"/>
          </linearGradient>
          <pattern id="pattern0" patternContentUnits="objectBoundingBox" width="1" height="1">
            <use xlink:href="#image0_19007_81572" transform="scale(0.00347222)"/>
          </pattern>
          <image id="image0_19007_81572" width="288" height="288" xlink:href="data:image/jpeg;base64,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"/>
        </defs>
      </svg>
      <div class="speedometer__score text-h1 anim anim--score">
        {{ currentScore }}
        <div class="speedometer__score-label">
          <div v-for="v in skillsValue"
               :class="{
                    'active': currentScore >= v.min && currentScore <= v.max,
                    'showed': currentScore > v.max,
                 }"
               :key="v.label">
            {{ v.label }}
          </div>
        </div>
      </div>
    </div>
    <div v-if="showProjection && !hideInfo" class="speedometer__info anim anim--score">
      <div class="text-h5 text-center font-rift">
        1 Month Projection
      </div>
      <div class="opacity-75 text-center q-mt-sm">
        <c-icon icon="arrowGreenTop" class="q-mr-sm" width="16px"/>
        13% increased
      </div>
    </div>
    <div v-else-if="!hideInfo" class="speedometer__info anim anim--score">
      <div class="flex column full-height">
        <div class="flex q-px-md justify-center items-center">
          <svg v-if="!isPredicted && scoreImprovementPerc != 0" :style="scoreImprovementPerc < 0 && `transform: rotate(180deg)`" width="14" height="12" class="q-mr-xs" viewBox="0 0 14 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5.26795 1.07031C6.03775 -0.263021 7.96225 -0.263021 8.73205 1.07031L13.268 8.92672C14.0378 10.2601 13.0755 11.9267 11.5359 11.9267H2.4641C0.924501 11.9267 -0.0377494 10.2601 0.732051 8.92672L5.26795 1.07031Z" :fill="scoreImprovementPerc >= 0 ? '#2CAD6D' : 'red'"/>
          </svg>
          <div style="opacity: 0.7;">{{oldScoreDateString}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const CHART_MAX = 235
const MAX_TIME = 5000
const INTERVAL = 50

export default {
  props: {
    maxScore: {
      type: Number,
      default: () => 1000
    },
    oldScore: {
      type: Number,
      default: () => 1
    },
    oldScoreDate: {
      type: Date,
      default: () => null
    },
    score: {
      type: Number,
      default: 1350
    },
    scoreDate: {
      type: Date,
      default: () => null
    },
    showPro: {
      type: Boolean,
      default: true
    },
    animated: {
      type: Boolean,
      default: true
    },
    isPredicted: {
      type: Boolean,
      default: () => false
    },
    showProjection: {
      type: Boolean,
      default: () => false
    },
    hideInfo: {
      type: Boolean,
      default: () => false
    }
  },
  data () {
    return {
      currentScore: 0,
      sizeClass: 'normal'
    }
  },
  methods: {
    setChartAnimation () {
      const scorePercent = (this.score * 100) / this.maxScore
      const chartPercent = (scorePercent * CHART_MAX) / 100
      const cssAnimation = document.createElement('style')
      cssAnimation.type = 'text/css'
      const rules = document.createTextNode('@keyframes speed {' +
        '0% { transform: rotate(0deg); opacity:1; }' +
        `100% { transform: rotate(${chartPercent}deg); opacity:1; }` +
        '}')
      cssAnimation.appendChild(rules)
      document.getElementsByTagName('head')[0].appendChild(cssAnimation)
    },
    resizeIframe (event) {
      const { width } = event
      if (width <= 350) {
        this.sizeClass = 'xs'
      } else if (width <= 400) {
        this.sizeClass = 'sm'
      } else if (width <= 450) {
        this.sizeClass = 'md'
      } else {
        this.sizeClass = 'normal'
      }
    }
  },
  mounted () {
    if (this.animated) {
      setTimeout(() => {
        this.setChartAnimation()
        const increment = this.score / (MAX_TIME / INTERVAL)
        let intervalNum = 0
        const interval = setInterval(() => {
          const num = Math.floor(++intervalNum * increment)
          if (num >= this.score) {
            this.currentScore = this.score
            this.$emit('ended')
            clearInterval(interval)
            return
          }
          this.currentScore = num
        }, INTERVAL)
      }, 4000)
    } else {
      this.setChartAnimation()
      this.currentScore = this.score
      this.$emit('ended')
    }
  },
  computed: {
    skillsValue () {
      const percent = this.maxScore / 100
      // TODO - unite with one scale
      return [
        {
          min: 0,
          max: 25 * percent,
          label: 'Beginner'
        }, {
          min: 25.001 * percent,
          max: 87 * percent,
          label: 'Advanced'
        }, {
          min: 87.001 * percent,
          max: this.maxScore,
          label: 'Pro'
        }]
    },
    oldScoreRounded () {
      return Math.round(this.oldScore)
    },
    scoreRounded () {
      return Math.round(this.score)
    },
    scoreImprovementPerc () {
      return Math.round(1000 * (this.score - this.oldScore) / this.oldScore) / 10
    },
    oldScoreDateString () {
      if (this.isPredicted) {
        return 'Initial score' + (this.scoreDate ? ` for ${this.$date(this.scoreDate).format('MMMM D')}` : '')
      } else {
        const dateStr = this.oldScoreDate ? this.$date(this.oldScoreDate).format('MMMM D') : ''
        return `${this.scoreImprovementPerc >= 0 ? '+' : '-'}${this.scoreImprovementPerc}%` + (dateStr ? ` from ${dateStr}` : '')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
$animationDelayBase: .4s;
$animationDurationBase: .75s;
.speedometer{
  $root: &;
  position: relative;
  display: block;
  &__main{
    position: relative;
    display: inline-flex;
    width: 100%;
    svg{
      transform: translateX(1.5%);
    }
  }
  &__main-svg{
    width: 100%;
  }
  &__score{
    position: absolute;
    left: 0;
    right: 0;
    text-align: center;
    top: 40%;
    font-size: 72px;
    &-label{
      display: flex;
      flex-direction: column;
      height: 50px;
      overflow: hidden;
      position: relative;
      text-align: center;
      div{
        width: 100%;
        position: absolute;
        top: 50px;
        line-height: 50px;
        text-align: center;
        font-size: 20px;
        transition: all 1s ease-in-out;
        &.active{
          top: 0;
        }
        &.showed{
          top: -50px;
        }
      }
    }
  }
  &__info{
    position: relative;
    z-index: 999;
    margin-top: -20%;
    padding-right: 1%;
    div:nth-child(2){
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
  &--md {
    min-width: unset!important;
    #{$root}__score{
      font-size: 56px;
    }
    #{$root}__score-label{
      height: 35px;
      div {
        line-height: 35px;
      }
    }
  }
  &--sm {
    width: 380px;
    #{$root}__info{
      padding-right: 15px;
    }
    #{$root}__score{
      font-size: 56px;
      top: 41%;
      #{$root}__speedometer-score-label{
        height: 30px;
        div{
          line-height: 30px;
        }
      }
    }
  }
  &--xs {
    width: 100%;
    padding-bottom: 15px;
    #{$root}__main-svg{
      height: unset;
      width: 100%;
      max-width: 450px;
    }
    #{$root}__main{
      width: 100%;
      transform: unset;
      display: block;
      margin: 0 auto;
      text-align: center;
    }
    #{$root}__info{
      padding: 0;
      margin-top: -15%;
    }
    #{$root}__score{
      top: 37%;
      font-size: 46px;
      &-label{
        height: 30px;
        div{
          line-height: 30px;
          font-size: 18px;
        }
      }
    }
  }
  &.animated{
    .anim{
      opacity: 0;
      @for $i from 1 through 7 {
        &--#{$i}{
          animation: #{$animationDurationBase} ease #{$animationDelayBase * $i} normal forwards 1 fadein;
        }
        &--8{
          animation: #{$animationDurationBase} ease 10s normal forwards 1 fadein;
        }
      }
      &--score{
        animation: #{$animationDurationBase} ease-in-out #{$animationDelayBase * 8} normal forwards 1 fadein;
      }
    }

    .user-line{
      transform-origin: center;
      animation: 5s speed .5s 1 both;
    }
  }
  &.no-animation{
    .user-line{
      transform-origin: center;
      animation: 0s speed .1s 1 both;
    }
  }
}

@keyframes fadein{
  0% { opacity:0; }
  100% { opacity:1; }
}
</style>
