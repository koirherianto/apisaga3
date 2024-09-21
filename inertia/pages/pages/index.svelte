<script lang="ts">
  import Project from "#models/project"

  export let project : Project;
</script>

<body class="flex"> <!-- Menambahkan class flex pada body -->
  <aside class="flex flex-col w-64 h-screen px-5 py-8 overflow-y-auto bg-white border-r rtl:border-r-0 rtl:border-l dark:bg-gray-900 dark:border-gray-700">
      <h1 class="font-mono underline-offset-auto">{project.title}</h1>
  
      <div class="flex flex-col justify-between flex-1 mt-6">
          <nav class="flex-1 -mx-3 space-y-3"> 
              <a
                  class="flex items-center px-3 py-2 text-gray-600 transition-colors duration-300 transform rounded-lg dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-gray-700"
                  href=""
              >
                  <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      class="w-5 h-5">
                      <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z"
                      />
                  </svg>
  
                  <span class="mx-2 text-sm font-medium">Projects</span>
              </a>
          </nav>
          <div class="mt-6">
            <div class="flex items-center justify-between mt-6">
              <a href="" class="flex items-center gap-x-2">
                  <span class="text-sm font-medium text-gray-700 dark:text-gray-200">
                      <!-- {{ user.name }} --> Nama
                  </span>
              </a>
              <button
                  onclick="handleLogout(); return false;"
                  class="text-gray-500 transition-colors duration-200 rotate-180 dark:text-gray-400 rtl:rotate-0 hover:text-blue-500 dark:hover:text-blue-400"
              >
                  <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      class="w-5 h-5"
                  >
                      <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
                      />
                  </svg>
              </button>
            </div>
          </div>
      </div>
  </aside>
  
  <main class="flex-1 p-8">
      <!-- <slot></slot> -->
  </main>
</body>
