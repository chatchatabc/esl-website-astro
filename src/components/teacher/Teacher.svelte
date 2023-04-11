<script lang="ts">
  export let teacher: any;
  import Favorite from "../common/Favorite.svelte";
  import LessonList from "./LessonList.svelte";
  import ClampText from "../common/ClampText.svelte";
  let teacherToggleBtn = false;

  //for tab menu
  let tabIndex: number = 0;
</script>

<!--main container -->
<div class="container block mx-auto lg:flex lg:flex-1 lg:w-10/12">
  <!--left side -->
  <div class="w-full lg:w-7/12 lg:pr-2">
    <!--teacher details section -->
    <div class="">
      <div class="bg-white sm:rounded-tl-[1rem] shadow-lg p-5 md:p-8">
        <!--nameplate section -->
        <div>
          <div class="flex flex-1">
            <!--teacher image -->
            <div class="px-4 pb-0">
              <slot name="img" />

              <slot name="rating" />
            </div>
            <!--name,verification and occupation -->
            <div class="flex-grow flex items-center">
              <div>
                <div>
                  <span class="text-esl-3">{teacher.name}</span>&nbsp;<slot
                    name="verified"
                  />
                </div>
                <div class="text-esl-2">{teacher.occupation}</div>
              </div>
            </div>
            <!--favorites -->
            <div class="flex items-center">
              <Favorite />
            </div>
          </div>

          <!--reserve button section -->
          <div class="flex flex-1 space-x-5 items-center justify-end pt-2 px-4">
            <div class="payDefinition">
              <span class="font-medium">{teacher.rate}元</span>
              <span class="text-[#9B9B9B]">/40分钟</span>
            </div>
            <button
              on:click={() => {
                teacherToggleBtn = true;
              }}
              class="bg-[#FF4438] py-1 px-[2rem] rounded-full text-white"
            >
              预约
            </button>
          </div>
        </div>

        <!--tabified details -->
        <div class="mt-8">
          <!--tab collection -->
          <div class="tab-menu flex flex-1 text-esl-3">
            <!--tab item -->
            <button
              on:click={() => {
                tabIndex = 0;
              }}
              class="py-4 px-4 flex-auto show hidden md:block"
              class:show={tabIndex == 0}
            >
              <div class="flex flex-1 flex-col justify-center">
                <div class="tab-text text-esl-3">About Me</div>
                <div
                  class="line w-[2.5rem] h-[5px] rounded-full bg-[#FF4438] mx-auto mt-2"
                />
              </div>
            </button>
            <button
              on:click={() => {
                tabIndex = 1;
              }}
              class="py-4 px-4 flex-auto hidden md:block"
              class:show={tabIndex == 1}
            >
              <div class="flex flex-1 flex-col justify-center">
                <div class="tab-text text-esl-3">Me as a Teacher</div>
                <div
                  class="line w-[2.5rem] h-[5px] rounded-full bg-[#FF4438] mx-auto mt-2"
                />
              </div>
            </button>
            <button
              on:click={() => {
                tabIndex = 2;
              }}
              class:show={tabIndex == 2}
              class="py-4 px-4 flex-auto hidden md:block"
            >
              <div class="flex flex-1 flex-col justify-center">
                <div class="tab-text text-esl-3">
                  My lessons & Teaching plan
                </div>
                <div
                  class="line w-[2.5rem] h-[5px] rounded-full bg-[#FF4438] mx-auto mt-2"
                />
              </div>
            </button>
          </div>
          <!--tab contents -->
          <div class="px-4 md:px-8 mt-4">
            <!--tab 1 content -->

            <div
              class="tab-content px-4 space-y-4 pb-4 {tabIndex == 0
                ? 'md:block'
                : 'md:hidden'}"
            >
              <div class="text-esl-2 space-y-2">
                <p>From Philippines</p>
                <p>Living in Davao City,Philippines</p>
                <p>Licensed Teacher with 6 years experience in teaching</p>
              </div>
              <div class="text-esl-3">About Me</div>
              <div class="text-esl-2">
                <ClampText>
                  <span
                    >Hello world! I'm teacher Laura from Philippines. I'm a
                    native speaker of Filipino (Tagalog) with Bachelor's Degree
                    in Secondary Education major in English. Some of my
                    highlighted traits in teaching field are being a
                    goal-oriented, patient, having good command of language,
                    committed to work or craft and I highly value sincerity and
                    honesty. Learners believe that you can and you're halfway
                    there. See you! =)</span
                  >
                </ClampText>
              </div>
            </div>
            <!--tab 2 content -->

            <div
              class="tab-content px-4 space-y-4 pb-4 {tabIndex == 1
                ? 'md:block'
                : 'md:hidden'}"
            >
              <div class="text-esl-3">Me as a teacher</div>
              <div class="text-esl-2">
                <ClampText>
                  <span
                    >I'm the kind of a teacher who is approachable and I can
                    establish a rapport with my students . Since I was a child,
                    I really want to become a teacher. I know deep in my core,
                    that I'm meant to be in teaching field. In fact, I started
                    teaching pre-school and elementary students after I passed
                    the Licensure Examination for Teachers in 2014. Then I moved
                    to Secondary School where I have been teaching English and
                    Filipino (Tagalog) for six years.</span
                  >
                </ClampText>
              </div>
            </div>
            <!--tab 3 content -->

            <div
              class="tab-content px-4 space-y-4 pb-4 {tabIndex == 2
                ? 'md:block'
                : 'md:hidden'}"
            >
              <div class="text-esl-3">My lessons & Teaching plan</div>
              <div class="text-esl-2">
                <ClampText>
                  <span>
                    As an English teacher, I take pride in creating
                    comprehensive and effective lesson plans for my students. My
                    approach to teaching is student-centered, meaning that I
                    focus on each individual's unique needs and goals. I
                    understand that everyone has different learning styles, and
                    I strive to create lessons that cater to a variety of
                    preferences. In my lessons, I cover a wide range of topics,
                    from grammar and vocabulary to conversational skills and
                    pronunciation. I use a variety of teaching materials,
                    including videos, podcasts, and interactive exercises, to
                    keep my lessons engaging and interesting. I also provide
                    regular feedback and encouragement to help my students build
                    their confidence and proficiency in the English language.
                    Whether you are a beginner or an advanced learner, I am
                    committed to helping you achieve your language goals and
                    succeed in your personal and professional endeavors.
                  </span>
                </ClampText>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!--stats -->
      <div
        class="bg-white flex flex-1 shadow-lg my-4 py-4 flex-col space-y-4 sm:flex-row sm:space-y-0"
      >
        <!--rating -->
        <div class="flex flex-1 flex-col">
          <slot name="iconStar" />

          <div class="text-center text-esl-2 text-[#7E7E7E]">Rating</div>
        </div>
        <!--students -->
        <div class="section flex flex-1 flex-col">
          <div class="text-center text-esl-4">2</div>
          <div class="text-center text-esl-2 text-[#7E7E7E]">Students</div>
        </div>
        <!--lessons -->
        <div class="section flex flex-1 flex-col">
          <div class="text-center text-esl-4">10</div>
          <div class="text-center text-esl-2 text-[#7E7E7E]">Lessons</div>
        </div>
        <!--attendance -->
        <div class="section flex flex-1 flex-col">
          <div class="text-center text-esl-4">100%</div>
          <div class="text-center text-esl-2 text-[#7E7E7E]">Attendance</div>
        </div>
        <!--response -->
        <div class="section flex flex-1 flex-col">
          <div class="text-center text-esl-4">100%</div>
          <div class="text-center text-esl-2 text-[#7E7E7E]">Response</div>
        </div>
      </div>
    </div>
    <!--lessons enumeration section -->
    <div class="mt-8">
      <div class="text-esl-4 text-white font-semibold px-8">
        English Lessons
      </div>
      <LessonList
        bind:showModal={teacherToggleBtn}
        lessons={["Lesson 1", "Lesson 2", "Lesson 3", "Lesson 4"]}
      >
        <div slot="img">
          <slot name="qrCode" />
        </div>
      </LessonList>
    </div>
  </div>
  <div
    class="hidden relative px-0 w-full sm:py-4 sm:block lg:w-5/12 lg:pl-2 lg:py-0"
  >
    <!--insert youtube video here -->
    <div class="pb-[56.67%] w-full relative">
      <iframe
        class="w-full h-full absolute"
        src="https://www.youtube.com/embed/VrP3lO3aGDg"
        title="YouTube video player"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowfullscreen
      />
    </div>
  </div>
</div>

<!--right side -->
<style>
  .line {
    visibility: hidden;
  }
  .show .line {
    visibility: visible;
  }
  .tab-text {
    color: #b6b6b6;
  }
  .show .tab-text {
    color: black;
  }
</style>
