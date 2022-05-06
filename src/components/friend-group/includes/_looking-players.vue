<template>
  <div ref="content" class="joinfg__rightbar q-px-lg-lg d-flex justify-center">
    <div class="looking-bg relative-position" ref="lookingBox">
      <div class="col lt-md">
        <div class="text-subtitle1 text-weight-bold text-pink">
        </div>
      </div>
      <div class="col text-center  q-pt-lg q-pt-lg-xl" >
        <div class="text-h1" ref="title">
          Looking for <span class="text-pink">similar</span> players
        </div>
        <div class="text-h4 text-weight-regular q-mt-sm" ref="description">
          Don’t worry it takes a while
        </div>
      </div>
      <div class="col text-center">
        <div class="jd-item justify-center d-flex">
          <span class="text-uppercase text-weight-bold jd-name">JD</span>
          <span class="text-uppercase text-weight-bold absolute jd-score">724</span>
        </div>
        <div v-for="person in personItems" :key="person.name">
          <div class="person-item column" :style="getPosition(person.posPercentX, person.posPercentY, person.size)">
            <div class="avatar-item">
              <q-avatar :size="`${person.size}px`">
                <img :src="person.pic">
              </q-avatar>
            </div>
            <span class="full-width text-weight-bold">{{person.score}}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  data () {
    return {
      score: 720,
      boxWidth: 0,
      previousTop: 1,
      personItems: [
        {
          name: 'second1',
          score: 724,
          size: 56,
          posPercentX: 33,
          posPercentY: 53,
          pic: 'https://s3-alpha-sig.figma.com/img/edf0/4edc/e6484cf225acbb2bdaa101b44312ba89?Expires=1647820800&Signature=AuMHQb2lBoDIm-c9rByUo3WWWUFrS61aRhgUq5e1B6yrqBKzf54DrjzvKjo7s0nH4p3Lo~NAw8YRrvhm8H2I-vIMuzgmEBUrSBIjh3hm8M8f43TN2-joa86DbZuF8qE~9rR4vs4nCvrCz~9NOmN-OMyQiC4e73WJ2n~naBx9cmzouWuAOA6iUdR8bWFIjEyphxvRW~qyQx~absGqPsV7URwrChYoBR2JD5PNF7lVe2jXIq4aZjCWo4jGq~55FrkhF0I6B4xtqeaXQnK~dVVVGh7zMdV3RWX9XHDzRgiSJ707tCdAQbt8q7FQJElxgQl2~tYVD3qZwpA~8PvHfoUvew__&Key-Pair-Id=APKAINTVSUGEWH5XD5UA'
        },
        {
          name: 'second2',
          score: 724,
          size: 72,
          posPercentX: 41,
          posPercentY: 36,
          pic: 'https://s3-alpha-sig.figma.com/img/73b8/76e3/af664c0d9ad376780de616d1952681e2?Expires=1647820800&Signature=VPgPPqG3xafaR0T0LL9BBrtVzsA42BtPbj9MmhUBCsMfR7ziFSOsoWZ85wGBhcAv-PR9iPTd-xnOS97Kt1~f1huZWRihGlqhymKYvhdzsHn45SeoxesRFKQXqXzv1hNh2rRfiQAKAe~4tY0YcCPM~puJXbGlJ9OAHA0y83OCnNcTTTBMMUMvT~7VN3GtCsSFkP4fd~kCcQs3K5ry9Zr8rOHXY0znzMtbpzRsAsTlr1~zinaOoRIFzYo0fh4qHKwy0HK~dRUZUpvRMaUKLKwkH4FIhGmOQtxUwuQx3vQN1AAFDKDx8Ws1m4s3v4XfVQ4~NK~ws2ZEDQfJBYBBv-1uzw__&Key-Pair-Id=APKAINTVSUGEWH5XD5UA'
        },
        {
          name: 'third1',
          score: 714,
          size: 56,
          posPercentX: 69,
          posPercentY: 69,
          pic: 'https://s3-alpha-sig.figma.com/img/2921/a3bc/a2aaa2979fb97cc147d4d6bbaf96ed65?Expires=1647820800&Signature=P3sVeAPFvkecKEqiV7RZVr0gUgN47jrHrudrLEaMsaxcSOaqtxmGGWKkmEIiPf5hGzw6EolMA8aDdFSvaaDu9GXEvCDHxHafrEvVRMxKTQDCUFe8rhGi72EGxgxEIOQSwG7NZZCOEFkjSIEFMb1Jp9xTrlFEAC7gMik1fSxlXmu-y~l~1qsQz8~s81HOaD1sKThcgpVkosWuQnEK4~h~dVkC-parFMOK5L4pMqMhN4nbbnqQEa5YcQdyfOTeK4HAyg8knMkrIVEki2zdrEWTg6-CW28IfKlGRtyA0QtiXeee0DWmDdklGFPwjG~p9cv90nluEGtlKQOpNXcQHQPphA__&Key-Pair-Id=APKAINTVSUGEWH5XD5UA'
        },
        {
          name: 'third2',
          score: 714,
          size: 96,
          posPercentX: 71,
          posPercentY: 33,
          pic: 'https://s3-alpha-sig.figma.com/img/c98d/909b/c04067c817fa894d5f23bdd1bf2603cd?Expires=1648425600&Signature=YMjFuNND80Xdj5YDNwNSUwfqeOD4Zt2KlBMiStNN77U2otJ735Qn9vE7ONWPLXJOjUoREzgz-atzcwtQkGrc3pMy-N83fQLiiQ42CWp0P39l8Pgge9NW1c8HVrI44BJ~EIiIlFxdXsKWo3jefzcvoINFisc-bWLtnv0N2k-d2q3CeTcL8b8B2LaOYjkKbnrPq1qhzMYIzh~A5fkNpwsFw20B1vqQxdISVEJzV6h74H-QzAjXQ~9r5fUDxBtClhI3Xyziq0v~cW4frROpECO89a8~53P1jDy1b~C9usPOoclb4IdtsLWLCDGkkXLJTQ5bmIpQdcdUyb0JXcQCxAErQg__&Key-Pair-Id=APKAINTVSUGEWH5XD5UA'
        },
        {
          name: 'third3',
          score: 714,
          size: 96,
          posPercentX: 34,
          posPercentY: 71,
          pic: 'https://s3-alpha-sig.figma.com/img/2f26/67c5/ae231836a04e8773c38680c1a6832a8f?Expires=1647820800&Signature=eCP6T8sqNJTSTWgSk4LR6jY6eixqBo7t2DRwdY-gZkvwffS~XWFsnerePtGcs~nCfpt49~R0~oyc6hPpqJE4X8BzcZ-Mc2Ah-EmmVnkrndGzAguOxjgU~X2K1AVnztdFG1hTNQpXx0g7V8OxhsIu3KjGQV89KBEYm4M0An-INcwnFy1fYg6vkBwttsAzaVOSZrMyG-e-O~fhTfOp5Ug8bzMw9ifhTWuX2lDLuePzpzpV8kJyFpiP5t~z7ta68uRzeAu7EGJt~pXmGEfQ1UKMinPLxg7C~G6StnZgz5iOmG9R0dHqEgoPZSmq174fOVqc7QbB5-O9OtJW3P3ZTNhZcw__&Key-Pair-Id=APKAINTVSUGEWH5XD5UA'
        },
        {
          name: 'forth1',
          score: 704,
          size: 96,
          posPercentX: 17,
          posPercentY: 31,
          pic: 'https://s3-alpha-sig.figma.com/img/1cb5/ed45/1c65794d69d2cf17bc0981b8e216a28a?Expires=1647820800&Signature=KyJyJYp5WISDHTeLUHADletPxg-rnqcKQjT1AjHRLcBHw3YWlPVUexvsvuvy2MtUN6dj7SEBSlH2jh1t9wvwPrzNvg24pFwVj9WLNPxg2Vmuwf49mhwkreg0qqXTzlY4KP0oZGkc2c22FXmp~VetSJF0b-xHu6B-6coDYTktqktIRz2ArGHOgTeKxBXInV7-aJd~TGunOCnuvUSHgVtEPsx8iRIC5P2IvBWk9O20G26kDIRSrprKqxjRHGJZTULkj72OWxMpLiQmBcltZTPqHfVqWDXelQXVpHqs6VtZfEqwIzH9D4OP3n2NTIjujLLqVkysdlFMYn872vIwF36FRw__&Key-Pair-Id=APKAINTVSUGEWH5XD5UA'
        },
        {
          name: 'forth2',
          score: 704,
          size: 56,
          posPercentX: 11,
          posPercentY: 57,
          pic: 'https://s3-alpha-sig.figma.com/img/d28c/ecf8/20e438691f97475c40f48d4652db87ba?Expires=1648425600&Signature=c5~G9tB4Bh~EaG-g6waR62dB6V0Tf-Xk-2OFFCmTX8yit2TbyxNdr8PXwoenvFsX269ikKIoRJz6HZZULeBmUE7GMfxHakKkl06AsmYcKPGaxa1PXqBUpuaIESqtbIhIs3Kk1jma1bLqSWPBEMoPV-~dDjrQ4qARoJ8ws216hzT8B1L~zSThLBXI2xuc6szRDQrIOTxt2C1IV3pJecAJIeHXLnKU8MJm38TlLHHJ40kmYRpwEtrT1Met9~PAd7HhLjb0b6FvKjs2QuiMyZt4ulObM5eFIIzMyyiXpNeynDfkAfOo~xsd4IP29VnPesbL1iAPXz8ab0GZfu~pnDaytw__&Key-Pair-Id=APKAINTVSUGEWH5XD5UA'
        },
        {
          name: 'forth3',
          score: 704,
          size: 72,
          posPercentX: 55,
          posPercentY: 87,
          pic: 'https://s3-alpha-sig.figma.com/img/aac9/076d/39e254aa2c30920c8587adf219f41003?Expires=1647820800&Signature=PBLbxt5oDxTvH8QBr3weHgSu4fh0JnEoL~DS3vtVCpg7nH3w4FuTMpHkagXeUB0qX-HTbKsp7hU57rqGg8hjNr3IZHUU82KJsj0dYNgZwqloNS9Nu-MSNU1zC0PKGPywPqFFM0m0iHEN2WJqic0yGCoI1vRH2u2ajZJsY4sckRWcKFjx33tajqHbTx4BQnv-4u~I4feTfpTRqhUEELIhvOOEyntWkaB5ZPB8YSBHz3qScNi6AaWoBE3F0tM0ZB06Aymv9bwrFXXbQzXprXKWtNk8OsDR-Hoj4hBzdn8EWs2T8g1~kMbKqjwccFQf69Yu9d1UlJpegpWEHAqqCyJDwA__&Key-Pair-Id=APKAINTVSUGEWH5XD5UA'
        },
        {
          name: 'forth4',
          score: 704,
          size: 72,
          posPercentX: 87,
          posPercentY: 52,
          pic: 'https://s3-alpha-sig.figma.com/img/5d70/67b1/1dd1145b70e0adad8183911467b21713?Expires=1647820800&Signature=J6izEE2C7iRb4gB2Cac6gSLyu948YSbMaMK361QamRuUWwb9PBlaxLLTS4tJVk3lS8-qm6mwIALBVjKo-cqoouqC4kZaPvlZA4vLxgyYlg8nlOSj3M~964IWcTtU6i5EZfFZ6JS~oQqfJjSDBN5kfTQXyWAoG662SuXuXXduBBz9CeUutiUc4tLmPYI7dUUipQNwOMYWSA1yEI-2qyLu7PXVtRk6jPxqMjvrS~rNu-aJh8WvdKMNuXq6qfEDd9A2ATnsVYLlkFS1nhq-EMryjEctAa6Qr7WFgORGN1taWSgHozOizEY7dx2-dfER4iCgdiio9618tHpmFC0S6VaHjw__&Key-Pair-Id=APKAINTVSUGEWH5XD5UA'
        },
        {
          name: 'fifth1',
          score: 694,
          size: 72,
          posPercentX: 91,
          posPercentY: 78,
          pic: 'https://s3-alpha-sig.figma.com/img/749c/e2a2/bb374b9934077805be51f813deecb782?Expires=1647820800&Signature=bD1dqGEE7dzImjF13W5R3GqUCdokrS455ZysNUW03n2y7mPuulT4tmkK6-C2omLyf7SV7VjKBgLJsniSWGWFEiT4K-nqRnwz0s-CoJO~nQdA7gK-HCZ9Fpai6dmMStv0-tmPBdlTRrkS3f0rAYil7zf-hunldVWklfVI1EpRhkZOQkqktY7AxHvh4XVIoaSy0V7vIIk4pg5b-9OUQjHfJmkr~N2u1sM7dpK88dj4BRsbY3jn58BFY3-ScfbG8itrwAZz6Ccdtx0rpkCaw-9pIckc3GGcABmEj6MXujvs1nNelOMDuIQNxK2YDa05hd8IHo~mTIimOvJKVjh1UQDNUg__&Key-Pair-Id=APKAINTVSUGEWH5XD5UA'
        }
      ]
    }
  },
  mounted () {
    this.boxWidth = this.$refs.lookingBox.clientHeight
    setTimeout(() => { this.$emit('next') }, 2000)
  },
  methods: {
    getPosition (posPercentX, posPercentY, size) {
      const posX = Math.round(this.boxWidth * posPercentX / 100 - size / 2)
      const posY = Math.round(this.boxWidth * posPercentY / 100 - size / 2)
      return `left:${posX}px;top:${posY}px`
    }
  }
}
</script>

<style lang="scss">
  .jd-item {
    position: absolute;
    align-items: center;
    top: calc((var(--app-height))/2 - 40px);
    left: calc((var(--app-height))/2 - 40px);
    background: $pink;
    border: 2px solid white;
    width: 80px;
    height: 80px;
    border-radius: 100%;
    box-shadow: 0 0 0 9px rgba(44, 173, 109, 0.3),
                0 0 0 18px rgba(44, 173, 109, 0.3);
    @media all and (max-width: $breakpoint-sm-max) {
      top: calc((var(--app-height) - 20px)/2 - 40px);
      left: 45%;
    }
    .jd-name {
      font-family: Rift;
      font-size: 38px;
    }
    .jd-score {
      bottom: -50px;
      font-family: Roboto;
      font-size: 24px;
    }
  }
  .looking-bg {
    aspect-ratio: 1/1;
    height: calc(var(--app-height));
    background-image: url('../../../assets/friend-group/circle-default.svg');
    background-size: calc(var(--app-height) - 100px);
    background-repeat: no-repeat;
    background-position: center;
    animation-timing-function: ease-in-out;
    animation-delay: 0.002s;
    animation-duration: 0.8s;
    animation-name: changeBg;
    animation-iteration-count: infinite;
    @media all and (max-width: $breakpoint-sm-max) {
      height: calc(var(--app-height) - 20px);
      position: fixed;
      z-index: 5;
    }
  }
  .person-item {
    display: inline-flex;
    position: absolute;
    span {
      font-family: Roboto;
      font-size: 16px;
    }
  }
  .avatar-item {
    border: 2px solid white;
    border-radius: 100%;
    display: inline-flex;
    img {
      object-fit: cover;
    }
  }
  @keyframes changeBg{
    to {
      background-size: calc(var(--app-height));
      background-image: url('../../../assets/friend-group/circle-variant.svg');
    }
  }
</style>
