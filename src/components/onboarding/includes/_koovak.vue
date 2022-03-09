<template>
  <div class="column justify-center items-center q-mt-sm-xl q-pt-sm-xl">
    <div class="col text-center q-mt-xl">
      <q-img src="@/assets/onboarding/info-icon.svg" height="160px" width="160px" />
      <div class="text-h1" style="margin-top: -30px">
        Do you own <span class="text-pink">KovaaK's 2.0</span> aim trainer?
      </div>
    </div>
    <div class="col">
      <div class="row q-gutter-lg q-mt-xl" style="max-width: 400px">
        <div class="col q-mx-lg">
          <c-btn @click="$emit('next', true)">
            Yes
          </c-btn>
        </div>
        <div class="col q-mx-lg">
          <c-btn outline @click="$emit('next', false)">
            No
          </c-btn>
        </div>
      </div>
    </div>
  </div>
</template>
