import { Store } from 'vuex'

export default {
  title: 'Workshop'
}

export const WorkshopCard = () => ({
  title: 'WorkshopCard',
  components: {
    'n-workshop-card': () => import('@/components/gamesense-workshop/card.vue')
  },
  template: `
    <div>
    <div class="row q-mb-lg">
      <div class="col-4">
        <n-workshop-card
          approved-by="Novos"
          thumbnail="https://d2u76h3ivp32kq.cloudfront.net/gyro/training-content/Workshops/thumbnails/JivanTVWorkshopThumbnail.png"
          difficulty="intermediate"
          :duration="9"
          title="How to play safe and aggresive"
        />
      </div>
    </div>
    </div>`,
  store: new Store({
    modules: {
      coaches: {
        namespaced: true,
        state: {
          coaches: []
        }
      }
    }
  })
})

export const WorkshopSearchResult = () => ({
  title: 'WorkshopSearchResult',
  components: {
    'search-result': () => import('@/components/gamesense-workshop/search-results.vue')
  },
  computed: {
    results () {
      return [
        {
          id: '59d6ce94-df54-4c4c-a7b2-aaf030cd77b5',
          title: 'How to take Highground',
          subTitle: 'Improve your gamesense on how to take highground by watching this breakdown of Clix, Bugha and Bizzle',
          category: 'Gamesense',
          approvedBy: 'NOVOS',
          videoUrl: 'https://stream.mux.com/FGoIMoi3t5yjJtgRfE7wGB3WojOpBEYaFhg6bH00HRnw.m3u8',
          duration: null,
          thumbnail: null,
          isPublished: true,
          difficulty: 'INTERMEDIATE',
          timestamps: [
            {
              type: 'QUESTION',
              pointOfTime: '00:05',
              data: {
                question: 'What should be avoided when giving comms during a game?',
                answers: [
                  {
                    answer: 'Fraggers &lt;font size="4"&gt;recommending&lt;/font&gt; rotations',
                    isCorrect: false,
                    explanation: 'Fraggers should not make quick decisions about rotations. However if the team is safe and has time to prepare, it is a good idea to have Fraggers make suggestions if they see an opportunity. '
                  },
                  {
                    answer: 'Criticism explaining what went wrong',
                    isCorrect: true,
                    explanation: 'It is never a good idea to dwell on the past during a game. If a rotation doesn’t work, or a height take fails, never discuss the mistake or why it was wrong during the game. Instead, VOD review the game later, and then point out what went wrong. This why you will not be distracted during the game. '
                  },
                  {
                    answer: 'Mat and Heal Count',
                    isCorrect: false,
                    explanation: 'Your trio should be communicating their mat and heal counts constantly. Every player on the team should be aware of every item each teammate has at any given moment.'
                  }
                ]
              }
            },
            {
              type: 'QUESTION',
              pointOfTime: '04:42',
              data: {
                question: 'Should they go for height, and for what reason?',
                answers: [
                  {
                    answer: 'They should make a play for height, they have lots of mats, they are at the front of the zone, and the height team is far away.',
                    isCorrect: true,
                    explanation: 'Bizzle’s team has mats to spare, so building up a few layers is no worry. Because they pulled zone the current height team is too far away to smother them and as a result they can take height with no real opposition. Taking height when it is this open is less risky than playing the midground, as they are less likely to be fought by other teams, or get smothered when zone moves up in elevation. '
                  },
                  {
                    answer: 'They should not take height. They are on a low layer, already have a good tunnel, and the height team is going to spray them out before they can take height. ',
                    isCorrect: false,
                    explanation: 'Taking height is the right play. The zone is moving uphill so staying on lowground creates the risk of being smothered. They do have a good tunnel, but they are going to need to tunnel upwards regardless, and height is uncontested because the opposite height was too far away to tarp over and spray them down in time. '
                  },
                  {
                    answer: 'They should take height, the zone is pulling up in elevation, high ground will allow them to get storm surge tags, and more eliminations',
                    isCorrect: false,
                    explanation: 'Taking height is the right idea, but these are not all the right reasons. The zone is pulling up in elevation, which is an indicator that taking height may be a good idea. The team is going to be moving up layers no matter what, so this is a good time to check to see if Height is available. The team does not need storm surge tags. Storm surge will be triggered at the end of sixth zone if more than 30 people are alive. This is unlikely because there are only 38 people alive and the zone is moving uphill. Even if it did trigger, Bizzle’s team has 6 kills, and is likely well above the necessary damage threshold. The name of the game in this format is placement. Kills help, but should not be prioritized over the win in this format. '
                  },
                  {
                    answer: 'They should not take height. Taking High Ground could cause a fight that wastes their mats. It is less risky to continue playing their layer and conserve materials. ',
                    isCorrect: false,
                    explanation: 'The team has more than enough mats to take height and even risk a fight. Even if the opposite height team tarped over and fought for height, they would run out of mats faster than Bizzle’s team and be forced to a lower layer. '
                  }
                ]
              }
            },
            {
              type: 'QUESTION',
              pointOfTime: '05:53',
              data: {
                question: 'Should they go for height, and for what reason?',
                answers: [
                  {
                    answer: 'Go for height, the team is ahead of the zone and it’s late in the game.',
                    isCorrect: false,
                    explanation: 'While they are ahead of the zone, the zone is too small to crank above the height team.'
                  },
                  {
                    answer: 'Play the Midground, Most of the teams are on lowground, and working as a trio they can rack up lots of kills.',
                    isCorrect: false,
                    explanation: ' Playing the midground is the right idea, and it is true that there are lots of players underneath them to be eliminated. However this does not address why height is a bad idea.'
                  },
                  {
                    answer: 'Play the Midground. The zone is too small to take height by building up in the front of the zone, and they don’t have enough mats to take height and fight a team.',
                    isCorrect: true,
                    explanation: 'If they try to build at the front of zone, the height team is going to smother them. The zone is small enough, that they would have to try and fight the team on height directly, and they simply do not have enough mats for this.'
                  },
                  {
                    answer: 'Take Height by sending Clix to the back, and having Bugha and Bizzle Spray from the front.',
                    isCorrect: false,
                    explanation: 'The layer is too congested for this strategy, and because the zone is pulling uphill, Clix would be separated from Bugha and Bizzle, while having to spend extra mats to take height.'
                  }
                ]
              }
            },
            {
              type: 'QUESTION',
              pointOfTime: '07:01',
              data: {
                question: 'Should they go for height, and for what reason?',
                answers: [
                  {
                    answer: 'Take Height, the team has a clean layer on Second Height with plenty of mats. Send Clix to the back and have Bizzle and Bugha distract at the front.',
                    isCorrect: true,
                    explanation: 'The team has plenty of mats, and a clean layer on second height. This means clix can easily sneak up behind the team, and has the mats to spend building above them. This gives them the best chance of winning the game.'
                  },
                  {
                    answer: 'Drop to a lower layer, avoiding the risk of being pressured by the height team.',
                    isCorrect: false,
                    explanation: 'The height team is not currently pressuring them, and the opportunity to take height is there. Dropping to a lower layer will lead to a fight with another team, so this is not a valid reason to avoid taking height.'
                  },
                  {
                    answer: 'Tunnel to the front of the zone then Build Up and take height. The Height team is trailing behind and only a few layers above.',
                    isCorrect: false,
                    explanation: 'This wouldn’t work as it is too late in the game and the zone is too small. They would simply be sprayed out by the height team, who would then build above them and force them back down. This would be a waste of mats and detrimental to their success.'
                  },
                  {
                    answer: 'Drop to a lower level because the zone plays down in elevation and the team is at risk of being shot out.',
                    isCorrect: false,
                    explanation: 'This is also a viable option, but it has a lower chance of leading to a win. While it is true they are at risk of being shot out, there are enough teams below them creating builds that they could safely land on.'
                  }
                ]
              }
            },
            {
              type: 'QUESTION',
              pointOfTime: '04:19',
              data: {
                question: 'Am I in the middle of this video?',
                answers: [
                  {
                    answer: 'Yes',
                    isCorrect: true,
                    explanation: "Yes i'm in the middle"
                  },
                  {
                    answer: 'No',
                    isCorrect: false,
                    explanation: "No I'm not|"
                  }
                ]
              }
            }
          ],
          credits: {
            sac: '',
            url: '',
            name: 'Clix, Bugha and Bizzle',
            title: 'Players'
          },
          startLevel: null,
          endLevel: null,
          optimalLevel: null,
          createdAt: '2021-05-04T08:25:16.059Z',
          updatedAt: '2021-06-28T09:34:47.958Z'
        },
        {
          id: '8fb27415-89f6-4a8a-9ff0-458c8a945bf4',
          title: 'Test',
          subTitle: 'test',
          category: 'test',
          approvedBy: 'NOVOS',
          videoUrl: 'https://novos-content-data.s3.amazonaws.com/assets/gyro/training-content/Candook-5in1EditCourse-MapPic.png',
          duration: null,
          thumbnail: null,
          isPublished: true,
          difficulty: 'EASY',
          timestamps: [],
          credits: {
            sac: 'sad',
            url: '',
            name: 'taa',
            title: 'test'
          },
          startLevel: null,
          endLevel: null,
          optimalLevel: null,
          createdAt: '2021-05-03T07:56:20.709Z',
          updatedAt: '2021-05-05T13:57:39.009Z'
        },
        {
          id: '34fb5a66-b000-43ff-90c0-edc9ecd8ba44',
          title: 'Test give link',
          subTitle: 'test',
          category: 'test',
          approvedBy: 'NOVOS',
          videoUrl: 'https://novos-content-data.s3.amazonaws.com/assets/gyro/training-content/Candook-5in1EditCourse-MapPic.png',
          duration: null,
          thumbnail: null,
          isPublished: true,
          difficulty: 'EASY',
          timestamps: [],
          credits: {
            sac: 'sad',
            url: '',
            name: 'taa',
            title: 'test'
          },
          startLevel: null,
          endLevel: null,
          optimalLevel: null,
          createdAt: '2021-05-03T07:56:29.675Z',
          updatedAt: '2021-05-05T13:57:38.862Z'
        },
        {
          id: '4d539be7-7e8f-4c4b-8172-04360d0a9b09',
          title: 'Test',
          subTitle: 'test',
          category: 'test',
          approvedBy: 'NOVOS',
          videoUrl: 'https://novos-content-data.s3.amazonaws.com/assets/gyro/training-content/Candook-5in1EditCourse-MapPic.png',
          duration: null,
          thumbnail: null,
          isPublished: true,
          difficulty: 'EASY',
          timestamps: [],
          credits: {
            sac: 'sad',
            url: '',
            name: 'taa',
            title: 'test'
          },
          startLevel: null,
          endLevel: null,
          optimalLevel: null,
          createdAt: '2021-05-03T07:27:49.810Z',
          updatedAt: '2021-05-05T13:57:38.716Z'
        },
        {
          id: 'ebaac5e2-7aa9-4a02-bb43-06df6065fd59',
          title: 'How to aim better?',
          subTitle: null,
          category: 'TEST',
          approvedBy: 'NOVOS',
          videoUrl: 'https://novos-content-data.s3.amazonaws.com/assets/gyro/training-content/trainingsessions-mp4s/50PlayerZonewars-Gameplay.mp4',
          duration: null,
          thumbnail: null,
          isPublished: true,
          difficulty: null,
          timestamps: [
            {
              type: 'QUESTION',
              pointOfTime: '00:06',
              data: {
                question: 'What do you think about this workshop?',
                answers: [
                  {
                    answer: 'Good enough',
                    isCorrect: true,
                    explanation: 'There is no other answer'
                  },
                  {
                    answer: 'Not good enough',
                    isCorrect: false,
                    explanation: 'No, it is good enough'
                  }
                ]
              }
            },
            {
              type: 'INFORMATION',
              pointOfTime: '00:15',
              data: {
                information: 'Here will be some usefull text in rich HTML format'
              }
            }
          ],
          credits: null,
          startLevel: null,
          endLevel: null,
          optimalLevel: null,
          createdAt: '2021-05-01T14:48:03.654Z',
          updatedAt: '2021-05-05T13:57:38.568Z'
        }
      ]
    }
  },
  template: `
    <div>
    <div class="row q-mb-lg">
      <div class="col-4">
        <search-result :workshops="results"
                       :total="5"
                       :size="12"
                       :page="1"/>
      </div>
    </div>
    </div>`,
  store: new Store({
    modules: {
      coaches: {
        namespaced: true,
        state: {
          coaches: []
        }
      }
    }
  })
})
