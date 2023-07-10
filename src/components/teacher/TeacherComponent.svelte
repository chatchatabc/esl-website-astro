<script lang="ts">
  import teachersJson from "@data/teachers.json";
  import Favorite from "../common/Favorite.svelte";
  import LessonList from "./LessonList.svelte";
  import ClampText from "../common/ClampText.svelte";

  const teachers = teachersJson.contents;
  export let teacher: (typeof teachers)[number];

  let teacherToggleBtn = false;

  //for tab menu
  let tabIndex: number = 0;
</script>

<!--main container -->
<div class="container block mx-auto lg:flex lg:flex-1 lg:w-10/12">
  <!--left side -->
  <div class="w-full lg:pr-2">
    <!--teacher details section -->
    <div class="">
      <div class="bg-white sm:shadow-lg p-3 md:p-8 lg:p-5">
        <!--nameplate section -->
        <div>
          <div class="flex flex-1">
            <!--teacher image -->
            <div class="px-4 pb-0">
              <slot name="img" />
            </div>

            <div class="flex flex-grow flex-col">
              <!--name,verification and occupation -->
              <div class="flex flex-row flex-grow">
                <div class="flex-grow flex">
                  <div>
                    <div class="flex items-center">
                      <span class="text-esl-3">{teacher.displayName}</span
                      >&nbsp;<slot name="verified" />
                    </div>
                    <div class="text-esl-2 flex font-normal">
                      {teacher.alias}&nbsp;<slot name="rating" />
                    </div>
                  </div>
                </div>
                <!--favorites -->
                <div class="">
                  <Favorite />
                </div>
              </div>
              <!--payrate-->
              <div
                class="flex items-center justify-between sm:justify-end space-x-5"
              >
                <div class="payDefinition">
                  <span class="font-medium">{teacher.price}元</span>
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
          </div>

          <!--reserve button section -->
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
              class="py-4 flex-auto show hidden md:px-4 md:block"
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
              class="py-4 flex-auto hidden md:px-4 md:block"
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
              class="py-4 flex-auto hidden md:px-4 md:block"
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
              class="tab-content md:px-4 space-y-4 pb-4 {tabIndex == 0
                ? 'md:block'
                : 'md:hidden'}"
            >
              <div class="text-esl-2 space-y-2">
                <p class="pr whitespace-pre-wrap">
                  {teacher.aboutMe}
                </p>
              </div>
              <div class="text-esl-3">About Me</div>
              <div class="text-esl-2">
                <div>
                  <div class="relative px-0 w-10/12 mx-auto py-8">
                    <!--insert youtube video here -->
                    <div class="relative">
                      <div class="pb-[56.67%] w-full relative" />
                      <video
                        class="absolute top-0 left-0 w-full h-full"
                        controls
                      >
                        <source
                          src={teacher.introductionVideo}
                          type="video/mp4"
                        />
                        <track kind="captions" />
                      </video>
                    </div>
                  </div>
                  <ClampText>
                    <span>
                      {teacher.videoSubtitle}
                    </span>
                  </ClampText>
                </div>
              </div>
            </div>
            <!--tab 2 content -->

            <div
              class="tab-content md:px-4 space-y-4 pb-4 {tabIndex == 1
                ? 'md:block'
                : 'md:hidden'}"
            >
              <div class="text-esl-3">Me as a teacher</div>
              <div class="text-esl-2">
                <ClampText>
                  <span>{teacher.meAsATeacher}</span>
                </ClampText>
              </div>
            </div>
            <!--tab 3 content -->

            <div
              class="tab-content md:px-4 space-y-4 pb-4 {tabIndex == 2
                ? 'md:block'
                : 'md:hidden'}"
            >
              <div class="text-esl-3">My lessons & Teaching plan</div>
              <div class="text-esl-2">
                <ClampText>
                  <span>
                    {teacher.teachingPlan}
                  </span>
                </ClampText>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!--stats -->
      <div
        class="bg-white flex flex-1 shadow-lg py-4 flex-row border-t-2 border-solid border-t-esl-c-1 sm:my-4 sm:border-t-0"
      >
        <!--rating -->
        <div class="hidden sm:flex flex-1 flex-col">
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
